// Funcoes de conversao de entrada para personagem.

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  // Limpa tudo antes de comecar.
  LimpaGeral();

  personagem.modo_mestre = entradas.modo_mestre;
  personagem.nome = entradas.nome;
  personagem.raca = entradas.raca;

  personagem.alinhamento = entradas.alinhamento;
  personagem.classes = entradas.classes;

  personagem.experiencia = entradas.experiencia;

  // Equipamentos podem afetar todo o resto.
  _ConverteEquipamentos();

  // Dados de vida afetam quase tudo.
  _ConverteDadosVida();

  // Atributos dependem dos dados de vida (incrementos).
  _ConverteAtributos();

  // Talentos dependem dos dados de vida.
  _ConverteTalentos();

  _ConvertePontosVida();
  
  // Tem que ser depois de conferir pre requisitos.
  _ConvertePericias();

  _ConverteListaArmas();
  _ConverteListaArmaduras();

  // Estilos tem que vir apos a atualizacao das armas do personagem, talentos e lista de armas.
  _ConverteEstilos();

  _ConverteHabilidades();

  // Feiticos.
  _ConverteFeiticos();

  personagem.notas = entradas.notas;
}

// Limpa tudo antes de comecar a conversao. 
function LimpaGeral() {
  personagem.pontos_vida.total = 0;
  personagem.pontos_vida.bonus.Limpa();
  personagem.ca.bonus.Limpa();
  personagem.iniciativa.Limpa();
  for (var i = 0; i < personagem.pericias.lista.length; ++i) {
    personagem.pericias.lista[i].bonus.Limpa();
  }
  for (var chave_classe in personagem.feiticos) {
    personagem.feiticos[chave_classe].em_uso = false;
    for (var i = 0; i <= 9; ++i) {
      personagem.feiticos[chave_classe].conhecidos[i].length = 0;
      personagem.feiticos[chave_classe].slots[i].feiticos.length = 0;
      personagem.feiticos[chave_classe].slots[i].feitico_dominio = null;
    }
  }
  personagem.estilos_luta.length = 0;
  personagem.habilidades = {};
}

function _ConverteDadosVida() {
  personagem.dados_vida.nivel_personagem = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
    personagem.dados_vida.nivel_personagem += personagem.classes[i].nivel;
  }
}

function _ConvertePontosVida() {
  personagem.pontos_vida.total_dados = entradas.pontos_vida;
  personagem.pontos_vida.ferimentos = entradas.ferimentos;
}

function _ConverteEquipamentos() {
  // moedas.
  for (var tipo_moeda in personagem.moedas) {
    personagem.moedas[tipo_moeda] = entradas[tipo_moeda];
  }
  // itens, apenas se estiverem definidos.
  for (var tipo_item in tabelas_itens) {
    if (entradas[tipo_item] == null) {
      entradas[tipo_item] = [];
    }
    personagem[tipo_item] = entradas[tipo_item];
  }
  // outros.
  personagem.outros_equipamentos = entradas.outros_equipamentos;
}

function _ConverteAtributos() {
  for (var i = 0; i < entradas.bonus_atributos.length; ++i) {
    personagem.atributos.pontos.gastos.push(entradas.bonus_atributos[i]);
  }
  // Calcula os componentes dos atributos.
  for (var atributo in tabelas_atributos) {
    personagem.atributos[atributo].base = entradas[atributo];
  }
}

// Converte os talentos do personagem.
function _ConverteTalentos() {
  for (var chave_classe in personagem.talentos) {
    var lista = personagem.talentos[chave_classe];
    lista.length = 0;
    for (var i = 0; i < entradas.talentos[chave_classe].length; ++i) {
      var talento_entrada = entradas.talentos[chave_classe][i];
      lista.push({
          chave: talento_entrada.chave,
          complemento: talento_entrada.complemento });
    }
  }
}

// Converte todas as pericias. Primeiro calcula o total de pontos e depois varre as entradas
// de pericia, computando o valor de cada uma e o numero de pontos disponiveis.
function _ConvertePericias() {
  for (var i = 0; i < entradas.pericias.length; ++i) {
    personagem.pericias.lista[entradas.pericias[i].chave].pontos =
        entradas.pericias[i].pontos;
  }
}

// Converte a lista de armaduras do personagem. Nunca se deve apagar
// a primeira entrada (nenhuma armadura e nenhum escudo).
function _ConverteListaArmaduras() {
  personagem.armaduras.length = 1;
  for (var i = 0; i < entradas.armaduras.length; ++i) {
    var armadura_personagem = ConverteArmadura(entradas.armaduras[i]);
    personagem.armaduras.push(armadura_personagem);
  }
  personagem.escudos.length = 1;
  for (var i = 0; i < entradas.escudos.length; ++i) {
    var escudo_personagem = ConverteEscudo(entradas.escudos[i]);
    personagem.escudos.push(escudo_personagem);
  }

}

// Converte uma armadura. Exportada porque dependencias usa para criar as 
// armaduras fake.
function ConverteArmadura(armadura_entrada) {
  var armadura_tabela = tabelas_armaduras[armadura_entrada.chave];
  var armadura_personagem = {};
  // O nome da entrada eh apenas um indice na tabela de armas.
  armadura_personagem.entrada = {
    chave: armadura_entrada.chave, 
    bonus: armadura_entrada.bonus, 
    // Se é magica, também é obra prima.
    obra_prima: armadura_entrada.bonus > 0 ? 
        true : armadura_entrada.obra_prima,
    em_uso: armadura_entrada.em_uso,
  };
  return armadura_personagem;
}

// Converte um escudo. Usada nas dependencias.
function ConverteEscudo(escudo_entrada) {
  var escudo_tabela = tabelas_escudos[escudo_entrada.chave];
  var escudo_personagem = {};
  // O nome da entrada eh apenas um indice na tabela de armas.
  escudo_personagem.entrada = {
    chave: escudo_entrada.chave, 
    bonus: escudo_entrada.bonus, 
    // Se é magico, também é obra prima.
    obra_prima: escudo_entrada.bonus > 0 ? 
        true : escudo_entrada.obra_prima,
    em_uso: escudo_entrada.em_uso,
  };
  return escudo_personagem;
}

// Converte a lista de armas do personagem.
// 
function _ConverteListaArmas() {
  // Tem que manter sempre a primeira arma imutavel (desarmado).
  // A mesma coisa ocorre no atualiza, a arma nao eh mostrada para
  // evitar inconsistencias.
  personagem.armas.length = 1;
  for (var i = 0; i < entradas.armas.length; ++i) {
    personagem.armas.push(ConverteArma(entradas.armas[i]));
  }
}

// Converte uma arma da entrada para personagem. 
// Exportada para gerar a entrada desarmado.
// @return a arma convertida.
function ConverteArma(arma_entrada) {
  var arma_tabela = tabelas_armas[arma_entrada.chave];
  var arma_personagem = {};
  // O nome da entrada eh apenas um indice na tabela de armas.
  arma_personagem.entrada = {
    chave: arma_entrada.chave, 
    bonus: arma_entrada.bonus, 
    obra_prima: arma_entrada.obra_prima
  };
  return arma_personagem;
}

function _ConverteEstilos() {
  for (var i = 0; i < entradas.estilos_luta.length; ++i) {
    personagem.estilos_luta.push(_ConverteEstilo(entradas.estilos_luta[i]));
  }
}

function _ConverteHabilidades() {
}

// Converte um estilo da entrada para o personagem.
function _ConverteEstilo(estilo_entrada) {
  var estilo_personagem = { 
    nome: estilo_entrada.nome,
    arma_primaria: { 
      nome: estilo_entrada.arma_primaria,
      bonus_por_categoria: {}
    },
    arma_secundaria: {
      nome: estilo_entrada.arma_secundaria,
      bonus_por_categoria: {}
    },
  };
  return estilo_personagem;
}

// Converte todos os feiticos do personagem.
function _ConverteFeiticos() {
  _ConverteFeiticosConhecidos();
  _ConverteFeiticosSlots();
}

// Cada entrada possui classe, nivel, indice e feitico. Esta funcao le todas as entradads
// e as coloca no personagem se, e somente se, o objeto de feitico possuir todos esses atributos.
function _ConverteFeiticosConhecidos() {
  for (var i = 0; i < entradas.feiticos.conhecidos.length; ++i) {
    var entrada_feitico = entradas.feiticos.conhecidos[i];
    var feiticos_classe = personagem.feiticos[entrada_feitico.classe];
    feiticos_classe.conhecidos[entrada_feitico.nivel].push(entrada_feitico.feitico);
  }
}

function _ConverteFeiticosSlots() {
  for (var i = 0; i < entradas.feiticos.slots.length; ++i) {
    var entrada_feitico = entradas.feiticos.slots[i];
    var feiticos_classe = personagem.feiticos[entrada_feitico.classe];
    var slots_classe_nivel = feiticos_classe.slots[entrada_feitico.nivel];
    var feitico_slot = {
        nome: entrada_feitico.feitico,
        gasto: entrada_feitico.gasto };

    if (entrada_feitico.indice == 'dom') {
      slots_classe_nivel.feitico_dominio = feitico_slot;
    } else {
      slots_classe_nivel.feiticos.push(feitico_slot);
    }
  }
}
