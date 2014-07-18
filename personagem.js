// Apenas os dados do personagem e funcoes de conversao de entrada para personagem.
var gPersonagem = {
  modo_visao: 'completo',
  modo_mestre: false,
  nome: '',
  raca: 'humano',
  template: '',
  tamanho: { categoria: 'medio', modificador_ataque_defesa: 0, modificador_agarrar: 0 },
  alinhamento: '',
  experiencia: 0,
  divindade: '',
  // Cada entrada: { classe, nivel, nivel_conjurador }.
  classes: [
      { classe: 'guerreiro', nivel: 1, nivel_conjurador: 0 },
  ],
  niveis_negativos: 0,
  // TODO remover dados de vida do pontos de vida e usar este.
  dados_vida: {
    nivel_personagem: 0,  // nivel efetivo do personagem.
    //dados: [],  // cada dado de vida rolado.
  },
  pontos_vida: {
    total_dados: 0,  // total dos dados de pontos de vida.
    bonus: new Bonus(), // outros bonus.
    total: 0,  // soma dos dados mais bonus.
    ferimentos: 0,  // ferimentos do personagem TODO(transformar em array). Valores devem ser >= 0.
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
      bonus: new Bonus(),
      modificador: 0
    },
    destreza: {
      bonus: new Bonus(),
      modificador: 0
    },
    constituicao: {
      bonus: new Bonus(),
      modificador: 0
    },
    inteligencia: {
      bonus: new Bonus(),
      modificador: 0
    },
    sabedoria: {
      bonus: new Bonus(),
      modificador: 0
    },
    carisma: {
      bonus: new Bonus(),
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
  // chave_habilidade: { vezes, usado, complemento }
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
  capas: [],
  botas: '',

  // Valor pode ser qualquer coisa.
  outros_equipamentos: '',
  // Feiticos. As chaves sao criadas no carregamento. Cada entrada:
  // TODO transformar a CD em Bonus para poder ter mouse over.
  // chave_classe: {
  //   atributo_chave,
  //   em_uso,  // se o personagem utiliza feiticos da classe.
  //   conhecidos: { 0: [], ..., 9: [] },
  //   nivel_maximo,  // nivel de feitico mais alto para a classe.
  //   escolas_proibidas: ['nome_escola', ...],
  //   especializacao: 'nome_escola',
  //   slots: {
  //       0: { base, bonus_atributo, cd,
  //            feiticos: [ { nivel_conhecido, indice_conhecido, gasto } ], // o indice eh referente aos conhecidos.
  //            feitico_dominio: {nome, gasto},
  //            feitico_escola: {nome, gasto} },
  //       1: ...} }
  feiticos: {},
  moedas: { platina: 0, ouro: 0, prata: 0, cobre: 0 },

  notas: '',
};

// Limpa dependencias antes de comecar a conversao das entradas para o personagem. Tambem chamada na geracao de personagens.
function PersonagemLimpaGeral() {
  gPersonagem.pontos_vida.total = 0;
  gPersonagem.pontos_vida.bonus.Limpa();
  gPersonagem.ca.bonus.Limpa();
  gPersonagem.iniciativa.Limpa();
  gPersonagem.atributos.pontos.gastos.disponiveis = 0;
  gPersonagem.atributos.pontos.gastos.length = 0;
  for (var atributo in tabelas_atributos) {
    gPersonagem.atributos[atributo].bonus.Limpa();
  }
  for (var i = 0; i < gPersonagem.pericias.lista.length; ++i) {
    gPersonagem.pericias.lista[i].bonus.Limpa();
  }
  for (var chave_classe in gPersonagem.feiticos) {
    gPersonagem.feiticos[chave_classe].em_uso = false;
    gPersonagem.feiticos[chave_classe].nivel_maximo = 0;
    for (var i = 0; i <= 9; ++i) {
      gPersonagem.feiticos[chave_classe].conhecidos[i].length = 0;
      gPersonagem.feiticos[chave_classe].slots[i].feiticos.length = 0;
      gPersonagem.feiticos[chave_classe].slots[i].feitico_dominio = null;
    }
  }
  gPersonagem.estilos_luta.length = 0;
  for (var tipo_salvacao in gPersonagem.salvacoes) {
    if (tipo_salvacao in { fortitude: '', reflexo: '', vontade: '' }) {
      gPersonagem.salvacoes[tipo_salvacao].Limpa();
    } else {
      delete gPersonagem.salvacoes[tipo_salvacao];
    }
  }
}


// Qualquer inicializacao do personagem eh feita aqui.
function IniciaPersonagem() {
  // entradas padroes para armas, armaduras e escudos.
  gPersonagem.armas.push(ConverteArma({
    chave: 'desarmado',
    nome_gerado: 'desarmado',
    obra_prima: false,
    bonus: 0
  }));
}

// Encontra uma arma do personagem pelo nome gerado.
// @return a arma do personagem.
function ArmaPersonagem(nome_gerado) {
  for (var i = 0; i < gPersonagem.armas.length; ++i) {
    var arma = gPersonagem.armas[i];
    if (arma.nome_gerado == nome_gerado) {
      return arma;
    }
  }
  return null;
}

// @return true se o personagem for proficiente com uma arma.
function PersonagemProficienteComArma(nome_arma) {
  // Verifica lista de armas.
  return gPersonagem.proficiencia_armas[nome_arma] != null;
}

// @return o valor do foco do personagem com a arma (0, 1, 2).
// @param nome_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemFocoComArma(chave_arma) {
  return gPersonagem.foco_armas[chave_arma];
}

// @return o valor da especialização do personagem com a arma (0, 2, 4).
// @param chave_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemEspecializacaoComArma(chave_arma) {
  return gPersonagem.especializacao_armas[chave_arma];
}

// @param nome_talento nome do talento na tabela ou chave na tabela.
// @param complemento alguns talentos precisam de um complemento. Por exemplo,
//        conhecimento (complemento), usar_arma_comum (complemento).
// @return true se o personagem tiver o talento passado.
function PersonagemPossuiTalento(nome_talento, complemento) {
  for (var chave_classe in gPersonagem.talentos) {
    for (var i = 0; i < gPersonagem.talentos[chave_classe].length; ++i) {
      if (_TalentoIgual(gPersonagem.talentos[chave_classe][i],
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
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    for (var j = 0; j < classes.length; ++j) {
      if (classes[j] == gPersonagem.classes[i].classe) {
        return true;
      }
    }
  }
  return false;
}

// @return o nivel total do personagem.
function PersonagemNivel() {
  return gPersonagem.dados_vida.nivel_personagem;
}

// @return o nivel do personagem na classe passada, zero se nao possuir.
function PersonagemNivelClasse(classe) {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].nivel;
    }
  }
  return 0;
}

// @param classe se null, retorna o maior de todas as classes.
// @return o nivel de conjurador de uma classe de personagem.
function PersonagemNivelConjuradorClasse(classe) {
  var nivel_conjurador = 0;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (classe == null) {
      if (gPersonagem.classes[i].nivel_conjurador > nivel_conjurador) {
        nivel_conjurador = gPersonagem.classes[i].nivel_conjurador;
      }
    } else if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].nivel_conjurador;
    }
  }
  return nivel_conjurador;
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
    if (gPersonagem.bba < requisitos.bba) {
      return (prefixo_erro + 'BBA >= ' + requisitos.bba);
    }
  }
  for (var atributo in requisitos.atributos) {
    if (gPersonagem.atributos[atributo].valor < requisitos.atributos[atributo]) {
      return (prefixo_erro + atributo + ' >= ' + requisitos.atributos[atributo]);
    }
  }
  for (var classe in requisitos.nivel) {
    if (classe == 'total') {
      if (gPersonagem.dados_vida.nivel_personagem < requisitos.nivel['total']) {
        return  (prefixo_erro + 'nivel de personagem >= ' + requisitos.nivel['total']);
      }
    } else if (classe == 'conjurador') {
      if (PersonagemNivelConjuradorClasse(null) < requisitos.nivel['conjurador']) {
        return (prefixo_erro + 'nivel de conjurador >= ' + requisitos.nivel[classe]);
      }
    } else {
      if (PersonagemNivelClasse(classe) < requisitos.nivel[classe]) {
        return (prefixo_erro + 'nivel em ' + classe + ' >= ' + requisitos.nivel[classe]);
      }
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

// @TODO fazer a conversao de um tipo para outro.
// Adiciona moedas ao personagem. Valores podem ser negativos.
// O personagem nunca pode ficar com moedas negativas, neste caso
// a funcao nao fara nada.
// @param moedas um objeto contendo { ouro, platina, prata, cobre}
// @return true se foi possivel adicionar as moedas.
function PersonagemAdicionarMoedas(moedas) {
  // verifica fundos.
  for (var tipo_moeda in moedas) {
    if (gPersonagem.moedas[tipo_moeda] + moedas[tipo_moeda] < 0) {
      return false;
    }
  }

  for (var tipo_moeda in moedas) {
    gPersonagem.moedas[tipo_moeda] += moedas[tipo_moeda];
  }
  return true;
}

// @return a string de dados de vida do personagem.
function PersonagemStringDadosVida() {
  var primeiro = true;  // primeira classe nao eh sinalizada.
  var string_dados_vida = '';
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
      if (primeiro) {
        primeiro = false;
      } else {
        string_dados_vida += ' +';
      }
      string_dados_vida +=
        gPersonagem.classes[i].nivel + 'd' + tabelas_classes[gPersonagem.classes[i].classe].dados_vida;
  }
  if (gPersonagem.atributos.constituicao.modificador > 0) {
    string_dados_vida +=
      ' +' + (gPersonagem.atributos.constituicao.modificador * gPersonagem.dados_vida.nivel_personagem);
  }
  return string_dados_vida;
}

// @return o template do personagem ou null.
function PersonagemTemplate() {
  if (gPersonagem.template.length == 0) {
    return null;
  }
  if (!(gPersonagem.template in tabelas_template)) {
    return null;
  }
  return tabelas_template[gPersonagem.template];
}
