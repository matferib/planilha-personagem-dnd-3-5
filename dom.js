// Funcoes uteis relacionadas a dom.

function CriaDom(tipo, id, classe) {
  var dom_criado = document.createElement(tipo);
  if (id) {
    dom_criado.id = id;
  }
  if (classe) {
    dom_criado.className = classe;
  }
  return dom_criado;
}

// @return um dom <br>.
function CriaBr() {
  return CriaDom('br');
}

function CriaBotao(texto, id, classe, funcao) {
  var botao = CriaDom('button', id, classe);
  botao.setAttribute('type', 'button');
  botao.innerText = texto;
  if (funcao) {
    botao.addEventListener('click', funcao, false);
  }
  return botao;
}

function CriaDiv(id, classe) {
  return CriaDom('div', id, classe);
}

function CriaSpan(texto, id, classe) {
  var span = CriaDom('span', id, classe);
  if (texto) {
    span.innerText = texto;
  }
  return span;
}

// Cria um input de texto com os atributos passados.
// @param texto o texto mostrado dentro do input.
// @param id do input.
// @param classe do input.
function CriaInputTexto(texto, id, classe) {
  var input = CriaDom('input', id, classe);
  input.type = 'text';
  if (texto) {
    input.value = texto;
  }
  return input;
}

function CriaSelect(id, classe) {
  var select = CriaDom('select', id, classe);
  return select;
}

// Cria um span com os botoes mais e menos, retornando-o.
// @param id do input de texto com o valor do botao.
// @param classe do input com o valor do botao.
// @param nome_funcao a ser chamada pelos botoes, que deve ser do tipo
//        funcao(string, incremento).
// @param parametro a ser passado para a funcao.
function CriaBotoesMaisMenos(id, classe, nome_funcao, parametro) {
  var span = CriaSpan();
  var botao_mais = CriaBotao('+');
  botao_mais.setAttribute('onclick', nome_funcao + "('" + parametro + "', 1)");
  span.appendChild(botao_mais);
  var botao_menos = CriaBotao('-');
  botao_menos.setAttribute('onclick', nome_funcao + "('" + parametro + "', -1)");
  span.appendChild(botao_menos);
  var input_pontos = CriaInputTexto('0', id, classe);
  input_pontos.size = 2;
  input_pontos.readOnly = true;
  span.appendChild(input_pontos);
  return span;
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

// Remove os filhos de um dom. Antes, remove todos os onchange do elemento
// para evitar chamadas de onchange durante a remocao. 
function RemoveFilhos(dom) {
  if (dom == null) {
    return;
  }
  _RemoveOnChange(dom, false);
  goog.dom.removeChildren(dom);
}

// Remove o atributo onchange do elemento e seus filhos.
// @param dom que tera onchange removido e de seus filhos.
function _RemoveOnChange(dom) {
  for (var filho = dom.firstChild; filho != null; filho = filho.nextSibling) {
    if (filho.removeAttribute) {
      filho.removeAttribute('onchange');
      _RemoveOnChange(filho);
    }
  }
}
