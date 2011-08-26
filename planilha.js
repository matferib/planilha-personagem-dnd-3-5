goog.require('goog.dom');

// OBS: deve-se carregar util e tabelas.js primeiro.

var VALOR_BASE = "-valor-base";
var VALOR_TOTAL = "-valor-total";
var MOD = '-mod-';
var MOD_TOTAL = "-mod-total";
var MOD_RACIAL = "-mod-racial";

// Valores do personagem.
var personagem = {
	raca: "humano",
	classes: ["guerreiro"],
	alinhamento: "LB",
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
	salvacoes : {
		fortitude: 0,
		reflexo: 0,
		vontade: 0
	}
};

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha.
function AtualizaGeral() {
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
		personagem.atributos[habilidade].valor.racial = 
			modificadores_raca[habilidade];
	}
	// Escreve todos os modificadores raciais.
	for (var habilidade in personagem.atributos) {
		ImprimeSinalizado(
				personagem.atributos[habilidade].valor.racial,  
				goog.dom.getElement(habilidade + MOD_RACIAL));
	}
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car).
function AtualizaModificadoresAtributos() {
	// busca a raca e seus modificadores.
	var opcoes_raca = goog.dom.getElement("raca").options;
	var modificadores_raca =
		modificadores_raciais[opcoes_raca[opcoes_raca.selectedIndex].value];

	// Busca cada elemento das estatisticas e atualiza modificadores.
	for (var habilidade in personagem.atributos) {
		// valor total do atributo na planilha.
		var input_atributo = goog.dom.getElement(habilidade + VALOR_BASE);
		personagem.atributos[habilidade].valor = parseInt(input_atributo.value);

		// modificador racial.
		if (modificadores_raca[habilidade]) {
			var modificador_racial = modificadores_raca[habilidade];
			personagem.atributos[habilidade].valor += modificador_racial;
			// Escreve o modificador racial.
			ImprimeSinalizado(
					modificador_racial,
					goog.dom.getElement(habilidade + MOD_RACIAL));
		} else {
			ImprimeNaoSinalizado('', goog.dom.getElement(habilidade + MOD_RACIAL));
		}

		// Escreve o valor total.
		ImprimeNaoSinalizado(
				personagem.atributos[habilidade].valor, 
				goog.dom.getElement(habilidade + VALOR_TOTAL));

		// modificador da habilidade.
		personagem.atributos[habilidade].modificador = 
			Math.floor((personagem.atributos[habilidade].valor - 10) / 2);
		// Escreve o modificador.
		ImprimeSinalizado(
				personagem.atributos[habilidade].modificador,
				goog.dom.getElement(habilidade + MOD_TOTAL));
	}
}


// 
function AtualizaSalvacoes() {
	var habilidades_salvacoes = {
		fortitude: 'constituicao',
		reflexo: 'destreza',
		vontade: 'sabedoria'
	};
	for (var tipo_salvacao in habilidades_salvacoes) {
		var classe = goog.dom.getElement('classe').value;
		var nivel = parseInt(goog.dom.getElement('nivel').value);
		var valor_base =
			tabelas_salvacao[classe][tipo_salvacao](nivel);
		var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
		var modificador_atributo = 
			personagem.atributos[habilidade_modificadora].modificador;
		personagem.salvacoes[tipo_salvacao] = valor_base + modificador_atributo;
		ImprimeNaoSinalizado(
				valor_base,
				goog.dom.getElement(tipo_salvacao + VALOR_BASE));
		ImprimeSinalizado(
				modificador_atributo,
				goog.dom.getElement(tipo_salvacao + MOD + habilidade_modificadora));
		ImprimeSinalizado(
				personagem.salvacoes[tipo_salvacao],
				goog.dom.getElement(tipo_salvacao + MOD_TOTAL));
	}


}


