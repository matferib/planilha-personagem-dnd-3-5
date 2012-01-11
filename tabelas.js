// Dados das racas.
var tabelas_raca = {
  aarakokra: {
      nome: 'Aarakokra', 
      ajuste_nivel: 2, armadura_natural: 1,
      movimento: {terrestre: 4, aereo: 18},
      atributos: { forca: -2, destreza: 4 }, tamanho: 'medio',
  },
  anao: {
      nome: 'Anão',
      atributos: {constituicao: 2, carisma: -2}, tamanho: 'medio',
      familiaridade_arma: { machado_de_guerra_anao: true, urgrosh_anao: true },
      outras_salvacoes: { veneno: { base: ['fortitude'], bonus: 2 }, 
                          magias: { base: ['fortitude', 'reflexo', 'vontade' ], bonus: 2, } },
  },
  halfling: {
      nome: 'Halfling',
      atributos: { forca: -2, destreza: 2}, tamanho: 'pequeno',
      bonus_ataque: { categorias: { arremesso: 1 }, armas: { funda: 1 } },
      salvacoes: { fortitude: 1, vontade: 1, reflexo: 1 },
  },
  humano: {
      nome: 'Humano',
      atributos: {}, tamanho: 'medio', talento_extra: true },
  elfo: {
      nome: 'Elfo',
      atributos: { destreza: +2, constituicao: -2 }, tamanho: 'medio',
      proficiencia_armas: [ 'espada_longa', 'sabre', 'arco_longo', 'arco_longo_composto', 'arco_curto', 
                            'arco_curto_composto'] },
  gnomo: {
      nome: 'Gnomo',
      atributos: { forca: -2, constituicao: +2 }, tamanho: 'pequeno',
      familiaridade_arma: { martelo_gnomo_com_gancho: true },
      outras_salvacoes: { ilusões: { base: ['fortitude', 'reflexo', 'vontade'], bonus: 2 } },
  },
  meioelfo: {
      nome: 'Meio-Elfo',
      atributos: {}, tamanho: 'medio' },
  meioorc: { 
      nome: 'Meio-Orc',
      atributos: { forca: 2, inteligencia: -2, carisma: -2 }, tamanho: 'medio',
  },
};

// Dados relacionados a classes. 
// TODO passar tudo de classes pra ca.
var tabelas_classes = {
  barbaro: { nome: 'Bárbaro', dados_vida: 12, pontos_pericia: 4, bba: bba_forte, },
  bardo: { nome: 'Bardo', dados_vida: 6, pontos_pericia: 6, bba: bba_medio, },
  clerigo: { nome: 'Clérigo', dados_vida: 8, pontos_pericia: 2,  bba: bba_medio, },
  druida: { nome: 'Druida', dados_vida: 8, pontos_pericia: 4, bba: bba_medio, },
  guerreiro: { nome: 'Guerreiro', dados_vida: 10, pontos_pericia: 2, bba: bba_forte, },
  feiticeiro: { nome: 'Feiticeiro', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco, },
  ladino: { nome: 'Ladino', dados_vida: 6, pontos_pericia: 8, bba: bba_medio, },
  mago: { nome: 'Mago', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco, },
  monge: { nome: 'Monge', dados_vida: 8, pontos_pericia: 4, bba: bba_medio, },
  paladino: { nome: 'Paladino', dados_vida: 10, pontos_pericia: 2, bba: bba_forte, },
  ranger: { nome: 'Ranger', dados_vida: 8, pontos_pericia: 6, bba: bba_forte, },
  // classes NPC
  adepto: { nome: 'Adepto', dados_vida: 6, pontos_pericia: 2, bba: bba_fraco, },
  aristocrata: { nome: 'Aristocrata', dados_vida: 8, pontos_pericia: 4, bba: bba_medio, },
  plebeu: { nome: 'Plebeu', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco, },
  expert: { nome: 'Expert', dados_vida: 6, pontos_pericia: 6, bba: bba_medio, },
  combatente: { nome: 'Combatente', dados_vida: 8, pontos_pericia: 2, bba: bba_forte, },
};

// Tabelas de feiticos. Todas as entradas de por dia e conhecidos devem ter o mesmo numero de caracteres.
var tabelas_feiticos = {
  bardo: { 
      atributo_chave: 'carisma', 
      precisa_conhecer: true,
      possui_nivel_zero: true,
      por_nivel: { 
          1: { por_dia: '2', conhecidos: '4', }, 
          2: { por_dia: '30', conhecidos: '52', }, 
          3: { por_dia: '31', conhecidos: '63', }, 
          4: { por_dia: '320', conhecidos: '632', }, 
          5: { por_dia: '331', conhecidos: '643', }, 
          6: { por_dia: '332', conhecidos: '643', }, 
          7: { por_dia: '3320', conhecidos: '6442', }, 
          8: { por_dia: '3331', conhecidos: '6443', }, 
          9: { por_dia: '3332', conhecidos: '6443', }, 
          10: { por_dia: '33320', conhecidos: '64442', }, 
          11: { por_dia: '33331', conhecidos: '64443', }, 
          12: { por_dia: '33332', conhecidos: '64443', }, 
          13: { por_dia: '333320', conhecidos: '644442', }, 
          14: { por_dia: '433331', conhecidos: '644443', }, 
          15: { por_dia: '443332', conhecidos: '644443', },
          16: { por_dia: '4443320', conhecidos: '6544442', }, 
          17: { por_dia: '4444331', conhecidos: '6554443', }, 
          18: { por_dia: '4444432', conhecidos: '6555443', }, 
          19: { por_dia: '4444443', conhecidos: '6555544', }, 
          20: { por_dia: '4444444', conhecidos: '6555554', }, }, },
  // TODO pensar no dominio.
  clerigo: {
      atributo_chave: 'sabedoria', 
      precisa_conhecer: false,
      possui_nivel_zero: true,
      possui_dominio: true,
      por_nivel: { 
          1: { por_dia: '31', }, 
          2: { por_dia: '42', }, 
          3: { por_dia: '421', }, 
          4: { por_dia: '532', }, 
          5: { por_dia: '5321', }, 
          6: { por_dia: '5332', }, 
          7: { por_dia: '64321', }, 
          8: { por_dia: '64332', }, 
          9: { por_dia: '644321', }, 
          10: { por_dia: '644332', }, 
          11: { por_dia: '6544321', }, 
          12: { por_dia: '6544332', }, 
          13: { por_dia: '65544321', }, 
          14: { por_dia: '65544332', }, 
          15: { por_dia: '655544321', },
          16: { por_dia: '655544332', }, 
          17: { por_dia: '6555544321', }, 
          18: { por_dia: '6555544332', }, 
          19: { por_dia: '6555554433', }, 
          20: { por_dia: '6555554444', }, }, },
  druida: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: true,
      por_nivel: {
          1: { por_dia: '31' },
          2: { por_dia: '42' },
          3: { por_dia: '421' },
          4: { por_dia: '532' },
          5: { por_dia: '5321' },
          6: { por_dia: '5332' },
          7: { por_dia: '64321' },
          8: { por_dia: '64332' },
          9: { por_dia: '644321' },
          10: { por_dia: '644332' },
          11: { por_dia: '6544321' },
          12: { por_dia: '6544332' },
          13: { por_dia: '65544321' },
          14: { por_dia: '65544332' },
          15: { por_dia: '655544321' },
          16: { por_dia: '655544332' },
          17: { por_dia: '6555544321' },
          18: { por_dia: '6555544332' },
          19: { por_dia: '6555554433' },
          20: { por_dia: '6555554444' }, }, },
  feiticeiro: {
      atributo_chave: 'carisma',
      precisa_conhecer: true,
      possui_nivel_zero: true,
      por_nivel: {
          1: { por_dia: '53', conhecidos: '42', },
          2: { por_dia: '64', conhecidos: '52', },
          3: { por_dia: '65', conhecidos: '53', },
          4: { por_dia: '663', conhecidos: '631', },
          5: { por_dia: '664', conhecidos: '642', },
          6: { por_dia: '6653', conhecidos: '7421', },
          7: { por_dia: '6664', conhecidos: '7532', },
          8: { por_dia: '66653', conhecidos: '85321', },
          9: { por_dia: '66664', conhecidos: '85432', },
          10: { por_dia: '666653', conhecidos: '954321', },
          11: { por_dia: '666664', conhecidos: '955432', },
          12: { por_dia: '6666653', conhecidos: '9554321', },
          13: { por_dia: '6666664', conhecidos: '9554432', },
          14: { por_dia: '66666653', conhecidos: '95544321', },
          15: { por_dia: '66666664', conhecidos: '95544432', },
          16: { por_dia: '666666653', conhecidos: '955444321', },
          17: { por_dia: '666666664', conhecidos: '955444332', },
          18: { por_dia: '6666666653', conhecidos: '9554443321', },
          19: { por_dia: '6666666664', conhecidos: '9554443332', },
          20: { por_dia: '6666666666', conhecidos: '9554443333', }, }, },
  paladino: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: false,
      por_nivel: {
          1: { por_dia: '' },
          2: { por_dia: '' },
          3: { por_dia: '' },
          4: { por_dia: '0' },
          5: { por_dia: '0' },
          6: { por_dia: '1' },
          7: { por_dia: '1' },
          8: { por_dia: '10' },
          9: { por_dia: '10' },
          10: { por_dia: '11' },
          11: { por_dia: '110' },
          12: { por_dia: '111' },
          13: { por_dia: '111' },
          14: { por_dia: '2110' },
          15: { por_dia: '2111' },
          16: { por_dia: '2211' },
          17: { por_dia: '2221' },
          18: { por_dia: '3221' },
          19: { por_dia: '3332' },
          20: { por_dia: '3333' }, }, },
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

// Atributos:
// Modificador.
function modificador_atributo(valor_atributo) {
  return Math.floor((valor_atributo - 10) / 2);
}
// Feiticos.
// @return um array de 0-9 onde o 0 eh sempre zerado pois
//         nao ha bonus para nivel 0.
function feiticos_atributo(valor_atributo) {
  // A cada 4 pontos, ganha um novo nos de baixo.
  var modificador = modificador_atributo(valor_atributo);
  var feiticos_nivel = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  for (var nivel = 1; nivel <= 9; ++nivel) {
    if (modificador < nivel) {
      continue;
    }
    feiticos_nivel[nivel] = Math.floor(((modificador - nivel) / 4) + 1);
  }
  return feiticos_nivel;
}

// Salvacoes
function salvacao_forte(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 2) + 2 : 0;
}
function salvacao_fraca(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 3) : 0;
}

// TODO passar para tabela de classes.
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
  nenhum: { nome: 'Nenhum', bonus: 0 },
  broquel: { nome: 'Broquel', bonus: 1 },
  escudo_leve_de_madeira: { nome: 'Escudo Leve de Madeira', bonus: 1 },
  escudo_leve_de_aco: { nome: 'Escudo Leve de Aço', bonus: 1 },
  escudo_pesado_de_aco: { nome: 'Escudo Pesado de Madeira', bonus: 2 },
  escudo_pesado_de_aco: { nome: 'Escudo Pesado de Aço', bonus: 2 },
  escudo_de_corpo: { nome: 'Escudo de Corpo', bonus: 4, maximo_bonus_destreza: 2 },
};

// Mapeia o nome para a chave. Necessario para computar proficiencias.
var tabelas_armas_invertida = {
  // Cada entrada: nome_completo: chave_entrada.
};

// Esta tabela eh composta pela juncao das tabelas de armas simples, comuns e exoticas.
var tabelas_armas = {
  // Cada entrada (dano secundario apenas para armas duplas):
  // chave: { nome, preco, dano: { pequeno, medio}, dano_secundario: {pequeno, medio}, 
  // categorias: { cac, cac_leve, arremesso, distancia},
  //          critico, peso, tipo, incremento_distancia, talento_relacionado, arma_dupla }
};

var tabelas_armas_simples = {
  // Unarmed Attacks
  desarmado: { preco: '0 PO', dano: { pequeno: '1d2', medio: '1d3'},
               categorias: { cac_leve: true },
               critico: '×2', peso: '0', tipo: 'concussao', incremento_distancia: '0 quadrados' },
  manopla: { preco: '2 PO', dano: { pequeno: '1d2', medio: '1d3' },
             categorias: { cac_leve: true },
             critico: '×2', peso: '500g', tipo: 'concussao', },

  //Light Melee Weapons
  adaga: { preco: '2 PO', dano: { pequeno: '1d3', medio: '1d4'} ,
           categorias: { cac_leve: true, arremesso: true } ,
           incremento_distancia: '2 quadrados', critico: '19-20/×2', peso: '0,5kg',
           tipo: 'cortante/perfurante' },

  adaga_de_soco: { nome: 'adaga de soco', preco: '2 PO', dano: { pequeno: '1d3', medio: '1d4'},
                categorias: { cac_leve: true },
                  critico: '×3', peso: '0,5kg', tipo: 'perfurante' },
  manopla_com_cravos: { nome: 'manopla com cravos', preco: '5 PO', dano: { pequeno: '1d3', medio: '1d4'} ,
                        categorias: { cac_leve: true } ,
                        critico: '×2', peso: '0,5kg', tipo: 'perfurante' },
  maca_leve: { nome: 'maça leve', preco: '5 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
               categorias: { cac_leve: true } ,
               critico: '×2', peso: '2kg', tipo: 'concussao' },
  foice_curta: { nome: 'foice curta', preco: '6 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
                  categorias: { cac_leve: true } ,
                  critico: '×2', peso: '1kg', tipo: 'cortante' },

  // One-Handed Melee Weapons
  clava: { preco: '0 PO', dano: { pequeno: '1d4', medio: '1d6' }, critico: '×2',
           categorias: { cac_leve: true, arremesso: true },
           incremento_distancia: '2 quadrados', peso: '1,5Kg', tipo: 'concussao' },
  maca_pesada: { nome: 'maça pesada', preco: '12 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
                 categorias: { cac: true } ,
                 critico: '×2', peso: '4kg', tipo: 'concussao' },
  maca_estrela: { nome: 'maça estrela', preco: '8 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
                  categorias: { cac: true } ,
                  critico: '×2', peso: '3kg', tipo: 'concussao/perfurante' },
  lanca_curta: { nome: 'lança curta', preco: '1 PO', dano: { pequeno: '1d4', medio: '1d6'},
                 categorias: { cac: true, arremesso: true} ,
                 incremento_distancia: '4 quadrados', critico: '×2', peso: '1,5kg', tipo: 'perfurante' },

  // Two-Handed Melee Weapons
  lanca: { nome: 'lança', preco: '2 PO', dano: { pequeno: '1d6', medio: '1d8' }, critico: '×3',
           categorias: { cac: true, arremesso: true },
           incremento_distancia: '4 quadrados', peso: '3kg', tipo: 'perfurante' },
  lanca_longa: { nome: 'lança longa', preco: '5 PO', dano: { pequeno: '1d6', medio: '1d8'},
                 categorias: { cac: true } ,
                 critico: '×3', peso: '4,5kg', tipo: 'perfurante' },
  bordao: { nome: 'bordão', preco: '0 PO', dano: { pequeno: '1d4', medio: '1d6'}, 
            dano_secundario: { pequeno: '1d4', medio: '1d6' }, categorias: { cac: true } ,
            critico: '×2', peso: '2kg', tipo: 'concussao', arma_dupla: true },


  // Ranged Weapons
  besta_pesada: { nome: 'besta pesada', preco: '50 PO', dano: { pequeno: '1d8', medio: '1d10' }, 
                  critico: '19-20/×2', categorias: { distancia: true },
                  incremento_distancia: '24 quadrados', peso: '4kg', tipo: 'perfurante' },
  besta_leve: { nome: 'besta leve', preco: '35 PO', dano: { pequeno: '1d6', medio: '1d8' }, critico: '19-20/×2',
                categorias: { distancia: true },
                incremento_distancia: '16 quadrados', peso: '2kg', tipo: 'perfurante' },
  dardo: { nome: 'dardo', preco: '5 PP', dano: { pequeno: '1d3', medio: '1d4' }, critico: '×2',
           categorias: { arremesso: true },
           incremento_distancia: '4 quadrados', peso: '250g', tipo: 'perfurante' },
  azagaia: { preco: '1 PO', dano: { pequeno: '1d4', medio: '1d6' }, critico: '×2',
             categorias: { arremesso: true },
             incremento_distancia: '6 quadrados', peso: '1Kg', tipo: 'perfurante' },
  funda: { nome: 'funda', preco: '0 PO', dano: { pequeno: '1d3', medio: '1d4' }, critico: '×2',
           categorias: { arremesso: true },
           incremento_distancia: '10 quadrados', peso: '0Kg', tipo: 'concussao' },

//Munição
//Bolts, crossbow (10)  1 gp  — — — — 1 lb. —
//Bullets, sling (10) 1 sp  — — — — 5 lb. —
};

// Martial weapons.
var tabelas_armas_comuns = {

// Martial Weapons Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons, ordenado de acordo com o livro do jogador 3.5, português

  armadura_com_cravos: { nome: 'armadura com cravos', preco: 'especial',
                         dano: { pequeno: '1d4', medio: '1d6' }, critico: '×2',
                         categorias: { cac_leve: true },
                         peso: 'especial', tipo: 'perfurante' },

  escudo_pequeno: { nome: 'escudo pequeno', preco: 'especial', dano: { pequeno: '1d2', medio: '1d3'} ,
                    categorias: { cac_leve: true } ,
                    critico: '×2', peso: 'especial', tipo: 'concussão' },

  escudo_pequeno_com_cavos: { nome: 'escudo pequeno com cravos', preco: 'especial', 
                              dano: { pequeno: '1d3', medio: '1d4'}, categorias: { cac_leve: true } ,
                              critico: '×2', peso: 'especial', tipo: 'perfurante' },

  espada_curta: { nome: 'espada curta', preco: '10 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
                  categorias: { cac_leve: true } ,
                  critico: '19-20/×2', peso: '1kg', tipo: 'perfurante' },

  kukri: { preco: '8 PO', dano: { pequeno: '1d3', medio: '1d4'} ,
           categorias: { cac_leve: true } ,
           critico: '18-20/×2', peso: '1kg', tipo: 'cortante' },

  machadinha: { preco: '6 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
                categorias: { cac_leve: true } ,
                critico: '×3', peso: '1,5kg', tipo: 'cortante' },

  machado_de_arremesso: { nome: 'machado de arremesso', preco: '8 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
                          categorias: { cac_leve: true, arremesso: true} ,
                          incremento_distancia: '2 quadrados', critico: '×2', peso: '1kg', tipo: 'cortante' },

  martelo_leve: { nome: 'martelo leve', preco: '1 PO', dano: { pequeno: '1d3', medio: '1d4'} ,
                  categorias: { cac_leve: true, arremesso: true} ,
                  incremento_distancia: '4 quadrados', critico: '×2', peso: '1kg', tipo: 'concussão' },

  picareta_leve: { nome: 'picareta leve', preco: '4 PO', dano: { pequeno: '1d3', medio: '1d4'} ,
                   categorias: { cac_leve: true } ,
                   critico: '×4', peso: '1,5kg', tipo: 'perfurante' },

  porrete: { nome: 'porrete', preco: '1 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
             categorias: { cac_leve: true } ,
             critico: '×2', peso: '1kg', tipo: 'concussão' },

// One-Handed Melee Weapons

  cimitarra: { nome: 'cimitarra', preco: '15 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
               categorias: { cac: true } ,
               critico: '18-20/×2', peso: '2kg', tipo: 'cortante' },

  escudo_grande: { nome: 'escudo grande', preco: 'especial', dano: { pequeno: '1d3', medio: '1d4'} ,
                   categorias: { cac: true } ,
                   critico: '×2', peso: 'especial', tipo: 'concussão' },

  escudo_grande_com_cravos: { nome: 'escudo grande com cravos', preco: 'especial', dano: { pequeno: '1d4', medio: '1d6'} ,
                 categorias: { cac: true } ,
                 critico: '×2', peso: 'especial', tipo: 'perfurante' },

  espada_longa: { nome: 'espada longa', preco: '15 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
                  categorias: { cac: true },
                  critico: '19-20/×2', peso: '2kg', tipo: 'cortante', },

  machado_de_batalha: { nome: 'machado de batalha', preco: '10 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
                        categorias: { cac: true } ,
                        critico: '×3', peso: '3kg', tipo: 'cortante' },

  mangual: { nome: 'mangual', preco: '8 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
             categorias: { cac: true } ,
             critico: '×2', peso: '2,5kg', tipo: 'concussão' },

  martelo_de_guerra: { nome: 'martelo de guerra', preco: '12 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
                       categorias: { cac: true } ,
                       critico: '×3', peso: '2,5kg', tipo: 'concussão' },

  picareta_pesada: { nome: 'picareta pesada', preco: '8 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
                     categorias: { cac: true } ,
                     critico: '×4', peso: '3kg', tipo: 'perfurante' },

  sabre: { nome: 'sabre', preco: '20 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
           categorias: { cac: true } ,
           critico: '18-20/x2', peso: '1kg', tipo: 'perfurante' },

  tridente: { nome: 'tridente', preco: '15 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
              categorias: { cac: true, arremesso: true} ,
              incremento_distancia: '2 quadrados', critico: '×2', peso: '2kg', tipo: 'perfurante' },


// Two-Handed Melee Weapons
  alabarda: { nome: 'alabarda', preco: '10 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
              categorias: { cac: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante/perfurante' },

  clava_grande: { nome: 'clava grande', preco: '5 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
                  categorias: { cac: true } ,
                  critico: '×2', peso: '4Kg', tipo: 'concussão' },

  espada_larga: { nome: 'espada larga', preco: '50 PO', dano: { pequeno: '1d10', medio: '2d6'} ,
                  categorias: { cac: true } ,
                  critico: '19-20/×2', peso: '4Kg', tipo: 'cortante' },

  falcione: { nome: 'falcione', preco: '75 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
              categorias: { cac: true },
              critico: '18-20/×2', peso: '4kg', tipo: 'cortante', },

  foice_longa: { nome: 'foice longa', preco: '18 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
                 categorias: { cac: true } ,
                 critico: '×4', peso: '10kg', tipo: 'cortante/perfurante' },

  glaive: { nome: 'glaive', preco: '8 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
            categorias: { cac: true } ,
            critico: '×3', peso: '10Kg', tipo: 'cortante' },

  guisarme: { nome: 'guisarme', preco: '9 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
              categorias: { cac: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante' },

  lanca_montada: { nome: 'lança montada', preco: '10 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
                   categorias: { cac: true } ,
                   critico: '×3', peso: '10kg', tipo: 'perfurante' },

  machado_grande: { nome: 'machado grande', preco: '20 PO', dano: { pequeno: '1d10', medio: '1d12'} ,
                    categorias: { cac: true } ,
                    critico: 'x3', peso: '11kg', tipo: 'cortante' },

  mangual_pesado: { nome: 'mangual pesado', preco: '15 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
                    categorias: { cac: true } ,
                    critico: '19-20/x2', peso: '10kg', tipo: 'concussão' },

  ranseur: { nome: 'ranseur', preco: '10 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
             categorias: { cac: true } ,
             critico: 'x3', peso: '11kg', tipo: 'perfurante' },

// Ranged Weapons

  arco_curto: { nome: 'arco curto', preco: '30 PO', dano: { pequeno: '1d4', medio: '1d6' }, critico: '×3',
                categorias: { distancia: true },
                incremento_distancia: '12 quadrados', peso: '1Kg', tipo: 'perfurante' },

  arco_curto_composto: { nome: 'arco curto composto', preco: '75 PO',
                         dano: { pequeno: '1d4', medio: '1d6' }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },

  arco_longo: { nome: 'arco longo', preco: '75 PO', dano: { pequeno: '1d6', medio: '1d8' }, critico: 'x3',
                categorias: { distancia: true },
                incremento_distancia: '20 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto: { nome: 'arco longo composto', preco: '100 PO',
                         dano: { pequeno: '1d6', medio: '1d8' }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

//Arrows (20) 1 gp  — — — — 3 lb. —
};

var tabelas_armas_exoticas = {

// Exotic Weapons  Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons

  kama: { nome: 'kama', preco: '2 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
          categorias: { cac_leve: true } ,
          critico: '×2', peso: '1Kg', tipo: 'cortante' },

  nunchaku: { nome: 'nunchaku', preco: '2 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
              categorias: { cac_leve: true } ,
              critico: '×2', peso: '1Kg', tipo: 'concussão' },

  sai: { nome: 'sai', preco: '1 PO', dano: { pequeno: '1d3', medio: '1d4'} ,
         categorias: { cac_leve: true, arremesso: true } ,
         incremento_distancia: '2 quadrados', critico: '×2', peso: '0,5kg', tipo: 'concussão' },

  siangham: { preco: '3 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
              categorias: { cac_leve: true } ,
              critico: '×2', peso: '0,5kg', tipo: 'perfurante' },

  machadinha: { preco: '6 PO', dano: { pequeno: '1d4', medio: '1d6'} ,
                categorias: { cac_leve: true } ,
                critico: '×3', peso: '1,5kg', tipo: 'cortante' },


// One-Handed Melee Weapons

  chicote: { nome: 'chicote', preco: '1 PO', dano: { pequeno: '1d2', medio: '1d3'} ,
             categorias: { cac: true } ,
             critico: '×2', peso: '1kg', tipo: 'cortante' },

  espada_bastarda: { nome: 'espada bastarda', preco: '35 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
                     categorias: { cac: true } ,
                     critico: '19-20/x2', peso: '3Kg', tipo: 'cortante' },

  machado_de_guerra_anao: { nome: 'machado de guerra anão', preco: '30 PO',
                            dano: { pequeno: '1d8', medio: '1d10'}, categorias: { cac: true } ,
                            critico: '×3', peso: '4Kg', tipo: 'cortante' },

// Two-Handed Melee Weapons


  corrente_com_cravos: { nome: 'corrente com cravos', preco: '25 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
                         categorias: { cac: true },
                         critico: '×2', peso: '10kg', tipo: 'perfurante', },

  espada_de_duas_laminas: { nome: 'espada de duas lâminas', preco: '100 PO',
                            dano: { pequeno: '1d6', medio: '1d8' }, 
                            dano_secundario: {pequeno: '1d6', medio: '1d8' },
                            categorias: { cac: true }, arma_dupla: true,
                            critico: '19-20/x2', peso: '10Kg', tipo: 'cortante' },

  machado_orc_duplo: { nome: 'machado orc duplo', preco: '60 PO',
                       dano: { pequeno: '1d6', medio: '1d8' },
                       dano_secundario: { pequeno: '1d6', medio: '1d8' },
                       arma_dupla: true,
                       categorias: { cac: true }, critico: '×3', peso: '12,5kg', tipo: 'cortante' },

  mangual_atroz: { nome: 'mangual atroz', preco: '90 PO', 
                   dano: { pequeno: '1d6', medio: '1d8'},
                   dano_secundario: { pequeno: '1d6', medio: '1d8'},
                   categorias: { cac: true }, arma_dupla: true,
                   critico: '×2', peso: '10kg', tipo: 'concussão' },

  martelo_gnomo_com_gancho: { nome: 'martelo gnomo com gancho', preco: '20 PO',
                              dano: { pequeno: '1d6', medio: '1d8'},
                              dano_secundario: { pequeno: '1d4', medio: '1d6'},
                              categorias: { cac: true }, arma_dupla: true,
                              critico: '×3/x4', peso: '3kg', tipo: 'concussão e perfurante' },

  urgrosh_anao: { nome: 'urgrosh anão', preco: '50 PO', 
                  dano: { pequeno: '1d6', medio: '1d8'},
                  dano_secundario: { pequeno: '1d4', medio: '1d6'},
                  categorias: { cac: true }, arma_dupla: true,
                  critico: 'x3', peso: '11kg', tipo: 'cortante ou perfurante' },

// Ranged Weapons

  besta_leve_de_repeticao: { nome: 'besta leve de repetição', preco: '250 PO',
                             dano: { pequeno: '1d6', medio: '1d8' }, critico: '19-20/x2',
                             categorias: { distancia: true },
                             incremento_distancia: '16 quadrados', peso: '3Kg', tipo: 'perfurante' },

  besta_pesada_de_repeticao: { nome: 'besta pesada de repetição', preco: '400 PO',
                               dano: { pequeno: '1d8', medio: '1d10' }, critico: '19-20/x2',
                               categorias: { distancia: true },
                               incremento_distancia: '24 quadrados', peso: '11kg', tipo: 'perfurante' },

  besta_de_mao: { nome: 'besta de mão', preco: '100 PO', dano: { pequeno: '1d3', medio: '1d4' },
                  critico: '19-20/x2', categorias: { distancia: true },
                  incremento_distancia: '6 quadrados', peso: '1kg', tipo: 'perfurante' },

  boleadeira: { nome: 'boleadeira', preco: '5 PO', dano: { pequeno: '1d3', medio: '1d4' }, critico: 'x2',
                categorias: { distancia: true },
                incremento_distancia: '2 quadrados', peso: '1kg', tipo: 'concussão' },

  rede: { nome: 'rede', preco: '20 PO', dano: { pequeno: '-', medio: '-' }, critico: '-',
          categorias: { distancia: true },
          incremento_distancia: '2 quadrados', peso: '3kg', tipo: '-' },

  shuriken: { nome: 'shuriken (5)', preco: '1 PO', dano: { pequeno: '1', medio: '1d2' }, critico: 'x2',
              categorias: { distancia: true },
              incremento_distancia: '2 quadrados', peso: '0,25kg', tipo: 'perfurante' },

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
      armas: [ 'clava', 'adaga', 'dardo', 'bordao', 'cimitarra', 'foice_curta',  
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
      armas: [ 'clava', 'adaga', 'besta_pesada', 'besta_leve', 'bordao' ] 
  },
  monge: {
      armas: [ 'clava', 'besta_leve', 'besta_pesada', 'adaga', 'machadinha', 'azagaia', 
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
// { nome, bonus_pericias: { percicia1: valor, pericia2: valor, ... } 
//   complemento, (se o talento precisa de um complemento por exemplo, 
//                 arma de usar arma exotica)
//   guerreiro, indica se o talento pode ser usado em bonus de guerreiro 
//                  (que tambem devera atender aos requisitos)
//   requisitos: { bba, talentos: [], atributos: { nome: valor }, 
//                 nivel: { classe: nivel }, proficiencia_arma, } 
// },
var tabelas_talentos = {
/*
Acuidade com Arma¹² Usar arma, bônus base de ataque +1 Aplica o modificador de Des (em vez de For) para ataques corporais com armas leves
Ataque Desarmado Aprimorado¹ - Considerado armado quando estiver desarmado
Agarrar Aprimorado¹ Des 13, Ataque Desarmado Aprimorado +4 de bônus nos testes de Agarrar e não provoca ataques de oportunidade
Desviar Objetos¹ Des 13, Ataque Desarmado Aprimorado Desvia um ataque à distância por rodada
Apanhar Objetos¹ Des 15, Desviar Objetos, Ataque
Desarmado Aprimorado
Apanha uma arma arremessada ou projétil
Ataque Atordoante¹ Des 13, Sab 13, Ataque Desarmado
Aprimorado, bônus base de ataque +8
Atordoa a vítima com um ataque desarmado
Ataque Poderoso¹ For 13 Substitui bônus de ataque por dano (máximo: bônus base de ataque)
Trespassar¹ Ataque Poderoso Desfere um ataque corporal extra depois de imobilizar um oponente
Trespassar Maior¹ Trespassar, Ataque Poderoso, bônus base
de ataque +4
Trespassar sem limite de ataques por rodada
Encontrão Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de encontrão e não provoca ataques de oportunidade
Atropelar Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de atropelar e não provoca ataques de oportunidade
Separar Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de Separar e não provoca ataques de oportunidade
Combate Montado¹ 1 graduação em Cavalgar Evita os ataques contra a montaria com um teste de Cavalgar
Arquearia Montada¹ Combate Montado Sofre metade das penalidades nos ataques à distância realizados sobre montarias
Investida Montada¹ Combate Montado Pode se deslocar antes e depois de uma investida montada
Investida Implacável¹ Combate Montado, Investida Montada Investidas montadas causam dano dobrado
Pisotear¹ Combate Montado A vítima não pode evitar um atropelamento montada
Bloqueio Ambidestro¹ Combater com Duas Armas A arma da mão inábil concede +1 de bônus de escudo na CA
Armas Maior¹ Des 19, Combater com Duas Armas
Aprimorado, Combater com Duas Armas,
bônus base de ataque +11
Adquire um terceiro ataque com a mão inábil
Contramágica Aprimorada - Contramágica com magias da mesma escola
Corrida - Percorre 5 vezes o deslocamento padrão, +4 de bônus nos testes de Saltar no final de uma
corrida
Dominar Magia² 1° nível de mago Capaz de preparar as magias escolhidas sem um grimório
Especialização em Combate¹ Int 13 Substitui bônus de ataque por CA (máximo 5 pontos)
Desarme Aprimorado¹ Especialização em Combate +4 de bônus nas tentativas de desarme e não provoca ataques de oportunidade
Fintar Aprimorado¹ Especialização em Combate Fintar em combate é uma ação de movimento
Imobilização Aprimorada¹ Especialização em Combate +4 de bônus nas tentativas de imobilização e não provoca ataques de oportunidade
Ataque Giratório¹ Des 13, Especialização em Combate,
Esquiva, Mobilidade, Ataque em
Movimento, bônus base de ataque +4
Realiza um ataque corporal contra cada oponente dentro do alcance
Esquiva¹ Des 13 +1 de bônus de esquiva na CA contra um adversário à sua escolha
Mobilidade¹ Esquiva +4 de bônus de esquiva na CA contra ataques de oportunidade
Ataque em Movimento¹ Mobilidade, bônus base de ataque +4 Capaz de deslocar antes e depois do ataque
Expulsão Adicional³ Habilidade de expulsar ou fascinar
criaturas
4 tentativas diárias adicionais de Expulsar/Fascinar
Expulsão Aprimorada Habilidade de expulsar ou fascinar
criaturas
+1 nível efetivo para testes de expulsão
Especialização em Arma¹² Usar a arma, Foco em Arma, 4° nível de
guerreiro
+2 de bônus no dano com a arma escolhida
Especialização em Arma Maior¹² Usar a arma, Foco em Arma Maior, Foco em Arma, Especialização em Arma, 12° nível de guerreiro
+4 de bônus no dano com a arma escolhida
Foco em Magia² - +1 de bônus na CD dos testes de resistência contra uma escola de magia específica
Foco em Magia Maior² Foco em Magia na escola +1 de bônus na CD dos testes de resistência contra uma escola de magia específica
Foco em Perícia² - +3 de bônus nos teste da perícia escolhida
Fortitude Maior - +2 de bônus nos teste de resistência de Fortitude
Ignorar Componentes Materiais - Conjura magias ignorando os componentes materiais
Iniciativa Aprimorada¹ - +4 de bônus nos testes de Iniciativa
Liderança 6° nível de personagem Atrai parceiros e seguidores
Lutar às Cegas¹ - Jogar novamente chance de falha por camuflagem
Magia Natural Sab 13, Habilidade Forma Selvagem Capaz de lançar magias na forma selvagem
Magia Penetrante - +2 de bônus nos testes de conjurador contra Resistência à Magia
Magia Penetrante Maior Magia Penetrante +4 de bônus nos testes de conjurador contra Resistência à Magia
Magia em Combate - +4 de bônus nos teste de Concentração para conjurar na defensiva
Negociador - +2 de bônus nos teste de Diplomacia e Sentir Motivação
Potencializar Invocação Foco em Magia (conjuração) As criaturas invocadas recebem +4 For e +4 Cons
Rapidez de Recarga¹ Usar Arma Simples (besta) Recarrega bestas mais rapidamente
Rastrear - Utiliza Sobrevivência para rastrear
Reflexos em Combate¹ - Ataques de oportunidade adicionais
Reflexos Rápidos - +2 de bônus nos testes de resistência de Reflexos
Saque Rápido¹ Bônus base de ataque +1 Saca uma arma branca como ação livre
sorrateiro - +2 nos testes de Esconder-se e Furtividade
Sucesso Decisivo Aprimorado¹² Usar a arma, bônus base de ataque +8 Dobra a margem de ameaça da arma
Tiro Certeiro¹ - +1 de bônus nos ataques à distância e dano contra alvos num raio de 9 metros
Tiro Preciso¹ Tiro Certeiro Anula a penalidade por disparar contra um adversário em combate corporal com um
aliado (-4)
Tiro Rápido¹ Des 13, Tiro Certeiro Um ataque à distância adicional por rodada
Tiro Longo¹ Tiro Certeiro Aumenta o incremento de distância em 50% ou 100%
Tiro em Movimento¹ Des 13, Esquiva, Mobilidade, Tiro Certeiro,
bônus base de ataque +4
Pode se deslocar antes e depois de um ataque à distância
Tiro Múltiplo¹ Des 17, Tiro Certeiro, Tiro Rápido, bônus
base de ataque +6
Dispara duas ou mais flechas simultaneamente
Tiro Preciso Aprimorado¹ Des 19, Tiro Certeiro, Tiro Preciso, bônus
base de ataque +11
Ignorar qualquer cobertura ou camuflagem (exceto total) para ataques à distância
Tolerância - +4 de bônus nos testes para resistir ao dano por contusão
Duro de Matar Tolerância Permanece consciente entre -1 e -9 PV
Usar Arma Comum² - Não sofre penalidade nos ataques com uma arma comum específica
Usar Arma Exótica¹² Bônus base de ataque +1 Não sofre penalidade nos ataques com uma arma exótica específica
Usar Armas Simples - Não sofre penalidades nos ataques com armas simples
Usar Armadura (leve) - Não sofre penalidade de armadura nas jogadas de ataque
Usar Armadura (média) - Não sofre penalidade de armadura nas jogadas de ataque
Usar Armadura (pesada) - Não sofre penalidade de armadura nas jogadas de ataque
Usar Escudo Não sofre penalidade de armadura nas jogadas de ataque
Ataque com Escudo
Aprimorado¹
Usar Escudo Conserva o bônus do escudo na CA quando ataca com ele
Usar Escudo de Corpo Usar Escudo Não sofre penalidade de armadura nas jogadas de ataque
Vitalidade³ - +3 pontos de vida
Vontade de Ferro - +2 de bônus nos testes de resistência de Vontade
Talentos de Criação de Item Pré-requisitos Benefícios
Criar Armaduras e Armas Mágicas 5° nível de conjurador Criar armas, armaduras e escudos mágicos
Criar Bastão 9° nível de conjurador Criar bastões mágicos
Criar Cajado 12° nível de conjurador Criar cajados mágicos
Criar Item Maravilhoso 3° nível de conjurador Criar itens mágicos maravilhosos
Criar Varinha 5° nível de conjurador Criar varinhas mágicas
Escrever Pergaminho 1° nível de conjurador Criar pergaminhos mágicos
Forjar Anel 12° nível de conjurador Criar anéis mágicos
Preparar Poção 3° nível de conjurador Criar poções mágicas
Talentos Metamágicos Pré-requisitos Benefícios
Acelerar Magia - Conjura a magia como ação livre
Ampliar Magia - Dobre a área da magia
Aumentar Magia - Dobra o alcance da magia
Elevar Magia - Conjura a magia num nível mais elevado
Estender Magia - Dobra a duração da magia
Magia Sem Gestos - Ignora os componentes gestuais da magia
Magia Silenciosa - Ignora os componentes verbais da magia
Maximizar Magia - Maximiza todas as variáveis numéricas dos efeitos da magia
Potencializar Magia - Aumenta em 50% todas as variáveis numéricas dos efeitos da magia


*/
  acrobatico: { 
      nome: 'Acrobático',
      bonus_pericias: { saltar: 2, acrobacias: 2 } },
  afinidade_com_animais: {
      nome: 'Afinidade com Animais',
      bonus_pericias: { cavalgar: 2, adestrar_animais: 2 } },
  agil: {
      nome: 'Ágil',
      bonus_pericias: { equilibrio: 2, arte_da_fuga: 2 } },
  aptidao_magica: {
      nome: 'Aptidão Mágica',
      bonus_pericias: { identificar_magia: 2, usar_instrumento_magico: 2 } },
  atletico: { 
      nome: 'Atlético',
      bonus_pericias: { escalar: 2, natacao: 2 } },
  auto_suficiente: {
      nome: 'Auto-Suficiente',
      bonus_pericias: { cura: 2, sobrevivencia: 2 } },
  dedos_lepidos: {
      nome: 'Dedos Lépidos',
      bonus_pericias: { operar_mecanismos: 2, abrir_fechaduras: 2 } },
  diligente: {
      nome: 'Diligente',
      bonus_pericias: { avaliacao: 2, decifrar_escrita: 2 } },
  fraudulento: {
      nome: 'Fraudulento',
      bonus_pericias: { disfarces: 2, falsificacao: 2 } }, 
  investigador: {
      nome: 'Investigador',
      bonus_pericias: { obter_informacao: 2, procurar: 2 } },
  maos_levels: {
      nome: 'Mãos Leves',
      bonus_pericias: { prestidigitacao: 2, usar_cordas: 2 } },
  persuasivo: {
      nome: 'Persuasivo',
      bonus_pericias: { blefar: 2, intimidacao: 2 } },
  prontidao: {
      nome: 'Prontidão',
      bonus_pericias: { ouvir: 2, observar: 2 } },
  // Simple Weapon Proficiency
  usar_armas_simples: { nome: 'Usar armas simples' },

  // Martial weapon proficiency
  usar_arma_comum: { nome: 'Usar arma comum', complemento: true }, 

  // Exotic Weapon Proficiency
  usar_arma_exotica: { 
      nome: 'Usar arma exótica', complemento: true,
      requisitos: { bba: 1 } },

  // Reduz penalidade ao usar duas maos em 2.
  combater_duas_armas: { 
      nome: 'Combater com duas armas',
      requisitos: { atributos: { destreza: 15 } },
      guerreiro: true, },
  // Ataque adicional com a segunda mao.
  combater_duas_armas_aprimorado: {
      nome: 'Combater com duas armas aprimorado',
      requisitos: { atributos: { destreza: 17 }, bba: 6, talentos: [ 'combater_duas_armas'] },
      guerreiro: true, },
  // +1 de bônus nas jogadas de ataque com a arma escolhida.
  foco_em_arma: {
      nome: 'Foco em arma',
      complemento: true,
      requisitos: { bba: 1, proficiencia_arma: true },
      guerreiro: true, },
  // +2 de bônus nas jogadas de ataque com a arma escolhida
  foco_em_arma_maior: {
      nome: 'Foco em arma maior',
      complemento: true,
      requisitos: { talentos: [ 'foco_em_arma'], nivel: { guerreiro: 8 } },
      guerreiro: true },
};

// A penalidade de armadura indica o multiplicador de penalidade da armadura (default 0).
var tabelas_pericias = {
  abrir_fechaduras: { 
      nome: 'Abrir Fechaduras', 
      classes: [ 'ladino', ], 
      sem_treinamento: false, habilidade: 'destreza' },
  acrobacias: {
      nome: 'Acrobacias', 
      classes: [ 'bardo', 'monge', 'ladino' ],
      sem_treinamento: false, habilidade: 'destreza', penalidade_armadura: 1 },
  adestrar_animais: {
      nome: 'Adestrar Animais', 
      classes: [ 'barbaro', 'druida', 'guerreiro', 'paladino', 'ranger' ], 
      sem_treinamento: false, habilidade: 'carisma' },
  arte_da_fuga: {
      nome: 'Arte da Fuga', 
      classes: [ 'bardo', 'monge', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  atuacao: {
      nome: 'Atuação', 
      classes: [ 'bardo', 'monge', 'ladino', ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  avaliacao: {
      nome: 'Avaliação', 
      classes: [ 'bardo', 'ladino' ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  blefar: {
      nome: 'Blefar', 
      classes: [  'bardo', 'ladino', 'feiticeiro' ], 
      sem_treinamento: true,  habilidade: 'carisma' },
  cavalgar: {
      nome: 'Cavalgar', 
      classes: [  'barbaro', 'druida', 'guerreiro', 'paladino', 'ranger' ], 
      sem_treinamento: true,  habilidade: 'destreza' },
  concentracao: {
      nome: 'Concentração', 
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ranger', 'feiticeiro', 'mago' ], 
      sem_treinamento: true,  habilidade: 'constituicao' },
  conhecimento_arcano: {
      nome: 'Conhecimento (arcano)',
      classes: [  'bardo', 'clerigo', 'monge', 'feiticeiro', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_arquitetura_e_engenharia: {
      nome: 'Conhecimento(arquitetura_e_engenharia)',
      classes: [  'bardo', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_geografia: {
      nome: 'Conhecimento (geografia)',
      classes: [  'bardo', 'ranger', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_história: {
      nome: 'Conhecimento (história)',
      classes: [  'bardo', 'clerigo', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_local: {
      nome: 'Conhecimento (local)',
      classes: [  'bardo', 'ladino', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_masmorras: {
      nome: 'Conhecimento (masmorras)',
      classes: [  'bardo', 'ranger', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_natureza: {
      nome: 'Conhecimento (natureza)',
      classes: [  'bardo', 'druida', 'ranger', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_nobreza_e_realeza: {
      nome: 'Conhecimento (nobreza e realeza)',
      classes: [  'bardo', 'paladino', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_planos: {
      nome: 'Conhecimento (planos)',
      classes: [  'bardo', 'clerigo', 'mago' ],
      habilidade: 'inteligencia' },
  conhecimento_religiao: {
      nome: 'Conhecimento (religião)',
      classes: [  'bardo', 'clerigo', 'monge', 'paladino', 'mago' ],
      habilidade: 'inteligencia' },
  cura: {
      nome: 'Cura',
      classes: [  'clerigo', 'druida', 'paladino', 'ranger' ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  decifrar_escrita: {
      nome: 'Decifrar Escrita',
      classes: [  'bardo', 'ladino', 'mago' ],
      habilidade: 'inteligencia' },
  diplomacia: {
      nome: 'Diplomacia',
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ladino', ],
      sem_treinamento: true, habilidade: 'carisma' },
  disfarces: {
      nome: 'Disfarces',
      classes: [  'bardo', 'ladino', ],
      sem_treinamento: true, habilidade: 'carisma' },
  equilibrio: {
      nome: 'Equilíbrio',
      classes: [  'bardo', 'monge', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  escalar: {
      nome: 'Escalar',
      classes: [  'barbaro', 'bardo', 'guerreiro', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 1 },
  esconderse: {
      nome: 'Esconder-se',
      classes: [  'bardo', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  falar_idioma: {
      nome: 'Falar Idioma',
      classes: [ 'bardo'],
      habilidade: 'sabedoria' },
  falsificacao: {
      nome: 'Falsificação',
      classes: [  'ladino', ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  furtividade: {
      nome: 'Furtividade',
      classes: [  'bardo', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  identificar_magia: {
      nome: 'Identificar magia',
      classes: [  'bardo', 'clerigo', 'druida', 'feiticeiro', 'mago'],
      habilidade: 'inteligencia' },
  intimidacao: {
      nome: 'Intimidação',
      classes: [  'barbaro', 'guerreiro', 'ladino', ],
      sem_treinamento: true, habilidade: 'carisma' },
  natacao: {
      nome: 'Natação',
      classes: [  'barbaro', 'bardo', 'druida', 'guerreiro', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 2 },
  observar: {
      nome: 'Observar',
      classes: [  'druida', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  obter_informacao: {
      nome: 'Obter Informação',
      classes: [  'bardo', 'ladino', ],
      sem_treinamento: true, habilidade: 'carisma' },
  oficios: {
      nome: 'Ofícios',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge', 'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  operar_mecanismo: {
      nome: 'Operar Mecanismo',
      classes: [  'ladino'],
      habilidade: 'inteligencia' },
  ouvir: {
      nome: 'Ouvir',
      classes: [  'barbaro', 'bardo', 'druida', 'monge', 'ranger', 'ladino', ],
       sem_treinamento: true, habilidade: 'sabedoria' },
  prestidigitacao: {
      nome: 'Prestidigitação',
      classes: [  'bardo', 'ladino'],
      habilidade: 'destreza', penalidade_armadura: 1 },
  procurar: {
      nome: 'Procurar',
      classes: [  'ranger', 'ladino', ],
       sem_treinamento: true,habilidade: 'inteligencia' },
  profissao: {
      nome: 'Profissão',
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago'],
      habilidade: 'sabedoria' },
  saltar: {
      nome: 'Saltar',
      classes: [  'barbaro', 'bardo', 'guerreiro', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 1 },
  sentir_motivacao: {
      nome: 'Sentir Motivação',
      classes: [  'bardo', 'monge', 'paladino', 'ladino', ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  sobrevivência: {
      nome: 'Sobrevivência',
      classes: [  'barbaro', 'druida', 'ranger', ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  usar_cordas: {
      nome: 'Usar Cordas',
      classes: [  'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza' },
  usar_instrumento_magico: {
      nome: 'Usar Instrumento Mágico',
      classes: [  'bardo', 'ladino' ],
      habilidade: 'carisma' },
};

// Todos os elementos devem pertencer a classe divs-principais e 
// nao podem ser filhos de um elemento da classe divs-principais.
var tabelas_visoes = {
  completo: {
    nome: 'Completo',
    esconder: { classes: [], elementos: [] }, 
    mostrar: { classes: ['divs-principais'], elementos:[] },
  },
  combate: {
    nome: 'Combate',
    esconder: { classes: ['divs-principais'], elementos: [] }, 
    mostrar: { classes: [], elementos:['div-pontos-vida', 'div-ataque', 'div-defesa'] },
  },
  pericias: {
    nome: 'Perícias',
    esconder: { classes: ['divs-principais'], elementos: [] }, 
    mostrar: { classes: [], elementos:[ 'div-pericias' ] },
  },
  feiticos: {
    nome: 'Feitiços',
    esconder: { classes: ['divs-principais'], elementos: [] }, 
    mostrar: { classes: [], elementos:[ 'div-feiticos' ] },
  },
};

var tabelas_atributos = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constitruição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma",
};

var tabelas_atributos_invertidos = {
  'Força': 'forca',
  'Destreza': 'destreza',
  'Constitruição': 'constituicao',
  'Inteligência': 'inteligencia',
  'Sabedoria': 'sabedoria',
  'Carisma': 'carisma',
};
