// Tudo o que for relacionado a adicionar ou remover na planilha.

// Adiciona um div de classe ao dom passado.
function AdicionaClasse(indice, dom) {
  if (!indice) {
    indice = 0;
  }
  var select_classe = CriaSelect('select-classe-' + indice, 'selects-classes');
  select_classe.setAttribute('name', 'classe');
  select_classe.addEventListener('change', AtualizaGeral);
  var span_nivel = CriaSpan(Traduz('Nível') + ': ');
  var input_nivel = CriaInputNumerico(
      1, 'nivel-classe-' + indice, null,
      { handleEvent: function() { AtualizaGeral() } });
  input_nivel.name = 'nivel';
  input_nivel.min = '1';
  input_nivel.maxLength = input_nivel.size = 2;
  var span_nivel_conjurador = CriaSpan(Traduz('Nível de Conjurador') + ': ');
  var span_nivel_conjurador_valor = CriaSpan('', 'nivel-conjurador-' + indice);
  var br_nivel = document.createElement('br');
  var div = CriaDiv('classe-' + (indice || 0), 'classe');
  div.appendChild(select_classe);
  div.appendChild(span_nivel);
  div.appendChild(input_nivel);
  div.appendChild(span_nivel_conjurador);
  div.appendChild(span_nivel_conjurador_valor);
  div.appendChild(br_nivel);
  dom.appendChild(div);
}

// Remove a classe mais recente do personagem.
function RemoveClasse() {
  var div_classes = Dom("classes");
  if (div_classes.childNodes.length == 1) {
    Mensagem('Personagem deve ter pelo menos uma classe');
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
    Mensagem('Nome invalido, esperando arma ou armadura.');
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
  select.setAttribute('name', 'select-principal');
  select.addEventListener('change', AtualizaGeral);
  for (var i = 0; i < tabelas.length; ++i) {
    var optgroup = CriaOptGroup(rotulos_tabelas[i]);
    var items_ordenados = [];
    for (var corrente in tabelas[i]) {
      items_ordenados.push(corrente);
    }
    items_ordenados.sort(function(ie, id) {
      return Traduz(tabelas[i][ie].nome).localeCompare(Traduz(tabelas[i][id].nome));
    });
    items_ordenados.forEach(function(corrente) {
      var option = CriaOption(Traduz(tabelas[i][corrente].nome), corrente);
      option.setAttribute('name', corrente);
      option.selected = false;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  }

  var select_material = CriaSelect();
  select_material.setAttribute('name', 'select-material');
  select_material.addEventListener('change', AtualizaGeral);
  for (var corrente in tabelas_materiais_especiais) {
    var option = CriaOption(Traduz(tabelas_materiais_especiais[corrente].nome), corrente);
    option.selected = false;
    select_material.appendChild(option);
  }


  var span_obra_prima = CriaSpan(Traduz(' OP'));

  var input_obra_prima = CriaInputCheckbox(false, null, null, AtualizaGeral);
  input_obra_prima.setAttribute('name', 'obra-prima');

  var input_bonus = CriaInputNumerico(null, null, null, AtualizaGeral);
  input_bonus.setAttribute('name', 'bonus-magico');
  input_bonus.setAttribute('maxlength', 2);
  input_bonus.setAttribute('size', 2);
  input_bonus.value = 0;
  TituloSimples(Traduz('bonus mágico'), input_bonus);
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
  div.appendChild(select_material);
  div.appendChild(span_obra_prima);
  div.appendChild(input_obra_prima);
  div.appendChild(input_bonus);
  div.appendChild(button_remover);

  var button_vender = CriaBotao(Traduz('Vender'), null, 'venda', {
      div:  div,
      tipo: nome,
      tabela: tabela,
      handleEvent: function(evt) {
        ClickVenderArmaArmadura(this.div, this.tipo, this.tabela);
      }
  });
  var button_comprar = CriaBotao(Traduz('Comprar'), null, 'compra', {
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
      [ Traduz('Armas Simples'), Traduz('Armas Comuns'), Traduz('Armas Exóticas') ],
      Dom('div-equipamentos-armas'));
}

// Adiciona uma nova armadura a lista de equipamentos.
// @return o div adicionado.
function AdicionaArmadura() {
  return _AdicionaArmaArmadura(
      'armadura',
      [ tabelas_armaduras_leves, tabelas_armaduras_medias, tabelas_armaduras_pesadas ],
      [ Traduz('Armaduras Leves'), Traduz('Armaduras Médias'), Traduz('Armaduras Pesadas') ],
      Dom('div-equipamentos-armaduras'));
}

// Adiciona um novo escudo a lista de equipamentos.
// @return o div adicionado.
function AdicionaEscudo() {
  return _AdicionaArmaArmadura(
      'escudo',
      [ tabelas_escudos ],
      [ Traduz('Escudos') ],
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
function AdicionaEstiloLuta() {
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
  var id_estilo_rajada =
      id_estilo.replace('id-estilo', 'id-estilo-rajada');
  var id_estilo_tiro_rapido =
      id_estilo.replace('id-estilo', 'id-estilo-tiro-rapido');
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
      Traduz('Uma Arma'), id_estilo_uma_arma, id_estilo, 'uma_arma', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      Traduz('Arma + Escudo'), id_estilo_arma_escudo, id_estilo, 'arma_escudo', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      Traduz('Duas Armas'), id_estilo_duas_armas, id_estilo, 'duas_armas', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      Traduz('Arma Dupla'), id_estilo_arma_dupla, id_estilo, 'arma_dupla', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      Traduz('Rajada de Golpes'), id_estilo_rajada, id_estilo, 'rajada', id_select_secundario));
  div_novo_estilo.appendChild(_CriaRadioEstilo(
      Traduz('Tiro Rápido'), id_estilo_tiro_rapido, id_estilo, 'tiro_rapido', id_select_secundario));

  div_novo_estilo.appendChild(_CriaBotaoRemoverEstilo(id_estilo, id_div_estilos_luta));
  div_novo_estilo.appendChild(CriaBr());
  div_novo_estilo.appendChild(CriaSpan(Traduz('Principal') + ': ', null, 'estilo-rotulo'));
  div_novo_estilo.appendChild(CriaSelect(id_select_primario, 'estilo-selecao', AtualizaGeral));
  div_novo_estilo.appendChild(CriaSpan(null, id_span_primario));
  div_novo_estilo.appendChild(CriaBr());
  div_novo_estilo.appendChild(CriaSpan(Traduz('Secundária') + ': ', null, 'estilo-rotulo'));
  div_novo_estilo.appendChild(CriaSelect(id_select_secundario, 'estilo-selecao', AtualizaGeral));
  div_novo_estilo.appendChild(CriaSpan(null, id_span_secundario));
  div_novo_estilo.appendChild(CriaBr());
  div_novo_estilo.appendChild(CriaSpan(Traduz('Classe de Armadura') + ': '));
  div_novo_estilo.appendChild(CriaSpan(null, id_span_classe_armadura));

  // Popula os selects.
  for (var i = 0; i < div_novo_estilo.childNodes.length; ++i) {
    var filho = div_novo_estilo.childNodes[i];
    if (filho.tagName == 'SELECT') {
      if (filho.id == id_select_primario) {
        AdicionaArmasAoEstilo(filho, 'desarmado');
      } else {
        AdicionaArmasAoEstilo(filho, 'desarmado');
        filho.disabled = true;
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
  for (var i = 0; i < gPersonagem.armas.length; ++i) {
    var arma = gPersonagem.armas[i];
    var option = document.createElement('option');
    option.setAttribute('name', arma.nome_gerado);
    option.setAttribute('value', arma.nome_gerado);
    option.text = arma.texto_nome;
    if (arma_selecionada == arma.nome_gerado) {
      option.selected = true;
    }
    select_arma.options.add(option);
  }
}

// Adiciona um talento a um div.
// @param indice_talento o indice do talento. Bom para talentos especificos por nivel (tipo monge).
// @param chave_classe se o talento a ser adicionado for de classe.
// @param div_pai div onde o talento sera adicionado.
// @return o div com o dom do talento.
function AdicionaTalento(indice_talento, chave_classe, div_pai) {
  var div_select_talentos = Dom('div-select-talentos');
  var select_talento = CriaSelect(null, 'select-talento');
  select_talento.name = 'chave-talento';
  select_talento.addEventListener('change', AtualizaGeral);
  var talentos_ordenados = [];
  var eh_classe = chave_classe != 'outros' && chave_classe != 'gerais';
  for (var chave_talento in tabelas_talentos) {
    var talento_tabela = tabelas_talentos[chave_talento];
    if (eh_classe && !(chave_classe in talento_tabela)) {
      continue;
    }
    // Monge eh limitado por nivel.
    if (chave_classe == 'monge') {
      if ((indice_talento == 0 && talento_tabela.monge != 1) ||
          (indice_talento == 1 && talento_tabela.monge != 2) ||
          (indice_talento == 2 && talento_tabela.monge != 6)) {
        continue;
      }
    }
    // Ranger eh limitado por nivel.
    if (chave_classe == 'ranger') {
      if ((indice_talento == 0 && talento_tabela.ranger != 2) ||
          (indice_talento == 1 && talento_tabela.ranger != 6) ||
          (indice_talento == 2 && talento_tabela.ranger != 11)) {
        continue;
      }
    }
    talentos_ordenados.push(chave_talento);
  }
  talentos_ordenados.sort(function(te, td) {
    return Traduz(tabelas_talentos[te].nome).localeCompare(Traduz(tabelas_talentos[td].nome));
  });
  talentos_ordenados.forEach(function(chave_talento) {
    var talento_tabela = tabelas_talentos[chave_talento];
    var option_talento = CriaOption(Traduz(talento_tabela.nome), chave_talento);
    option_talento.selected = chave_talento == 'outros';
    select_talento.add(option_talento, null);
  });
  var input_complemento_talento = CriaInputTexto('', null, 'input-complemento-talento');
  input_complemento_talento.name = 'complemento-talento';
  input_complemento_talento.addEventListener('change', AtualizaGeral);

  var div_select_talento = CriaDiv();
  div_select_talento.appendChild(select_talento);
  div_select_talento.appendChild(input_complemento_talento);
  if (chave_classe == 'outros') {
    div_select_talento.appendChild(
        CriaBotao('-', null, null, ClickRemoverTalento.bind(null, indice_talento)));
  }

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
  var items_ordenados = [];
  var tabela_item = tabelas_itens[tipo_item].tabela;
  for (var chave in tabela_item) {
    items_ordenados.push({ chave_item: chave, valor_item: tabela_item[chave] });
  }
  items_ordenados.sort(function(ie, id) {
    return Traduz(ie.valor_item.nome).localeCompare(Traduz(id.valor_item.nome));
  });
  items_ordenados.forEach(function(item) {
    select.appendChild(
        CriaOption(Traduz(item.valor_item.nome) + ' (' + TraduzDinheiro(item.valor_item.preco) + ')', item.chave_item));
  });
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

  var button_vender = CriaBotao(Traduz('Vender'), null, 'venda', {
      div:  div,
      tabela: tabela_item,
      handleEvent: function(evt) {
        ClickVenderItem(this.div, this.tabela);
      }
  });
  var button_comprar = CriaBotao(Traduz('Comprar'), null, 'compra', {
      div:  div,
      tabela: tabela_item,
      handleEvent: function(evt) {
        ClickComprarItem(this.div, this.tabela);
      }
  });
  div.appendChild(button_vender);
  div.appendChild(button_comprar);

  div_pai.appendChild(div);
}

function AdicionaEsqueletoFeiticoParaClasse(chave_classe, div_feiticos) {
  var id_div = 'div-feiticos-' + chave_classe;
  var div_classe = CriaDiv(id_div, 'div-feiticos-classe');
  div_classe.appendChild(CriaSpan(Traduz('Feitiços de ') + Traduz(tabelas_classes[chave_classe].nome)));
  // Escolas proibidas.
  var num_escolas_proibidas = tabelas_feiticos[chave_classe].num_escolas_proibidas;
  if (num_escolas_proibidas > 0) {
    var div_escolas_proibidas = CriaDiv('div-escolas-proibidas-' + chave_classe);
    div_escolas_proibidas.appendChild(CriaSpan(Traduz('Escolas Proibidas')));
    div_escolas_proibidas.appendChild(CriaBr());
    for (var i = 0; i < num_escolas_proibidas; ++i) {
      var input = CriaInputTexto('', 'div-escola-proibida-' + chave_classe + '-' + i, 'escolas-proibidas');
      input.addEventListener('change', ChangeEscolaProibida.bind(null, chave_classe, i, input), false);
      div_escolas_proibidas.appendChild(input);
      div_escolas_proibidas.appendChild(CriaBr());
    }
    div_classe.appendChild(div_escolas_proibidas);
  }
  // Esqueletos dos conhecidos.
  var div_conhecidos_pai = CriaDiv('div-feiticos-conhecidos-' + chave_classe);
  div_conhecidos_pai.appendChild(CriaSpan(Traduz('Feitiços conhecidos')));
  // Aqui serao adicionados os conhecidos.
  div_conhecidos_pai.appendChild(CriaDiv('div-feiticos-conhecidos-' + chave_classe + '-por-nivel'));
  div_classe.appendChild(div_conhecidos_pai);
  // Esqueleto dos slots.
  var div_slots = CriaDiv('div-feiticos-slots-' + chave_classe);
  div_slots.appendChild(CriaSpan(Traduz('Feitiços por Dia')));
  div_classe.appendChild(div_slots);

  // Adiciona a classe no div de feiticos.
  div_feiticos.appendChild(div_classe);
}

// Adiciona um nivel de feitico conhecido.
function AdicionaNivelFeiticoConhecido(
    chave_classe, precisa_conhecer, div_conhecidos, indice_filho) {
  var nivel = indice_filho + (tabelas_feiticos[chave_classe].possui_nivel_zero ? 0 : 1);
  var feiticos_conhecidos =
      gPersonagem.feiticos[chave_classe].conhecidos[nivel];
  // Se não precisa conhecer, o jogador pode adicionar feiticos como se fosse um grimório.
  if (feiticos_conhecidos.length == 0 && precisa_conhecer) {
    return;
  }
  var div_nivel = CriaDiv();
  div_nivel.appendChild(CriaSpan(Traduz('Nível') + ' ' + nivel + ':'));
  if (!precisa_conhecer) {
    div_nivel.appendChild(CriaBotao('+', null, null, function() {
      if (gEntradas.feiticos_conhecidos[chave_classe] == null) {
        gEntradas.feiticos_conhecidos[chave_classe] = {};
      }
      if (gEntradas.feiticos_conhecidos[chave_classe][nivel] == null) {
        gEntradas.feiticos_conhecidos[chave_classe][nivel] = [];
      }
      gEntradas.feiticos_conhecidos[chave_classe][nivel].push('');
      AtualizaGeralSemLerEntradas();
    }));
  }
  div_nivel.appendChild(CriaBr());
  div_nivel.appendChild(CriaDiv('div-feiticos-conhecidos-' + chave_classe + '-' + nivel));
  div_conhecidos.appendChild(div_nivel);
}

// Adiciona um div com os feiticos conhecidos. Usada pelo AjustaFilhos, que preenche o indice.
function AdicionaFeiticoConhecido(chave_classe, nivel, indice) {
  Dom('div-feiticos-conhecidos-' + chave_classe + '-' + nivel).appendChild(
      CriaDomFeiticoConhecido(chave_classe, nivel, indice));
}

// Adiciona um dom com o slot de feitico. Usada pelo AjustaFilhos, que preenche o indice.
function AdicionaSlotFeitico(div_nivel_slots, precisa_memorizar, chave_classe, nivel, slots, indice) {
  div_nivel_slots.appendChild(
      CriaDomSlotFeitico(precisa_memorizar, chave_classe, nivel, indice, slots));
}

function AdicionaHabilidadeEspecial(chave_especial, dom_especiais) {
  var dom_especial = CriaDiv('habilidade-especial-' + chave_especial);
  dom_especial.textContent = Traduz(tabelas_especiais[chave_especial].nome);
  var especial_personagem = gPersonagem.especiais[chave_especial];
  for (var i = 0; i < especial_personagem.vezes; ++i) {
    dom_especial.appendChild(CriaInputCheckbox(false, null, null, ClickHabilidadeEspecial));
  }
  dom_especiais.appendChild(dom_especial);
  return dom_especial;
}

function AdicionaImunidade(imunidade, dom_imunidades) {
  var dom_imunidade = CriaDiv('imunidade-' + imunidade);
  dom_imunidade.textContent = imunidade;
  dom_imunidades.appendChild(dom_imunidade);
}

function AdicionaResistenciaMagia(chave, valor, dom_resistencias) {
  var dom_rm = CriaDiv('resistencia-magia-' + chave);
  dom_rm.textContent = chave + ': ' + valor;
  dom_resistencias.appendChild(dom_rm);
}
