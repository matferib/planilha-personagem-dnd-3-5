goog.require('goog.dom');

var valor_base = "-valor-base";
var valor_total = "-valor-total";
var mod_total = "-mod-total";
var mod_base = "-mod-base";
var mod_racial = "-mod-racial";

var modificadores_raciais = {
	anao: { constituicao: +2, carisma: -2 },
	halfling: { forca: -2, destreza: +2 },
	humano: {},
	elfo: { destreza: +2, constituicao: -2 },
	gnomo: { forca: -2, constituicao: +2 },
	meioelfo: {},
	meioorc: { forca: +2, inteligencia: -2, carisma: -2 }
};

// Valores do personagem.
var personagem = {
	raca: "humano",
	classes: ["guerreiro"],
	alinhamento: "LB",
	atributos: {
		forca: { 
			valor: { base: 10, racial: 0, total: 10 },
			modificador: 0
		},	
		destreza: { 
			valor: { base: 10, racial: 0, total: 10 },
			modificador: 0
		},	
		constituicao: { 
			valor: { base: 10, racial: 0, total: 10 },
			modificador: 0
		},	
		inteligencia: { 
			valor: { base: 10, racial: 0, total: 10 },
			modificador: 0
		},	
		sabedoria: { 
			valor: { base: 10, racial: 0, total: 10 },
			modificador: 0
		},	
		carisma: { 
			valor: { base: 10, racial: 0, total: 10 },
			modificador: 0
		}	
	}
};

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha.
function AtualizaGeral() {
	AtualizaRaca();
	AtualizaModificadoresAtributos();
	AtualizaSalvacoes();
}

// Atualiza os modificadores raciais.
function AtualizaRaca() {
	// Zera todos os modificadores raciais.
	for (var habilidade in personagem.atributos) {
		personagem.atributos[habilidade].valor.racial = 0;
	}
	// Aplica os modificadores raciais.
	var opcoes_raca = goog.dom.getElement("raca").options;
	var modificadores_raca =
		modificadores_raciais[opcoes_raca[opcoes_raca.selectedIndex].value];
	for (var habilidade in modificadores_raca) {
		if (habilidade != 'forca') continue;
		personagem.atributos[habilidade].valor.racial = 
			modificadores_raca[habilidade];
	}
	// Escreve todos os modificadores raciais.
	for (var habilidade in personagem.atributos) {
		if (habilidade != 'forca') continue;
		goog.dom.getElement(habilidade + mod_racial).innerText = 
			personagem.atributos[habilidade].valor.racial;
	}
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car).
function AtualizaModificadoresAtributos() {
	// Busca cada elemento das estatisticas e atualiza modificadores.
	for (var habilidade in personagem.atributos) {
		if (habilidade != 'forca') continue;
		// valor total do atributo.
		var input_atributo = goog.dom.getElement(habilidade + valor_base);
		personagem.atributos[habilidade].valor.base = 
			parseInt(input_atributo.value);
		personagem.atributos[habilidade].valor.total = 0;
		for (var modificador_valor in personagem.atributos[habilidade].valor) {
			if (modificador_valor != 'total') {
				personagem.atributos[habilidade].valor.total += 
					personagem.atributos[habilidade].valor[modificador_valor];
			}
		}
		// Escreve o valor total:
		goog.dom.getElement(habilidade + valor_total).innerText =
			personagem.atributos[habilidade].valor.total;

		// modificador.
		personagem.atributos[habilidade].modificador = 
			Math.floor((personagem.atributos[habilidade].valor.total - 10) / 2);
		// Escreve o modificador.
		goog.dom.getElement(habilidade + mod_total).innerText =  
			personagem.atributos[habilidade].modificador;
	}
}


// 
function AtualizaSalvacoes() {
}
