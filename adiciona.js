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
    {nome: "druida", texto: "Druida"},
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
  var id_div_equipamentos_armas = "div-equipamentos-armas";
  var div_armas = goog.dom.getElement(id_div_equipamentos_armas);
  var id_gerado = GeraId('div-arma', div_armas);
  var select = document.createElement('select');
  select.setAttribute('name', 'arma');
  select.setAttribute('onchange', 'AtualizaGeral()');
  for (var arma_corrente in tabelas_armas) {
    if (arma_corrente == 'desarmado') {
      // Desarmado eh um caso especial.
      continue;
    }
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
  button_remover.setAttribute('onclick', 'ClickRemoverFilho("' + 
        id_gerado + '", "' + id_div_equipamentos_armas + '")');
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

// Adiciona um novo estilo de luta a planilha. Todos os parametros sao opcionais.
// @param nome_estilo: uma_arma, arma_escudo, duas_armas.
// @param arma_principal nome da arma principal.
// @param arma_secundaria nome da arma secundaria.
function AdicionaEstiloLuta(nome_estilo, arma_principal, arma_secundaria) {
  var id_div_estilos_luta = 'div-estilos-luta';
  var div_estilos_luta = goog.dom.getElement(id_div_estilos_luta);
  var div_novo_estilo = document.createElement('div');
  var id_estilo = GeraId('id-estilo', div_estilos_luta);
  var id_select_primario = 
      id_estilo.replace('id-estilo', 'id-select-primario-estilo');
  var id_select_secundario = 
      id_estilo.replace('id-estilo', 'id-select-secundario-estilo');
  var id_span_primario =
      id_estilo.replace('id-estilo', 'id-span-primario-estilo');
  var id_span_secundario =
      id_estilo.replace('id-estilo', 'id-span-secundario-estilo');

  div_novo_estilo.innerHTML = 
      '<input type="radio" name="' + id_estilo + 
          '" value="uma_arma" onclick="ClickEstilo(\'uma_arma\', \'' + 
          id_select_secundario + '\')" ' + 
          (nome_estilo == null || nome_estilo == 'uma_arma' ? 'checked' : '') + '>Uma arma</input>' +
      '<input type="radio" name="' + id_estilo + 
          '" value="arma_escudo" onclick="ClickEstilo(\'arma_escudo\', \'' + 
          id_select_secundario + '\')" ' + 
          (nome_estilo == 'arma_escudo' ? 'checked' : '') + '>Arma + escudo</input>' +
      '<input type="radio" name="' + id_estilo + 
          '" value="duas_armas" onclick="ClickEstilo(\'duas_armas\', \'' + 
          id_select_secundario +'\')" ' + 
          (nome_estilo == 'duas_armas' ? 'checked' : '') + '>Duas armas</input>' +
      '<button type="button" onclick="ClickRemoverFilho(\'' + 
          id_estilo + '\',\'' + id_div_estilos_luta + '\')">-</button><br>' +
      'Principal: <select id="' + id_select_primario + '" onchange="AtualizaGeral()"></select> ' +
      '<span id="' + id_span_primario + '"></span><br> ' +
      'Secundária: <select id="' + id_select_secundario + '" onchange="AtualizaGeral()"></select> ' +
      '<span id="' + id_span_secundario + '"></span><br>';
  // Popula os selects.
  for (var i = 0; i < div_novo_estilo.childNodes.length; ++i) {
    var filho = div_novo_estilo.childNodes[i];
    if (filho.tagName == 'SELECT') {
      if (filho.id == id_select_primario) {
        AdicionaArmasAoEstilo(filho, arma_principal);
      } else {
        AdicionaArmasAoEstilo(filho, arma_secundaria);
        filho.disabled = (nome_estilo != 'duas_armas');
      }
    }
  }
  div_novo_estilo.id = id_estilo;
  div_estilos_luta.appendChild(div_novo_estilo);
}

// Preenche o select passado com todas as armas equipadas.
// @param select_arma o dom do select da arma.
// @param arma_selecionada opcional, o nome da arma selecionada.
function AdicionaArmasAoEstilo(select_arma, arma_selecionada) {
  LimpaSelect(select_arma);
  for (var i = 0; i < personagem.armas.length; ++i) {
    var arma = personagem.armas[i];
    var option = document.createElement('option');
    option.setAttribute('name', arma.nome_gerado);
    option.setAttribute('value', arma.nome_gerado);
    option.innerText = arma.nome_gerado;
    if (arma_selecionada == arma.nome_gerado) {
      option.selected = true;
    }
    select_arma.options.add(option);
  }
}

// Adiciona um talento a planilha.
// @param id numero identificando o id do talento.
// @param nome_talento nome do talento sendo adicionado (opcional).
// @param complemento_talento caso o talento tenha complemento (opcional).
function AdicionaTalento(id, nome_talento, complemento) {
  if (nome_talento == null) {
    nome_talento = 'usar_armas_simples';
  }
  var div_select_talentos = goog.dom.getElement('div-select-talentos');
  var select_talento = document.createElement('select');
  select_talento.id = 'select-talento-' + id;
  select_talento.className = 'selects-talento';
  select_talento.setAttribute('onchange', 'AtualizaGeral()');
  var option_selected;
  for (var talento in tabelas_talentos) {
    var option_talento = document.createElement('option');
    option_talento.text = tabelas_talentos[talento].nome;
    option_talento.value = talento;
    option_talento.selected = nome_talento && nome_talento == talento;
    select_talento.add(option_talento, null);
  }
  var talento = tabelas_talentos[nome_talento];
  var input_complemento_talento = document.createElement('input');
  input_complemento_talento.id = 'input-complemento-talento-' + id;
  input_complemento_talento.type = 'text';
  input_complemento_talento.disabled = !talento.complemento;
  input_complemento_talento.value = complemento ? complemento : '';
  //input_complemento_talento.setAttribute('onchange', 'AtualizaGeral()');

  var div_select_talento = document.createElement('div');
  div_select_talento.id = 'div-select-talento-' + id;
  div_select_talento.appendChild(select_talento);
  div_select_talento.appendChild(input_complemento_talento);

  div_select_talentos.appendChild(div_select_talento);
}
