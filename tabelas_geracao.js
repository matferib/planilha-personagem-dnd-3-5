// Todas as tabelas que forem referentes a geracao automatica de personagem.

// Tabelas de geracao de atributos.
var tabelas_geracao = {
  // Peguei do livro do mestre.
  barbaro: { 
		atributos: ['forca', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
	},
  bardo: { 
		atributos: [ 'carisma', 'inteligencia', 'destreza', 'constituicao', 'forca', 'sabedoria' ],
	},
  clerigo: { 
		atributos: [ 'sabedoria', 'constituicao', 'forca', 'carisma', 'inteligencia',  'destreza' ],
	},
  druida: { 
		atributos: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
	},
  guerreiro: { 
		atributos: [ 'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
	},
  feiticeiro: { 
		atributos: [ 'carisma', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'forca' ],
	},
  ladino: { 
		atributos: [ 'destreza', 'inteligencia', 'constituicao', 'forca', 'sabedoria', 'carisma' ],
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
  // Esse ta muito ruim...
  aristocrata: { 
		atributos: [ 'destreza', 'inteligencia', 'forca', 'carisma', 'constituicao', 'sabedoria' ],
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
	},
};
