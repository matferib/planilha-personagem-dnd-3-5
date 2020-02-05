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
  // a entrada dominio lista a quais dominios a magia pertence. Se alem de dominio for geral, tambem sera listada.
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
      'invisibilidade': { nome: 'Invisibilidade', descricao: 'O alvo fica invisível durante 1 min/nível ou até atacar.', dominios: ['enganacao'] },
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
      'cegueira_surdez': { nome: 'Cegueira/Surdez', descricao: 'Torna o alvo cego ou surdo.' },
      'chama_continua': { nome: 'Chama ContinuaM', descricao: 'Cria fogo ilusório.', material: true },
      'circulo_magico_contra': { nome: 'Circulo Mágico Contra o Caos/Mal/Bem/Ordem', descricao: 'Como as magias de proteção, mas com 3 m de raio e 10 min/nível.' },
      'criar_alimentos': { nome: 'Criar Alimentos', descricao: 'Alimenta três humanos (ou um cavalo) /nível.' },
      'criar_mortos_vivos_menor': { nome: 'Criar Mortos-Vivos Menor', descricao: 'Cria zumbis e esqueletos.', material: true },
      'curar_ferimentos_graves': { nome: 'Curar Ferimentos Graves', descricao: 'Cura 3d8 + l/nível de dano (máx. +15).' },
      'dissipar_magia': { nome: 'Dissipar Magia', descricao: 'Cancela magias e efeitos mágicos.' },
      'escuridao_profunda': { nome: 'Escuridão Profunda', descricao: 'Objeto cria escuridão absoluta em um raio de 18 m.' },
      'falar_com_os_mortos': { nome: 'Falar Com os Mortos', descricao: 'Corpo responde a uma pergunta/2 níveis.' },
      'infligir_ferimentos_graves': { nome: 'Infligir Ferimentos Graves', descricao: 'Ataque de toque, 3d8 +l/nível de dano (máx. + 15' },
      'invocar_criaturas_iii': { nome: 'Invocar Criaturas III', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },
      'localizar_objetos': { nome: 'Localizar Objetos', descricao: 'Sente a direção do objeto (especifico ou tipo).' },
      'luz_cegante': { nome: 'Luz Cegante', descricao: 'Raio causa 1d8 de dano/2 níveis ou mais contra mortos-vivos.' },
      'luz_do_dia': { nome: 'Luz do Dia', descricao: 'Ilumina 18 m de raio com uma luz brilhante.' },
      'mao_opifera': { nome: 'Mão Opífera', descricao: 'Mão fantasmagórica guia uma pessoa até você.' },
      'mesclar_se_as_rochas': { nome: 'Mesclar-se as Rochas', descricao: 'Você e seu equipamento se unem a pedras.' },
      'moldar_rochas': { nome: 'Moldar Rochas', descricao: 'Molda pedra em qualquer forma.' },
      'muralha_de_vento': { nome: 'Muralha de Vento', descricao: 'Desvia disparos, criaturas pequenas e gases.' },
      'obscurecer_objeto': { nome: 'Obscurecer Objeto', descricao: 'Protege um objeto contra adivinhações.' },
      'oracao': { nome: 'Oração', descricao: 'Os abados recebem +1 em várias jogadas e os inimigos sofrem -1.' },
      'praga': { nome: 'Praga', descricao: 'Infecta um alvo com a doença escolhida.' },
      'protecao_contra_elementos': { nome: 'Proteção Contra Elementos', descricao: 'Absorve 12 de dano/nível de um tipo de energia.' },
      'purgar_invisibilidade': { nome: 'Purgar Invisibilidade', descricao: 'Dissipa invisibilidade em uma área de 13 m/nível.' },
      'remover_cegueira_surdez': { nome: 'Remover Cegueira/Surdez', descricao: 'Cura condições normais ou mágicas.' },
      'remover_doencas': { nome: 'Remover Doenças', descricao: 'Cura todas as doenças que afetam o alvo.' },
      'remover_maldicao': { nome: 'Remover Maldição', descricao: 'Liberta objeto ou pessoa de maldição.' },
      'respirar_na_agua': { nome: 'Respirar na Água', descricao: 'Os alvos podem respirar sob a água.' },
      'rogar_maldição': { nome: 'Rogar Maldição', descricao: 'toque causa -6 numa habilidade ou -4 nos ataques e testes ou 50% de chance de perder cada ação.' },
      'roupa_encantada': { nome: 'Roupa Encantada', descricao: ' Armadura ou escudo recebe bônus de melhoria de +1/4 níveis.' },
      'símbolo_de_proteção': { nome: 'Símbolo de Proteção', descricao: ' Inscrição fere os intrusos', material: true },
    },
    4: {
      'adivinhacao': { nome: 'Adivinhação', descricao: 'Oferece conselhos úteis sobre as ações propostas.' },
      'aliado_extra_planar_menor': { nome: 'Aliado Extra-Planar Menor', descricao: 'Negocia serviços com um ser extra-planar de 6 DV.' },
      'ancora_dimensional': { nome: 'Ancora Dimensional', descricao: 'Impede movimento extra-dimensional.' },
      'andar_no_ar': { nome: 'Andar no Ar', descricao: 'O alvo caminha no ar como se fosse sólido (num ângulo de 45°).' },
      'arma_magica_maior': { nome: 'Arma Mágica Maior', descricao: '+1/4 níveis, máx. +5.' },
      'controlar_a_agua': { nome: 'Controlar a Água', descricao: 'Aumenta ou abaixa água.' },
      'curar_ferimentos_criticos': { nome: 'Curar Ferimentos Críticos', descricao: 'Cura 4d8+ l/nível de dano (máx. +20).' },
      'discernir_mentiras': { nome: 'Discernir Mentiras', descricao: 'Revela mentiras deliberadas.' },
      'envenenamento': { nome: 'Envenenamento', descricao: 'Toque causa 1d10 de dano de Con, que se repete após 1 min.' },
      'enviar_mensagem': { nome: 'Enviar Mensagem', descricao: 'Entrega uma mensagem curta em qualquer lugar, instantaneamente.' },
      'expulsao': { nome: 'Expulsão', descricao: 'Força uma criatura a retornar para seu plano nativo.' },
      'idiomas': { nome: 'Idiomas', descricao: 'Fala qualquer idioma.' },
      'imunidade_a_magia': { nome: 'Imunidade à Magia', descricao: 'O alvo fica imune a 1 magia/4 níveis.' },
      'infligir_ferimentos_criticos': { nome: 'Infligir Ferimentos Críticos', descricao: 'Ataque de toque, 4d8 +l/nível de dano (máx. +20).' },
      'inseto_gigante': { nome: 'Inseto Gigante', descricao: 'Transforma centopéias, escorpiões ou aranhas comuns em insetos gigantes.' },
      'invocar_criaturas_iv': { nome: 'Invocar Criaturas IV', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },
      'movimentacao_livre': { nome: 'Movimentação Livre', descricao: 'O alvo se move normalmente apesar de impedimentos.' },
      'neutralizar_venenos': { nome: 'Neutralizar Venenos', descricao: 'Imuniza contra ou retira o veneno de um personagem.' },
      'poder_divino': { nome: 'Poder Divino', descricao: 'Você recebe bônus de ataque, +6 For e 1 PV/nível.' },
      'protecao_contra_morte': { nome: 'Proteção Contra a Morte', descricao: 'Fornece imunidade a magias e efeitos de morte.' },
      'repelir_insetos': { nome: 'Repelir Insetos', descricao: 'Insetos se mantêm a 3 m de distância.' },
      'restauracao': { nome: 'Restauração', descricao: 'Recupera níveis negativos e valores de habilidade.' },
      'transferencia_poder_divino': { nome: 'Transferência de Poder Divino', descricao: 'Transfere magias para alvo.' },
      'nuvem_profana': { nome: 'Nuvem Profana', descricao: 'Causa dano e adoece criaturas bondosas.', dominios: ['mal'] },  // unholy blight
    },
    5: {
      'arma_rompimento': { nome: 'Arma do Rompimento', descricao: 'Arma corpo a corpo que destroi mortos-vivos.' },  // desrupting weapon
      'cancelar_encantamento': { nome: 'Cancelar Encantamento', descricao: 'Liberta os alvos de encantamentos, alterações, maldições e petrificação.' },  // break enchantment
      'coluna_chamas': { nome: 'Coluna de Chamas', descricao: 'Destroi inimigos através de fogo divino (1d6/nível).' },  // flame strike
      'comando_maior': { nome: 'Comando Maior', descricao: 'Como comando, mas afeta 1 alvo/nível.' },  // command, greater
      'comunhao': { nome: 'Comunhão', descricao: 'Divindade responde uma pergunta/nível.' },  // commune
      'conspurcar': { nome: 'Conspurcar', descricao: 'Profana um local.' },  // unhallow
      'curar_ferimentos_leves_massa': { nome: 'Curar Ferimentos Leves em Massa', descricao: 'Cura 1d8+1 nível de diversas criaturas.' },  // cure light wounds, mass
      'dissipar_caos': { nome: 'Dissipar o Caos', descricao: '+4 CA contra ataques de criaturas caóticas, pode usar a energia para dissipar um encantamento ou enviar uma criatura de volta para seu plano.' },  // dispel chaos.
      'dissipar_ordem': { nome: 'Dissipar a Ordem', descricao: '+4 CA contra ataques de criaturas ordeiras, pode usar a energia para dissipar um encantamento ou enviar uma criatura de volta para seu plano.' },  // dispel law.
      'dissipar_bem': { nome: 'Dissipar o Bem', descricao: '+4 CA contra ataques de criaturas boas, pode usar a energia para dissipar um encantamento ou enviar uma criatura de volta para seu plano.' },  // dispel good.
      'dissipar_mal': { nome: 'Dissipar o Mal', descricao: '+4 CA contra ataques de criaturas más, pode usar a energia para dissipar um encantamento ou enviar uma criatura de volta para seu plano.' },  // dispel evil.
      'forca_justos': { nome: 'Força dos Justos', descricao: 'Aumenta tamanho (+4 força, +2 constituição) e dá bônus de combate (+2 melhoria CA, redução de dano 3/[bem,mal] ate 11 nível, 6 até 14, 9 acima disso).' },  // righteous might.
      'infligir_ferimentos_leves_massa': { nome: 'Infligir Ferimentos Leves em Massa', descricao: 'Causa 1d8+l/nível de dano contra diversas criaturas.' },  // inflict light wounds mass
      'invocar_crituras_v': { nome: 'Invocar Criaturas V', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },  // summon monster V
      'marca_justica': { nome: 'Marca da Justiça', descricao: 'Designa ação que causará uma maldição sobre o alvo.' },  // mark of justice
      'matar': { nome: 'Matar', descricao: 'Ataque de toque que mata um alvo.' },  // slay living
      'muralha_pedra': { nome: 'Muralha de Pedra', descricao: 'Cria uma barreira de pedra que pode ser moldada' },  // wall of stone
      'penitencia': { nome: 'Penitência', descricao: 'Remove a culpa dos pecados do alvo.' },  // atonement
      'praga_insetos': { nome: 'Praga de Insetos', descricao: 'Enxame de insetos ataca criaturas.' },  // insect plague
      'resistencia_magia': { nome: 'Resistência a Magia', descricao: 'O alvo recebe 12+l/nível de RM.' },  // spell resistance.
      'reviver_mortos': { nome: 'Reviver os mortos', descricao: 'Restaura a vida de um alvo que morreu a menos de 1 dia/nível.' },  // raise dead
      'santificar': { nome: 'Santificar', descricao: 'Santifica um local.' },  // hallow
      'simbolo_dor': { nome: 'Símbolo da Dor', descricao: 'Runa ativada causa dor às criaturas próximas.' },  // symbol of pain
      'simbolo_sono': { nome: 'Símbolo do Sono', descricao: 'Runa ativada coloca as criaturas próximas para dormir.' },  // symbol of sleep
      'viagem_planar': { nome: 'Viagem Planar', descricao: 'Até oito alvos viajam para outro plano.' },  // planar shift
      'videncia': { nome: 'Vidência', descricao: 'Espiona alguém à distância' },  // scrying
      'visao_verdade': { nome: 'Visão da Verdade', descricao: 'Mostra todas as coisas em sua forma verdadeira.' },  // true seeing
    },
    6: {
        'aliado_extra_planar': { nome: 'Aliado Extra-Planar', descricao: 'Como aliado extra-planar menor, mas até 12 DV.' },  // planar ally
        'anima_objetos': { nome: 'Animar Objetos', descricao: 'Objetos atacam seus inimigos.' },  // animate objects
        'banimento': { nome: 'Banimento', descricao: 'Expulsa 2 DV/nível de criaturas de extra-planares.' },  // banishment
        'banquente_herois': { nome: 'Banquete de Heróis', descricao: 'Produz comida para 1 criatura/nível e concede bônus de combate.' },  // heroes' feast
        'barreira_laminas': { nome: 'Barreira de Lâminas', descricao: 'Muralha de lâminas causa 1d6 de dano/nível.' },  // blade barrier
        'caminhar_no_vento': { nome: 'Caminhar no Vento', descricao: 'Você e seus aliados se transformam em vapores e viajam rápido.' },  // wind walk
        'criar_mortos_vivos': { nome: 'Criar Mortos-Vivos', descricao: 'Cria carniçais, lívidos, múmias ou mohrgs.' },  // create undead
        'cupula_protecao_contra_vida': { nome: 'Cúpula de Proteção Contra a Vida', descricao: 'Cúpula de 3 m isola criaturas vivas.' },  // antilife shell
        'cura_completa': { nome: 'Cura Completa', descricao: 'Cura 10 pontos de vida/nível, todas as doenças e problemas mentais.' },  // heal
        'curar_ferimentos_moderados_massa': { nome: 'Curar Ferimentos Moderados em Massa', descricao: 'Cura 2d8+l/nível PV de diversas criaturas.' },  // cure moderate wounds, mass
        'destruir_mortos_vivos': { nome: 'Destruir Mortos-Vivos', descricao: 'Destrói 1d4 DV/nível de mortos-vivos (max. 20d4).' },  // undeath to death
        'dissipar_magia_maior': { nome: 'Dissipar Magia Maior', descricao: 'Como dissipar magia, mas com +20 no teste.' },  // dispel magic, greater
        'doenca_plena': { nome: 'Doença Plena', descricao: 'Causa 10 pontos de dano/nível no alvo.' },  // harm
        'encontrar_caminho': { nome: 'Encontrar o Caminho', descricao: 'Mostra o caminho mais direto até um local. ' },  // find the path
        'esplendor_aguia_massa': { nome: 'Esplendor da Águia em Massa', descricao: 'Como esplendor da águia, mas afeta 1 alvo/nível.' },  // eagle's splendor, mass
        'forca_touro_massa': { nome: 'Força do Touro em Massa', descricao: 'Como força do touro, mas afeta 1 alvo/nível infligir.' },  // bull strength, mass
        'invocar_criaturas_vi': { nome: 'Invocar Criaturas VI', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador. ' },  // summon monster vi
        'palavra_recordacao': { nome: 'Palavra de Recordação', descricao: 'Teletransporta o conjurador de volta a um local determinado.' },  // word of recall
        'proibicao': { nome: 'Proibição', descricao: 'Bloqueia viagem planar, causa dano a criaturas de tendência diferente.' },  // forbiddance
        'sabedoria_coruja_massa': { nome: 'Sabedoria da Coruja em Massa', descricao: 'Como sabedoria da coruja, mas afeta 1 alvo/nível.' },  // owls wisdom, mass
        'simbolo_persuacao': { nome: 'Símbolo da Persuasão', descricao: 'Runa ativada enfeitiça as criaturas próximas.' },  // symbol of persuation
        'simbolo_protecao_maior': { nome: 'Símbolo de Proteção Maior', descricao: 'Como símbolo de proteção, mas até 10d8 de dano ou magia de 6º nível.' },  // glyph of warding, greater
        'simbolo_medo': { nome: 'Símbolo do Medo', descricao: 'Runa ativada causa medo as criaturas próximas.' },  // symbol of fear
        'tarefa_missao': { nome: 'Tarefa/Missão', descricao: 'Como missão menor, mas afeta qualquer criatura.' },  // geas/quest
        'vigor_urso_massa': { nome: 'Vigor do Urso em Massa', descricao: 'Como vigor do urso, mas afeta 1 alvo/nível.' },  // bear's endurance, mass
    },
    7: {
        'blasfemia': { nome: 'Blasfêmia', descricao: 'Mata, paralisa, enfraquece ou deixa pasmo alvos Bons ou Neutros.' },  // blasphemy
        'controlar_clima': { nome: 'Controlar o Clima', descricao: 'Muda o clima na área local.' },  // control weather
        'curar_ferimentos_graves_massa': { nome: 'Curar Ferimentos Graves em Massa', descricao: 'Cura 3d8+l/nível PV de diversas criaturas.' },  // cure serious wounds
        'destruicao': { nome: 'Destruição', descricao: 'Mata alvo e destrói os restos.' },  // destruction
        'ditado': { nome: 'Ditado', descricao: 'Mata, paralisa, deixa lento ou ensurdece alvos Neutros ou Caóticos.' },  // dictum
        'infligir_ferimentos_graves_massa': { nome: 'Infligir Ferimentos Graves em Massa', descricao: 'Causa 3d8+l/nível de dano contra diversas criaturas.' },  // inflict serious wounds, mass
        'invocar_criaturas_vii': { nome: 'Invocar Criaturas VII', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },  // summon monster vii
        'palavra_caos': { nome: 'Palavra do Caos', descricao: 'Mata, deixa confuso, atordoa ou ensurdece alvos neutros ou Leais.' },  // word of chaos
        'palavra_sagrada': { nome: 'Palavra Sagrada', descricao: 'Mata, paralisa, cega ou ensurdece alvos Neutros ou Maus.' },  // holy word
        'passeio_etereo': { nome: 'Passeio Etéreo', descricao: 'Você fica etéreo durante 1 rodada/nível.' },  // ethereal jaunt
        'refugio': { nome: 'Refugio', descricao: 'Altera um item para que transporte seu usuário até você.' },  // refuge
        'regeneracao': { nome: 'Regeneração', descricao: 'Membros decepados do alvo crescem novamente, cura 4d8 de dano +l/nível (max. +35).' },  // regenerate
        'repulsao': { nome: 'Repulsão', descricao: 'Criaturas não podem se aproximar do conjurador.' },  // repulsion
        'ressureicao': { nome: 'Ressurreição', descricao: 'Restaura completamente um alvo morto.' },  // resurection
        'restauracao_maior': { nome: 'Restauração Maior', descricao: 'Como restauração, mas restaura todos os níveis a valores de habilidades.' },  // restoration, greater
        'simbolo_fraqueza': { nome: 'Símbolo da Fraqueza', descricao: 'Runa ativada enfraquece as criaturas próximas.' },  // symbol of weakness
        'simbolo_atordoamento': { nome: 'Símbolo do Atordoamento', descricao: 'Runa ativada atordoa as criaturas próximas.' },  // symbol of stunning
        'videncia_maior': { nome: 'Vidência Maior', descricao: 'Como vidência, só que mais rápido e com duração maior.' },  // scrying, greater
    },
    8: {
        'aliado_extra_planar_maior': { nome: 'Aliado Extra-Planar Maior', descricao: 'Como aliado extra-planar menor, mas até 18 DV.' },  // planar ally, greater
        'aura_profana': { nome: 'Aura Profana', descricao: '+4 na CA, +4 resistência e RM 25 contra magias bondosas.' },  // unholy aura
        'aura_sagrada': { nome: 'Aura Sagrada', descricao: '+4 na CA, +4 resistência e RM 25 contra magias malignas.' },  // holy aura
        'campo_antimagia': { nome: 'Campo Antimagia', descricao: 'Anula magia em uma área de 3 m.' },  // antimagic field
        'criar_mortos_vivos_maior': { nome: 'Criar Mortos-Vivos Maior', descricao: 'Cria sombras, aparações, espectros ou devoradores.' },  // create greater undead
        'curar_ferimentos_criticos_massa': { nome: 'Curar Ferimentos Críticos em Massa', descricao: 'Cura 4d8+l/nível PV de diversas criaturas.' },  // cure critical wounds, mass
        'discernir_localizacao': { nome: 'Discernir Localização', descricao: 'Descobre o local exato de criatura ou objeto.' },  // discern location
        'escudo_ordem': { nome: 'Escudo da Ordem', descricao: '+4 na CA, +4 resistência e RM 25 contra magias caóticas.' },  // shield of law
        'imunidade-magia_maior': { nome: 'Imunidade à Magia Maior', descricao: 'Como imunidade à magia, mas afeta magias de até 8° nível.' },  // spell immunity, greater
        'infligir_ferimentos_criticos_massa': { nome: 'Infligir Ferimentos Críticos em Massa', descricao: 'Causa 4d8+l/nível de dano contra diversas criaturas.' },  // inflict critical wounds, mass
        'invocar_criaturas_viii': { nome: 'Invocar Criaturas VIII', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },  // summon monster viii
        'manto_caos': { nome: 'Manto do Caos', descricao: '+4 na CA, +4 resistência e RM 25 contra magias Leais.' },  // cloak of chaos
        'simbolo_insanidade': { nome: 'Símbolo da Insanidade', descricao: 'Runa ativada enlouquece as criaturas próximas.' },  // symbol of insanity
        'simbolo_morte': { nome: 'Símbolo da Morte', descricao: 'Runa ativada mata as criaturas próximas.' },  // symbol of death
        'tempestade_fogo': { nome: 'Tempestade de Fogo', descricao: 'Causa 1d6 de dano de fogo/nível.' },  // fire storm
        'terremoto': { nome: 'Terremoto', descricao: 'Tremor intenso em 1,5 m/nível de raio.' },  // earthquake
        'tranca_dimensional': { nome: 'Tranca Dimensional', descricao: 'Bloqueia teletransporte e viagem planar durante 1 dia/nível.' },  // dimensional lock
    },
    9: {
        'cura_completa_massa': { nome: 'Cura Completa em Massa', descricao: 'Como cura completa, mas para vários alvas.' },  // heal, mass
        'drenar_energia': { nome: 'Drenar Energia', descricao: 'O alvo sofre 2d4 níveis negativos.' },  // energy drain
        'forma_eterea': { nome: 'Forma Etérea', descricao: 'Viaje para o Plano Etéreo com companheiros.' },  // etherealness
        'implosao': { nome: 'Implosão', descricao: 'Mata 1 criatura/rodada.' },  // implosion
        'invocar_criaturas_ix': { nome: 'Invocar Criaturas IX', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },  // summon monster ix
        'milagre': { nome: 'Milagre', descricao: 'Pede a intervenção de uma divindade.' },  // miracle
        'portal': { nome: 'Portal', descricao: 'Conecta dois planos para viagens ou invocações.' },  // gate
        'prender_alma': { nome: 'Prender a Alma', descricao: 'Prende uma alma recentemente falecida para impedir a ressurreição.' },  // soul bind
        'projecao_astral': { nome: 'Projeção Astral', descricao: 'Projeta você e seus companheiros para o Plano Astral.' },  // astral projection
        'ressureicao_verdadeira': { nome: 'Ressurreição Verdadeira', descricao: 'Como ressurreição, mas não é necessário o corpo.' },  // true resurection
        'tempestade_vinganca': { nome: 'Tempestade da Vingança', descricao: 'Tempestade de ácido, granizo e pedras.' },  // storm of vengeance
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
      'drenar_temporario': {
        nome: 'Drenar Temporário', descricao: 'Alvo perde 1d4 níveis.', escola: 'necromancia'
      },
      'grito': {
        nome: 'Grito', descricao: 'Causa surdez e 5d6 de dano sônico.', escola: 'evocacao'
      },
      'pele_rochosa': {
        nome: 'Pele Rochosa', descricao: 'Resistência de 10 dano/adamante até 10/nível, max 150.', escola: 'abjuracao',
      },
      'tempestade_glacial': {
        nome: 'Tempestade Glacial', descricao: 'Granizo causa 5d6 de dano em um cilindro de 12 m.', escola: 'evocacao'
      },
    },
    5: {
      'enfraquecer_intelecto': {
        nome: 'Enfraquecer o Intelecto', descricao: 'Inteligência e Carisma do alvo caem para 1.', escola: 'encantamento'
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
