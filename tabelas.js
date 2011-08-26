// Modificadores de habilidades por raca.
var modificadores_raciais = {
	anao: { constituicao: +2, carisma: -2 },
	halfling: { forca: -2, destreza: +2 },
	humano: {},
	elfo: { destreza: +2, constituicao: -2 },
	gnomo: { forca: -2, constituicao: +2 },
	meioelfo: {},
	meioorc: { forca: +2, inteligencia: -2, carisma: -2 }
};

// Tabelas de bonus base de ataque.
var tabelas_bonus_base_ataque = {
	forte: function(nivel) {
		return nivel;
  },
	medio: function(nivel) {
		var ret = (nivel - 1);
		var mod = Math.floor(nivel / 4);
		if (nivel % 4 == 0) { --mod; }
		return ret - mod;
  },
	fraco: function(nivel) {
		return Math.floor(nivel / 2);
  },
	nulo: function() {
		return 0;
	}
};


// Salvacoes
function salvacao_forte(nivel) {
  return Math.floor(nivel / 2) + 2;
}
function salvacao_fraca(nivel) {
	return Math.floor(nivel / 3);
}
// Tabelas de salvacao.
var tabelas_salvacao = {
	barbaro: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
	guerreiro: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
	paladino: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
	ladino: { fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_fraca }
					 // TODO terminar outras classes
};
