// Imprime um valor de forma sinalizada ou seja, com +/- na frente).
// @param dom pode ser um span ou div, ou qualquer elemento que possua innerText.
// Tambem pode ser um array de dom.
function ImprimeSinalizado(valor, dom) {
	if (dom.length == null) {
		if (valor >= 0) {
			dom.innerText = '+' + valor;
		} else {
			dom.innerText = valor;
		}
	}
	else {
		for (var i = 0; i < dom.length; ++i) {
			ImprimeSinalizado(valor, dom[i]);
		}
	}
}

// Imprime um valor de forma nao sinalizada no caso positivo.
// @param dom pode ser um span ou div, ou qualquer elemento que possua innerText.
function ImprimeNaoSinalizado(valor, dom) {
	if (dom.length == null) {
		dom.innerText = valor;
	}
	else {
		for (var i = 0; i < dom.length; ++i) {
			ImprimeNaoSinalizado(valor, dom[i]);
		}
	}
}
