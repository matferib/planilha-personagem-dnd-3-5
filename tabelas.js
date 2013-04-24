// Dados das racas.
var tabelas_raca = {
  aarakokra: {
      nome: 'Aarakokra',
      origem: { livro: 'Races of Faerun', pagina: '130' },
      ajuste_nivel: 2, armadura_natural: 1,
      movimento: { terrestre: 4, aereo: 18 },
      atributos: { forca: -2, destreza: 4 }, tamanho: 'medio',
      proficiencia_armas: [ 'azagaia' ], // Javelin em ingles.
      //converte, add bonus racial p pericias, soma tbm no total, transforma em pericia de classe
      bonus_pericias: { oficios: 2, conhecimento_natureza: 2, ouvir: 2, observar: 2 },
      arma_natural: { garra: { nome: 'Garra', dano: '1d4' } }, 
    },
  anao: {
      nome: 'Anão',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 4 },
      atributos: {constituicao: 2, carisma: -2}, tamanho: 'medio',
      familiaridade_arma: { machado_de_guerra_anao: true, urgrosh_anao: true },
      outras_salvacoes: { veneno: { base: ['fortitude'], bonus: 2 }, 
                          magias: { base: ['fortitude', 'reflexo', 'vontade' ], bonus: 2, } },
  },
  goblin: {
      nome: 'Goblin',
      origem: { livro: 'Monster Manual', pagina: '133' },
      movimento: { terrestre: 6 },
      atributos: { forca: -2, destreza: 2, carisma: -2 }, tamanho: 'pequeno',
      bonus_pericias: { furtividade: 4, cavalgar: 4 },
  },
  halfling: {
      nome: 'Halfling',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 4 },
      atributos: { forca: -2, destreza: 2}, tamanho: 'pequeno',
      bonus_ataque: { categorias: { arremesso: 1 }, armas: { funda: 1 } },
      salvacoes: { fortitude: 1, vontade: 1, reflexo: 1 },
  },
  humano: {
      nome: 'Humano',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: {}, tamanho: 'medio', talento_extra: true, pontos_pericia: 1 },
  elfo: {
      nome: 'Elfo',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: { destreza: +2, constituicao: -2 }, tamanho: 'medio',
      proficiencia_armas: [ 'espada_longa', 'sabre', 'arco_longo', 'arco_longo_composto', 'arco_curto', 
                            'arco_curto_composto'] },
  gnomo: {
      nome: 'Gnomo',
      origem: { livro: 'Livro do Jogador', pagina: '' }, 
      movimento: { terrestre: 4 },
      atributos: { forca: -2, constituicao: +2 }, tamanho: 'pequeno',
      familiaridade_arma: { martelo_gnomo_com_gancho: true },
      outras_salvacoes: { ilusões: { base: ['fortitude', 'reflexo', 'vontade'], bonus: 2 } },
  },
  meioelfo: {
      nome: 'Meio-Elfo',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: {}, tamanho: 'medio' },
  meioorc: { 
      nome: 'Meio-Orc',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: { forca: 2, inteligencia: -2, carisma: -2 }, tamanho: 'medio',
  },
};

// Dados relacionados a classes. 
// TODO passar tudo de classes pra ca.
var tabelas_classes = {
  barbaro: { nome: 'Bárbaro', dados_vida: 12, pontos_pericia: 4, bba: bba_forte, },
  bardo: { nome: 'Bardo', dados_vida: 6, pontos_pericia: 6, bba: bba_medio, },
  clerigo: { nome: 'Clérigo', dados_vida: 8, pontos_pericia: 2,  bba: bba_medio,
    especiais: {
      1: [ 'expulsar_fascinar_mortos_vivos' ],
    },
  },
  druida: { nome: 'Druida', dados_vida: 8, pontos_pericia: 4, bba: bba_medio,
    especiais: {
      1: [ 'companheiro_animal', 'senso_natureza', 'empatia_natureza' ],
      2: [ 'caminho_floresta' ],
      3: [ 'ratros_invisivel' ],
      4: [ 'resistir_tentacao_natureza' ],
      5: [ 'forma_selvagem' ],
    },
  },
  guerreiro: { nome: 'Guerreiro', dados_vida: 10, pontos_pericia: 2, bba: bba_forte, },
  feiticeiro: { nome: 'Feiticeiro', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco, },
  ladino: { nome: 'Ladino', dados_vida: 6, pontos_pericia: 8, bba: bba_medio, 
    especiais: {
      1: [ 'ataque_furtivo', 'encontrar_armadilha' ],
      2: [ 'evasao' ],
      3: [ 'ataque_furtivo', 'sentir_armadilha' ],
      4: [ 'esquiva_sobrenatural' ],
      5: [ 'ataque_furtivo' ],
    },
  },
  mago: { nome: 'Mago', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco, },
  monge: { nome: 'Monge', dados_vida: 8, pontos_pericia: 4, bba: bba_medio, },
  paladino: { nome: 'Paladino', dados_vida: 10, pontos_pericia: 2, bba: bba_forte, },
  ranger: { nome: 'Ranger', dados_vida: 8, pontos_pericia: 6, bba: bba_forte, },
  // classes NPC
  adepto: { nome: 'Adepto', mestre: true, dados_vida: 6, pontos_pericia: 2, bba: bba_fraco, },
  aristocrata: { nome: 'Aristocrata', mestre: true, dados_vida: 8, pontos_pericia: 4, bba: bba_medio, },
  plebeu: { nome: 'Plebeu', mestre: true, dados_vida: 4, pontos_pericia: 2, bba: bba_fraco, },
  expert: { nome: 'Expert', mestre: true, dados_vida: 6, pontos_pericia: 6, bba: bba_medio, },
  combatente: { nome: 'Combatente', mestre: true, dados_vida: 8, pontos_pericia: 2, bba: bba_forte, },
  // Prestigio.
  dragao_purpura: { nome: 'Dragão Púrpura', prestigio: true, dados_vida: 10, pontos_pericia: 2, bba: bba_forte,
    especiais: {
      1: [ 'escudo_heroico', 'grito_guerra' ],
      2: [ 'inspirar_coragem' ],
      3: [ 'medo' ],
      4: [ 'inspirar_coragem', 'juramento_furia', ],
      5: [ 'resistencia_final' ],
    },
    requisitos: {
      tendencia: [ 'NB', 'N', 'LB'],
      regiao: [ 'Cormyr'],
      bba: 4,
      // TODO: diplomacia ou intimidar 1.
      pericias: { diplomacia: 1, ouvir: 2, cavalgar: 2, observar: 2, },
      talentos: [ 'lideranca', 'combate_montado' ],
      outros: 'Deve ser membro dos Dragões Púrpura',
    },
  },
};

var tabelas_especiais = {
  expulsar_fascinar_mortos_vivos: { nome: 'Expulsar/fascinar mortos vivos', },
  companheiro_animal: { nome: 'Companheiro animal', },
  senso_natureza: { nome: 'Senso da natureza', },
  empatia_natureza: { nome: 'Empatia com a natureza', },
  caminho_floresta: { nome: 'Caminho da floresta', },
  ratros_invisivel: { nome: 'Rastro invisível', },
  resistir_tentacao_natureza: { nome: 'Resistir tentação da natureza', },
  forma_selvagem: { nome: 'Forma selvagem', },
  ataque_furtivo: { nome: 'Ataque furtivo', },
  encontrar_armadilha: { nome: 'Encontrar armadilha', },
  evasao: { nome: 'Evasão', },
  sentir_armadilha: { nome: 'Sentir armadilha', },
  esquiva_sobrenatural: { nome: 'Esquiva sobrenatural', },
  escudo_heroico: { nome: 'Escudo Heróico', },
  grito_guerra: { nome: 'Grito de Guerra', },
  inspirar_coragem: { nome: 'Inspirar Coragem', },
  medo: { nome: 'Medo', },
  juramento_furia: { nome: 'Juramento de Fúria', },
  resistencia_final: {nome: 'Resistência Final', },
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
  mago: {
      atributo_chave: 'inteligencia',
      precisa_conhecer: false,
      possui_nivel_zero: true,
      por_nivel: {
          1:  { por_dia: '31', },
          2:  { por_dia: '42', },
          3:  { por_dia: '421', },
          4:  { por_dia: '432', },
          5:  { por_dia: '4321', },
          6:  { por_dia: '4332', },
          7:  { por_dia: '44321', },
          8:  { por_dia: '44332', },
          9:  { por_dia: '444321', },
          10: { por_dia: '444332', },
          11: { por_dia: '4444321', },
          12: { por_dia: '4444332', },
          13: { por_dia: '44444321', },
          14: { por_dia: '44444332', },
          15: { por_dia: '444444321', },
          16: { por_dia: '444444332', },
          17: { por_dia: '4444444321', },
          18: { por_dia: '4444444332', },
          19: { por_dia: '4444444433', },
          20: { por_dia: '4444444444', }, }, },
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

var tabelas_nome_salvacao = {
  fortitude: 'Fortitude',
  reflexo: 'Reflexo',
  vontade: 'Vontade',
};

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
  // Prestigio.
  dragao_purpura: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
};

// Tabelas de tamanho.
var tabelas_tamanho = {
minusculo: { nome: 'Minúsculo', ataque_defesa: 8, agarrar: -16 },
  diminuto: { nome: 'Diminuto', ataque_defesa: 4, agarrar: -12 },
  miudo: { nome: 'Miúdo', ataque_defesa: 2, agarrar: -8 },
  pequeno: { nome: 'Pequeno', ataque_defesa: 1, agarrar: -4 },
  medio: { nome: 'Médio', ataque_defesa: 0, agarrar: 0 },
  grande: { nome: 'Grande', ataque_defesa: -1, agarrar: 4 },
  enorme: { nome: 'Enorme', ataque_defesa: -2, agarrar: 8 },
  imenso: { nome: 'Imenso', ataque_defesa: -4, agarrar: 12 },
  colossal: { nome: 'Colossal', ataque_defesa: -8, agarrar: 16 },
};

var tabelas_armaduras_leves = {
  nenhuma: {
    nome: 'Nenhuma', bonus: 0, preco: '0 PO' },
  acolchoada: {
    nome: 'Acolchoada', bonus: 1, maximo_bonus_destreza: 8, preco: '5 PO' },
  couro: {
    nome: 'Couro', bonus: 2,  maximo_bonus_destreza: 6, preco: '10 PO' },
  couro_batido: {
    nome: 'Couro Batido', bonus: 3, maximo_bonus_destreza: 5, preco: '25 PO' },
  camisao_cota_de_malha: {
    nome: 'Camisão de Cota de Malha', bonus: 4, maximo_bonus_destreza: 4, preco: '100 PO' },
};

var tabelas_armaduras_medias = {
  gibao_de_peles: {
    nome: 'Gibão de Peles', bonus: 3, maximo_bonus_destreza: 4, preco: '15 PO' },
  brunea: {
    nome: 'Brunea', bonus: 4, maximo_bonus_destreza: 3, preco: '50 PO' },
  cota_de_malha: {
    nome: 'Cota de Malha', bonus: 5, maximo_bonus_destreza: 2, preco: '150 PO' },
  peitoral_de_aco: {
    nome: 'Peitoral de Aço', bonus: 5, maximo_bonus_destreza: 3, preco: '200 PO' },
};

var tabelas_armaduras_pesadas = {
  cota_de_talas: {
    nome: 'Cota de Talas', bonus: 6, maximo_bonus_destreza: 0, preco: '200 PO' },
  loriga_segmentada: {
    nome: 'Loriga Segmentada', bonus: 6, maximo_bonus_destreza: 1, preco: '250 PO' },
  meia_armadura: {
    nome: 'Meia Armadura', bonus: 7, maximo_bonus_destreza: 0, preco: '600 PO' },
  armadura_de_batalha: {
    nome: 'Armadura de Batalha', bonus: 8, maximo_bonus_destreza: 1, preco: '1500 PO' },
};

// Tabelas de armaduras, construida dinamicamente atraves das tabelas_armaduras_*.
var tabelas_armaduras = {
};

// Mapeia o nome para a chave. Construida dinamicamente.
var tabelas_armaduras_invertida = {
  // Cada entrada: nome_completo: chave_entrada.
};

// Tabelas de escudos (TODO terminar outros atributos).
var tabelas_escudos = {
  nenhum: { nome: 'Nenhum', bonus: 0, preco: '0 PO' },
  broquel: { nome: 'Broquel', bonus: 1, preco: '15 PO' },
  leve_madeira: { nome: 'Escudo Leve de Madeira', bonus: 1, preco: '3 PO' },
  leve_aco: { nome: 'Escudo Leve de Aço', bonus: 1, preco: '9 PO' },
  pesado_madeira: { nome: 'Escudo Pesado de Madeira', bonus: 2, preco: '7 PO' },
  pesado_aco: { nome: 'Escudo Pesado de Aço', bonus: 2, preco: '20 PO' },
  corpo: { nome: 'Escudo de Corpo', bonus: 4, maximo_bonus_destreza: 2, preco: '30 PO' },
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
              categorias: { cac_duas_maos: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante/perfurante' },

  clava_grande: { nome: 'clava grande', preco: '5 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
                  categorias: { cac_duas_maos: true } ,
                  critico: '×2', peso: '4Kg', tipo: 'concussão' },

  espada_larga: { nome: 'espada larga', preco: '50 PO', dano: { pequeno: '1d10', medio: '2d6'} ,
                  categorias: { cac_duas_maos: true } ,
                  critico: '19-20/×2', peso: '4Kg', tipo: 'cortante' },

  falcione: { nome: 'falcione', preco: '75 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
              categorias: { cac_duas_maos: true },
              critico: '18-20/×2', peso: '4kg', tipo: 'cortante', },

  foice_longa: { nome: 'foice longa', preco: '18 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
                 categorias: { cac_duas_maos: true } ,
                 critico: '×4', peso: '10kg', tipo: 'cortante/perfurante' },

  glaive: { nome: 'glaive', preco: '8 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
            categorias: { cac_duas_maos: true } ,
            critico: '×3', peso: '10Kg', tipo: 'cortante' },

  guisarme: { nome: 'guisarme', preco: '9 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
              categorias: { cac_duas_maos: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante' },

  lanca_montada: { nome: 'lança montada', preco: '10 PO', dano: { pequeno: '1d6', medio: '1d8'} ,
                   categorias: { cac_duas_maos: true } ,
                   critico: '×3', peso: '10kg', tipo: 'perfurante' },

  machado_grande: { nome: 'machado grande', preco: '20 PO', dano: { pequeno: '1d10', medio: '1d12'} ,
                    categorias: { cac_duas_maos: true } ,
                    critico: 'x3', peso: '11kg', tipo: 'cortante' },

  mangual_pesado: { nome: 'mangual pesado', preco: '15 PO', dano: { pequeno: '1d8', medio: '1d10'} ,
                    categorias: { cac_duas_maos: true } ,
                    critico: '19-20/x2', peso: '10kg', tipo: 'concussão' },

  ranseur: { nome: 'ranseur', preco: '10 PO', dano: { pequeno: '1d6', medio: '2d4'} ,
             categorias: { cac_duas_maos: true } ,
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
                         categorias: { cac_duas_maos: true },
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
// TODO mover para a tabela de classes.
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
  },

  // Prestigio.
  dragao_purpura: {
  },
};

// Cada entrada tem suas dependencias.
// { nome, 
//   bonus_pericias: { percicia1: valor, pericia2: valor, ... },
//   bonus_pv, (quantos pontos de vida o talento concede).
//   bonus_salvacao: { tipo: valor }, (quantos pontos o talento fornece em salvacoes).
//   bonus_iniciativa,  (bonus que o talento fornece na iniciativa do personagem)
//   cumulativo, (se o talento puder ser selecionado mais de uma vez e acumular.
//                eg vitalidade).
//   multiplas_vezes, (se o talento puder ser selecionado mais de uma vez com 
//                     complementos diferentes - eg foco em arma)
//   complemento, (se o talento precisa de um complemento por exemplo, 
//                 usar arma exotica. Pode ser arma, arma_leve, arma_exotica, 
//                 arma_comum)
//   guerreiro, indica se o talento pode ser usado em bonus de guerreiro 
//                  (que tambem devera atender aos requisitos)
//   requisitos: { bba, talentos: [], atributos: { nome: valor }, 
//                 nivel: { classe: nivel }, proficiencia_arma, arma_leve, } 
// },
var tabelas_talentos = {
/*
Ataque Desarmado Aprimorado¹ - Considerado armado quando estiver desarmado
Agarrar Aprimorado¹ Des 13, Ataque Desarmado Aprimorado +4 de bônus nos testes de Agarrar e não provoca ataques de oportunidade
Desviar Objetos¹ Des 13, Ataque Desarmado Aprimorado Desvia um ataque à distância por rodada
Apanhar Objetos¹ Des 15, Desviar Objetos, Ataque Desarmado Aprimorado Apanha uma arma arremessada ou projétil
Ataque Atordoante¹ Des 13, Sab 13, Ataque Desarmado
Aprimorado, bônus base de ataque +8 Atordoa a vítima com um ataque desarmado
Trespassar¹ Ataque Poderoso Desfere um ataque corporal extra depois de imobilizar um oponente
Trespassar Maior¹ Trespassar, Ataque Poderoso, bônus base de ataque +4
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
Aprimorado, Combater com Duas Armas, bônus base de ataque +11 Adquire um terceiro ataque com a mão inábil
Contramágica Aprimorada - Contramágica com magias da mesma escola
Dominar Magia² 1° nível de mago Capaz de preparar as magias escolhidas sem um grimório
Especialização em Combate¹ Int 13 Substitui bônus de ataque por CA (máximo 5 pontos)
Desarme Aprimorado¹ Especialização em Combate +4 de bônus nas tentativas de desarme e não provoca ataques de oportunidade
Fintar Aprimorado¹ Especialização em Combate Fintar em combate é uma ação de movimento
Imobilização Aprimorada¹ Especialização em Combate +4 de bônus nas tentativas de imobilização e não provoca ataques de oportunidade
Ataque Giratório¹ Des 13, Especialização em Combate, Esquiva, Mobilidade, Ataque em Movimento, bônus base de ataque +4 Realiza um ataque corporal contra cada oponente dentro do alcance
Esquiva¹ Des 13 +1 de bônus de esquiva na CA contra um adversário à sua escolha
Mobilidade¹ Esquiva +4 de bônus de esquiva na CA contra ataques de oportunidade
Ataque em Movimento¹ Mobilidade, bônus base de ataque +4 Capaz de deslocar antes e depois do ataque
Expulsão Aprimorada Habilidade de expulsar ou fascinar criaturas +1 nível efetivo para testes de expulsão
Foco em Magia² - +1 de bônus na CD dos testes de resistência contra uma escola de magia específica
Foco em Magia Maior² Foco em Magia na escola +1 de bônus na CD dos testes de resistência contra uma escola de magia específica
Foco em Perícia² - +3 de bônus nos teste da perícia escolhida
Fortitude Maior - +2 de bônus nos teste de resistência de Fortitude
Ignorar Componentes Materiais - Conjura magias ignorando os componentes materiais
Negociador - +2 de bônus nos teste de Diplomacia e Sentir Motivação
Potencializar Invocação Foco em Magia (conjuração) As criaturas invocadas recebem +4 For e +4 Cons
Rapidez de Recarga¹ Usar Arma Simples (besta) Recarrega bestas mais rapidamente
Rastrear - Utiliza Sobrevivência para rastrear
Reflexos em Combate¹ - Ataques de oportunidade adicionais
Reflexos Rápidos - +2 de bônus nos testes de resistência de Reflexos
sorrateiro - +2 nos testes de Esconder-se e Furtividade
Sucesso Decisivo Aprimorado¹² Usar a arma, bônus base de ataque +8 Dobra a margem de ameaça da arma
Tiro Certeiro¹ - +1 de bônus nos ataques à distância e dano contra alvos num raio de 9 metros
Tiro Preciso¹ Tiro Certeiro Anula a penalidade por disparar contra um adversário em combate corporal com um
aliado (-4)
Tiro Rápido¹ Des 13, Tiro Certeiro Um ataque à distância adicional por rodada
Tiro Longo¹ Tiro Certeiro Aumenta o incremento de distância em 50% ou 100%
Tiro em Movimento¹ Des 13, Esquiva, Mobilidade, Tiro Certeiro, bônus base de ataque +4 Pode se deslocar antes e depois de um ataque à distância
Tiro Múltiplo¹ Des 17, Tiro Certeiro, Tiro Rápido, bônus base de ataque +6 Dispara duas ou mais flechas simultaneamente
Tiro Preciso Aprimorado¹ Des 19, Tiro Certeiro, Tiro Preciso, bônus base de ataque +11
Ignorar qualquer cobertura ou camuflagem (exceto total) para ataques à distância
Usar Armadura (leve) - Não sofre penalidade de armadura nas jogadas de ataque
Usar Armadura (média) - Não sofre penalidade de armadura nas jogadas de ataque
Usar Armadura (pesada) - Não sofre penalidade de armadura nas jogadas de ataque
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

  acuidade_arma: {
      nome: 'Acuidade com Arma', complemento: 'arma_leve',
      guerreiro: true,
      requisitos: { bba: 1, proficiencia_arma: true, arma_leve: true }, 
      descricao: 'Aplica o modificador de Des (em vez de For) nas jogadas ' +
                 'de ataque corporal com armas leves.' },
  afinidade_com_animais: {
      nome: 'Afinidade com Animais',
      bonus_pericias: { cavalgar: 2, adestrar_animais: 2 } },
  agil: {
      nome: 'Ágil',
      bonus_pericias: { equilibrio: 2, arte_da_fuga: 2 } },
  aptidao_magica: {
      nome: 'Aptidão Mágica',
      bonus_pericias: { identificar_magia: 2, usar_instrumento_magico: 2 } },
  ataque_poderoso: {
      nome: 'Ataque Poderoso',
      requisitos: { atributos: { forca: 13 } },
      guerreiro: true,
      descricao: 'Substitui bônus de ataque por dano (máximo: bônus base de ataque).' },
  atletico: { 
      nome: 'Atlético',
      bonus_pericias: { escalar: 2, natacao: 2 } },
  auto_suficiente: {
      nome: 'Auto-Suficiente',
      bonus_pericias: { cura: 2, sobrevivencia: 2 } },
  combater_duas_armas: { 
      nome: 'Combater com duas armas',
      requisitos: { atributos: { destreza: 15 } },
      guerreiro: true,
      descricao: 'Reduz penalidade ao usar duas maos em 2.', },
  combater_duas_armas_aprimorado: {
      nome: 'Combater com duas armas aprimorado',
      requisitos: { atributos: { destreza: 17 }, bba: 6, talentos: [ 'combater_duas_armas'] },
      guerreiro: true,
      descricao: 'Ataque adicional com a segunda mao.', },
  // TODO teoricamente esse bonus eh so se correr...
  corrida: {
      nome: 'Corrida', 
      bonus_pericias: { saltar: 4 },
      descricao: 'Percorre 5 vezes o deslocamento padrão, ' +
                 '+4 de bônus nos testes de Saltar no final de uma corrida.', },  
  dedos_lepidos: {
      nome: 'Dedos Lépidos',
      bonus_pericias: { operar_mecanismos: 2, abrir_fechaduras: 2 } },
  diligente: {
      nome: 'Diligente',
      bonus_pericias: { avaliacao: 2, decifrar_escrita: 2 } },
  duro_de_matar: {
      nome: 'Duro de Matar',
      requisitos: { talentos: [ 'tolerancia' ], },
      descricao: 'Permanece consciente entre -1 e -9 PV.', },
  // Nao da pra modelar automatico porque as dependencias de especiais vem
  // depois dos talentos. Da mais 4 expulsoes.
  expulsao_adicional: {
      nome: 'Expulsão Adicional',
  },
  especializacao_arma: {
    nome: 'Especialização em Arma',
    guerreiro: true,
    complemento: 'arma',
    requisitos: { proficiencia_arma: true, talentos: [ 'foco_em_arma'], nivel: { guerreiro: 4 }},
    descrição: '+2 de bônus no dano com a arma escolhida.', },
  especializacao_arma_maior: {
    nome: 'Especialização em Arma Maior',
    guerreiro: true,
    complemento: 'arma',
    requisitos: { talentos: [ 'foco_em_arma_maior', 'especializacao_arma'], 
                  nivel: { guerreiro: 12 } },
    descricao: '+4 de bônus no dano com a arma escolhida (ao invés de 2 da especialização normal).', },
  foco_em_arma: {
      nome: 'Foco em arma',
      complemento: 'arma',
      requisitos: { bba: 1, proficiencia_arma: true },
      guerreiro: true, 
      descricao: '+1 de bônus nas jogadas de ataque com a arma escolhida.' },
  foco_em_arma_maior: {
      nome: 'Foco em arma maior',
      complemento: 'arma',
      requisitos: { talentos: [ 'foco_em_arma'], nivel: { guerreiro: 8 } },
      guerreiro: true,
      descricao: '+2 de bônus nas jogadas de ataque com a arma escolhida.' },
  fraudulento: {
      nome: 'Fraudulento',
      bonus_pericias: { disfarces: 2, falsificacao: 2 } }, 
  // Iniciativa Aprimorada +4 de bônus nos testes de Iniciativa
  iniciativa_aprimorada: {
      nome: 'Iniciativa Aprimorada',
      bonus_iniciativa: 4,
      guerreiro: true, },
  investigador: {
      nome: 'Investigador',
      bonus_pericias: { obter_informacao: 2, procurar: 2 } },
  lideranca: {
      nome: 'Liderança',
      requisitos: { nivel: 6, },
      descricao: 'Personagem atrai parceiros e seguidores.', },
  lutar_as_cegas: {
      nome: 'Lutar as Cegas',
      guerreiro: true,
      descricao: 'Joga novamente a chance de falha por camuflagem.', },
  // Habilidade Forma Selvagem Capaz de lançar magias na forma selvagem
  magia_natural: {
      nome: 'Magia Natural',
      requisitos: { atributos: { sabedoria: 13 } } },
  // Magia Penetrante TODO +2 de bônus nos testes de conjurador contra Resistência à Magia
  magia_penetrante: {
      nome: 'Magia Penetrante',
      descricao: '+2 de bônus nos testes de conjurador contra Resistência à Magia', },
  // Magia Penetrante TODO +4 de bônus nos testes de conjurador contra Resistência à Magia
  magia_penetrante_maior: {
      nome: 'Magia Penetrante Maior',
      requisitos: { talentos: [ 'magia_penetrante' ] } },
  // Combat casting: +4 de bônus nos teste de Concentração para conjurar na defensiva
  magia_combate: {
      nome: 'Magia em Combate', },
  maos_level: {
      nome: 'Mãos Leves',
      bonus_pericias: { prestidigitacao: 2, usar_cordas: 2 } },
  persuasivo: {
      nome: 'Persuasivo',
      bonus_pericias: { blefar: 2, intimidacao: 2 } },
  prontidao: {
      nome: 'Prontidão',
      bonus_pericias: { ouvir: 2, observar: 2 } },
  saque_rapido: {
      nome: 'Saque rápido',
      requisitos: { bba: 1 },
      guerreiro: true, 
      descricao: 'Saca uma arma branca como ação livre.', },
  tolerancia: {
      nome: 'Tolerância',  // Endurance.
      descricao: '+4 de bônus nos testes para resistir a danos não letais (nadar, correr, marcha ' +
                 'forçada, respiração, fome e sede, frio, calor e sufocamento. Pode dormir em armadura ' +
                 'leve ou média sem fatigar.', },
  usar_armas_simples: { 
      nome: 'Usar armas simples',
      descricao: 'Não sofre penalidades nos ataques com armas simples.', },
  usar_arma_comum: { 
      nome: 'Usar arma comum', 
      complemento: 'arma_comum',
      descricao: 'Não sofre penalidade nos ataques com uma arma comum específica.', }, 
  usar_arma_exotica: { 
      nome: 'Usar arma exótica', complemento: 'arma_exotica',
      requisitos: { bba: 1 },
      guerreiro: true,
      descricao: 'Não sofre penalidade nos ataques com uma arma exótica específica.', },
  // TODO implementar efeitos de nao ter o feat.
  //Usar Escudo Não sofre penalidade de armadura nas jogadas de ataque
  usar_escudo: {
      nome: 'Usar Escudo', },
  // Ataque com Escudo Aprimorado¹ Usar Escudo Conserva o bônus do escudo na CA quando ataca com ele
  usar_escudo_aprimorado: {
      nome: 'Usar Escudo Aprimorado', },
  // Usar Escudo de Corpo Usar Escudo Não sofre penalidade de armadura nas jogadas de ataque
  usar_escudo_corpo: {
      nome: 'Usar Escudo de Corpo', },
  // toughness em ingles.
  vitalidade: {
      nome: 'Vitalidade',
      bonus_pv: 3,
      cumulativo: true, 
      descricao: '+3 pontos de vida.', },
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
      classes: [ 'barbaro', 'druida', 'guerreiro', 'paladino', 'ranger', 'aristocrata' ], 
      sem_treinamento: false, habilidade: 'carisma' },
  arte_da_fuga: {
      nome: 'Arte da Fuga', 
      classes: [ 'bardo', 'monge', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  atuacao: {
      nome: 'Atuação', 
      classes: [ 'bardo', 'monge', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  avaliacao: {
      nome: 'Avaliação', 
      classes: [ 'bardo', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  blefar: {
      nome: 'Blefar', 
      classes: [  'bardo', 'ladino', 'feiticeiro', 'aristocrata' ], 
      sem_treinamento: true,  habilidade: 'carisma' },
  cavalgar: {
      nome: 'Cavalgar', 
      classes: [  'barbaro', 'druida', 'guerreiro', 'paladino', 'ranger', 'aristocrata' ], 
      sem_treinamento: true,  habilidade: 'destreza' },
  concentracao: {
      nome: 'Concentração', 
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ranger', 'feiticeiro', 'mago' ], 
      sem_treinamento: true,  habilidade: 'constituicao' },
  conhecimento_arcano: {
      nome: 'Conhecimento (arcano)',
      classes: [  'bardo', 'clerigo', 'monge', 'feiticeiro', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_arquitetura_e_engenharia: {
      nome: 'Conhecimento(arquitetura_e_engenharia)',
      classes: [  'bardo', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_geografia: {
      nome: 'Conhecimento (geografia)',
      classes: [  'bardo', 'ranger', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_historia: {
      nome: 'Conhecimento (história)',
      classes: [  'bardo', 'clerigo', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_local: {
      nome: 'Conhecimento (local)',
      classes: [  'bardo', 'ladino', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_masmorras: {
      nome: 'Conhecimento (masmorras)',
      classes: [  'bardo', 'ranger', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_natureza: {
      nome: 'Conhecimento (natureza)',
      classes: [  'bardo', 'druida', 'ranger', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_nobreza_e_realeza: {
      nome: 'Conhecimento (nobreza e realeza)',
      classes: [  'bardo', 'paladino', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_planos: {
      nome: 'Conhecimento (planos)',
      classes: [  'bardo', 'clerigo', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_religiao: {
      nome: 'Conhecimento (religião)',
      classes: [  'bardo', 'clerigo', 'monge', 'paladino', 'mago', 'aristocrata' ],
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
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ladino', 'aristocrata', ],
      sem_treinamento: true, habilidade: 'carisma' },
  disfarces: {
      nome: 'Disfarces',
      classes: [  'bardo', 'ladino', 'aristocrata', ],
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
      classes: [ 'bardo', 'aristocrata' ],
      habilidade: 'sabedoria' },
  falsificacao: {
      nome: 'Falsificação',
      classes: [  'ladino', 'aristocrata', ],
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
      classes: [  'barbaro', 'guerreiro', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'carisma' },
  natacao: {
      nome: 'Natação',
      classes: [  'barbaro', 'bardo', 'druida', 'guerreiro', 'monge', 'ranger', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 2 },
  observar: {
      nome: 'Observar',
      classes: [  'druida', 'monge', 'ranger', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  obter_informacao: {
      nome: 'Obter Informação',
      classes: [  'bardo', 'ladino', 'aristocrata', ],
      sem_treinamento: true, habilidade: 'carisma' },
  oficios: {
      nome: 'Ofícios',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge', 
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  operar_mecanismo: {
      nome: 'Operar Mecanismo',
      classes: [  'ladino'],
      habilidade: 'inteligencia' },
  ouvir: {
      nome: 'Ouvir',
      classes: [  'barbaro', 'bardo', 'druida', 'monge', 'ranger', 'ladino', 'aristocrata' ],
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
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ranger', 
                  'ladino', 'feiticeiro', 'mago'],
      habilidade: 'sabedoria' },
  saltar: {
      nome: 'Saltar',
      classes: [  'barbaro', 'bardo', 'guerreiro', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 1 },
  sentir_motivacao: {
      nome: 'Sentir Motivação',
      classes: [  'bardo', 'monge', 'paladino', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  sobrevivencia: {
      nome: 'Sobrevivência',
      classes: [  'barbaro', 'druida', 'ranger', 'aristocrata' ],
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
    esconder: { 
      classes: ['divs-principais'], elementos: [] }, 
    mostrar: { 
      classes: [], 
      elementos:['div-pontos-vida', 'div-ataque', 'div-defesa', 'div-iniciativa'] },
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

var tabelas_aneis = {
  protecao_1: { 
      nome: 'Proteção +1', preco: '2000 PO', 
      propriedades: { ca: { deflexao: 1 } },  },
  queda_suave: { nome: 'Queda suave', preco: '2200 PO', },
  sustento: { nome: 'Sustento', preco: '2500 PO', },
  escalada: { nome: 'Escalada', preco: '2500 PO',
      propriedades: { pericias: { escalar: { competencia: 5 } } }, },
  salto: { nome: 'Salto', preco: '2500 PO',
      propriedades: { pericias: { saltar: { competencia: 5 } } }, },
  natacao: { nome: 'Natação', preco: '2500 PO',
      propriedades: { pericias: { natacao: { competencia: 5 } } }, },
  contramagica: { nome: 'Contramágica', preco: '4000 PO', },
  escudo_mental: { nome: 'Escudo mental', preco: '8000 PO', },
  protecao_2: { nome: 'Proteção +2', preco: '8000 PO',
      propriedades: { ca: { deflexao: 2 } }, },
  escudo_energia: { nome: 'Escudo de energia', preco: '8500 PO', },
  ariete: { nome: 'Aríete', preco: '8600 PO', },
  escalada_aprimorada: { nome: 'Escalada aprimorada', preco: '10000 PO',
      propriedades: { pericias: { escalar: { competencia: 10 } } }, },
  salto_aprimorado: { nome: 'Salto aprimorado', preco: '10000 PO', 
      propriedades: { pericias: { saltar: { competencia: 10 } } }, },
  natacao_aprimorada: { nome: 'Natação aprimorada', preco: '10000 PO',
      propriedades: { pericias: { natacao: { competencia: 10 } } }, },
  cativar_animais: { nome: 'Cativar animais', preco: '10800 PO', },
  resistencia_elementos_menor: { nome: 'Resistência a elementos (menor)', preco: '12000 PO', },
  poder_camaleao: { nome: 'Poder do camaleão', preco: '12700 PO', },
  caminhar_agua: { nome: 'Caminhar na água', preco: '15000 PO', },
  protecao_3: { nome: 'Proteção +3', preco: '18000 PO',
      propriedades: { ca: { deflexao: 3 } },  },
  armazenar_magia_menor: { nome: 'Armazenar magias (menor)', preco: '18000 PO', },
  invisibilidade: { nome: 'Invisibilidade', preco: '20000 PO', },
  arcano_i: { nome: 'Arcano (I)', preco: '20000 PO', },
  evasao: { nome: 'Evasão', preco: '25000 PO', },
  visao_continua: { nome: 'Visão contínua', preco: '25000 PO', },
  movimento_subito: { nome: 'Movimento súbito', preco: '27000 PO', },
  resistencia_elementos_maior: { nome: 'Resistência a elementos (maior)', preco: '28000 PO', },
  protecao_4: { nome: 'Proteção +4', preco: '32000 PO',
      propriedades: { ca: { deflexao: 4 } },  },
  arcano_ii: { nome: 'Arcano (II)', preco: '40000 PO', },
  movimentacao_livre: { nome: 'Movimentação livre', preco: '40000 PO', },
  resistencia_elementos_superior: { nome: 'Resistência a elementos (superior)', preco: '44000 PO', },
  escudo_aliado_par: { nome: 'Escudo alidado (par)', preco: '50000 PO', },
  protecao_5: { nome: 'Proteção +5', preco: '50000 PO',
      propriedades: { ca: { deflexao: 5 } },  },
  estrelas_cadentes: { nome: 'Estrelas cadentes', preco: '50000 PO', },
  armazenar_magias: { nome: 'Armazenar magias', preco: '50000 PO', },
  arcano_iii: { nome: 'Arcano (III)', preco: '70000 PO', },
  telecinesia: { nome: 'Telecinésia', preco: '75000 PO', },
  regeneracao: { nome: 'Regeneração', preco: '90000 PO', },
  tres_desejos: { nome: 'Três desejos', preco: '97950 PO', },
  refletir_magias: { nome: 'Refletir magias', preco: '98280 PO', },
  arcano_iv: { nome: 'Arcano (IV)', preco: '100000 PO', },
  convocar_djinn: { nome: 'Convocar djinn', preco: '125000 PO', },
  comandar_elemental_ar: { nome: 'Comandar elemental (ar)', preco: '200000 PO', },
  comandar_elemental_terra: { nome: 'Comandar elemental (terra)', preco: '200000 PO', },
  comandar_elemental_fogo: { nome: 'Comandar elemental (fogo)', preco: '200000 PO', },
  comandar_elemental_agua: { nome: 'Comandar elemental (água)', preco: '200000 PO', },
  armazenar_magias_maior: { nome: 'Armazenar magias (maior)', preco: '200000 PO', },
};

var tabelas_amuletos = {
  armadura_natural_1: { 
    nome: 'Armadura Natural +1', preco: '2000 PO', 
    propriedades: { ca: { armadura_natural: 1 } },  },
  armadura_natural_2: { 
    nome: 'Armadura Natural +2', preco: '8000 PO', 
    propriedades: { ca: { armadura_natural: 2 } },  },
  armadura_natural_3: { 
    nome: 'Armadura Natural +3', preco: '18000 PO', 
    propriedades: { ca: { armadura_natural: 3 } },  },
  armadura_natural_4: { 
    nome: 'Armadura Natural +4', preco: '32000 PO', 
    propriedades: { ca: { armadura_natural: 4 } },  },
  armadura_natural_5: { 
    nome: 'Armadura Natural +5', preco: '50000 PO', 
    propriedades: { ca: { armadura_natural: 5 } },  },
  punhos_poderosos_1: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +1', preco: '6000 PO', 
    propriedades: {} },
  punhos_poderosos_2: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +2', preco: '24000 PO', 
    propriedades: {} },
  punhos_poderosos_3: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +3', preco: '54000 PO', 
    propriedades: {} },
  punhos_poderosos_4: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +4', preco: '96000 PO', 
    propriedades: {} },
  punhos_poderosos_5: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +5', preco: '150000 PO', 
    propriedades: {} },
  saude_2: {
    nome: 'Saúde +2', preco: '4000 PO', 
    propriedades: { atributos: { constituicao: 2 } } },
  saude_4: {
    nome: 'Saúde +4', preco: '16000 PO', 
    propriedades: { atributos: { constituicao: 4 } } },
  saude_6: {
    nome: 'Saúde +6', preco: '36000 PO', 
    propriedades: { atributos: { constituicao: 6 } } },
  planos: {
    // permite usar magia viagem planar...
    nome: 'Planos', preco: '120000 PO', 
    propriedades: {} },
  protecao_deteccao: {
    // como se estivesse sob efeito de dificultar detecção...
    nome: 'Proteção contra Localização e Detecção', preco: '35000 PO', 
    propriedades: {} },
  quaal_ancora: {
    // Prender embarcações.
    nome: 'Quaal Âncora', preco: '50 PO', 
    propriedades: {} },
  quaal_passaro: {
    // Pombo correio para entregar mensagem.
    nome: 'Quaal Pássaro', preco: '300 PO', 
    propriedades: {} },
  quaal_leque: {
    // Gerar vento.
    nome: 'Quaal Leque', preco: '200 PO', 
    propriedades: {} },
  quaal_barco_cisne: {
    // Transforma-se em um barco.
    nome: 'Quaal Barco de Cisnes', preco: '450 PO', 
    propriedades: {} },
  quaal_arvore: {
    // Cria um grande carvalho.
    nome: 'Quaal Árvore', preco: '400 PO', 
    propriedades: {} },
  quaal_chicote: {
    // Cria um chicote que ataca sozinho como arma dancarina.
    nome: 'Quaal Chicote', preco: '500 PO', 
    propriedades: {} },
};

// Var traduzir.
var tabelas_pocoes = {
  curar_ferimentos_leves: { nome: 'Curar ferimentos leves', tipo: 'pocao', preco: '50 PO' },
  suportar_elementos: { nome: 'Suportar elementos', tipo: 'pocao', preco: '50 PO' },
  invisibilidade_contra_animais: { nome: 'Invisibilidade contra animais', tipo: 'pocao', preco: '50 PO' },
  invisibilidade_contra_mortos_vivos: { nome: 'Invisibilidade contra mortos-vivos', tipo: 'pocao', preco: '50 PO' },
  salto: { nome: 'Salto', tipo: 'pocao' , preco: '50 PO' },
  armadura_arcana: { nome: 'Armadura arcana', tipo: 'pocao', preco: '50 PO' },
  presa_magica: { nome: 'Presa mágica', tipo: 'pocao', preco: '50 PO' },
  pedra_encantada: { nome: 'Pedra encantada', tipo: 'oleo' , preco: '50 PO' },
  arma_magica: { nome: 'Arma mágica', tipo: 'oleo', preco: '50 PO' },
  passos_sem_pegadas: { nome: 'Passos sem pegadas', tipo: 'pocao' , preco: '50 PO' },
  protecao_contra_tendencia: { nome: 'Proteção contra (tendência)', tipo: 'pocao'  , preco: '50 PO' },
  remover_medo: { nome: 'Remover medo', tipo: 'pocao', preco: '50 PO' },
  santuario: { nome: 'Santuário', tipo: 'pocao', preco: '50 PO' },
  escudo_da_fe_2: { nome: 'Escudo da fé +2', tipo: 'pocao', preco: '50 PO' },
  arma_abencoada: { nome: 'Arma Abençoada (Shillelagh)', tipo: 'oleo', preco: '50 PO' },
  abencoar_arma: { nome: 'Abençoar arma', tipo: 'oleo', preco: '100 PO' },
  aumentar_pessoa: { nome: 'Aumentar pessoa', tipo: 'pocao' , preco: '250 PO' },
  reduzir_pessoa: { nome: 'Reduzir pessoa', tipo: 'pocao'  , preco: '250 PO' },
  ajuda: { nome: 'Ajuda', tipo: 'pocao'  , preco: '300 PO' },
  pele_arvore_2: { nome: 'Pele de árvore +2', tipo: 'pocao'  , preco: '300 PO' },
  vigor_urso: { nome: 'Vigor do urso', tipo: 'pocao' , preco: '300 PO' },
  nublar: { nome: 'Nublar', tipo: 'pocao' , preco: '300 PO' },
  forca_touro: { nome: 'Força do touro', tipo: 'pocao'  , preco: '300 PO' },
  agilidade_gato: { nome: 'Agilidade do gato', tipo: 'pocao'  , preco: '300 PO' },
  curar_ferimentos_moderados: { nome: 'Curar ferimentos moderados', tipo: 'pocao' , preco: '300 PO' },
  escuridao: { nome: 'Escuridão', tipo: 'oleo', preco: '300 PO' },
  visao_escuro: { nome: 'Visão no escuro', tipo: 'pocao', preco: '300 PO' },
  retardar_envenenamento: { nome: 'Retardar envenenamento', tipo: 'pocao' , preco: '300 PO' },
  esplendor_aguia: { nome: 'Esplendor da águia', tipo: 'pocao' , preco: '300 PO' },
  astucia_raposa: { nome: 'Astúcia da raposa', tipo: 'pocao', preco: '300 PO' },
  invisibilidade: { nome: 'Invisibilidade', tipo: 'ambos', preco: '300 PO' },
  restauracao_menor: { nome: 'Restauração menor', tipo: 'pocao' , preco: '300 PO' },
  levitacao: { nome: 'Levitação', tipo: 'ambos', preco: '300 PO' },
  confundir_deteccao: { nome: 'Confundir detecção', tipo: 'pocao' , preco: '300 PO' },
  sabedoria_coruja: { nome: 'Sabedoria da coruja', tipo: 'pocao' , preco: '300 PO' },
  protecao_contra_flechas_10: { nome: 'Proteção contra flechas 10/mágica', tipo: 'pocao', preco: '300 PO' },
  remover_paralisia: { nome: 'Remover paralisia', tipo: 'pocao', preco: '300 PO' },
  resistencia_elementos_10: { nome: 'Resistência a elementos (tipo) 10', tipo: 'pocao', preco: '300 PO' },
  escudo_da_fe_3: { nome: 'Escudo da fé +3', tipo: 'pocao', preco: '300 PO' },
  patas_aranha: { nome: 'Patas de aranha', tipo: 'pocao', preco: '300 PO' },
  dissimular_tendencia: { nome: 'Dissimular tendência', tipo: 'pocao', preco: '300 PO' },
  pele_arvore_3: { nome: 'Pele de árvore +3', tipo: 'pocao', preco: '600 PO' },
  escudo_da_fe_4: { nome: 'Escudo da fé +4', tipo: 'pocao', preco: '600 PO' },
  resistencia_elementos_20: { nome: 'Resistência a elementos (tipo) 20', tipo: 'pocao'  , preco: '700 PO' },
  curar_ferimentos_serios: { nome: 'Curar ferimentos sérios', tipo: 'pocao', preco: '750 PO' },
  luz_dia: { nome: 'Luz do dia', tipo: 'oleo', preco: '750 PO' },
  deslocamento: { nome: 'Deslocamento', tipo: 'pocao' , preco: '750 PO' },
  flecha_chamas: { nome: 'Flecha de chamas', tipo: 'oleo' , preco: '750 PO' },
  voo: { nome: 'Vôo', tipo: 'pocao'  , preco: '750 PO' },
  forma_gasosa: { nome: 'Forma gasosa', tipo: 'pocao' , preco: '750 PO' },
  presa_magica_maior_1: { nome: 'Presa mágica maior +1', tipo: 'pocao'  , preco: '750 PO' },
  arma_magica_maior: { nome: 'Arma mágica +1', tipo: 'oleo' , preco: '750 PO' },
  velocidade: { nome: 'Velocidade', tipo: 'pocao'  , preco: '750 PO' },
  heroismo: { nome: 'Heroismo', tipo: 'pocao'  , preco: '750 PO' },
  lamina_afiada: { nome: 'Lâmina afiada', tipo: 'oleo' , preco: '750 PO' },
  circulo_magico_contra_tendencia: { nome: 'Círculo mágico contra (tendência)', tipo: 'pocao' , preco: '750 PO' },
  roupa_encantada_1: { nome: 'Roupa encantada +1', tipo: 'oleo' , preco: '750 PO' },
  neutralizar_venenos: { nome: 'Neutralizar venenos', tipo: 'pocao', preco: '750 PO' },
  dificultar_deteccao: { nome: 'Dificultar detecção', tipo: 'pocao' , preco: '750 PO' },
  protecao_contra_elementos: { nome: 'Proteção contra elementos (tipo)', tipo: 'pocao', preco: '750 PO' },
  furia: { nome: 'Fúria', tipo: 'pocao' , preco: '750 PO' },
  remover_cegueira_surdez: { nome: 'Remover cegueira/surdez', tipo: 'pocao', preco: '750 PO' },
  remover_maldicao: { nome: 'Remover maldição', tipo: 'pocao', preco: '750 PO' },
  remover_doenca: { nome: 'Remover doença', tipo: 'pocao', preco: '750 PO' },
  idiomas: { nome: 'Idiomas', tipo: 'pocao', preco: '750 PO' },
  respirar_agua: { nome: 'Respirar na água', tipo: 'pocao', preco: '750 PO' },
  caminhar_agua: { nome: 'Caminhar na água', tipo: 'pocao' , preco: '750 PO' },
  pele_arvore_4: { nome: 'Pele de árvore +4', tipo: 'pocao'  , preco: '900 PO' },
  escudo_da_fe_5: { nome: 'Escudo da fé +5', tipo: 'pocao' , preco: '900 PO' },
  boa_esperanca: { nome: 'Boa esperança', tipo: 'pocao'  , preco: '1050 PO' },
  resistencia_elementos_30: { nome: 'Resistência a elementos (tipo) 30', tipo: 'pocao'  , preco: '1100 PO' },
  pele_arvore_5: { nome: 'Pele de árvore +5', tipo: 'pocao'  , preco: '1200 PO' },
  presa_magica_maior_2: { nome: 'Presa mágica maior +2', tipo: 'pocao'  , preco: '1200 PO' },
  arma_magica_maior_2: { nome: 'Arma mágica maior +2', tipo: 'oleo' , preco: '1200 PO' },
  roupa_encantada_2: { nome: 'Roupa encantada +2', tipo: 'oleo' , preco: '1200 PO' },
  protecao_contra_flechas_15: { nome: 'Proteção contra flechas 15/mágica', tipo: 'pocao'  , preco: '1500 PO' },
  presa_magica_maior_3: { nome: 'Presa mágica maior +3', tipo: 'pocao'  , preco: '1800 PO' },
  arma_magica_maior_3: { nome: 'Arma mágica maior +3', tipo: 'oleo' , preco: '1800 PO' },
  roupa_encantada_3: { nome: 'Roupa encantada +3', tipo: 'oleo', preco: '1800 PO' },
  presa_magica_maior_4: { nome: 'Presa mágica maior +4', tipo: 'pocao', preco: '2400 PO' },
  arma_magica_maior_4: { nome: 'Arma mágica maior +4', tipo: 'oleo', preco: '2400 PO' },
  roupa_encantada_4: { nome: 'Roupa encantada +4', tipo: 'oleo', preco: '2400 PO' },
  presa_magica_maior_5: { nome: 'Presa mágica maior +5', tipo: 'pocao', preco: '3000 PO' },
  arma_magica_maior_5: { nome: 'Arma mágica maior +5', tipo: 'oleo', preco: '3000 PO' },
  roupa_encantada_5: { nome: 'Roupa encantada +5', tipo: 'oleo', preco: '3000 PO' },
};

// Tabelas de itens, por tipo.
var tabelas_itens = {
  aneis: tabelas_aneis,
  amuletos: tabelas_amuletos,
  pocoes: tabelas_pocoes,
};

// Nomes dos itens, por tipo.
var tabelas_nomes_itens = {
  aneis: 'Anéis',
  amuletos: 'Amuletos',
  pocoes: 'Poções',
};

// Materiais especiais.
// TODO terminar de modelar custos.
// TODO modelar os requisitos.
var tabelas_materiais_especiais = {
  nenhum: { nome: 'nenhum', },
  adamante: { 
      nome: 'adamante',
      requisitos: { metal: true, obra_prima: true, },
      custo_por_tipo: {
          // Tirei o custo da obra prima.
          municao: '54 PO',
          arma: '2700 PO', 
          armadura: { por_subtipo: { leve: '4850 PO', media: '9850 PO', pesada: '14850 PO' }, }, 
          escudo: '1850 PO' }, },
  madeira_negra: { 
      nome: 'madeira negra', 
      custo_por_kg: '20 PO',
      requisito: { madeira: true, obra_prima: true, }, },
  // O custo adicional do couro do dragão é o da armadura ou escudo obra prima. Fica difícil modelar aqui
  // de forma genérica, então preferi tratar especificamente no código.
  couro_dragao: { 
      nome: 'couro de dragão', 
      requisitos: { armadura: true, obra_prima: true, }, },
  // O custo adicional do ferro frio é o da arma normal. Cada bônus mágico adiciona +2000 PO. Assim como 
  // couro_dragao, modelei no código.
  ferro_frio: { 
      nome: 'ferro frio',
      requisito: { arma: true, }, },
  // Custo do mitral é tabelado de acordo com tipo de armadura ou escudo.
  // armadura leve: 1000, media: 4000, pesada: 9000, escudo: 1000. O preco unclui valor da obra prima.
  mitral: { 
      nome: 'mitral', 
      requisitos: { armadura: true, metal: true, obra_prima: true, }, },
  // Custo da prata alquimica varia com o subtipo de arma.
  prata_alquimica: { 
      nome: 'prata Alquímica', 
      requisitos: { arma: true, metal: true, }, },
};

