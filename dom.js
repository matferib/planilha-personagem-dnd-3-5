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

function CriaBotao(texto, id, classe) {
  var botao = CriaDom('button', id, classe);
  botao.setAttribute('type', 'button');
  botao.innerText = texto;
  return botao;
}

function CriaDiv(id, classe) {
  return CriaDom('div', id, classe);
}

function CriaSpan(texto, id, classe) {
  var span = CriaDom('span', id, classe);
  span.innerText = texto;
  return span;
}

function CriaInputTexto(texto, id, classe) {
  var input = CriaDom('input', id, classe);
  input.type = 'text';
  input.value = texto;
  return input;
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
