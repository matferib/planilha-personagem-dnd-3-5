// Apenas os dados do personagem.
var personagem = {
	nome: '',
	raca: 'humano',
	tamanho: { categoria: 'medio', modificador_ataque_defesa: 0 }, 
	alinhamento: "",
/*	classes: {
		barbaro: 0, 
		bardo: 0,
		clerigo: 0,
		druida: 0,
		feiticeiro: 0,
		guerreiro: 0,
		ladino: 0,
		mago: 0,
		monge: 0,
		paladino: 0,
		ranger: 0,
		//NPC
		adepto: 0,
		aristocrata: 0,
		plebeu: 0,
		expert: 0,
		combatente: 0,
	},*/
	classes: [],
	pontos_vida: {
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
  ca: { normal: 10, surpreso: 10, toque: 10 },
	salvacoes : {
		fortitude: 0,
		reflexo: 0,
		vontade: 0
	},
	armadura: '',
};


