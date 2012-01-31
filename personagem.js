// Apenas os dados do personagem e funcoes de conversao de entrada para personagem.
var personagem = {
  modo_visao: 'completo',
  modo_mestre: false,
  nome: '',
  raca: 'humano',
  tamanho: { categoria: 'medio', modificador_ataque_defesa: 0 }, 
  alinhamento: "",
  experiencia: 0,
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
    // chave_pericia: { pontos, graduacoes, bonus, de_classe }.
    lista: {},
  },
  // Cada entrada: { nome, 
  //                 arma_primaria: {  nome, 
  //                                   bonus_por_categoria: { categoria: { ataque, dano }, ... } ] }, 
  //                 arma_secundaria: { idem }, }.
  estilos_luta: [],
  ca: { 
      normal: 10, surpreso: 10, toque: 10,
      bonus: new Bonus(),
  },
  salvacoes : {
    fortitude: { base: 0, racial: 0, total: 0 },
    reflexo: { base: 0, racial: 0, total: 0 },
    vontade: { base: 0, racial: 0, total: 0 },
    // Outras salvacoes derivadas.
  },
  // Lista de armas que o personagem eh proficiente.
  // Cada entrada: { nome: true }, onde nome eh o nome da chave. So a presenca do campo eh
  // suficiente para indicar proficiencia, sem necessidade de um booleano.
  proficiencia_armas: {},
  // Cada entrada: { nome: 1|2 }.
  foco_armas: {},
  // Cada entrada: 
  //     { entrada: { chave, bonus, obra_prima }, nome_gerado, bonus_ataque, bonus_dano, 
  //       proficiente, foco: { maior }, especializado: { maior }, acuidade, arma_tabela };
  // O nome_gerado junta o nome com OP ou o bonus. Por exemplo, espada longa +1.
  // Sempre havera um ataque desarmado aqui.
  armas: [],
  // Armadura: { nome, bonus_magico }
  armadura: { nome: 'nenhuma', bonus_magico: 0 },
  escudo: { nome: 'nenhum' , bonus_magico: 0 },
  elmo: '',
  // Cada entrada { chave, em_uso }
  aneis: [],
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
  //       0: { base, bonus_atributo, 
  //            feiticos: [ { nome, gasto} ], 
  //            feitico_dominio: {nome, gasto}  }, 
  //       1: ...} }
  feiticos: {},
  moedas: { platina: 0, ouro: 0, prata: 0, cobre: 0 },

  notas: '',
};

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
function PersonagemFocoComArma(nome_arma) {
  return personagem.foco_armas[nome_arma];
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

// @return true se o personagem atender todos os requisitos do talento.
function PersonagemVerificaPrerequisitosTalento(chave_talento, complemento) {
  var requisitos = tabelas_talentos[chave_talento].requisitos;
  var prefixo_erro = tabelas_talentos[chave_talento].nome + ' requer ';
  if (requisitos == null) {
    return true;
  }
  if (requisitos.bba) {
    if (personagem.bba < requisitos.bba) {
      alert(prefixo_erro + 'BBA >= ' + requisitos.bba);
      return false;
    }
  }
  for (var atributo in requisitos.atributos) {
    if (personagem.atributos[atributo].valor < requisitos.atributos[atributo]) {
      alert(prefixo_erro + atributo + ' >= ' + requisitos.atributos[atributo]);
      return false;
    }
  }
  for (var classe in requisitos.nivel) {
    if (PersonagemNivelClasse(classe) < requisitos.nivel[classe]) {
      alert(prefixo_erro + 'nivel em ' + classe + ' >= ' + requisitos.nivel[classe]);
      return false;
    }
  }
  for (var i = 0; requisitos.talentos && i < requisitos.talentos.length; ++i) {
    if (!PersonagemPossuiTalento(requisitos.talentos[i], complemento)) {
      alert(prefixo_erro + 'talento ' + tabelas_talentos[requisitos.talentos[i]].nome + ' ' +
          (complemento ? complemento : ''));
      return false;
    }
  }
  if (requisitos.proficiencia_arma && complemento) {
    var chave_arma = tabelas_armas_invertida[complemento];
    if (!PersonagemProficienteComArma(chave_arma)) {
      alert(prefixo_erro + 'proficiencia com ' + complemento);
      return false;
    }
  }
  return true;
}
