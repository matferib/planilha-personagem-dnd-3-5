// Funcoes de conversao de entrada para personagem.

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  // Limpa tudo antes de comecar.
  _LimpaGeral();

  personagem.modo_mestre = entradas.modo_mestre;
  personagem.nome = entradas.nome;
  personagem.raca = entradas.raca;
  personagem.tamanho.categoria =
      tabelas_raca[personagem.raca].tamanho;
  personagem.tamanho.modificador_ataque_defesa =
      tabelas_tamanho[personagem.tamanho.categoria].ataque_defesa;

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

  _ConverteArmadurasEscudos();
  _ConverteListaArmas();

  // Estilos tem que vir apos a atualizacao das armas do personagem, talentos e lista de armas.
  _ConverteEstilos();

  // Feiticos.
  _ConverteFeiticos();

  personagem.notas = entradas.notas;
}

// Limpa tudo antes de comecar a conversao. 
function _LimpaGeral() {
  personagem.pontos_vida.total = 0;
  personagem.pontos_vida.bonus.Limpa();
  personagem.ca.bonus.Limpa();
  personagem.iniciativa.Limpa();
  for (var i = 0; i < personagem.pericias.lista.length; ++i) {
    personagem.pericias.lista[i].bonus.Limpa();
  }
  for (var chave_classe in personagem.feiticos) {
    for (var i = 0; i <= 9; ++i) {
      personagem.feiticos[chave_classe].conhecidos[i].length = 0;
      personagem.feiticos[chave_classe].slots[i].feiticos.length = 0;
      personagem.feiticos[chave_classe].slots[i].feitico_dominio = null;
    }
  }
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
  personagem.aneis = entradas.aneis;
  // outros.
  personagem.outros_equipamentos = entradas.outros_equipamentos;
}

function _ConverteArmadurasEscudos() {
  personagem.armadura = entradas.armadura;
  personagem.escudo = entradas.escudo;
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
  var talentos_gerais_por_nivel = 
      1 + Math.floor(personagem.dados_vida.nivel_personagem / 3);
  if (tabelas_raca[personagem.raca].talento_extra) {
    ++talentos_gerais_por_nivel;
  }
  var lista_gerais = personagem.talentos['gerais'];
  // Talentos normais.
  lista_gerais.length = talentos_gerais_por_nivel;
  for (var i = 0; i < lista_gerais.length; ++i) {
    _ConverteTalento(
        (i < entradas.talentos['gerais'].length) ? 
            entradas.talentos['gerais'][i] : 
            { chave: 'usar_armas_simples', complemento: null }, 
        i, 
        lista_gerais);
  }

  // Talentos de guerreiro.
  var nivel_guerreiro = PersonagemNivelClasse('guerreiro');
  var lista_guerreiro = personagem.talentos['guerreiro'];
  if (nivel_guerreiro > 0) {
    lista_guerreiro.length = 1 + Math.floor(nivel_guerreiro / 2);
    for (var i = 0; i < lista_guerreiro.length; ++i) {
      _ConverteTalento(
          i < entradas.talentos['guerreiro'].length ? 
              entradas.talentos['guerreiro'][i] : 
              { chave: 'iniciativa_aprimorada', complemento: null }, 
          i, 
          lista_guerreiro);
    }
  } else {
    lista_guerreiro.length = 0;
  }
}

// Converte o talento de indice 'indice_talento'. Cria o mesmo se nao existir na lista.
// @param talento_entrada o talento lido na entrada.
// @param indice_talento o indice do talento na lista de talentos.
function _ConverteTalento(talento_entrada, indice_talento, lista) {
  if (lista[indice_talento] == null) {
    lista[indice_talento] = {};
  }
  var talento_personagem = lista[indice_talento];
  var chave_talento = talento_entrada.chave;
  talento_personagem.chave = chave_talento;
  talento_personagem.complemento = talento_entrada.complemento;
}

// Converte todas as pericias. Primeiro calcula o total de pontos e depois varre as entradas
// de pericia, computando o valor de cada uma e o numero de pontos disponiveis.
function _ConvertePericias() {
  for (var i = 0; i < entradas.pericias.length; ++i) {
    personagem.pericias.lista[entradas.pericias[i].chave].pontos =
        entradas.pericias[i].pontos;
  }
}

// Converte a lista de armas do personagem.
function _ConverteListaArmas() {
  personagem.armas = [];
  // entrada fake para desarmado.
  var entrada_desarmado = {
    chave: 'desarmado', 
    nome_gerado: 'desarmado', 
    obra_prima: false, 
    bonus: 0
  };
  personagem.armas.push(_ConverteArma(entrada_desarmado));
  for (var i = 0; i < entradas.armas.length; ++i) {
    personagem.armas.push(_ConverteArma(entradas.armas[i]));
  }
}

// Converte uma arma da entrada para personagem.
// @return a arma convertida.
function _ConverteArma(arma_entrada) {
  var arma_tabela = tabelas_armas[arma_entrada.chave];
  var arma_personagem = {};
  arma_personagem.arma_tabela = arma_tabela;
  // O nome da entrada eh apenas um indice na tabela de armas.
  arma_personagem.entrada = {
    chave: arma_entrada.chave, 
    bonus: arma_entrada.bonus, 
    obra_prima: arma_entrada.obra_prima
  };
  return arma_personagem;
}

function _ConverteEstilos() {
  personagem.estilos_luta = [];
  for (var i = 0; i < entradas.estilos_luta.length; ++i) {
    personagem.estilos_luta.push(_ConverteEstilo(entradas.estilos_luta[i]));
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
      slots_classe_nivel.feiticos[entrada_feitico.indice].push(feitico_slot);
    }
  }
}
