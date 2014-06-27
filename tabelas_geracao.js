// Todas as tabelas que forem referentes a geracao automatica de personagem.

// Tabelas de geracao de atributos.
var tabelas_geracao = {
  // Peguei do livro do mestre.
  barbaro: {
		atributos: ['forca', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
    pericias: [],
    por_nivel: {
      1: { moedas: { ouro: 200 },
           armadura: { nome: 'brunea', obra_prima: true },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      2: { moedas: { ouro: 1200 },
           armadura: { nome: 'peitoral_de_aco', obra_prima: true, },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      3: { moedas: { ouro: 1700 },
           armadura: { nome: 'peitoral_de_aco', obra_prima: true, },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      4: { moedas: { ouro: 2500 },
           armadura: { nome: 'peitoral_de_aco', obra_prima: true, },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      5: { moedas: { ouro: 2500 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      6: { moedas: { ouro: 3800 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      7: { moedas: { ouro: 3500 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      8: { moedas: { ouro: 3500 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      9: { moedas: { ouro: 6000 },
           armadura: { nome: 'peitoral_de_aco', bonus: 2 },
           armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      10: { moedas: { ouro: 1000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 2 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      11: { moedas: { ouro: 1000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      12: { moedas: { ouro: 1000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      13: { moedas: { ouro: 9000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      14: { moedas: { ouro: 11000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      15: { moedas: { ouro: 14000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      16: { moedas: { ouro: 25000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      17: { moedas: { ouro: 3000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 4 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
      18: { moedas: { ouro: 17000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 5 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 3, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_3', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
      19: { moedas: { ouro: 16000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 5 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 3, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_3', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
      20: { moedas: { ouro: 66000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 5 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 3, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_3', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
    },
	},
  bardo: {
		atributos: [ 'carisma', 'inteligencia', 'destreza', 'constituicao', 'forca', 'sabedoria' ],
	},
  clerigo: {
		atributos: [ 'sabedoria', 'constituicao', 'forca', 'carisma', 'inteligencia',  'destreza' ],
    ordem_pericias: [
      'concentracao', 'cura', 'diplomacia', 'conhecimento_religiao', 'conhecimento_historia',
      'conhecimento_arcano', 'conhecimento_planos', 'profissao', 'identificar_magia', 'oficios' ],
    ordem_magias: {
      0: [ 'luz', 'resistencia', 'orientacao', 'ler_magias', 'consertar', ],
    },
    por_nivel: {
      6: { moedas: {  ouro: 3600 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', obra_prima: false },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      7: { moedas: {  ouro: 4200 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', obra_prima: false },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      8: { moedas: {  ouro: 6200 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', bonus: 1 },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      9: { moedas: {  ouro: 7000 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', bonus: 1 },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
    },
	},
  druida: {
		atributos: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
    por_nivel: {
      1: { moedas: { ouro: 250 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      2: { moedas: { ouro: 1350 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      3: { moedas: { ouro: 1800 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      4: { moedas: { ouro: 2600 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      5: { moedas: { ouro: 3000 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
    },
	},
  guerreiro: {
		atributos: [ 'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
    por_nivel: {
      1: { moedas: { ouro: 350 },
           armadura: { nome: 'cota_de_talas', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      2: { moedas: { ouro: 750 },
           armadura: { nome: 'meia_armadura', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      3: { moedas: { ouro: 350 },
           armadura: { nome: 'armadura_de_batalha', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: { ouro: 1150 },
           armadura: { nome: 'armadura_de_batalha', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: { ouro: 2150 },
           armadura: { nome: 'armadura_de_batalha', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: { ouro: 2300 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      7: { moedas: { ouro: 2900 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      8: { moedas: { ouro: 4900 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      9: { moedas: { ouro: 4500 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
           aneis: [],
      },
      10: { moedas: { ouro: 5500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
      },
      11: { moedas: { ouro: 8500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
      12: { moedas: { ouro: 9500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
      13: { moedas: { ouro: 18500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
      14: { moedas: { ouro: 20500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      15: { moedas: { ouro: 21500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      16: { moedas: { ouro: 27500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      17: { moedas: { ouro: 41500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 3 },
            armas: [ { chave: 'espada_bastarda', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      18: { moedas: { ouro: 56500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 4 },
            armas: [ { chave: 'espada_bastarda', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      19: { moedas: { ouro: 52500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 4 },
            armas: [ { chave: 'espada_bastarda', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      20: { moedas: { ouro: 78500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 4 },
            armas: [ { chave: 'espada_bastarda', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_4', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
    },

	},
  feiticeiro: {
		atributos: [ 'carisma', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'forca' ],
	},
  ladino: {
		atributos: [ 'destreza', 'inteligencia', 'constituicao', 'forca', 'sabedoria', 'carisma' ],
    por_nivel: {
      3: { moedas: {  ouro: 1500 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: {  ouro: 2300 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: {  ouro: 3000 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: {  ouro: 4600 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
    },
	},
  mago: {
		atributos: [ 'inteligencia', 'destreza', 'constituicao', 'sabedoria', 'forca', 'carisma' ],
	},
  monge: {
		atributos: [ 'sabedoria', 'forca', 'destreza', 'constituicao', 'inteligencia', 'carisma' ],
	},
  paladino: {
		atributos: [ 'carisma', 'forca', 'sabedoria', 'constituicao', 'inteligencia', 'destreza' ],
	},
  ranger: {
		atributos: [ 'destreza', 'forca', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
	},
  // classes NPC: nao existe uma tabela para esses, coloquei o que achei mais adequado.
  adepto: {
		atributos: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
	},
  aristocrata: {
		atributos: [ 'inteligencia', 'destreza', 'constituicao', 'forca', 'carisma', 'sabedoria' ],
    por_nivel: {
      1: { moedas: {  ouro: 50 },
           armadura: { nome: 'brunea', obra_prima: true },
           escudo: { nome: 'broquel' },
           armas: [ { chave: 'sabre', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      2: { moedas: {  ouro: 2000 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      3: { moedas: {  ouro: 2500 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: {  ouro: 3300 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: {  ouro: 4300 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: {  ouro: 5600 },
           armadura: { nome: '', bonus: 0 },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
    },
	},
  plebeu: {
		atributos: [ 'forca', 'constituicao', 'sabedoria', 'destreza', 'inteligencia', 'carisma' ],
	},
  // esse aqui varia de acordo com as escolhas da area de expertise.
  expert: {
		atributos: [ 'inteligencia', 'forca', 'destreza', 'constituicao', 'sabedoria', 'carisma' ],
	},
  combatente: {
		atributos: [  'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
    // TODO fazer esse, ta igual guerreiro.
    por_nivel: {
      1: { moedas: {  ouro: 0 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      2: { moedas: {  ouro: 0 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      3: { moedas: {  ouro: 0 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: {  ouro: 0 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: {  ouro: 0 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: {  ouro: 0 },
           armadura: { nome: '', bonus: 1 },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      7: { moedas: {  ouro: 0 },
           armadura: { nome: '', bonus: 1 },
           armas: [ { chave: '', bonus: 1, obra_prima: false },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      8: { moedas: {  ouro: 0 },
           armadura: { nome: '', bonus: 1 },
           armas: [ { chave: '', bonus: 1, obra_prima: false },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      9: { moedas: {  ouro: 0 },
           armadura: { nome: '', bonus: 1 },
           armas: [ { chave: '', bonus: 1, obra_prima: false },
                    { chave: '', bonus: 1, obra_prima: false }, ],
           aneis: [],
      },
      10: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 1, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [],
      },
      11: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 1, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      12: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 2, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      13: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 2, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      14: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 2, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      15: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 3, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      16: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 3, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      17: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 3 },
            armas: [ { chave: '', bonus: 3, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      18: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 4 },
            armas: [ { chave: '', bonus: 4, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      19: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 4 },
            armas: [ { chave: '', bonus: 4, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      20: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 4 },
            armas: [ { chave: '', bonus: 4, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
    },
  },
};
