// Tudo o que for relacionado a adicionar ou remover na planilha.

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

// Adiciona uma nova arma a lista de equipamentos. Todos parametros sao opcionais.
// @param arma opcional nome da arma sendo adicionada.
// @param obra_prima indica se a arma eh obra_prima.
// @param bonus da arma.
function AdicionaArma(arma, obra_prima, bonus) {
  var div_armas = goog.dom.getElement("div-equipamentos-armas");
  var id_gerado = GeraId('div-arma', div_armas);
  var select = document.createElement('select');
  select.setAttribute('name', 'arma');
  select.setAttribute('onchange', 'AtualizaGeral()');
  for (var arma_corrente in tabelas_armas) {
    var option = document.createElement('option');
    option.setAttribute('name', arma_corrente);
    option.setAttribute('value', arma_corrente);
    option.selected = (arma_corrente == arma);
    option.innerText = tabelas_armas[arma_corrente].nome;
    select.appendChild(option);
  }
  var span_obra_prima = document.createElement('span');
  span_obra_prima.innerText = " OP";

  var input_obra_prima = document.createElement('input');
  input_obra_prima.setAttribute('onchange', 'AtualizaGeral()');
  input_obra_prima.setAttribute('type', "checkbox");
  input_obra_prima.checked = obra_prima;

  var input_bonus = document.createElement('input');
  input_bonus.setAttribute('onchange', 'AtualizaGeral()');
  input_bonus.setAttribute('type', "text");
  input_bonus.setAttribute('maxlength', 2);
  input_bonus.setAttribute('size', 2);
  input_bonus.value = bonus || 0;

  var button_remover = document.createElement('button');
  button_remover.setAttribute('type', 'button');
  button_remover.setAttribute('onclick', 'ClickRemoverArma("' + id_gerado + '")');
  button_remover.innerText = '-';

  var div = document.createElement('div');
  div.id = id_gerado;
  div.appendChild(select);
  div.appendChild(span_obra_prima);
  div.appendChild(input_obra_prima);
  div.appendChild(input_bonus);
  div.appendChild(button_remover);
  div_armas.appendChild(div);
}

// Remove a arma selecionada.
// @param id_div_arma id do div da arma.
function RemoveArma(id_div_arma) {
  var div_armas = goog.dom.getElement("div-equipamentos-armas");
  for (var i = 0; i < div_armas.childNodes.length; ++i) {
    var div_arma = div_armas.childNodes[i];
    if (div_arma.id == id_div_arma) {
      div_armas.removeChild(div_arma);
    }
  }
}

// Adiciona um novo estilo de luta. Todos os parametros sao opcionais.
// @param estilo: uma_arma, arma_escudo, duas_armas.
// @param arma_principal nome da arma principal.
// @param arma_secundaria nome da arma secundaria.
function AdicionaEstilo(estilo, arma_principal, arma_secundaria) {
  var div_estilo_luta = goog.dom.getElement('div-estilos-luta');
  var div_novo_estilo = document.createElement('div');
  div_novo_estilo.setAttribute('class', 'div-estilo-luta');
  var indice_estilo = entradas.estilos_luta.length;
  div_novo_estilo.innerHTML = 
      '<input type="radio" name="estilo-' + indice_estilo + '" value="uma_arma">Uma arma</input>' +
      '<input type="radio" name="estilo-' + indice_estilo + '" value="arma_escudo">Arma + escudo</input>' +
      '<input type="radio" name="estilo-' + indice_estilo + '" value="duas_armas">Duas armas</input><br>' +
      'Principal: <select></select><br>' +
      'Secundária: <select></select>';
  for (var i = 0; i < div_novo_estilo.childNodes.length; ++i) {
    var filho = div_novo_estilo.childNodes[i];
    if (filho.tagName == 'SELECT') {
      _PopulaSelectEstilo(filho);
    }
  }
  div_estilo_luta.appendChild(div_novo_estilo);
  entradas.estilos_luta.push(
      { estilo: estilo, arma_principal: arma_principal, arma_secundaria: arma_secundaria});
}

// Preenche o select passado com todas as armas equipadas.
function _PopulaSelectEstilo(select_arma) {
  for (var i = 0; i < personagem.armas.length; ++i) {
    var arma = personagem.armas[i];
    var option = document.createElement('option');
    option.setAttribute('name', arma.nome_gerado);
    option.setAttribute('value', arma.nome_gerado);
    option.innerText = arma.nome_gerado;
    select_arma.appendChild(option);
  }
}

