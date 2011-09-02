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

// Adiciona uma nova classe na planilha. 
// Classe e nivel sao opcionais.
// Classe padrao: guerreiro.
// Nivel padrao: 1.
function AdicionaClasse(classe, nivel) {
	if (!nivel) {
		nivel = 1;
	}
	if (!classe) {
		classe = "guerreiro";
	}
	var select_classe = document.createElement('select');
	select_classe.setAttribute('name', 'classe');
	select_classe.setAttribute('onchange', 'AtualizaGeral()');
	var classes = [
		{nome: "barbaro", texto: "Bárbaro"},
		{nome: "bardo", texto: "Bardo"},
	  {nome: "clerigo", texto: "Clérigo"},
		{nome: "guerreiro", texto: "Guerreiro"},
		{nome: "feiticeiro", texto: "Feiticeiro"},
		{nome: "ladino", texto: "Ladino"},
		{nome: "mago", texto: "Mago"},
		{nome: "paladino", texto: "Paladino"},
		{nome: "adepto", texto: "Adepto (NPC)"},
		{nome: "aristocrata", texto: "Aristocrata (NPC)"},
		{nome: "combatente", texto: "Combatente (NPC)"},
		{nome: "expert", texto: "Expert (NPC)"},
		{nome: "plebeu", texto: "Plebeu (NPC)"},
	];
	for (var i = 0; i < classes.length; ++i) {
		var option = document.createElement('option');
		option.setAttribute('name', classes[i].nome);
		option.setAttribute('value', classes[i].nome);
		option.innerText = classes[i].texto;
		if (classes[i].nome == classe) {
			option.selected = true;
		}
		select_classe .appendChild(option);
	}
	var span_nivel = document.createElement('span');
	span_nivel.innerText = "Nível: ";
	var input_nivel = document.createElement('input');
	input_nivel.type = 'text';
	input_nivel.name = 'nivel';
	input_nivel.maxlength = 2;
	input_nivel.setAttribute('onchange', 'AtualizaGeral()');
	input_nivel.value = nivel;
	var br_nivel = document.createElement('br');

	var div = document.createElement('div');
	div.setAttribute('class', 'classe');
	div.appendChild(select_classe);
	div.appendChild(span_nivel);
	div.appendChild(input_nivel);
	div.appendChild(br_nivel);
	goog.dom.getElement("classes").appendChild(div);
}

// Busca o valor selecionado de um select.
// @param dom_select o dom representando o select.
function ValorSelecionado(dom_select) {
	return dom_select.options[dom_select.selectedIndex].value;
}

// Seleciona um valor de um select.
// @param valor_selecionado o novo valor selecionado do dom.
// @param dom_select o dom representando o select.
function SelecionaValor(valor_selecionado, dom_select) {
	for (var i = 0; i < dom_select.options.length; ++i) {
		if (dom_select.options[i].value == valor_selecionado) {
			dom_select.selectedIndex = i;
			return;
		}
	}	
}

