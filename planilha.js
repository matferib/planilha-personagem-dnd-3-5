goog.require('goog.dom');

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha.
function AtualizaGeral() {
	AtualizaModificadores();
	AtualizaSalvacoes();
}

// Atualiza todos os modificadores dos atributos bases.
function AtualizaModificadores() {
	// Busca cada elemento das estatisticas e atualiza modificadores.
	var id_atributos = ['for', 'des', 'con', 'int', 'sab', 'car'];
	for (var i = 0; i < id_atributos.length; ++i) {
		var input_atributo = goog.dom.getElement(id_atributos[i]);
		var span_modificador = goog.dom.getElement(id_atributos[i] + '-mod');
		span_modificador.innerText = Math.floor((input_atributo.value - 10) / 2);
	}
}

// 
function AtualizaSalvacoes() {
}
