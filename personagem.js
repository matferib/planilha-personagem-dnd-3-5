// Apenas os dados do personagem e funcoes de conversao de entrada para personagem.
var personagem = {
  nome: '',
  raca: 'humano',
  tamanho: { categoria: 'medio', modificador_ataque_defesa: 0 }, 
  alinhamento: "",
  experiencia: 0,
  // Cada entrada: { classe, nivel }.
  classes: [],
  pontos_vida: {
    dados_vida: 0,
    total: 0,
    ferimentos: 0,
    temporarios: 0
  },
  atributos: {
    pontos: {
      disponiveis: 0,
      gastos: [],  // cada entrada, um atributo
    },
    forca: { 
      base: 0,
      valor: 0,
      modificador: 0
    },  
    destreza: {
      base: 0, 
      valor: 0,
      modificador: 0
    },  
    constituicao: { 
      base: 0, 
      valor: 0,
      modificador: 0
    },  
    inteligencia: { 
      base: 0, 
      valor: 0,
      modificador: 0
    },  
    sabedoria: { 
      base: 0, 
      valor: 0,
      modificador: 0
    },  
    carisma: { 
      base: 0, 
      valor: 0,
      modificador: 0
    }
  },
  bba: 0,
  bba_cac: 0,  // inclui tamanho e forca.
  bba_distancia: 0,  // inclui tamanho e destreza.
  // talentos
  talentos: {  
    // talentos livres.
    total: 0,
    lista: [],  // Cada entrada, { nome, complemento }.
    // talentos especificos de classe.
    // TODO
  },
  // pericias.
  pericias: {
    // Quantos pontos o personagem pode gastar.
    total_pontos: 0,
    // Quantos ele ja gastou.
    pontos_gastos: 0,
    // Cada entrada: chave_pericia: { pontos, graduacoes, bonus_sinergia, 
    // bonus_talentos: { chave: valor }, bonus_habilidade, total }.
    lista: {},
  },
  // Cada entrada: { nome, 
  //                 arma_primaria: {  nome, 
  //                                   bonus_por_categoria: { categoria: { ataque, dano }, ... } ] }, 
  //                 arma_secundaria: { idem }, }.
  estilos_luta: [],
  ca: { normal: 10, surpreso: 10, toque: 10 },
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
  //       proficiente, foco: { maior }, especializado: { maior }, arma_tabela };
  // O nome_gerado junta o nome com OP ou o bonus. Por exemplo, espada longa +1.
  // Sempre havera um ataque desarmado aqui.
  armas: [],
  // Armadura: { nome, bonus_magico }
  armadura: {},
  // Feiticos. Cada entrada: chave_classe: { 
  //   habilidade_chave, 
  //   conhecidos: { 0: [], ..., 9 },
  //   slots: { 0: { base, bonus_atributo, feiticos: [], feitico_dominio  }, ... 9 } }
  // TODO: transformar em:
  //   slots: { 0: { base, bonus_atributo, feiticos: [ { nome, gasto} ], feitico_dominio: {nome, gasto}  }, ... 9 } }
  feiticos: {},
  moedas: { platina: 0, ouro: 0, prata: 0, cobre: 0 },
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
function PersonagemFocoComArma(nome_arma, maior) {
  return personagem.foco_armas[nome_arma];
}

// @param nome_talento nome do talento na tabela ou nome do indice na tabela.
// @param complemento alguns talentos precisam de um complemento. Por exemplo,
//        conhecimento (complemento), usar_arma_comum (complemento).
// @return true se o personagem tiver o talento passado.
function PersonagemPossuiTalento(nome_talento, complemento) {
  for (var i = 0; i < personagem.talentos.lista.length; ++i) {
    if (nome_talento == personagem.talentos.lista[i].nome ||
        nome_talento == tabelas_talentos[personagem.talentos.lista[i].nome]) {
      // TODO tratar complemento.
      return true;
    }
  }
  return false;
}

// @return true se o personagem possuir uma das classes passadas.
// @param classes array de classe ou classe.
function PersonagemPossuiUmaDasClasse(classes) {
  var array_classes = classes.length ? classes : [ classes ];
  for (var i = 0; i < personagem.classes.length; ++i) {
    for (var j = 0; j < array_classes.length; ++j) {
      if (array_classes[j] == personagem.classes[i].classe) {
        return true;
      }
    }
  }
  return false;
}

