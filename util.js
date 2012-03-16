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
// @param dom pode ser um span ou div, ou qualquer elemento que possua textContent.
// Tambem pode ser um array de dom.
// @param imprime_zero opcional, default true. Se false, imprime_vazio no dom. 
function ImprimeSinalizado(valor, dom, imprime_zero) {
  if (imprime_zero == null) {
    imprime_zero = true;
  }

  if (dom.length == null) {
    if (valor > 0) {
      dom.textContent = '+' + valor;
    } else if (valor == 0) {
      dom.textContent = imprime_zero ? '+0' : '';
    } else {
      dom.textContent = valor;
    }
  }
  else {
    for (var i = 0; i < dom.length; ++i) {
      ImprimeSinalizado(valor, dom[i], imprime_zero);
    }
  }
}

// Imprime um valor de forma nao sinalizada no caso positivo.
// @param dom pode ser um span ou div, ou qualquer elemento que possua textContent.
function ImprimeNaoSinalizado(valor, dom, imprime_zero) {
  if (imprime_zero == null) {
    imprime_zero = true;
  }

  if (dom.length == null) {
    dom.textContent = imprime_zero ? valor : '';
  }
  else {
    for (var i = 0; i < dom.length; ++i) {
      ImprimeNaoSinalizado(valor, dom[i]);
    }
  }
}

// Adiciona um elemento span ao div
function AdicionaSpanAoDiv(texto, id_span, div) {
  var span = CriaSpan(texto, id_span);
  div.appendChild(span);
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

// Recebe uma string de preço e retorna um objeto contendo as moedas.
// @return objeto de moedas ou null em caso de erro.
function LePreco(preco) {
  var moedas = { platina: 0, ouro: 0, prata: 0, cobre: 0 };
  var sufixos = { platina: 'pl', ouro: 'po', prata: 'pp', cobre: 'pc' };
  var preco_minusculo = preco.toLowerCase();
  for (var tipo_moeda in moedas) {
    var indice_tipo = preco_minusculo.indexOf(sufixos[tipo_moeda]);
    if (indice_tipo != -1) {
      var string_val = preco_minusculo.substr(0, indice_tipo);
      var val = parseInt(string_val);
      if (val != NaN) {
        moedas[tipo_moeda] = parseInt(string_val);
      }
    }
  }
  return moedas;
}
