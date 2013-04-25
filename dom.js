// Funcoes uteis relacionadas a dom.

// @return o dom com o id passado.
function Dom(id) {
  return document.getElementById(id);
}

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

function CriaOptGroup(rotulo) {
  var optgroup = CriaDom('optgroup');
  optgroup.label = rotulo;
  return optgroup;
}

function CriaOption(texto, valor) {
  var option = CriaDom('option');
  option.text = texto;
  option.value = valor;
  return option;
}

function CriaBotao(texto, id, classe, funcao) {
  var botao = CriaDom('button', id, classe);
  botao.setAttribute('type', 'button');
  botao.textContent = texto;
  if (funcao) {
    botao.addEventListener('click', funcao, false);
  }
  return botao;
}

function CriaRadio(texto, id, classe, nome_grupo, funcao) {
  var botao = CriaDom('input', id, classe);
  botao.setAttribute('type', 'radio');
  botao.name = nome_grupo;
  //botao.textContent = texto;
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
    span.textContent = texto;
  }
  return span;
}

// @param marcado true se o checkbox estiver marcado.
function CriaInputCheckbox(marcado, id, classe, funcao) {
  var input = CriaDom('input', id, classe);
  input.type = 'checkbox';
  input.checked = marcado;
  if (funcao) {
    input.addEventListener('change', funcao, false);
  }
  return input;
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

// Cria um input de numero com os atributos passados.
// @param numero o numero mostrado dentro do input.
// @param id do input.
// @param classe do input.
// @param funcao ou handler a ser chamado.
function CriaInputNumerico(numero, id, classe, funcao) {
  var input = CriaDom('input', id, classe);
  input.type = 'number';
  if (numero) {
    input.value = numero;
  }
  if (funcao) {
    input.addEventListener('input', funcao, false);
  }
  return input;
}

function CriaSelect(id, classe, funcao) {
  var select = CriaDom('select', id, classe);
  if (funcao) {
    select.addEventListener('change', funcao, false);
  }
  return select;
}

// Cria um span com os botoes mais e menos, retornando-o.
// @param id do input de texto com o valor do botao.
// @param classe do input com o valor do botao.
// @param handler a ser chamada pelos botoes, que deve receber 1 para +, -1 para menos.
function CriaBotoesMaisMenos(id, classe, handler) {
  var span = CriaSpan();
  var botao_mais = CriaBotao('+');
  botao_mais.addEventListener('click', handler(1));
  span.appendChild(botao_mais);
  var botao_menos = CriaBotao('-');
  botao_menos.addEventListener('click', handler(-1));
  span.appendChild(botao_menos);
  var input_pontos = CriaInputTexto('0', id, classe);
  input_pontos.size = 2;
  input_pontos.readOnly = true;
  span.appendChild(input_pontos);
  return span;
}

// Remove o filho do pai com o id passado.
// @param filho identificador do filho ou o dom do filho.
// @param pai elemento que contem os filhos.
function RemoveFilho(filho, pai) {
  for (var i = 0; i < pai.childNodes.length; ++i) {
    var nodo_filho = pai.childNodes[i];
    if (nodo_filho == filho || nodo_filho.id == filho) {
      pai.removeChild(nodo_filho);
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

// Remove o ultimo filho de um pai.
function RemoveUltimoFilho(pai) {
  pai.removeChild(pai.lastChild);
}

// Remove o atributo onchange do elemento e seus filhos.
// @param dom que tera onchange removido e de seus filhos.
function _RemoveOnChange(dom) {
  for (var filho = dom.firstChild; filho != null; filho = filho.nextSibling) {
    if (filho.removeAttribute) {
      filho.removeEventListener('change');
      _RemoveOnChange(filho);
    }
  }
}
