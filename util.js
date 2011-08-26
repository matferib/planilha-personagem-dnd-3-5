// Imprime um valor de forma sinalizada ou seja, com +/- na frente).
// @param dom pode ser um span ou div, ou qualquer elemento que possua innerText.
function ImprimeSinalizado(valor, dom) {
	if (valor >= 0) {
		dom.innerText = '+' + valor;
	} else {
		dom.innerText = valor;
	}
}

// Imprime um valor de forma nao sinalizada no caso positivo.
// @param dom pode ser um span ou div, ou qualquer elemento que possua innerText.
function ImprimeNaoSinalizado(valor, dom) {
	dom.innerText = valor;
}
