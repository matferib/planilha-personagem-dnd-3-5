// Modificadores de habilidades por raca.
var tabelas_raca = {
  anao: { atributos: {constituicao: +2, carisma: -2}, tamanho: 'medio' },
  halfling: { atributos: { forca: -2, destreza: +2}, tamanho: 'pequeno' },
  humano: { atributos: {}, tamanho: 'medio' },
  elfo: { atributos: { destreza: +2, constituicao: -2 }, tamanho: 'medio' },
  gnomo: { atributos: { forca: -2, constituicao: +2 }, tamanho: 'pequeno' },
  meioelfo: { atributos: {}, tamanho: 'medio' },
  meioorc: { atributos: {forca: +2, inteligencia: -2, carisma: -2 }, tamanho: 'medio' }
};

// Bonus base de ataque.
function bba_forte(nivel) {
  if (nivel == 0) return 0;
  return nivel;
};
function bba_medio(nivel) {
  if (nivel == 0) return 0;
  var ret = (nivel - 1);
  var mod = Math.floor(nivel / 4);
  if (nivel % 4 == 0) { --mod; }
  return ret - mod;
}
function bba_fraco(nivel) {
  if (nivel == 0) return 0;
  return Math.floor(nivel / 2);
}
function bba_nulo() {
  return 0;
}

// Tabelas de dados de vida.
var tabelas_dados_vida = {
  barbaro: 12,
  bardo: 6,
  clerigo: 8,
  druida: 8,
  guerreiro: 10,
  feiticeiro: 4,
  ladino: 6,
  mago: 4,
  monge: 8,
  paladino: 10,
  ranger: 8,
  // classes NPC
  adepto: 6,
  aristocrata: 8,
  plebeu: 4,
  expert: 6,
  combatente: 8,
};

// Tabelas de geracao de atributos.
var tabelas_geracao_atributos = {
  // Peguei do livro do mestre.
  barbaro: ['forca', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
  bardo: [ 'carisma', 'inteligencia', 'destreza', 'constituicao', 'forca', 'sabedoria' ],
  clerigo: [ 'sabedoria', 'constituicao', 'forca', 'carisma', 'inteligencia',  'destreza' ],
  druida: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
  guerreiro: [ 'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
  feiticeiro: [ 'carisma', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'forca' ],
  ladino: [ 'destreza', 'inteligencia', 'constituicao', 'forca', 'sabedoria', 'carisma' ],
  mago: [ 'inteligencia', 'destreza', 'constituicao', 'sabedoria', 'forca', 'carisma' ],
  monge: [ 'sabedoria', 'forca', 'destreza', 'constituicao', 'inteligencia', 'carisma' ],
  paladino: [ 'carisma', 'forca', 'sabedoria', 'constituicao', 'inteligencia', 'destreza' ],
  ranger: [ 'destreza', 'forca', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
  // classes NPC: nao existe uma tabela para esses, coloquei o que achei mais adequado.
  adepto: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
    // Esse ta muito ruim...
  aristocrata: [ 'destreza', 'inteligencia', 'forca', 'carisma', 'constituicao', 'sabedoria' ],
  plebeu: [ 'forca', 'constituicao', 'sabedoria', 'destreza', 'inteligencia', 'carisma' ],
    // esse aqui varia de acordo com as escolhas da area de expertise.
  expert: [ 'inteligencia', 'forca', 'destreza', 'constituicao', 'sabedoria', 'carisma' ],
  combatente: [  'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
};

// Tabelas de BBA.
var tabelas_bba = {
  barbaro: bba_forte,
  bardo: bba_medio,
  clerigo: bba_medio,
  druida: bba_medio,
  guerreiro: bba_forte,
  feiticeiro: bba_fraco,
  ladino: bba_medio,
  mago: bba_fraco,
  monge: bba_medio,
  paladino: bba_forte,
  ranger: bba_forte,
  // classes NPC
  adepto: bba_fraco,
  aristocrata: bba_medio,
  plebeu: bba_fraco,
  expert: bba_medio,
  combatente: bba_forte,
};

// Salvacoes
function salvacao_forte(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 2) + 2 : 0;
}
function salvacao_fraca(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 3) : 0;
}
// Tabelas de salvacao.
var tabelas_salvacao = {
  barbaro: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  bardo: {
    fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_forte },
  clerigo: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
  druida: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
  feiticeiro: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  guerreiro: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  ladino: {
    fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_fraca },
  mago: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  monge: {
    fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_forte },
  paladino: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  ranger: {
    fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_fraca },
  // classes NPC
  adepto: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  aristocrata: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  plebeu: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  expert: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  combatente: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
};

// Tabelas de tamanho.
var tabelas_tamanho = {
  minusculo: { nome: 'Minúsculo', ataque_defesa: 8, },
  diminuto: { nome: 'Diminuto', ataque_defesa: 4, },
  miudo: { nome: 'Miúdo', ataque_defesa: 2, },
  pequeno: { nome: 'Pequeno', ataque_defesa: 1, },
  medio: { nome: 'Médio', ataque_defesa: 0, },
  grande: { nome: 'Grande', ataque_defesa: -1, },
  enorme: { nome: 'Enorme', ataque_defesa: -2, },
  imenso: { nome: 'Imenso', ataque_defesa: -4, },
  colossal: { nome: 'Colossal', ataque_defesa: -8, },
};

// Tabelas de armaduras.
var tabelas_armaduras = {
  nenhuma: {
    nome: 'Nenhuma', bonus: 0, },
  acolchoada: {
    nome: 'Acolchoada', bonus: 1, maximo_bonus_destreza: 8 },
  couro: {
    nome: 'Couro', bonus: 2,  maximo_bonus_destreza: 6 },
  couro_batido: {
    nome: 'Couro Batido', bonus: 3, maximo_bonus_destreza: 5 },
  camisao_cota_de_malha: {
    nome: 'Camisão de Cota de Malha', bonus: 4, maximo_bonus_destreza: 4 },
  gibao_de_peles: {
    nome: 'Gibão de Peles', bonus: 3, maximo_bonus_destreza: 4 },
  brunea: {
    nome: 'Brunea', bonus: 4, maximo_bonus_destreza: 3 },
  cota_de_malha: {
    nome: 'Cota de Malha', bonus: 5, maximo_bonus_destreza: 2 },
  peitoral_de_aco: {
    nome: 'Peitoral de Aço', bonus: 5, maximo_bonus_destreza: 3 },
  cota_de_talas: {
    nome: 'Cota de Talas', bonus: 6, maximo_bonus_destreza: 0 },
  loriga_segmentada: {
    nome: 'Loriga Segmentada', bonus: 6, maximo_bonus_destreza: 1 },
  meia_armadura: {
    nome: 'Meia Armadura', bonus: 7, maximo_bonus_destreza: 0 },
  armadura_de_batalha: {
    nome: 'Armadura de Batalha', bonus: 8, maximo_bonus_destreza: 1 },
};

// Tabelas de escudos (TODO terminar outros atributos).
var tabelas_escudos = {
  nenhum: { nome: "Nenhum", bonus: 0 },
  broquel: { nome: "Broquel", bonus: 1 },
  escudo_leve_de_madeira: { nome: "Escudo Leve de Madeira", bonus: 1 },
  escudo_leve_de_aco: { nome: "Escudo Leve de Aço", bonus: 1 },
  escudo_pesado_de_aco: { nome: "Escudo Pesado de Madeira", bonus: 2 },
  escudo_pesado_de_aco: { nome: "Escudo Pesado de Aço", bonus: 2 },
  escudo_de_corpo: { nome: "Escudo de Corpo", bonus: 4, maximo_bonus_destreza: 2 },
};

// Mapeia o nome para a chave. Necessario para computar proficiencias.
var tabelas_armas_invertida = {
  // Cada entrada: nome_completo: nome_entrada.
};

// Esta tabela eh composta pela juncao das tabelas de armas simples, comuns e exoticas.
var tabelas_armas = {
  // Cada entrada:
  // chave: { nome, preco, dano: { pequeno, medio}, categorias: { cac, cac_leve, arremesso, distancia},
  //          critico, peso, tipo, incremento_distancia, talento_relacionado }
};

var tabelas_armas_simples = {

//As primeiras armas estão ordenadas de acordo com o livro inglês,
// a partir das Martial Weapons do livro em português - FC
// Unarmed Attacks


  desarmado: { preco: "0 PO", dano: { pequeno: "1d2", medio: "1d3"},
               categorias: { cac_leve: true },
               critico: "×2", peso: "0", tipo: "concussao", incremento_distancia: "0 quadrados" },

  manopla: { preco: "2 PO", dano: { pequeno: "1d2", medio: "1d3" },
             categorias: { cac_leve: true },
             critico: "×2", peso: "500g", tipo: "concussao", },

//Light Melee Weapons


  adaga: { preco: "2 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
           categorias: { cac_leve: true, arremesso: true } ,
           incremento_distancia: "2 quadrados", critico: "19-20/×2", peso: "0,5kg", tipo: "cortante/perfurante" },

  adaga_de_soco: { nome: "adaga de soco", preco: "2 PO", dano: { pequeno: "1d3", medio: "1d4"},
                categorias: { cac_leve: true },
                  critico: "×3", peso: "0,5kg", tipo: "perfurante" },

  manopla_com_cravos: { nome: "manopla com cravos", preco: "5 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
                        categorias: { cac_leve: true } ,
                        critico: "×2", peso: "0,5kg", tipo: "perfurante" },

  maca_leve: { nome: "maça leve", preco: "5 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
               categorias: { cac_leve: true } ,
               critico: "×2", peso: "2kg", tipo: "concussao" },

  foice_curta: { nome: "foice curta", preco: "6 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                  categorias: { cac_leve: true } ,
                  critico: "×2", peso: "1kg", tipo: "cortante" },

// One-Handed Melee Weapons

  clava: { preco: "0 PO", dano: { pequeno: "1d4", medio: "1d6" }, critico: "×2",
           categorias: { cac_leve: true, arremesso: true },
           incremento_distancia: "2 quadrados", peso: "1,5Kg", tipo: "concussao" },

  maca_pesada: { nome: "maça pesada", preco: "12 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                 categorias: { cac: true } ,
                 critico: "×2", peso: "4kg", tipo: "concussao" },

  maca_estrela: { nome: "maça estrela", preco: "8 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                  categorias: { cac: true } ,
                  critico: "×2", peso: "3kg", tipo: "concussao/perfurante" },

  lanca_curta: { nome: "lança curta", preco: "1 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                 categorias: { cac: true, arremesso: true} ,
                 incremento_distancia: "4 quadrados", critico: "×2", peso: "1,5kg", tipo: "perfurante" },

// Two-Handed Melee Weapons


  lanca: { nome: "lança", preco: "2 PO", dano: { pequeno: "1d6", medio: "1d8" }, critico: "×3",
           categorias: { cac: true, arremesso: true },
           incremento_distancia: "4 quadrados", peso: "3kg", tipo: "perfurante" },

  lanca_longa: { nome: "lança longa", preco: "5 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                 categorias: { cac: true } ,
                 critico: "×3", peso: "4,5kg", tipo: "perfurante" },

  bordao: { nome: "bordão", preco: "0 PO", dano: { pequeno: "1d4/1d4", medio: "1d6/1d6"} ,
                  categorias: { cac: true } ,
                  critico: "×2", peso: "2kg", tipo: "concussao" },


// Ranged Weapons


  besta_pesada: { nome: "besta pesada", preco: "50 PO", dano: { pequeno: "1d8", medio: "1d10" }, critico: "19-20/×2",
                  categorias: { distancia: true },
                  incremento_distancia: "24 quadrados", peso: "4kg", tipo: "perfurante" },

  besta_leve: { nome: "besta leve", preco: "35 PO", dano: { pequeno: "1d6", medio: "1d8" }, critico: "19-20/×2",
                categorias: { distancia: true },
                incremento_distancia: "16 quadrados", peso: "2kg", tipo: "perfurante" },

  dardo: { nome: "dardo", preco: "5 PP", dano: { pequeno: "1d3", medio: "1d4" }, critico: "×2",
           categorias: { arremesso: true },
           incremento_distancia: "4 quadrados", peso: "250g", tipo: "perfurante" },

  azagaia: { preco: "1 PO", dano: { pequeno: "1d4", medio: "1d6" }, critico: "×2",
             categorias: { arremesso: true },
             incremento_distancia: "6 quadrados", peso: "1Kg", tipo: "perfurante" },

  funda: { nome: "funda", preco: "0 PO", dano: { pequeno: "1d3", medio: "1d4" }, critico: "×2",
           categorias: { arremesso: true },
           incremento_distancia: "10 quadrados", peso: "0Kg", tipo: "concussao" },


//Munição
//Bolts, crossbow (10)  1 gp  — — — — 1 lb. —
//Bullets, sling (10) 1 sp  — — — — 5 lb. —
};

// Martial weapons.
var tabelas_armas_comuns = {

// Martial Weapons Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons, ordenado de acordo com o livro do jogador 3.5, português

  armadura_com_cravos: { nome: "armadura com cravos", preco: "especial",
                         dano: { pequeno: "1d4", medio: "1d6" }, critico: "×2",
                         categorias: { cac_leve: true },
                         peso: "especial", tipo: "perfurante" },

  escudo_pequeno: { nome: "escudo pequeno", preco: "especial", dano: { pequeno: "1d2", medio: "1d3"} ,
                    categorias: { cac_leve: true } ,
                    critico: "×2", peso: "especial", tipo: "concussão" },

  escudo_pequeno_com_cavos: { nome: "escudo pequeno com cravos", preco: "especial", 
                              dano: { pequeno: "1d3", medio: "1d4"}, categorias: { cac_leve: true } ,
                              critico: "×2", peso: "especial", tipo: "perfurante" },

  espada_curta: { nome: "espada curta", preco: "10 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                  categorias: { cac_leve: true } ,
                  critico: "19-20/×2", peso: "1kg", tipo: "perfurante" },

  kukri: { preco: "8 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
           categorias: { cac_leve: true } ,
           critico: "18-20/×2", peso: "1kg", tipo: "cortante" },

  machadinha: { preco: "6 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                categorias: { cac_leve: true } ,
                critico: "×3", peso: "1,5kg", tipo: "cortante" },

  machado_de_arremesso: { nome: "machado de arremesso", preco: "8 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                          categorias: { cac_leve: true, arremesso: true} ,
                          incremento_distancia: "2 quadrados", critico: "×2", peso: "1kg", tipo: "cortante" },

  martelo_leve: { nome: "martelo leve", preco: "1 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
                  categorias: { cac_leve: true, arremesso: true} ,
                  incremento_distancia: "4 quadrados", critico: "×2", peso: "1kg", tipo: "concussão" },

  picareta_leve: { nome: "picareta leve", preco: "4 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
                   categorias: { cac_leve: true } ,
                   critico: "×4", peso: "1,5kg", tipo: "perfurante" },

  porrete: { nome: "porrete", preco: "1 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
             categorias: { cac_leve: true } ,
             critico: "×2", peso: "1kg", tipo: "concussão" },

// One-Handed Melee Weapons

  cimitarra: { nome: "cimitarra", preco: "15 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
               categorias: { cac: true } ,
               critico: "18-20/×2", peso: "2kg", tipo: "cortante" },

  escudo_grande: { nome: "escudo grande", preco: "especial", dano: { pequeno: "1d3", medio: "1d4"} ,
                   categorias: { cac: true } ,
                   critico: "×2", peso: "especial", tipo: "concussão" },

  escudo_grande_com_cravos: { nome: "escudo grande com cravos", preco: "especial", dano: { pequeno: "1d4", medio: "1d6"} ,
                 categorias: { cac: true } ,
                 critico: "×2", peso: "especial", tipo: "perfurante" },

  espada_longa: { nome: "espada longa", preco: "15 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                  categorias: { cac: true },
                  critico: "19-20/×2", peso: "2kg", tipo: "cortante", },

  machado_de_batalha: { nome: "machado de batalha", preco: "10 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                        categorias: { cac: true } ,
                        critico: "×3", peso: "3kg", tipo: "cortante" },

  mangual: { nome: "mangual", preco: "8 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
             categorias: { cac: true } ,
             critico: "×2", peso: "2,5kg", tipo: "concussão" },

  martelo_de_guerra: { nome: "martelo de guerra", preco: "12 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                       categorias: { cac: true } ,
                       critico: "×3", peso: "2,5kg", tipo: "concussão" },

  picareta_pesada: { nome: "picareta pesada", preco: "8 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                     categorias: { cac: true } ,
                     critico: "×4", peso: "3kg", tipo: "perfurante" },

  sabre: { nome: "sabre", preco: "20 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
           categorias: { cac: true } ,
           critico: "18-20/x2", peso: "1kg", tipo: "perfurante" },

  tridente: { nome: "tridente", preco: "15 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
              categorias: { cac: true, arremesso: true} ,
              incremento_distancia: "2 quadrados", critico: "×2", peso: "2kg", tipo: "perfurante" },


// Two-Handed Melee Weapons
  alabarda: { nome: "alabarda", preco: "10 PO", dano: { pequeno: "1d8", medio: "1d10"} ,
              categorias: { cac: true } ,
              critico: "×3", peso: "11kg", tipo: "cortante/perfurante" },

  clava_grande: { nome: "clava grande", preco: "5 PO", dano: { pequeno: "1d8", medio: "1d10"} ,
                  categorias: { cac: true } ,
                  critico: "×2", peso: "4Kg", tipo: "concussão" },

  espada_larga: { nome: "espada larga", preco: "50 PO", dano: { pequeno: "1d10", medio: "2d6"} ,
                  categorias: { cac: true } ,
                  critico: "19-20/×2", peso: "4Kg", tipo: "cortante" },

  falcione: { nome: "falcione", preco: "75 PO", dano: { pequeno: "1d6", medio: "2d4"} ,
              categorias: { cac: true },
              critico: "18-20/×2", peso: "4kg", tipo: "cortante", },

  foice_longa: { nome: "foice longa", preco: "18 PO", dano: { pequeno: "1d6", medio: "2d4"} ,
                 categorias: { cac: true } ,
                 critico: "×4", peso: "10kg", tipo: "cortante/perfurante" },

  glaive: { nome: "glaive", preco: "8 PO", dano: { pequeno: "1d8", medio: "1d10"} ,
            categorias: { cac: true } ,
            critico: "×3", peso: "10Kg", tipo: "cortante" },

  guisarme: { nome: "guisarme", preco: "9 PO", dano: { pequeno: "1d6", medio: "2d4"} ,
              categorias: { cac: true } ,
              critico: "×3", peso: "11kg", tipo: "cortante" },

  lanca_montada: { nome: "lança montada", preco: "10 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                   categorias: { cac: true } ,
                   critico: "×3", peso: "10kg", tipo: "perfurante" },

  machado_grande: { nome: "machado grande", preco: "20 PO", dano: { pequeno: "1d10", medio: "1d12"} ,
                    categorias: { cac: true } ,
                    critico: "x3", peso: "11kg", tipo: "cortante" },

  mangual_pesado: { nome: "mangual pesado", preco: "15 PO", dano: { pequeno: "1d8", medio: "1d10"} ,
                    categorias: { cac: true } ,
                    critico: "19-20/x2", peso: "10kg", tipo: "concussão" },

  ranseur: { nome: "ranseur", preco: "10 PO", dano: { pequeno: "1d6", medio: "2d4"} ,
             categorias: { cac: true } ,
             critico: "x3", peso: "11kg", tipo: "perfurante" },

// Ranged Weapons

  arco_curto: { nome: "arco curto", preco: "30 PO", dano: { pequeno: "1d4", medio: "1d6" }, critico: "×3",
                categorias: { distancia: true },
                incremento_distancia: "12 quadrados", peso: "1Kg", tipo: "perfurante" },

  arco_curto_composto: { nome: "arco curto composto", preco: "75 PO",
                         dano: { pequeno: "1d4", medio: "1d6" }, critico: "x3",
                         categorias: { distancia: true },
                         incremento_distancia: "14 quadrados", peso: "1kg", tipo: "perfurante" },

  arco_longo: { nome: "arco longo", preco: "75 PO", dano: { pequeno: "1d6", medio: "1d8" }, critico: "x3",
                categorias: { distancia: true },
                incremento_distancia: "20 quadrados", peso: "1,5kg", tipo: "perfurante" },

  arco_longo_composto: { nome: "arco longo composto", preco: "100 PO",
                         dano: { pequeno: "1d6", medio: "1d8" }, critico: "x3",
                         categorias: { distancia: true },
                         incremento_distancia: "22 quadrados", peso: "1,5kg", tipo: "perfurante" },

//Arrows (20) 1 gp  — — — — 3 lb. —
};

var tabelas_armas_exoticas = {

// Exotic Weapons  Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons

  kama: { nome: "kama", preco: "2 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
          categorias: { cac_leve: true } ,
          critico: "×2", peso: "1Kg", tipo: "cortante" },

  nunchaku: { nome: "nunchaku", preco: "2 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
              categorias: { cac_leve: true } ,
              critico: "×2", peso: "1Kg", tipo: "concussão" },

  sai: { nome: "sai", preco: "1 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
         categorias: { cac_leve: true, arremesso: true } ,
         incremento_distancia: "2 quadrados", critico: "×2", peso: "0,5kg", tipo: "concussão" },

  siangham: { preco: "3 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
              categorias: { cac_leve: true } ,
              critico: "×2", peso: "0,5kg", tipo: "perfurante" },

  machadinha: { preco: "6 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                categorias: { cac_leve: true } ,
                critico: "×3", peso: "1,5kg", tipo: "cortante" },


// One-Handed Melee Weapons

  chicote: { nome: "chicote", preco: "1 PO", dano: { pequeno: "1d2", medio: "1d3"} ,
             categorias: { cac: true } ,
             critico: "×2", peso: "1kg", tipo: "cortante" },

  espada_bastarda: { nome: "espada bastarda", preco: "35 PO", dano: { pequeno: "1d8", medio: "1d10"} ,
                     categorias: { cac: true } ,
                     critico: "19-20/x2", peso: "3Kg", tipo: "cortante" },

  machado_de_guerra_anao: { nome: "machado de guerra anão", preco: "30 PO",
                            dano: { pequeno: "1d8", medio: "1d10"}, categorias: { cac: true } ,
                            critico: "×3", peso: "4Kg", tipo: "cortante" },

// Two-Handed Melee Weapons


  corrente_com_cravos: { nome: "corrente com cravos", preco: "25 PO", dano: { pequeno: "1d6", medio: "2d4"} ,
                         categorias: { cac: true },
                         critico: "×2", peso: "10kg", tipo: "perfurante", },

  espada_de_duas_laminas: { nome: "espada de duas lâminas", preco: "100 PO",
                            dano: { pequeno: "1d6/1d6", medio: "1d8/1d8"}, categorias: { cac: true } ,
                            critico: "19-20/x2", peso: "10Kg", tipo: "cortante" },

  machado_orc_duplo: { nome: "machado orc duplo", preco: "60 PO",
                       dano: { pequeno: "1d6/1d6", medio: "1d8/1d8"},
                       categorias: { cac: true }, critico: "×3", peso: "12,5kg", tipo: "cortante" },

  mangual_atroz: { nome: "mangual atroz", preco: "90 PO", dano: { pequeno: "1d6/1d6", medio: "1d8/1d8"},
                   categorias: { cac: true } ,
                   critico: "×2", peso: "10kg", tipo: "concussão" },

  martelo_gnomo_com_gancho: { nome: "martelo gnomo com gancho", preco: "20 PO",
                              dano: { pequeno: "1d6/1d4", medio: "1d8/1d6"}, categorias: { cac: true },
                              critico: "×3/x4", peso: "3kg", tipo: "concussão e perfurante" },

  urgrosh_anao: { nome: "urgrosh anão", preco: "50 PO", dano: { pequeno: "1d6/1d4", medio: "1d8/1d6"},
                  categorias: { cac: true },
                  critico: "x3", peso: "11kg", tipo: "cortante ou perfurante" },

// Ranged Weapons

  besta_leve_de_repeticao: { nome: "besta leve de repetição", preco: "250 PO",
                             dano: { pequeno: "1d6", medio: "1d8" }, critico: "19-20/x2",
                             categorias: { distancia: true },
                             incremento_distancia: "16 quadrados", peso: "3Kg", tipo: "perfurante" },

  besta_pesada_de_repeticao: { nome: "besta pesada de repetição", preco: "400 PO",
                               dano: { pequeno: "1d8", medio: "1d10" }, critico: "19-20/x2",
                               categorias: { distancia: true },
                               incremento_distancia: "24 quadrados", peso: "11kg", tipo: "perfurante" },

  besta_de_mao: { nome: "besta de mão", preco: "100 PO", dano: { pequeno: "1d3", medio: "1d4" },
                  critico: "19-20/x2", categorias: { distancia: true },
                  incremento_distancia: "6 quadrados", peso: "1kg", tipo: "perfurante" },

  boleadeira: { nome: "boleadeira", preco: "5 PO", dano: { pequeno: "1d3", medio: "1d4" }, critico: "x2",
                categorias: { distancia: true },
                incremento_distancia: "2 quadrados", peso: "1kg", tipo: "concussão" },

  rede: { nome: "rede", preco: "20 PO", dano: { pequeno: "-", medio: "-" }, critico: "-",
          categorias: { distancia: true },
          incremento_distancia: "2 quadrados", peso: "3kg", tipo: "-" },

  shuriken: { nome: "shuriken (5)", preco: "1 PO", dano: { pequeno: "1", medio: "1d2" }, critico: "x2",
              categorias: { distancia: true },
              incremento_distancia: "2 quadrados", peso: "0,25kg", tipo: "perfurante" },

//Bolts (10)  1 gp  — — — — 1 lb. —
//Bolts (5) 1 gp  — — — — 1 lb. —
};

// Talento das classes.
var tabelas_proficiencia_arma_por_classe = {
  barbaro: { 
      talentos: [ 'usar_armas_simples', 'usar_armas_comuns' ]
  },  
  bardo: { 
      talentos: [ 'usar_armas_simples' ],
      armas: [ 'espada_longa', 'sabre', 'porrete',  'espada_curta', 'arco_curto', 'chicote' ] 
  },
  clerigo: {
      talentos: [ 'usar_armas_simples' ]
  },
  druida: { 
      armas: [ 'clava', 'adaga', 'dardo', 'bordao', 'cimitarra', 'foice',  
               'lanca_curta', 'funda', 'lanca' ]
  },
  feiticeiro: { 
      talentos: [ 'usar_armas_simples' ]
  },
  guerreiro: { 
      talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ]
  },
  ladino: { 
      talentos: [ 'usar_armas_simples' ],
      armas: [ 'besta_de_mao', 'sabre', 'porrete', 'arco_curto', 'espada_curta' ]
  },
  mago: { 
      talentos: ['usar_armas_simples' ], 
      armas: [ 'clava', 'adaga', 'besta_pesada', 'besta leve', 'bordao' ] 
  },
  monge: {
      armas: [ 'clava', 'besta leve', 'besta pesada', 'adaga', 'machadinha', 'azagaia', 
               'kama', 'nunchaku', 'bordao', 'sai', 'shuriken', 'siangham', 'funda' ],
  },
  paladino: {
      talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ]
  },
  ranger: {
      talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ]
  },

  // NPCs.
  adepto: {
      talentos: ['usar_armas_simples' ],
  },
  aristocrata: {
      talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ] 
  },
  plebeu: {
      // na verdade o plebeu eh proficiente com uma arma simples, eu escolhi clava.
      armas: [ 'clava' ]
  },
  expert: {
      talentos: ['usar_armas_simples' ]
  },
  combatente: {
      talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ]
  }
};

// Cada entrada tem suas dependencias.
var tabelas_talentos = {
  /*
Acrobatic
Agile
Alertness
Animal Affinity
Armor Proficiency (Light)
Armor Proficiency (Medium)
Armor Proficiency (Heavy)
Athletic
Augment Summoning
Blind-Fight
Combat Casting
Combat Expertise
Improved Disarm
Improved Feint
Improved Trip
Whirlwind Attack
Combat Reflexes
Deceitful
Deft Hands
Diligent
Dodge
Mobility
Spring Attack
Endurance
Diehard
Eschew Materials
Extra Turning
Great Fortitude
Improved Counterspell
Improved Critical
Improved Familiar
Improved Initiative
Improved Turning
Improved Unarmed Strike
Deflect Arrows
Improved Grapple
Snatch Arrows
Stunning Fist
Investigator
Iron Will
Leadership
Lightning Reflexes
Magical Aptitude
Mounted Combat
Mounted Archery
Ride-By Attack
Spirited Charge
Trample
Natural Spell
Negotiator
Nimble Fingers
Persuasive
Point Blank Shot
Far Shot
Precise Shot
Improved Precise Shot
Rapid Shot
Manyshot
Shot On The Run
Power Attack
Cleave
Great Cleave
Improved Bull Rush
Improved Overrun
Improved Sunder
Quick Draw
Rapid Reload
Run
Self-Sufficient
Shield Proficiency
Improved Shield Bash
Tower Shield Proficiency,
*/
  // Simple Weapon Proficiency
  usar_armas_simples: { nome: 'Usar armas simples' },

  // Martial weapon proficiency
  usar_arma_comum: { nome: 'Usar arma comum', complemento: true }, 

  // Exotic Weapon Proficiency
  usar_arma_exotica: { 
      nome: 'Usar arma exótica', complemento: true,
      requisitos: { bba: 1 } },

  // Two-Weapon Fighting
  combater_duas_armas: { 
      nome: 'Combater com duas armas',
      requisitos: { habilidades: { des: 15 } } },

/*
Skill Focus
Spell Focus
Greater Spell Focus
Spell Mastery
Spell Penetration
Greater Spell Penetration
Stealthy
Toughness
Track
Two-Weapon Defense
Improved Two-Weapon Fighting
Greater Two-Weapon Fighting
Weapon Finesse
Weapon Focus
Weapon Specialization
Greater Weapon Focus
Greater Weapon Specialization

Brew Potion
Craft Magic Arms And Armor
Craft Rod
Craft Staff
Craft Wand
Craft Wondrous Item
Forge Ring
Scribe Scroll
Empower Spell
Enlarge Spell
Extend Spell
Heighten Spell
Maximize Spell
Quicken Spell
Silent Spell
Still Spell
Widen Spell
     */
};
