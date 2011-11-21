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

// Preenche os nomes faltantes na tabela de armas e chama as funcoes
// para preencher os selects de armas corpo a corpo e a distancia.
function CarregaTabelaArmas() {
  for (var arma in tabelas_armas) {
    if (tabelas_armas[arma].nome == null) {
      tabelas_armas[arma].nome = arma;
    }
  }
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

  personagem.armadura = entradas.armadura;
  personagem.escudo = entradas.escudo;
  personagem.armas = [];
  for (var i = 0; i < entradas.armas.length; ++i) {
    personagem.armas.push(_ConverteArma(entradas.armas[i]));
  }
}

// Converte uma arma da entrada para personagem.
// @return a arma convertida.
function _ConverteArma(arma_entrada) {
  var arma_personagem = {};
  arma_personagem.nome = arma_entrada.nome;
  arma_personagem.nome_gerado = arma_entrada.nome;
  if (arma_personagem.obra_prima) {
    arma_personagem.bonus_ataque = 1;
    arma_personagem.bonus_dano = 0;
    arma_personagem.nome_gerado += ' OP';
  } else {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = 
        arma_entrada.bonus;
    arma_personagem.nome_gerado += ' +' + arma_personagem.bonus_ataque;
  }
  return arma_personagem;
}

// Gera um identificador unico para o filho de um elemento.
function GeraId(prefixo, elemento) {
  return prefixo + '-' + elemento.childNodes.length;
  // TODO
  //for (var i = 0; i < elemento.childNodes.length; ++i) {
  //}
}


