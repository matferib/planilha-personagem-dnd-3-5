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

// Adiciona uma nova arma ou armadura a lista de equipamentos. 
// @param nome do select, 'armadura' ou 'arma' ou 'escudo'.
// @param tabelas que compoe a tabela completa de armas ou armaduras.
// @param div_pai onde a nova arma ou armadura sera adicionada.
// @return o div adicionado.
function _AdicionaArmaArmadura(nome, tabelas, rotulos_tabelas, div_pai) {
  // Tabela sera usada na compra e venda.
  var tabela;
  if (nome == 'arma') {
    tabela = tabelas_armas;
  } else if (nome == 'armadura') {
    tabela = tabelas_armaduras;
  } else if (nome == 'escudo') {
    tabela = tabelas_escudos;
  } else {
    alert('Nome invalido, esperando arma ou armadura.');
    return null;
  }

  var id_div_equipamentos = div_pai.id;
  var id_gerado = GeraId('div-' + nome, div_pai);
  var input_em_uso = null;
  if (nome == 'armadura' || nome == 'escudo') {
    input_em_uso = CriaRadio(null, null, null, nome + '-em-uso', null);
    input_em_uso.addEventListener(
        'click', 
        {
          input: input_em_uso,
          handleEvent: function(evt) {
            ClickUsarArmaduraEscudo(this.input);
          }
        }, 
        false);
  }
  var select = CriaSelect();
  select.setAttribute('name', 'select-' + nome);
  select.setAttribute('onchange', 'AtualizaGeral()');
  for (var i = 0; i < tabelas.length; ++i) {
    var optgroup = CriaOptGroup(rotulos_tabelas[i]);
    for (var corrente in tabelas[i]) {
      var option = CriaOption(tabelas[i][corrente].nome, corrente);
      option.setAttribute('name', corrente);
      option.selected = false;
      optgroup.appendChild(option);
    }
    select.appendChild(optgroup);
  }
  var span_obra_prima = CriaSpan(' OP');

  var input_obra_prima = CriaInputCheckbox(false, null, null, AtualizaGeral);
  input_obra_prima.setAttribute('name', 'obra-prima');

  var input_bonus = CriaInputNumerico(null, null, null, AtualizaGeral);
  input_bonus.setAttribute('name', 'bonus-magico');
  input_bonus.setAttribute('maxlength', 2);
  input_bonus.setAttribute('size', 2);
  input_bonus.value = 0;
  var button_remover = CriaBotao('-', null, null, {
        id:  id_gerado,
        id_div_equipamentos: id_div_equipamentos,
        handleEvent: function(evt) {
          ClickRemoverFilho(this.id, this.id_div_equipamentos);
        }
    });

  var div = CriaDiv(id_gerado);
  if (input_em_uso) {
    div.appendChild(input_em_uso);
  }
  div.appendChild(select);
  div.appendChild(span_obra_prima);
  div.appendChild(input_obra_prima);
  div.appendChild(input_bonus);
  div.appendChild(button_remover);

  var button_vender = CriaBotao('Vender', null, 'venda', {
      div:  div,
      tipo: nome,
      tabela: tabela,
      handleEvent: function(evt) {
        ClickVenderArmaArmadura(this.div, this.tipo, this.tabela);
      }
  });
  var button_comprar = CriaBotao('Comprar', null, 'compra', {
      div:  div,
      tipo: nome,
      tabela: tabela,
      handleEvent: function(evt) {
        ClickComprarArmaArmadura(this.div, this.tipo, this.tabela);
      }
  });

  div.appendChild(button_vender);
  div.appendChild(button_comprar);
  div_pai.appendChild(div);
  return div;
}

// Adiciona uma nova arma a lista de equipamentos.
// @param botao_remover se o botao remover deve ser colocado.
// @return o div adicionado.
function AdicionaArma() {
  return _AdicionaArmaArmadura(
      'arma', 
      [ tabelas_armas_simples, tabelas_armas_comuns, tabelas_armas_exoticas ], 
      [ 'Armas Simples', 'Armas Comuns', 'Armas Exóticas' ], 
      Dom('div-equipamentos-armas'));
}

// Adiciona uma nova armadura a lista de equipamentos.
// @return o div adicionado.
function AdicionaArmadura() {
  return _AdicionaArmaArmadura(
      'armadura', 
      [ tabelas_armaduras_leves, tabelas_armaduras_medias, tabelas_armaduras_pesadas ],
      [ 'Armaduras Leves', 'Armaduras Médias', 'Armaduras Pesadas' ],
      Dom('div-equipamentos-armaduras'));
}

// Adiciona um novo escudo a lista de equipamentos.
// @return o div adicionado.
function AdicionaEscudo() {
  return _AdicionaArmaArmadura(
      'escudo', 
      [ tabelas_escudos ],
      [ 'Escudos' ],
      Dom('div-equipamentos-escudos'));
}

// @return o radio do estilo.
function _CriaRadioEstilo(texto_estilo, id, nome_grupo, valor, id_select_secundario) {
  var span = CriaSpan();
  var radio = CriaRadio(texto_estilo, id, null, nome_grupo, null);
  radio.setAttribute('value', valor);
  radio.addEventListener('click', {
      valor: valor,
      id_select_secundario: id_select_secundario,
      handleEvent: function(e) {
         ClickEstilo(this.valor, this.id_select_secundario);
      }});
  span.appendChild(radio);
  span.appendChild(CriaSpan(texto_estilo));
  return span;
}

function _CriaBotaoRemoverEstilo(id_estilo, id_div_estilos_luta) {
  var botao_remover = CriaBotao('-');
  botao_remover.addEventListener('click', {
      id_estilo: id_estilo,
      id_div_estilos_luta: id_div_estilos_luta,
      handleEvent: function(e) {
        ClickRemoverFilho(this.id_estilo, this.id_div_estilos_luta);
      }});
  return botao_remover;
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
  var id_span_classe_armadura =
      id_estilo.replace('id-estilo', 'id-span-classe-armadura');

  div_novo_estilo.appendChild(_CriaRadioEstilo(
      'Uma arma', id_estilo_uma_arma, id_estilo, 'uma_arma', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      'Arma + escudo', id_estilo_arma_escudo, id_estilo, 'arma_escudo', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      'Duas armas', id_estilo_duas_armas, id_estilo, 'duas_armas', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      'Arma dupla', id_estilo_arma_dupla, id_estilo, 'arma_dupla', id_select_secundario));
  div_novo_estilo.appendChild(_CriaBotaoRemoverEstilo(id_estilo, id_div_estilos_luta));
  div_novo_estilo.appendChild(CriaBr());
  div_novo_estilo.appendChild(CriaSpan('Principal: '));
  div_novo_estilo.appendChild(CriaSelect(id_select_primario, null, AtualizaGeral));
  div_novo_estilo.appendChild(CriaSpan(null, id_span_primario));
  div_novo_estilo.appendChild(CriaBr());
  div_novo_estilo.appendChild(CriaSpan('Secundária: '));
  div_novo_estilo.appendChild(CriaSelect(id_select_secundario, AtualizaGeral));
  div_novo_estilo.appendChild(CriaSpan(null, id_span_secundario));
  div_novo_estilo.appendChild(CriaBr());
  div_novo_estilo.appendChild(CriaSpan('Classe de Armadura: '));
  div_novo_estilo.appendChild(CriaSpan(null, id_span_classe_armadura));

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

// Adiciona um talento a um div.
// @param chave_classe se o talento a ser adicionado for de classe.
// @param div_pai div onde o talento sera adicionado.
function AdicionaTalento(chave_classe, div_pai) {
  var chave_talento = 'usar_armas_simples';
  var talento = tabelas_talentos[chave_talento];
  var div_select_talentos = Dom('div-select-talentos');
  var select_talento = CriaSelect();
  select_talento.name = 'chave-talento';
  select_talento.setAttribute('onchange', 'AtualizaGeral()');
  var option_selected;
  for (var talento_tabela in tabelas_talentos) {
    var talento_option = tabelas_talentos[talento_tabela];
    if (chave_classe && !(chave_classe in talento_option)) {
      continue;
    }
    var option_talento = CriaOption(talento_option.nome, talento_tabela);
    option_talento.selected = chave_talento && chave_talento == talento_tabela;
    select_talento.add(option_talento, null);
  }
  var input_complemento_talento = CriaInputTexto('');
  input_complemento_talento.name = 'complemento-talento';
  input_complemento_talento.setAttribute('onchange', 'AtualizaGeral()');

  var div_select_talento = CriaDiv();
  div_select_talento.appendChild(select_talento);
  div_select_talento.appendChild(input_complemento_talento);

  div_pai.appendChild(div_select_talento);
  return div_select_talento;
}

// Cria um select com todos os itens do tipo e um checkbox de uso.
// Todos elementos sao criados dentro de 'div' que eh posteriormente
// adicionado a 'div_pai'.
function AdicionaItem(tipo_item, div, div_pai) {
  var input_em_uso = CriaInputCheckbox(false);
  input_em_uso.name = 'em_uso';
  input_em_uso.addEventListener('change', {
      tipo_item: tipo_item,
      handleEvent: function(e) {
        ClickUsarItem(this.tipo_item, e.target); } });
  div.appendChild(input_em_uso);

  var select = CriaSelect();
  for (var chave in tabelas_itens[tipo_item]) {
    var item = tabelas_itens[tipo_item][chave];
    select.appendChild(
        CriaOption(item.nome + ' (' + item.preco + ')', chave));
  }
  select.addEventListener('change', AtualizaGeral);
  select.name = 'item';
  div.appendChild(select);

  var botao_remover = CriaBotao('-', null, null);
  botao_remover.addEventListener('click', {
      handleEvent: function(e) {
        RemoveFilho(div, div_pai);
        AtualizaGeral();
        e.stopPropagation();
      } });
  div.appendChild(botao_remover);

  var button_vender = CriaBotao('Vender', null, 'venda', {
      div:  div,
      tabela: tabelas_itens[tipo_item],
      handleEvent: function(evt) {
        ClickVenderItem(this.div, this.tabela);
      }
  });
  var button_comprar = CriaBotao('Comprar', null, 'compra', {
      div:  div,
      tabela: tabelas_itens[tipo_item],
      handleEvent: function(evt) {
        ClickComprarItem(this.div, this.tabela);
      }
  });
  div.appendChild(button_vender);
  div.appendChild(button_comprar);

  div_pai.appendChild(div);
}
