goog.require('goog.dom');

// OBS: deve-se carregar util e tabelas.js primeiro.

var VALOR_BASE = "-valor-base";
var VALOR_TOTAL = "-valor-total";
var MOD = '-mod-';
var MOD_TOTAL = "-mod-total";
var MOD_RACIAL = "-mod-racial";
var TAMANHO_MOD_ATAQUE_DEFESA = "tamanho-mod-ataque-defesa";
var BBA = "bba";
var BBA_CORPO_A_CORPO = "bba-corpo-a-corpo";
var BBA_DISTANCIA = "bba-distancia";
var CA_NORMAL = "ca-normal";
var CA_SURPRESO = "ca-surpreso";
var CA_TOQUE = "ca-toque";
var TAMANHO = "tamanho";
var NOME = "nome";
var RACA = "raca";
var CLASSE = "classe";
var ALINHAMENTO = "alinhamento";

// Adiciona uma nova classe ao personagem.
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

// Remove a classe mais recente do personagem.
function RemoveClasse() {
	var div_classes = goog.dom.getElement("classes");
	if (div_classes.childNodes.length == 1) return;
	div_classes.removeChild(div_classes.lastChild);
}

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha.
function AtualizaGeral() {
	LeEntradas();
	AtualizaTamanho();
	AtualizaModificadoresAtributos();
	AtualizaAtaque();
	AtualizaDefesa();
	AtualizaSalvacoes();
}

// Escreve todos os inputs com os valores encontrados no personagem.
function EscreveEntradas() {
	// nome
	goog.dom.getElement(NOME).value = personagem.nome;
	// raca
	var select_raca = goog.dom.getElement(RACA);
	select_raca.selectedIndex = select_raca.options.namedItem(personagem.raca).index;
	// alinhamento
	var select_alinhamento = goog.dom.getElement(ALINHAMENTO);
	select_alinhamento.selectedIndex =
		select_alinhamento.options.namedItem(personagem.alinhamento).index;
	// classes.
	for (var classe in personagem.classes) {
		if (personagem.classes[classe] > 0) {
			AdicionaClasse(classe, personagem.classes[classe]);
		}
	}
}

// Le todos os inputs da planilha e armazena no personagem para calculos posteriores.
function LeEntradas() {
	// nome
	personagem.nome = goog.dom.getElement(NOME).value;
	// raca
	var select_raca = goog.dom.getElement(RACA);
	personagem.raca = select_raca.options[select_raca.selectedIndex].value;
	// alinhamento
	var select_alinhamento = goog.dom.getElement(ALINHAMENTO);
	personagem.alinhamento = select_alinhamento.options[select_alinhamento.selectedIndex].value;
	// atributos
	// classes, zera e depois soma os selects e niveis de classe.
	for (var classe in personagem.classes) {
		personagem.classes[classe] = 0;
	}
	var array_classes = goog.dom.getElementsByClass(CLASSE);  // cada elemento eh um div.
	for (var i = 0; i < array_classes.length; ++i) {
		var div_classe = array_classes[i];
		var classe;
		var nivel;
		for (var j = 0; j < div_classe.childNodes.length; ++j) {
			var elemento = div_classe.childNodes[j];
			if (elemento.name == null) continue;
			if (elemento.name == "classe") {
				// elemento eh um select
				classe = elemento.options[elemento.selectedIndex].value;
			} 
			else if (elemento.name = "nivel") {
				// elemento eh um input.
				nivel = parseInt(elemento.value);
			}
		}
		personagem.classes[classe] += nivel;
	}
	for (var habilidade in personagem.atributos) {
		// valor total do atributo na planilha.
		personagem.atributos[habilidade].valor = 
			parseInt(goog.dom.getElement(habilidade + VALOR_BASE).value);
	}
}

// Atualiza o tamanho em funcao da raca.
function AtualizaTamanho() {
	// Busca o modificador de tamanho da raca.
	personagem.tamanho.categoria =
	 	tabelas_raca[personagem.raca].tamanho;
	personagem.tamanho.modificador_ataque_defesa =
		tabelas_tamanho[personagem.tamanho.categoria].ataque_defesa;
	ImprimeSinalizado(
			personagem.tamanho.modificador_ataque_defesa,
			goog.dom.getElementsByClass(TAMANHO_MOD_ATAQUE_DEFESA));
	goog.dom.getElement(TAMANHO).innerText =
	 		tabelas_tamanho[personagem.tamanho.categoria].nome;
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car),
// a raca, class etc.
function AtualizaModificadoresAtributos() {
	// busca a raca e seus modificadores.
	var modificadores_raca = tabelas_raca[personagem.raca].atributos;

	// Busca cada elemento das estatisticas e atualiza modificadores.
	for (var habilidade in personagem.atributos) {
		// modificador racial.
		if (modificadores_raca[habilidade]) {
			var modificador_racial = modificadores_raca[habilidade];
			personagem.atributos[habilidade].valor += modificador_racial;
			// Escreve o modificador racial.
			ImprimeSinalizado(
					modificador_racial,
					goog.dom.getElement(habilidade + MOD_RACIAL));
		} 
		else {
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
				goog.dom.getElementsByClass(habilidade + MOD_TOTAL));
	}
}

// Atualiza os diversos tipos de ataques lendo a classe e os modificadores relevantes. 
function AtualizaAtaque() {
	var bba = 0;
	for (var classe in personagem.classes) {
		bba += tabelas_bba[classe](personagem.classes[classe]);
	}
	ImprimeSinalizado(bba, goog.dom.getElementsByClass("bba"));
	ImprimeSinalizado(
			bba + personagem.atributos.forca.modificador + 
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElement(BBA_CORPO_A_CORPO));
	ImprimeSinalizado(
			bba + personagem.atributos.destreza.modificador +
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElement(BBA_DISTANCIA));
}

// Atualiza os varios tipos de defesa lendo tamanho, armadura e modificadores relevantes.
function AtualizaDefesa() {
	ImprimeNaoSinalizado(
			10 + personagem.atributos.destreza.modificador + 
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElementsByClass(CA_NORMAL));
	ImprimeNaoSinalizado(
			10 + personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElementsByClass(CA_SURPRESO));
	ImprimeNaoSinalizado(
			10 + personagem.atributos.destreza.modificador + 
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElementsByClass(CA_TOQUE));
}

// Atualiza as salvacoes, calculando o bonus base de acordo com a classe e
// modificando pelo atributo relevante.
function AtualizaSalvacoes() {
	var habilidades_salvacoes = {
		fortitude: 'constituicao',
		reflexo: 'destreza',
		vontade: 'sabedoria'
	};
	for (var tipo_salvacao in habilidades_salvacoes) {
		var valor_base = 0;
		for (var classe in personagem.classes) {
			valor_base += 
				tabelas_salvacao[classe][tipo_salvacao](personagem.classes[classe]);
		}
		var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
		var modificador_atributo = 
			personagem.atributos[habilidade_modificadora].modificador;
		personagem.salvacoes[tipo_salvacao] = valor_base + modificador_atributo;
		ImprimeNaoSinalizado(
				valor_base,
				goog.dom.getElement(tipo_salvacao + VALOR_BASE));
		ImprimeSinalizado(
				personagem.salvacoes[tipo_salvacao],
				goog.dom.getElement(tipo_salvacao + MOD_TOTAL));
	}
}


