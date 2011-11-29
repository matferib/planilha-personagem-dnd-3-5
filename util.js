// Tudo que for util e nao se encaixar em lugar nenhum.

goog.require('goog.dom');

// Retorna uma string do valor de forma sinalizada.
// @param valor a ser impresso.
// @param imprime_zero opcional, default true. Se false, retorna vazio quando
// o valor for zero.
function StringSinalizada(valor, imprime_zero) {
  if (imprime_zero == null) {
    imprime_zero = true;
  }
  if (!imprime_zero && valor == 0) {
    return '';
  }
  var return_value = '';
	if (valor >= 0) {
		return_value = '+';
	}
  return return_value + valor;
}

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
// @return null se nao houver valor selecionado (select vazio).
function ValorSelecionado(dom_select) {
	return dom_select.length > 0 ?
      dom_select.options[dom_select.selectedIndex].value : null;
}

// Limpa as opcoes de um select.
// @param dom_select o dom representando o select.
function LimpaSelect(dom_select) {
  while (dom_select.length > 0) {
    dom_select.remove(0);
  }
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

// Gera um identificador unico para o filho de um elemento.
// @return prefixo-id, onde nenhum outro filho do elemento possui
// identificador igual.
function GeraId(prefixo, elemento) {
  //return prefixo + '-' + elemento.childNodes.length;
  var id = 0;
  while (true) {
    var tentativa = prefixo + '-' + id;
    var encontrou_igual = false;
    for (var i = 0; i < elemento.childNodes.length; ++i) {
      var filho = elemento.childNodes[i];
      if (filho.id && filho.id.indexOf(tentativa) != -1) {
        encontrou_igual = true;
      }
    }
    if (encontrou_igual) {
      ++id;
    } else {
      return tentativa;
    }
  }
}

// Remove o filho do pai com o id passado.
// @param id_filho identificador do filho.
// @param pai elemento que contem os filhos.
function RemoveFilho(id_filho, pai) {
  for (var i = 0; i < pai.childNodes.length; ++i) {
    var filho = pai.childNodes[i];
    if (filho.id == id_filho) {
      pai.removeChild(filho);
    }
  }
}
