// Funcoes uteis relacionadas a dom.

// @return o dom com o id passado.
function Dom(id) {
  return document.getElementById(id);
}

// @return uma lista de doms que possuem a classe passada.
function DomsPorClasse(classe) {
  return document.getElementsByClassName(classe);
  //return goog.dom.getElementsByClass(classe);
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
function CriaInputTexto(texto, id, classe, funcao) {
  var input = CriaDom('input', id, classe);
  input.type = 'text';
  if (texto) {
    input.value = texto;
  }
  if (funcao) {
    input.addEventListener('change', funcao, false);
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

// Limpa as opções do 'select'.
function LimpaSelect(select) {
  select.options.length = 0;
}

// Busca o valor selecionado de um select.
// @param dom_select o dom representando o select.
// @return null se nao houver valor selecionado (select vazio).
function ValorSelecionado(dom_select) {
  return dom_select.length > 0 ?
      dom_select.options[dom_select.selectedIndex].value : null;
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

// Popula o select com os valores passados.
// @param valores a serem colocados no select.
//   [ {valor: texto} ]
function PopulaSelect(valores, dom_select) {
  dom_select.options.length = 0;
  for (var i = 0; i < valores.length; ++i) {
    for (var chave in valores[i]) {
      dom_select.options.add(CriaOption(valores[i][chave], chave));
    }
  }
}

// Similar ao PopulaSelect, mas com agrupamentos.
// @param grupos de valores a serem colocados. Cada entrada é um array
//        { nome_grupo1: [ { valor, texto }, { valor, texto } ...], 
//          nome_grupo2: [ ...] }
//        Os nomes de grupo devem ser diferentes.
function PopulaSelectComOptGroup(grupos, dom_select) {
  dom_select.options.length = 0;
  for (var nome_grupo in grupos) { 
    var optgroup = CriaOptGroup(nome_grupo);
    grupos[nome_grupo].forEach(function(entrada) {
      var option = CriaOption(entrada.texto, entrada.valor);
      optgroup.appendChild(option);
    });
    dom_select.appendChild(optgroup);
  }
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
  var filho;
  while ((filho = dom.firstChild)) {
    dom.removeChild(filho);
  }
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
      filho.removeEventListener('change', null);
      _RemoveOnChange(filho);
    }
  }
}

// Se 'dom_pai' tiver mais filhos que 'num_filhos', remove os que sobrarem. 
// Se tiver menos, chama funcao_adicao(indice_filho) para cada filho que houver
// a menos.
function AjustaFilhos(dom_pai, num_filhos, funcao_adicao) {
  var dom_filhos = dom_pai.childNodes;
  // Remove filhos do dom se tiver mais que os estilos do personagem.
  var num_filhos_a_remover = dom_filhos.length - num_filhos;
  for (var i = 0; i < num_filhos_a_remover; ++i) {
    RemoveUltimoFilho(dom_pai);
  }
  // Adiciona doms filhos se houver menos que num_filhos.
  for (var i = dom_filhos.length; i < num_filhos; ++i) {
    funcao_adicao(i);
  }
}

function HabilitaOverlay() {
  Dom('div-overlay').style.display = 'block';
}

function DesabilitaOverlay() {
  Dom('div-overlay').style.display = 'none';
}

// configura o div de janela e o retorna. Apenas um deve ficar ativo 
// em um determinado momento.
// @param largura da janela, porcentagem em float (por exemplo, 0.5).
// @return o dom da janela.
function AbreJanela(largura) {
  if (!largura) {
    largura = .25;
  }

  var janela = Dom('div-janela');
  RemoveFilhos(janela);
  janela.style.top = (((1 - .25) / 2.0) * 100) + '%';
  janela.style.left = (((1 - largura) / 2.0) * 100) + '%';
  janela.style.width = (largura * 100) + '%';
  HabilitaOverlay();
  janela.style.display = 'block';
  return janela;
}

function FechaJanela() {
  var janela = Dom('div-janela');
  janela.style.display = 'none';
  DesabilitaOverlay();
}

// Cria uma janela de mensagem (com botão ok).
function JanelaMensagem(mensagem) {
  var div_titulo = CriaDiv();
  var div_msg = CriaDiv();
  var div_botao = CriaDiv();

  div_titulo.className = 'div-titulo-janela';
  div_msg.className = 'div-msg-janela';
  div_botao.className = 'div-botao-janela';
  div_titulo.appendChild(CriaSpan('Mensagem'));
  div_msg.appendChild(CriaSpan(mensagem));
  div_botao.appendChild(CriaBotao('Ok', null, null, function() { FechaJanela(); }));

  var j = AbreJanela();
  var divs = [ div_titulo, div_msg, div_botao ];
  for (var i = 0; i < divs.length; ++i) {
    j.appendChild(divs[i]);
  }
}

// Cria uma janela de confirmação (sim/não). Chama o respectivo callback.
function JanelaConfirmacao(mensagem, callback_sim, callback_nao) {
  var div_titulo = CriaDiv();
  var div_msg = CriaDiv();
  var div_botao = CriaDiv();

  div_titulo.className = 'div-titulo-janela';
  div_msg.className = 'div-msg-janela';
  div_botao.className = 'div-botao-janela';
  div_titulo.appendChild(CriaSpan('Pergunta'));
  div_msg.appendChild(CriaSpan(mensagem));
  div_botao.appendChild(CriaBotao('Sim', null, null, function() { FechaJanela(); callback_sim(); }));
  div_botao.appendChild(CriaBotao('Não', null, null, function() { FechaJanela(); callback_nao(); }));

  var j = AbreJanela();
  var divs = [ div_titulo, div_msg, div_botao ];
  for (var i = 0; i < divs.length; ++i) {
    j.appendChild(divs[i]);
  }
}



