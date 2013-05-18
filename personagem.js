// Apenas os dados do personagem e funcoes de conversao de entrada para personagem.
var personagem = {
  modo_visao: 'completo',
  modo_mestre: false,
  nome: '',
  raca: 'humano',
  tamanho: { categoria: 'medio', modificador_ataque_defesa: 0, modificador_agarrar: 0 }, 
  alinhamento: '',
  experiencia: 0,
  divindade: '',
  // Cada entrada: { classe, nivel }.
  classes: [
      { classe: 'guerreiro', nivel: 1 },
  ],
  // TODO remover dados de vida do pontos de vida e usar este.
  dados_vida: {
    nivel_personagem: 0,  // nivel efetivo do personagem.
    //dados: [],  // cada dado de vida rolado.
  },
  pontos_vida: {
    total_dados: 0,  // total dos dados de pontos de vida.
    bonus: new Bonus(), // outros bonus.
    total: 0,  // soma dos dados mais bonus.
    ferimentos: 0,  // ferimentos do personagem TODO(transformar em array)
    temporarios: 0,  // pontos de vida temporarios
  },
  // O valor do atributo é o valor final dados todos os modificadores. O modificador
  // é computado sobre esse valor.
  atributos: {
    pontos: {
      disponiveis: 0,
      gastos: [],  // cada entrada, um atributo
    },
    forca: { 
      base: 10,
      bonus_nivel: 0,
      racial: 0,
      valor: 10,
      modificador: 0
    },  
    destreza: {
      base: 10, 
      bonus_nivel: 0,
      racial: 0,
      valor: 10,
      modificador: 0
    },  
    constituicao: { 
      base: 10, 
      bonus_nivel: 0,
      racial: 0,
      valor: 10,
      modificador: 0
    },  
    inteligencia: { 
      base: 10, 
      bonus_nivel: 0,
      racial: 0,
      valor: 10,
      modificador: 0
    },  
    sabedoria: { 
      base: 10, 
      bonus_nivel: 0,
      racial: 0,
      valor: 10,
      modificador: 0
    },  
    carisma: { 
      base: 10, 
      bonus_nivel: 0,
      racial: 0,
      valor: 10,
      modificador: 0
    }
  },
  iniciativa: new Bonus(),
  bba: 1,
  bba_cac: 1,  // inclui tamanho e forca.
  bba_cac_acuidade: 1,  // inclui tamanho e destreza.
  bba_distancia: 1,  // inclui tamanho e destreza.
  agarrar: 1,
  numero_ataques: 1,
  // talentos
  talentos: {  
    // Algumas classes ganham talentos especificos.
    // Gerais sao talentos normais, sem serem de classes especificas.
    // TODO outras classes.
    // Cada talento: { chave, complemento }
    gerais: [], 
    guerreiro: [], 
    mago: [], 
    monge: [],
  },
  // pericias.
  pericias: {
    // Quantos pontos o personagem pode gastar.
    total_pontos: 8,
    // Quantos ele ja gastou.
    pontos_gastos: 0,
    // Cada entrada:
    // chave_pericia: { pontos, graduacoes, bonus, de_classe, total }.
    // pontos sao os pontos gastos, graduacoes sao os pontos modificados
    // de acordo com a pericia ser de classe ou nao.
    lista: {},
  },
  // Cada entrada: { nome, 
  //                 arma_primaria: {  nome, 
  //                                   bonus_por_categoria: { categoria: { ataque, dano }, ... } ] }, 
  //                 arma_secundaria: { idem }, }.
  // A categoria pode ser cac, cac_leve, cac_duas_maos, distancia, arremesso...
  estilos_luta: [],
  ca: { 
      normal: 10, surpreso: 10, toque: 10,
      bonus: new Bonus(),
  },
  // As habilidades especiais do personagem de acordo com a classe e raca. Cada entrada:
  // chave_habilidade: { vezes, complemento }
  especiais: {
  },
  salvacoes: {
    fortitude: new Bonus(),
    reflexo: new Bonus(),
    vontade: new Bonus(),
    // Outras salvacoes.
  },
  // Lista de armas que o personagem eh proficiente.
  // Cada entrada: { nome: true }, onde nome eh o nome da chave. So a presenca do campo eh
  // suficiente para indicar proficiencia, sem necessidade de um booleano.
  proficiencia_armas: {},
  // Cada entrada: { chave_arma: 1|2 }.
  foco_armas: {},
  // Cada entrada: { chave_arma: 2|4 }.
  especializacao_armas: {},
  // Cada entrada: 
  //     { entrada: { chave, bonus, obra_prima }, nome_gerado, bonus_ataque, bonus_dano, 
  //       proficiente, foco, especializado, acuidade, arma_tabela };
  // O nome_gerado junta o nome com OP ou o bonus. Por exemplo, espada longa +1.
  // Sempre havera um ataque desarmado aqui.
  armas: [],
  // Armadura: aponta para a armadura que estiver sendo usada.
  armadura: null, 
  // Cada entrada:
  //      entrada: { chave, obra_prima, bonus, em_uso }, nome_gerado.
  armaduras: [],
  // Aponta para um dos escudos.
  escudo: null, 
  // Cada entrada:
  //      entrada: { chave, obra_prima, bonus }, nome_gerado.
  escudos: [],
  elmo: '',
  // TODO: passar pra dentro de itens?
  // Cada entrada { chave, em_uso }
  aneis: [],
  amuletos: [],
  pocoes: [],
  capa: '',
  botas: '',

  // Valor pode ser qualquer coisa.
  outros_equipamentos: '',
  // Feiticos. As chaves sao criadas no carregamento. Cada entrada: 
  // chave_classe: { 
  //   atributo_chave, 
  //   em_uso,  // se o personagem utiliza feiticos da classe.
  //   conhecidos: { 0: [], ..., 9 },
  //   slots: { 
  //       0: { base, bonus_atributo, cd, 
  //            feiticos: [ { nome, gasto} ], 
  //            feitico_dominio: {nome, gasto}  }, 
  //       1: ...} }
  feiticos: {},
  // Feiticos conhecidos pelo personagem, por classe:
  // chave_classe: {
  //   0: [ { nome, descricao } ],
  //   ...
  //   9: [ { nome, descricao } ],
  // }
  grimorio: {},
  moedas: { platina: 0, ouro: 0, prata: 0, cobre: 0 },

  notas: '',
};

// Limpa tudo antes de comecar a conversao das entradas para o personagem. 
function PersonagemLimpaGeral() {
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
  for (var tipo_salvacao in personagem.salvacoes) {
    if (tipo_salvacao in { fortitude: '', reflexo: '', vontade: '' }) {
      personagem.salvacoes[tipo_salvacao].Limpa();
    } else {
      delete personagem.salvacoes[tipo_salvacao];
    }
  }
}


// Qualquer inicializacao do personagem eh feita aqui.
function IniciaPersonagem() {
  // entradas padroes para armas, armaduras e escudos.
  personagem.armas.push(ConverteArma({
    chave: 'desarmado',
    nome_gerado: 'desarmado',
    obra_prima: false,
    bonus: 0
  }));
}

// Encontra uma arma do personagem pelo nome gerado.
// @return a arma do personagem.
function ArmaPersonagem(nome_gerado) {
  for (var i = 0; i < personagem.armas.length; ++i) {
    var arma = personagem.armas[i];
    if (arma.nome_gerado == nome_gerado) {
      return arma;
    }
  }
  return null;
}

// @return true se o personagem for proficiente com uma arma.
function PersonagemProficienteComArma(nome_arma) {
  // Verifica lista de armas.
  return personagem.proficiencia_armas[nome_arma] != null;
}

// @return o valor do foco do personagem com a arma (0, 1, 2).
// @param nome_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemFocoComArma(chave_arma) {
  return personagem.foco_armas[chave_arma];
}

// @return o valor da especialização do personagem com a arma (0, 2, 4).
// @param chave_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemEspecializacaoComArma(chave_arma) {
  return personagem.especializacao_armas[chave_arma];
}

// @param nome_talento nome do talento na tabela ou chave na tabela.
// @param complemento alguns talentos precisam de um complemento. Por exemplo,
//        conhecimento (complemento), usar_arma_comum (complemento).
// @return true se o personagem tiver o talento passado.
function PersonagemPossuiTalento(nome_talento, complemento) {
  for (var chave_classe in personagem.talentos) {
    for (var i = 0; i < personagem.talentos[chave_classe].length; ++i) {
      if (_TalentoIgual(personagem.talentos[chave_classe][i], 
                        nome_talento, complemento)) {
        return true;
      }
    }
  }
  return false;
}

function _TalentoIgual(talento_personagem, nome_talento, complemento) {
  var chave_talento = talento_personagem.chave;
  if (tabelas_talentos[chave_talento] == null) {
    return false;
  }
  if (nome_talento == chave_talento ||
      nome_talento == tabelas_talentos[chave_talento].nome) {
    // TODO ver essa logica de complemento com calma.
    if (tabelas_talentos[chave_talento].complemento && 
        talento_personagem.complemento && complemento) {
      // Trata complemento se houver.
      if (talento_personagem.complemento == complemento) {
        return true;
      }
    } else {
      return true;
    }
  }
}

// @return true se o personagem possuir uma das classes passadas.
// @param classes array de classe.
function PersonagemPossuiUmaDasClasses(classes) {
  for (var i = 0; i < personagem.classes.length; ++i) {
    for (var j = 0; j < classes.length; ++j) {
      if (classes[j] == personagem.classes[i].classe) {
        return true;
      }
    }
  }
  return false;
}

// @return o nivel do personagem na classe passada, zero se nao possuir.
function PersonagemNivelClasse(classe) {
  for (var i = 0; i < personagem.classes.length; ++i) {
    if (personagem.classes[i].classe == classe) {
      return personagem.classes[i].nivel;
    }
  }
  return 0;
}

// Verifica se o personagem atende aos requisitos do talento. Caso não atenda, 
// alertará uma mensagem.
// @return descricao do erro caso a verificação falhe, null caso contrário.
function PersonagemVerificaPrerequisitosTalento(chave_talento, complemento) {
  var requisitos = tabelas_talentos[chave_talento].requisitos;
  var prefixo_erro = tabelas_talentos[chave_talento].nome + ' requer ';
  if (requisitos == null) {
    return null;
  }
  if (requisitos.bba) {
    if (personagem.bba < requisitos.bba) {
      return (prefixo_erro + 'BBA >= ' + requisitos.bba);
    }
  }
  if (requisitos.nivel && 
      personagem.dados_vida.nivel_personagem < requisitos.nivel) {
    return (prefixo_erro + 'nível >= ' + requisitos.nivel);
  }
  for (var atributo in requisitos.atributos) {
    if (personagem.atributos[atributo].valor < requisitos.atributos[atributo]) {
      return (prefixo_erro + atributo + ' >= ' + requisitos.atributos[atributo]);
    }
  }
  for (var classe in requisitos.nivel) {
    if (PersonagemNivelClasse(classe) < requisitos.nivel[classe]) {
      return (prefixo_erro + 'nivel em ' + classe + ' >= ' + requisitos.nivel[classe]);
    }
  }
  for (var i = 0; requisitos.talentos && i < requisitos.talentos.length; ++i) {
    if (!PersonagemPossuiTalento(requisitos.talentos[i], complemento)) {
      return (prefixo_erro + 'talento ' + tabelas_talentos[requisitos.talentos[i]].nome + ' ' +
             (complemento ? complemento : ''));
    }
  }
  if (requisitos.proficiencia_arma && complemento && complemento.length > 0) {
    var chave_arma = tabelas_armas_invertida[complemento];
    if (!PersonagemProficienteComArma(chave_arma)) {
      return (prefixo_erro + 'proficiencia com ' + complemento);
    }
  }
  return null;
}

// Adiciona ferimentos ao personagem.
function PersonagemAdicionarFerimentos(valor) {
  personagem.pontos_vida.ferimentos += valor;
  if (personagem.pontos_vida.ferimentos < 0) {
    personagem.pontos_vida.ferimentos = 0;
  }
}

// @TODO fazer a conversao de um tipo para outro.
// Adiciona moedas ao personagem. Valores podem ser negativos.
// O personagem nunca pode ficar com moedas negativas, neste caso
// a funcao nao fara nada.
// @param moedas um objeto contendo { ouro, platina, prata, cobre}
// @return true se foi possivel adicionar as moedas.
function PersonagemAdicionarMoedas(moedas) {
  // verifica fundos.
  for (var tipo_moeda in moedas) {
    if (personagem.moedas[tipo_moeda] + moedas[tipo_moeda] < 0) {
      return false;
    }
  }

  for (var tipo_moeda in moedas) {
    personagem.moedas[tipo_moeda] += moedas[tipo_moeda];
  }
  return true;
}

// @return a string de dados de vida do personagem.
function PersonagemStringDadosVida() {
  var primeiro = true;  // primeira classe nao eh sinalizada.
  var string_dados_vida = '';
  for (var i = 0; i < personagem.classes.length; ++i) {
      if (primeiro) {
        primeiro = false;
      } else {
        string_dados_vida += ' +';
      }
      string_dados_vida += 
        personagem.classes[i].nivel + 'd' + tabelas_classes[personagem.classes[i].classe].dados_vida;
  }
  if (personagem.atributos.constituicao.modificador > 0) {
    string_dados_vida += 
      ' +' + (personagem.atributos.constituicao.modificador * personagem.dados_vida.nivel_personagem);
  }
  return string_dados_vida;
}
