// Dados das racas.
var tabelas_raca = {
  aarakokra: {
      nome: 'Aarakocra',
      origem: { livro: 'Races of Faerun', pagina: '130' },
      ajuste_nivel: 2, armadura_natural: 1,
      movimento: { terrestre: 4, aereo: 18 },
      atributos: { forca: -2, destreza: 4 }, tamanho: 'medio',
      proficiencia_armas: [ 'azagaia' ],  // Javelin em ingles.
      //converte, add bonus racial p pericias, soma tbm no total, transforma em pericia de classe
      //Todo(FC) incluir penalidades de ambientes fechados
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
                            'arco_curto_composto'],
      bonus_pericias: { ouvir: 2, procurar: 2, observar: 2 },
      outras_salvacoes: { encantamento: { base: ['vontade'], bonus: 2 } },
  },
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
      atributos: {}, tamanho: 'medio',
      bonus_pericias: { diplomacia: 2, obter_informacao: 2, ouvir: 1, procurar: 1, observar: 1 },
      outras_salvacoes: { encantamento: { base: ['vontade'], bonus: 2 } },
  },
  meioorc: {
      nome: 'Meio-Orc',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: { forca: 2, inteligencia: -2, carisma: -2 }, tamanho: 'medio',
  },
  orc: {
      nome: 'Orc',
      origem: { livro: 'Livro dos Monstros', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: { forca: 4, inteligencia: -2, sabedoria: -2, carisma: -2 }, tamanho: 'medio',
      // visao no escuro 60 pes (12 quadrados).
  },
};

var tabelas_template = {
  demoniaco: {
    nome: 'Demoníaco',
    tipo: 'extra-planar',
    origem: { },
    especiais: {
      1: ['visao_escuro', 'resistencia_frio_fogo_5', 'destruir_bem'],
      8: ['resistencia_frio_fogo_10'],
    },
    reducao_dano: {
      por_nivel: {
        4: { valor: '5', sobrepassar: ['magia'] },
        12: { valor: '10', sobrepassar: ['magia'] },
      },
    },
    resistencia_magia: [
      { chave: 'magia', por_nivel: 5 },  // ganha hd +5.
    ],
  },
  lich: {
    nome: 'Lich',
    tipo: 'morto-vivo',
    origem: { },
    dados_vida: 12,
    armadura_natural: 5,
    arma_natural: { toque: { nome: 'Toque', dano: '1d8+5' } }, // 1 vez rodada energia negativa, paralisia, tem save de von
    aura: { tipo: 'medo', raio: '12 quadrados' },
    reducao_dano: { valor: '15', sobrepassar: ['estourante', 'magia']},
    bonus_pericias: { esconderse: 8, furtividade: 8, ouvir: 8, procurar: 8, sentir_motivacao: 8, observar: 8 },
    atributos: { inteligencia: 2, sabedoria: 2, carisma: 2 },
    resistencia_espantar: 4,
    imunidades: ['frio', 'eletricidade', 'polimorfismo', 'efeitos mentais'],
  },

}

// Dados relacionados a classes.
// TODO passar tudo de classes pra ca.
var tabelas_classes = {
  barbaro: {
    nome: 'Bárbaro', dados_vida: 12, pontos_pericia: 4, bba: bba_forte,
    talentos: [ 'usar_armas_simples', 'usar_armas_comuns' ],
  },
  bardo: {
    nome: 'Bardo', dados_vida: 6, pontos_pericia: 6, bba: bba_medio,
    nivel_conjurador: { modificador: 1.0 },
    talentos: [ 'usar_armas_simples' ],
    proficiencia_armas: [ 'espada_longa', 'sabre', 'porrete',  'espada_curta', 'arco_curto', 'chicote' ]
  },
  clerigo: {
    nome: 'Clérigo', dados_vida: 8, pontos_pericia: 2,  bba: bba_medio,
    nivel_conjurador: { modificador: 1.0, },
    talentos: [ 'usar_armas_simples' ],
    especiais: {
      1: [ 'expulsar_fascinar_mortos_vivos' ],
    },
  },
  druida: { nome: 'Druida', dados_vida: 8, pontos_pericia: 4, bba: bba_medio,
    nivel_conjurador: { modificador: 1.0, },
    especiais: {
      1: [ 'companheiro_animal', 'senso_natureza', 'empatia_natureza' ],
      2: [ 'caminho_floresta' ],
      3: [ 'ratros_invisivel' ],
      4: [ 'resistir_tentacao_natureza' ],
      5: [ 'forma_selvagem' ],
    },
    proficiencia_armas: [ 'clava', 'adaga', 'dardo', 'bordao', 'cimitarra', 'foice_curta',
                          'lanca_curta', 'funda', 'lanca' ],
  },
  guerreiro: {
    nome: 'Guerreiro', dados_vida: 10, pontos_pericia: 2, bba: bba_forte,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
  },
  feiticeiro: {
    nome: 'Feiticeiro', dados_vida: 4, pontos_pericia: 2, bba:
    bba_fraco, nivel_conjurador: { modificador: 1.0, },
    talentos: [ 'usar_armas_simples' ],
  },
  ladino: {
    nome: 'Ladino', dados_vida: 6, pontos_pericia: 8, bba: bba_medio,
    talentos: [ 'usar_armas_simples' ],
    proficiencia_armas: [ 'besta_de_mao', 'sabre', 'porrete', 'arco_curto', 'espada_curta' ],
    especiais: {
      1: [ 'ataque_furtivo', 'encontrar_armadilha' ],
      2: [ 'evasao' ],
      3: [ 'ataque_furtivo', 'sentir_armadilha' ],
      4: [ 'esquiva_sobrenatural' ],
      5: [ 'ataque_furtivo' ],
      6: [ 'sentir_armadilha', ],
      7: [ 'ataque_furtivo', ],
    },
  },
  mago: {
    nome: 'Mago', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    nivel_conjurador: { modificador: 1.0, },
    talentos: ['usar_armas_simples' ],
    proficiencia_armas: [ 'clava', 'adaga', 'besta_pesada', 'besta_leve', 'bordao' ],
    especiais: {
      1: ['familiar'],
    },
  },
  mago_necromante: {
    nome: 'Mago Necromante', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    nivel_conjurador: { modificador: 1.0, },
    talentos: ['usar_armas_simples' ],
    proficiencia_armas: [ 'clava', 'adaga', 'besta_pesada', 'besta_leve', 'bordao' ],
    especiais: {
      1: ['familiar'],
    },
  },
  monge: {
    nome: 'Monge', dados_vida: 8, pontos_pericia: 4, bba: bba_medio,
    proficiencia_armas: [ 'clava', 'besta_leve', 'besta_pesada', 'adaga', 'machadinha', 'azagaia',
                          'kama', 'nunchaku', 'bordao', 'sai', 'shuriken', 'siangham', 'funda' ],
    especiais: {
      1: [ 'talento', 'rajada_de_golpes', 'ataque_desarmado' ],
      2: [ 'talento', 'evasao' ],
      3: [ 'mente_tranquila' ],
      4: [ 'ataque_chi_magico', 'queda_suave_6m' ],
      5: [ 'pureza_corporal', 'bonus_ca' ],
      6: [ 'talento', 'queda_suave_9m' ],
      7: [ 'integridade_corporal', ],
      8: [ 'queda_suave_12m', ],
      9: [ 'evasao_aprimorada', ],
      10: [ 'ataque_chi_ordem', 'queda_suave_15m', 'bonus_ca' ],
      11: [ 'corpo_diamante', 'rajada_maior', ],
      12: [ 'passo_etereo', 'queda_suave_18m' ],
      13: [ 'alma_diamante', ],
      14: [ 'queda_suave_21m', ],
      15: [ 'mao_vibrante', 'bonus_ca' ],
      16: [ 'ataque_chi_adamante', 'queda_suave_24m' ],
      17: [ 'corpo_atemporal', 'idiomas_sol_lua', ],
      18: [ 'queda_suave_27m', ],
      19: [ 'corpo_vazio', ],
      20: [ 'auto_perfeicao', 'queda_suave_inf', 'bonus_ca' ],
    },
  },
  paladino: { nome: 'Paladino', dados_vida: 10, pontos_pericia: 2, bba: bba_forte,
    nivel_conjurador: { modificador: 0.5, minimo: 4, },
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
    especiais: {
      1: [ 'aura_bem', 'detectar_mal', 'destruir_mal', ],
      2: [ 'graca_divina', 'cura_pelas_maos', ],
      3: [ 'aura_coragem', 'saude_divina', ],
      4: [ 'expulsar_fascinar_mortos_vivos', ],
      5: [ 'destruir_mal', 'montaria_especial', ],
      6: [ 'remover_doenca', ],
      9: [ 'remover_doenca', ],
      10: [ 'destruir_mal', ],
      12: [ 'remover_doenca' ],
      15: [ 'remover_doenca', 'destruir_mal', ],
      18: [ 'remover_doenca', ],
      20: [ 'destruir_mal' ],
    },
  },
  ranger: {
    nome: 'Ranger', dados_vida: 8, pontos_pericia: 6, bba: bba_forte,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
    nivel_conjurador: { modificador: 0.5, minimo: 4, },
    especiais: {
      1: [ 'inimigo_predileto', 'rastrear', 'empatia_natureza', ],
      2: [ 'estilo_combate', ],
      3: [ 'tolerancia', ],
      4: [ 'companheiro_animal', ],
      5: [ 'inimigo_predileto', ],
      6: [ 'estilo_combate_aprimorado', ],
      7: [ 'caminho_floresta', ],
      8: [ 'rastreador_eficaz', ],
      9: [ 'evasao' ],
      10: [ 'inimigo_predileto', ],
      11: [ 'maestria_estilo_combate', ],
      13: [ 'camuflagem' ],
      15: [ 'inimigo_predileto' ],
      17: [ 'mimetismo'],
      20: ['inimigo_predileto'],
    },
  },
  // classes NPC
  adepto: {
    nome: 'Adepto', mestre: true, dados_vida: 6, pontos_pericia: 2, bba: bba_fraco,
    nivel_conjurador: { modificador: 1.0, },
    talentos: ['usar_armas_simples' ],
  },
  aristocrata: {
    nome: 'Aristocrata', mestre: true, dados_vida: 8, pontos_pericia: 4, bba: bba_medio,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
  },
  plebeu: {
    nome: 'Plebeu', mestre: true, dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    proficiencia_armas: ['clava'],
  },
  expert: {
    nome: 'Expert', mestre: true, dados_vida: 6, pontos_pericia: 6, bba: bba_medio,
    talentos: ['usar_armas_simples' ],
  },
  combatente: {
    nome: 'Combatente', mestre: true, dados_vida: 8, pontos_pericia: 2, bba: bba_forte,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
  },
  // Prestigio.
  dragao_purpura: {
    nome: 'Dragão Púrpura', prestigio: true, dados_vida: 10, pontos_pericia: 2, bba: bba_forte,
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
  teurgista_mistico: {
    nome: 'Teurgista Místico', prestigio: true, dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    incremento_nivel_conjurador: ['arcano', 'divino'],
    especiais: {
    },
    requisitos: {
      // TODO: diplomacia ou intimidar 1.
      pericias: { conhecimento_arcano: 6, conhecimento_religiao: 6, },
    },
  },
};

var tabelas_especiais = {
  alma_diamante: { nome: 'Alma Diamante' },
  ataque_chi_magico: { nome: 'Ataque Chi (Mágico)' },
  ataque_chi_ordem: { nome: 'Ataque Chi (Ordem)' },
  ataque_chi_adamante: { nome: 'Ataque Chi (Adamante)' },
  ataque_desarmado: { nome: 'Ataque Desarmado' },
  ataque_furtivo: { nome: 'Ataque furtivo', },
  aura_bem: { nome: 'Aura do bem', },
  aura_coragem: { nome: 'Aura de coragem' },
  auto_perfeicao: { nome: 'Auto-Perfeição' },
  bonus_ca: { nome: 'Bonus CA' },
  caminho_floresta: { nome: 'Caminho da Floresta' },
  estilo_combate_aprimorado: { nome: 'Estilo de Combate Aprimorado' },
  expulsar_fascinar_mortos_vivos: { nome: 'Expulsar/fascinar mortos vivos', },
  camuflagem: { nome: 'Camuflagem', },
  companheiro_animal: { nome: 'Companheiro animal', },
  corpo_diamante: { nome: 'Corpo de Diamante' },
  corpo_atemporal: { nome: 'Corpo Atemporal' },
  corpo_vazio: { nome: 'Corpo Vazio' },
  cura_pelas_maos: { nome: 'Cura pelas mãos', },
  destruir_bem: { nome: 'Destruir o bem', },
  destruir_mal: { nome: 'Destruir o mal', },
  detectar_mal: { nome: 'Detectar o mal', },
  empatia_natureza: { nome: 'Empatia com a natureza', },
  encontrar_armadilha: { nome: 'Encontrar armadilha', },
  evasao: { nome: 'Evasão', },
  evasao_aprimorada: { nome: 'Evasão Aprimorada', },
  escudo_heroico: { nome: 'Escudo Heróico', },
  esquiva_sobrenatural: { nome: 'Esquiva Sobrenatural', },
  estilo_combate: { nome: 'Estilo de Combate' },
  familiar: { nome: 'Familiar', },
  forma_selvagem: { nome: 'Forma selvagem', },
  graca_divina: { nome: 'Graça divina', },
  grito_guerra: { nome: 'Grito de Guerra', },
  idiomas_sol_lua: { nome: 'Idiomas do Sol e da Lua' },
  inimigo_predileto: { nome: 'Inimigo Predileto' },
  inspirar_coragem: { nome: 'Inspirar Coragem', },
  integridade_corporal: { nome: 'Integridade Corporal' },
  juramento_furia: { nome: 'Juramento de Fúria', },
  maestria_estilo_combate: { nome: 'Maestria do Estilo de Combate' },
  mao_vibrante: { nome: 'Mão Vibrante' },
  medo: { nome: 'Medo', },
  mente_tranquila: { nome: 'Mente Tranquila' },
  mimetismo: { nome: 'Mimetismo' },
  montaria_especial: { nome: 'Montaria especial', },
  passo_etereo: { nome: 'Passo Etéreo' },
  pureza_corporal: { nome: 'Pureza Corporal' },
  queda_suave_6m: { nome: 'Queda Suave (6m)' },
  queda_suave_9m: { nome: 'Queda Suave (9m)' },
  queda_suave_12m: { nome: 'Queda Suave (12m)' },
  queda_suave_15m: { nome: 'Queda Suave (15m)' },
  queda_suave_18m: { nome: 'Queda Suave (18m)' },
  queda_suave_21m: { nome: 'Queda Suave (21m)' },
  queda_suave_24m: { nome: 'Queda Suave (24m)' },
  queda_suave_27m: { nome: 'Queda Suave (27m)' },
  queda_suave_inf: { nome: 'Queda Suave (sem limite)' },
  senso_natureza: { nome: 'Senso da natureza', },
  rajada_de_golpes: { nome: 'Rajada de Golpes'},
  rajada_maior: { nome: 'Rajada Maior'},
  rastrear: { nome: 'Rastrear' },
  rastreador_eficaz: { nome: 'Rastreador Eficaz' },
  rastro_invisivel: { nome: 'Rastro invisível', },
  resistencia_frio_fogo_5: { nome: 'Resistência a Frio e Fogo (5)'},
  resistencia_frio_fogo_10: { nome: 'Resistência a Frio e Fogo (10)'},
  resistencia_final: {nome: 'Resistência Final', },
  resistir_tentacao_natureza: { nome: 'Resistir tentação da natureza', },
  remover_doenca: { nome: 'Remover Doença', },
  sentir_armadilha: { nome: 'Sentir armadilha', },
  saude_divina: { nome: 'Saúde divina', },
  talento: { nome: 'Talento' },
  tolerancia: { nome: 'Tolerancia' },
  visao_escuro: { nome: 'Visão no Escuro' },
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
  mago_necromante: {
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
  teurgista_mistico: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
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

// Conversao de dado de tamanho medio para outros tipos.
var tabelas_dado_por_tamanho = {
  '1d2': {
    pequeno: '1',
    grande: '1d3', enorme: '1d4', imenso: '1d6', colossal: '1d8' },
  '1d3': {
    miudo: '1', pequeno: '1d2',
    grande: '1d4', enorme: '1d6', imenso: '1d8', colossal: '2d6' },
  '1d4': {
    diminuto: '1', miudo: '1d2', pequeno: '1d3',
    grande: '1d6', enorme: '1d8', imenso: '2d6', colossal: '3d6' },
  '1d6': {
    minusculo: '1', diminuto: '1d2', miudo: '1d3', pequeno: '1d4',
    grande: '1d8', enorme: '2d6', imenso: '3d6', colossal: '4d6' },
  '1d8': {
    minusculo: '1d2', diminuto: '1d3', miudo: '1d4', pequeno: '1d6',
    grande: '2d6', enorme: '3d6', imenso: '4d6', colossal: '6d6' },
  '1d10': {
    minusculo: '1d3', diminuto: '1d4', miudo: '1d6', pequeno: '1d8',
    grande: '2d8', enorme: '3d8', imenso: '4d8', colossal: '6d8' },
  '1d12': {
    minusculo: '1d4', diminuto: '1d6', miudo: '1d8', pequeno: '1d10',
    grande: '3d6', enorme: '4d6', imenso: '6d6', colossal: '8d6' },
  '2d4': {
    minusculo: '1d2', diminuto: '1d3', miudo: '1d4', pequeno: '1d6',
    grande: '2d6', enorme: '3d6', imenso: '4d6', colossal: '6d6' },
  '2d6': {
    minusculo: '1d4', diminuto: '1d6', miudo: '1d8', pequeno: '1d10',
    grande: '3d6', enorme: '4d6', imenso: '6d6', colossal: '8d6' },
  '2d8': {
    minusculo: '1d6', diminuto: '1d8', miudo: '1d10', pequeno: '2d6',
    grande: '3d8', enorme: '4d8', imenso: '6d8', colossal: '8d8' },
  '2d10': {
    minusculo: '1d8', diminuto: '1d10', miudo: '2d6', pequeno: '2d8',
    grande: '4d8', enorme: '6d8', imenso: '8d8', colossal: '12d8' },
};

var tabelas_armaduras_leves = {
  nenhuma: {
    nome: 'Nenhuma', bonus: 0, preco: '0 PO' },
  acolchoada: {
    nome: 'Acolchoada', bonus: 1, maximo_bonus_destreza: 8, preco: '5 PO' },
  armadura_arcana: {
    nome: 'Armadura Arcana', bonus: 4, maximo_bonus_destreza: 100, preco: '0 PO' },
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

// Dano do monge por nivel.
var tabelas_monge_desarmado = {
  1: { dano: { medio: '1d6' } },
  2: { dano: { medio: '1d6' } },
  3: { dano: { medio: '1d6' } },
  4: { dano: { medio: '1d8' } },
  5: { dano: { medio: '1d8' } },
  6: { dano: { medio: '1d8' } },
  7: { dano: { medio: '1d8' } },
  8: { dano: { medio: '1d10' } },
  9: { dano: { medio: '1d10' } },
  10: { dano: { medio: '1d10' } },
  11: { dano: { medio: '1d10' } },
  12: { dano: { medio: '2d6' } },
  13: { dano: { medio: '2d6' } },
  14: { dano: { medio: '2d6' } },
  15: { dano: { medio: '2d6' } },
  16: { dano: { medio: '2d8' } },
  17: { dano: { medio: '2d8' } },
  18: { dano: { medio: '2d8' } },
  19: { dano: { medio: '2d8' } },
  20: { dano: { medio: '2d10' } },
};

// Mapeia o nome para a chave. Necessario para computar proficiencias.
var tabelas_armas_invertida = {
  // Cada entrada: nome_completo: chave_entrada.
};

// Esta tabela eh composta pela juncao das tabelas de armas simples, comuns e exoticas.
var tabelas_armas = {
  // Cada entrada (dano secundario apenas para armas duplas):
  // chave: { nome, preco, dano: { pequeno, medio, grande etc }, dano_secundario: {pequeno, medio, grande etc },
  // categorias: { cac, cac_leve, arremesso, distancia},
  //          critico, peso, tipo, incremento_distancia, talento_relacionado, arma_dupla }
};

var tabelas_armas_simples = {
  // Unarmed Attacks
  desarmado: { preco: '0 PO', dano: { medio: '1d3' },
               categorias: { cac_leve: true },
               critico: '×2', peso: '0', tipo: 'concussao', incremento_distancia: '0 quadrados' },
  manopla: { preco: '2 PO', dano: { medio: '1d3'  },
             categorias: { cac_leve: true },
             critico: '×2', peso: '500g', tipo: 'concussao', },

  //Light Melee Weapons
  adaga: { preco: '2 PO', dano: { medio: '1d4' } ,
           categorias: { cac_leve: true, arremesso: true } ,
           incremento_distancia: '2 quadrados', critico: '19-20/×2', peso: '0,5kg',
           tipo: 'cortante/perfurante' },

  adaga_de_soco: { nome: 'adaga de soco', preco: '2 PO', dano: { medio: '1d4' },
                   categorias: { cac_leve: true },
                   critico: '×3', peso: '0,5kg', tipo: 'perfurante' },
  manopla_com_cravos: { nome: 'manopla com cravos', preco: '5 PO', dano: { medio: '1d4' } ,
                        categorias: { cac_leve: true } ,
                        critico: '×2', peso: '0,5kg', tipo: 'perfurante' },
  maca_leve: { nome: 'maça leve', preco: '5 PO', dano: { medio: '1d6' } ,
               categorias: { cac_leve: true } ,
               critico: '×2', peso: '2kg', tipo: 'concussao' },
  foice_curta: { nome: 'foice curta', preco: '6 PO', dano: { medio: '1d6' } ,
                  categorias: { cac_leve: true } ,
                  critico: '×2', peso: '1kg', tipo: 'cortante' },

  // One-Handed Melee Weapons
  clava: { preco: '0 PO', dano: { medio: '1d6'  }, critico: '×2',
           categorias: { cac_leve: true, arremesso: true },
           incremento_distancia: '2 quadrados', peso: '1,5Kg', tipo: 'concussao' },
  maca_pesada: { nome: 'maça pesada', preco: '12 PO', dano: { medio: '1d8' } ,
                 categorias: { cac: true } ,
                 critico: '×2', peso: '4kg', tipo: 'concussao' },
  maca_estrela: { nome: 'maça estrela', preco: '8 PO', dano: { medio: '1d8' } ,
                  categorias: { cac: true } ,
                  critico: '×2', peso: '3kg', tipo: 'concussao/perfurante' },
  lanca_curta: { nome: 'lança curta', preco: '1 PO', dano: { medio: '1d6' },
                 categorias: { cac: true, arremesso: true} ,
                 incremento_distancia: '4 quadrados', critico: '×2', peso: '1,5kg', tipo: 'perfurante' },

  // Two-Handed Melee Weapons
  lanca: { nome: 'lança', preco: '2 PO', dano: { medio: '1d8'  }, critico: '×3',
           categorias: { cac: true, arremesso: true },
           incremento_distancia: '4 quadrados', peso: '3kg', tipo: 'perfurante' },
  lanca_longa: { nome: 'lança longa', preco: '5 PO', dano: { medio: '1d8' },
                 categorias: { cac: true } ,
                 critico: '×3', peso: '4,5kg', tipo: 'perfurante' },
  bordao: { nome: 'bordão', preco: '0 PO', dano: { medio: '1d6' },
            dano_secundario: { pequeno: '1d4', medio: '1d6' }, categorias: { cac: true } ,
            critico: '×2', peso: '2kg', tipo: 'concussao', arma_dupla: true },


  // Ranged Weapons
  besta_pesada: { nome: 'besta pesada', preco: '50 PO', dano: { medio: '1d10'  },
                  critico: '19-20/×2', categorias: { distancia: true },
                  incremento_distancia: '24 quadrados', peso: '4kg', tipo: 'perfurante' },
  besta_leve: { nome: 'besta leve', preco: '35 PO', dano: { medio: '1d8'  }, critico: '19-20/×2',
                categorias: { distancia: true },
                incremento_distancia: '16 quadrados', peso: '2kg', tipo: 'perfurante' },
  dardo: { nome: 'dardo', preco: '5 PP', dano: { medio: '1d4'  }, critico: '×2',
           categorias: { arremesso: true },
           incremento_distancia: '4 quadrados', peso: '250g', tipo: 'perfurante' },
  azagaia: { preco: '1 PO', dano: { medio: '1d6'  }, critico: '×2',
             categorias: { arremesso: true },
             incremento_distancia: '6 quadrados', peso: '1Kg', tipo: 'perfurante' },
  funda: { nome: 'funda', preco: '0 PO', dano: { medio: '1d4'  }, critico: '×2',
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
                         dano: { medio: '1d6'  }, critico: '×2',
                         categorias: { cac_leve: true },
                         peso: 'especial', tipo: 'perfurante' },

  escudo_pequeno: { nome: 'escudo pequeno', preco: 'especial', dano: { medio: '1d3' } ,
                    categorias: { cac_leve: true } ,
                    critico: '×2', peso: 'especial', tipo: 'concussão' },

  escudo_pequeno_com_cavos: { nome: 'escudo pequeno com cravos', preco: 'especial',
                              dano: { medio: '1d4'}, categorias: { cac_leve: true  } ,
                              critico: '×2', peso: 'especial', tipo: 'perfurante' },

  espada_curta: { nome: 'espada curta', preco: '10 PO', dano: { medio: '1d6' } ,
                  categorias: { cac_leve: true } ,
                  critico: '19-20/×2', peso: '1kg', tipo: 'perfurante' },

  kukri: { preco: '8 PO', dano: { medio: '1d4' } ,
           categorias: { cac_leve: true } ,
           critico: '18-20/×2', peso: '1kg', tipo: 'cortante' },

  machadinha: { preco: '6 PO', dano: { medio: '1d6' } ,
                categorias: { cac_leve: true } ,
                critico: '×3', peso: '1,5kg', tipo: 'cortante' },

  machado_de_arremesso: { nome: 'machado de arremesso', preco: '8 PO', dano: { medio: '1d6' } ,
                          categorias: { cac_leve: true, arremesso: true} ,
                          incremento_distancia: '2 quadrados', critico: '×2', peso: '1kg', tipo: 'cortante' },

  martelo_leve: { nome: 'martelo leve', preco: '1 PO', dano: { medio: '1d4' } ,
                  categorias: { cac_leve: true, arremesso: true} ,
                  incremento_distancia: '4 quadrados', critico: '×2', peso: '1kg', tipo: 'concussão' },

  picareta_leve: { nome: 'picareta leve', preco: '4 PO', dano: { medio: '1d4' } ,
                   categorias: { cac_leve: true } ,
                   critico: '×4', peso: '1,5kg', tipo: 'perfurante' },

  porrete: { nome: 'porrete', preco: '1 PO', dano: { medio: '1d6' } ,
             categorias: { cac_leve: true } ,
             critico: '×2', peso: '1kg', tipo: 'concussão' },

// One-Handed Melee Weapons

  cimitarra: { nome: 'cimitarra', preco: '15 PO', dano: { medio: '1d6' } ,
               categorias: { cac: true } ,
               critico: '18-20/×2', peso: '2kg', tipo: 'cortante' },

  escudo_grande: { nome: 'escudo grande', preco: 'especial', dano: { medio: '1d4' } ,
                   categorias: { cac: true } ,
                   critico: '×2', peso: 'especial', tipo: 'concussão' },

  escudo_grande_com_cravos: { nome: 'escudo grande com cravos', preco: 'especial', dano: { medio: '1d6' } ,
                 categorias: { cac: true } ,
                 critico: '×2', peso: 'especial', tipo: 'perfurante' },

  espada_longa: { nome: 'espada longa', preco: '15 PO', dano: { medio: '1d8' } ,
                  categorias: { cac: true },
                  critico: '19-20/×2', peso: '2kg', tipo: 'cortante', },

  machado_de_batalha: { nome: 'machado de batalha', preco: '10 PO', dano: { medio: '1d8' } ,
                        categorias: { cac: true } ,
                        critico: '×3', peso: '3kg', tipo: 'cortante' },

  mangual: { nome: 'mangual', preco: '8 PO', dano: { medio: '1d8' } ,
             categorias: { cac: true } ,
             critico: '×2', peso: '2,5kg', tipo: 'concussão' },

  martelo_de_guerra: { nome: 'martelo de guerra', preco: '12 PO', dano: { medio: '1d8' } ,
                       categorias: { cac: true } ,
                       critico: '×3', peso: '2,5kg', tipo: 'concussão' },

  picareta_pesada: { nome: 'picareta pesada', preco: '8 PO', dano: { medio: '1d6' } ,
                     categorias: { cac: true } ,
                     critico: '×4', peso: '3kg', tipo: 'perfurante' },

  sabre: { nome: 'sabre', preco: '20 PO', dano: { medio: '1d6' } ,
           categorias: { cac: true } ,
           critico: '18-20/x2', peso: '1kg', tipo: 'perfurante' },

  tridente: { nome: 'tridente', preco: '15 PO', dano: { medio: '1d8' } ,
              categorias: { cac: true, arremesso: true} ,
              incremento_distancia: '2 quadrados', critico: '×2', peso: '2kg', tipo: 'perfurante' },


// Two-Handed Melee Weapons
  alabarda: { nome: 'alabarda', preco: '10 PO', dano: { medio: '1d10' } ,
              categorias: { cac_duas_maos: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante/perfurante' },

  clava_grande: { nome: 'clava grande', preco: '5 PO', dano: { medio: '1d10' } ,
                  categorias: { cac_duas_maos: true } ,
                  critico: '×2', peso: '4Kg', tipo: 'concussão' },

  espada_larga: { nome: 'espada larga', preco: '50 PO', dano: { medio: '2d6' } ,
                  categorias: { cac_duas_maos: true } ,
                  critico: '19-20/×2', peso: '4Kg', tipo: 'cortante' },

  falcione: { nome: 'falcione', preco: '75 PO', dano: { medio: '2d4' } ,
              categorias: { cac_duas_maos: true },
              critico: '18-20/×2', peso: '4kg', tipo: 'cortante', },

  foice_longa: { nome: 'foice longa', preco: '18 PO', dano: { medio: '2d4' } ,
                 categorias: { cac_duas_maos: true } ,
                 critico: '×4', peso: '10kg', tipo: 'cortante/perfurante' },

  glaive: { nome: 'glaive', preco: '8 PO', dano: { medio: '1d10' } ,
            categorias: { cac_duas_maos: true } ,
            critico: '×3', peso: '10Kg', tipo: 'cortante' },

  guisarme: { nome: 'guisarme', preco: '9 PO', dano: { medio: '2d4' } ,
              categorias: { cac_duas_maos: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante' },

  lanca_montada: { nome: 'lança montada', preco: '10 PO', dano: { medio: '1d8' } ,
                   categorias: { cac_duas_maos: true } ,
                   critico: '×3', peso: '10kg', tipo: 'perfurante' },

  machado_grande: { nome: 'machado grande', preco: '20 PO', dano: { medio: '1d12' } ,
                    categorias: { cac_duas_maos: true } ,
                    critico: 'x3', peso: '11kg', tipo: 'cortante' },

  mangual_pesado: { nome: 'mangual pesado', preco: '15 PO', dano: { medio: '1d10' } ,
                    categorias: { cac_duas_maos: true } ,
                    critico: '19-20/x2', peso: '10kg', tipo: 'concussão' },

  ranseur: { nome: 'ranseur', preco: '10 PO', dano: { medio: '2d4' } ,
             categorias: { cac_duas_maos: true } ,
             critico: 'x3', peso: '11kg', tipo: 'perfurante' },

// Ranged Weapons

  arco_curto: { nome: 'arco curto', preco: '30 PO', dano: { medio: '1d6'  }, critico: '×3',
                categorias: { distancia: true },
                incremento_distancia: '12 quadrados', peso: '1Kg', tipo: 'perfurante' },

  arco_curto_composto: { nome: 'arco curto composto', preco: '75 PO',
                         dano: { medio: '1d6'  }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_1: { nome: 'arco curto composto (1)', preco: '150 PO',
                           dano: { medio: '1d6'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_2: { nome: 'arco curto composto (2)', preco: '225 PO',
                           dano: { medio: '1d6'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_3: { nome: 'arco curto composto (3)', preco: '300 PO',
                           dano: { medio: '1d6'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_4: { nome: 'arco curto composto (4)', preco: '375 PO',
                           dano: { medio: '1d6'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_5: { nome: 'arco curto composto (5)', preco: '450 PO',
                           dano: { medio: '1d6'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_6: { nome: 'arco curto composto (6)', preco: '525 PO',
                           dano: { medio: '1d6'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },

  arco_longo: { nome: 'arco longo', preco: '75 PO', dano: { medio: '1d8'  }, critico: 'x3',
                categorias: { distancia: true },
                incremento_distancia: '20 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto: { nome: 'arco longo composto', preco: '100 PO',
                         dano: { medio: '1d8'  }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_1: { nome: 'arco longo composto (1)', preco: '200 PO',
                           dano: { medio: '1d8'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_2: { nome: 'arco longo composto (2)', preco: '300 PO',
                           dano: { medio: '1d8'  }, critico: 'x3',
                           categorias: { distancia: true },
                           incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_3: { nome: 'arco longo composto (3)', preco: '400 PO',
                         dano: { medio: '1d8'  }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_4: { nome: 'arco longo composto (4)', preco: '500 PO',
                         dano: { medio: '1d8'  }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_5: { nome: 'arco longo composto (5)', preco: '600 PO',
                         dano: { medio: '1d8'  }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_6: { nome: 'arco longo composto (6)', preco: '700 PO',
                         dano: { medio: '1d8'  }, critico: 'x3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

//Arrows (20) 1 gp  — — — — 3 lb. —
};

var tabelas_armas_exoticas = {

// Exotic Weapons  Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons

  kama: { nome: 'kama', preco: '2 PO', dano: { medio: '1d6' } ,
          categorias: { cac_leve: true } ,
          critico: '×2', peso: '1Kg', tipo: 'cortante' },

  nunchaku: { nome: 'nunchaku', preco: '2 PO', dano: { medio: '1d6' } ,
              categorias: { cac_leve: true } ,
              critico: '×2', peso: '1Kg', tipo: 'concussão' },

  sai: { nome: 'sai', preco: '1 PO', dano: { medio: '1d4' } ,
         categorias: { cac_leve: true, arremesso: true } ,
         incremento_distancia: '2 quadrados', critico: '×2', peso: '0,5kg', tipo: 'concussão' },

  siangham: { preco: '3 PO', dano: { medio: '1d6' } ,
              categorias: { cac_leve: true } ,
              critico: '×2', peso: '0,5kg', tipo: 'perfurante' },

// One-Handed Melee Weapons

  chicote: { nome: 'chicote', preco: '1 PO', dano: { medio: '1d3' } ,
             categorias: { cac: true } ,
             critico: '×2', peso: '1kg', tipo: 'cortante' },

  espada_bastarda: { nome: 'espada bastarda', preco: '35 PO', dano: { medio: '1d10' } ,
                     categorias: { cac: true } ,
                     critico: '19-20/x2', peso: '3Kg', tipo: 'cortante' },

  machado_de_guerra_anao: { nome: 'machado de guerra anão', preco: '30 PO',
                            dano: { medio: '1d10'}, categorias: { cac: true  } ,
                            critico: '×3', peso: '4Kg', tipo: 'cortante' },

// Two-Handed Melee Weapons


  corrente_com_cravos: { nome: 'corrente com cravos', preco: '25 PO', dano: { medio: '2d4' } ,
                         categorias: { cac_duas_maos: true },
                         critico: '×2', peso: '10kg', tipo: 'perfurante', },

  espada_de_duas_laminas: { nome: 'espada de duas lâminas', preco: '100 PO',
                            dano: { medio: '1d8'  },
                            dano_secundario: {pequeno: '1d6', medio: '1d8' },
                            categorias: { cac: true }, arma_dupla: true,
                            critico: '19-20/x2', peso: '10Kg', tipo: 'cortante' },

  machado_orc_duplo: { nome: 'machado orc duplo', preco: '60 PO',
                       dano: { medio: '1d8'  },
                       dano_secundario: { pequeno: '1d6', medio: '1d8' },
                       arma_dupla: true,
                       categorias: { cac: true }, critico: '×3', peso: '12,5kg', tipo: 'cortante' },

  mangual_atroz: { nome: 'mangual atroz', preco: '90 PO',
                   dano: { medio: '1d8' },
                   dano_secundario: { pequeno: '1d6', medio: '1d8'},
                   categorias: { cac: true }, arma_dupla: true,
                   critico: '×2', peso: '10kg', tipo: 'concussão' },

  martelo_gnomo_com_gancho: { nome: 'martelo gnomo com gancho', preco: '20 PO',
                              dano: { medio: '1d8' },
                              dano_secundario: { pequeno: '1d4', medio: '1d6'},
                              categorias: { cac: true }, arma_dupla: true,
                              critico: '×3/x4', peso: '3kg', tipo: 'concussão e perfurante' },

  urgrosh_anao: { nome: 'urgrosh anão', preco: '50 PO',
                  dano: { medio: '1d8' },
                  dano_secundario: { pequeno: '1d4', medio: '1d6'},
                  categorias: { cac: true }, arma_dupla: true,
                  critico: 'x3', peso: '11kg', tipo: 'cortante ou perfurante' },

// Ranged Weapons

  besta_leve_de_repeticao: { nome: 'besta leve de repetição', preco: '250 PO',
                             dano: { medio: '1d8'  }, critico: '19-20/x2',
                             categorias: { distancia: true },
                             incremento_distancia: '16 quadrados', peso: '3Kg', tipo: 'perfurante' },

  besta_pesada_de_repeticao: { nome: 'besta pesada de repetição', preco: '400 PO',
                               dano: { medio: '1d10'  }, critico: '19-20/x2',
                               categorias: { distancia: true },
                               incremento_distancia: '24 quadrados', peso: '11kg', tipo: 'perfurante' },

  besta_de_mao: { nome: 'besta de mão', preco: '100 PO', dano: { medio: '1d4'  },
                  critico: '19-20/x2', categorias: { distancia: true },
                  incremento_distancia: '6 quadrados', peso: '1kg', tipo: 'perfurante' },

  boleadeira: { nome: 'boleadeira', preco: '5 PO', dano: { medio: '1d4'  }, critico: 'x2',
                categorias: { distancia: true },
                incremento_distancia: '2 quadrados', peso: '1kg', tipo: 'concussão' },

  rede: { nome: 'rede', preco: '20 PO', dano: { medio: '-'  }, critico: '-',
          categorias: { distancia: true },
          incremento_distancia: '2 quadrados', peso: '3kg', tipo: '-' },

  shuriken: { nome: 'shuriken (5)', preco: '1 PO', dano: { medio: '1d2'  }, critico: 'x2',
              categorias: { arremesso: true },
              incremento_distancia: '2 quadrados', peso: '0,25kg', tipo: 'perfurante' },

//Bolts (10)  1 gp  — — — — 1 lb. —
//Bolts (5) 1 gp  — — — — 1 lb. —
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
//   // A classe do nivel pode ser 'conjurador', 'total' ou uma chave de classe.
//   requisitos: { bba, talentos: [], atributos: { nome: valor },
//                 nivel: { classe: nivel }, proficiencia_arma, arma_leve, }
// },
var tabelas_talentos = {
/*
Encontrão Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de encontrão e não provoca ataques de oportunidade
Atropelar Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de atropelar e não provoca ataques de oportunidade
Separar Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de Separar e não provoca ataques de oportunidade
Arquearia Montada¹ Combate Montado Sofre metade das penalidades nos ataques à distância realizados sobre montarias
Investida Implacável¹ Combate Montado, Investida Montada Investidas montadas causam dano dobrado
Pisotear¹ Combate Montado A vítima não pode evitar um atropelamento montada
Bloqueio Ambidestro¹ Combater com Duas Armas A arma da mão inábil concede +1 de bônus de escudo na CA
Contramágica Aprimorada - Contramágica com magias da mesma escola
Dominar Magia² 1° nível de mago Capaz de preparar as magias escolhidas sem um grimório
Fintar Aprimorado¹ Especialização em Combate Fintar em combate é uma ação de movimento
Ataque Giratório¹ Des 13, Especialização em Combate, Esquiva, Mobilidade, Ataque em Movimento, bônus base de ataque +4 Realiza um ataque corporal contra cada oponente dentro do alcance
Expulsão Aprimorada Habilidade de expulsar ou fascinar criaturas +1 nível efetivo para testes de expulsão
Foco em Perícia² - +3 de bônus nos teste da perícia escolhida
Potencializar Invocação Foco em Magia (conjuração) As criaturas invocadas recebem +4 For e +4 Cons
Rapidez de Recarga¹ Usar Arma Simples (besta) Recarrega bestas mais rapidamente
sorrateiro - +2 nos testes de Esconder-se e Furtividade
Sucesso Decisivo Aprimorado¹² Usar a arma, bônus base de ataque +8 Dobra a margem de ameaça da arma
Tiro Longo¹ Tiro Certeiro Aumenta o incremento de distância em 50% ou 100%
Tiro em Movimento¹ Des 13, Esquiva, Mobilidade, Tiro Certeiro, bônus base de ataque +4 Pode se deslocar antes e depois de um ataque à distância
Tiro Preciso Aprimorado¹ Des 19, Tiro Certeiro, Tiro Preciso, bônus base de ataque +11 Ignorar qualquer cobertura ou camuflagem (exceto total) para ataques à distância
Usar Armadura (leve) - Não sofre penalidade de armadura nas jogadas de ataque
Usar Armadura (média) - Não sofre penalidade de armadura nas jogadas de ataque
Usar Armadura (pesada) - Não sofre penalidade de armadura nas jogadas de ataque
Talentos de Criação de Item Pré-requisitos Benefícios
Forjar Anel 12° nível de conjurador Criar anéis mágicos
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

  agarrar_aprimorado: {
      nome: 'Agarrar Aprimorado',
      guerreiro: true,
      monge: 1,
      requisitos: { atributos: { destreza: 13 }, talentos: [ 'ataque_desarmado_aprimorado' ] },
      descricao: '+4 de bônus nos testes de Agarrar e não provoca ataques de oportunidade.',
  },
  agil: {
      nome: 'Ágil',
      bonus_pericias: { equilibrio: 2, arte_da_fuga: 2 } },

  apanhar_objetos: {
      nome: 'Apanhar Objetos',
      requisitos: { atributos: { destreza: 15 }, talentos: ['desviar_objetos', 'ataque_desarmado_aprimorado'], },
      descricao: 'Apanha uma arma arremessada ou projétil',
      guerreiro: true, },
  aptidao_magica: {
      nome: 'Aptidão Mágica',
      bonus_pericias: { identificar_magia: 2, usar_instrumento_magico: 2 } },
  ataque_atordoante: {
      nome: 'Ataque Atordoante',
      monge: 1,
      guerreiro: true,
      descricao: 'Atordoa a vítima com um ataque desarmado.',
      requisitos: { bba: 8, talentos: [ 'ataque_desarmado_aprimorado' ], atributos: { destreza: 13, sabedoria: 13 } },
  },
  ataque_desarmado_aprimorado: {
      nome: 'Ataque Desarmado Aprimorado',
      guerreiro: true,
      descricao: 'Considerado armado quando estiver desarmado', },

  ataque_movimento: {
      nome: 'Ataque em Movimento',
      descricao: 'Capaz de deslocar antes e depois do ataque',
      requisitos: { bba: 4, talentos: [ 'mobilidade' ], },
      guerreiro: true,
  },
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
  combate_montado: {
      nome: 'Combate Montado',
      requisitos: { pericias: { cavalgar: 1 } },
      guerreiro: true,
      descricao: 'Evita os ataques contra a montaria com um teste de Cavalgar',
  },
  combater_duas_armas: {
      nome: 'Combater com duas armas',
      requisitos: { atributos: { destreza: 15 } },
      guerreiro: true,
      ranger: 2,
      descricao: 'Reduz penalidade ao usar duas maos em 2.',
  },
  combater_duas_armas_aprimorado: {
      nome: 'Combater com duas armas aprimorado',
      requisitos: { atributos: { destreza: 17 }, bba: 6, talentos: [ 'combater_duas_armas'] },
      guerreiro: true,
      ranger: 6,
      descricao: 'Ataque adicional com a segunda mao.',
  },
  // TODO regra do terceiro ataque.
  combater_duas_armas_maior: {
      nome: 'Combater com Duas Armas Maior',
      guerreiro: true,
      ranger: 11,
      requisitos: { atributos: { destreza: 19 }, talentos: ['combater_duas_armas_aprimorado', ], bba: 11 },
      descricao: 'Adquire um terceiro ataque com a mão inábil',
  },
  // TODO teoricamente esse bonus eh so se correr...
  corrida: {
      nome: 'Corrida',
      bonus_pericias: { saltar: 4 },
      descricao: 'Percorre 5 vezes o deslocamento padrão, ' +
                 '+4 de bônus nos testes de Saltar no final de uma corrida.', },
  dedos_lepidos: {
      nome: 'Dedos Lépidos',
      bonus_pericias: { operar_mecanismos: 2, abrir_fechaduras: 2 } },
  desarme_aprimorado: {
      nome: 'Desarme Aprimorado',
      guerreiro: true,
      monge: 6,
      descricao: '+4 de bônus nas tentativas de desarme e não provoca ataques de oportunidade.',
  },
  desviar_objetos: {
      nome: 'Desviar Objetos',
      requisitos: { atributos: { destreza: 13 } }, talentos: [ 'ataque_desarmado_aprimorado' ],
      monge: 2,
      guerreiro: true,
      descricao: 'Desvia um ataque à distância por rodada',
  },
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
  //Escrever Pergaminho 1° nível de conjurador Criar pergaminhos mágicos
  escrever_pergaminho: {
    nome: 'Escrever Pergaminho',
    descricao: 'Criar pergaminhos mágicos.',
    requisitos: { nivel: { conjurador: 1 } },
  },
  especializacao_arma: {
    nome: 'Especialização em Arma',
    guerreiro: true,
    complemento: 'arma',
    requisitos: { proficiencia_arma: true, talentos: [ 'foco_em_arma'], nivel: { guerreiro: 4 }},
    descrição: '+2 de bônus no dano com a arma escolhida.', },
  // TODO implementar/mostrar esse bonus de alguma forma.
  esquiva: {
    nome: 'Esquiva',
    requisitos: { atributos: { destreza: 13 } },
    descricao: '+1 de bônus de esquiva na CA contra um adversário à sua escolha.',
    guerreiro: true,
  },
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
      descricao: '+2 de bônus nas jogadas de ataque com a arma escolhida.'
  },
  // TODO aplicar os bonus de CD.
  foco_em_magia: {
    nome: 'Foco em Magia',
    complemento: 'escola_magia',
    descricao: '+1 de bônus na CD dos testes de resistência de uma escola de magia específica.',
  },
  foco_em_magia_maior: {
    nome: 'Foco em Magia Maior',
    complemento: 'escola_magia',
    requisitos: { talentos: ['foco_em_magia'] },
    descricao: '+1 de bônus na CD dos testes de resistência de uma escola de magia específica.',
  },
  fortitude_maior: {
      nome: 'Fortitude Maior',
      bonus_salvacao: { fortitude: 2, },
      descricao: '+2 de bônus nos teste de resistência de Fortitude.', },
  fraudulento: {
      nome: 'Fraudulento',
      bonus_pericias: { disfarces: 2, falsificacao: 2 } },
  ignorar_componentes_materiais: {
      nome: 'Ignorar Componentes Materiais',
      descricao: 'Conjura magias ignorando os componentes materiais.', },
  investida_montada: {
      nome: 'Investida Montada',
      guerreiro: true,
      requisitos: { talentos: ['combate_montado'] },
      descricao: 'Pode se deslocar antes e depois de uma investida montada',
  },
  derrubar_aprimorado: {
      nome: 'Derrubar Aprimorado (Imobilização Aprimorada)',
      requisitos: { talentos: ['especializacao_em_combate'] },
      guerreiro: true,
      monge: 6,
      descricao: '+4 de bônus nas tentativas de derrubar e não provoca ataques de oportunidade.',
  },
  especializacao_em_combate: {
      nome: 'Especialização em Combate',
      guerreiro: true,
      requisitos: { atributos: { inteligencia: 13 } },
      descricao: 'Substitui bônus de ataque por CA (máximo 5 pontos).',
  },
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
      requisitos: { nivel: { total: 6, }, },
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
      descricao: '+2 de bônus nos testes de conjurador contra Resistência à Magia para uma escola',
  },
  // Magia Penetrante TODO +2 de bônus nos testes de conjurador contra Resistência à Magia
  // (cumulativo com magia penetrante).
  magia_penetrante_maior: {
      nome: 'Magia Penetrante Maior',
      requisitos: { talentos: [ 'magia_penetrante' ] },
      descricao: '+2 de bônus nos testes de conjurador contra Resistência à Magia para uma escola (cumulativo)',
  },
  magia_combate: {
      nome: 'Magia em Combate', descricao: '+4 de bônus nos teste de Concentração para conjurar na defensiva.',
  },
  maos_level: {
      nome: 'Mãos Leves',
      bonus_pericias: { prestidigitacao: 2, usar_cordas: 2 } },
  mobilidade: {
      nome: 'Mobilidade',
      requisitos: { talentos: [ 'esquiva'], },
      descricao: '+4 de bônus de esquiva na CA contra ataques de oportunidade.',
      guerreiro: true, },
  negociador: {
      nome: 'Negociador',
      descricao: '+2 de bônus nos testes de Diplomacia e Sentir Motivação.',
      bonus_pericias: { diplomacia: 2, sentir_motivacao: 2, }, },
  persuasivo: {
      nome: 'Persuasivo',
      descricao: '+2 de bônus nos testes de blefar e intimidação.',
      bonus_pericias: { blefar: 2, intimidacao: 2 } },
  prontidao: {
      nome: 'Prontidão',
      bonus_pericias: { ouvir: 2, observar: 2 },
      descricao: 'Bonus de +2 em ouvir e observar.' },
  rastrear: {
      nome: 'Rastrear',
      descricao: 'Utiliza Sobrevivência para rastrear.', },
  reflexos_em_combate: {
      nome: 'Reflexos em Combate',
      guerreiro: true,
      monge: 2,
      descricao: 'Permite número de ataques de oportunidade na rodada igual ao bonus de destreza.',
  },
  reflexos_rapidos: {
      nome: 'Reflexos Rápidos',
      bonus_salvacao: { reflexo: 2, },
      descricao: '+2 de bônus nos testes de resistência de Reflexos.', },
  saque_rapido: {
      nome: 'Saque rápido',
      requisitos: { bba: 1 },
      guerreiro: true,
      descricao: 'Saca uma arma branca como ação livre.',
  },
  tiro_certeiro: {
    nome: 'Tiro Certeiro',
    guerreiro: true,
    descricao: '+1 de bônus nos ataques à distância e dano contra alvos num raio de 9 metros.',
  },
  tiro_multiplo: {
      nome: 'Tiro Múltiplo',
      guerreiro: true,
      ranger: 6,
      requisitos: { atributos: { destreza: 17 }, talentos: ['tiro_certeiro', 'tiro_rapido'], bba: 6, },
      descricao: 'Dispara duas ou mais flechas simultaneamente.',
  },
  tiro_preciso: {
    nome: 'Tiro Preciso',
    guerreiro: true,
    ranger: 11,
    requisitos: { talentos: [ 'tiro_certeiro'], },
    descricao: 'Anula a penalidade por disparar contra um adversário em combate corporal com um aliado (-4)',
  },
  tiro_rapido: {
      nome : 'Tiro Rápido',
      guerreiro: true,
      ranger: 2,
      requisitos: { atributos: { destreza: 13 }, talentos: ['tiro_certeiro'], },
      descricao: 'Um ataque à distância adicional por rodada.',
  },
  tolerancia: {
      nome: 'Tolerância',  // Endurance.
      descricao: '+4 de bônus nos testes para resistir a danos não letais (nadar, correr, marcha ' +
                 'forçada, respiração, fome e sede, frio, calor e sufocamento. Pode dormir em armadura ' +
                 'leve ou média sem fatigar.',
  },
  trespassar: {
      nome: 'Trespassar',  // Cleave
      descricao: 'Desfere um ataque corporal extra depois de imobilizar um oponente',
      requisitos: { talentos: [ 'ataque_poderoso' ] },
      guerreiro: true, },
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
  usar_escudo: {
      nome: 'Usar Escudo',
      descricao: 'Não sofre penalidade de armadura nas jogadas de ataque.' },
  // TODO A chave certa desse aqui eh ataque_escudo_aprimorado.
  usar_escudo_aprimorado: {
      nome: 'Ataque com Escudo Aprimorado',
      guerreiro: true,
      requisitos: { talentos: [ 'usar_escudo', ] },
      descricao: 'Conserva o bônus do escudo na CA quando ataca com ele.' },
  // Usar Escudo de Corpo Usar Escudo Não sofre penalidade de armadura nas jogadas de ataque
  usar_escudo_corpo: {
      nome: 'Usar Escudo de Corpo', },
  // toughness em ingles.
  vitalidade: {
      nome: 'Vitalidade',
      bonus_pv: 3,
      cumulativo: true,
      descricao: '+3 pontos de vida.', },
  vontade_ferro: {
      nome: 'Vontade de Ferro',
      bonus_salvacao: { vontade: 2, },
      descricao: '+2 de bônus nos testes de resistência de Vontade.', },
  criar_armaduras_e_armas_magicas: {
      nome: 'Criar Armaduras e Armas Mágicas',
      requisitos: { nivel: { conjurador: 5, }, },
      descricao: 'Permite a criação de armas, armaduras e escudos mágicos.',
  },
  criar_bastao: {
      nome: 'Criar Bastão',
      requisitos: { nivel: { conjurador: 9 }, },
      descricao: 'Permite a criação de bastões mágicos.', },
  criar_cajado: {
      nome: 'Criar Cajado',
      requisitos: { nivel: { conjurador: 12 }, },
      descricao: 'Permite a criação de cajados mágicos', },
  criar_item_maravilhoso: {
      nome: 'Criar Item Maravilhoso',
      requisitos: { nivel: { conjurador: 3 }, },
      descricao: 'Permite a criação de itens mágicos maravilhosos.', },
  criar_varinha: {
      nome: 'Criar Varinha',
      requisitos: { nivel: { conjurador: 5 }, },
      descricao: 'Permite a criação de varinhas mágicas .', },
  preparar_pocao: {
      nome: 'Preparar Poção',
      requisitos: { nivel: { conjurador: 3 }, },
      descricao: 'Permite a criação de poções mágicas.', },
  // Talentos Metamágicos Pré-requisitos Benefícios
  // TODO implementar niveis_adicionais.
  acelerar_magia: {
      nome: 'Acelerar Magia',
      descricao: 'Permite conjurar magia como ação livre, ao custo de três níveis adicionais.',
      niveis_adicionais: 3,
  },
  ampliar_magia: {
    nome: 'Ampliar Magia',
    descricao: 'Dobra a área da magia, ao custo de três níveis adicionais',
    niveis_adicionais: 3,
  },
  aumentar_magia: {
    nome: 'Aumentar Magia',
    descricao: 'Dobra o alcance da magia, ao custo de um nível adicional',
    niveis_adicionais: 1,
  },
  elevar_magia: {
    nome: 'Elevar Magia',
    descricao: 'Conjura a magia num nível mais elevado, alterando sua classe de dificuldade, nível etc.',
  },
  estender_magia: {
    nome: 'Estender Magia',
    descricao: 'Dobra a duração da magia, ao custo de um nível adicional.',
    niveis_adicionais: 1,
  },
  magia_sem_gestos: {
    nome: 'Magia sem Gestos',
    descricao: 'Ignora os componentes gestuais da magia, ao custo de um nível adicional.',
    niveis_adicionais: 1,
  },
  magia_silenciosa: {
    nome: 'Magia Silenciosa',
    descricao: 'Ignora os componentes verbais da magia, ao custo de um nível adicional',
    niveis_adicionais: 1,
    // TODO feiticos de bardo nao podem.
  },
  maximizar_magia: {
    nome: 'Maximizar Magia',
    descricao: 'Maximiza todas as variáveis numéricas dos efeitos da magia, ao custo de três níveis adicionais',
    niveis_adicionais: 3,
  },
  potencializar_magia: {
    nome: 'Potencializar Magia',
    descricao: 'Aumenta em 50% todas as variáveis numéricas dos efeitos da magia, ao custo de dois níveis adicionais.',
    niveis_adicionais: 2,
  },
  outros: {
    nome: 'Outros',
    descricao: 'Para talentos que não estão presentes na planilha.',
    complemento: 'livre'
  },
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
      nome: 'Conhecimento (arquitetura e engenharia)',
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
      nome: 'Ofícios (outros)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_alquimia: {
      nome: 'Ofícios (alquimia)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_armoraria: {
      nome: 'Ofícios (armoraria)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_arquearia: {
      nome: 'Ofícios (arquearia)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_armeiro: {
      nome: 'Ofícios (armeiro)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_armadilharia: {
      nome: 'Ofícios (armadilharia)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
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
      elementos:['div-pontos-vida', 'div-ataque'] },
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
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma",
};

var tabelas_atributos_invertidos = {
  'Força': 'forca',
  'Destreza': 'destreza',
  'Constituição': 'constituicao',
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
  mesclarse_as_pedras: { nome: 'Mesclar-se as pedras', preco: '27000 PO', },
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
  periapto_saude: {
    // Usuario fica imune a doencas (inclusive sobrenaturais).
    nome: 'Periapto da Saúde', preco: '7500 PO',
    propriedades: { imunidades: ['doencas'] } },
  periapto_resistencia_veneno: {
    // Usuário fica imune a veneno.
    nome: 'Periapto da Resistência a Veneno', preco: '27000 PO',
    propriedades: { imunidades: ['veneno'] } },
  periapto_sabedoria_2: {
    // Aumento sabedoria do usuario (bonus melhoria).
    nome: 'Periapto da Sabedoria +2', preco: '4000 PO',
    propriedades: { atributos: { sabedoria: 2 } } },
  periapto_sabedoria_4: {
    // Aumento sabedoria do usuario (bonus melhoria).
    nome: 'Periapto da Sabedoria +4', preco: '16000 PO',
    propriedades: { atributos: { sabedoria: 4 } } },
  periapto_sabedoria_6: {
    // Aumento sabedoria do usuario (bonus melhoria).
    nome: 'Periapto da Sabedoria +6', preco: '36000 PO',
    propriedades: { atributos: { sabedoria: 6 } } },
};

var tabelas_bracaduras = {
  armadura_1: {
    nome: 'Braçadeira da Armadura +1', preco: '1000 PO',
    propriedades: { ca: { armadura: 1 } },
  },
  armadura_2: {
    nome: 'Braçadeira da Armadura +2', preco: '4000 PO',
    propriedades: { ca: { armadura: 2 } },
  },
  armadura_3: {
    nome: 'Braçadeira da Armadura +3', preco: '9000 PO',
    propriedades: { ca: { armadura: 3 } },
  },
  armadura_4: {
    nome: 'Braçadeira da Armadura +4', preco: '16000 PO',
    propriedades: { ca: { armadura: 4 } },
  },
  armadura_4: {
    nome: 'Braçadeira da Armadura +5', preco: '25000 PO',
    propriedades: { ca: { armadura: 5 } },
  },
  armadura_6: {
    nome: 'Braçadeira da Armadura +6', preco: '36000 PO',
    propriedades: { ca: { armadura: 6 } },
  },
  armadura_7: {
    nome: 'Braçadeira da Armadura +7', preco: '49000 PO',
    propriedades: { ca: { armadura: 7 } },
  },
  armadura_8: {
    nome: 'Braçadeira da Armadura +8', preco: '64000 PO',
    propriedades: { ca: { armadura: 8 } },
  },
  arqueiro_menor: {
    nome: 'Braçadeira de Arqueiro (Menor)', preco: '5000 PO',
    propriedades: {  },
    // Da pericia em arcos (exceto bestas). Se ja tiver, da +2 ataque, +1 dano.
  },
  arqueiro_maior: {
    nome: 'Braçadeira de Arqueiro (Maior)', preco: '25000 PO',
    propriedades: { },
    // Da pericia em arcos (exceto bestas). Se ja tiver, da +1 ataque.
  },
};

var tabelas_botas = {
  botas_aladas: {
    nome: 'Botas Aladas', preco: '16000 PO',
    descricao: 'magia vôo 3x/dia.',
    propriedades: { },
  },
  botas_caminhar_saltar: {
    nome: 'Botas de Caminhar e Saltar', preco: '5500 PO',
    descricao: 'Aumenta deslocamento básico em dois quadrados e +5 de competência em saltar',
    propriedades: { pericias: { saltar: { competencia: 5 } } }
  },
  botas_elficas: {
    nome: 'Botas Élficas', preco: '2500 PO',
    propriedades: { pericias: { furtividade: { competencia: 5 } } }
  },
  botas_inverno: {
    nome: 'Botas do Inverno', preco: '2500 PO',
    descricao: 'Andar na neve com deslocamento normal, sem rastro. Andar no gelo escorregadio deslocamento normal. Suportar elementos.',
    propriedades: { },
  },
  botas_levitacao: {
    nome: 'Botas da Levitação', preco: '7500 PO',
    descricao: 'Permite lançar levitar sobre si mesmo',
    propriedades: {},
  },
  botas_teletransporte: {
    nome: 'Botas do Teletransporte', preco: '49000 PO',
    descricao: 'Permite lançar teletransportar 3x/dia.',
    propriedades: {},
  },
  botas_velocidade: {
    nome: 'Botas da velocidade', preco: '12000 PO',
    descricao: 'Permite usar velocidade por 10 rodadas em um dia (não precisam ser rodadas consecutivas).',
    propriedades: {},
  },
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

// TODO: terminar as propriedades de outras capas.
var tabelas_capas = {
  manto_resistencia_1: { nome: 'Manto da resistência +1', preco: '1000 PO',
    propriedades: { salvacoes: { todas: 1} },  },
  manto_elfico: {
    nome: 'Manto élfico', preco: '2500 PO',
    propriedades: { pericias: { esconderse: { competencia: 5 } } }
  },
  manto_carisma_2: { nome: 'Manto do carisma +2', preco: '4000 PO',
    propriedades: { atributos: { carisma: 2 } },  },
  manto_resistencia_2: { nome: 'Manto da resistência +2', preco: '4000 PO',
    propriedades: { salvacoes: { todas: 2 } },  },
  manto_arraia: { nome: 'Manto da arraia', preco: '7200 PO'},
  manto_resistencia_3: { nome: 'Manto da resistência +3', preco: '9000 PO',
    propriedades: { salvacoes: { todas: 3 } },  },
  capa_saltimbanco: { nome: 'Capa do saltimbanco', preco: '10080 PO'},
  manto_aranha: { nome: 'Manto da aranha', preco: '14000 PO' },
  manto_carisma_4: { nome: 'Manto do carisma +4', preco: '16000 PO',
    propriedades: { atributos: { carisma: 4 } },  },
  manto_resistencia_4: { nome: 'Manto da resistência +4', preco: '16000 PO',
    propriedades: { salvacoes: { todas: 4 } },  },
  manto_deslocamento_menor: { nome: 'Manto do deslocamento (menor)', preco: '24000 PO'},
  manto_resistencia_5: { nome: 'Manto da resistência +5', preco: '25000 PO',
    propriedades: { salvacoes: { todas: 5 } },  },
  manto_morcego: { nome: 'Manto do morcego', preco: '26000 PO'},
  manto_carisma_6: { nome: 'Manto do carisma +6', preco: '36000 PO',
    propriedades: { atributos: { carisma: 6 } },  },
  manto_deslocamento_maior: { nome: 'Manto do deslocamento (maior)', preco: '50000 PO'},
  manto_forma_eterea: { nome: 'Manto da forma etérea', preco: '55000 PO'},
  manto_fe: { nome: 'Túnica da fé', preco: '76000 PO'},
  tunica_resistencia_magia: { nome: 'Túnica de resistência a magia', preco: '90000 PO'},
};

var tabelas_itens = {
  aneis: { nome: 'Anéis', tabela: tabelas_aneis, maximo: 2 },
  amuletos: { nome: 'Amuletos', tabela: tabelas_amuletos, maximo: 1 },
  botas: { nome: 'Botas', tabela: tabelas_botas, maximo: 1 },
  bracaduras: { nome: 'Braçadeiras', tabela: tabelas_bracaduras, maximo: 1 },
  pocoes: { nome: 'Poções', tabela: tabelas_pocoes, maximo: 0, },
  capas: { nome: 'Capas', tabela: tabelas_capas, maximo: 1 },
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
      nome: 'prata alquímica',
      requisitos: { arma: true, metal: true, }, },
};
