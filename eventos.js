// Apenas tratamento de eventos.
goog.require('goog.json');

// Chamado pelo carregamento inicial da pagina.
function CarregamentoInicial() {
	var indice_igual = document.URL.indexOf('=');
	if (indice_igual == -1) {
		// Comeca do zero.
		AdicionaClasse();
	}
	else {
		// carrega pelos parametros.
		var json_personagem = decodeURIComponent(document.URL.slice(indice_igual + 1));
		entradas = goog.json.parse(json_personagem);
		EscreveEntradas();
	}
	AtualizaGeral();
}

// Botao de adicionar classe apertado.
function ClickAdicionaClasse() {
	var classes_desabilitadas = [];
	//for (var i = 0; i < personagem.classes.length; ++i) {
	//	classes_desabilitadas.push(personagem.classes[i].classe);
	//}
	AdicionaClasse(classes_desabilitadas);
	AtualizaGeral();
}

// Botao de remover classe apertado.
function ClickRemoveClasse() {
	RemoveClasse();
	AtualizaGeral();
}

// Codifica o objeto personagem como JSON.
function ClickSalvar() {
	AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
	var indice_interrogacao = document.URL.indexOf('?');
	var url = 
		(indice_interrogacao != -1 ?  document.URL.slice(0, indice_interrogacao) : document.URL) + 
		'?pc=' + encodeURIComponent(goog.json.serialize(entradas));
	goog.dom.getElement("link-personagem").innerHTML = 
		'<a href="' + url + '">Link</a>';
}
