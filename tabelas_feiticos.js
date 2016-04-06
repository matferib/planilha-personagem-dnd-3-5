// Feiticos das classes.

var tabelas_lista_feiticos = {
  adepto: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
  },
  clerigo: {
    0: {
      'consertar': { nome: 'Consertar', descricao: 'Faz pequenos reparos em um objeto.' },
      'criar_agua': { nome: 'Criar Água', descricao: 'Cria 8 litros/nível de água pura.' },
      'curar_ferimentos_minimos': { nome: 'Curar Ferimentos Mínimos', descricao: 'Cura 1 ponto de dano.' },
      'detectar_magia': { nome: 'Detectar Magia', descricao: 'Detecta magias e itens mágicos a menos de 18 m.' },
      'detectar_venenos': { nome: 'Detectar Venenos', descricao: 'Detecta veneno em uma criatura ou objeto.' },
      'inflingir_ferimentos_minimos': { nome: 'Infligir Ferimentos Mínimos', descricao: 'Ataque de toque, 1 ponto de dano.' },
      'ler_magias': { nome: 'Ler Magias', descricao: 'Decifra pergaminhos ou grimórios.' },
      'luz': { nome: 'Luz', descricao: 'Um objeto brilha como uma tocha.' },
      'orientacao': { nome: 'Orientação', descricao: '+1 para uma jogada ou teste.' },
      'purificar_alimentos': { nome: 'Purificar Alimentos', descricao: 'Purifica um cubo de 30 cm/nível de comida ou água.' },
      'resistencia': { nome: 'Resistência', descricao: 'O alvo recebe +1 para testes de resistência.' },
      'virtude': { nome: 'Virtude', descricao: 'O alvo ganha 1 PV temporário.' },
    },
    1: {
      'abencoar_agua': { nome: 'Abençoar Água', componente_material: true, descricao: 'Cria água benta.' },
      'amaldicoar_agura': { nome: 'Amaldiçoar Água', componente_material: true, descricao: 'Cria água profana.' },
      'arma_magica': { nome: 'Arma Mágica', descricao: 'Uma arma recebe +1 de bônus.' },
      'auxilio_divino': { nome: 'Auxílio Divino', descricao: 'Você recebe +1 de bônus/3 níveis para ataques e dano.' },
      'bencao': { nome: 'Bênção', descricao: 'Aliados recebem +1 para ataques e testes contra medo.' },
      'causar_medo': { nome: 'Causar Medo', descricao: 'Uma criatura foge durante 1d4 rodadas.' },
      'comando': { nome: 'Comando', descricao: 'Um alvo obedece a uma palavra de comando durante 1 rodada.' },
      'compreender_idiomas': { nome: 'Compreender Idiomas', descricao: 'Entenda todas as línguas faladas e escritas.' },
      'curar_ferimentos_leves': { nome: 'Curar Ferimentos Leves', descricao: ' Cura 1d8 +1/nível de dano (máx. +5).' },
      'desespero': { nome: 'Desespero', descricao: ' Um alvo recebe -2 para ataques, dano e testes.' },
      'detectar_caos_mal_bem_ordem': { nome: 'Caos/Mal/Bem/Ordem', descricao: 'Revela criaturas, magias ou objetos.' },
      'detectar_mortos_vivos': { nome: 'Detectar Mortos-Vivos', descricao: 'Revela mortos-vivos a menos de 18 m.' },
      'escudo_da_fe': { nome: 'Escudo da Fé', descricao: 'Aura concede +2 ou mais de bônus de deflexão.' },
      'escudo_entropico': { nome: 'Escudo Entrópico', descricao: 'Ataques à distância contra você possuem 20% de chance de falha.' },
      'inflingir_ferimentos_leves': { nome: 'Infligir Ferimentos Leves', descricao: ' Ataque de toque, 1d8 +1/nível de dano (máx. +5).' },
      'invisibilidade_contra_mortos_vivos': { nome: 'Invisibilidade Contra Mortos-Vivos', descricao: ' Mortos-vivos não podem perceber 1 alvo/nível.' },
      'invocar_criaturas_i': { nome: 'Invocar Criaturas I', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador' },
      'maldicao_menor': { nome: 'Maldição Menor', descricao: 'Inimigos recebem -1 em ataques e testes contra medo.' },
      'nevoa_obscurescente': { nome: 'Névoa Obscurescente', descricao: 'Névoa espessa envolve o conjurador' },
      'pedra_encantada': { nome: 'Pedra Encantada', descricao: 'Três pedras recebem +1 para ataque e causam 1d6+l de dano.' },
      'protecao_contra_caos_mal_bem_ordem': { nome: 'Proteção Contra o Caos/Mal/Bem/Ordem', descricao: ' +2 na CA e testes de resistência, impede controle mental, isola elementais e seres extra-planares.' },
      'remover_medo': { nome: 'Remover Medo', descricao: '+4 em testes contra medo para 1 alvo/4 níveis.' },
      'santuario': { nome: 'Santuário', descricao: 'Os oponentes não podem atacar o conjurador e vice-versa.' },
      'suportar_elementos': { nome: 'Suportar Elementos', descricao: 'Mantém uma criatura confortável dentro de ambientes áridos.' },
      'visao_da_morte': { nome: 'Visão da Morte', descricao: 'Detecta a situação de criaturas a menos de 9 m.' },
    },
    2: {
      'acalmar_emocoes': { nome: 'Acalmar Emoções', descricao: 'Acalma criaturas, anula efeitos de emoção.' },
      'ajuda': { nome: 'Ajuda', descricao: '+1 para ataques e testes de resistência contra medo, 1d8 pontos de vida temporários.' },
      'arma_espiritual': { nome: 'Arma Espiritual', descricao: 'Arma mágica ataca sozinha' },
      'augurio': { nome: 'Augúrio', descricao: 'Descobre se uma ação será boa ou má.', material: true, foco: true, },
      'cativar': { nome: 'Cativar', descricao: 'Cativa todos num raio de 30 m + 3 m/nível.' },
      'condição': { nome: 'Condição', descricao: 'Monitora condição e posição de aliados.' },
      'consagrar': { nome: 'Consagrar', descricao: 'Enche uma área com energia positiva, enfraquecendo mortosvivos.', material: true },
      'curar_ferimentos_moderados': { nome: 'Curar Ferimentos Moderados', descricao: 'Cura 2d8 +l/nível de dano (máx. +10).' },
      'descanso_tranquilo': { nome: 'Descanso Tranqüilo', descricao: 'Preserva um corpo.' },
      'despedaçar': { nome: 'Despedaçar', descricao: 'Vibrações sônicas causam dano a objetos ou criaturas cristalinas.' },
      'dissimular_tendencia': { nome: 'Dissimular Tendência', descricao: 'Esconde uma tendência durante 24 horas.' },
      'drenar_força_vital': { nome: 'Drenar Força Vital', descricao: 'Mata uma criatura ferida. Você ganha 1d8 PV temporários, +2 Força e +1 nível de conjurador.' },
      'encontrar_armadilha': { nome: 'Encontrar Armadilha', descricao: 'Descobre armadilhas como um ladino.' },
      'escuridao': { nome: 'Escuridão', descricao: 'Cria 6 m de raio de escuridão sobrenatural.' },
      'esplendor_da_aguia': { nome: 'Esplendor da Águia', descricao: 'O alvo recebe +4 Car durante 1 min/nível.' },
      'explosao_sonora': { nome: 'Explosão Sonora', descricao: 'Causa 1d8 de dano sônico ao alvo e pode atordoá-lo.' },
      'forca_do_touro': { nome: 'Força do Touro', descricao: 'O alvo ganha +4 For por 1 min/nível.' },
      'imobilizar_pessoa': { nome: 'Imobilizar Pessoa', descricao: 'Paralisa uma pessoa durante 1 rodada/nível.' },
      'infligir_ferimentos_moderados': { nome: 'Infligir Ferimentos Moderados', descricao: 'Ataque de toque, 2d8 +l/nível de dano (máx. +10).' },
      'invocar_criaturas_ii': { nome: 'Invocar Criaturas II', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },
      'profanar': { nome: 'Profanar', descricao: 'Preenche uma área com energia negativa, fortalecendo mortosvivos.' },
      'proteger_outro': { nome: 'Proteger OutroF', descricao: 'Você sofre metade do dano dirigido ao alvo.', foco: true },
      'remover_paralisia': { nome: 'Remover Paralisia', descricao: 'Liberta uma ou mais criaturas de paralisia ou lentidão.' },
      'resistencia_a_elementos': { nome: 'Resistência à Elementos', descricao: 'Ignora 10 dano/ataque de um tipo de energia.' },
      'restauracao_menor': { nome: 'Restauração Menor', descricao: 'Dissipa penalidades mágicas de habilidade ou recupera 1d4 de dano de habilidade.' },
      'retardar_envenenamento': { nome: 'Retardar Envenenamento', descricao: 'Impede que veneno cause dano ao alvo durante 1 hora/nível.' },
      'sabedoria_da_coruja': { nome: 'Sabedoria da Coruja', descricao: 'O alvo ganha +4 Sab por 1 min/nível. ' },
      'silencio': { nome: 'Silêncio', descricao: 'Anula todo o som num raio de 4,5 m.' },
      'tendencia_em_arma': { nome: 'Tendência em Arma', descricao: 'Arma se torna sagrada, profana, axiomática ou anárquica.' },
      'tornar_inteiro': { nome: 'Tornar Inteiro', descricao: 'Repara um objeto.' },
      'vigor_do_urso': { nome: 'Vigor do Urso', descricao: 'O alvo ganha +4 Con por 1 min/nível.' },
      'zona_da_verdade': { nome: 'Zona da Verdade', descricao: 'Os alvos na área não podem mentir.' },
    },
    3: {
      'caminhar_na_agua': { nome: 'Caminhar na Água', descricao: 'O alvo caminha sobre a água como se ela fosse sólida.'},
      'cegueira_surdez': { nome: 'Cegueira/Surdez', descricao: ' Torna o alvo cego ou surdo.' },
      'chama_continua': { nome: 'Chama ContinuaM', descricao: ' Cria fogo ilusório.', material: true },
      'circulo_magico_contra': { nome: 'Circulo Mágico Contra o Caos/Mal/Bem/Ordem', descricao: ' Como as magias de proteção, mas com 3 m de raio e 10 min/nível.' },
      'criar_alimentos': { nome: 'Criar Alimentos', descricao: ' Alimenta três humanos (ou um cavalo) /nível.' },
      'criar_mortos_vivos_menor': { nome: 'Criar Mortos-Vivos Menor', descricao: ' Cria zumbis e esqueletos.', material: true },
      'curar_ferimentos_graves': { nome: 'Curar Ferimentos Graves', descricao: ' Cura 3d8 + l/nível de dano (máx. +15).' },
      'dissipar_magia': { nome: 'Dissipar Magia', descricao: ' Cancela magias e efeitos mágicos.' },
      'escuridao_profunda': { nome: 'Escuridão Profunda', descricao: ' Objeto cria escuridão absoluta em um raio de 18 m.' },
      'falar_com_os_mortos': { nome: 'Falar Com os Mortos', descricao: ' Corpo responde a uma pergunta/2 níveis.' },
      'infligir_ferimentos_graves': { nome: 'Infligir Ferimentos Graves', descricao: ' Ataque de toque, 3d8 +l/nível de dano (máx. + 15' },
      'invocar_criaturas_iii': { nome: 'Invocar Criaturas III', descricao: ' Invoca um ser extra-planar para auxiliar o conjurador.' },
      'localizar_objetos': { nome: 'Localizar Objetos', descricao: ' Sente a direção do objeto (especifico ou tipo).' },
      'luz_cegante': { nome: 'Luz Cegante', descricao: ' Raio causa 1d8 de dano/2 níveis ou mais contra mortos-vivos.' },
      'luz_do_dia': { nome: 'Luz do Dia', descricao: ' Ilumina 18 m de raio com uma luz brilhante.' },
      'mao_opifera': { nome: 'Mão Opífera', descricao: ' Mão fantasmagórica guia uma pessoa até você.' },
      'mesclar_se_as_rochas': { nome: 'Mesclar-se as Rochas', descricao: ' Você e seu equipamento se unem a pedras.' },
      'moldar_rochas': { nome: 'Moldar Rochas', descricao: ' Molda pedra em qualquer forma.' },
      'muralha_de_vento': { nome: 'Muralha de Vento', descricao: ' Desvia disparos, criaturas pequenas e gases.' },
      'obscurecer_objeto': { nome: 'Obscurecer Objeto', descricao: ' Protege um objeto contra adivinhações.' },
      'oracao': { nome: 'Oração', descricao: ' Os abados recebem +1 em várias jogadas e os inimigos sofrem -1.' },
      'praga': { nome: 'Praga', descricao: ' Infecta um alvo com a doença escolhida.' },
      'protecao_contra_elementos': { nome: 'Proteção Contra Elementos', descricao: ' Absorve 12 de dano/nível de um tipo de energia.' },
      'purgar_invisibilidade': { nome: 'Purgar Invisibilidade', descricao: ' Dissipa invisibilidade em uma área de 13 m/nível.' },
      'remover_cegueira_surdez': { nome: 'Remover Cegueira/Surdez', descricao: ' Cura condições normais ou mágicas.' },
      'remover_doencas': { nome: 'Remover Doenças', descricao: ' Cura todas as doenças que afetam o alvo.' },
      'remover_maldicao': { nome: 'Remover Maldição', descricao: ' Liberta objeto ou pessoa de maldição.' },
      'respirar_na_agua': { nome: 'Respirar na Água', descricao: ' Os alvos podem respirar sob a água.' },
      'rogar_maldição': { nome: 'Rogar Maldição',
        descricao: 'toque causa -6 numa habilidade ou -4 nos ataques e testes ou 50% de chance de perder cada ação.'
      },
      'roupa_encantada': { nome: 'Roupa Encantada', descricao: ' Armadura ou escudo recebe bônus de melhoria de +1/4 níveis.' },
      'símbolo_de_proteção': { nome: 'Símbolo de Proteção', descricao: ' Inscrição fere os intrusos', material: true },
    },
  },
  mago: {
    0: {
      'detectar_magia': {
        nome: 'Detectar Magia', descricao: 'Detecta magias e itens mágicos a menos de 18m.', escola: 'adivinhacao'
      },
      'som_fantasma': {
        nome: 'Som Fantasma', descricao: 'Imita sons.', escola: 'ilusao',
      },
      'toque_fadiga': {
        nome: 'Toque da Fadiga', descricao: 'Ataque de toque fatiga o alvo', escola: 'necromancia',
      },
      'romper_morto_vivo': {
        nome: 'Romper Morto-Vivo', descricao: 'Romper Morto-Vivo', escola: 'necromancia',
      },
      'raio_de_gelo': {
        nome: 'Raio de Gelo', descricao: 'Raio causa 1d3 de dano de frio', escola: 'evocacao',
      },
      'raio_de_acido': {
        nome: 'Raio de Ácido', descricao: 'Raio causa 1d3 de dano de ácido', escola: 'conjuracao',
      },
      'ler_magias': {
        nome: 'Ler Magias', descricao: 'Decifra pergaminho ou grimórios', escola: '',
      },
      'luz': {
        nome: 'Luz', descricao: 'Um objeto brilha como uma tocha', escola: 'evocacao',
      },
      'pasmar': {
        nome: 'Pasmar', descricao: 'Criatura de até 4 HD perde próxima ação', escola: 'encantamento', duracao: '1 rodada'
      },
      'toque_da_fadiga': {
        nome: 'Toque da Fadiga', descricao: 'Alvo tocado fica fatigado.', duracao: '1 rodada / nível', escola: 'necromancia'
      },
    },
    1: {
      'area_escorregadia': {
        nome: 'Área Escorregadia', descricao: 'Torna 3 m quadrados ou um objeto escorregadios.', escola: 'conjuracao'
      },
      'armadura_arcana': {
        nome: 'Armadura Arcana', descricao: 'Concede ao alvo +4 de bônus de armadura.', escola: 'abjuracao'
      },
      'maos_flamejantes': {
        nome: 'Mãos Flamejantes', descricao: 'Cone de fogo de 3 quadrados dando 1d4/nível até máximo 5d4.', escola: 'evocacao',
      },
      'misseis_magicos': {
        nome: 'Mísseis Mágicos', descricao: '1d4+1 de dano, 1 Míssil/2 níveis acima do 1º, máximo 5', escola: 'evocacao',
      },
      'raio_enfraquecimento': {
        nome: 'Raio do Enfraquecimento', descricao: 'Raio reduz For em 1d6+1/2 níveis até 1d6+5.', escola: 'necromancia',
      },
    },
    2: {
      'invisibilidade': {
        nome: 'Invisibilidade', descricao: 'O alvo fica invisível durante 1 min/nível ou até atacar.', escola: 'ilusao'
      },
      'queimadura_aganazzar': {
        nome: 'Queimadura de Aganazzar', descricao: 'Linha de fogo causa 1d8/2 níveis até 5d8.', escola: 'evocacao', fonte: 'FR',
      },
      'mao_espectral': {
        nome: 'Mão Espectral', descricao: 'Mão brilhante realiza ataques de toque, permitindo lançamento de feitiços de 4º nível ou menor com +2 de bônus, como ação de ataque. Ao criar a mão, perde-se 1d4 pontos de vida.', escola: 'evocacao', fonte: 'FR',
      },
      'patas_de_aranha': {
        nome: 'Patas de Aranha', descricao: 'Concede habilidade para andar em parede e tetos.', escola: 'transmutacao'
      },
      'resistir_elementos': {
        nome: 'Resistência a Elementos', descricao: 'Criatura ganha resistência 10, 20 no 7º nível ou 30 no 11º nível) a um tipo de elemento', escola: 'abjuracao', duracao: '10 min / nível',
      },
      'teia': {
        nome: 'Teia', descricao: '4 quadrados de teia apoiada em lados opostos prende criaturas na área. Ver descrição para mais detalhes.'
      },
      'vitalidade_ilusoria': {
        nome: 'Vitalidade Ilusória', descricao: 'Ganha 1d10 + (1 PV / nível) temporários por 1h / nível.',
        escola: 'necromancia', duracao: '1h / nível'
      },
      'nublar': {
        nome: 'Nublar', descricao: 'Ataques têm 20% de chance de falha.', escola: 'ilusao', duracao: '1 min / nível'
      }
    },
    3: {
      'relampago': {
        nome: 'Relâmpago', descricao: 'Eletricidade causa 1d6/nível', escola: 'evocacao',
      },
      'toque_vampirico': {
        nome: 'Toque Vampírico', descricao: 'Toque causa 1d6/2 níveis, conjurador recebe os PV como temporários.', escola: 'necromancia',
      },
    },
    4: {
      'pele_rochosa': {
        nome: 'Pele Rochosa', descricao: 'Resistência de 10 dano/adamante até 10/nível, max 150.', escola: 'abjuracao',
      },
    },
  },
  bardo: {
  },
  druida: {
  },
  feiticeiro: {
  },
  ranger: {
    1: {
      'acalmar_animais': {
        nome: 'Acalmar Animais', descricao: 'Acalma 2d4+nivel DV de animais', escola: 'encantamento',
      },
      'alarme': {
        nome: 'Alarme', descricao: 'Protege uma área durante 2h/nível', escola: 'abjuracao',
      },
      'constricao': {
        nome: 'Constrição', descricao: 'Plantas enredam todos em um círculo de 12m de raio', escola: 'transmutacao',
      },
      'detectar_animais_ou_plantas': {
        nome: 'Detectar Animais ou Plantas', descricao: 'Detecta espécies de animais ou plantas.', escola: '',
      },
      'detectar_armadilhas': {
        nome: 'Detectar Armadilhas', descricao: 'Revela armadilhas naturais ou primitivas', escola: '',
      },
      'detectar_venenos': {
        nome: 'Detectar Venenos', descricao: 'Detecta veneno em uma criatura ou objeto', escola: '',
      },
      'enfeiticar_animal': {
        nome: 'Torna um animal seu aliado', descricao: '', escola: '',
      },
      'falar_com_animais': {
        nome: 'Falar com Animais', descricao: 'Comunicação com animais naturais', escola: '',
      },
      'invisibilidade_contra_animais': {
        nome: 'Invisibilidade Contra Animais', descricao: 'Animais não percebem 1 alvo/nível.', escola: '',
      },
      'invocar_aliado_natureza_i': {
        nome: 'Invocar Aliado da Natureza I', descricao: 'Invoca animais para auxílio.', escola: 'conjuracao',
      },
      'ler_magias': {
        nome: 'Ler Magias', descricao: 'Decifra pergaminho ou grimórios', escola: '',
      },
      'mensageiro_animal': {
        nome: 'Mensageiro Animal', descricao: 'Envia um animal miúdo para um local específico.', escola: '',
      },
      'passos_longos': {
        nome: 'Passos Longos', descricao: 'Aumenta deslocamento em 3m (dois quadrados)', escola: '',
      },
      'passos_sem_pegadas': {
        nome: 'Passos sem Pegadas', descricao: 'Um alvo/nível não deixa rastro.', escola: '',
      },
      'presa_magica': {
        nome: 'Presa mágica', descricao: 'Uma arma natural do alvo recebe +1 ataque e dano', escola: '',
      },
      'resistencia_elementos': {
        nome: 'Ignora 10 ou mais dano/ataque contra um tipo de energia', descricao: '', escola: '',
      },
      'retardar_envenenamento': {
        nome: 'Retardar Envenenamento', descricao: 'Impede que veneno cause dano ao alvo durante 1 hora/nível', escola: '',
      },
      'salto': {
        nome: 'Salto', descricao: 'Alvo recebe bônus de saltar.', escola: '',
      },
      'suportar_elementos': {
        nome: 'Suportar Elementos', descricao: 'Mantém uma criatura confortável dentro de ambientes áridos.', escola: '',
      },
    },
    2: {
      '': {
        nome: '', descricao: '', escola: '',
      },
    },
    3: {
      '': {
        nome: '', descricao: '', escola: '',
      },
    },
    4: {
      '': {
        nome: '', descricao: '', escola: '',
      },
    },
  },
};
tabelas_lista_feiticos['mago_necromante'] = tabelas_lista_feiticos['mago'];
// Todos os feiticos ordenados por chave.
var tabelas_lista_feiticos_completa = {};
// Tabela de nome para chave_feitico.
var tabelas_lista_feiticos_invertida = {};

// Tabelas de feiticos. Todas as entradas de por dia e conhecidos devem ter o mesmo numero de caracteres.
// ATENCAO: todas as tabelas sao indexadas pelo nivel da classe. Porem, algumas classes alteram esse valor, por exemplo, teurgista mistico.
// O valor a ser usado da classe eh indice_feiticos.
// TODO adicionar uma variavel precisa_memorizar. O precisa_conhecer esta sendo sobreusado para este proposito.
var tabelas_feiticos = {
  adepto: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: true,
      por_nivel: {
          1: { por_dia: '31',   },
          2: { por_dia: '31',   },
          3: { por_dia: '32',   },
          4: { por_dia: '320',  },
          5: { por_dia: '321',  },
          6: { por_dia: '321',  },
          7: { por_dia: '332',  },
          8: { por_dia: '3320', },
          9: { por_dia: '3321', },
          10: { por_dia: '3321', },
          11: { por_dia: '3332', },
          12: { por_dia: '33320', },
          13: { por_dia: '33321', },
          14: { por_dia: '33321', },
          15: { por_dia: '33332', },
          16: { por_dia: '333320', },
          17: { por_dia: '333321', },
          18: { por_dia: '333321', },
          19: { por_dia: '333332', },
          20: { por_dia: '333332', }, }, },
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
  mago_necromante: {
      atributo_chave: 'inteligencia',
      escola_especializada: 'necromancia',
      num_escolas_proibidas: 2,
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
  ranger: {
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
