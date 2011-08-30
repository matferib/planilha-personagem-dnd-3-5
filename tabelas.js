// Modificadores de habilidades por raca.
var modificadores_raciais = {
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
					 // TODO terminar outras classes
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
	barbaro: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
	bardo: { fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_forte },
	clerigo: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
	druida: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
	feiticeiro: { fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
	guerreiro: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
	ladino: { fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_fraca },
	mago: { fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
	monge: { fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_forte },
	paladino: { fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
	ranger: { fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_fraca },
					 // TODO terminar outras classes
};
