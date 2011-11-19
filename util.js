// Tudo que for util e nao se encaixar em lugar nenhum.

goog.require('goog.dom');

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
// Parametros sao todos opcionais.
// Classe padrao: guerreiro.
// Nivel padrao: 1.
function AdicionaClasse(classes_desabilitadas, classe, nivel) {
	if (!classes_desabilitadas) {
		classes_desabilitadas = [];
	}
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
		option.selected = (classes[i].nome == classe);
		option.innerText = classes[i].texto;
		var desabilitar_classe = false;
		for (var j = 0; j < classes_desabilitadas.length; ++j) {
			if (classes[i].nome == classes_desabilitadas[j]) {
				desabilitar_classe = true;
				break;
			}
		}
		option.disabled = desabilitar_classe;
		select_classe.appendChild(option);
	}
	var span_nivel = document.createElement('span');
	span_nivel.innerText = "Nível: ";
	var input_nivel = document.createElement('input');
	input_nivel.type = 'text';
	input_nivel.name = 'nivel';
	input_nivel.maxLength = input_nivel.size = 2;
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

// Preenche select de armas corpo a corpo. 
function _PreencheArmasCorpoACorpo() {
  for (var i = 0; i < entradas.armas_cac.length; ++i) {
    var select_armas = goog.dom.getElement(ARMA_CORPO_A_CORPO + "-" + i);
    for (var arma in tabelas_armas) {
  		var option = document.createElement('option');
	  	option.setAttribute('name', arma);
		  option.setAttribute('value', arma);
      tabelas_armas[arma].nome = arma;
    	option.innerText = tabelas_armas[arma].nome;
		  select_armas.appendChild(option);
    }
  }
}

// Preenche select de armas a distancia. 
function _PreencheArmasArremesso() {
  for (var i = 0; i < entradas.armas_distancia.length; ++i) {
    var select_armas = goog.dom.getElement(ARMA_ARREMESSO + "-" + i);
    for (var arma in tabelas_armas) {
      if (tabelas_armas[arma].incremento_distancia) {
        var option = document.createElement('option');
        option.setAttribute('name', arma);
        option.setAttribute('value', arma);
        option.innerText = tabelas_armas[arma].nome;
        select_armas.appendChild(option);
      }
    }
  }
}

// Preenche select de armas a distancia. 
function _PreencheArmasDistancia() {
  /*
  for (var i = 0; i < entradas.armas_distancia.length; ++i) {
    var select_armas = goog.dom.getElement(ARMA_DISTANCIA + "-" + i);
    for (var arma in tabelas_armas) {
      if (tabelas_armas[arma].incremento_distancia) {
        var option = document.createElement('option');
        option.setAttribute('name', arma);
        option.setAttribute('value', arma);
        option.innerText = tabelas_armas[arma].nome;
        select_armas.appendChild(option);
      }
    }
  }*/
}

// Preenche os nomes faltantes na tabela de armas e chama as funcoes
// para preencher os selects de armas corpo a corpo e a distancia.
function CarregaTabelaArmas() {
  for (var arma in tabelas_armas) {
    if (tabelas_armas[arma].nome == null) {
      tabelas_armas[arma].nome = arma;
    }
  }
  _PreencheArmasCorpoACorpo();
  _PreencheArmasArremesso();
  _PreencheArmasDistancia();
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

// Retorna numero * [1, limite].
function Rola(numero, limite) {
  var resultado = 0;
  for (var i = 0; i < numero; ++i) {
    resultado += Math.floor(Math.random() * limite) + 1;
  }
  return resultado;
}

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  personagem.nome = entradas.nome;
  personagem.raca = entradas.raca;
  personagem.alinhamento = entradas.alinhamento;
  personagem.classes = entradas.classes;
  personagem.pontos_vida.total = entradas.pontos_vida;
  personagem.pontos_vida.ferimentos = entradas.ferimentos;
  for (var atributo in personagem.atributos) {
    personagem.atributos[atributo].valor = entradas[atributo];
  }
  // As armas tem que ser copiadas porque no personagem sao adicionados
  // outros campos nao presentes na entrada, como bonus final.
  personagem.armas_cac = [];
  for (var i = 0; i < entradas.armas_cac.length; ++i) {
    personagem.armas_cac.push(_ConverteArma(entradas.armas_cac[i]));
  }
  personagem.armas_arremesso = [];
  for (var i = 0; i < entradas.armas_arremesso.length; ++i) {
    personagem.armas_arremesso.push(_ConverteArma(entradas.armas_arremesso[i]));
  }
  personagem.armas_distancia = [];
  for (var i = 0; i < entradas.armas_distancia.length; ++i) {
    personagem.armas_distancia.push(_ConverteArma(entradas.armas_distancia[i]));
  }

  personagem.armadura = entradas.armadura;
  personagem.escudo = entradas.escudo;
}

// Converte uma arma da entrada para personagem.
// @return a arma convertida.
function _ConverteArma(arma_entrada) {
  var arma_personagem = {};
  arma_personagem.nome = arma_entrada.nome;
  arma_personagem.obra_prima = arma_entrada.obra_prima;
  if (arma_personagem.obra_prima) {
    arma_personagem.bonus_ataque = 1;
    arma_personagem.bonus_dano = 0;
  } else {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = 
        arma_entrada.bonus;
  }
  return arma_personagem;
}
