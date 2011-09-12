// Modificadores de habilidades por raca.
var tabelas_raca = {
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

// Tabelas de dados de vida.
var tabelas_dados_vida = {
	barbaro: 12, 
	bardo: 6,
	clerigo: 8,
	druida: 8,
	guerreiro: 10,
	feiticeiro: 4,
	ladino: 6,
	mago: 4,
	monge: 8,
	paladino: 10,
	ranger: 8,
	// classes NPC
	adepto: 6,
	aristocrata: 8,
	plebeu: 4,
	expert: 6,
	combatente: 8,
};

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
	// classes NPC
	adepto: bba_fraco,
	aristocrata: bba_medio,
	plebeu: bba_fraco,
	expert: bba_medio,
	combatente: bba_forte,
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

// Tabelas de escudos (TODO terminar).
var tabelas_escudos = {
	nenhum: { nome: "Nenhum", bonus: 0 },
	broquel: { nome: "Broquel", bonus: 1 },
	escudo_leve_de_madeira: { nome: "Escudo Leve de Madeira", bonus: 1 },
	escudo_leve_de_aco: { nome: "Escudo Leve de Aço", bonus: 1 },
	escudo_pesado_de_aco: { nome: "Escudo Pesado de Madeira", bonus: 2 },
	escudo_pesado_de_aco: { nome: "Escudo Pesado de Aço", bonus: 2 },
	escudo_de_corpo: { nome: "Escudo de Corpo", bonus: 4, maximo_bonus_destreza: 2 },
};

