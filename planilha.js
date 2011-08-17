goog.require('goog.dom');

var id_atributos = ['for', 'des', 'con', 'int', 'sab', 'car'];
var mod_base = "-mod-base";
var mod_racial = "-mod-racial";

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha.
function AtualizaGeral() {
	AtualizaRaca();
	AtualizaModificadoresAtributos();
	AtualizaSalvacoes();
}

// Atualiza os modificadores raciais.
function AtualizaRaca() {
	var modificadores_raciais = {
		anao: { "con": "+2", "car": "-2" },
		halfling: { "for": "-2", "des": "+2" },
		humano: {},
		elfo: { "des": "+2", "con": "-2" },
		gnomo: { "for": "-2", "con": "+2" },
		meioelfo: {},
		meioorc: { "for": "+2", "int": "-2", "car": "-2" }
	};
	// limpa todos os modificadores raciais
	for (var i = 0; i < id_atributos.length; ++i) {
		var span_mod_racial = goog.dom.getElement(id_atributos[i] + mod_racial);
		span_mod_racial.innerText = '';
	}
	// Aplica os modificadores raciais.
	var opcoes_raca = goog.dom.getElement("raca").options;
	var modificadores_raca =
			modificadores_raciais[opcoes_raca[opcoes_raca.selectedIndex].value];
	for (var habilidade_modificada in modificadores_raca) {
		var span_mod_racial = goog.dom.getElement(habilidade_modificada + mod_racial);
		span_mod_racial.innerText = modificadores_raca[habilidade_modificada];
	}
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car).
function AtualizaModificadoresAtributos() {
	// Busca cada elemento das estatisticas e atualiza modificadores.
	for (var i = 0; i < id_atributos.length; ++i) {
		// base.
		var input_atributo = goog.dom.getElement(id_atributos[i]);
		var valor_modificador_base = Math.floor((input_atributo.value - 10) / 2);
		goog.dom.getElement(id_atributos[i] + mod_base).innerText =  valor_modificador_base;
		// raca.
		var span_modificador_racial = goog.dom.getElement(id_atributos[i] + mod_racial);
		var valor_modificador_racial = parseInt(span_modificador_racial.innerText) || 0;
		// Atualiza o modificador.
		goog.dom.getElement(id_atributos[i] + '-mod').innerText =
			valor_modificador_base + valor_modificador_racial;
	}
}


// 
function AtualizaSalvacoes() {
}
