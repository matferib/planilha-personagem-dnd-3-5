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
	classes: {
		barbaro: 0, 
		bardo: 0,
		clerigo: 0,
		druida: 0,
		feiticeiro: 0,
		guerreiro: 0,
		ladino: 0,
		mago: 0,
		monge: 0,
		paladino: 0,
		ranger: 0,
	},
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
	bba: 0,
	salvacoes : {
		fortitude: 0,
		reflexo: 0,
		vontade: 0
	}
};

// Adiciona uma nova classe ao personagem.
function AdicionaClasse() {
	var div = document.createElement('div');
	div.setAttribute('class', 'classe');
	div.innerHTML =
'<select name="classe" onchange="AtualizaGeral()">' +
'	<option value="barbaro">Bárbaro</option>' +
'	<option value="bardo">Bardo</option>' +
'	<option value="clerigo">Clérigo</option>' +
'	<option value="guerreiro">Guerreiro</option>' +
'	<option value="feiticeiro">Feiticeiro</option>' +
'	<option value="ladino">Ladino</option>' +
'	<option value="mago">Mago</option>' +
'	<option value="paladino">Paladino</option>' +
'	<option value="ranger">Ranger</option>' +
'</select>' +
'Nível: <input type="text" name="nivel" maxlength="2" size="2" value="1" onchange="AtualizaGeral()"/>' +
'<br>';
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
	LeDados();
	AtualizaModificadoresAtributos();
	AtualizaAtaque();
	AtualizaSalvacoes();
}

// Le todos os inputs da planilha e armazena no personagem para calculos posteriores.
function LeDados() {
	// raca
	var select_raca = goog.dom.getElement("raca");
	personagem.raca = select_raca.options[select_raca.selectedIndex].value;
	// classes, zera e depois soma os selects e niveis de classe.
	for (var classe in personagem.classes) {
		personagem.classes[classe] = 0;
	}
	var array_classes = goog.dom.getElementsByClass("classe");  // cada elemento eh um div.
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

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car).
function AtualizaModificadoresAtributos() {
	// busca a raca e seus modificadores.
	var modificadores_raca = modificadores_raciais[personagem.raca].atributos;

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
			bba + personagem.atributos.forca.modificador, 
			goog.dom.getElement("bba-corpo-a-corpo"));
	ImprimeSinalizado(
			bba + personagem.atributos.destreza.modificador, 
			goog.dom.getElement("bba-distancia"));
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


