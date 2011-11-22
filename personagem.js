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
  // Cada entrada: { nome, arma_principal, arma_secundaria}.
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
  // As armas possuem  { nome, nome_gerado, bonus_ataque, bonus_dano };
  // O nome gerado junta o nome com OP ou o bonus. Por exemplo, espada longa +1.
  armas: [],
  // Armadura
  armadura: {},
};

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  personagem.nome = entradas.nome;
  personagem.raca = entradas.raca;
  personagem.alinhamento = entradas.alinhamento;
  personagem.classes = entradas.classes;
  personagem.pontos_vida.total = entradas.pontos_vida;
  personagem.pontos_vida.ferimentos = entradas.ferimentos;
  for (var atributo in personagem.atributos) {
    personagem.atributos[atributo].valor = entradas[atributo];
  }

  personagem.estilos_luta = entradas.estilos_luta;
  personagem.armadura = entradas.armadura;
  personagem.escudo = entradas.escudo;
  personagem.armas = [];
  for (var i = 0; i < entradas.armas.length; ++i) {
    personagem.armas.push(_ConverteArma(entradas.armas[i]));
  }

}

// Converte uma arma da entrada para personagem.
// @return a arma convertida.
function _ConverteArma(arma_entrada) {
  var arma_personagem = {};
  // O nome da entrada eh apenas um indice na tabela de armas.
  arma_personagem.nome = tabelas_armas[arma_entrada.nome].nome;
  arma_personagem.nome_gerado = arma_personagem.nome;
  if (arma_entrada.obra_prima) {
    arma_personagem.bonus_ataque = 1;
    arma_personagem.bonus_dano = 0;
    arma_personagem.nome_gerado += ' OP';
  } else {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = 
        arma_entrada.bonus;
    if (arma_entrada.bonus > 0) {
      arma_personagem.nome_gerado += ' +' + arma_personagem.bonus_ataque;
    }
  }
  return arma_personagem;
}


