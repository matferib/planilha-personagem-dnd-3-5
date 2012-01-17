// Tudo o que for relacionado a adicionar ou remover na planilha.

// Adiciona um div de classe ao dom passado. 
function AdicionaClasse(indice, dom) {
  if (!indice) {
    indice = 0;
  }
  var select_classe = CriaSelect('select-classe-' + indice, 'selects-classes');
  select_classe.setAttribute('name', 'classe');
  select_classe.setAttribute('onchange', 'AtualizaGeral()');
  var span_nivel = CriaSpan('Nível: ');
  var input_nivel = CriaInputNumerico(
      1, 'nivel-classe-' + indice, null, 
      { handleEvent: function() { AtualizaGeral() } });
  input_nivel.name = 'nivel';
  input_nivel.min = '1';
  input_nivel.maxLength = input_nivel.size = 2;
  var br_nivel = document.createElement('br');
  var div = CriaDiv('classe-' + (indice || 0), 'classe');
  div.appendChild(select_classe);
  div.appendChild(span_nivel);
  div.appendChild(input_nivel);
  div.appendChild(br_nivel);
  dom.appendChild(div);
}

// Remove a classe mais recente do personagem.
function RemoveClasse() {
  var div_classes = Dom("classes");
  if (div_classes.childNodes.length == 1) {
    alert('Personagem deve ter pelo menos uma classe');
    return;
  }
  div_classes.removeChild(div_classes.lastChild);
}

// Adiciona uma nova arma a lista de equipamentos. Todos parametros sao opcionais.
// @param chave_arma opcional chave da arma sendo adicionada.
// @param obra_prima indica se a arma eh obra_prima.
// @param bonus da arma.
function AdicionaArma(chave_arma, obra_prima, bonus) {
  var id_div_equipamentos_armas = "div-equipamentos-armas";
  var div_armas = Dom(id_div_equipamentos_armas);
  var id_gerado = GeraId('div-arma', div_armas);
  var select = CriaSelect();
  select.setAttribute('name', 'arma');
  select.setAttribute('onchange', 'AtualizaGeral()');
  var tabelas = [ 
      tabelas_armas_simples, tabelas_armas_comuns, tabelas_armas_exoticas ];
  var rotulos_tabelas = [ 'Armas Simples', 'Armas Comuns', 'Armas Exóticas' ];
  for (var i = 0; i < tabelas.length; ++i) {
    var optgroup = CriaOptGroup(rotulos_tabelas[i]);
    for (var arma_corrente in tabelas[i]) {
      if (arma_corrente == 'desarmado') {
        // Desarmado eh um caso especial.
        continue;
      }
      var option = CriaOption(tabelas[i][arma_corrente].nome, arma_corrente);
      option.setAttribute('name', arma_corrente);
      option.selected = (arma_corrente == chave_arma);
      optgroup.appendChild(option);
    }
    select.appendChild(optgroup);
  }
  var span_obra_prima = CriaSpan(' OP');

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
 
  //  Criado para impedir que uma arma OP tenha bônus mágico. FC.
  if (input_obra_prima.checked == true) {
  input_bonus.value = 0;
  input_bonus.readOnly = true;
  }

  // Se obra prima estiver selecionada, ignora o bonus da arma.
  if (input_obra_prima.checked == true) {
    input_bonus.value = 0;
    input_bonus.readOnly = true;
  }

  var button_remover = CriaBotao('-');
  button_remover.setAttribute('onclick', 'ClickRemoverFilho("' + 
        id_gerado + '", "' + id_div_equipamentos_armas + '")');

  var div = CriaDiv(id_gerado);
  div.appendChild(select);
  div.appendChild(span_obra_prima);
  div.appendChild(input_obra_prima);
  div.appendChild(input_bonus);
  div.appendChild(button_remover);
  div_armas.appendChild(div);
}

// Adiciona um novo estilo de luta a planilha. Todos os parametros sao opcionais.
// @param nome_estilo: uma_arma, arma_escudo, duas_armas, arma_dupla.
// @param arma_principal nome da arma principal.
// @param arma_secundaria nome da arma secundaria.
function AdicionaEstiloLuta(nome_estilo, arma_principal, arma_secundaria) {
  var id_div_estilos_luta = 'div-estilos-luta';
  var div_estilos_luta = Dom(id_div_estilos_luta);
  var div_novo_estilo = CriaDiv();
  var id_estilo = GeraId('id-estilo', div_estilos_luta);
  var id_estilo_uma_arma =
      id_estilo.replace('id-estilo', 'id-estilo-uma-arma');
  var id_estilo_arma_escudo =
      id_estilo.replace('id-estilo', 'id-estilo-arma-escudo');
  var id_estilo_duas_armas =
      id_estilo.replace('id-estilo', 'id-estilo-duas-armas');
  var id_estilo_arma_dupla =
      id_estilo.replace('id-estilo', 'id-estilo-arma-dupla');
  var id_select_primario = 
      id_estilo.replace('id-estilo', 'id-select-primario-estilo');
  var id_select_secundario = 
      id_estilo.replace('id-estilo', 'id-select-secundario-estilo');
  var id_span_primario =
      id_estilo.replace('id-estilo', 'id-span-primario-estilo');
  var id_span_secundario =
      id_estilo.replace('id-estilo', 'id-span-secundario-estilo');

  div_novo_estilo.innerHTML = 
      '<input type="radio" name="' + id_estilo + '" id="' + id_estilo_uma_arma + 
          '" value="uma_arma" onclick="ClickEstilo(\'uma_arma\', \'' + 
          id_select_secundario + '\')" ' + 
          (nome_estilo == null || nome_estilo == 'uma_arma' ? 'checked' : '') + '>Uma arma</input>' +
      '<input type="radio" name="' + id_estilo + '" id="' + id_estilo_arma_escudo + 
          '" value="arma_escudo" onclick="ClickEstilo(\'arma_escudo\', \'' + 
          id_select_secundario + '\')" ' + 
          (nome_estilo == 'arma_escudo' ? 'checked' : '') + '>Arma + escudo</input>' +
      '<input type="radio" name="' + id_estilo + '" id="' + id_estilo_duas_armas +
          '" value="duas_armas" onclick="ClickEstilo(\'duas_armas\', \'' + 
          id_select_secundario +'\')" ' + 
          (nome_estilo == 'duas_armas' ? 'checked' : '') + '>Duas armas</input>' +
      '<input type="radio" name="' + id_estilo + '" id="' + id_estilo_arma_dupla +
          '" value="arma_dupla" onclick="ClickEstilo(\'arma_dupla\', \'' + 
          id_select_secundario +'\')" ' + 
          (nome_estilo == 'arma_dupla' ? 'checked' : '') + '>Arma dupla</input>' +
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
    option.text = arma.nome_gerado;
    if (arma_selecionada == arma.nome_gerado) {
      option.selected = true;
    }
    select_arma.options.add(option);
  }
}

// Adiciona um talento a planilha.
// @param id numero identificando o id do talento.
// @param chave_talento nome do talento sendo adicionado (opcional).
// @param complemento_talento caso o talento tenha complemento (opcional).
function AdicionaTalento(id, chave_talento, complemento) {
  var talento = tabelas_talentos[chave_talento];
  if (chave_talento == null || talento == null) {
    chave_talento = 'usar_armas_simples';
    talento = tabelas_talentos[chave_talento];
  }
  var div_select_talentos = Dom('div-select-talentos');
  var select_talento = document.createElement('select');
  select_talento.id = 'select-talento-' + id;
  select_talento.className = 'selects-talento';
  select_talento.setAttribute('onchange', 'AtualizaGeral()');
  var option_selected;
  for (var talento_tabela in tabelas_talentos) {
    var option_talento = document.createElement('option');
    option_talento.text = tabelas_talentos[talento_tabela].nome;
    option_talento.value = talento_tabela;
    option_talento.selected = chave_talento && chave_talento == talento_tabela;
    select_talento.add(option_talento, null);
  }
  var input_complemento_talento = document.createElement('input');
  input_complemento_talento.id = 'input-complemento-talento-' + id;
  input_complemento_talento.type = 'text';
  input_complemento_talento.disabled = !talento.complemento;
  input_complemento_talento.value = complemento ? complemento : '';
  input_complemento_talento.setAttribute('onchange', 'AtualizaGeral()');

  var div_select_talento = CriaDiv('div-select-talento-' + id);
  div_select_talento.appendChild(select_talento);
  div_select_talento.appendChild(input_complemento_talento);

  div_select_talentos.appendChild(div_select_talento);
}

// Cria um select com todos os aneis e um checkbox de uso.
function AdicionaAnel(div, div_pai) {
  var input_em_uso = CriaInputCheckbox(false);
  input_em_uso.name = 'em_uso';
  input_em_uso.addEventListener('change', function(e) {
      ClickAnel(e.target); });
  div.appendChild(input_em_uso);

  var select = CriaSelect();
  for (var chave_anel in tabelas_aneis) {
    select.appendChild(CriaOption(tabelas_aneis[chave_anel].nome, chave_anel));
  }
  select.addEventListener('change', AtualizaGeral);
  select.name = 'anel';
  div.appendChild(select);

  var botao_remover_anel = CriaBotao('-', null, null);
  botao_remover_anel.addEventListener('click', {
      handleEvent: function(e) {
        RemoveFilho(div, div_pai);
        AtualizaGeral();
        e.stopPropagation();
      } });
  div.appendChild(botao_remover_anel);
}
