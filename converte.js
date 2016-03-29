// Funcoes de conversao de entrada para personagem.

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  // Limpa tudo antes de comecar.
  PersonagemLimpaGeral();

  gPersonagem.modo_mestre = gEntradas.modo_mestre;
  gPersonagem.modo_visao = gEntradas.modo_visao;
  gPersonagem.nome = gEntradas.nome;
  gPersonagem.raca = gEntradas.raca;
  gPersonagem.template = gEntradas.template || '';
  _ConverteTamanho();

  gPersonagem.alinhamento = gEntradas.alinhamento;
  gPersonagem.divindade = gEntradas.divindade;
  gPersonagem.classes = gEntradas.classes;
  gPersonagem.dominios = gEntradas.dominios || [];
  _ConverteFamiliar();
  gPersonagem.niveis_negativos = gEntradas.niveis_negativos || 0;

  gPersonagem.experiencia = gEntradas.experiencia;

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

  // Estilos tem que vir apos a atualizacao das armas do gPersonagem, talentos e lista de armas.
  _ConverteEstilos();

  _ConverteHabilidadesEspeciais();

  // Feiticos.
  _ConverteFeiticos();

  gPersonagem.notas = gEntradas.notas;
}

// Se o tamanho não estiver definido nas entradas, usa o padrão da raça.
function _ConverteTamanho() {
  if (gEntradas.tamanho != null) {
    gPersonagem.tamanho.categoria = gEntradas.tamanho;
  } else {
    gPersonagem.tamanho.categoria = tabelas_raca[gEntradas.raca].tamanho;
  }
}

function _ConverteDadosVida() {
  gPersonagem.dados_vida.nivel_personagem = 0;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    gPersonagem.dados_vida.nivel_personagem += gPersonagem.classes[i].nivel;
  }
}

function _ConverteFamiliar() {
  var familiar = (gPersonagem.familiar != null)
      ? gPersonagem.familiar : { pontos_vida: { base: 0, bonus: new Bonus(), temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 } };
  if (gEntradas.familiar == null) {
    gPersonagem.familiar = familiar;
    return;
  }
  familiar.em_uso = gEntradas.familiar.em_uso;
  familiar.chave = gEntradas.familiar.chave || '';
  familiar.pontos_vida.temporarios = gEntradas.familiar.temporarios || 0;
  familiar.pontos_vida.ferimentos = gEntradas.familiar.ferimentos || 0;
  familiar.pontos_vida.ferimentos_nao_letais = gEntradas.familiar.ferimentos_nao_letais || 0;
  gPersonagem.familiar = familiar;
}

function _ConvertePontosVida() {
  gPersonagem.pontos_vida.total_dados = gEntradas.pontos_vida;
  gPersonagem.pontos_vida.temporarios = gEntradas.pontos_vida_temporarios;
  gPersonagem.pontos_vida.ferimentos = gEntradas.ferimentos;
  gPersonagem.pontos_vida.ferimentos_nao_letais = gEntradas.ferimentos_nao_letais;
}

function _ConverteEquipamentos() {
  // moedas.
  for (var tipo_moeda in gPersonagem.moedas) {
    gPersonagem.moedas[tipo_moeda] = gEntradas[tipo_moeda];
  }
  // itens, apenas se estiverem definidos.
  for (var tipo_item in tabelas_itens) {
    if (gEntradas[tipo_item] == null) {
      gEntradas[tipo_item] = [];
    }
    var itens_entrada = gEntradas[tipo_item];
    itens_entrada.forEach(function(item_entrada) {
      gPersonagem[tipo_item].push({ chave: item_entrada.chave, em_uso: item_entrada.em_uso });
    });
  }
  // outros.
  gPersonagem.outros_equipamentos = gEntradas.outros_equipamentos;
}

function _ConverteAtributos() {
  for (var i = 0; i < gEntradas.bonus_atributos.length; ++i) {
    gPersonagem.atributos.pontos.gastos.push(gEntradas.bonus_atributos[i]);
  }
  // Calcula os componentes dos atributos.
  for (var atributo in tabelas_atributos) {
    gPersonagem.atributos[atributo].bonus.Adiciona('base', null, gEntradas[atributo]);
  }
}

// Converte os talentos do personagem.
function _ConverteTalentos() {
  for (var chave_classe in gPersonagem.talentos) {
    var lista = gPersonagem.talentos[chave_classe];
    lista.length = 0;
    // Personagens antigos nao tem algumas chaves da tabela de talentos. Eh
    // importante verificar ou vai quebrar.
    for (var i = 0; (chave_classe in gEntradas.talentos) && (i < gEntradas.talentos[chave_classe].length); ++i) {
      var talento_entrada = gEntradas.talentos[chave_classe][i];
      lista.push({
          chave: talento_entrada.chave,
          complemento: talento_entrada.complemento });
    }
  }
}

// Converte todas as pericias. Primeiro calcula o total de pontos e depois varre as gEntradas
// de pericia, computando o valor de cada uma e o numero de pontos disponiveis.
function _ConvertePericias() {
  for (var i = 0; i < gEntradas.pericias.length; ++i) {
    var pericia_personagem = gPersonagem.pericias.lista[gEntradas.pericias[i].chave];
    pericia_personagem.pontos = gEntradas.pericias[i].pontos;
    pericia_personagem.complemento = 'complemento' in gEntradas.pericias[i] ? gEntradas.pericias[i].complemento : '';
  }
}

// Converte a lista de armaduras do personagem.
function _ConverteListaArmaduras() {
  gPersonagem.armaduras.length = 0;
  for (var i = 0; i < gEntradas.armaduras.length; ++i) {
    var armadura_personagem = ConverteArmadura(gEntradas.armaduras[i]);
    gPersonagem.armaduras.push(armadura_personagem);
  }
  gPersonagem.escudos.length = 0;
  for (var i = 0; i < gEntradas.escudos.length; ++i) {
    var escudo_personagem = ConverteEscudo(gEntradas.escudos[i]);
    gPersonagem.escudos.push(escudo_personagem);
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
    material: armadura_entrada.material,
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
    material: escudo_entrada.material,
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
  gPersonagem.armas.length = 1;
  for (var i = 0; i < gEntradas.armas.length; ++i) {
    gPersonagem.armas.push(ConverteArma(gEntradas.armas[i]));
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
    material: arma_entrada.material,
    bonus: arma_entrada.bonus,
    obra_prima: arma_entrada.obra_prima
  };
  return arma_personagem;
}

function _ConverteEstilos() {
  for (var i = 0; i < gEntradas.estilos_luta.length; ++i) {
    gPersonagem.estilos_luta.push(_ConverteEstilo(gEntradas.estilos_luta[i]));
  }
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

function _ConverteHabilidadesEspeciais() {
  for (var chave_especial in gEntradas.habilidades_especiais) {
    var entrada_especial = gEntradas.habilidades_especiais[chave_especial];
    var personagem_especial = gPersonagem.especiais[chave_especial] || {};
    personagem_especial.vezes = entrada_especial.length;
    var usados = 0;
    for (var i = 0; i < entrada_especial.length; ++i) {
      if (entrada_especial[i]) {
        ++usados;
      }
    }
    personagem_especial.usado = usados;
  }
}

// Converte todos os feiticos do personagem.
function _ConverteFeiticos() {
  _ConverteEscolasProibidas();
  _ConverteFeiticosConhecidos();
  _ConverteFeiticosSlots();
}

function _ConverteEscolasProibidas() {
  for (var chave_classe in gEntradas.escolas_proibidas) {
    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    feiticos_classe.escolas_proibidas = gEntradas.escolas_proibidas[chave_classe].slice(0);
  }
}

// Cada entrada possui classe, nivel, indice e feitico. Esta funcao le todas as entradads
// e as coloca no personagem se, e somente se, o objeto de feitico possuir todos esses atributos.
function _ConverteFeiticosConhecidos() {
  for (var chave_classe in gEntradas.feiticos_conhecidos) {
    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    for (var nivel in gEntradas.feiticos_conhecidos[chave_classe]) {
      gEntradas.feiticos_conhecidos[chave_classe][nivel].forEach(function(feitico) {
        feiticos_classe.conhecidos[nivel].push(feitico);
      });
    }
  }
}

function _ConverteFeiticosSlots() {
  for (var chave_classe in gEntradas.slots_feiticos) {
    // Converte os slots de feitiços normais.
    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    var possui_dominio = tabelas_feiticos[chave_classe].possui_dominio;
    var possui_especializacao = 'escola_especializada' in tabelas_feiticos[chave_classe];
    for (var nivel in gEntradas.slots_feiticos[chave_classe]) {
      var ultimo = gEntradas.slots_feiticos[chave_classe][nivel].length - 1;
      gEntradas.slots_feiticos[chave_classe][nivel].forEach(function(entrada_feitico, indice) {
        var slots_classe_nivel = feiticos_classe.slots[nivel];
        var slot_feitico = {
            nivel_conhecido: entrada_feitico.nivel,
            indice_conhecido: entrada_feitico.indice,
            gasto: entrada_feitico.gasto };
        if (indice == ultimo && ((possui_dominio && nivel > 0) || possui_especializacao)) {
          if (possui_dominio) {
            slots_classe_nivel.feitico_dominio = slot_feitico;
          } else if (possui_especializacao) {
            slots_classe_nivel.feitico_especializado = slot_feitico;
          }
        } else {
          slots_classe_nivel.feiticos.push(slot_feitico);
        }
      });
    }
    // Converte os feitiços de domínio da classe (se houver).
    if ('slots_feiticos_dominio' in gEntradas) {
      for (var nivel in gEntradas.slots_feiticos_dominio[chave_classe]) {
        var entrada_feitico = gEntradas.slots_feiticos_dominio[chave_classe][nivel];
        var slots_classe_nivel = feiticos_classe.slots[nivel];
        slots_classe_nivel.feitico_dominio = {
          nivel_conhecido: entrada_feitico.nivel,
          indice_conhecido: entrada_feitico.indice,
          gasto: entrada_feitico.gasto };
      }
    }
    if ('slots_feiticos_especializados' in gEntradas) {
      // Converte os feitiços de especialista (se houver).
      for (var nivel in gEntradas.slots_feiticos_especializados[chave_classe]) {
        var entrada_feitico = gEntradas.slots_feiticos_especializados[chave_classe][nivel];
        var slots_classe_nivel = feiticos_classe.slots[nivel];
        slots_classe_nivel.feitico_especializado = {
          nivel_conhecido: entrada_feitico.nivel,
          indice_conhecido: entrada_feitico.indice,
          gasto: entrada_feitico.gasto };
      }
    }
  }
}
