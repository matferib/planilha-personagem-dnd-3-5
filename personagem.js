// Apenas os dados do personagem e funcoes de conversao de entrada para personagem.
var personagem = {
  nome: '',
  raca: 'humano',
  tamanho: { categoria: 'medio', modificador_ataque_defesa: 0 }, 
  alinhamento: "",
  // Cada classe do vetor eh um objeto com classe e nivel.
  classes: [],
  pontos_vida: {
    dados_vida: 0,
    total: 0,
    ferimentos: 0,
    temporarios: 0
  },
  atributos: {
    forca: { 
      valor: 0,
      modificador: 0
    },  
    destreza: { 
      valor: 0,
      modificador: 0
    },  
    constituicao: { 
      valor: 0,
      modificador: 0
    },  
    inteligencia: { 
      valor: 0,
      modificador: 0
    },  
    sabedoria: { 
      valor: 0,
      modificador: 0
    },  
    carisma: { 
      valor: 0,
      modificador: 0
    }
  },
  bba: 0,
  bba_cac: 0,  // inclui tamanho e forca.
  bba_distancia: 0,  // inclui tamanho e destreza.
  // Cada entrada: { nome, 
  //                 arma_primaria: {  nome, 
  //                                   bonus_por_categoria: { categoria: { ataque, dano }, ... } ] }, 
  //                 arma_secundaria: { idem }, }.
  estilos_luta: [],
  ca: { normal: 10, surpreso: 10, toque: 10 },
  salvacoes : {
    fortitude: 0,
    reflexo: 0,
    vontade: 0
  },
  // talentos
  talentos: {
    nivel: 0,
    raca: 0,
    classe: 0,
    lista: [],
  },
  // As armas possuem  { nome, nome_gerado, bonus_ataque, bonus_dano, proficiente, arma_tabela };
  // O nome gerado junta o nome com OP ou o bonus. Por exemplo, espada longa +1.
  // Sempre havera um ataque desarmado aqui.
  armas: [],
  // Armadura
  armadura: {},
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



