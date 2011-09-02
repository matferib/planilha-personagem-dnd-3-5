// Tudo relacionado a entradas. Isso eh o que devera ser
// serializado e deserializado.

// Variavel contendo os valores das entradas.
var entradas = {
	// geral
	nome: "",
	raca: "",
	alinhamento: "",
	// Cada entrada possui classe e nivel.
	classes: [],
	// atributos.
	forca: 10,
	destreza: 10,
	constituicao: 10,
	inteligencia: 10,
	sabedoria: 10,
	carisma: 10,
	// equipamentos.
	armadura: { nome: '', obra_prima: false, bonus: 0 },
	escudo: { nome: '', },
};

// Le todos os inputs da planilha e armazena em 'entradas'. 
function LeEntradas() {
	// nome
	entradas.nome = goog.dom.getElement(NOME).value;
	// raca
	entradas.raca = ValorSelecionado(goog.dom.getElement(RACA));
	// alinhamento
	entradas.alinhamento = ValorSelecionado(goog.dom.getElement(ALINHAMENTO));
	// classes.
	entradas.classes.length = 0;
	var div_classes = goog.dom.getElement(DIV_CLASSES);
	for (var i = 0; i < div_classes.childNodes.length; ++i) {
		var elemento = div_classes.childNodes[i];
		if (elemento.tagName == "DIV") {
			var select = elemento.getElementsByTagName("SELECT")[0];
			var input = elemento.getElementsByTagName("INPUT")[0];
			entradas.classes.push({ 
				classe: ValorSelecionado(select),
				nivel: parseInt(input.value)});
		}
	}
	// atributos
	var div_atributos = goog.dom.getElement(DIV_STATS);
	for (var i = 0; i < div_atributos.childNodes.length; ++i) {
		var elemento = div_atributos.childNodes[i];
		if (elemento.tagName == "INPUT") {
			entradas[elemento.name] = parseInt(elemento.value);
		}
	}
	// Armaduras.
	entradas.armadura = ValorSelecionado(goog.dom.getElement(ARMADURA)); 
}

// Escreve todos os inputs com os valores de 'entradas'.
function EscreveEntradas() {
	// nome
	goog.dom.getElement(NOME).value = entradas.nome;
	// raca
	SelecionaValor(entradas.raca, goog.dom.getElement(RACA));
	// alinhamento
	SelecionaValor(entradas.alinhamento, goog.dom.getElement(ALINHAMENTO));
	// classes.
	for (var i = 0; i < entradas.classes.length; ++i) {
		AdicionaClasse(entradas.classes[i].classe, entradas.classes[i].nivel);
	}
	// atributos.
	var div_atributos = goog.dom.getElement(DIV_STATS);
	for (var i = 0; i < div_atributos.childNodes.length; ++i) {
		var elemento = div_atributos.childNodes[i];
		if (elemento.tagName == "INPUT") {
			elemento.value = entradas[elemento.name];
		}
	}
	// Armaduras.
	SelecionaValor(entradas.armadura, goog.dom.getElement(ARMADURA)); 

}

