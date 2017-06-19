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
// Todas as funcoes de atualizacao dos campos da interface.
// Idealmente, nao deve haver nenhuma referencia a gEntradas neste arquivo,
// exceto na chamada AtualizaGeral.

// Quase sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha. Ela lera as gEntradas, convertendo-nas e em seguida atualizara
// os diversos elementos da planilha.
function AtualizaGeral() {
  // Apenas le as gEntradas para a estrutura de gEntradas.
  LeEntradas();
  // converte a estrutura de gEntradas para a de personagem.
  ConverteEntradasParaPersonagem();
  PersonagemLimpaPericias();
  DependenciasGerais();
  _AtualizaGeral();
  gEstado.Salva(JSON.stringify(gEntradas));
}

// AVISO:
// Essa funcao eh bem perigosa. Varios botoes atualizam o personagem mas nao os objetos de gEntradas.
// Portanto, se essa funcao for chamada nesse intervalo onde personagem e gEntradas ficam fora de
// sincronismo, o personagem sera revertido para a versao das gEntradas (por exemplo, apos gerar um
// personagem, tentar adicionar algo em gEntradas e chamar essa funcao vai zerar o personagem).
//
// Sempre que for necessaria uma atualizacao sem leitura de gEntradas, essa funcao sera chamada.
// Eh o caso de elementos criados de forma independente (armas, estilos) que devem ser adicionados
// manualmente a entrada e em seguida chamam essa funcao. As funcoes de carregamento tambem
// devem usar esta funcao, pois a entrada que eh salva.
function AtualizaGeralSemLerEntradas() {
  PersonagemLimpaGeral();
  ConverteEntradasParaPersonagem();
  DependenciasGerais();
  _AtualizaGeral();
  gEstado.Salva(JSON.stringify(gEntradas));
}

// Esta atualizacao eh usada quando se tem o personagem pronto, sem ser necessaria a leitura das
// gEntradas.
function AtualizaGeralSemConverterEntradas() {
  DependenciasGerais();
  _AtualizaGeral();
}

// Apenas atualizacoes a planilha a partir do personagem, sem leitura de gEntradas.
function _AtualizaGeral() {
  _AtualizaNomeRacaAlinhamentoXp();
  _AtualizaDadosVida();
  _AtualizaPontosVida();
  _AtualizaAtributos();
  _AtualizaClasses();
  _AtualizaDominios();
  _AtualizaFamiliar();
  _AtualizaCompanheiroAnimal();
  _AtualizaTamanho();
  _AtualizaModificadoresAtributos();
  _AtualizaIniciativa();
  _AtualizaAtaque();
  _AtualizaEstilosLuta();
  _AtualizaSalvacoes();
  _AtualizaHabilidadesEspeciais();
  _AtualizaImunidades();
  _AtualizaResistenciaMagia();
  _AtualizaTalentos();
  _AtualizaProficienciaArmas();
  _AtualizaPericias();
  _AtualizaListaArmas();
  _AtualizaListaArmaduras();
  _AtualizaListaEscudos();
  _AtualizaEquipamentos();
  _AtualizaFeiticos();
  _AtualizaNotas();
  _AtualizaModoVisao();
}

function _AtualizaNomeRacaAlinhamentoXp() {
  Dom('nome').value = gPersonagem.nome;
  document.title = gPersonagem.nome.length > 0 ? gPersonagem.nome : 'anonimo';
  SelecionaValor(gPersonagem.raca, Dom('raca'));
  SelecionaValor(gPersonagem.template, Dom('template'));
  SelecionaValor(gPersonagem.alinhamento, Dom('alinhamento'));
  Dom('pontos-experiencia').value = gPersonagem.experiencia;
  Dom('divindade-patrona').value = gPersonagem.divindade;
}

// Atualiza os dados de vida do personagem de acordo com as classes.
function _AtualizaDadosVida() {
  var span_dados = Dom('dados-vida-classes');
  span_dados.textContent =
      gPersonagem.dados_vida.nivel_personagem + ' = ' + PersonagemStringDadosVida();
}

// Atualiza as informacoes referentes a pontos de vida do personagem.
function _AtualizaPontosVida() {
  // O valor dos ferimentos deve ser <= 0.
  var pontos_vida_corrente =
      gPersonagem.pontos_vida.total_dados + gPersonagem.pontos_vida.bonus.Total() + gPersonagem.pontos_vida.temporarios
      - gPersonagem.pontos_vida.ferimentos - gPersonagem.pontos_vida.ferimentos_nao_letais;
  ImprimeNaoSinalizado(
      pontos_vida_corrente, Dom('pontos-vida-corrente'));
  Dom('pontos-vida-dados').value = gPersonagem.pontos_vida.total_dados ?
      gPersonagem.pontos_vida.total_dados : '';
  ImprimeSinalizado(
      gPersonagem.pontos_vida.bonus.Total(), Dom('pontos-vida-bonus'), false);
  ImprimeSinalizado(
      gPersonagem.pontos_vida.temporarios, Dom('pontos-vida-temporarios'), false);
  ImprimeSinalizado(
      -gPersonagem.pontos_vida.ferimentos, Dom('ferimentos'), false);
  ImprimeSinalizado(
      -gPersonagem.pontos_vida.ferimentos_nao_letais, Dom('ferimentos-nao-letais'), false);

  // Companheiro animal.
  if (gPersonagem.canimal != null) {
    Dom('pontos-vida-base-canimal').value = gPersonagem.canimal.pontos_vida.base;
    Dom('pontos-vida-temporarios-canimal').value = gPersonagem.canimal.pontos_vida.temporarios;
    var pontos_vida_canimal = gPersonagem.canimal.pontos_vida;
    ImprimeSinalizado(-pontos_vida_canimal.ferimentos, Dom('ferimentos-canimal'), false);
    ImprimeSinalizado(-pontos_vida_canimal.ferimentos_nao_letais, Dom('ferimentos-nao-letais-canimal'), false);
    var pontos_vida_corrente_canimal =
        pontos_vida_canimal.base + pontos_vida_canimal.bonus.Total() + pontos_vida_canimal.temporarios
        - pontos_vida_canimal.ferimentos - pontos_vida_canimal.ferimentos_nao_letais;
    Dom('pontos-vida-corrente-canimal').textContent = pontos_vida_corrente_canimal;
    Dom('notas-canimal').textContent = gPersonagem.canimal.notas;
    Dom('canimal-raca').value = gPersonagem.canimal.raca;
  }

  // Familiar.
  if (gPersonagem.familiar == null ||
      !(gPersonagem.familiar.chave in tabelas_familiares) ||
      !gPersonagem.familiar.em_uso) {
    return;
  }
  Dom('pontos-vida-base-familiar').textContent = gPersonagem.familiar.pontos_vida.base;
  Dom('pontos-vida-temporarios-familiar').value = gPersonagem.familiar.pontos_vida.temporarios;
  var pontos_vida_familiar = gPersonagem.familiar.pontos_vida;
  ImprimeSinalizado(-pontos_vida_familiar.ferimentos, Dom('ferimentos-familiar'), false);
  ImprimeSinalizado(-pontos_vida_familiar.ferimentos_nao_letais, Dom('ferimentos-nao-letais-familiar'), false);
  var pontos_vida_corrente_familiar =
      pontos_vida_familiar.base + pontos_vida_familiar.bonus.Total() + pontos_vida_familiar.temporarios
      - pontos_vida_familiar.ferimentos - pontos_vida_familiar.ferimentos_nao_letais;
  Dom('pontos-vida-corrente-familiar').textContent = pontos_vida_corrente_familiar;
}

function _AtualizaAtributos() {
  // Botoes de atributos.
  var botoes_atributos = DomsPorClasse('botoes-atributos');
  for (var i = 0; i < botoes_atributos.length; ++i) {
    if (gPersonagem.atributos.pontos.gastos.length <
        gPersonagem.atributos.pontos.disponiveis) {
      // habilita botoes de atributos.
      botoes_atributos[i].style.display = 'inline';
    } else {
      // desabilita botoes de atributos.
      botoes_atributos[i].style.display = 'none';
    }
  }
  var botao_atributo_menos = Dom('botao-atributos-menos');
  if (gPersonagem.atributos.pontos.gastos.length > 0) {
    botao_atributo_menos.style.display = 'inline';
  } else {
    botao_atributo_menos.style.display = 'none';
  }
  // Bonus gastos.
  var string_gastos = '';
  for (var i = 0; i < gPersonagem.atributos.pontos.gastos.length; ++i) {
    string_gastos += tabelas_atributos[gPersonagem.atributos.pontos.gastos[i]];
    if (i < gPersonagem.atributos.pontos.gastos.length - 1) {
      string_gastos += ', ';
    }
  }
  Dom('pontos-atributos-gastos').textContent = string_gastos;
  Dom('pontos-atributos-total').textContent =
      gPersonagem.atributos.pontos.disponiveis;

  // Os atributos base.
  var div_atributos = Dom('div-stats');
  var atributos = [
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    var atributo = atributos[i];
    var input_atributo = Dom(atributo + '-valor-base');
    input_atributo.value = gPersonagem.atributos[atributo].bonus.Le('base');
  }
}

// Torna todas as classes exceto a ultima desabilitadas.
// Remove classes sobrando e adiciona faltantes.
function _AtualizaClasses() {
  var classes_desabilitadas = [];
  var div_classes = Dom('classes');
  var divs_classes = DomsPorClasse('classe');
  var maior_indice = divs_classes.length > gPersonagem.classes.length ?
      divs_classes.length : gPersonagem.classes.length;
  for (var i = 0; i < maior_indice; ++i) {
    var div_classe = divs_classes[i];
    if (i < gPersonagem.classes.length) {
      if (!div_classe) {
        AdicionaClasse(i, div_classes);
      }
      _AtualizaClasse(
          classes_desabilitadas, gPersonagem.classes[i].classe,
          gPersonagem.classes[i].nivel, gPersonagem.classes[i].nivel_conjurador, i);
      classes_desabilitadas.push(gPersonagem.classes[i].classe);
    } else {
      RemoveFilho(div_classe.id, div_classes);
    }
  }

  // Desabilita selects.
  var selects_classes = DomsPorClasse('selects-classes');
  for (var i = 0; i < selects_classes.length - 1; ++i) {
    selects_classes[i].disabled = true;
  }
  selects_classes[selects_classes.length - 1].disabled = false;
}

function _AtualizaDominios() {
  if (PersonagemNivelClasse('clerigo') == 0) {
    Dom('span-dominios').style.display = 'none';
  } else {
    Dom('span-dominios').style.display = 'inline';
    for (var i = 0; i < 2; ++i) {
      var dom = Dom('dominio-' + i);
      SelecionaValor(gPersonagem.dominios[i], dom);
      // Hack de traducao de dominio. Os textos sao muito grandes para usar como chave.
      var chave_trad = 'desc-dom-' + gPersonagem.dominios[i];
      var trad = Traduz(chave_trad);
      if (trad != chave_trad) {
        TituloSimples(trad, dom);
      } else {
        TituloSimples(
            tabelas_dominios[gPersonagem.dominios[i]].descricao ? tabelas_dominios[gPersonagem.dominios[i]].descricao : '',
            dom);
      }
    }
  }
}

function _AtualizaFamiliar() {
  if (PersonagemNivelClasse('feiticeiro') == 0 &&
      !PersonagemTemNivelMago()) {
    Dom('familiar').style.display = 'none';
  } else {
    Dom('familiar').style.display = 'block';
    Dom('familiar-em-uso').checked = gPersonagem.familiar.em_uso;
    SelecionaValor(gPersonagem.familiar.chave, Dom('select-familiar'));
    // Pontos de vida na funcao de pontos de vida.
  }
}

function _AtualizaCompanheiroAnimal() {
  if (PersonagemNivelClasse('ranger') == 0 &&
      PersonagemNivelClasse('druida') == 0) {
    Dom('canimal').style.display = 'none';
  } else {
    Dom('canimal').style.display = 'block';
    // Pontos de vida na funcao de pontos de vida.
  }
}

// Atualiza uma classe.
function _AtualizaClasse(classes_desabilitadas, classe, nivel, nivel_conjurador, indice) {
  var select_classe = Dom('select-classe-' + indice);
  select_classe.options.length = 0;
  var options = [];
  for (var chave_classe in tabelas_classes) {
    if (tabelas_classes[chave_classe].mestre && !gPersonagem.modo_mestre) {
      // So adiciona as classes de mestre se estiver no modo mestre.
      continue;
    }
    var desabilitar_classe = false;
    for (var j = 0; j < classes_desabilitadas.length; ++j) {
      if (chave_classe == classes_desabilitadas[j]) {
        desabilitar_classe = true;
        break;
      }
    }
    if (desabilitar_classe) {
      // Nao adiciona classe desabilitada.
      continue;
    }
    var option = CriaOption(Traduz(tabelas_classes[chave_classe].nome), chave_classe);
    option.setAttribute('name', chave_classe);
    option.selected = (chave_classe == classe) && !desabilitar_classe;
    option.disabled = desabilitar_classe;
    options.push(option);
  }
  options.sort(function(oe, od) {
    return Traduz(oe.text).localeCompare(od.text);
  });
  options.forEach(function(option) {
    select_classe.appendChild(option);
  });
  Dom('nivel-classe-' + indice).value = nivel;
  Dom('nivel-conjurador-' + indice).textContent = nivel_conjurador;
}

// Atualiza o tamanho em funcao da raca.
function _AtualizaTamanho() {
  // Busca o modificador de tamanho da raca.
  ImprimeSinalizado(
      gPersonagem.tamanho.modificador_ataque_defesa,
      DomsPorClasse('tamanho-mod-ataque-defesa'));
  ImprimeSinalizado(
      gPersonagem.tamanho.modificador_agarrar,
      DomsPorClasse('tamanho-mod-agarrar'));
  SelecionaValor(PersonagemTamanhoRaca(), Dom('tamanho'));
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car),
// a raca, class etc.
function _AtualizaModificadoresAtributos() {
  // busca a raca e seus modificadores.
  var modificadores_raca = tabelas_raca[gPersonagem.raca].atributos;

  // Busca cada elemento das estatisticas e atualiza modificadores.
  var atributos = [
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    var atributo = atributos[i];
    // Valor do bonus sem base.
    var dom_bonus = Dom(atributo + '-mod-bonus');
    ImprimeSinalizado(gPersonagem.atributos[atributo].bonus.Total(['base']), dom_bonus, false);
    Titulo(gPersonagem.atributos[atributo].bonus.Exporta(['base']), dom_bonus);

    // Escreve o valor total.
    var dom_valor = Dom(atributo + '-valor-total');
    ImprimeNaoSinalizado(gPersonagem.atributos[atributo].bonus.Total(), dom_valor);
    Titulo(gPersonagem.atributos[atributo].bonus.Exporta(), dom_valor);

    // Escreve o modificador.
    ImprimeSinalizado(
        gPersonagem.atributos[atributo].modificador,
        DomsPorClasse(atributo + '-mod-total'));
  }
}

function _AtualizaIniciativa() {
  var span_iniciativa = Dom('iniciativa');
  ImprimeSinalizado(gPersonagem.iniciativa.Total(), span_iniciativa);
  Titulo(gPersonagem.iniciativa.Exporta(), span_iniciativa);
}

// Atualiza os diversos tipos de ataques lendo a classe e os modificadores relevantes.
function _AtualizaAtaque() {
  ImprimeSinalizado(gPersonagem.bba, DomsPorClasse('bba'));
  ImprimeNaoSinalizado(gPersonagem.numero_ataques,
                       DomsPorClasse('numero-ataques'));
  // Corpo a corpo.
  var span_bba_cac = Dom('bba-corpo-a-corpo');
  ImprimeSinalizado(gPersonagem.bba_cac, span_bba_cac);
  var titulo_span_bba_cac = {};
  titulo_span_bba_cac[Traduz('bba')] = gPersonagem.bba;
  titulo_span_bba_cac[Traduz('força')] = gPersonagem.atributos['forca'].modificador;
  titulo_span_bba_cac[Traduz('tamanho')] = gPersonagem.tamanho.modificador_ataque_defesa;
  TituloChaves(titulo_span_bba_cac, span_bba_cac);

  // Distancia.
  var span_bba_distancia = Dom('bba-distancia');
  ImprimeSinalizado(gPersonagem.bba_distancia, span_bba_distancia);
  var titulo_span_bba_distancia = {};
  titulo_span_bba_distancia[Traduz('bba')] = gPersonagem.bba;
  titulo_span_bba_distancia[Traduz('destreza')] = gPersonagem.atributos['destreza'].modificador;
  titulo_span_bba_distancia[Traduz('tamanho')] = gPersonagem.tamanho.modificador_ataque_defesa;
  TituloChaves(titulo_span_bba_distancia, span_bba_distancia);

  // Agarrar
  var span_bba_agarrar = Dom('bba-agarrar');
  ImprimeSinalizado(gPersonagem.agarrar, span_bba_agarrar);
  var titulo_span_bba_agarrar = {};
  titulo_span_bba_agarrar[Traduz('bba')] = gPersonagem.bba;
  titulo_span_bba_agarrar[Traduz('força')] = gPersonagem.atributos['forca'].modificador;
  titulo_span_bba_agarrar[Traduz('tamanho especial')] = gPersonagem.tamanho.modificador_agarrar;
  TituloChaves(titulo_span_bba_agarrar, span_bba_agarrar);
}

// Atualiza a lista de armas de cada estilo.
function _AtualizaEstilosLuta() {
  var dom_estilos = Dom('div-estilos-luta');
  AjustaFilhos(dom_estilos, gPersonagem.estilos_luta.length, function(indice_filho) {
    AdicionaEstiloLuta(gPersonagem.estilos_luta[indice_filho].nome);
  });
  // Atualiza os valores dos estilos. Neste ponto,
  // dom_filhos.length == gPersonagem.estilos_luta.length.
  var dom_filhos = dom_estilos.childNodes;
  for (var i = 0; i < gPersonagem.estilos_luta.length; ++i) {
    _AtualizaEstilo(dom_filhos[i], gPersonagem.estilos_luta[i]);
  }
}

// Usada por _AtualizaEstilosLuta.
// @param div_estilo o div do estilo.
// @param estilo no personagem.
function _AtualizaEstilo(div_estilo, estilo) {
  var id_estilo = div_estilo.id;

  var id_radio =
    id_estilo.replace('id-estilo', 'id-estilo-' + estilo.nome.replace('_', '-'));
  Dom(id_radio).checked = true;

  var id_span_primario =
      id_estilo.replace('id-estilo', 'id-span-primario-estilo');
  var id_select_primario =
      id_estilo.replace('id-estilo', 'id-select-primario-estilo');
  var id_span_classe_armadura =
      id_estilo.replace('id-estilo', 'id-span-classe-armadura');
  var arma_primaria = ArmaPersonagem(estilo.arma_primaria.nome);
  AdicionaArmasAoEstilo(Dom(id_select_primario),
                        estilo.arma_primaria.nome);
  _AtualizaArmaEstilo(arma_primaria, true, estilo,
                      Dom(id_span_primario));

  var id_span_secundario =
    id_estilo.replace('id-estilo', 'id-span-secundario-estilo');
  if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    var id_select_secundario =
        id_estilo.replace('id-estilo', 'id-select-secundario-estilo');
    var arma_secundaria = ArmaPersonagem(estilo.arma_secundaria.nome);
    AdicionaArmasAoEstilo(Dom(id_select_secundario),
                          estilo.arma_secundaria.nome);
    _AtualizaArmaEstilo(arma_secundaria, false, estilo,
                        Dom(id_span_secundario));
  } else {
    Dom(id_span_secundario).textContent = '';
  }
  _AtualizaClasseArmaduraEstilo(estilo.nome, Dom(id_span_classe_armadura));
}

// Atualiza o span de uma arma no estilo de luta com seus valores de ataque e defesa
// @param arma do personagem.
// @param primaria booleano indicando se a arma eh primaria ou secundaria.
// @param estilo de luta cuja arma esta sendo atualizada.
// @param span_arma o dom da arma, que eh um span.
function _AtualizaArmaEstilo(arma, primaria, estilo, span_arma) {
  span_arma.textContent = GeraResumoArmaEstilo(arma, primaria, estilo);
}

// Atualiza o span de classe de armadura do estilo.
function _AtualizaClasseArmaduraEstilo(nome_estilo, span_classe_armadura) {
  var usar_escudo = (nome_estilo == 'arma_escudo');
  RemoveFilhos(span_classe_armadura);
  var tem_esquiva = PersonagemPossuiTalento('esquiva');
  // AC normal.
  var span_ca_normal = CriaSpan();
  var array_exclusao = usar_escudo ? [] : ['escudo', 'escudo_melhoria'];
  ImprimeNaoSinalizado(
      10 + gPersonagem.ca.bonus.Total(array_exclusao),
      span_ca_normal);
  Titulo(gPersonagem.ca.bonus.Exporta(array_exclusao), span_ca_normal);
  span_classe_armadura.appendChild(span_ca_normal);
  if (tem_esquiva) {
    var dom_falso = { textContent: '' };
    array_exclusao.push('esquiva');
    ImprimeNaoSinalizado(
        10 + gPersonagem.ca.bonus.Total(array_exclusao),
        dom_falso);
    span_ca_normal.textContent += ' (' + Traduz('sem esquiva') + ': ' + dom_falso.textContent + ')';
  }
  span_ca_normal.textContent += ', ';
  // AC toque.
  var span_ca_toque = CriaSpan();
  array_exclusao =
    ['armadura', 'escudo', 'armadura_melhoria', 'escudo_melhoria', 'armadura_natural'];
  ImprimeNaoSinalizado(
      10 + gPersonagem.ca.bonus.Total(array_exclusao),
      span_ca_toque);
  Titulo(
      gPersonagem.ca.bonus.Exporta(array_exclusao),
      span_ca_toque);
  span_ca_toque.textContent = Traduz('Toque') + ': ' + span_ca_toque.textContent;
  if (tem_esquiva) {
    var dom_falso = { textContent: '' };
    array_exclusao.push('esquiva');
    ImprimeNaoSinalizado(
        10 + gPersonagem.ca.bonus.Total(array_exclusao),
        dom_falso);
    span_ca_toque.textContent += ' (' + Traduz('sem esquiva') + ': ' + dom_falso.textContent + ')';
  }
  span_classe_armadura.appendChild(span_ca_toque);
  // AC surpreso.
  var span_ca_surpreso = CriaSpan();
  array_exclusao = PersonagemPossuiHabilidadeEspecial('esquiva_sobrenatural') ? [] : ['atributo'];
  if (!usar_escudo) {
    array_exclusao.push('escudo');
    array_exclusao.push('escudo_melhoria');
  }
  ImprimeNaoSinalizado(
      10 + gPersonagem.ca.bonus.Total(array_exclusao),
      span_ca_surpreso);
  Titulo(gPersonagem.ca.bonus.Exporta(array_exclusao), span_ca_surpreso);
  span_classe_armadura.appendChild(span_ca_surpreso);
  span_ca_surpreso.textContent = ', ' + Traduz('Surpresa') + ': ' + span_ca_surpreso.textContent;
}

// Atualiza as salvacoes, calculando o bonus base de acordo com a classe e
// modificando pelo atributo relevante.
// TODO fazer outros tipo tb.
function _AtualizaSalvacoes() {
  var div_salvacoes = Dom('div-salvacoes');
  RemoveFilhos(div_salvacoes);
  for (var tipo_salvacao in gPersonagem.salvacoes) {
    var div_salvacao = CriaDiv();
    AdicionaSpanAoDiv(Traduz(tipo_salvacao) + ': ', null, 'salvacao-rotulo', div_salvacao);
    var span_salvacao =
      AdicionaSpanAoDiv(StringSinalizada(gPersonagem.salvacoes[tipo_salvacao].Total()),
                        null, null, div_salvacao);
    Titulo(gPersonagem.salvacoes[tipo_salvacao].Exporta(), span_salvacao);
    div_salvacoes.appendChild(div_salvacao);
  }
}

// Atualiza as habilidades especiais, vindas de classe e raca.
function _AtualizaHabilidadesEspeciais() {
  var dom_especiais = Dom('habilidades-especiais');
  RemoveFilhos(dom_especiais);
  for (var especial in gPersonagem.especiais) {
    _AtualizaHabilidadeEspecial(especial, dom_especiais);
  }
}

function _AtualizaHabilidadeEspecial(chave_especial, dom_especiais) {
  // TODO atualizar de verdade e so adicionar quando preciso.
  var dom_especial = AdicionaHabilidadeEspecial(chave_especial, dom_especiais);
  var usado = gPersonagem.especiais[chave_especial].usado;
  for (var i = 0; i < dom_especial.childNodes.length && usado > 0; ++i) {
    var filho = dom_especial.childNodes[i];
    if (filho.tagName != 'INPUT') {
      continue;
    }
    filho.checked = true;
    --usado;
  }
}

// Atualiza as imunidades do personagem.
function _AtualizaImunidades() {
  var dom_imunidades = Dom('imunidades');
  RemoveFilhos(dom_imunidades);
  gPersonagem.imunidades.forEach(function(imunidade) {
    AdicionaImunidade(imunidade, dom_imunidades);
  });
}

function _AtualizaResistenciaMagia() {
  var dom_resistencias = Dom('resistencia-magia');
  RemoveFilhos(dom_resistencias);
  if (gPersonagem.resistencia_magia.length == 0) {
    dom_resistencias.style.visibility = false;
    return;
  }
  dom_resistencias.style.visibility = true;
  gPersonagem.resistencia_magia.forEach(function(rm) {
    var valor = 'valor' in rm ? rm.valor : PersonagemNivel() + rm.por_nivel;
    AdicionaResistenciaMagia(rm.chave, valor, dom_resistencias);
  });
}

// Atualiza os numeros e listas relacionados a talentos.
function _AtualizaTalentos() {
  // Talentos de classe.
  for (var chave_classe in gPersonagem.talentos) {
    var div_talentos_classe = Dom('div-talentos-' + chave_classe);
    var lista_classe = gPersonagem.talentos[chave_classe];
    var div_selects = Dom('div-talentos-' + chave_classe + '-selects');
    if (lista_classe.length > 0 || chave_classe == 'outros') {
      ImprimeNaoSinalizado(
          lista_classe.length,
          Dom('talentos-' + chave_classe + '-total'));
      for (var i = 0; i < lista_classe.length; ++i) {
        _AtualizaTalento(
            i,  // indice do talento.
            lista_classe[i],
            i < div_selects.childNodes.length ?
                div_selects.childNodes[i] : null,
            chave_classe,
            div_selects);
      }
      // Se tinha mais talentos, tira os que estavam a mais.
      for (var i = 0; div_selects.childNodes.length > lista_classe.length; ++i) {
        RemoveUltimoFilho(div_selects);
      }
      div_talentos_classe.style.display = 'block';
    } else {
      div_talentos_classe.style.display = 'none';
      RemoveFilhos(div_selects.childNodes);
    }
  }
}

// Atualiza um talento. Se 'div_talento' nao for null, usa o div para o talento.
// Caso contrario, cria o div em questao.
// @param chave_classe chave da classe para talentos de classe, null caso contrario.
// @param div_pai o div onde o talento sera adicionado, caso nao exista.
function _AtualizaTalento(indice_talento, talento_personagem, div_talento, chave_classe, div_pai) {
  if (div_talento == null) {
    div_talento = AdicionaTalento(indice_talento, chave_classe, div_pai);
  }
  // A verificacao de pre-requisitos de talento pode gerar um talento null.
  if (talento_personagem.chave == null || talento_personagem.chave.length == 0) {
    return;
  }
  var talento = tabelas_talentos[talento_personagem.chave];
  for (var i = 0; i < div_talento.childNodes.length; ++i) {
    var filho = div_talento.childNodes[i];
    if (filho.name == 'chave-talento') {
      filho.disabled = talento_personagem.imutavel;
      SelecionaValor(talento_personagem.chave, filho);
    } else if (filho.name == 'complemento-talento') {
      filho.disabled = !('complemento' in talento);
      filho.value = talento_personagem.complemento;
    }
  }
  if (talento.descricao != null && talento.descricao.length > 0) {
    TituloSimples(Traduz(talento.descricao), div_talento);
  } else {
    TituloSimples('', div_talento);
  }
}

function _AtualizaProficienciaArmas() {
  var span_proficiencia_armas = Dom('span-proficiencia-armas');
  var string_proficiencia = '';
  for (var proficiencia in gPersonagem.proficiencia_armas) {
    string_proficiencia += Traduz(tabelas_armas[proficiencia].nome) + ', ';
  }
  string_proficiencia += '.';
  span_proficiencia_armas.textContent = string_proficiencia.replace(', .', '.');
}

// Escreve todas as pericias e atualiza de acordo com a classe dos personagem.
function _AtualizaPericias() {
  var span_total = Dom('pericias-total-pontos');
  span_total.textContent = gPersonagem.pericias.total_pontos;
  var span_gastos = Dom('pericias-pontos-gastos');
  span_gastos.textContent = gPersonagem.pericias.pontos_gastos;

  for (var chave in gPersonagem.pericias.lista) {
    var dom_pericia = Dom('pericia-' + chave);
    var pericia_personagem = gPersonagem.pericias.lista[chave];
    if (pericia_personagem.de_classe) {
      dom_pericia.className = 'pericia-de-classe';
    } else {
      dom_pericia.className = '';
    }
    var input_complemento = Dom('pericia-' + chave + '-complemento');
    input_complemento.value = pericia_personagem.complemento;
    var input_pontos = Dom('pericia-' + chave + '-pontos');
    input_pontos.value = pericia_personagem.pontos;

    var dom_graduacoes = Dom('pericia-' + chave + '-graduacoes');
    dom_graduacoes.textContent = pericia_personagem.graduacoes;
    var dom_total_bonus = Dom('pericia-' + chave + '-total-bonus');
    dom_total_bonus.textContent = StringSinalizada(pericia_personagem.bonus.Total(), false);
    Titulo(pericia_personagem.bonus.Exporta(), dom_total_bonus);
    var dom_total = Dom('pericia-' + chave + '-total');
    dom_total.textContent = StringSinalizada(pericia_personagem.total);
  }
}

function _AtualizaFeiticos() {
  var div_feiticos = Dom('div-feiticos');
  // Remove os filhos que nao existem mais. Cada classe é um filho.
  var filhos_a_remover = [];
  for (var i = 0; i < div_feiticos.childNodes.length; ++i) {
    var filho = div_feiticos.childNodes[i];
    var remover_filho = true;
    for (var chave_classe in gPersonagem.feiticos) {
      if (!gPersonagem.feiticos[chave_classe].em_uso) {
        continue;
      }
      // Ao carregar por link, o id pode vir null.
      if ((filho.id == null) || filho.id.indexOf(chave_classe) != -1 ) {
        remover_filho = false;
        break;
      }
    }
    if (remover_filho) {
      filhos_a_remover.push(filho);
    }
  }
  filhos_a_remover.forEach(function(filho) {
    RemoveFilho(filho, div_feiticos);
  });

  // Adiciona o esqueleto dos filhos que nao existem ainda.
  var filhos_a_adicionar = [];
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    if (Dom('div-feiticos-' + chave_classe) == null) {
      AdicionaEsqueletoFeiticoParaClasse(chave_classe, div_feiticos);
    }
  }

  // Atualiza os esqueletos dos filhos.
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    // Da classe.
    var div_classe = Dom('div-feiticos-' + chave_classe);
    _AtualizaEscolasProibidas(chave_classe, div_classe);
    _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe);
    _AtualizaSlotsFeiticosParaClasse(chave_classe, div_classe);
  }
}

// Atualiza as escolas proibidas da classe.
function _AtualizaEscolasProibidas(chave_classe, div_classe) {
  var escolas_proibidas_classe = gPersonagem.feiticos[chave_classe].escolas_proibidas || [];
  for (var i = 0; i < escolas_proibidas_classe.length; ++i) {
    Dom('div-escola-proibida-' + chave_classe + '-' + i).value = escolas_proibidas_classe[i];
  }
}

// Atualiza os feiticos conhecidos para uma determinada classe.
// @param novo_div se true, indica que um novo div for criado.
function _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe) {
  var feiticos_classe = gPersonagem.feiticos[chave_classe];
  var tabelas_feiticos_classe = tabelas_feiticos[chave_classe];
  var div_conhecidos = Dom('div-feiticos-conhecidos-' + chave_classe + '-por-nivel');
  AjustaFilhos(
      div_conhecidos,
      feiticos_classe.nivel_maximo + (tabelas_feiticos_classe.possui_nivel_zero ? 1 : 0),  // num filhos.
      AdicionaNivelFeiticoConhecido.bind(
          null,  // this
          chave_classe,
          tabelas_feiticos_classe.precisa_conhecer,
          div_conhecidos));
  // Por nivel.
  for (var nivel_str in feiticos_classe.conhecidos) {
    var nivel = parseInt(nivel_str);
    if (nivel > feiticos_classe.nivel_maximo) {
      break;
    }
    if (nivel == 0 && !tabelas_feiticos[chave_classe].possui_nivel_zero) {
      continue;
    }
    _AtualizaFeiticosConhecidosParaClassePorNivel(
        chave_classe,
        nivel,
        tabelas_feiticos_classe.precisa_conhecer,
        feiticos_classe.conhecidos[nivel]);
  }
}

// Atualiza os feiticos conhecidos para uma classe de um determinado nivel.
// @param feiticos_conhecidos array de feiticos conhecidos para a chave_classe e nivel.
function _AtualizaFeiticosConhecidosParaClassePorNivel(
    chave_classe, nivel, precisa_conhecer, feiticos_conhecidos) {
  // Se não precisa conhecer, o jogador pode adicionar feiticos como se fosse um grimório.
  if (feiticos_conhecidos.length == 0 && precisa_conhecer) {
    return;
  }
  var div_nivel = Dom('div-feiticos-conhecidos-' + chave_classe + '-' + nivel);
  AjustaFilhos(
      div_nivel,
      feiticos_conhecidos.length,
      // A funcao AjustaFilhos fornecera o indice.
      AdicionaFeiticoConhecido.bind(
          null,  // this
          chave_classe,
          nivel));
  for (var indice = 0; indice < feiticos_conhecidos.length; ++indice) {
    // Adiciona os inputs.
    var dom = Dom('input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + indice);
    dom.value = feiticos_conhecidos[indice];
    var feitico_str = StringNormalizada(feiticos_conhecidos[indice]);
    if (feitico_str in tabelas_lista_feiticos_invertida) {
      feitico_str = tabelas_lista_feiticos_invertida[feitico_str];
    }
    if ((feitico_str in tabelas_lista_feiticos_completa) && ('descricao' in tabelas_lista_feiticos_completa[feitico_str])) {
      TituloSimples(tabelas_lista_feiticos_completa[feitico_str].descricao, dom);
    }
  }
}

function _AtualizaSlotsFeiticosParaClasse(chave_classe, div_classe) {
  var feiticos_classe = gPersonagem.feiticos[chave_classe];
  var div_slots = Dom('div-feiticos-slots-' + chave_classe);
  // Remove niveis excedentes.
  var niveis_presentes = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false };
  for (var nivel = (tabelas_feiticos[chave_classe].possui_nivel_zero ? 0 : 1) ; nivel <= feiticos_classe.nivel_maximo; ++nivel) {
    niveis_presentes[nivel] = true;
  }
  for (var nivel in niveis_presentes) {
    var dom = Dom('div-feiticos-slots-' + chave_classe + '-' + nivel);
    if (niveis_presentes[nivel]) {
      if (dom == null) {
        // Adiciona filho.
        div_slots.appendChild(CriaDomSlotsNivel(chave_classe, nivel, feiticos_classe.slots[nivel]));
      }
    } else {
      if (dom != null) {
        RemoveFilho(div_slots, dom);
      }
    }
  }

  // Por nivel.
  // TODO criar o array com niveis a serem removidos e outro com niveis a adicionar.
  // Entao criar uma funcao AdicionarEsqueletoSlotsNivel.
  // or fim, tirar o RemoveFilhos daqui de cima e la embaixo pegar o Dom direto
  // ao inves de criar.
  for (var nivel_str in niveis_presentes) {
    var nivel = parseInt(nivel_str);
    if (!niveis_presentes[nivel]) {
      continue;
    }
    // Monta os feiticos que poderão ser escolhidos no slot.
    var feiticos_conhecidos = {};
    for (var nivel_corrente = nivel; nivel_corrente >= 0; --nivel_corrente) {
      var conhecidos_nivel_corrente = [];
      feiticos_classe.conhecidos[nivel_corrente].forEach(function(texto, indice) {
        conhecidos_nivel_corrente.push(
          { valor: nivel_corrente + '-' + indice, texto: texto });
      });
      feiticos_conhecidos['Nível: ' + nivel_corrente] = conhecidos_nivel_corrente;
    }
    // TODO: metamagicos.

    _AtualizaSlotsFeiticosParaClassePorNivel(
        chave_classe,
        nivel,
        feiticos_classe.slots[nivel],
        feiticos_conhecidos);
  }
}

// Atualiza os slots de feiticos para a classe por nivel.
// @param conhecidos cada entrada: { nivel: [ { valor, texto}, ...] }..
// @param slots do nivel para a clase.
function _AtualizaSlotsFeiticosParaClassePorNivel(chave_classe, nivel, slots, conhecidos) {
  if (slots.feiticos.length == 0) {
    return;
  }
  var precisa_conhecer = tabelas_feiticos[chave_classe].precisa_conhecer;
  var possui_dominio = tabelas_feiticos[chave_classe].possui_dominio;
  var possui_especializacao = 'escola_especializada' in tabelas_feiticos[chave_classe];
  var possui_extra = (nivel > 0 && possui_dominio) || possui_especializacao;
  var div_nivel_slots = Dom('div-feiticos-slots-' + chave_classe + '-' + nivel);
  AjustaFilhos(
      div_nivel_slots,
      slots.feiticos.length + (possui_extra ? 1 : 0),
      AdicionaSlotFeitico.bind(null, div_nivel_slots, !precisa_conhecer, chave_classe, nivel, slots));

  // Atualiza a CD.
  var span = Dom('span-cd-' + chave_classe + '-' + nivel);
  if (span != null) {
    span.textContent = slots.cd;
  }

  // Popula os selects.
  var selects_nivel = DomsPorClasse('feiticos-slots-' + chave_classe + '-' + nivel);
  for (var indice = 0; indice < selects_nivel.length; ++indice) {
    PopulaSelectComOptGroup(conhecidos, selects_nivel[indice]);
  }
  var classe_span = 'span-feiticos-slots-' + chave_classe + '-' + nivel;
  var spans = DomsPorClasse(classe_span);
  for (var i = 0; i < spans.length - (possui_extra ? 1 : 0); ++i) {
    var slot_feitico = slots.feiticos[i];
    if (selects_nivel.length > 0) {
      SelecionaValor(
          slot_feitico.nivel_conhecido + '-' + slot_feitico.indice_conhecido,
          selects_nivel[i]);
    }
    Dom('input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + i).checked = slot_feitico.gasto;
    Dom('label-feiticos-slots-' + chave_classe + '-' + nivel + '-' + i).textContent = '';
    // TODO Gasto.
  }

  if (possui_extra) {
    var ultimo = spans.length - 1;
    var slot_feitico_extra = null;
    var span_label = Dom('label-feiticos-slots-' + chave_classe + '-' + nivel + '-' + ultimo);
    if (nivel > 0 && possui_dominio) {
      span_label.textContent = 'D';
      slot_feitico_extra = slots.feitico_dominio;
    } else if (possui_especializacao) {
      span_label.textContent = 'E';
      slot_feitico_extra = slots.feitico_especializado;
    }
    SelecionaValor(
        slot_feitico_extra.nivel_conhecido + '-' + slot_feitico_extra.indice_conhecido,
        selects_nivel[ultimo]);
    Dom('input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + i).checked = slot_feitico_extra.gasto;
  }
}

function _AtualizaEquipamentos() {
  for (var tipo_moeda in gPersonagem.moedas) {
    Dom('moedas-' + tipo_moeda).value = gPersonagem.moedas[tipo_moeda];
  }
  for (var tipo_item in tabelas_itens) {
    _AtualizaItens(tipo_item);
  }
  Dom('text-area-outros-equipamentos').value =
      gPersonagem.outros_equipamentos;;
}

function _AtualizaItens(tipo_item) {
  var div_pai = Dom('div-equipamentos-' + tipo_item);
  AjustaFilhos(div_pai, gPersonagem[tipo_item].length, function(indice_filho) {
    var div_filho = CriaDiv(null, 'div-' + tipo_item);
    AdicionaItem(tipo_item, div_filho, div_pai);
  });

  var div_filhos = DomsPorClasse('div-' + tipo_item);
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    var div_filho = div_filhos[i];
    _AtualizaItem(gPersonagem[tipo_item][i], div_filho, div_pai);
  }
}

// Atualiza um item.
// @param item do personagem.
function _AtualizaItem(item, div_item, div_itens) {
  for (var i = 0; i < div_item.childNodes.length; ++i) {
    var filho = div_item.childNodes[i];
    if (filho.name == 'item') {
      SelecionaValor(item.chave, filho);
    } else if (filho.name == 'em_uso') {
      filho.checked = item.em_uso;
    }
  }
}

// Atualiza a lista de armas.
function _AtualizaListaArmas() {
  _AtualizaListaArmasArmaduras(
      'armas', Dom('div-equipamentos-armas'), gPersonagem.armas, AdicionaArma);
}

// Atualiza a lista de armaduras.
function _AtualizaListaArmaduras() {
  _AtualizaListaArmasArmaduras(
      'armaduras', Dom('div-equipamentos-armaduras'), gPersonagem.armaduras, AdicionaArmadura);
}

// Atualiza a lista de escudos.
function _AtualizaListaEscudos() {
  _AtualizaListaArmasArmaduras(
      'escudos', Dom('div-equipamentos-escudos'), gPersonagem.escudos, AdicionaEscudo);
}

// Atualiza uma lista de armas ou armaduras.
// @param nome armas ou armaduras, para algumas diferencas.
// @param div pai das armas ou armaduras.
// @param array_personagem array de armas ou armaduras do personagem.
// @param funcao_adicao caso seja necessario adicionar um div novo.
function _AtualizaListaArmasArmaduras(nome, div, array_personagem, funcao_adicao) {
  var filho = div.firstChild;
  // No caso de armas, ignora a primeira (nao deve ser mostrada para evitar
  // problemas de consistencia.
  for (var i = (nome == 'armas') ? 1 : 0; i < array_personagem.length; ++i) {
    var personagem_entrada = array_personagem[i].entrada;
    if (filho == null) {
      // O div nao existe, chama a funcao.
      filho = funcao_adicao();
    }
    _AtualizaArmaArmadura(
        personagem_entrada.chave,
        // Armas nao tem o checkbox, mas em uso eh null.
        personagem_entrada.em_uso,
        personagem_entrada.obra_prima,
        personagem_entrada.bonus,
        filho);
    filho = filho.nextSibling;
  }
}

// Atualiza o div que contem uma arma ou armadura.
// @param chave opcional chave da arma ou armadura sendo adicionada.
// @param obra_prima indica se a arma eh obra_prima.
// @param bonus da arma.
function _AtualizaArmaArmadura(chave, em_uso, obra_prima, bonus, div) {
  var lido = {};
  for (var i = 0; i < div.childNodes.length; ++i) {
    var filho = div.childNodes.item(i);
    if (filho.name == null) {
      continue;
    }
    if (filho.name.indexOf('em-uso') != -1) {
      filho.checked = em_uso;
    } else if (filho.name.indexOf('select-principal') != -1) {
      SelecionaValor(chave, filho);
    } else if (filho.name.indexOf('select-material') != -1) {
      SelecionaValor(chave, filho);
    } else if (filho.name.indexOf('obra-prima') != -1) {
      filho.checked = obra_prima;
    } else if (filho.name.indexOf('bonus-magico') != -1) {
      filho.value = bonus || 0;
    }
  }
}

function _AtualizaNotas() {
  Dom('text-area-notas').value = gPersonagem.notas;
}

function _AtualizaModoVisao() {
  for (var visao in tabelas_visoes) {
    var span_visao = Dom('span-' + visao);
    span_visao.className = gPersonagem.modo_visao == visao ?
        'selecionado': '';
  }
  Dom('input-modo-mestre').checked = gPersonagem.modo_mestre;
  var modo_str = gPersonagem.modo_mestre ? 'inline' : 'none';
  var botoes_geracao = DomsPorClasse('botao-geracao');
  for (var i = 0; i < botoes_geracao.length; ++i) {
    botoes_geracao[i].style.display = modo_str;
  }
  Dom('span-template').style.display = modo_str;
  Dom('div-versao').style.display = modo_str;
}
// A classe de bonus util para calcular o bonus total.
// Bonus nao cumulativos de tipos diferentes se acumulam. Exemplo: alquimico e
// armadura. Para dois bonus iguais não cumulativos, o mais forte prevalece.
// Bonus cumulativos de tipos iguais e subtipos diferentes se acumulam. Por exemplo:
// bonus de circusntancias de diferentes tipos.

// Construtor, chamar com new Bonus.
function Bonus() {
  this.por_chave = {};
  this.por_chave.alquimico = { nome: 'Alquímico', cumulativo: false, por_origem: {}, };
  this.por_chave.armadura = { nome: 'Armadura', cumulativo: false, por_origem: {}, };
  this.por_chave.armadura_melhoria = { nome: 'Armadura (melhoria)', cumulativo: false, por_origem: {}, };
  this.por_chave.armadura_natural = { nome: 'Amadura Natural', cumulativo: false, por_origem: {}, };
  this.por_chave.atributo = { nome: 'Atributo', cumulativo: true, por_origem: {}, };
  this.por_chave.base = { nome: 'Base', cumulativo: false, por_origem: {}, };
  this.por_chave.circunstancia = { nome: 'Circusntância', cumulativo: true, por_origem: {}, };
  this.por_chave.classe = { nome: 'Classe', cumulativo: true, por_origem: {}, };
  this.por_chave.competencia = { nome: 'Competência', cumulativo: false, por_origem: {}, };
  this.por_chave.deflexao = { nome: 'Deflexão', cumulativo: false, por_origem: {}, };
  this.por_chave.escudo = { nome: 'Escudo', cumulativo: false, por_origem: {}, };
  this.por_chave.escudo_melhoria = { nome: 'Escudo (melhoria)', cumulativo: false, por_origem: {}, };
  this.por_chave.esquiva = { nome: 'Esquiva', cumulativo: true, por_origem: {}, };
  this.por_chave.familiar = { nome: 'Familiar', cumulativo: true, por_origem: {}, };
  this.por_chave.inerente = { nome: 'Inerente', cumulativo: false, por_origem: {}, };
  this.por_chave.intuicao = { nome: 'Intuição', cumulativo: false, por_origem: {}, };
  this.por_chave.melhoria = { nome: 'Melhoria', cumulativo: false, por_origem: {}, };
  this.por_chave.moral = { nome: 'Moral', cumulativo: false, por_origem: {}, };
  // cumulativo para poder ter valores negativos.
  this.por_chave.niveis_negativos = { nome: 'Níveis Negativos', cumulativo: true, por_origem: {}, };
  // Bonus de atributos ganhados a cada 4 niveis.
  this.por_chave.nivel = { nome: 'Nível', cumulativo: true, por_origem: {}, };
  this.por_chave.profano = { nome: 'Profano', cumulativo: false, por_origem: {}, };
  // cumulativo para aceitar valores negativos.
  this.por_chave.racial = { nome: 'Racial', cumulativo: true, por_origem: {}, };
  this.por_chave.template = { nome: 'Template', cumulativo: true, por_origem: {}, };
  this.por_chave.resistencia = { nome: 'Resistência', cumulativo: false, por_origem: {}, };
  this.por_chave.sagrado = { nome: 'Sagrado', cumulativo: false, por_origem: {}, };
  this.por_chave.sinergia = { nome: 'Sinergia', cumulativo: false, por_origem: {}, };
  this.por_chave.sorte = { nome: 'Sorte', cumulativo: false, por_origem: {}, };
  this.por_chave.talento = { nome: 'Talento', cumulativo: true, por_origem: {}, };
  this.por_chave.tamanho = { nome: 'Tamanho', cumulativo: false, por_origem: {}, };
}

// Limpa os bonus.
Bonus.prototype.Limpa = function(excluir) {
  for (var chave_bonus in this.por_chave) {
    this.por_chave[chave_bonus].por_origem = {};
  }
}

// @return um objeto de bonus com os mesmos valores da instância.
Bonus.prototype.Clona = function() {
  var b = new Bonus();
  for (var chave_bonus in this.por_chave) {
    for (var origem in this.por_chave[chave_bonus].por_origem) {
      b.por_chave[chave_bonus].por_origem[origem] =
        this.por_chave[chave_bonus].por_origem[origem];
    }
  }
  return b;
}

// @param excluir array com os tipos de bonus a serem excluidos.
// @return o valor total do bonus.
Bonus.prototype.Total = function(excluir) {
  var total = 0;
  for (var chave_bonus in this.por_chave) {
    var nao_usar_bonus = false;
    for (var i = 0; excluir && i < excluir.length; ++i) {
      if (excluir[i] == chave_bonus) {
        nao_usar_bonus = true;
      }
    }
    if (nao_usar_bonus) {
      continue;
    }
    total += this.TotalChave(chave_bonus);
  }
  return total;
}

// Adiciona um dado tipo de bonus ao personagem.
// @param chave o tipo de bonus.
// @param subschave do bonus. Pode ser null, neste caso '-' será usado.
Bonus.prototype.Adiciona = function(chave_bonus, subchave, valor) {
  var bonus = this.por_chave[chave_bonus];
  if (bonus == null) {
    Mensagem(Traduz('Tipo de bonus invalido') + ': ' + chave_bonus);
    return;
  }
  if (subchave == null) {
    subchave = '-';
  }
  bonus.por_origem[subchave] = valor;
}

// Le um determinado tipo de bonus.
// @param chave o tipo de bonus.
// @param subschave do bonus. Pode ser null, neste caso '-' será usado.
// @return o valor do bonus para a subchave ou 0 se não existir.
Bonus.prototype.Le = function(chave_bonus, subchave) {
  var bonus = this.por_chave[chave_bonus];
  if (bonus == null) {
    Mensagem(Traduz('Tipo de bonus invalido') + ': ' + chave_bonus);
    return;
  }
  if (subchave == null) {
    subchave = '-';
  }
  return bonus.por_origem[subchave] ? bonus.por_origem[subchave] : 0;
}

// @return o total para uma chave.
Bonus.prototype.TotalChave = function(chave_bonus) {
  var total_chave = 0;
  var bonus = this.por_chave[chave_bonus];
  for (var subchave in bonus.por_origem) {
    if (bonus.cumulativo) {
      total_chave += bonus.por_origem[subchave];
    } else {
      if (bonus.por_origem[subchave] > total_chave) {
        total_chave = bonus.por_origem[subchave];
      }
    }
  }
  return total_chave;
}

// Exporta os bonus diferentes de zero.
// Util para ser usado com a funcao Titulo.
// @param opt excluir array com os tipos de bonus a excluir (nao serao exportados).
// @return um array onde cada entrada eh um mapa nome: valor.
Bonus.prototype.Exporta = function(excluir) {
  var array_retorno = [];
  for (var chave_bonus in this.por_chave) {
    var bonus = this.por_chave[chave_bonus];
    var nao_usar_bonus = false;
    for (var i = 0; excluir && i < excluir.length; ++i) {
      if (excluir[i] == chave_bonus) {
        nao_usar_bonus = true;
      }
    }
    if (nao_usar_bonus) {
      continue;
    }

    var total_chave = this.TotalChave(chave_bonus);
    if (total_chave != 0) {
      var entrada_chave = {};
      entrada_chave[Traduz(bonus.nome)] = total_chave;
      array_retorno.push(entrada_chave);
    }
  }
  return array_retorno;
}
// Funcoes de carregamento chamadas ao se carregar a pagina.

// Chamado pelo carregamento inicial da pagina. Apesar de ser um tratador de eventos,
// preferi manter neste arquivo ja que eh chamada apenas uma vez.
function CarregamentoInicial() {
  _CarregaTabelaNormalizacaoStrings();
  _CarregaTraducoes();
  _CarregaTitulos();
  CarregaPersonagens();
  _CarregaDominios();
  _CarregaFamiliares();
  _CarregaRacas();
  _CarregaTemplates();
  _CarregaBotoesVisao();
  _CarregaAtributos();
  _CarregaTalentos();

  // Monta a tabela de armas e cria as opcoes dinamicamente.
  _CarregaTabelaArmasArmaduras();
  _CarregaPericias();
  _CarregaFeiticos();

  _CarregaHandlers();

  // Inicia o objeto de personagem.
  IniciaPersonagem();

  if (document.URL.indexOf('testes.html') != -1) {
    return;
  }
  var indice_igual = document.URL.indexOf('=');
  if (indice_igual != -1) {
    // carrega pelos parametros. Caso contrario, usara a entrada padrao.
    var json_entradas = decodeURIComponent(document.URL.slice(indice_igual + 1));
    gEntradas = JSON.parse(json_entradas);
    CorrigePericias();
  }
  AtualizaGeralSemLerEntradas();
}

// Remove os caracteres invalidos de traducao.
function _SubstituiTraducao(s) {
  return s.replace(/[+\-: "/().,]/g, "_");
}

// Retorna a traducao de s ou o proprio s se nao houver traducao.
function Traduz(s) {
  var gm = (typeof chrome !== 'undefined') && (typeof chrome.i18n !== 'undefined') ? chrome.i18n.getMessage : null;
  if (gm == null) {
    return s;
  }
  var st = gm(_SubstituiTraducao(StringNormalizada(s)));
  return st.length == 0 ? s : st;
}

// Substitui apenas as moedas, ignorando os numeros.
function TraduzDinheiro(s) {
  var gm = (typeof chrome !== 'undefined') && (typeof chrome.i18n !== 'undefined') ? chrome.i18n.getMessage : null;
  if (gm == null) {
    return s;
  }
  var tipos_moedas = [ 'pc', 'pp', 'po', 'pl'];
  var dicionario = {};
  tipos_moedas.forEach(function(tm) {
    dicionario[tm] = Traduz(tm);
    dicionario[tm.toUpperCase()] = dicionario[tm].toUpperCase();
  });
  for (var tm in dicionario) {
    if (s.indexOf(tm) != -1) {
      return s.replace(tm, dicionario[tm]);
    }
  }
  return s;
}

// Substitui as traducoes estaticas.
function _CarregaTraducoes() {
  var gm = (typeof chrome !== 'undefined') && (typeof chrome.i18n !== 'undefined') ? chrome.i18n.getMessage : null;
  if (gm == null) {
    return;
  }
  var elements = document.getElementsByClassName("i18n");
  for (var i = 0; i < elements.length; ++i) {
    var e = elements[i];
    // Os elementos com i18n sao traduzidos pelo id. Se nao houver, vai pelo texto.
    // A entrada no locales deve conter o id ou texto normalizado.
    var trad = gm(_SubstituiTraducao(e.id || e.textContent));
    if (trad != null && trad.length > 0 && e.id.length != null && e.id.length > 0) {
      e.textContent = trad;
    }
    if (e.placeholder != null && e.placeholder.length > 0) {
      var tp = Traduz(e.placeholder);
      if (tp != null && tp.length > 0) {
        e.placeholder = tp;
      }
    }
  }
}

// Alguns personagens sao salvos em versoes com menos pericias. Essa funcao deve ser chamada apos o carregamento
// para corrigir as pericias faltantes na entrada do personagem salvo.
function CorrigePericias() {
  for (var chave in tabelas_pericias) {
    var achou = false;
    for (var i = 0; i < gEntradas.pericias.length; ++i) {
      var entrada_pericia = gEntradas.pericias[i];
      if (entrada_pericia.chave == chave) {
        achou = true;
        break;
      }
    }
    if (!achou) {
      gEntradas.pericias.push({ 'chave': chave, pontos: 0 });
    }
  }
}

function _CarregaTabelaNormalizacaoStrings() {
  PreencheMapaDiacriticals();
}

function _CarregaTitulos() {
  // Mapa de id de botoes para handler de click.
  var mapa = {
    "ferimentos": Traduz("Ferimentos"),
    "ferimentos-nao-letais": Traduz("Ferimentos não letais"),
    "pontos-vida-temporarios": Traduz("Pontos de vida temporários"),
    "input-ferimento-nao-letal": Traduz("Ferimentos não letais"),
    "botao-esconder-proficiencia-armas": Traduz("Esconde/Mostra proficiências em armas"),
    "botao-esconder-pericias": Traduz("Esconde/Mostra perícias"),
  };

  for (var id in mapa) {
    var dom = Dom(id);
    if (dom != null) {
      TituloSimples(mapa[id], dom);
    }
  }
}

// Adiciona os handlers aos botoes da interface.
function _CarregaHandlers() {
  // Mapa de id de botoes para handler de click.
  var mapa = {
    // Clicks.
    "botao-salvar": { callback:  ClickSalvar, evento: 'click', },
    "botao-abrir": { callback:  ClickAbrir, evento: 'click', },
    "botao-excluir": { callback:  ClickExcluir, evento: 'click', },
    "botao-exportar": { callback:  ClickExportar, evento: 'click', },
    "botao-importar": { callback:  ClickImportar, evento: 'click', },
    "botao-adicionar-classe": { callback:  ClickAdicionarClasse, evento: 'click', },
    "botao-remover-classe": { callback:  ClickRemoverClasse, evento: 'click', },
    "botao-gerar-personagem": { callback:  function() { ClickGerarPersonagem('comum'); }, evento: 'click', },
    "botao-gerar-personagem-elite": { callback:  function() { ClickGerarPersonagem('elite'); }, evento: 'click', },
    "botao-adicionar-estilo-luta": { callback:  ClickAdicionarEstiloLuta, evento: 'click', },
    "botao-adicionar-talento": { callback:  ClickAdicionarTalento, evento: 'click', },
    "botao-esconder-proficiencia-armas": {
        callback:  function() { ClickBotaoEsconderDom('botao-esconder-proficiencia-armas', 'span-proficiencia-armas'); }, evento: 'click', },
    "botao-esconder-pericias": {
        callback:  function() { ClickBotaoEsconderDom('botao-esconder-pericias', 'span-lista-pericias'); }, evento: 'click', },
    "botao-link": { callback:  ClickLink, evento: 'click', },
    "botao-gerar-resumo": { callback:  ClickGerarResumo, evento: 'click', },
    "botao-adicionar-arma": { callback:  ClickAdicionarArma, evento: 'click', },
    "botao-adicionar-armadura": { callback:  ClickAdicionarArmadura, evento: 'click', },
    "botao-adicionar-escudo": { callback:  ClickAdicionarEscudo, evento: 'click', },
    "botao-adicionar-anel": { callback:  function() { ClickAdicionarItem('aneis'); }, evento: 'click', },
    "botao-adicionar-amuleto": { callback:  function() { ClickAdicionarItem('amuletos'); }, evento: 'click', },
    "botao-adicionar-bota": { callback:  function() { ClickAdicionarItem('botas'); }, evento: 'click', },
    "botao-adicionar-bracadura": { callback:  function() { ClickAdicionarItem('bracaduras'); }, evento: 'click', },
    "botao-adicionar-pocao": { callback:  function() { ClickAdicionarItem('pocoes'); }, evento: 'click', },
    "botao-adicionar-capa": { callback:  function() { ClickAdicionarItem('capas'); }, evento: 'click', },
    "json-personagem": { callback: function() { var dom = Dom("json-personagem"); dom.focus(); dom.select(); }, evento: 'click', },
    "botao-ferir-1": { callback: function() { ChangeAjustarFerimentos(1); }, evento: 'click', },
    "botao-ferir-3": { callback: function() { ChangeAjustarFerimentos(3); }, evento: 'click', },
    "botao-ferir-5": { callback: function() { ChangeAjustarFerimentos(5); }, evento: 'click', },
    "botao-curar-1": { callback: function() { ChangeAjustarFerimentos(-1); }, evento: 'click', },
    "botao-curar-3": { callback: function() { ChangeAjustarFerimentos(-3); }, evento: 'click', },
    "botao-curar-5": { callback: function() { ChangeAjustarFerimentos(-5); }, evento: 'click', },
    "botao-descansar": { callback: function() { ClickDescansar(); }, evento: 'click', },
    // Changes.
    "nome": { callback: AtualizaGeral, evento: 'change', },
    "raca": { callback: ChangeRaca, evento: 'change', },
    "template": { callback: ChangeTemplate, evento: 'change', },
    "tamanho": { callback: AtualizaGeral, evento: 'change', },
    "alinhamento": { callback: AtualizaGeral, evento: 'change', },
    "pontos-vida-dados": { callback: AtualizaGeral, evento: 'change', },
    "pontos-vida-temporarios": { callback: AtualizaGeral, evento: 'change', },
    "ferimentos": { callback: AtualizaGeral, evento: 'change', },
    "niveis-negativos": { callback: AtualizaGeral, evento: 'change' },
    "pontos-experiencia": { callback: AtualizaGeral, evento: 'change', },
    "pontos-experiencia-adicionais": { callback: ChangePontosExperienciaAdicionais, evento: 'change', },
    "pontos-vida-temporarios-familiar": { callback: AtualizaGeral, evento: 'change' },
    "pontos-vida-base-canimal": { callback: AtualizaGeral, evento: 'change' },
    "pontos-vida-temporarios-canimal": { callback: AtualizaGeral, evento: 'change' },
    "canimal-raca": { callback: AtualizaGeral, evento: 'change' },
    "notas-canimal": { callback: AtualizaGeral, evento: 'change' },
    "input-adicionar-ferimentos": { callback:  function() {
        var dom = Dom('input-adicionar-ferimentos');
        ChangeAjustarFerimentos(parseInt(dom.value) || 0);
        dom.value = ''; }, evento: 'change', },
    "input-adicionar-ferimentos-familiar": { callback:  function() {
        var dom = Dom('input-adicionar-ferimentos-familiar');
        ChangeAjustarFerimentosFamiliar(parseInt(dom.value) || 0);
        dom.value = ''; }, evento: 'change', },
    "input-adicionar-ferimentos-canimal": { callback:  function() {
        var dom = Dom('input-adicionar-ferimentos-canimal');
        ChangeAjustarFerimentosCompanheiroAnimal(parseInt(dom.value) || 0);
        dom.value = ''; }, evento: 'change', },
    "input-remover-ferimentos": { callback:  function() {
        var dom = Dom('input-remover-ferimentos');
        ChangeAjustarFerimentos(-parseInt(dom.value));
        dom.value = ''; }, evento: 'change', },
    "moedas-platina": { callback: AtualizaGeral, evento: 'change', },
    "moedas-ouro": { callback: AtualizaGeral, evento: 'change', },
    "moedas-prata": { callback: AtualizaGeral, evento: 'change', },
    "moedas-cobre": { callback: AtualizaGeral, evento: 'change', },
    "moedas-adicionais": { callback: ChangeAdicionarMoedas, evento: 'change', },
    "pontos-experiencia": { callback: AtualizaGeral, evento: 'change', },
    "divindade-patrona": { callback: AtualizaGeral, evento: 'change', },
    "text-area-outros-equipamentos": { callback:  AtualizaGeral, evento: 'change', },
    "text-area-notas": { callback:  AtualizaGeral, evento: 'change', },
    "dominio-0": { callback: AtualizaGeral, evento: 'change' },
    "dominio-1": { callback: AtualizaGeral, evento: 'change' },
    "select-familiar": { callback: AtualizaGeral, evento: 'change' },
    "familiar-em-uso": { callback: AtualizaGeral, evento: 'change' },
  };

  for (var id in mapa) {
    var dom = Dom(id);
    if (dom != null) {
      dom.addEventListener(mapa[id].evento, mapa[id].callback);
    }
  }
}

// Adiciona racas dinamicamente na planilha
function _CarregaRacas() {
  var select_raca = Dom('raca');
  if (select_raca == null) {
    // Testes não tem o select.
    return;
  }
  for (var chave_raca in tabelas_raca) {
    select_raca.appendChild(CriaOption(Traduz(tabelas_raca[chave_raca].nome), chave_raca))
  }
}

function _CarregaDominios() {
  var dominios_ordenados = [];  // para ordenar.
  for (var dominio in tabelas_dominios) {
    var obj = { chave: dominio, nome: Traduz(tabelas_dominios[dominio].nome)};
    dominios_ordenados.push(obj);
  }
  dominios_ordenados.sort(function(lhs, rhs) {
    return lhs.nome.localeCompare(rhs.nome);
  });
  var valores_finais = {};
  for (var dominio of dominios_ordenados) {
    valores_finais[dominio.chave] = dominio.nome;
  }
  valores_finais = [ valores_finais ];
  var doms = [ Dom('dominio-0'), Dom('dominio-1') ];
  for (var dom of doms) {
    // Verificacao por causa dos testes.
    if (dom != null) {
      PopulaSelect(valores_finais, dom);
    }
  }
}

function _CarregaFamiliares() {
  var familiares_ordenados = [];
  for (var familiar in tabelas_familiares) {
    familiares_ordenados.push(
        { chave: familiar, nome: Traduz(tabelas_familiares[familiar].nome) });
  }
  familiares_ordenados.sort(function(lhs, rhs) {
    return lhs.nome.localeCompare(rhs.nome);
  });
  var valores_finais = {};
  for (var familiar of familiares_ordenados) {
    valores_finais[familiar.chave] = familiar.nome;
  }
  valores_finais = [valores_finais];
  var dom_familiar = Dom('select-familiar');
  // Verificacao por causa dos testes.
  if (dom_familiar != null) {
    PopulaSelect(valores_finais, dom_familiar);
  }
}

// Adiciona racas dinamicamente na planilha
function _CarregaTemplates() {
  var select_template = Dom('template');
  if (select_template == null) {
    // Testes não tem o select.
    return;
  }
  select_template.appendChild(CriaOption('Nenhum', ''))
  for (var chave_template in tabelas_template) {
    select_template.appendChild(CriaOption(Traduz(tabelas_template[chave_template].nome), chave_template))
  }
}

// Popula o select de personagens. Chamado no início e ao salvar um personagem novo.
function CarregaPersonagens() {
  var select_personagens = Dom('select-personagens');
  if (select_personagens == null) {
    // Nos testes não existe.
    return;
  }

  ListaDoArmazem(function(lista_nomes_sync, lista_nomes_local) {
    LimpaSelect(select_personagens);
    select_personagens.add(CriaOption(Traduz('nenhum'), '--'));
    for (var i = 0; i < lista_nomes_sync.length; ++i) {
      select_personagens.add(CriaOption(lista_nomes_sync[i], 'sync_' + lista_nomes_sync[i]));
    }
    for (var i = 0; i < lista_nomes_local.length; ++i) {
      select_personagens.add(CriaOption(lista_nomes_local[i] + ' ' + Traduz('(local)'), 'local_' + lista_nomes_local[i]));
    }
  });
}


// Adiciona botoes dinamicamente na planilha.
function _CarregaBotoesVisao() {
  var div_visoes = Dom('div-visoes');
  if (div_visoes == null) {
    // Testes nao possuem o div.
    return;
  }
  for (var visao in tabelas_visoes) {
    var botao_visao = CriaSpan(Traduz(tabelas_visoes[visao].nome), 'span-' + visao, null);
    var handler = {
      visao_handler: visao,
      handleEvent: function(evt) { ClickVisao(this.visao_handler); }
    };
    botao_visao.addEventListener('click', handler);
    div_visoes.appendChild(botao_visao);
  }
  // Aba do modo mestre
  var input_modo_mestre = CriaInputCheckbox(false, 'input-modo-mestre', null);
  input_modo_mestre.addEventListener('change', ClickVisualizacaoModoMestre);
  TituloSimples(Traduz('Modo Mestre'), input_modo_mestre);
  input_modo_mestre.style.paddingBottom = '0';
  //input_modo_mestre.textContent = 'modo-mestre';
  var span_input = CriaSpan();
  span_input.appendChild(input_modo_mestre);
  div_visoes.appendChild(span_input);
  // Aba do Desfazer e Refazer.
  var botao_desfazer = CriaBotao(Traduz('Desfazer'));
  botao_desfazer.style.paddingBottom = '0';
  botao_desfazer.style.marginBottom = '0'
  botao_desfazer.style.marginLeft = '10ch';
  botao_desfazer.addEventListener('click', ClickDesfazer);
  div_visoes.appendChild(botao_desfazer);
}

function _CarregaAtributos() {
  var div = Dom('div-stats');
  if (div == null) {
    // testes.
    return;
  }

  div.appendChild(CriaSpan(Traduz('Atributos'), null, 'titulo'));
  div.appendChild(CriaBr());
  div.appendChild(CriaSpan(Traduz('Total:') + ' '));
  div.appendChild(CriaSpan('0', 'pontos-atributos-total'));
  div.appendChild(CriaSpan(', ' + Traduz('gastos:') + ' [ '));
  div.appendChild(CriaSpan('0', 'pontos-atributos-gastos'));
  div.appendChild(CriaSpan(' ]'));
  div.appendChild(
      CriaBotao('-',
                'botao-atributos-menos',
                null,
                { handleEvent: function (evento) {
                    ClickBotaoAtributoMenos();
                    evento.stopPropagation();
                } }));

  var atributos = {
      forca: 'Força',
      destreza: 'Destreza',
      constituicao: 'Constituição',
      inteligencia: 'Inteligência',
      sabedoria: 'Sabedoria',
      carisma: 'Carisma' };
  for (var chave_atributo in atributos) {
    var div_atributo = CriaDiv();
    div_atributo.appendChild(
        CriaBotao('+',
                  'botao-atributos-mais-' + chave_atributo,
                  'botoes-atributos',
                  {
                      chave_atributo: chave_atributo,
                      handleEvent: function (evento) {
                          ClickBotaoAtributoMais(this.chave_atributo);
                          evento.stopPropagation();
                  } }));
    var span_rotulo = CriaSpan(Traduz(atributos[chave_atributo]));
    span_rotulo.style.display = 'inline-block';
    span_rotulo.style.width = '13ch';
    div_atributo.appendChild(span_rotulo);
    var input_atributo = CriaInputTexto('10', chave_atributo + '-valor-base');
    input_atributo.size = 2;
    input_atributo.maxLength = 2;
    input_atributo.addEventListener('change', AtualizaGeral);
    div_atributo.appendChild(input_atributo);
    div_atributo.appendChild(CriaSpan('0', chave_atributo + '-mod-bonus'));
    div_atributo.appendChild(CriaSpan(' = '));
    div_atributo.appendChild(CriaSpan('0', chave_atributo + '-valor-total'));
    div_atributo.appendChild(CriaSpan(', ' + Traduz('modificador') + ': '));
    div_atributo.appendChild(CriaSpan('0', null, chave_atributo + '-mod-total'));

    div.appendChild(div_atributo);
  }
}

// Cria os divs com talentos de classe.
function _CarregaTalentos() {
  var div_talentos = Dom('div-talentos');
  if (div_talentos == null) {
    return;
  }
  for (var chave_classe in gPersonagem.talentos) {
    var div_talentos_classe = CriaDiv('div-talentos-' + chave_classe);
    if (chave_classe == 'gerais') {
      div_talentos_classe.appendChild(
          CriaSpan(Traduz('Gerais') + ': '));
    } else if (chave_classe == 'outros') {
      div_talentos_classe.appendChild(
          CriaSpan(Traduz('Outros') + ': '));
    } else {
      div_talentos_classe.appendChild(
          CriaSpan(Traduz('De') + ' ' + Traduz(tabelas_classes[chave_classe].nome) + ': '));
    }
    div_talentos_classe.appendChild(CriaSpan(null, 'talentos-' + chave_classe + '-total'));
    if (chave_classe == 'outros') {
      div_talentos_classe.appendChild(
          CriaBotao('+', 'botao-adicionar-talento'));
    }
    div_talentos_classe.appendChild(CriaBr());
    div_talentos_classe.appendChild(CriaDiv('div-talentos-' + chave_classe + '-selects'));
    div_talentos.appendChild(div_talentos_classe);
  }
}

// Preenche os nomes e tamanhos faltantes na tabela de armas e chama as funcoes
// para preencher os selects de armas corpo a corpo e a distancia.
function _CarregaTabelaArmasArmaduras() {
  var tabelas_especificas_armas = [
      tabelas_armas_simples, tabelas_armas_comuns, tabelas_armas_exoticas ];
  var talentos_relacionados_armas = [
      'usar_armas_simples', 'usar_arma_comum', 'usar_arma_exotica' ];
  _CarregaTabelasCompostas(
      tabelas_especificas_armas, talentos_relacionados_armas,
      tabelas_armas, tabelas_armas_invertida);
  var tabelas_especificas_armaduras = [
      tabelas_armaduras_leves, tabelas_armaduras_medias, tabelas_armaduras_pesadas ];
  var talentos_relacionados_armaduras = [
      'usar_armaduras_leves', 'usar_armaduras_medias', 'usar_armaduras_pesadas' ];
  _CarregaTabelasCompostas(
      tabelas_especificas_armaduras, talentos_relacionados_armaduras,
      tabelas_armaduras, tabelas_armaduras_invertida);
  _CarregaTabelaMongeDesarmado();
}

function _CarregaTabelaMongeDesarmado() {
  for (var nivel in tabelas_monge_desarmado) {
    var entrada = tabelas_monge_desarmado[nivel];
    for (var chave_tamanho in tabelas_tamanho) {
      if (chave_tamanho == 'medio') {
        continue;
      }
      entrada.dano[chave_tamanho] = tabelas_dado_por_tamanho[entrada.dano['medio']][chave_tamanho];
    }
  }
}

// Util para criar uma tabela a partir de outras, em especial armaduras e armas.
// 'tabelas_especificas' e 'talentos_relacionados' sao vetores de mesmo tamanho
// onde cada entrada do de tabelas_especificas aponta para um subtipo da tabela composta
// (por exemplo, arma_leve). O mesmo indice em 'talentos_relacionados' aponta para o
// talento relevante aquele tipo (por exemplo, usar_armaduras_leves).
// O parametro 'tabela_composta' eh a tabela a ser montada e 'tabela_invertida' eh a tabela
// invertida a ser montada (onde a chave eh o nome).
function _CarregaTabelasCompostas(
    tabelas_especificas, talentos_relacionados, tabela_composta, tabela_invertida) {
  for (var i = 0; i < tabelas_especificas.length; ++i) {
    var tabela_especifica = tabelas_especificas[i];
    for (var entrada in tabela_especifica) {
      var entrada_especifica = tabela_especifica[entrada];
      // Primeiro, preenche o nome da entrada se nao houver.
      if (entrada_especifica.nome == null) {
        entrada_especifica.nome = entrada;
      }
      // Preenche os danos de outros tamanhos.
      if (entrada_especifica.dano && entrada_especifica.dano.medio) {
        var dano_medio = entrada_especifica.dano.medio;
        for (var tamanho in tabelas_tamanho) {
          if (tamanho == 'medio') {
            continue;
          }
          if (dano_medio == '-') {
            entrada_especifica.dano[tamanho] = '-';
          } else {
            entrada_especifica.dano[tamanho] = tabelas_dado_por_tamanho[dano_medio][tamanho] || 0;
          }
        }
      }

      entrada_especifica.talento_relacionado = talentos_relacionados[i];
      // Compoe a tabela principal.
      tabela_composta[entrada] = entrada_especifica;
      // Compoe a tabela invertida.
      tabela_invertida[Traduz(entrada_especifica.nome)] = entrada;
    }
  }
}

// Popula as pericias iniciais.
function _CarregaPericias() {
  for (var chave_pericia in tabelas_pericias) {
    var pericia = tabelas_pericias[chave_pericia];
    var achou = false;
    for (var i = 0; i < pericia.classes.length; ++i) {
      // Aplica as pericias de mago a magos especialistas tambem.
      if (pericia.classes[i] == 'mago') {
        achou = true;
        break;
      }
    }
    if (!achou) {
      continue;
    }
    for (var chave_classe in tabelas_classes) {
      var mago_especialista = chave_classe.search('mago_') != -1;
      if (mago_especialista) {
        pericia.classes.push(chave_classe);
      }
    }
  }
  var span_pericias = Dom('span-lista-pericias');
  // Ordenacao.
  var divs_ordenados = [];
  for (var chave_pericia in tabelas_pericias) {
    var pericia = tabelas_pericias[chave_pericia];
    var habilidade = pericia.habilidade;
    var prefixo_id = 'pericia-' + chave_pericia;
    var div = CriaDiv(prefixo_id);
    var texto_span = Traduz(pericia.nome) + ' (' + Traduz(tabelas_atributos[pericia.habilidade]).toLowerCase() + '): ';
    if (tabelas_pericias[chave_pericia].sem_treinamento) {
      texto_span += 'ϛτ';
    }
    div.appendChild(
        CriaSpan(texto_span, null, 'pericias-nome'));

    var input_complemento =
        CriaInputTexto('', prefixo_id + '-complemento', 'input-pericias-complemento',
        {
          chave_pericia: chave_pericia,
          handleEvent: function(evento) {
            AtualizaGeral();
            evento.stopPropagation();
          }
        });
    input_complemento.placeholder = Traduz('complemento');
    div.appendChild(input_complemento);

    var input_pontos =
        CriaInputNumerico('0', prefixo_id + '-pontos', 'input-pericias-pontos',
        { chave_pericia: chave_pericia,
          handleEvent: function(evento) {
            ClickPericia(this.chave_pericia);
            evento.stopPropagation(); } });
    input_pontos.min = 0;
    input_pontos.maxlength = input_pontos.size = 2;
    div.appendChild(input_pontos);

    div.appendChild(CriaSpan(' ' + Traduz('pontos') + '; '));
    div.appendChild(CriaSpan('0', prefixo_id + '-graduacoes'));
    div.appendChild(CriaSpan('+0', prefixo_id + '-total-bonus'));
    div.appendChild(CriaSpan(' = '));
    div.appendChild(CriaSpan('+0', prefixo_id + '-total'));

    // Adiciona as gEntradas
    gEntradas.pericias.push({ chave: chave_pericia, pontos: 0 });
    // Adiciona ao personagem.
    gPersonagem.pericias.lista[chave_pericia] = {
        graduacoes: 0, bonus: new Bonus(),
    };
    // Adiciona aos divs.
    divs_ordenados.push({ traducao: texto_span, div_a_inserir: div});
  }
  divs_ordenados.sort(function(lhs, rhs) {
    return lhs.traducao.localeCompare(rhs.traducao);
  });
  divs_ordenados.forEach(function(trad_div) {
    if (span_pericias != null) {
      span_pericias.appendChild(trad_div.div_a_inserir);
    }
  });
}

// Cria os objetos das classes que possuem feiticos no personagem.
function _CarregaFeiticos() {
  for (var chave_classe in tabelas_feiticos) {
    gPersonagem.feiticos[chave_classe] = {
      atributo_chave: tabelas_feiticos[chave_classe].atributo_chave,
      conhecidos: {},
      slots: {},
    };
    for (var i = 0; i <= 9; ++i) {
      gPersonagem.feiticos[chave_classe].conhecidos[i] = [];
      gPersonagem.feiticos[chave_classe].slots[i] = {
        atributo_chave: tabelas_feiticos[chave_classe].atributo_chave,
        base: 0,
        bonus_atributo: 0,
        feiticos: [],
        feitico_dominio: null,
      };
    }
  }

  // Tabela invertida de feiticos.
  for (var classe in tabelas_lista_feiticos) {
    for (var nivel in tabelas_lista_feiticos[classe]) {
      for (var chave_feitico in tabelas_lista_feiticos[classe][nivel]) {
        var feitico = tabelas_lista_feiticos[classe][nivel][chave_feitico];
        tabelas_lista_feiticos_invertida[StringNormalizada(feitico.nome)] = chave_feitico;
        tabelas_lista_feiticos_completa[chave_feitico] = feitico;
      }
    }
  }
}

// Aqui é onde tudo começa.
document.addEventListener('DOMContentLoaded', function() {
  CarregamentoInicial();
});
// Funcoes de conversao de entrada para personagem.

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  // Limpa tudo antes de comecar.
  PersonagemLimpaGeral();

  gPersonagem.modo_mestre = gEntradas.modo_mestre;
  gPersonagem.modo_visao = gEntradas.modo_visao;
  gPersonagem.nome = gEntradas.nome;
  gPersonagem.raca = gEntradas.raca;
  gPersonagem.template = gEntradas.template || '';
  _ConverteTamanho();

  gPersonagem.alinhamento = gEntradas.alinhamento;
  gPersonagem.divindade = gEntradas.divindade;
  gEntradas.classes.forEach(function(classe_entrada) {
    gPersonagem.classes.push({ classe: classe_entrada.classe, nivel: classe_entrada.nivel });
  });
  gPersonagem.dominios = PersonagemNivelClasse('clerigo') > 0 && gEntradas.dominios && gEntradas.dominios.slice(0) || [];
  _ConverteFamiliar();
  _ConverteCompanheiroAnimal();
  gPersonagem.niveis_negativos = gEntradas.niveis_negativos || 0;

  gPersonagem.experiencia = gEntradas.experiencia;

  // Equipamentos podem afetar todo o resto.
  _ConverteEquipamentos();

  // Dados de vida afetam quase tudo.
  _ConverteDadosVida();

  // Atributos dependem dos dados de vida (incrementos).
  _ConverteAtributos();

  // Talentos dependem dos dados de vida.
  _ConverteTalentos();

  _ConvertePontosVida();

  // Tem que ser depois de conferir pre requisitos.
  _ConvertePericias();

  _ConverteListaArmas();
  _ConverteListaArmaduras();

  // Estilos tem que vir apos a atualizacao das armas do gPersonagem, talentos e lista de armas.
  _ConverteEstilos();

  _ConverteHabilidadesEspeciais();

  // Feiticos.
  _ConverteFeiticos();

  gPersonagem.notas = gEntradas.notas;
}

// Se o tamanho não estiver definido nas entradas, usa o padrão da raça.
function _ConverteTamanho() {
  if (gEntradas.tamanho != null) {
    gPersonagem.tamanho.categoria = gEntradas.tamanho;
  } else {
    gPersonagem.tamanho.categoria = tabelas_raca[gEntradas.raca].tamanho;
  }
}

function _ConverteDadosVida() {
  gPersonagem.dados_vida.nivel_personagem = 0;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    gPersonagem.dados_vida.nivel_personagem += gPersonagem.classes[i].nivel;
  }
}

function _ConverteFamiliar() {
  var familiar = (gPersonagem.familiar != null)
      ? gPersonagem.familiar : { pontos_vida: { base: 0, bonus: new Bonus(), temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 } };
  if (gEntradas.familiar == null) {
    gPersonagem.familiar = familiar;
    return;
  }
  familiar.em_uso = gEntradas.familiar.em_uso;
  familiar.chave = gEntradas.familiar.chave || '';
  // Para familiar a base eh computada de acordo com os PV do personagem.
  familiar.pontos_vida.temporarios = gEntradas.familiar.temporarios || 0;
  familiar.pontos_vida.ferimentos = gEntradas.familiar.ferimentos || 0;
  familiar.pontos_vida.ferimentos_nao_letais = gEntradas.familiar.ferimentos_nao_letais || 0;
  gPersonagem.familiar = familiar;
}

function _ConverteCompanheiroAnimal() {
  var canimal = (gPersonagem.canimal != null)
      ? gPersonagem.canimal
      : { pontos_vida: { base: 0, bonus: new Bonus(), temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 }, notas: '' };
  if (gEntradas.canimal == null) {
    gPersonagem.canimal = canimal;
    return;
  }
  canimal.raca = gEntradas.canimal.raca || '';
  canimal.pontos_vida.base = gEntradas.canimal.base || 0;
  canimal.pontos_vida.temporarios = gEntradas.canimal.temporarios || 0;
  canimal.pontos_vida.ferimentos = gEntradas.canimal.ferimentos || 0;
  canimal.pontos_vida.ferimentos_nao_letais = gEntradas.canimal.ferimentos_nao_letais || 0;
  canimal.notas = gEntradas.canimal.notas;
  gPersonagem.canimal = canimal;
}

function _ConvertePontosVida() {
  gPersonagem.pontos_vida.total_dados = gEntradas.pontos_vida || 0;
  gPersonagem.pontos_vida.temporarios = gEntradas.pontos_vida_temporarios || 0;
  gPersonagem.pontos_vida.ferimentos = gEntradas.ferimentos || 0;
  gPersonagem.pontos_vida.ferimentos_nao_letais = gEntradas.ferimentos_nao_letais || 0;
}

function _ConverteEquipamentos() {
  // moedas.
  for (var tipo_moeda in gPersonagem.moedas) {
    gPersonagem.moedas[tipo_moeda] = gEntradas[tipo_moeda];
  }
  // itens, apenas se estiverem definidos.
  for (var tipo_item in tabelas_itens) {
    if (gEntradas[tipo_item] == null) {
      gEntradas[tipo_item] = [];
    }
    var itens_entrada = gEntradas[tipo_item];
    itens_entrada.forEach(function(item_entrada) {
      gPersonagem[tipo_item].push({ chave: item_entrada.chave, em_uso: item_entrada.em_uso });
    });
  }
  // outros.
  gPersonagem.outros_equipamentos = gEntradas.outros_equipamentos;
}

function _ConverteAtributos() {
  for (var i = 0; i < gEntradas.bonus_atributos.length; ++i) {
    gPersonagem.atributos.pontos.gastos.push(gEntradas.bonus_atributos[i]);
  }
  // Calcula os componentes dos atributos.
  for (var atributo in tabelas_atributos) {
    gPersonagem.atributos[atributo].bonus.Adiciona('base', null, gEntradas[atributo]);
  }
}

// Converte os talentos do personagem.
function _ConverteTalentos() {
  for (var chave_classe in gPersonagem.talentos) {
    var lista = gPersonagem.talentos[chave_classe];
    lista.length = 0;
    // Personagens antigos nao tem algumas chaves da tabela de talentos. Eh
    // importante verificar ou vai quebrar.
    for (var i = 0; (chave_classe in gEntradas.talentos) && (i < gEntradas.talentos[chave_classe].length); ++i) {
      var talento_entrada = gEntradas.talentos[chave_classe][i];
      lista.push({
          chave: talento_entrada.chave,
          complemento: talento_entrada.complemento });
    }
  }
}

// Converte todas as pericias. Primeiro calcula o total de pontos e depois varre as gEntradas
// de pericia, computando o valor de cada uma e o numero de pontos disponiveis.
function _ConvertePericias() {
  for (var i = 0; i < gEntradas.pericias.length; ++i) {
    var pericia_personagem = gPersonagem.pericias.lista[gEntradas.pericias[i].chave];
    pericia_personagem.pontos = gEntradas.pericias[i].pontos;
    pericia_personagem.complemento = 'complemento' in gEntradas.pericias[i] ? gEntradas.pericias[i].complemento : '';
  }
}

// Converte a lista de armaduras do personagem.
function _ConverteListaArmaduras() {
  gPersonagem.armaduras.length = 0;
  for (var i = 0; i < gEntradas.armaduras.length; ++i) {
    var armadura_personagem = ConverteArmadura(gEntradas.armaduras[i]);
    gPersonagem.armaduras.push(armadura_personagem);
  }
  gPersonagem.escudos.length = 0;
  for (var i = 0; i < gEntradas.escudos.length; ++i) {
    var escudo_personagem = ConverteEscudo(gEntradas.escudos[i]);
    gPersonagem.escudos.push(escudo_personagem);
  }

}

// Converte uma armadura. Exportada porque dependencias usa para criar as
// armaduras fake.
function ConverteArmadura(armadura_entrada) {
  var armadura_tabela = tabelas_armaduras[armadura_entrada.chave];
  var armadura_personagem = {};
  // O nome da entrada eh apenas um indice na tabela de armas.
  armadura_personagem.entrada = {
    chave: armadura_entrada.chave,
    material: armadura_entrada.material,
    bonus: armadura_entrada.bonus,
    // Se é magica, também é obra prima.
    obra_prima: armadura_entrada.bonus > 0 ?
        true : armadura_entrada.obra_prima,
    em_uso: armadura_entrada.em_uso,
  };
  return armadura_personagem;
}

// Converte um escudo. Usada nas dependencias.
function ConverteEscudo(escudo_entrada) {
  var escudo_tabela = tabelas_escudos[escudo_entrada.chave];
  var escudo_personagem = {};
  // O nome da entrada eh apenas um indice na tabela de armas.
  escudo_personagem.entrada = {
    chave: escudo_entrada.chave,
    material: escudo_entrada.material,
    bonus: escudo_entrada.bonus,
    // Se é magico, também é obra prima.
    obra_prima: escudo_entrada.bonus > 0 ?
        true : escudo_entrada.obra_prima,
    em_uso: escudo_entrada.em_uso,
  };
  return escudo_personagem;
}

// Converte a lista de armas do personagem.
//
function _ConverteListaArmas() {
  // Tem que manter sempre a primeira arma imutavel (desarmado).
  // A mesma coisa ocorre no atualiza, a arma nao eh mostrada para
  // evitar inconsistencias.
  gPersonagem.armas.length = 1;
  for (var i = 0; i < gEntradas.armas.length; ++i) {
    gPersonagem.armas.push(ConverteArma(gEntradas.armas[i]));
  }
}

// Converte uma arma da entrada para personagem.
// Exportada para gerar a entrada desarmado.
// @return a arma convertida.
function ConverteArma(arma_entrada) {
  var arma_tabela = tabelas_armas[arma_entrada.chave];
  var arma_personagem = {};
  // O nome da entrada eh apenas um indice na tabela de armas.
  arma_personagem.entrada = {
    chave: arma_entrada.chave,
    material: arma_entrada.material,
    bonus: arma_entrada.bonus,
    obra_prima: arma_entrada.obra_prima
  };
  return arma_personagem;
}

function _ConverteEstilos() {
  for (var i = 0; i < gEntradas.estilos_luta.length; ++i) {
    gPersonagem.estilos_luta.push(_ConverteEstilo(gEntradas.estilos_luta[i]));
  }
}

// Converte um estilo da entrada para o personagem.
function _ConverteEstilo(estilo_entrada) {
  var estilo_personagem = {
    nome: estilo_entrada.nome,
    arma_primaria: {
      nome: estilo_entrada.arma_primaria,
      bonus_por_categoria: {}
    },
    arma_secundaria: {
      nome: estilo_entrada.arma_secundaria,
      bonus_por_categoria: {}
    },
  };
  return estilo_personagem;
}

function _ConverteHabilidadesEspeciais() {
  for (var chave_especial in gEntradas.habilidades_especiais) {
    var entrada_especial = gEntradas.habilidades_especiais[chave_especial];
    var personagem_especial = gPersonagem.especiais[chave_especial] || {};
    personagem_especial.vezes = entrada_especial.length;
    var usados = 0;
    for (var i = 0; i < entrada_especial.length; ++i) {
      if (entrada_especial[i]) {
        ++usados;
      }
    }
    personagem_especial.usado = usados;
  }
}

// Converte todos os feiticos do personagem.
function _ConverteFeiticos() {
  _ConverteEscolasProibidas();
  _ConverteFeiticosConhecidos();
  _ConverteFeiticosSlots();
}

function _ConverteEscolasProibidas() {
  for (var chave_classe in gEntradas.escolas_proibidas) {
    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    feiticos_classe.escolas_proibidas = gEntradas.escolas_proibidas[chave_classe].slice(0);
  }
}

// Cada entrada possui classe, nivel, indice e feitico. Esta funcao le todas as entradads
// e as coloca no personagem se, e somente se, o objeto de feitico possuir todos esses atributos.
function _ConverteFeiticosConhecidos() {
  for (var chave_classe in gEntradas.feiticos_conhecidos) {
    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    for (var nivel in gEntradas.feiticos_conhecidos[chave_classe]) {
      gEntradas.feiticos_conhecidos[chave_classe][nivel].forEach(function(feitico) {
        feiticos_classe.conhecidos[nivel].push(feitico);
      });
    }
  }
}

function _ConverteFeiticosSlots() {
  for (var chave_classe in gEntradas.slots_feiticos) {
    // Converte os slots de feitiços normais.
    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    var possui_dominio = tabelas_feiticos[chave_classe].possui_dominio;
    var possui_especializacao = 'escola_especializada' in tabelas_feiticos[chave_classe];
    for (var nivel in gEntradas.slots_feiticos[chave_classe]) {
      var ultimo = gEntradas.slots_feiticos[chave_classe][nivel].length - 1;
      gEntradas.slots_feiticos[chave_classe][nivel].forEach(function(entrada_feitico, indice) {
        var slots_classe_nivel = feiticos_classe.slots[nivel];
        var slot_feitico = {
            nivel_conhecido: entrada_feitico.nivel,
            indice_conhecido: entrada_feitico.indice,
            gasto: entrada_feitico.gasto };
        if (indice == ultimo && ((possui_dominio && nivel > 0) || possui_especializacao)) {
          if (possui_dominio) {
            slots_classe_nivel.feitico_dominio = slot_feitico;
          } else if (possui_especializacao) {
            slots_classe_nivel.feitico_especializado = slot_feitico;
          }
        } else {
          slots_classe_nivel.feiticos.push(slot_feitico);
        }
      });
    }
    // Converte os feitiços de domínio da classe (se houver).
    if ('slots_feiticos_dominio' in gEntradas) {
      for (var nivel in gEntradas.slots_feiticos_dominio[chave_classe]) {
        var entrada_feitico = gEntradas.slots_feiticos_dominio[chave_classe][nivel];
        var slots_classe_nivel = feiticos_classe.slots[nivel];
        slots_classe_nivel.feitico_dominio = {
          nivel_conhecido: entrada_feitico.nivel,
          indice_conhecido: entrada_feitico.indice,
          gasto: entrada_feitico.gasto };
      }
    }
    if ('slots_feiticos_especializados' in gEntradas) {
      // Converte os feitiços de especialista (se houver).
      for (var nivel in gEntradas.slots_feiticos_especializados[chave_classe]) {
        var entrada_feitico = gEntradas.slots_feiticos_especializados[chave_classe][nivel];
        var slots_classe_nivel = feiticos_classe.slots[nivel];
        slots_classe_nivel.feitico_especializado = {
          nivel_conhecido: entrada_feitico.nivel,
          indice_conhecido: entrada_feitico.indice,
          gasto: entrada_feitico.gasto };
      }
    }
  }
}
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
//   [ {valor: texto} ].
// Essa funcao ta bizarra. Nao sei o motivo do array externo.
// TODO mudar!
function PopulaSelect(valores, dom_select) {
  dom_select.options.length = 0;
  RemoveFilhos(dom_select);
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
  RemoveFilhos(dom_select);
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
  div_titulo.appendChild(CriaSpan(Traduz('Mensagem')));
  div_msg.appendChild(CriaSpan(mensagem));
  var botao = CriaBotao('Ok', null, null, function() { FechaJanela(); });
  div_botao.appendChild(botao);

  var j = AbreJanela();
  var divs = [ div_titulo, div_msg, div_botao ];
  for (var i = 0; i < divs.length; ++i) {
    j.appendChild(divs[i]);
  }
  botao.focus();
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
// Tudo relacionado a gEntradas. Isso eh o que devera ser
// serializado e deserializado. A entrada serve como o mínimo que representa o personagem.
// É possível salvar apenas as gEntradas e restaurar o personagem depois chamando a função
// AtualizaGeralSemLerEntradas.

// Variavel contendo os valores das gEntradas. Iniciado com valores padroes da criacao.
var gEntradas = {
  modo_mestre: '',
  modo_visao: 'completo',
  // geral
  nome: '',
  raca: 'humano',
  template: '',
  tamanho: 'medio',  // É possivel ter tamanhos fora do padrao através de magias.
  alinhamento: 'LB',
  divindade: '',
  // Cada entrada possui classe e nivel.
  classes: [ { classe: 'guerreiro', nivel: 1 } ],
  dominios: [],
  // Familiar nao tem base de PV porque depende do PV do personagem.
  familiar: { em_uso: false, chave: '', temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 },
  canimal: { raca: '', base: 0, temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0, notas: '' },
  niveis_negativos: 0,
  // pontos de vida.
  pontos_vida: 0,
  pontos_vida_temporarios: 0,
  ferimentos: 0,  // Valor deve ser >=  0.
  ferimentos_nao_letais: 0,  // Valor deve ser >= 0.
  // experiencia.
  experiencia: 0,
  // atributos.
  bonus_atributos: [],
  forca: 10,
  destreza: 10,
  constituicao: 10,
  inteligencia: 10,
  sabedoria: 10,
  carisma: 10,
  // Cada entrada: { nome, arma_primaria, arma_secundaria}.
  estilos_luta: [],
  // Cada entrada: chave: [ true/false, ... ]
  habilidades_especiais: {},
  // moedas
  platina: 0,
  ouro: 0,
  prata: 0,
  cobre: 0,
  // equipamentos.
  // armas: [ { chave: 'desarmado', nome_gerado: 'desarmado', material: 'nenhum', obra_prima: false, bonus: 0} ],
  armas: [],
  // Cada entrada eh do tipo: { em_uso, chave, material, obra_prima, bonus }
  armaduras: [],
  // Cada entrada { em_uso, chave, material, obra_prima, bonus },
  escudos: [],
  elmo: '',
  // cada entrada: { chave, em_uso }
  aneis: [],
  amuletos: [],
  braceletes: [],
  pocoes: [],
  capas: [],
  outros_equipamentos: '',
  // talentos. Cada chave possui { chave, complemento }, se houver.
  talentos: { gerais: [], guerreiro: [], mago: [], monge: [], ranger: [], outros: [] },

  // pericias: cada entrada possui { chave, pontos, complemento }
  pericias: [],

  // Para magos especialistas. Cada entrada:
  // chave_classe: [],
  escolas_proibidas: {},
  // Feitiços conhecidos, cada entrada:
  // chave_classe: { 0: [ feitico, ... ], 1: [] ...}
  feiticos_conhecidos: {},
  // Slots de feitiços, cada entrada:
  // chave_classe: { 0: [ { nivel, indice, gasto }, ... ], 1: [] ...}
  // Nivel é o nível do feitiço, que pode ser diferente do nível do slot.
  // indice eh o ponteiro para o feitico nos conhecidos para o nível.
  // gasto indica se o feitico está gasto ou não.
  slots_feiticos: {},

  notas: '',
};

function EntradasRenovaSlotsFeiticos() {
  for (var chave in gEntradas.slots_feiticos) {
    for (var nivel in gEntradas.slots_feiticos[chave]) {
      for (var indice = 0; indice <  gEntradas.slots_feiticos[chave][nivel].length; ++indice) {
        gEntradas.slots_feiticos[chave][nivel][indice].gasto = false;
      }
    }
  }
}

// Le todos os inputs da planilha e armazena em 'gEntradas'.
function LeEntradas() {
  // Modo mestre ligado ou nao.
  gEntradas.modo_mestre = Dom('input-modo-mestre').checked;

  // nome
  gEntradas.nome = Dom('nome').value;
  // raca
  gEntradas.raca = ValorSelecionado(Dom('raca'));
  // template
  gEntradas.template = ValorSelecionado(Dom('template'));
  // tamanho
  gEntradas.tamanho = ValorSelecionado(Dom('tamanho')) || tabelas_raca[gEntradas.raca].tamanho;
  // alinhamento
  gEntradas.alinhamento = ValorSelecionado(Dom('alinhamento'));
  // divindade
  gEntradas.divindade = Dom('divindade-patrona').value;
  // classes.
  gEntradas.classes.length = 0;
  var div_classes = Dom('classes');
  for (var i = 0; i < div_classes.childNodes.length; ++i) {
    var elemento = div_classes.childNodes[i];
    if (elemento.tagName == "DIV") {
      var select = elemento.getElementsByTagName("SELECT")[0];
      var input = elemento.getElementsByTagName("INPUT")[0];
      gEntradas.classes.push({
        classe: ValorSelecionado(select),
        nivel: parseInt(input.value)});
    }
  }
  // Dominios de clerigo.
  _LeDominios();
  // Familiares.
  _LeFamiliar();
  _LeCompanheiroAnimal();
  gEntradas.niveis_negativos = parseInt(Dom('niveis-negativos').value) || 0;
  // pontos de vida e ferimentos.
  gEntradas.pontos_vida = parseInt(Dom('pontos-vida-dados').value) || 0;
  gEntradas.pontos_vida_temporarios = parseInt(Dom('pontos-vida-temporarios').value) || 0;
  gEntradas.ferimentos = Math.abs(parseInt(Dom('ferimentos').textContent)) || 0;
  gEntradas.ferimentos_nao_letais = Math.abs(parseInt(Dom('ferimentos-nao-letais').textContent)) || 0;
  // Experiencia.
  gEntradas.experiencia = parseInt(Dom('pontos-experiencia').value) || 0;
  // atributos
  var span_bonus_atributos = Dom('pontos-atributos-gastos');
  if (span_bonus_atributos.textContent.length > 0) {
    var array_bonus = span_bonus_atributos.textContent.split(',');
    for (var i = 0; i < array_bonus.length; ++i) {
      // Trim direita.
      var nome_atributo = AjustaString(array_bonus[i]);
      array_bonus[i] = tabelas_atributos_invertidos[nome_atributo];
    }
    gEntradas.bonus_atributos = array_bonus;
  } else {
    gEntradas.bonus_atributos = [];
  }
  var atributos = [
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    gEntradas[atributos[i]] =
        parseInt(Dom(atributos[i] + '-valor-base').value);
  }

  // Estilos de luta.
  gEntradas.estilos_luta = [];
  var div_estilos_luta = Dom('div-estilos-luta');
  for (var i = 0; i < div_estilos_luta.childNodes.length; ++i) {
    gEntradas.estilos_luta.push(
        _LeEntradaEstiloLuta(div_estilos_luta.childNodes[i]));
  }

  _LeHabilidadesEspeciais();

  _LeEquipamentos();

  _LeTalentos();

  // Pericias.
  _LePericias();

  // Feiticos.
  _LeFeiticos();

  gEntradas.notas = Dom('text-area-notas').value;
}

function _LePericias() {
  for (var i = 0; i < gEntradas.pericias.length; ++i) {
    var entrada_pericia = gEntradas.pericias[i];
    var input_pontos = Dom('pericia-' + entrada_pericia.chave + '-pontos');
    entrada_pericia.pontos = parseInt(input_pontos.value) || 0;
    var input_complemento = Dom('pericia-' + entrada_pericia.chave + '-complemento');
    entrada_pericia.complemento = (input_complemento == null) ? '' : input_complemento.value;
  }
}

function _LeTalentos() {
  for (var chave_classe in gEntradas.talentos) {
    gEntradas.talentos[chave_classe].length = 0;
    var div_talentos = Dom('div-talentos-' + chave_classe + '-selects');
    for (var i = 0; i < div_talentos.childNodes.length; ++i) {
      gEntradas.talentos[chave_classe].push(
          _LeTalento(div_talentos.childNodes[i]));
    }
  }
}

function _LeDominios() {
  gEntradas.dominios = [];
  var doms_dominios = [ Dom('dominio-0'), Dom('dominio-1') ];
  for (var dom of doms_dominios) {
    gEntradas.dominios.push(ValorSelecionado(dom));
  }
}

function _LeFamiliar() {
  if (gEntradas.familiar == null) {
    gEntradas.familiar = { em_uso: false, chave: '', temporarios: 0 };
  }
  var dom_em_uso = Dom('familiar-em-uso');
  var dom_familiar = Dom('select-familiar');
  if (dom_familiar.style.display == 'none') {
    return;
  }
  gEntradas.familiar.em_uso = dom_em_uso.checked;
  gEntradas.familiar.chave = ValorSelecionado(dom_familiar);
  // A base nao eh input para familiar, eh dependencia de pontos de vida do personagem.
  gEntradas.familiar.temporarios = parseInt(Dom('pontos-vida-temporarios-familiar').value) || 0;
  gEntradas.familiar.ferimentos = -parseInt(Dom('ferimentos-familiar').textContent) || 0;
  gEntradas.familiar.ferimentos_nao_letais = -parseInt(Dom('ferimentos-nao-letais-familiar').textContent) || 0;
}

function _LeCompanheiroAnimal() {
  if (gEntradas.canimal == null) {
    gEntradas.canimal = { raca: '', temporarios: 0 };
  }
  if (Dom('div-canimal').style.display == 'none') {
    return;
  }
  gEntradas.canimal.raca = Dom('canimal-raca').value;
  gEntradas.canimal.base = parseInt(Dom('pontos-vida-base-canimal').value) || 0;
  gEntradas.canimal.temporarios = parseInt(Dom('pontos-vida-temporarios-canimal').value) || 0;
  gEntradas.canimal.ferimentos = -parseInt(Dom('ferimentos-canimal').textContent) || 0;
  gEntradas.canimal.ferimentos_nao_letais = -parseInt(Dom('ferimentos-nao-letais-canimal').textContent) || 0;
  gEntradas.canimal.notas = Dom('notas-canimal').value;
}

// Le o talento do div e o retorna no formato da entrada.
function _LeTalento(div_talento) {
  var entrada_talento = {
    chave: null,
    complemento: null
  };
  for (var j = 0; j < div_talento.childNodes.length; ++j) {
    var filho = div_talento.childNodes[j];
    if (filho.name == 'chave-talento') {
      entrada_talento.chave = ValorSelecionado(filho);
    } else if (filho.name == 'complemento-talento' && !filho.disabled) {
      entrada_talento.complemento = filho.value;
    }
  }
  return entrada_talento;
}

function _LeEscolasProibidas() {
  gEntradas.escolas_proibidas = {};
  // nomes_feiticos eh um NodeList, portanto não possui forEach.
  var doms_escolas_proibidas = DomsPorClasse('escolas-proibidas');
  for (var i = 0; i < doms_escolas_proibidas.length; ++i) {
    var doms_escola_proibida = doms_escolas_proibidas[i];
    var id = doms_escola_proibida.id.split('-');
    id.shift();  // tira div.
    id.shift();  // tira escolas
    id.shift();  // tira proibidas.
    var chave_classe = id[0];
    if (!(chave_classe in gEntradas.escolas_proibidas)) {
      gEntradas.escolas_proibidas[chave_classe] = [];
    }
    gEntradas.escolas_proibidas[chave_classe].push(doms_escolas_proibidas[i].value);
  }
}

function _LeFeiticosConhecidos() {
  gEntradas.feiticos_conhecidos = {};
  // nomes_feiticos eh um NodeList, portanto não possui forEach.
  var doms_feiticos = DomsPorClasse('feiticos-conhecidos');
  for (var indice = 0; indice < doms_feiticos.length; ++indice) {
    var dom_feitico = doms_feiticos[indice];
    // remove o prefixo input-feiticos-conhecidos
    var classe_nivel_indice = dom_feitico.id.split('-');
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    var chave_classe = classe_nivel_indice[0];
    var nivel = classe_nivel_indice[1];
    var feitico = dom_feitico.value;
    if (gEntradas.feiticos_conhecidos[chave_classe] == null) {
      gEntradas.feiticos_conhecidos[chave_classe] = {};
    }
    if (gEntradas.feiticos_conhecidos[chave_classe][nivel] == null) {
      gEntradas.feiticos_conhecidos[chave_classe][nivel] = [];
    }
    gEntradas.feiticos_conhecidos[chave_classe][nivel].push(feitico);
  }
}

// Dado um id no formato p-p-p-p-classe-nivel-indice, retorna [classe, nivel, indice].
function _LeClasseNivelIndice(id) {
  var classe_nivel_indice = id.split('-');
  var num_shifts = classe_nivel_indice.length - 3;
  for (var i = 0; i < num_shifts; ++i) {
    classe_nivel_indice.shift();
  }
  return classe_nivel_indice;
}

// Le um slot gasto, criando os valores intermediarios se eles nao existirem.
function _PreencheSlotGasto(chave_classe, nivel_slot, indice_slot, gasto) {
  if (indice_slot == 'dom') {
    if (gEntradas.slots_feiticos_dominio[chave_classe] == null) {
      gEntradas.slots_feiticos_dominio[chave_classe] = {};
    }
    gEntradas.slots_feiticos_dominio[chave_classe][nivel_slot] = { gasto: gasto };
  } else if (indice_slot == 'esp') {
    if (gEntradas.slots_feiticos_especializados[chave_classe] == null) {
      gEntradas.slots_feiticos_especializados[chave_classe] = {};
    }
    gEntradas.slots_feiticos_especializados[chave_classe][nivel_slot] = { gasto: gasto };
  } else {
    if (gEntradas.slots_feiticos[chave_classe] == null) {
      gEntradas.slots_feiticos[chave_classe] = {};
    }
    if (gEntradas.slots_feiticos[chave_classe][nivel_slot] == null) {
      gEntradas.slots_feiticos[chave_classe][nivel_slot] = [];
    }
    gEntradas.slots_feiticos[chave_classe][nivel_slot].push({ gasto: gasto });
  }
}

function _LeSlotsFeiticos() {
  // Comecar pelo gasto que esta sempre presente.
  gEntradas.slots_feiticos = {};
  gEntradas.slots_feiticos_dominio = {};
  gEntradas.slots_feiticos_especializados = {};
  var doms_feiticos_gastos = DomsPorClasse('feiticos-slots-gastos');

  // Este primeiro loop vai criar todas as gEntradas com apenas o atributo gasto preenchido.
  // O proximo loop preencherá o resto.
  for (var i = 0; i < doms_feiticos_gastos.length; ++i) {
    var classe_nivel_indice = _LeClasseNivelIndice(doms_feiticos_gastos[i].id);
    _PreencheSlotGasto(
        classe_nivel_indice[0],
        classe_nivel_indice[1],
        classe_nivel_indice[2],
        doms_feiticos_gastos[i].checked);
  }

  // O restante ja foi preenchido acima. So falta o feitico em si.
  // O indice_conhecido é formado por nivel_indice. O nível é necessário porque é possível
  // selecionar um feitiço de nível inferior ao do slot.
  var doms_select_feitico = DomsPorClasse('feiticos-slots');
  for (var i = 0; i < doms_select_feitico.length; ++i) {
    var classe_nivel_indice = _LeClasseNivelIndice(doms_select_feitico[i].id);
    var chave_classe = classe_nivel_indice[0];
    var nivel_slot = classe_nivel_indice[1];
    var indice_slot = classe_nivel_indice[2];
    var slot = gEntradas.slots_feiticos[chave_classe][nivel_slot][indice_slot];
    var nivel_indice = ValorSelecionado(doms_select_feitico[i]);
    if (nivel_indice != null) {
      nivel_indice = nivel_indice.split('-');
      if (nivel_indice.length == 1) {
        // Compatibilidade... Se só tiver 1, usa de índice do mesmo nível.
        slot.nivel = nivel_slot;
        slot.indice = nivel_indice[0];
      } else {
        slot.nivel = nivel_indice[0];
        slot.indice = nivel_indice[1];
      }
    }
  }

}

function _LeFeiticos() {
  _LeEscolasProibidas();
  _LeFeiticosConhecidos();
  _LeSlotsFeiticos();
}

// Le um div de estilo de luta.
// Como existem spans aninhados, tem que empilhar spans.
// @return o estilo lido.
function _LeEntradaEstiloLuta(div_estilo_luta) {
  var estilo = {};
  var proximos_elementos = [ div_estilo_luta ];
  while (proximos_elementos.length > 0) {
    var elemento_corrente = proximos_elementos.pop();
    for (var i = 0; i < elemento_corrente.childNodes.length; ++i) {
      var filho = elemento_corrente.childNodes[i];
      if (filho.tagName == 'INPUT') {
        if (filho.checked) {
          estilo.nome = filho.value;
        }
      } else if (filho.tagName == 'SELECT') {
        if (filho.id.indexOf('primario') != -1) {
          estilo.arma_primaria = ValorSelecionado(filho);
        } else {
          estilo.arma_secundaria = ValorSelecionado(filho);
        }
      } else if (filho.tagName == 'SPAN') {
        proximos_elementos.push(filho);
      }
    }
  }
  return estilo;
}

function _LeHabilidadesEspeciais() {
 gEntradas.habilidades_especiais = {};
 var filhos = Dom('habilidades-especiais').childNodes;
 for (var i = 0; i < filhos.length; ++i) {
   var filho = filhos.item(i);
   if (filho.tagName != "DIV") {
     continue;
   }
   _LeHabilidadeEspecial(filhos.item(i));
 }
}

// Recebe o div da habilidade especial, que deve ter o id 'habilidade-especial-' + chave_especial.
// Caso possua usos, estarao dentro de checkboxes.
function _LeHabilidadeEspecial(dom_habilidade) {
  var filhos = dom_habilidade.childNodes;
  // Tira prefixo habilidade-especial-.
  var chave_especial = dom_habilidade.id.split('-');
  chave_especial.shift();
  chave_especial.shift();
  chave_especial = chave_especial.shift();
  var usos = [];  // array de boolean representando cada uso.
  for (var i = 0; i < filhos.length; ++i) {
    var filho = filhos.item(i);
    if (filho.tagName != "INPUT") {
      continue;
    }
    usos.push(filho.checked);
  }
  if (usos.length > 0) {
    gEntradas.habilidades_especiais[chave_especial] = usos;
  }
}

function _LeEquipamentos() {
  // Armadura e escudo.
  //gEntradas.armadura.nome =
  //    ValorSelecionado(Dom('armadura'));
  //gEntradas.armadura.bonus_magico =
  //    parseInt(Dom('bonus-armadura').value) || 0;
  //gEntradas.escudo.nome =
  //    ValorSelecionado(Dom('escudo'));
  //gEntradas.escudo.bonus_magico =
  //    parseInt(Dom('bonus-escudo').value) || 0;
  gEntradas.outros_equipamentos = Dom('text-area-outros-equipamentos').value;

  // Moedas
  gEntradas.platina = parseInt(Dom('moedas-platina').value);
  gEntradas.ouro = parseInt(Dom('moedas-ouro').value);
  gEntradas.prata = parseInt(Dom('moedas-prata').value);
  gEntradas.cobre = parseInt(Dom('moedas-cobre').value);

  // Equipamentos.
  // Armas e armaduras: estes divs possuem divs filhos com select, checkbox, input
  _LeArmas();
  _LeArmaduras();
  _LeEscudos();

  for (var tipo_item in tabelas_itens) {
    _LeItens(tipo_item);
  }
}

// Funcoes iguais que chamam apenas LeArmasArmadurasEscudos com parametros corretos.
function _LeArmas() {
  _LeArmasArmadurasEscudos(gEntradas.armas, Dom('div-equipamentos-armas'));
}

function _LeArmaduras() {
  _LeArmasArmadurasEscudos(gEntradas.armaduras, Dom('div-equipamentos-armaduras'));
}

function _LeEscudos() {
  _LeArmasArmadurasEscudos(gEntradas.escudos, Dom('div-equipamentos-escudos'));
}
// Fim funcoes iguais.

// Le armas e armaduras.
// @param array_entrada o array na entrada. Pode ser gEntradas.armas ou armaduras.
// @param div que contem os elementos.
function _LeArmasArmadurasEscudos(array_entrada, div) {
  array_entrada.length = 0;
  for (var i = 0; i < div.childNodes.length; ++i) {
    array_entrada.push(LeEntradaArmaArmadura(div.childNodes[i]));
  }
}

// Le uma arma ou armadura de seu div. Usada tambem no tratamento de compra e venda
// de armas.
// @return o que foi lido.
function LeEntradaArmaArmadura(div) {
  var lido = {};
  for (var i = 0; i < div.childNodes.length; ++i) {
    var filho = div.childNodes[i];
    if (filho.name == null) {
      continue;
    }
    if (filho.name.indexOf('em-uso') != -1) {
      lido.em_uso = filho.checked;
    } else if (filho.name.indexOf('select-principal') != -1) {
      lido.chave = ValorSelecionado(filho);
    } else if (filho.name.indexOf('select-material') != -1) {
      lido.material = ValorSelecionado(filho);
    } else if (filho.name.indexOf('obra-prima') != -1) {
      lido.obra_prima = filho.checked;
    } else if (filho.name.indexOf('bonus-magico') != -1) {
      lido.bonus = parseInt(filho.value) || 0;
    }
  }
  return lido;
}



function _LeItens(tipo_item) {
  gEntradas[tipo_item] = [];
  var dom = DomsPorClasse('div-' + tipo_item);
  for (var i = 0; i < dom.length; ++i) {
    gEntradas[tipo_item].push(LeItem(dom[i]));
  }
}

// Usado tambem na compra e venda de itens.
// @return o item lido do dom.
function LeItem(dom) {
  var item = {
      chave: '',
      em_uso: false,
  };
  for (var i = 0; i < dom.childNodes.length; ++i) {
    var filho = dom.childNodes[i];
    if (filho.name == 'item') {
      item.chave = ValorSelecionado(filho);
    } else if (filho.name == 'em_uso') {
      item.em_uso = filho.checked;
    }
  }
  return item;
}

// Adiciona moedas as gEntradas. Valores podem ser negativos.
// O personagem nunca pode ficar com moedas negativas, neste caso
// a funcao nao fara nada.
// @param moedas um objeto contendo { ouro, platina, prata, cobre}
// @return true se foi possivel adicionar as moedas.
function EntradasAdicionarMoedas(moedas) {
  // verifica fundos.
  for (var tipo_moeda in moedas) {
    if (gEntradas[tipo_moeda] + moedas[tipo_moeda] < 0) {
      return false;
    }
  }

  for (var tipo_moeda in moedas) {
    gEntradas[tipo_moeda] += moedas[tipo_moeda];
  }
  return true;
}

// Adiciona ferimentos as gEntradas.
function EntradasAdicionarFerimentos(valor, nao_letal) {
  var tipo = nao_letal ? "ferimentos_nao_letais" : "ferimentos";
  gEntradas[tipo] += valor;
  if (gEntradas[tipo] < 0) {
    gEntradas[tipo] = 0;
  }
}


function _EntradasAdicionarFerimentosGeral(valor, nao_letal, obj) {
  var tipo = nao_letal ? "ferimentos_nao_letais" : "ferimentos";
  obj[tipo] += valor;
  if (obj[tipo] < 0) {
    obj[tipo] = 0;
  }
}

function EntradasAdicionarFerimentosFamiliar(valor, nao_letal) {
  _EntradasAdicionarFerimentosGeral(valor, nao_letal, gEntradas.familiar);
}

function EntradasAdicionarFerimentosCompanheiroAnimal(valor, nao_letal) {
  _EntradasAdicionarFerimentosGeral(valor, nao_letal, gEntradas.canimal);
}
// Funcao de CarregamentoInicial no arquivo carrega.js.

//Evento para mudar divs visiveis na planilha.

function ClickVisao(modo) {
  // Loop para esconder tudo.
  for (var j = 0; j < tabelas_visoes[modo].esconder.classes.length; ++j) {
    var divs_esconder = DomsPorClasse(tabelas_visoes[modo].esconder.classes[j]);
    for (var i = 0; i < divs_esconder.length; ++i) {
      divs_esconder[i].style.display = 'none';
    }
  }
  for (var i = 0; i < tabelas_visoes[modo].esconder.elementos.length; ++i) {
    var divs_combate = Dom(tabelas_visoes[modo].esconder.elementos[i]);
    divs_combate.style.display = 'none';
  }
  // Loop para mostrar.
  for (var j = 0; j < tabelas_visoes[modo].mostrar.classes.length; ++j) {
    var divs_mostrar = DomsPorClasse(tabelas_visoes[modo].mostrar.classes[j]);
    for (var i = 0; i < divs_mostrar.length; ++i) {
      divs_mostrar[i].style.display = 'block';
    }
  }
  for (var i = 0; i < tabelas_visoes[modo].mostrar.elementos.length; ++i) {
    var divs_combate = Dom(tabelas_visoes[modo].mostrar.elementos[i]);
    divs_combate.style.display = 'block';
  }
  gEntradas.modo_visao = modo;
  AtualizaGeralSemLerEntradas();
}


// Botao de adicionar classe apertado.
function ClickAdicionarClasse() {
  // Tenta uma entrada nao esteja desabilidada.
  var nova_classe = null;
  for (var classe in tabelas_classes) {
    if (!PersonagemPossuiUmaDasClasses([ classe ])) {
      nova_classe = classe;
      break;
    }
  }
  if (nova_classe == null) {
    Mensagem('Impossível criar nova classe');
    return;
  }
  gEntradas.classes.push({ classe: nova_classe, nivel: 1 });
  AtualizaGeralSemLerEntradas();
}

// Botao de remover classe apertado.
function ClickRemoverClasse() {
  if (gEntradas.classes.length == 1) {
    Mensagem('Impossível remover classe');
    return;
  }
  gEntradas.classes.pop();
  AtualizaGeralSemLerEntradas();
}

// Salva entrada do personagem no historico local.
function ClickSalvar() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  var nome = gPersonagem.nome.length > 0 ? gPersonagem.nome : 'saved_entradas';
  if (nome == '--') {
    Mensagem('Nome "--" não é válido.');
    return;
  }
  HabilitaOverlay();
  SalvaNoArmazem(nome, JSON.stringify(gEntradas), function() {
    CarregaPersonagens();
    DesabilitaOverlay();
    Mensagem(Traduz('Personagem') + ' "' + nome + '" ' + Traduz('salvo com sucesso.'));
  });
}

// Carrega o personagem do historico local.
function ClickAbrir() {
  var nome = ValorSelecionado(Dom('select-personagens'));
  if (nome == '--') {
    Mensagem('Nome "--" não é válido.');
    return;
  }
  var eh_local = false;
  if (nome.indexOf('local_') == 0) {
    eh_local = true;
    nome = nome.substr(6);
  } else {
    nome = nome.substr(5);
  }
  var handler = {
    nome: nome,
    f: function(dado) {
      if (nome in dado) {
        gEntradas = JSON.parse(dado[nome]);
        CorrigePericias();
        AtualizaGeralSemLerEntradas();
        SelecionaValor('--', Dom('select-personagens'));
        Mensagem(Traduz('Personagem') + ' "' + nome + '" ' + Traduz('carregado com sucesso.'));
      } else {
        Mensagem(Traduz('Não encontrei personagem com nome') + ' "' + nome + '"');
      }
      DesabilitaOverlay();
    },
  };
  HabilitaOverlay();
  AbreDoArmazem(nome, eh_local, handler.f);
}

// Exclui um personagem do armazem.
function ClickExcluir() {
  var nome = ValorSelecionado(Dom('select-personagens'));
  if (nome == '--') {
    Mensagem('Nome "--" não é válido.');
    return;
  }
  JanelaConfirmacao('Tem certeza que deseja excluir "' + nome + '"?',
    // Callback sim.
    function() {
      ExcluiDoArmazem(nome, function() {
        Mensagem(Traduz('Personagem') + ' "' + nome + '" ' + Traduz('excluído com sucesso.'));
        CarregaPersonagens();
      });
    },
    // Callback não.
    function() {});
}

// Codifica o objeto personagem como JSON e preenche o campo de texto.
function ClickExportar() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  var input = Dom("json-personagem");
  input.style.display = 'inline';
  input.value = JSON.stringify(gEntradas);
  input.focus();
  input.select();
  Mensagem(Traduz('Personagem') + ' "' + gPersonagem.nome + '" ' + Traduz('exportado com sucesso') + '. ' +
           Traduz('Copie para a área de transferência.'));
}

// Abre o personagem lendo do campo de texto.
function ClickImportar() {
  var input = Dom("json-personagem");
  gEntradas = JSON.parse(input.value);
  CorrigePericias();
  AtualizaGeralSemLerEntradas();
  Mensagem(Traduz('Personagem') + ' "' + gPersonagem.nome + '" ' + Traduz('importado com sucesso') + '.');
}

// Codifica o objeto personagem como JSON e gera o link.
// Não existe o evento inverso, o carregamento ocorrerá pela função 'CarregamentoInicial'.
function ClickLink() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  var indice_interrogacao = document.URL.indexOf('?');
  var url =
    (indice_interrogacao != -1 ?  document.URL.slice(0, indice_interrogacao) : document.URL) +
    '?pc=' + encodeURIComponent(JSON.stringify(gEntradas));
  Dom("link-personagem").innerHTML =
    '<a href="' + url + '">Link</a>';
}

// Gera o resumo do personagem para utilizacao em aventuras.
function ClickGerarResumo() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  var input = Dom("resumo-personagem-2");
  input.value = GeraResumo();
  input.focus();
  input.select();
}

// Gera os pontos de vida do personagem de acordo com as classes.
// Ver funcao GeraPontosDeVida para modos validos.
function ClickGerarPontosDeVida(modo) {
  GeraPontosDeVida(modo);
  AtualizaGeral();
}

// Gera os atributos do personagem rolando 3d6 para cada um.
function ClickGerarAleatorioComum() {
  GeraAleatorioComum();
  AtualizaGeral();
}

// Gera os atributos do personagem rolando 4d6 menos o menor.
function ClickGerarAleatorioElite() {
  GeraAleatorioElite();
  AtualizaGeral();
}

// Gera os atributos do personagem usando o 'elite array'. Usa a primeira classe.
function ClickGerarElite() {
  GeraElite();
  AtualizaGeral();
}

// Gera os atributos do personagem usando o 'non elite array'. Usa a primeira classe.
function ClickGerarComum() {
  GeraComum();
  AtualizaGeral();
}

// Adiciona uma arma a lista de equipamentos.
function ClickAdicionarArma() {
  gEntradas.armas.push({ chave: 'desarmado', obra_prima: false, bonus: 0 });
  AtualizaGeralSemLerEntradas();
}

// Adiciona uma armadura a lista de equipamentos.
function ClickAdicionarArmadura() {
  gEntradas.armaduras.push({ chave: 'nenhuma', obra_prima: false, bonus: 0 });
  AtualizaGeralSemLerEntradas();
}

// Adiciona um escudo a lista de equipamentos.
function ClickAdicionarEscudo() {
  gEntradas.escudos.push({ chave: 'nenhum', obra_prima: false, bonus: 0 });
  AtualizaGeralSemLerEntradas();
}

// Evento para adicionar um novo estilo de luta.
function ClickAdicionarEstiloLuta() {
  var estilo_entrada = {
    nome: 'uma_arma',
    arma_primaria: 'desarmado',
    arma_secundaria: 'desarmado',
  };
  gEntradas.estilos_luta.push(estilo_entrada);
  AtualizaGeralSemLerEntradas();
}

// Remove um filho especifico de um pai.
function ClickRemoverFilho(id_filho, id_pai) {
  RemoveFilho(id_filho, Dom(id_pai));
  AtualizaGeral();
}

// Trata o clique de um estilo de luta.
// @param nome_estilo nome do estilo selecionado.
// @param id_select_secundario id do select secundario do estilo sendo modificado.
function ClickEstilo(nome_estilo, id_select_secundario) {
  var select_secundario = Dom(id_select_secundario);
  if (nome_estilo == 'uma_arma' || nome_estilo == 'arma_escudo' || nome_estilo == 'arma_dupla' || nome_estilo == 'rajada' || nome_estilo == 'tiro_rapido') {
    select_secundario.disabled = true;
  } else if (nome_estilo == 'duas_armas')  {
    select_secundario.disabled = false;
  } else {
    Mensagem(Traduz('Nome de estilo invalido') + ': ' + Traduz(nome_estilo));
  }
  AtualizaGeral();
}

// Trata a alteracao de uma pericia.
// @param chave_pericia a chave da pericia.
function ClickPericia(chave_pericia) {
  // pega o input do campo
  var input_pericia = Dom('pericia-' + chave_pericia + '-pontos');
  var input_pericia_valor = parseInt(input_pericia.value) || 0;
  var valor_corrente = gPersonagem.pericias.lista[chave_pericia].pontos;
  if (input_pericia_valor - valor_corrente >
      gPersonagem.pericias.total_pontos - gPersonagem.pericias.pontos_gastos) {
    input_pericia.value = valor_corrente;
    Mensagem('Não há pontos de perícia disponíveis');
    return;
  }
  AtualizaGeral();
}

// Atualiza a entrada de escola proibida.
function ChangeEscolaProibida(chave_classe, indice, dom) {
  AtualizaGeral();
}

// Trata o click de adicionar bonus a um atributo, colocando-o no final da fila.
function ClickBotaoAtributoMais(chave_atributo) {
  gEntradas.bonus_atributos.push(chave_atributo);
  AtualizaGeralSemLerEntradas();
}

// Trata o click de remover bonus de um atributo.
// Retira o ultimo bonus colocado (se houver).
function ClickBotaoAtributoMenos() {
  gEntradas.bonus_atributos.pop();
  AtualizaGeralSemLerEntradas();
}

// Soma valor aos ferimentos do personagem. Um valor positivo significa dano,
// valor negativo eh cura.
function ChangeAjustarFerimentos(valor) {
  EntradasAdicionarFerimentos(valor, Dom('input-ferimento-nao-letal').checked);
  AtualizaGeralSemLerEntradas();
}

function ChangeAjustarFerimentosFamiliar(valor) {
  EntradasAdicionarFerimentosFamiliar(valor, Dom('input-ferimento-nao-letal-familiar').checked);
  AtualizaGeralSemLerEntradas();
}

function ChangeAjustarFerimentosCompanheiroAnimal(valor) {
  EntradasAdicionarFerimentosCompanheiroAnimal(valor, Dom('input-ferimento-nao-letal-canimal').checked);
  AtualizaGeralSemLerEntradas();
}

// Esconde/mostra os botoes de geracao (class="botao-geracao)".
function ClickVisualizacaoModoMestre() {
  gEntradas.modo_mestre = Dom('input-modo-mestre').checked;
  AtualizaGeralSemLerEntradas();
}

// Trata o evento de adicionar items. Se a estrutura for alterada aqui,
// mudar tambem a leitura das gEntradas que depende da ordem dos doms.
function ClickAdicionarItem(tipo_item) {
  gEntradas[tipo_item].push({ chave: '', em_uso: false });
  AtualizaGeralSemLerEntradas();
}

// Trata o click de uso de um item.
// @param tipo_item.
// @param checkbox que causou a mudanca (null em caso de remocao).
function ClickUsarItem(tipo_item, checkbox) {
  if (checkbox.checked) {
    if (tipo_item == 'pocoes') {
      AtualizaGeral();
      return
    }
    var total_em_uso = 0;
    var total_maximo_item = tabelas_itens[tipo_item].maximo;
    for (var i = 0; i < gPersonagem[tipo_item].length && total_em_uso < total_maximo_item; ++i) {
      if (gPersonagem[tipo_item][i].em_uso) {
        ++total_em_uso;
      }
    }
    // Maior aqui so pra garantir no caso de algum bisiu louco passar do numero maximo.
    if (total_em_uso >= total_maximo_item) {
      // Desmarca o item para nao permitir que exceda o numero maximo que pode ser equipado.
      Mensagem(
          'Alerta! Número máximo de items excedido. Valor máximo para ' +
          tabelas_itens[tipo_item].nome + ': ' + tabelas_itens[tipo_item].maximo);
      checkbox.checked = false;
      return;
    }
  }
  AtualizaGeral();
}

// Trata o click de uso de uma armadura ou escudo.
// Usado apenas para permitir que nenhuma armadura ou escudo seja
// selecionado ja que o radio nao permite isso apos ser selecionado.
// @param radio que causou a mudanca.
function ClickUsarArmaduraEscudo(radio) {
  // TODO isso nao funciona, o botao ja vem checked.
  //if (radio.checked) {
  //  radio.checked = false;
  //}
  AtualizaGeral();
}

// Trata os botoes de personagem.
// @param modo 'elite' ou 'comum'.
function ClickGerarPersonagem(modo) {
  GeraPersonagem(modo);
}

// Trata o botao de descansar
function ClickDescansar(valor) {
  // Cura letal e nao letal.
  EntradasAdicionarFerimentos(-PersonagemNivel(), false);
  EntradasAdicionarFerimentos(-PersonagemNivel(), true);
  EntradasRenovaSlotsFeiticos();
  AtualizaGeralSemLerEntradas();
  AtualizaGeral();
}

// Encontra a arma ou armadura no dom.
function _AchaArmaArmadura(dom) {
  var lido = LeEntradaArmaArmadura(dom);
}

// Vende a arma/armadura contida no dom.
// @param dom contendo a arma ou armadura.
// @oaram tipo que esta sendo vendido (arma, armadura, escudo).
// @param tabela que contem o item sendo vendido.
// TODO unit test.
function ClickVenderArmaArmadura(dom, tipo, tabela) {
  var lido = LeEntradaArmaArmadura(dom);
  var preco = PrecoArmaArmaduraEscudo(
      tipo, tabela, lido.chave, lido.material, lido.obra_prima, lido.bonus, false);
  if (preco == null) {
    Mensagem("Arma ou armadura mágica inválida");
    return;
  }
  EntradasAdicionarMoedas(preco);
  AtualizaGeralSemLerEntradas();
}

// Compra a arma/armadura contida no dom.
// @param dom contendo a arma ou armadura.
// @param tipo do que esta sendo vendido (arma, armadura, escudo).
// @param tabela do que esta sendo comprado.
function ClickComprarArmaArmadura(dom, tipo, tabela) {
  var lido = LeEntradaArmaArmadura(dom);
  var preco = PrecoArmaArmaduraEscudo(
      tipo, tabela, lido.chave, lido.material, lido.obra_prima, lido.bonus, true);
  if (preco == null) {
    Mensagem("Arma ou armadura mágica inválida");
    return;
  }
  if (!EntradasAdicionarMoedas(preco)) {
    Mensagem('Não há fundos para compra do item');
    return;
  }
  AtualizaGeralSemLerEntradas();
}

// Compra o item contido no dom.
// @param dom contendo o item.
// @param tabela do que esta sendo comprado.
function ClickComprarItem(dom, tabela) {
  var lido = LeItem(dom);
  var entrada_tabela = tabela[lido.chave];
  if (entrada_tabela == null || entrada_tabela.preco == null) {
    Mensagem('Item inválido ou sem preço');
    return;
  }
  var preco = LePreco(entrada_tabela.preco, true);
  if (!EntradasAdicionarMoedas(preco)) {
    Mensagem('Não há fundos para compra do item');
    return;
  }
  AtualizaGeralSemLerEntradas();
}

// Vende o item contido no dom.
// @param dom contendo o item.
// @param tabela do que esta sendo comprado.
function ClickVenderItem(dom, tabela) {
  var lido = LeItem(dom);
  var entrada_tabela = tabela[lido.chave];
  if (entrada_tabela == null || entrada_tabela.preco == null) {
    Mensagem('Item inválido ou sem preço');
    return;
  }
  EntradasAdicionarMoedas(LePreco(entrada_tabela.preco));
  AtualizaGeralSemLerEntradas();
}

// Evento que trata o click no checkbox de feitico.
function ClickGastarFeitico() {
  AtualizaGeral();
}

// A mudanca de raca é quase igual ao atualiza geral, mas deve-se zerar o tamanho
// para o padrão da nova raça.
function ChangeRaca() {
  gEntradas.raca = ValorSelecionado(Dom('raca'));
  gEntradas.tamanho = tabelas_raca[gEntradas.raca].tamanho;
  AtualizaGeralSemLerEntradas();
}

// Alteracao de template.
function ChangeTemplate() {
  gEntradas.template = ValorSelecionado(Dom('template'));
  AtualizaGeralSemLerEntradas();
}

function ChangePontosExperienciaAdicionais() {
  var dom = Dom("pontos-experiencia-adicionais");
  var valor = parseInt(dom.value);
  gEntradas.experiencia += valor;
  dom.value = '';
  AtualizaGeralSemLerEntradas();
}

// Botao para desfazer ultima acao.
function ClickDesfazer() {
  gEntradas = JSON.parse(gEstado.Restaura());
  AtualizaGeralSemLerEntradas();
}

// Evento para tratar adição e subtração de moedas.
function ChangeAdicionarMoedas() {
  var dom = Dom('moedas-adicionais');
  var valor_texto = dom.value.toLowerCase();
  // Cria a traducao inversa de nativo para canonico.
  var tipos_moedas = ['pc', 'pp', 'po', 'pl'];
  var mapa_traduzido_canonico = {};
  tipos_moedas.forEach(function(tm) {
    mapa_traduzido_canonico[Traduz(tm)] = tm;
  });
  // Converte a moeda do nativo pro canonico.
  for (var moeda_traduzida in mapa_traduzido_canonico) {
    if (valor_texto.indexOf(moeda_traduzida) != -1) {
      valor_texto = valor_texto.replace(moeda_traduzida, mapa_traduzido_canonico[moeda_traduzida]);
      break;
    }
  }

  var valor = LePreco(valor_texto);
  if (valor == null) {
    Mensagem(Traduz('Valor inválido') + ': ' + valor_texto);
    dom.value = '';
    return;
  }
  EntradasAdicionarMoedas(valor);
  dom.value = '';
  AtualizaGeralSemLerEntradas();
}

// Evento chamado ao clicar no checkbox de habilidade especial.
function ClickHabilidadeEspecial() {
  // TODO da pra melhorar.
  AtualizaGeral();
}

function ClickBotaoEsconderDom(id_botao, id_alvo, display) {
  var botao = Dom(id_botao);
  var texto = botao.textContent;
  if (texto == '▴') {
    botao.textContent = '▾';
    Dom(id_alvo).style.display = 'none';
  } else {
    botao.textContent = '▴';
    Dom(id_alvo).style.display = display != null ? display : 'inline';
  }
}

function ClickAdicionarTalento() {
  gEntradas.talentos['outros'].push({});
  AtualizaGeralSemLerEntradas();
}

function ClickRemoverTalento(indice) {
  gEntradas.talentos['outros'].splice(indice, 1);
  AtualizaGeralSemLerEntradas();
}
// Gera os atributos do personagem usando as tabelas do modo.
// @todo submodo.
function _GeraAtributos(modo, submodo) {
  var valores = null;
  if (modo == 'elite') {
    valores = [ 15, 14, 13, 12, 10, 8 ];
  } else {
    valores = [ 13, 12, 11, 10, 9, 8 ];
  }
  if (gPersonagem.classes.length == 0) {
    // Nunca deve acontecer.
    Mensagem('Personagem sem classe');
    return;
  }

  var primeira_classe = gPersonagem.classes[0];
  if (primeira_classe.classe == 'aristocrata' || primeira_classe.classe == 'expert') {
    Mensagem("É recomendado colocar os valores na mão para aristocratas e experts");
  }

  var atributos_primeira_classe = tabelas_geracao[primeira_classe.classe].atributos;
  for (var i = 0; i < valores.length; ++i) {
    gPersonagem.atributos[atributos_primeira_classe[i]].bonus.Adiciona('base', null, valores[i]);
  }

  // Incrementa o atributo mais valioso do personagem
  var atributo_mais_valioso = atributos_primeira_classe[0];
  for (var i = gPersonagem.atributos.pontos.disponiveis; i > 0; --i) {
    gPersonagem.atributos.pontos.gastos.push(atributo_mais_valioso);
    ++gPersonagem.atributos[atributo_mais_valioso].bonus_nivel;
  }
  gPersonagem.atributos.pontos.disponiveis = 0;
}

// Gera os pontos de vida do personagem de acordo com as classes.
// @param modo pode ser elite, comum, personagem.
// @param submodo 'tabelado' ou 'aleatorio'.
function _GeraPontosDeVida(modo, submodo) {
  if (modo != 'personagem' && modo != 'elite' && modo != 'comum') {
    Mensagem(Traduz('Modo') + ' ' + modo + ' ' + Traduz('invalido') + '. ' + Traduz('Deve ser elite, comum ou personagem.'));
    return;
  }
  // Para cada classe, rolar o dado.
  var total_pontos_vida = 0;
  // Primeiro eh diferente na elite e personagem.
  var primeiro = (modo == 'comum') ? false : true;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var info_classe = gPersonagem.classes[i];
    for (var j = 0; j < info_classe.nivel; ++j) {
      var pontos_vida_nivel = 0;
      var template_personagem = PersonagemTemplate();
      var dados_vida = template_personagem != null && 'dados_vida' in template_personagem ?
          template_personagem.dados_vida :
          tabelas_classes[info_classe.classe].dados_vida;
      if (primeiro) {
        if (modo == 'elite') {
          pontos_vida_nivel = dados_vida;
        } else if (modo == 'personagem') {
          // O modificador de constituicao eh subtraido aqui pq sera adicionado
          // no calculo de pontos de vida, nos bonus.
          pontos_vida_nivel = dados_vida +
              gPersonagem.atributos['constituicao'].valor -
              gPersonagem.atributos['constituicao'].modificador;
        } else {
          pontos_vida_nivel = submodo == 'tabelado' ? dados_vida / 2 : Rola(1, dados_vida);
        }
        primeiro = false;
      } else {
        pontos_vida_nivel = submodo == 'tabelado' ? dados_vida / 2 : Rola(1, dados_vida);

      }
      // Nunca pode ganhar menos de 1 ponto por nivel.
      if (pontos_vida_nivel < 1) {
        pontos_vida_nivel = 1;
      }
      total_pontos_vida += pontos_vida_nivel;
    }
  }
  gPersonagem.pontos_vida.total_dados = Math.floor(total_pontos_vida);
}

// Gera os equipamentos que nao afetam outras coisas (ou ainda nao implementados)
// como moedas. Assume um personagem do nivel da primeira classe.
function _GeraEquipamentos(tabela_geracao_classe_por_nivel) {
  for (var chave_moeda in tabela_geracao_classe_por_nivel.moedas) {
    gPersonagem.moedas[chave_moeda] = tabela_geracao_classe_por_nivel.moedas[chave_moeda];
  }
}

function _GeraArmaduras(tabela_geracao_classe_por_nivel) {
  var tabela = tabela_geracao_classe_por_nivel;
  gPersonagem.armaduras.length = 0;
  if (tabela.armadura != null) {
    var entrada_armadura = {
      entrada: {
        chave: tabela.armadura.nome,
        obra_prima: tabela.armadura.obra_prima || false,
        bonus: tabela.armadura.bonus || 0,
        em_uso: true,
      },
    };
    gPersonagem.armaduras.push(entrada_armadura);
  }

  gPersonagem.escudos.length = 0;
  if (tabela.escudo != null) {
    var entrada_escudo = {
      entrada: {
        chave: tabela.escudo.nome,
        obra_prima: tabela.escudo.obra_prima || false,
        bonus: tabela.escudo.bonus || 0,
        em_uso: true,
      },
    };
    gPersonagem.escudos.push(entrada_escudo);
  }
}

function _GeraArmas(tabela_geracao_classe_por_nivel) {
  // Mantem desarmado.
  gPersonagem.armas.length = 1;
  if (!('armas' in tabela_geracao_classe_por_nivel)) {
    return;
  }
  for (var i = 0; i < tabela_geracao_classe_por_nivel.armas.length; ++i) {
    var arma_entrada = {
        entrada: {
            chave: tabela_geracao_classe_por_nivel.armas[i].chave,
            bonus: tabela_geracao_classe_por_nivel.armas[i].bonus,
            obra_prima: tabela_geracao_classe_por_nivel.armas[i].obra_prima
        }
    };
    gPersonagem.armas.push(arma_entrada);
  }
}

// @param tipo_item o tipo do item sendo gerado (aneis, amuletos etc).
function _GeraItens(tipo_item, tabela_geracao_classe_por_nivel) {
  gPersonagem[tipo_item].length = 0;
  if (tabela_geracao_classe_por_nivel[tipo_item] == null) {
    // Sem itens do tipo.
    return;
  }
  for (var i = 0; i < tabela_geracao_classe_por_nivel[tipo_item].length; ++i) {
    var item = tabela_geracao_classe_por_nivel[tipo_item][i];
    var item_entrada = {
        chave: item.chave,
        em_uso: item.em_uso,
    };
    gPersonagem[tipo_item].push(item_entrada);
  }
}

// Gera um personagem a partir das classes e niveis.
// @param modo 'elite' ou 'comum'.
// @param submodo opcional 'tabelado' ou 'aleatorio'.
// TODO refazer essa funcao gerando tudo a partir das entradas para nao ficar essa coisa de ir do personagem para as entradas e voltar.
function GeraPersonagem(modo, submodo) {
  if (!submodo) {
    submodo = 'tabelado';
  }
  var classe_principal = gPersonagem.classes[0];
  if (tabelas_geracao[classe_principal.classe] == null) {
    Mensagem(Traduz('Geração de ') + Traduz(tabelas_classes[gPersonagem.classes[0].classe].nome) + ' ' + Traduz('não disponível'));
    return;
  }
  var tabelas_geracao_classe = tabelas_geracao[classe_principal.classe];
  // So pode limpar aqui, pois isso zerara as classes.
  PersonagemLimpaGeral();
  gPersonagem.classes.push(classe_principal);
  _GeraAtributos(modo, submodo);
  _GeraPontosDeVida(modo, submodo);

  // Atualiza aqui para ja ter alguns numeros usados abaixo.
  AtualizaGeralSemConverterEntradas();

  if (tabelas_geracao_classe.por_nivel == null ||
      tabelas_geracao_classe.por_nivel[gPersonagem.classes[0].nivel] == null) {
    Mensagem(Traduz('Geração avançada de ') + Traduz(tabelas_classes[gPersonagem.classes[0].classe].nome) + ' ' + Traduz('não disponível'));
    return;
  }
  var tabela_geracao_classe_por_nivel =
      tabelas_geracao_classe.por_nivel[gPersonagem.classes[0].nivel];

  _GeraEquipamentos(tabela_geracao_classe_por_nivel);
  _GeraArmaduras(tabela_geracao_classe_por_nivel);
  _GeraArmas(tabela_geracao_classe_por_nivel);
  var tipos_items = [ 'aneis', 'amuletos', 'capas', 'bracaduras' ];
  for (var i = 0; i < tipos_items.length; ++i ) {
    _GeraItens(tipos_items[i], tabela_geracao_classe_por_nivel);
  }
  /*
  _GeraEstilosDeLuta();
  */
  _GeraTalentos(gPersonagem.classes[0].classe,
                tabelas_classes[gPersonagem.classes[0].classe],
                tabelas_geracao_classe,
                gPersonagem.classes[0].nivel);
  _GeraPericias(tabelas_classes[gPersonagem.classes[0].classe],
                tabelas_geracao_classe,
                gPersonagem.classes[0].nivel);
  _GeraFeiticos();
  // Importante regerar aqui para evitar duplicacoes.
  gPersonagem.especiais = {};
  AtualizaGeralSemConverterEntradas();
  LeEntradas();  // importante, pois as entradas estao vazias. Isso efetivamente salva o personagem.
}

function _GeraTalentos(chave_classe, tabela_classe, tabela_geracao_classe, nivel) {
  if (tabela_geracao_classe.talentos == null) {
    // Nao possui talentos.
    return;
  }
  var indice_geracao = 0;
  var tipos_talentos = [ chave_classe, 'gerais' ];
  for (var ti = 0; ti < tipos_talentos.length; ++ti) {
    var tipo_talento = tipos_talentos[ti];
    for (var i = 0;
         (tipo_talento in gPersonagem.talentos) && (i < gPersonagem.talentos[tipo_talento].length) &&
         indice_geracao < tabela_geracao_classe.talentos.length;
         ++i, ++indice_geracao) {
      gPersonagem.talentos[tipo_talento][i] = { chave: tabela_geracao_classe.talentos[indice_geracao], complemento: '' };
    }
  }
}

// Gera as pericias do personagem de forma tabelada.
function _GeraPericias(tabela_classe, tabela_geracao_classe, nivel) {
  if (tabela_geracao_classe.ordem_pericias == null) {
    // Nao possui ordem das pericias.
    return;
  }
  // Pra simplificar, usa so o basico + inteligencia.
  var num_pericias = tabela_classe.pontos_pericia + gPersonagem.atributos['inteligencia'].modificador;
  var max_pontos = nivel + 3;
  for (var i = 0; i < num_pericias && i < tabela_geracao_classe.ordem_pericias.length; ++i) {
    gPersonagem.pericias.lista[tabela_geracao_classe.ordem_pericias[i]].pontos = max_pontos;
  }
}

// Gera os feiticos para as classes do personagem.
function _GeraFeiticos() {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var classe_personagem = gPersonagem.classes[i];
    var chave_classe = gPersonagem.classes[i].classe;
    // Tabela de geracao da classe.
    if (!(chave_classe in tabelas_geracao)) {
      continue;
    }
    // Tabela de feiticos da classe.
    if (!(chave_classe in tabelas_feiticos)) {
      continue;
    }
    if (!(chave_classe in gPersonagem.feiticos)) {
      continue;
    }
    _GeraFeiticosClasse(
        classe_personagem, gPersonagem.feiticos[chave_classe], tabelas_geracao[chave_classe], tabelas_lista_feiticos[chave_classe]);
  }
}

// Percorre os niveis de feiticos da classe do personagem.
// @param classe estrutura do tipo gPersonagem.classes[i].
// @param feiticos_classe estrutura do tipo gPersonagem.feiticos[chave_classe].
// @param tabela_geracao_classe a tabela de geracao para a classe passada.
// @param lista_feiticos_classe a tabela com a lista de feiticos da classe.
function _GeraFeiticosClasse(classe_personagem, feiticos_classe, tabela_geracao_classe, lista_feiticos_classe) {
  for (var nivel in feiticos_classe.slots) {
    if (!('ordem_magias' in tabela_geracao_classe) || !(nivel in tabela_geracao_classe.ordem_magias)) {
      continue;
    }
    _GeraFeiticosClasseNivel(classe_personagem,
                             nivel,
                             feiticos_classe.conhecidos[nivel],
                             feiticos_classe.slots[nivel],
                             tabela_geracao_classe.ordem_magias[nivel],
                             (lista_feiticos_classe != null) && (nivel in lista_feiticos_classe) ? lista_feiticos_classe[nivel] : {});
  }
}

// Gera os feiticos de um determinado nivel para a classe.
// @param classe estrutura do tipo gPersonagem.classes[i].
// @param conhecidos_nivel array do tipo gPersonagem.feiticos[chave_classe].conhecidos[nivel].
// @param slots_nivel estrutura do tipo gPersonagem.feiticos[chave_classe].slots[nivel].
// @param ordem_magias array com a preferencia de ordem das magias para o nivel.
// @param lista_feiticos_classe_nivel.
function _GeraFeiticosClasseNivel(classe_personagem, nivel, conhecidos_nivel, slots_nivel, ordem_magias, lista_feiticos_classe_nivel) {
  // Preenche conhecidos para ter referencia.
  if (!tabelas_feiticos[classe_personagem.classe].precisa_conhecer) {
    conhecidos_nivel.length = ordem_magias.length;
  }
  for (var i = 0; i < conhecidos_nivel.length && i < ordem_magias.length; ++i) {
    conhecidos_nivel[i] = ordem_magias[i] in lista_feiticos_classe_nivel ? lista_feiticos_classe_nivel[ordem_magias[i]].nome : ordem_magias[i];
  }
  // Preenche os slots, fazendo referencia aos conhecidos.
  var indice_geracao = 0;
  for (var i = 0; i < slots_nivel.feiticos.length; ++i) {
    slots_nivel.feiticos[i].nivel_conhecido = nivel;
    slots_nivel.feiticos[i].indice_conhecido = indice_geracao++;
    indice_geracao = indice_geracao % ordem_magias.length;
  }
}

// Gera o resumo para uma arma do estilo.
function GeraResumoArmaEstilo(arma_personagem, primaria, estilo) {
  var resumo = '';
  var arma_estilo = primaria ? estilo.arma_primaria : estilo.arma_secundaria;
  for (var categoria in arma_estilo.bonus_por_categoria) {
    var bonus = arma_estilo.bonus_por_categoria[categoria];
    var string_ataque = '';
    bonus.ataque.forEach(function(at) {
      string_ataque += StringSinalizada(at) + '/';
    });
    string_ataque = string_ataque.slice(0, -1);
    resumo += Traduz(categoria) + ': ' + string_ataque + ', ';
    var arma_tabela = arma_personagem.arma_tabela;
    var nivel_monge = PersonagemNivelClasse('monge');
    if (estilo.nome == 'arma_dupla' && !primaria) {
      resumo += arma_tabela.dano_secundario[gPersonagem.tamanho.categoria];
    } else if (arma_personagem.entrada.chave == 'desarmado' && nivel_monge > 0) {
      resumo += tabelas_monge_desarmado[nivel_monge].dano[gPersonagem.tamanho.categoria];
    } else {
      resumo += arma_tabela.dano[gPersonagem.tamanho.categoria];
    }
    resumo += StringSinalizada(bonus.dano, false);
    resumo += ' (' + arma_personagem.critico + ')';
    resumo += '; ';
  }
  return resumo.slice(0, -2);
}

// String de resumo para um estilo de luta.
function _GeraResumoEstilo(estilo) {
  var resumo = estilo.nome + ': (';
  resumo += estilo.arma_primaria.nome + ': [' +
      GeraResumoArmaEstilo(
        ArmaPersonagem(estilo.arma_primaria.nome), true, estilo) + ']';
  if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    resumo += ', ' + estilo.arma_secundaria.nome + ': [' +
        GeraResumoArmaEstilo(
            ArmaPersonagem(estilo.arma_secundaria.nome), false, estilo) + ']';
  }
  resumo += ')';
  return resumo;
}

// @return a string com o resumo do personagem.
function GeraResumo() {
  // TODO(terminar resumo)
  var resumo =
    gPersonagem.nome + '; ' + gPersonagem.raca + '; ' +
    'Tend: ' + gPersonagem.alinhamento.toUpperCase() + ', ' +
    'Tam: ' + gPersonagem.tamanho.categoria +
    '; ';
  // Dados de vida e pontos de vida.
  resumo +=
    'DV: ' + PersonagemStringDadosVida() +
    ', pv: ' + (gPersonagem.pontos_vida.total_dados + gPersonagem.pontos_vida.bonus.Total()) + '; ';

  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var info_classe = gPersonagem.classes[i];
    resumo += tabelas_classes[info_classe.classe].nome + ': ' + info_classe.nivel + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // combate:
  resumo += 'Iniciativa: ' + gPersonagem.iniciativa.Total() + '; ';
  resumo += 'BBA: ' + StringSinalizada(gPersonagem.bba) + '; ';
  resumo += 'Número de Ataques: ' + gPersonagem.numero_ataques + '; ';
  resumo += 'BBA cac: ' + StringSinalizada(gPersonagem.bba_cac) + '/';
  resumo += 'Agarrar: ' + StringSinalizada(gPersonagem.agarrar) + '; ';
  resumo += 'BBA distância: ' + StringSinalizada(gPersonagem.bba_distancia) + '; ';
  resumo += 'Estilos: ';
  for (var i = 0; i < gPersonagem.estilos_luta.length; ++i) {
    resumo += _GeraResumoEstilo(gPersonagem.estilos_luta[i]) + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';
  resumo += 'Classe de Armadura: total ' + (10 + gPersonagem.ca.bonus.Total()) + ', ';
  resumo += 'toque ' +
      (10 + gPersonagem.ca.bonus.Total(
          ['armadura', 'escudo', 'armadura_melhoria', 'escudo_melhoria', 'armadura_natural'])) + '; ';
  resumo += 'surpreso ' + (10 + gPersonagem.ca.bonus.Total(['atributo'])) + ', ';

  // Pericias: apenas as rankeadas.
  resumo += 'Perícias (total ' + gPersonagem.pericias.total_pontos + '): ';
  if (gPersonagem.pericias.pontos_gastos < gPersonagem.pericias.total_pontos) {
    resumo += 'INCOMPLETO! ';
  }
  for (var chave_pericia in gPersonagem.pericias.lista) {
    var pericia_personagem = gPersonagem.pericias.lista[chave_pericia];
    if (pericia_personagem.pontos > 0) {
      resumo +=
          tabelas_pericias[chave_pericia].nome + ' ' +
          StringSinalizada(pericia_personagem.total, true) +
          ', ';
    }
  }
  resumo = resumo.slice(0, -2) + '; ';
  // Talentos.
  resumo += 'Talentos: '
  for (var categoria in gPersonagem.talentos) {
    var talentos_categoria = gPersonagem.talentos[categoria];
    for (var i = 0; i < talentos_categoria.length; ++i) {
      var talento = talentos_categoria[i];
      resumo += tabelas_talentos[talento.chave].nome;
      if (talento.complemento != null) {
        resumo += ' (' + talento.complemento + ')';
      }
      resumo += ', ';
    }
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Salvacoes.
  resumo += 'Testes de Resistência: ';
  for (var tipo_salvacao in gPersonagem.salvacoes) {
    var salvacao = gPersonagem.salvacoes[tipo_salvacao];
    var nome_salvacao = tipo_salvacao in tabelas_nome_salvacao ?
        tipo_salvacao.substr(0, 3) : tipo_salvacao;
    resumo += nome_salvacao + ': ' + StringSinalizada(salvacao.Total(), true) + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Habilidades especiais.
  resumo += 'Habilidades especiais: ';
  for (var chave in gPersonagem.habilidades) {
    resumo += tabelas_habilidades[chave].nome + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Atributos.
  resumo += 'Atributos: ';
  for (var atributo in tabelas_atributos) {
    resumo += tabelas_atributos[atributo].substr(0, 3) + ': ' + gPersonagem.atributos[atributo].bonus.Total() + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Itens. TODO nome correto.
  for (var tipo_item in tabelas_itens) {
    if (gPersonagem[tipo_item].length > 0) {
      resumo += tabelas_itens[tipo_item].nome + ': ';
      for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
        var item = tabelas_itens[tipo_item].tabela[gPersonagem[tipo_item][i].chave];
        resumo += item.nome + ', ';
      }
      resumo = resumo.slice(0, -2) + '; ';
    }
  }

  // TODO: classe de dificuldade, conhecidos.
  // Feiticos: por classe, por nivel.
  resumo += 'Feitiços por classe: ';
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    var slots_classe = feiticos_classe.slots;
    resumo += '(' + tabelas_classes[chave_classe].nome + ': ';
    if (feiticos_classe.escolas_proibidas.length > 0) {
      resumo += 'escolas proibidas: ';
      for (var i = 0; i < feiticos_classe.escolas_proibidas.length; ++i) {
        resumo += feiticos_classe.escolas_proibidas[i] + ', ';
      }
      resumo = resumo.slice(0, -2) + '; ';
    }
    for (var nivel_slot in slots_classe) {
      var slots_nivel = slots_classe[nivel_slot];
      if (slots_nivel.feiticos.length == 0) {
        break;
      }
      resumo += nivel_slot + '- ';
      for (var i = 0; i < slots_nivel.feiticos.length; ++i) {
        var slot = slots_nivel.feiticos[i];
        resumo += feiticos_classe.conhecidos[slot.nivel_conhecido][slot.indice_conhecido] + ', ';
      }
      resumo = resumo.slice(0, -2) + '; ';
      var slot;
      if (slots_nivel.feitico_dominio) {
        slot = slots_nivel.feitico_dominio;
      }
      if (slots_nivel.feitico_especializado) {
        slot = slots_nivel.feitico_especializado;
      }
      if (slot != null) {
        resumo = resumo.slice(0, -2) + ', ' + feiticos_classe.conhecidos[slot.nivel_conhecido][slot.indice_conhecido] + '*; ';
      }
    }
    resumo = resumo.slice(0, -2) + ')';
  }
  resumo += '; ';

  // Notas.
  resumo += gPersonagem.notas + '; ';

  return resumo;
}
// Apenas os dados do personagem e funcoes de conversao de entrada para personagem.
var gPersonagem = {
  modo_visao: 'completo',
  modo_mestre: false,
  nome: '',
  raca: 'humano',
  template: '',
  tamanho: {
    categoria: 'medio', modificador_ataque_defesa: 0, modificador_agarrar: 0
  },
  alinhamento: '',
  experiencia: 0,
  divindade: '',
  // Cada entrada: { classe, nivel, nivel_conjurador, linha_tabela_feiticos }.
  // linha_tabela_feiticos indica qual linha ler da tabela de feiticos, que pode ser diferente do nivel da classe e do nivel de conjurador (paladino, por exemplo).
  classes: [
      { classe: 'guerreiro', nivel: 1, nivel_conjurador: 0, linha_tabela_feiticos: 0 },
  ],
  // Chave dos dominios.
  dominios: [],
  familiar: { chave: '', em_uso: false, pontos_vida: { base: 0, bonus: new Bonus(), temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 } },
  companheiro_animal: { chave: '', em_uso: false, pontos_vida: { base: 0, bonus: new Bonus(), temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 } },
  niveis_negativos: 0,
  // TODO remover dados de vida do pontos de vida e usar este.
  dados_vida: {
    nivel_personagem: 0,  // nivel efetivo do personagem.
    //dados: [],  // cada dado de vida rolado.
  },
  pontos_vida: {
    total_dados: 0,  // total dos dados de pontos de vida.
    bonus: new Bonus(), // outros bonus.
    temporarios: 0,  // pontos de vida temporarios
    ferimentos: 0,  // ferimentos do personagem. Valores devem ser >= 0.
    ferimentos_nao_letais: 0,  // ferimentos nao letais.
  },
  // O valor do atributo é o valor final dados todos os modificadores. O modificador
  // é computado sobre esse valor.
  atributos: {
    pontos: {
      disponiveis: 0,
      gastos: [],  // cada entrada, um atributo
    },
    forca: {
      bonus: new Bonus(),
      modificador: 0
    },
    destreza: {
      bonus: new Bonus(),
      modificador: 0
    },
    constituicao: {
      bonus: new Bonus(),
      modificador: 0
    },
    inteligencia: {
      bonus: new Bonus(),
      modificador: 0
    },
    sabedoria: {
      bonus: new Bonus(),
      modificador: 0
    },
    carisma: {
      bonus: new Bonus(),
      modificador: 0
    }
  },
  iniciativa: new Bonus(),
  bba: 1,
  bba_cac: 1,  // inclui tamanho e forca.
  bba_cac_acuidade: 1,  // inclui tamanho e destreza.
  bba_distancia: 1,  // inclui tamanho e destreza.
  agarrar: 1,
  numero_ataques: 1,
  // talentos
  talentos: {
    // Algumas classes ganham talentos especificos.
    // Gerais sao talentos normais, sem serem de classes especificas.
    // TODO outras classes.
    // Cada talento: { chave, complemento, imutavel }
    // Outros se referem a talentos que vem de excecoes de regras, muito dificeis
    // de implementar e a pessoa poe manualmente.
    // Se imutavel, o select nao permitira mudanca (usado para talentos derivados, como
    // prontidao de familiar).
    gerais: [],
    guerreiro: [],
    mago: [],
    monge: [],
    ranger: [],
    outros: [],
  },
  // pericias.
  pericias: {
    // Quantos pontos o personagem pode gastar.
    total_pontos: 8,
    // Quantos ele ja gastou.
    pontos_gastos: 0,
    // Algumas pericias tem complementos. Tipo conhecimento.
    complemento: '',
    // Cada entrada:
    // chave_pericia: { pontos, graduacoes, bonus, de_classe, total }.
    // pontos sao os pontos gastos, graduacoes sao os pontos modificados
    // de acordo com a pericia ser de classe ou nao.
    lista: {},
  },
  // Cada entrada: { nome,
  //                 arma_primaria: {  nome,
  //                                   bonus_por_categoria: { categoria: { ataque: [], dano: valor }, ... } },
  //                 arma_secundaria: { idem }, }.
  // A categoria pode ser cac, cac_leve, cac_duas_maos, distancia, arremesso...
  estilos_luta: [],
  ca: {
      normal: 10, surpreso: 10, toque: 10,
      bonus: new Bonus(),
  },
  // As habilidades especiais do personagem de acordo com a classe e raca. Cada entrada:
  // chave_habilidade: { vezes, usado, complemento }
  especiais: {},
  // Imunidades do personagem, como frio, fogo etc. Cada entrada: chave.
  imunidades: [],
  // Podem haver diferentes resistencias. Cada entrada: {chave, valor}.
  resistencia_magia: [],
  salvacoes: {
    fortitude: new Bonus(),
    reflexo: new Bonus(),
    vontade: new Bonus(),
    // Outras salvacoes.
  },
  // Lista de armas que o personagem eh proficiente.
  // Cada entrada: { nome: true }, onde nome eh o nome da chave. So a presenca do campo eh
  // suficiente para indicar proficiencia, sem necessidade de um booleano.
  proficiencia_armas: {},
  // Cada entrada: { chave_arma: 1|2 }.
  foco_armas: {},
  // Cada entrada: { chave_arma: 2|4 }.
  especializacao_armas: {},
  // Cada entrada:
  //     { entrada: { chave, bonus, obra_prima }, nome_gerado, texto_nome, bonus_ataque, bonus_dano, critico,
  //       proficiente, proficiente_duas_maos, foco, especializado, acuidade, arma_tabela };
  // O nome_gerado junta o nome com OP ou o bonus. Por exemplo, espada longa +1.
  // Sempre havera um ataque desarmado aqui.
  // O texto do nome eh o nome gerado internacionalizado. O nome_gerado eh usado
  // para ligar entradas com a arma, o texto_nome so eh usado para display.
  // Caso o personagem seja proficiente, ele tambem o sera com duas maos. Mas eh possivel ser proficiente apenas com duas
  // maos, caso da espada bastarda sem pericia em arma exotica.
  armas: [],
  // Armadura: aponta para a armadura que estiver sendo usada.
  armadura: null,
  // Cada entrada:
  //      entrada: { chave, obra_prima, bonus, em_uso }, nome_gerado, texto_nome.
  armaduras: [],
  // Aponta para um dos escudos.
  escudo: null,
  // Cada entrada:
  //      entrada: { chave, obra_prima, bonus }, nome_gerado, texto_nome.
  escudos: [],
  elmo: '',
  // TODO: passar pra dentro de itens?
  // Cada entrada { chave, em_uso }
  aneis: [],
  amuletos: [],
  botas: [],
  bracaduras: [],
  capas: [],
  pocoes: [],

  // Valor pode ser qualquer coisa.
  outros_equipamentos: '',
  // Feiticos. As chaves sao criadas no carregamento. Cada entrada:
  // TODO transformar a CD em Bonus para poder ter mouse over.
  // chave_classe: {
  //   atributo_chave,
  //   em_uso,  // se o personagem utiliza feiticos da classe.
  //   conhecidos: { 0: [], ..., 9: [] },
  //   nivel_maximo,  // nivel de feitico mais alto para a classe.
  //   escolas_proibidas: ['nome_escola', ...],
  //   especializacao: 'nome_escola',
  //   slots: {
  //       0: { base, bonus_atributo, cd,
  //            feiticos: [ { nivel_conhecido, indice_conhecido, gasto } ], // o indice eh referente aos conhecidos.
  //            feitico_dominio: { nivel_conhecido, indice_conhecido, gasto },
  //            feitico_especializado: {nome, gasto} },
  //       1: ...} }
  feiticos: {},
  moedas: { platina: 0, ouro: 0, prata: 0, cobre: 0 },

  notas: '',
};

// Limpa o uso de todos os feiticos.
function PersonagemRenovaFeiticos() {
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }
    var slots_classe = gPersonagem.feiticos[chave_classe].slots;
    for (var nivel in slots_classe) {
      for (var indice = 0; indice < slots_classe[nivel].feiticos.length; ++indice) {
        slots_classe[nivel].feiticos[indice].gasto = false;
      }
      if ('feitico_dominio' in slots_classe[nivel] && slots_classe[nivel].feitico_dominio != null) {
        slots_classe[nivel].feitico_dominio.gasto = false;
      }
      if ('feitico_especializado' in slots_classe[nivel] && slots_classe[nivel].feitico_especializado != null) {
        slots_classe[nivel].feitico_especializado.gasto = false;
      }
    }
  }
}

// Retorna true se o personagem tiver a pericia. Se ranks nao for null, verifica o minimo tambem. Por ultimo, verifica complemento.
function PersonagemTemPericia(chave, ranks, complemento) {
  if (ranks == null) {
    ranks = 1;
  }
  if (!(chave in gPersonagem.pericias.lista)) {
    return false;
  }
  if (gPersonagem.pericias.lista[chave].graduacoes < ranks) {
    return false;
  }
  return true;
}

// Limpa dependencias antes de comecar a conversao das entradas para o personagem. Tambem chamada na geracao de personagens.
function PersonagemLimpaGeral() {
  gPersonagem.classes.length = 0;
  gPersonagem.pontos_vida.bonus.Limpa();
  gPersonagem.pontos_vida.temporarios = 0;
  gPersonagem.pontos_vida.ferimentos_nao_letais = 0;
  gPersonagem.armas.length = 1;  // para manter desarmado.
  gPersonagem.armaduras.length = 0;
  gPersonagem.ca.bonus.Limpa();
  gPersonagem.iniciativa.Limpa();
  gPersonagem.atributos.pontos.gastos.disponiveis = 0;
  gPersonagem.atributos.pontos.gastos.length = 0;
  for (var atributo in tabelas_atributos) {
    gPersonagem.atributos[atributo].bonus.Limpa();
  }
  for (var i = 0; i < gPersonagem.pericias.lista.length; ++i) {
    gPersonagem.pericias.lista[i].bonus.Limpa();
  }
  for (var chave_classe in gPersonagem.feiticos) {
    gPersonagem.feiticos[chave_classe].em_uso = false;
    gPersonagem.feiticos[chave_classe].nivel_maximo = 0;
    for (var i = 0; i <= 9; ++i) {
      gPersonagem.feiticos[chave_classe].conhecidos[i].length = 0;
      gPersonagem.feiticos[chave_classe].slots[i].feiticos.length = 0;
      gPersonagem.feiticos[chave_classe].slots[i].feitico_dominio = null;
    }
  }
  gPersonagem.estilos_luta.length = 0;
  for (var tipo_salvacao in gPersonagem.salvacoes) {
    if (tipo_salvacao in { fortitude: '', reflexo: '', vontade: '' }) {
      gPersonagem.salvacoes[tipo_salvacao].Limpa();
    } else {
      delete gPersonagem.salvacoes[tipo_salvacao];
    }
  }
  for (var tipo_item in tabelas_itens) {
    gPersonagem[tipo_item].length = 0;
  }
  gPersonagem.especiais = {};
  gPersonagem.imunidades.length = 0;
  gPersonagem.resistencia_magia.length = 0;
  PersonagemLimpaPericias();
  PersonagemLimpaTalentos();
}

function PersonagemLimpaPericias() {
  for (var chave_pericia in gPersonagem.pericias.lista) {
    var pericia_personagem = gPersonagem.pericias.lista[chave_pericia];
    pericia_personagem.bonus.Limpa();
  }
}

function PersonagemLimpaTalentos() {
  for (var chave_talento in gPersonagem.talentos) {
    gPersonagem.talentos[chave_talento].length = 0;
  }
}

// Qualquer inicializacao do personagem eh feita aqui.
function IniciaPersonagem() {
  // entradas padroes para armas, armaduras e escudos.
  gPersonagem.armas.push(ConverteArma({
    chave: 'desarmado',
    nome_gerado: 'desarmado',
    texto_nome: Traduz('desarmado'),
    obra_prima: false,
    bonus: 0
  }));
}

// Encontra uma arma do personagem pelo nome gerado.
// @return a arma do personagem.
function ArmaPersonagem(nome_gerado) {
  for (var i = 0; i < gPersonagem.armas.length; ++i) {
    var arma = gPersonagem.armas[i];
    if (arma.nome_gerado == nome_gerado) {
      return arma;
    }
  }
  return null;
}

// @return true se alguma das classes do personagem fornece a proficiencia com armas por tipo.
// @param tipo_arma 'simples' ou 'comuns'.
function PersonagemProficienteTipoArma(tipo_arma) {
  var entrada_talento = 'usar_armas_' + tipo_arma;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var chave_classe = gPersonagem.classes[i].classe;
    var tabela_classe = tabelas_classes[chave_classe];
    var talentos_classe = tabela_classe.talentos || [];
    for (var j = 0; j < talentos_classe.length; ++j) {
      if (talentos_classe[j] == entrada_talento) {
        return true;
      }
    }
  }
  // Armas comuns eh por arma, mas armas simples abrange a categoria.
  if (tipo_arma == 'simples' && PersonagemPossuiTalento('usar_armas_simples')) {
    return true;
  }
  return false;
}

// Algumas armas sao identicas para proposito de especializacao, foco etc.
function _NormalizaNomeArma(chave_arma) {
  if (chave_arma.indexOf('arco_longo') == 0) {
    return 'arco_longo';
  } else if (chave_arma.indexOf('arco_curto') == 0) {
    return 'arco_curto';
  }
  return chave_arma;
}

// @return true se o personagem for proficiente com uma arma.
function PersonagemProficienteComArma(nome_arma) {
  // Verifica lista de armas.
  return gPersonagem.proficiencia_armas[_NormalizaNomeArma(nome_arma)] != null;
}

// @return o valor do foco do personagem com a arma (0, 1, 2).
// @param nome_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemFocoComArma(chave_arma) {
  return gPersonagem.foco_armas[_NormalizaNomeArma(chave_arma)];
}

// @return o valor da especialização do personagem com a arma (0, 2, 4).
// @param chave_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemEspecializacaoComArma(chave_arma) {
  return gPersonagem.especializacao_armas[_NormalizaNomeArma(chave_arma)];
}

// @return true se o personagem possuir a habilidade passada.
// @param chave da tabela de habilidades especiais (tabelas_especiais).
function PersonagemPossuiHabilidadeEspecial(chave) {
  for (var especial in gPersonagem.especiais) {
    if (especial == chave) {
      return true;
    }
  }
  return false;
}

// @param nome_talento nome do talento na tabela ou chave na tabela.
// @param complemento alguns talentos precisam de um complemento. Por exemplo,
//        conhecimento (complemento), usar_arma_comum (complemento).
// @return true se o personagem tiver o talento passado.
function PersonagemPossuiTalento(nome_talento, complemento) {
  for (var chave_classe in gPersonagem.talentos) {
    for (var i = 0; i < gPersonagem.talentos[chave_classe].length; ++i) {
      if (_TalentoIgual(gPersonagem.talentos[chave_classe][i],
                        nome_talento, complemento)) {
        return true;
      }
    }
  }
  return false;
}

// Retorna true se o personagem possuir o item magico passado.
function PersonagemPossuiItem(tipo_item, chave_item) {
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    if (gPersonagem[tipo_item][i].chave == chave_item) {
      return true;
    }
  }
  return false;
}

function PersonagemUsandoItem(tipo_item, chave_item) {
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    var item = gPersonagem[tipo_item][i];
    if (item.chave == chave_item && item.em_uso) {
      return true;
    }
  }
  return false;
}

function _TalentoIgual(talento_personagem, nome_talento, complemento) {
  var chave_talento = talento_personagem.chave;
  if (tabelas_talentos[chave_talento] == null) {
    return false;
  }
  if (nome_talento == chave_talento ||
      nome_talento == tabelas_talentos[chave_talento].nome) {
    // Talento nao tem complemento, nome igual.
    if (tabelas_talentos[chave_talento].complemento == null) {
      return true;
    }
    // Talento tem complemento, mas personagem nao.
    if (talento_personagem.complemento == null || talento_personagem.complemento == '') {
      return false;
    }
    // Complemento igual.
    if (talento_personagem.complemento == complemento) {
      return true;
    }
    // Complemento de arma eh mais complexo.
    if (tabelas_talentos[chave_talento].complemento == 'arma') {
      var chave_complemento = _NormalizaNomeArma(tabelas_armas_invertida[complemento]);
      var chave_complemento_personagem = _NormalizaNomeArma(tabelas_armas_invertida[talento_personagem.complemento]);
      return chave_complemento == chave_complemento_personagem;
    }
  }
  return false;
}

// @return true se o personagem possuir uma das classes passadas.
// @param classes array de classe.
function PersonagemPossuiUmaDasClasses(classes) {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    for (var j = 0; j < classes.length; ++j) {
      if (classes[j] == gPersonagem.classes[i].classe) {
        return true;
      }
    }
  }
  return false;
}

// @return o nivel total do personagem.
function PersonagemNivel() {
  return gPersonagem.dados_vida.nivel_personagem;
}

// @return o nivel do personagem na classe passada, zero se nao possuir.
function PersonagemNivelClasse(classe) {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].nivel;
    }
  }
  return 0;
}

// @return true se o personagem tem algum nivel de mago (ou mago_*).
function PersonagemTemNivelMago() {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (gPersonagem.classes[i].classe.indexOf('mago') == 0) {
      return true;
    }
  }
  return false;
}

// @param classe se null, retorna o maior de todas as classes.
// @return o nivel de conjurador de uma classe de personagem.
function PersonagemNivelConjuradorClasse(classe) {
  var nivel_conjurador = 0;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (classe == null) {
      if (gPersonagem.classes[i].nivel_conjurador > nivel_conjurador) {
        nivel_conjurador = gPersonagem.classes[i].nivel_conjurador;
      }
    } else if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].nivel_conjurador;
    }
  }
  return nivel_conjurador;
}

// @param classe
// @return indice da linha de feitico a ser usado para a classe.
function PersonagemLinhaTabelaFeiticos(classe) {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].linha_tabela_feiticos;
    }
  }
  // nao deveria chegar aqui.
  return 0;
}

// Verifica se o personagem atende aos requisitos do talento. Caso não atenda,
// alertará uma mensagem.
// @return descricao do erro caso a verificação falhe, null caso contrário.
function PersonagemVerificaPrerequisitosTalento(chave_talento, complemento) {
  var requisitos = tabelas_talentos[chave_talento].requisitos;
  var prefixo_erro = Traduz(tabelas_talentos[chave_talento].nome) + ' ' + Traduz('requer') + ' ';
  if (requisitos == null) {
    return null;
  }
  if (requisitos.bba) {
    if (gPersonagem.bba < requisitos.bba) {
      return (prefixo_erro + Traduz('BBA') + ' >= ' + requisitos.bba);
    }
  }
  for (var atributo in requisitos.atributos) {
    if (gPersonagem.atributos[atributo].bonus.Total() < requisitos.atributos[atributo]) {
      return (prefixo_erro + Traduz(tabelas_atributos[atributo]) + ' >= ' + requisitos.atributos[atributo]);
    }
  }
  for (var classe in requisitos.nivel) {
    if (classe == 'total') {
      if (gPersonagem.dados_vida.nivel_personagem < requisitos.nivel['total']) {
        return  (prefixo_erro + Traduz('nivel de personagem') + ' >= ' + requisitos.nivel['total']);
      }
    } else if (classe == 'conjurador') {
      if (PersonagemNivelConjuradorClasse(null) < requisitos.nivel['conjurador']) {
        return (prefixo_erro + Traduz('nivel de conjurador') + ' >= ' + requisitos.nivel[classe]);
      }
    } else {
      if (PersonagemNivelClasse(classe) < requisitos.nivel[classe]) {
        return (prefixo_erro + Traduz('nivel em ') + Traduz(tabelas_classes[classe].nome) + ' >= ' + requisitos.nivel[classe]);
      }
    }
  }
  for (var i = 0; requisitos.talentos && i < requisitos.talentos.length; ++i) {
    if (!PersonagemPossuiTalento(requisitos.talentos[i], complemento)) {
      return (prefixo_erro + Traduz('talento') + ' ' + Traduz(tabelas_talentos[requisitos.talentos[i]].nome) + ' ' +
             (complemento ? complemento : ''));
    }
  }
  if (requisitos.proficiencia_arma && complemento && complemento.length > 0) {
    var chave_arma = tabelas_armas_invertida[complemento];
    if (!PersonagemProficienteComArma(chave_arma)) {
      return (prefixo_erro + Traduz('proficiencia com ') + complemento);
    }
  }
  for (var pericia in requisitos.pericias) {
    if (!PersonagemTemPericia(pericia, requisitos.pericias[pericia])) {
      return (prefixo_erro + Traduz('pericia em ') + Traduz(tabelas_pericias[pericia].nome) + ', ' + requisitos.pericias[pericia] + ' ranks');
    }
  }
  return null;
}

// @TODO fazer a conversao de um tipo para outro.
// Adiciona moedas ao personagem. Valores podem ser negativos.
// O personagem nunca pode ficar com moedas negativas, neste caso
// a funcao nao fara nada.
// @param moedas um objeto contendo { ouro, platina, prata, cobre}
// @return true se foi possivel adicionar as moedas.
function PersonagemAdicionarMoedas(moedas) {
  // verifica fundos.
  for (var tipo_moeda in moedas) {
    if (gPersonagem.moedas[tipo_moeda] + moedas[tipo_moeda] < 0) {
      return false;
    }
  }

  for (var tipo_moeda in moedas) {
    gPersonagem.moedas[tipo_moeda] += moedas[tipo_moeda];
  }
  return true;
}

// @return a string de dados de vida do personagem.
function PersonagemStringDadosVida() {
  var primeiro = true;  // primeira classe nao eh sinalizada.
  var string_dados_vida = '';
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
      if (primeiro) {
        primeiro = false;
      } else {
        string_dados_vida += ' +';
      }
      string_dados_vida +=
        gPersonagem.classes[i].nivel + 'd' + tabelas_classes[gPersonagem.classes[i].classe].dados_vida;
  }
  if (gPersonagem.atributos.constituicao.modificador > 0) {
    string_dados_vida +=
      ' +' + (gPersonagem.atributos.constituicao.modificador * gPersonagem.dados_vida.nivel_personagem);
  }
  return string_dados_vida;
}

// @return o template do personagem ou null.
function PersonagemTemplate() {
  if (gPersonagem.template.length == 0) {
    return null;
  }
  if (!(gPersonagem.template in tabelas_template)) {
    return null;
  }
  return tabelas_template[gPersonagem.template];
}

// @tipo da classe: 'arcano' ou 'divino'.
// @return a classe com o maior nivel de conjurador para o tipo passado ou null se nao houver.
function PersonagemMaiorClasseConjurador(tipo) {
  var classes_por_tipo = {
    'arcano': { mago: true, feiticeiro: true, mago_necromante: true },
    'divino': { clerigo: true, druida: true },
  };
  var maior = null;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var classe_personagem = gPersonagem.classes[i];
    if (tipo != null && !(classe_personagem.classe in classes_por_tipo[tipo])) {
      continue;
    }
    // achou tipo certo.
    if (maior == null || classe_personagem.nivel_conjurador > maior.nivel_conjurador) {
      maior = classe_personagem;
    }
  }
  return maior;
}

function PersonagemTamanhoRaca() {
  return tabelas_raca[gPersonagem.raca].tamanho;
}

function PersonagemTamanhoEfetivo() {
  return gPersonagem.tamanho.categoria;
}
// Dados das racas.
var tabelas_raca = {
  aarakokra: {
      nome: 'Aarakocra',
      origem: { livro: 'Races of Faerun', pagina: '130' },
      ajuste_nivel: 2, armadura_natural: 1,
      movimento: { terrestre: 4, aereo: 18 },
      atributos: { forca: -2, destreza: 4 }, tamanho: 'medio',
      proficiencia_armas: [ 'azagaia' ],  // Javelin em ingles.
      bonus_pericias: { oficios: 2, conhecimento_natureza: 2, ouvir: 2, observar: 2 },
      arma_natural: { garra: { nome: 'Garra', dano: '1d4' } },
    },
  anao: {
      nome: 'Anão',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 4 },
      atributos: {constituicao: 2, carisma: -2}, tamanho: 'medio',
      familiaridade_arma: { machado_de_guerra_anao: true, urgrosh_anao: true },
      outras_salvacoes: { veneno: { base: ['fortitude'], bonus: 2 },
                          magias: { base: ['fortitude', 'reflexo', 'vontade' ], bonus: 2, } },
  },
  goblin: {
      nome: 'Goblin',
      origem: { livro: 'Monster Manual', pagina: '133' },
      movimento: { terrestre: 6 },
      atributos: { forca: -2, destreza: 2, carisma: -2 }, tamanho: 'pequeno',
      bonus_pericias: { furtividade: 4, cavalgar: 4 },
  },
  halfling: {
      nome: 'Halfling',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 4 },
      atributos: { forca: -2, destreza: 2}, tamanho: 'pequeno',
      bonus_ataque: { categorias: { arremesso: 1 }, armas: { funda: 1 } },
      salvacoes: { fortitude: 1, vontade: 1, reflexo: 1 },
  },
  hobgoblin: {
      nome: 'Hobgoblin',
      origem: { livro: 'Monster Manual' },
      movimento: { terrestre: 6 },
      atributos: { destreza: 2, constituicao: 2 }, tamanho: 'medio',
      bonus_pericias: { furtividade: 4 },
      ajuste_nivel: 1,
  },
  humano: {
      nome: 'Humano',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: {}, tamanho: 'medio', talento_extra: true, pontos_pericia: 1 },
  elfo: {
      nome: 'Elfo',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: { destreza: +2, constituicao: -2 }, tamanho: 'medio',
      proficiencia_armas: [ 'espada_longa', 'sabre', 'arco_longo', 'arco_longo_composto', 'arco_curto',
                            'arco_curto_composto'],
      // Visao penumbra.

      bonus_pericias: { ouvir: 2, procurar: 2, observar: 2 },
      outras_salvacoes: { encantamento: { base: ['vontade'], bonus: 2 } },
  },
  elfo_drow: {
      nome: 'Elfo (Drow)',
      origem: { livro: 'Forgotten Realms', pagina: '13' },
      movimento: { terrestre: 6 },
      atributos: { destreza: +2, inteligencia: 2, carisma: 2, constituicao: -2 }, tamanho: 'medio',
      proficiencia_armas: [ 'sabre', 'espada_curta', 'besta_leve', 'besta_de_mao'],
      bonus_pericias: { ouvir: 2, procurar: 2, observar: 2 },
      outras_salvacoes: { encantamento: { base: ['vontade'], bonus: 2 } },
      especiais: {
        1: ['visao_escuro'  /*24 q*/, 'cegueira_luz_intensa', 'globo_luz', 'fogo_fadas', 'escuridao'],
      },
      ajuste_nivel: 2,
  },
  genasi_agua: {
      nome: 'Genasi (Água)',
      origem: { livro: 'Forgotten Realms', pagina: '20' },
      movimento: { terrestre: 6, aquatico: 6 },
      atributos: { constituicao: 2, carisma: -2 }, tamanho: 'medio',
      ajuste_nivel: 1,
      // +1 contra agua no primeiro. TODO: +1 a cada 5 niveis.
      outras_salvacoes: { agua: { base: ['reflexo'], bonus: 1 } },
      // visao no escuro 60 pes (12 quadrados).
      // Criar agua como druida de 5o nivel.
  },
  genasi_ar: {
      nome: 'Genasi (Ar)',
      origem: { livro: 'Forgotten Realms', pagina: '19' },
      movimento: { terrestre: 6 },
      atributos: { destreza: 2, inteligencia: 2, sabedoria: -2, carisma: -2 }, tamanho: 'medio',
      ajuste_nivel: 1,
      // +1 contra agua no primeiro. TODO: +1 a cada 5 niveis.
      outras_salvacoes: { ar: { base: ['reflexo'], bonus: 1 } },
      // Nao respira.
      // visao no escuro 60 pes (12 quadrados).
      // Levitar como feiticeiro de 5o nivel.
  },
  genasi_fogo: {
      nome: 'Genasi (Fogo)',
      origem: { livro: 'Forgotten Realms', pagina: '20' },
      movimento: { terrestre: 6 },
      atributos: { inteligencia: 2, carisma: -2 }, tamanho: 'medio',
      ajuste_nivel: 1,
      // +1 contra fogo no primeiro. TODO: +1 a cada 5 niveis.
      outras_salvacoes: { fogo: { base: ['reflexo'], bonus: 1 } },
      // visao no escuro 60 pes (12 quadrados).
      // Controlar chamas como feiticeiro de 5o nivel.
  },
  genasi_terra: {
      nome: 'Genasi (Terra)',
      origem: { livro: 'Forgotten Realms', pagina: '19' },
      movimento: { terrestre: 6 },
      atributos: { forca: 2, constituicao: 2, sabedoria: -2, carisma: -2 }, tamanho: 'medio',
      ajuste_nivel: 1,
      // visao no escuro 60 pes (12 quadrados).
      // Passo sem pegada uma vez por dia como druida de 5o.
  },
  gnomo: {
      nome: 'Gnomo',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 4 },
      atributos: { forca: -2, constituicao: +2 }, tamanho: 'pequeno',
      familiaridade_arma: { martelo_gnomo_com_gancho: true },
      outras_salvacoes: { ilusões: { base: ['fortitude', 'reflexo', 'vontade'], bonus: 2 } },
  },
  meioelfo: {
      nome: 'Meio-Elfo',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: {}, tamanho: 'medio',
      bonus_pericias: { diplomacia: 2, obter_informacao: 2, ouvir: 1, procurar: 1, observar: 1 },
      outras_salvacoes: { encantamento: { base: ['vontade'], bonus: 2 } },
  },
  meioorc: {
      nome: 'Meio-Orc',
      origem: { livro: 'Livro do Jogador', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: { forca: 2, inteligencia: -2, carisma: -2 }, tamanho: 'medio',
  },
  orc: {
      nome: 'Orc',
      origem: { livro: 'Livro dos Monstros', pagina: '' },
      movimento: { terrestre: 6 },
      atributos: { forca: 4, inteligencia: -2, sabedoria: -2, carisma: -2 }, tamanho: 'medio',
      // visao no escuro 60 pes (12 quadrados).
  },
};

var tabelas_template = {
  demoniaco: {
    nome: 'Demoníaco',
    tipo: 'extra-planar',
    origem: { },
    especiais: {
      1: ['visao_escuro', 'resistencia_frio_fogo_5', 'destruir_bem'],
      8: ['resistencia_frio_fogo_10'],
    },
    reducao_dano: {
      por_nivel: {
        4: { valor: '5', sobrepassar: ['magia'] },
        12: { valor: '10', sobrepassar: ['magia'] },
      },
    },
    resistencia_magia: [
      { chave: 'magia', por_nivel: 5 },  // ganha hd +5.
    ],
  },
  lich: {
    nome: 'Lich',
    tipo: 'morto-vivo',
    origem: { },
    dados_vida: 12,
    //armadura_natural: 5,
    bonus_ca: { armadura_natural: 5 },
    arma_natural: { toque: { nome: 'Toque', dano: '1d8+5' } }, // 1 vez rodada energia negativa, paralisia, tem save de von
    aura: { tipo: 'medo', raio: '12 quadrados' },
    reducao_dano: { valor: '15', sobrepassar: ['estourante', 'magia']},
    bonus_pericias: { esconderse: 8, furtividade: 8, ouvir: 8, procurar: 8, sentir_motivacao: 8, observar: 8 },
    atributos: { inteligencia: 2, sabedoria: 2, carisma: 2 },
    resistencia_espantar: 4,
    imunidades: ['frio', 'eletricidade', 'polimorfismo', 'efeitos mentais'],
  },
  vulto: {
    nome: 'Vulto',
    tipo: 'extra-planar',
    atributos: { constituicao: 2, carisma: 2 },
    ajuste_nivel: 5,  // (monster update).
    bonus_ataque: { competencia: 2 },
    bonus_dano: { competencia: 2 },
    bonus_pericias: { esconderse: 8, furtividade: 8, ouvir: 4, observar: 4 },
    bonus_ca: { deflexao: 4 },
    bonus_movimento: { terrestre: 4 },
    especiais: {
      1: ['visao_escuro'  /*12 q*/, 'imagem_das_sombras_3', 'invisibilidade', 'cura_acelerada_2', 'controlar_luz', 'competencia_ataque_dano_2'],
      8: ['atravessar_sombras'],
      12: ['viajar_pelas_sombras'],
    },
    resistencia_magia: [
      { chave: 'magia', por_nivel: 11 },  // ganha hd +11.
    ],
    bonus_salvacoes: { fortitude: { sorte: 4 }, vontade: { sorte: 4 }, reflexo: { sorte: 4 } },
  },
}

// Dados relacionados a classes.
// TODO passar tudo de classes pra ca.
var tabelas_classes = {
  barbaro: {
    nome: 'Bárbaro', dados_vida: 12, pontos_pericia: 4, bba: bba_forte,
    talentos: [ 'usar_armas_simples', 'usar_armas_comuns' ],
  },
  bardo: {
    nome: 'Bardo', dados_vida: 6, pontos_pericia: 6, bba: bba_medio,
    nivel_conjurador: { modificador: 1.0 },
    talentos: [ 'usar_armas_simples' ],
    proficiencia_armas: [ 'espada_longa', 'sabre', 'porrete',  'espada_curta', 'arco_curto', 'chicote' ]
  },
  clerigo: {
    nome: 'Clérigo', dados_vida: 8, pontos_pericia: 2,  bba: bba_medio,
    nivel_conjurador: { modificador: 1.0, },
    talentos: [ 'usar_armas_simples' ],
    especiais: {
      1: [ 'expulsar_fascinar_mortos_vivos' ],
    },
  },
  druida: { nome: 'Druida', dados_vida: 8, pontos_pericia: 4, bba: bba_medio,
    nivel_conjurador: { modificador: 1.0, },
    especiais: {
      1: [ 'companheiro_animal', 'senso_natureza', 'empatia_natureza' ],
      2: [ 'caminho_floresta' ],
      3: [ 'rastro_invisivel' ],
      4: [ 'resistir_tentacao_natureza' ],
      5: [ 'forma_selvagem' ],
    },
    proficiencia_armas: [ 'clava', 'adaga', 'dardo', 'bordao', 'cimitarra', 'foice_curta',
                          'lanca_curta', 'funda', 'lanca' ],
  },
  guerreiro: {
    nome: 'Guerreiro', dados_vida: 10, pontos_pericia: 2, bba: bba_forte,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
  },
  feiticeiro: {
    nome: 'Feiticeiro', dados_vida: 4, pontos_pericia: 2, bba:
    bba_fraco, nivel_conjurador: { modificador: 1.0, },
    talentos: [ 'usar_armas_simples' ],
    especiais: {
      1: ['familiar'],
    },
  },
  ladino: {
    nome: 'Ladino', dados_vida: 6, pontos_pericia: 8, bba: bba_medio,
    talentos: [ 'usar_armas_simples' ],
    proficiencia_armas: [ 'besta_de_mao', 'sabre', 'porrete', 'arco_curto', 'espada_curta' ],
    especiais: {
      1: [ 'ataque_furtivo', 'encontrar_armadilha' ],
      2: [ 'evasao' ],
      3: [ 'ataque_furtivo', 'sentir_armadilha' ],
      4: [ 'esquiva_sobrenatural' ],
      5: [ 'ataque_furtivo' ],
      6: [ 'sentir_armadilha', ],
      7: [ 'ataque_furtivo', ],
    },
  },
  mago: {
    nome: 'Mago', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    nivel_conjurador: { modificador: 1.0, },
    talentos: ['usar_armas_simples' ],
    proficiencia_armas: [ 'clava', 'adaga', 'besta_pesada', 'besta_leve', 'bordao' ],
    especiais: {
      1: ['familiar'],
      5: ['talento'],
      10: ['talento'],
      15: ['talento'],
      20: ['talento'],
    },
  },
  mago_necromante: {
    nome: 'Mago Necromante', dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    nivel_conjurador: { modificador: 1.0, },
    talentos: ['usar_armas_simples' ],
    proficiencia_armas: [ 'clava', 'adaga', 'besta_pesada', 'besta_leve', 'bordao' ],
    especiais: {
      1: ['familiar'],
    },
  },
  monge: {
    nome: 'Monge', dados_vida: 8, pontos_pericia: 4, bba: bba_medio,
    proficiencia_armas: [ 'clava', 'besta_leve', 'besta_pesada', 'adaga', 'machadinha', 'azagaia',
                          'kama', 'nunchaku', 'bordao', 'sai', 'shuriken', 'siangham', 'funda' ],
    especiais: {
      1: [ 'talento', 'rajada_de_golpes', 'ataque_desarmado' ],
      2: [ 'talento', 'evasao' ],
      3: [ 'mente_tranquila' ],
      4: [ 'ataque_chi_magico', 'queda_suave_6m' ],
      5: [ 'pureza_corporal', 'bonus_ca' ],
      6: [ 'talento', 'queda_suave_9m' ],
      7: [ 'integridade_corporal', ],
      8: [ 'queda_suave_12m', ],
      9: [ 'evasao_aprimorada', ],
      10: [ 'ataque_chi_ordem', 'queda_suave_15m', 'bonus_ca' ],
      11: [ 'corpo_diamante', 'rajada_maior', ],
      12: [ 'passo_etereo', 'queda_suave_18m' ],
      13: [ 'alma_diamante', ],
      14: [ 'queda_suave_21m', ],
      15: [ 'mao_vibrante', 'bonus_ca' ],
      16: [ 'ataque_chi_adamante', 'queda_suave_24m' ],
      17: [ 'corpo_atemporal', 'idiomas_sol_lua', ],
      18: [ 'queda_suave_27m', ],
      19: [ 'corpo_vazio', ],
      20: [ 'auto_perfeicao', 'queda_suave_inf', 'bonus_ca' ],
    },
  },
  paladino: { nome: 'Paladino', dados_vida: 10, pontos_pericia: 2, bba: bba_forte,
    nivel_conjurador: { modificador: 0.5, minimo: 4, },
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
    especiais: {
      1: [ 'aura_bem', 'detectar_mal', 'destruir_mal', ],
      2: [ 'graca_divina', 'cura_pelas_maos', ],
      3: [ 'aura_coragem', 'saude_divina', ],
      4: [ 'expulsar_fascinar_mortos_vivos', ],
      5: [ 'destruir_mal', 'montaria_especial', ],
      6: [ 'remover_doenca', ],
      9: [ 'remover_doenca', ],
      10: [ 'destruir_mal', ],
      12: [ 'remover_doenca' ],
      15: [ 'remover_doenca', 'destruir_mal', ],
      18: [ 'remover_doenca', ],
      20: [ 'destruir_mal' ],
    },
  },
  ranger: {
    nome: 'Ranger', dados_vida: 8, pontos_pericia: 6, bba: bba_forte,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
    nivel_conjurador: { modificador: 0.5, minimo: 4, },
    especiais: {
      1: [ 'inimigo_predileto', 'rastrear', 'empatia_natureza', ],
      2: [ 'estilo_combate', ],
      3: [ 'tolerancia', ],
      4: [ 'companheiro_animal', ],
      5: [ 'inimigo_predileto', ],
      6: [ 'estilo_combate_aprimorado', ],
      7: [ 'caminho_floresta', ],
      8: [ 'rastreador_eficaz', ],
      9: [ 'evasao' ],
      10: [ 'inimigo_predileto', ],
      11: [ 'maestria_estilo_combate', ],
      13: [ 'camuflagem' ],
      15: [ 'inimigo_predileto' ],
      17: [ 'mimetismo'],
      20: ['inimigo_predileto'],
    },
  },
  // classes NPC
  adepto: {
    nome: 'Adepto', mestre: true, dados_vida: 6, pontos_pericia: 2, bba: bba_fraco,
    nivel_conjurador: { modificador: 1.0, },
    talentos: ['usar_armas_simples' ],
  },
  aristocrata: {
    nome: 'Aristocrata', mestre: true, dados_vida: 8, pontos_pericia: 4, bba: bba_medio,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
  },
  plebeu: {
    nome: 'Plebeu', mestre: true, dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    proficiencia_armas: ['clava'],
  },
  expert: {
    nome: 'Expert', mestre: true, dados_vida: 6, pontos_pericia: 6, bba: bba_medio,
    talentos: ['usar_armas_simples' ],
  },
  combatente: {
    nome: 'Combatente', mestre: true, dados_vida: 8, pontos_pericia: 2, bba: bba_forte,
    talentos: [ 'usar_armas_simples',  'usar_armas_comuns' ],
  },
  // Prestigio.
  dragao_purpura: {
    nome: 'Dragão Púrpura', prestigio: true, dados_vida: 10, pontos_pericia: 2, bba: bba_forte,
    especiais: {
      1: [ 'escudo_heroico', 'grito_guerra' ],
      2: [ 'inspirar_coragem' ],
      3: [ 'medo' ],
      4: [ 'inspirar_coragem', 'juramento_furia', ],
      5: [ 'resistencia_final' ],
    },
    requisitos: {
      tendencia: [ 'NB', 'N', 'LB'],
      regiao: [ 'Cormyr'],
      bba: 4,
      // TODO: diplomacia ou intimidar 1.
      pericias: { diplomacia: 1, ouvir: 2, cavalgar: 2, observar: 2, },
      talentos: [ 'lideranca', 'combate_montado' ],
      outros: 'Deve ser membro dos Dragões Púrpura',
    },
  },
  teurgista_mistico: {
    nome: 'Teurgista Místico', prestigio: true, dados_vida: 4, pontos_pericia: 2, bba: bba_fraco,
    incremento_nivel_conjurador: ['arcano', 'divino'],
    especiais: {
    },
    requisitos: {
      // TODO: diplomacia ou intimidar 1.
      pericias: { conhecimento_arcano: 6, conhecimento_religiao: 6, },
    },
  },
};

// Todo especial com vezes por dia deve definir vezes, senao nada sera mostrado na interface.
var tabelas_especiais = {
  alma_diamante: { nome: 'Alma Diamante' },
  aptidao_items_magicos: { nome: 'Aptidão Items Mágicos' },
  ataque_chi_magico: { nome: 'Ataque Chi (Mágico)' },
  ataque_chi_ordem: { nome: 'Ataque Chi (Ordem)' },
  ataque_chi_adamante: { nome: 'Ataque Chi (Adamante)' },
  ataque_desarmado: { nome: 'Ataque Desarmado' },
  ataque_furtivo: { nome: 'Ataque furtivo', vezes: { fixo: 1 } },
  atravessar_sombras: { nome: 'Atravessar Sombras' },
  aura_bem: { nome: 'Aura do bem', },
  aura_coragem: { nome: 'Aura de coragem' },
  auto_perfeicao: { nome: 'Auto-Perfeição' },
  boa_sorte: { nome: 'Boa Sorte', vezes: { fixo: 1 } },
  bonus_ca: { nome: 'Bonus CA' },
  caminho_floresta: { nome: 'Caminho da Floresta' },
  cegueira_luz_intensa: { nome: 'Cegueira sob Luz Intensa' },
  competencia_ataque_dano_2: { nome: '+2 ataque e dano por competência' },
  destruir: { nome: 'Destruir' },
  escudo_protecao: { nome: 'Escudo de Proteção', vezes: { fixo: 1 } },
  escuridao: { nome: 'Escuridão (1/dia)', vezes: { fixo: 1 }  },
  globo_luz: { nome: 'Globos de Luz (1/dia)', vezes: { fixo: 1 } },
  falar_com_animais: { nome: 'Falar com Animais' },
  feito_de_forca: { nome: 'Feito de Força', vezes: { fixo: 1 } },
  fogo_fadas: { nome: 'Fogo das Fadas (1/dia)', vezes: { fixo: 1 } },
  fascinar_plantas: {
    nome: 'Fascinar/Comandar Plantas',
    vezes: { fixo: 3, atributo: 'carisma', talento: { chave: 'expulsao_adicional', fixo: 4 } } },
  estilo_combate_aprimorado: { nome: 'Estilo de Combate Aprimorado' },
  expulsar_fascinar_mortos_vivos: {
    nome: 'Expulsar/fascinar mortos vivos',
    vezes: { fixo: 3, atributo: 'carisma', talento: { chave: 'expulsao_adicional', fixo: 4 } } },
  expulsar_fascinar_criaturas_agua: {
    nome: 'Expulsar/fascinar criaturas de água',
    vezes: { fixo: 3, atributo: 'carisma', talento: { chave: 'expulsao_adicional', fixo: 4 } } },
  expulsar_fascinar_criaturas_ar: {
    nome: 'Expulsar/fascinar criaturas de ar',
    vezes: { fixo: 3, atributo: 'carisma', talento: { chave: 'expulsao_adicional', fixo: 4 } } },
  expulsar_fascinar_criaturas_fogo: {
    nome: 'Expulsar/fascinar criaturas de fogo',
    vezes: { fixo: 3, atributo: 'carisma', talento: { chave: 'expulsao_adicional', fixo: 4 } } },
  expulsar_fascinar_criaturas_terra: {
    nome: 'Expulsar/fascinar criaturas de terra',
    vezes: { fixo: 3, atributo: 'carisma', talento: { chave: 'expulsao_adicional', fixo: 4 } } },
  camuflagem: { nome: 'Camuflagem', },
  companheiro_animal: { nome: 'Companheiro animal', },
  controlar_luz: { nome: 'Controlar Luz' },
  corpo_diamante: { nome: 'Corpo de Diamante' },
  corpo_atemporal: { nome: 'Corpo Atemporal' },
  corpo_vazio: { nome: 'Corpo Vazio' },
  cura_acelerada_2: { nome: 'Cura Acelerada (2)', },
  cura_pelas_maos: { nome: 'Cura pelas mãos', /* TODO carisma x nivel paladino */},
  destruir_bem: { nome: 'Destruir o bem', },
  destruir_mal: { nome: 'Destruir o mal', },
  detectar_mal: { nome: 'Detectar o mal', },
  empatia_natureza: { nome: 'Empatia com a natureza', },
  encontrar_armadilha: { nome: 'Encontrar armadilha', },
  evasao: { nome: 'Evasão', },
  evasao_aprimorada: { nome: 'Evasão Aprimorada', },
  escudo_heroico: { nome: 'Escudo Heróico', },
  esquiva_sobrenatural: { nome: 'Esquiva Sobrenatural', },
  estilo_combate: { nome: 'Estilo de Combate' },
  expulsao_aprimorada_mortos_vivos: { nome: 'Expulsao Aprimorada Contra Mortos-Vivos', vezes: { fixo: 1 } },
  familiar: { nome: 'Familiar', },
  forma_selvagem: { nome: 'Forma selvagem', },
  graca_divina: { nome: 'Graça divina', },
  grito_guerra: { nome: 'Grito de Guerra', },
  imagem_das_sombras_3: { nome: 'Imagem das Sombras (3/dia)', vezes: { fixo: 3 }  },
  idiomas_sol_lua: { nome: 'Idiomas do Sol e da Lua' },
  inimigo_predileto: { nome: 'Inimigo Predileto' },
  inspirar_coragem: { nome: 'Inspirar Coragem', },
  invisibilidade: { nome: 'Invisibilidade', },
  integridade_corporal: { nome: 'Integridade Corporal' },
  juramento_furia: { nome: 'Juramento de Fúria', },
  maestria_estilo_combate: { nome: 'Maestria do Estilo de Combate' },
  mao_vibrante: { nome: 'Mão Vibrante' },
  medo: { nome: 'Medo', },
  mente_tranquila: { nome: 'Mente Tranquila' },
  mimetismo: { nome: 'Mimetismo' },
  montaria_especial: { nome: 'Montaria especial', },
  mordida_venenosa: { nome: 'Mordida Venenosa' },
  movimentacao_livre: {
    nome: 'Movimentacao Livre',
    vezes: { fixo: 0, nivel: 'clerigo', } },
  passo_etereo: { nome: 'Passo Etéreo' },
  pureza_corporal: { nome: 'Pureza Corporal' },
  queda_suave_6m: { nome: 'Queda Suave (6m)' },
  queda_suave_9m: { nome: 'Queda Suave (9m)' },
  queda_suave_12m: { nome: 'Queda Suave (12m)' },
  queda_suave_15m: { nome: 'Queda Suave (15m)' },
  queda_suave_18m: { nome: 'Queda Suave (18m)' },
  queda_suave_21m: { nome: 'Queda Suave (21m)' },
  queda_suave_24m: { nome: 'Queda Suave (24m)' },
  queda_suave_27m: { nome: 'Queda Suave (27m)' },
  queda_suave_inf: { nome: 'Queda Suave (sem limite)' },
  senso_natureza: { nome: 'Senso da natureza', },
  rajada_de_golpes: { nome: 'Rajada de Golpes'},
  rajada_maior: { nome: 'Rajada Maior'},
  rastrear: { nome: 'Rastrear' },
  rastreador_eficaz: { nome: 'Rastreador Eficaz' },
  rastro_invisivel: { nome: 'Rastro invisível', },
  resistencia_frio_fogo_5: { nome: 'Resistência a Frio e Fogo (5)'},
  resistencia_frio_fogo_10: { nome: 'Resistência a Frio e Fogo (10)'},
  resistencia_final: {nome: 'Resistência Final', },
  resistir_tentacao_natureza: { nome: 'Resistir tentação da natureza', },
  remover_doenca: { nome: 'Remover Doença', },
  sentir_armadilha: { nome: 'Sentir armadilha', },
  saude_divina: { nome: 'Saúde divina', },
  talento: { nome: 'Talento' },
  toque_morte: { nome: 'Toque da Morte' },
  tolerancia: { nome: 'Tolerancia' },
  viajar_pelas_sombras: { nome: 'Viajar pelas Sombras' },
  visao_escuro: { nome: 'Visão no Escuro' },
  visao_penumbra: { nome: 'Visão na Penumbra' },
};

// Bonus base de ataque.
function bba_forte(nivel) {
  if (nivel == 0) return 0;
  return nivel;
};
function bba_medio(nivel) {
  if (nivel == 0) return 0;
  var ret = (nivel - 1);
  var mod = Math.floor(nivel / 4);
  if (nivel % 4 == 0) { --mod; }
  return ret - mod;
}
function bba_fraco(nivel) {
  if (nivel == 0) return 0;
  return Math.floor(nivel / 2);
}
function bba_nulo() {
  return 0;
}

// Atributos:
// Modificador.
function modificador_atributo(valor_atributo) {
  return Math.floor((valor_atributo - 10) / 2);
}
// Feiticos.
// @return um array de 0-9 onde o 0 eh sempre zerado pois
//         nao ha bonus para nivel 0.
function feiticos_atributo(valor_atributo) {
  // A cada 4 pontos, ganha um novo nos de baixo.
  var modificador = modificador_atributo(valor_atributo);
  var feiticos_nivel = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
  for (var nivel = 1; nivel <= 9; ++nivel) {
    if (modificador < nivel) {
      continue;
    }
    feiticos_nivel[nivel] = Math.floor(((modificador - nivel) / 4) + 1);
  }
  return feiticos_nivel;
}

// Salvacoes
function salvacao_forte(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 2) + 2 : 0;
}
function salvacao_fraca(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 3) : 0;
}

var tabelas_nome_salvacao = {
  fortitude: 'Fortitude',
  reflexo: 'Reflexo',
  vontade: 'Vontade',
};

// TODO passar para tabela de classes.
// Tabelas de salvacao.
var tabelas_salvacao = {
  barbaro: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  bardo: {
    fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_forte },
  clerigo: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
  druida: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
  feiticeiro: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  guerreiro: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  ladino: {
    fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_fraca },
  mago: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  mago_necromante: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  monge: {
    fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_forte },
  paladino: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  ranger: {
    fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_fraca },
  // classes NPC
  adepto: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  aristocrata: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  plebeu: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  expert: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  combatente: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  // Prestigio.
  dragao_purpura: {
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  teurgista_mistico: {
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
};

// Tabelas de tamanho.
var tabelas_tamanho = {
  minusculo: { nome: 'Minúsculo', ataque_defesa: 8, agarrar: -16, menor: null, maior: 'diminuto' },
  diminuto: { nome: 'Diminuto', ataque_defesa: 4, agarrar: -12, menor: 'minusculo', maior: 'miudo' },
  miudo: { nome: 'Miúdo', ataque_defesa: 2, agarrar: -8, menor: 'diminuto', maior: 'pequeno' },
  pequeno: { nome: 'Pequeno', ataque_defesa: 1, agarrar: -4, menor: 'miudo', maior: 'medio' },
  medio: { nome: 'Médio', ataque_defesa: 0, agarrar: 0, menor: 'pequeno', maior: 'grande' },
  grande: { nome: 'Grande', ataque_defesa: -1, agarrar: 4, menor: 'medio', maior: 'enorme' },
  enorme: { nome: 'Enorme', ataque_defesa: -2, agarrar: 8, menor: 'grande', maior: 'imenso' },
  imenso: { nome: 'Imenso', ataque_defesa: -4, agarrar: 12, menor: 'enorme', maior: 'colossal' },
  colossal: { nome: 'Colossal', ataque_defesa: -8, agarrar: 16, menor: 'imenso', maior: null },
};

// Conversao de dado de tamanho medio para outros tipos.
var tabelas_dado_por_tamanho = {
  '1d2': {
    pequeno: '1',
    grande: '1d3', enorme: '1d4', imenso: '1d6', colossal: '1d8' },
  '1d3': {
    miudo: '1', pequeno: '1d2',
    grande: '1d4', enorme: '1d6', imenso: '1d8', colossal: '2d6' },
  '1d4': {
    diminuto: '1', miudo: '1d2', pequeno: '1d3',
    grande: '1d6', enorme: '1d8', imenso: '2d6', colossal: '3d6' },
  '1d6': {
    minusculo: '1', diminuto: '1d2', miudo: '1d3', pequeno: '1d4',
    grande: '1d8', enorme: '2d6', imenso: '3d6', colossal: '4d6' },
  '1d8': {
    minusculo: '1d2', diminuto: '1d3', miudo: '1d4', pequeno: '1d6',
    grande: '2d6', enorme: '3d6', imenso: '4d6', colossal: '6d6' },
  '1d10': {
    minusculo: '1d3', diminuto: '1d4', miudo: '1d6', pequeno: '1d8',
    grande: '2d8', enorme: '3d8', imenso: '4d8', colossal: '6d8' },
  '1d12': {
    minusculo: '1d4', diminuto: '1d6', miudo: '1d8', pequeno: '1d10',
    grande: '3d6', enorme: '4d6', imenso: '6d6', colossal: '8d6' },
  '2d4': {
    minusculo: '1d2', diminuto: '1d3', miudo: '1d4', pequeno: '1d6',
    grande: '2d6', enorme: '3d6', imenso: '4d6', colossal: '6d6' },
  '2d6': {
    minusculo: '1d4', diminuto: '1d6', miudo: '1d8', pequeno: '1d10',
    grande: '3d6', enorme: '4d6', imenso: '6d6', colossal: '8d6' },
  '2d8': {
    minusculo: '1d6', diminuto: '1d8', miudo: '1d10', pequeno: '2d6',
    grande: '3d8', enorme: '4d8', imenso: '6d8', colossal: '8d8' },
  '2d10': {
    minusculo: '1d8', diminuto: '1d10', miudo: '2d6', pequeno: '2d8',
    grande: '4d8', enorme: '6d8', imenso: '8d8', colossal: '12d8' },
};

var tabelas_armaduras_leves = {
  nenhuma: {
    nome: 'Nenhuma', bonus: 0, preco: '0 PO' },
  acolchoada: {
    nome: 'Acolchoada', bonus: 1, maximo_bonus_destreza: 8, preco: '5 PO' },
  armadura_arcana: {
    nome: 'Armadura Arcana', bonus: 4, maximo_bonus_destreza: 100, preco: '0 PO' },
  couro: {
    nome: 'Couro', bonus: 2,  maximo_bonus_destreza: 6, preco: '10 PO' },
  couro_batido: {
    nome: 'Couro Batido', bonus: 3, maximo_bonus_destreza: 5, preco: '25 PO' },
  camisao_cota_de_malha: {
    nome: 'Camisão de Cota de Malha', bonus: 4, maximo_bonus_destreza: 4, preco: '100 PO' },
};

var tabelas_armaduras_medias = {
  gibao_de_peles: {
    nome: 'Gibão de Peles', bonus: 3, maximo_bonus_destreza: 4, preco: '15 PO' },
  brunea: {
    nome: 'Brunea', bonus: 4, maximo_bonus_destreza: 3, preco: '50 PO' },
  cota_de_malha: {
    nome: 'Cota de Malha', bonus: 5, maximo_bonus_destreza: 2, preco: '150 PO' },
  peitoral_de_aco: {
    nome: 'Peitoral de Aço', bonus: 5, maximo_bonus_destreza: 3, preco: '200 PO' },
};

var tabelas_armaduras_pesadas = {
  cota_de_talas: {
    nome: 'Cota de Talas', bonus: 6, maximo_bonus_destreza: 0, preco: '200 PO' },
  loriga_segmentada: {
    nome: 'Loriga Segmentada', bonus: 6, maximo_bonus_destreza: 1, preco: '250 PO' },
  meia_armadura: {
    nome: 'Meia Armadura', bonus: 7, maximo_bonus_destreza: 0, preco: '600 PO' },
  armadura_de_batalha: {
    nome: 'Armadura de Batalha', bonus: 8, maximo_bonus_destreza: 1, preco: '1500 PO' },
};

// Tabelas de armaduras, construida dinamicamente atraves das tabelas_armaduras_*.
var tabelas_armaduras = {
};

// Mapeia o nome para a chave. Construida dinamicamente.
var tabelas_armaduras_invertida = {
  // Cada entrada: nome_completo: chave_entrada.
};

// Tabelas de escudos (TODO terminar outros atributos).
var tabelas_escudos = {
  nenhum: { nome: 'Nenhum', bonus: 0, preco: '0 PO' },
  broquel: { nome: 'Broquel', bonus: 1, preco: '15 PO' },
  leve_madeira: { nome: 'Escudo Leve de Madeira', bonus: 1, preco: '3 PO' },
  leve_aco: { nome: 'Escudo Leve de Aço', bonus: 1, preco: '9 PO' },
  pesado_madeira: { nome: 'Escudo Pesado de Madeira', bonus: 2, preco: '7 PO' },
  pesado_aco: { nome: 'Escudo Pesado de Aço', bonus: 2, preco: '20 PO' },
  corpo: { nome: 'Escudo de Corpo', bonus: 4, maximo_bonus_destreza: 2, preco: '30 PO' },
};

// Dano do monge por nivel.
var tabelas_monge_desarmado = {
  1: { dano: { medio: '1d6' } },
  2: { dano: { medio: '1d6' } },
  3: { dano: { medio: '1d6' } },
  4: { dano: { medio: '1d8' } },
  5: { dano: { medio: '1d8' } },
  6: { dano: { medio: '1d8' } },
  7: { dano: { medio: '1d8' } },
  8: { dano: { medio: '1d10' } },
  9: { dano: { medio: '1d10' } },
  10: { dano: { medio: '1d10' } },
  11: { dano: { medio: '1d10' } },
  12: { dano: { medio: '2d6' } },
  13: { dano: { medio: '2d6' } },
  14: { dano: { medio: '2d6' } },
  15: { dano: { medio: '2d6' } },
  16: { dano: { medio: '2d8' } },
  17: { dano: { medio: '2d8' } },
  18: { dano: { medio: '2d8' } },
  19: { dano: { medio: '2d8' } },
  20: { dano: { medio: '2d10' } },
};

// Mapeia o nome para a chave. Necessario para computar proficiencias.
var tabelas_armas_invertida = {
  // Cada entrada: nome_completo: chave_entrada.
};

// Esta tabela eh composta pela juncao das tabelas de armas simples, comuns e exoticas.
var tabelas_armas = {
  // Cada entrada (dano secundario apenas para armas duplas):
  // chave: { nome, preco, dano: { pequeno, medio, grande etc }, dano_secundario: {pequeno, medio, grande etc },
  // categorias: { cac, cac_leve, arremesso, distancia},
  //          critico, peso, tipo, incremento_distancia, talento_relacionado, arma_dupla }
};

var tabelas_armas_simples = {
  // Unarmed Attacks
  desarmado: { preco: '0 PO', dano: { medio: '1d3' },
               categorias: { cac_leve: true },
               critico: '×2', peso: '0', tipo: 'concussao', incremento_distancia: '0 quadrados' },
  manopla: { preco: '2 PO', dano: { medio: '1d3'  },
             categorias: { cac_leve: true },
             critico: '×2', peso: '500g', tipo: 'concussao', },

  //Light Melee Weapons
  adaga: { preco: '2 PO', dano: { medio: '1d4' } ,
           categorias: { cac_leve: true, arremesso: true } ,
           incremento_distancia: '2 quadrados', critico: '19-20/×2', peso: '0,5kg',
           tipo: 'cortante/perfurante' },

  adaga_de_soco: { nome: 'adaga de soco', preco: '2 PO', dano: { medio: '1d4' },
                   categorias: { cac_leve: true },
                   critico: '×3', peso: '0,5kg', tipo: 'perfurante' },
  manopla_com_cravos: { nome: 'manopla com cravos', preco: '5 PO', dano: { medio: '1d4' } ,
                        categorias: { cac_leve: true } ,
                        critico: '×2', peso: '0,5kg', tipo: 'perfurante' },
  maca_leve: { nome: 'maça leve', preco: '5 PO', dano: { medio: '1d6' } ,
               categorias: { cac_leve: true } ,
               critico: '×2', peso: '2kg', tipo: 'concussao' },
  foice_curta: { nome: 'foice curta', preco: '6 PO', dano: { medio: '1d6' } ,
                  categorias: { cac_leve: true } ,
                  critico: '×2', peso: '1kg', tipo: 'cortante' },

  // One-Handed Melee Weapons
  clava: { preco: '0 PO', dano: { medio: '1d6'  }, critico: '×2',
           categorias: { cac_leve: true, arremesso: true },
           incremento_distancia: '2 quadrados', peso: '1,5Kg', tipo: 'concussao' },
  maca_pesada: { nome: 'maça pesada', preco: '12 PO', dano: { medio: '1d8' } ,
                 categorias: { cac: true } ,
                 critico: '×2', peso: '4kg', tipo: 'concussao' },
  maca_estrela: { nome: 'maça estrela', preco: '8 PO', dano: { medio: '1d8' } ,
                  categorias: { cac: true } ,
                  critico: '×2', peso: '3kg', tipo: 'concussao/perfurante' },
  lanca_curta: { nome: 'lança curta', preco: '1 PO', dano: { medio: '1d6' },
                 categorias: { cac: true, arremesso: true} ,
                 incremento_distancia: '4 quadrados', critico: '×2', peso: '1,5kg', tipo: 'perfurante' },

  // Two-Handed Melee Weapons
  lanca: { nome: 'lança', preco: '2 PO', dano: { medio: '1d8'  }, critico: '×3',
           categorias: { cac: true, arremesso: true },
           incremento_distancia: '4 quadrados', peso: '3kg', tipo: 'perfurante' },
  lanca_longa: { nome: 'lança longa', preco: '5 PO', dano: { medio: '1d8' },
                 categorias: { cac: true } ,
                 critico: '×3', peso: '4,5kg', tipo: 'perfurante' },
  bordao: { nome: 'bordão', preco: '0 PO', dano: { medio: '1d6' },
            dano_secundario: { pequeno: '1d4', medio: '1d6' }, categorias: { cac: true } ,
            critico: '×2', peso: '2kg', tipo: 'concussao', arma_dupla: true },


  // Ranged Weapons
  besta_pesada: { nome: 'besta pesada', preco: '50 PO', dano: { medio: '1d10'  },
                  critico: '19-20/×2', categorias: { distancia: true },
                  incremento_distancia: '24 quadrados', peso: '4kg', tipo: 'perfurante' },
  besta_leve: { nome: 'besta leve', preco: '35 PO', dano: { medio: '1d8'  }, critico: '19-20/×2',
                categorias: { distancia: true },
                incremento_distancia: '16 quadrados', peso: '2kg', tipo: 'perfurante' },
  dardo: { nome: 'dardo', preco: '5 PP', dano: { medio: '1d4'  }, critico: '×2',
           categorias: { arremesso: true },
           incremento_distancia: '4 quadrados', peso: '250g', tipo: 'perfurante' },
  azagaia: { preco: '1 PO', dano: { medio: '1d6'  }, critico: '×2',
             categorias: { arremesso: true },
             incremento_distancia: '6 quadrados', peso: '1Kg', tipo: 'perfurante' },
  funda: { nome: 'funda', preco: '0 PO', dano: { medio: '1d4'  }, critico: '×2',
           categorias: { arremesso: true },
           incremento_distancia: '10 quadrados', peso: '0Kg', tipo: 'concussao' },

//Munição
//Bolts, crossbow (10)  1 gp  — — — — 1 lb. —
//Bullets, sling (10) 1 sp  — — — — 5 lb. —
};

// Martial weapons.
var tabelas_armas_comuns = {

// Martial Weapons Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons, ordenado de acordo com o livro do jogador 3.5, português

  armadura_com_cravos: { nome: 'armadura com cravos', preco: 'especial',
                         dano: { medio: '1d6'  }, critico: '×2',
                         categorias: { cac_leve: true },
                         peso: 'especial', tipo: 'perfurante' },

  escudo_pequeno: { nome: 'escudo pequeno', preco: 'especial', dano: { medio: '1d3' } ,
                    categorias: { cac_leve: true } ,
                    critico: '×2', peso: 'especial', tipo: 'concussão' },

  escudo_pequeno_com_cavos: { nome: 'escudo pequeno com cravos', preco: 'especial',
                              dano: { medio: '1d4'}, categorias: { cac_leve: true  } ,
                              critico: '×2', peso: 'especial', tipo: 'perfurante' },

  espada_curta: { nome: 'espada curta', preco: '10 PO', dano: { medio: '1d6' } ,
                  categorias: { cac_leve: true } ,
                  critico: '19-20/×2', peso: '1kg', tipo: 'perfurante' },

  kukri: { preco: '8 PO', dano: { medio: '1d4' } ,
           categorias: { cac_leve: true } ,
           critico: '18-20/×2', peso: '1kg', tipo: 'cortante' },

  machadinha: { preco: '6 PO', dano: { medio: '1d6' } ,
                categorias: { cac_leve: true } ,
                critico: '×3', peso: '1,5kg', tipo: 'cortante' },

  machado_de_arremesso: { nome: 'machado de arremesso', preco: '8 PO', dano: { medio: '1d6' } ,
                          categorias: { cac_leve: true, arremesso: true} ,
                          incremento_distancia: '2 quadrados', critico: '×2', peso: '1kg', tipo: 'cortante' },

  martelo_leve: { nome: 'martelo leve', preco: '1 PO', dano: { medio: '1d4' } ,
                  categorias: { cac_leve: true, arremesso: true} ,
                  incremento_distancia: '4 quadrados', critico: '×2', peso: '1kg', tipo: 'concussão' },

  picareta_leve: { nome: 'picareta leve', preco: '4 PO', dano: { medio: '1d4' } ,
                   categorias: { cac_leve: true } ,
                   critico: '×4', peso: '1,5kg', tipo: 'perfurante' },

  porrete: { nome: 'porrete', preco: '1 PO', dano: { medio: '1d6' } ,
             categorias: { cac_leve: true } ,
             critico: '×2', peso: '1kg', tipo: 'concussão' },

// One-Handed Melee Weapons

  cimitarra: { nome: 'cimitarra', preco: '15 PO', dano: { medio: '1d6' } ,
               categorias: { cac: true } ,
               critico: '18-20/×2', peso: '2kg', tipo: 'cortante' },

  escudo_grande: { nome: 'escudo grande', preco: 'especial', dano: { medio: '1d4' } ,
                   categorias: { cac: true } ,
                   critico: '×2', peso: 'especial', tipo: 'concussão' },

  escudo_grande_com_cravos: { nome: 'escudo grande com cravos', preco: 'especial', dano: { medio: '1d6' } ,
                 categorias: { cac: true } ,
                 critico: '×2', peso: 'especial', tipo: 'perfurante' },

  espada_longa: { nome: 'espada longa', preco: '15 PO', dano: { medio: '1d8' } ,
                  categorias: { cac: true },
                  critico: '19-20/×2', peso: '2kg', tipo: 'cortante', },

  machado_de_batalha: { nome: 'machado de batalha', preco: '10 PO', dano: { medio: '1d8' } ,
                        categorias: { cac: true } ,
                        critico: '×3', peso: '3kg', tipo: 'cortante' },

  mangual: { nome: 'mangual', preco: '8 PO', dano: { medio: '1d8' } ,
             categorias: { cac: true } ,
             critico: '×2', peso: '2,5kg', tipo: 'concussão' },

  martelo_de_guerra: { nome: 'martelo de guerra', preco: '12 PO', dano: { medio: '1d8' } ,
                       categorias: { cac: true } ,
                       critico: '×3', peso: '2,5kg', tipo: 'concussão' },

  picareta_pesada: { nome: 'picareta pesada', preco: '8 PO', dano: { medio: '1d6' } ,
                     categorias: { cac: true } ,
                     critico: '×4', peso: '3kg', tipo: 'perfurante' },

  sabre: { nome: 'sabre', preco: '20 PO', dano: { medio: '1d6' } ,
           categorias: { cac: true } ,
           critico: '18-20/×2', peso: '1kg', tipo: 'perfurante' },

  tridente: { nome: 'tridente', preco: '15 PO', dano: { medio: '1d8' } ,
              categorias: { cac: true, arremesso: true} ,
              incremento_distancia: '2 quadrados', critico: '×2', peso: '2kg', tipo: 'perfurante' },


// Two-Handed Melee Weapons
  alabarda: { nome: 'alabarda', preco: '10 PO', dano: { medio: '1d10' } ,
              categorias: { cac_duas_maos: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante/perfurante' },

  clava_grande: { nome: 'clava grande', preco: '5 PO', dano: { medio: '1d10' } ,
                  categorias: { cac_duas_maos: true } ,
                  critico: '×2', peso: '4Kg', tipo: 'concussão' },

  espada_larga: { nome: 'espada larga', preco: '50 PO', dano: { medio: '2d6' } ,
                  categorias: { cac_duas_maos: true } ,
                  critico: '19-20/×2', peso: '4Kg', tipo: 'cortante' },

  falcione: { nome: 'falcione', preco: '75 PO', dano: { medio: '2d4' } ,
              categorias: { cac_duas_maos: true },
              critico: '18-20/×2', peso: '4kg', tipo: 'cortante', },

  foice_longa: { nome: 'foice longa', preco: '18 PO', dano: { medio: '2d4' } ,
                 categorias: { cac_duas_maos: true } ,
                 critico: '×4', peso: '10kg', tipo: 'cortante/perfurante' },

  glaive: { nome: 'glaive', preco: '8 PO', dano: { medio: '1d10' } ,
            categorias: { cac_duas_maos: true } ,
            critico: '×3', peso: '10Kg', tipo: 'cortante' },

  guisarme: { nome: 'guisarme', preco: '9 PO', dano: { medio: '2d4' } ,
              categorias: { cac_duas_maos: true } ,
              critico: '×3', peso: '11kg', tipo: 'cortante' },

  lanca_montada: { nome: 'lança montada', preco: '10 PO', dano: { medio: '1d8' } ,
                   categorias: { cac_duas_maos: true } ,
                   critico: '×3', peso: '10kg', tipo: 'perfurante' },

  machado_grande: { nome: 'machado grande', preco: '20 PO', dano: { medio: '1d12' } ,
                    categorias: { cac_duas_maos: true } ,
                    critico: '×3', peso: '11kg', tipo: 'cortante' },

  mangual_pesado: { nome: 'mangual pesado', preco: '15 PO', dano: { medio: '1d10' } ,
                    categorias: { cac_duas_maos: true } ,
                    critico: '19-20/×2', peso: '10kg', tipo: 'concussão' },

  ranseur: { nome: 'ranseur', preco: '10 PO', dano: { medio: '2d4' } ,
             categorias: { cac_duas_maos: true } ,
             critico: '×3', peso: '11kg', tipo: 'perfurante' },

// Ranged Weapons

  arco_curto: { nome: 'arco curto', preco: '30 PO', dano: { medio: '1d6'  }, critico: '×3',
                categorias: { distancia: true },
                incremento_distancia: '12 quadrados', peso: '1Kg', tipo: 'perfurante' },

  arco_curto_composto: { nome: 'arco curto composto', preco: '75 PO',
                         dano: { medio: '1d6'  }, critico: '×3',
                         categorias: { distancia: true },
                         incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_1: { nome: 'arco curto composto (1)', preco: '150 PO',
                           dano: { medio: '1d6'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_2: { nome: 'arco curto composto (2)', preco: '225 PO',
                           dano: { medio: '1d6'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_3: { nome: 'arco curto composto (3)', preco: '300 PO',
                           dano: { medio: '1d6'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_4: { nome: 'arco curto composto (4)', preco: '375 PO',
                           dano: { medio: '1d6'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_5: { nome: 'arco curto composto (5)', preco: '450 PO',
                           dano: { medio: '1d6'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },
  arco_curto_composto_6: { nome: 'arco curto composto (6)', preco: '525 PO',
                           dano: { medio: '1d6'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '14 quadrados', peso: '1kg', tipo: 'perfurante' },

  arco_longo: { nome: 'arco longo', preco: '75 PO', dano: { medio: '1d8'  }, critico: '×3',
                categorias: { distancia: true },
                incremento_distancia: '20 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto: { nome: 'arco longo composto', preco: '100 PO',
                         dano: { medio: '1d8'  }, critico: '×3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_1: { nome: 'arco longo composto (1)', preco: '200 PO',
                           dano: { medio: '1d8'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_2: { nome: 'arco longo composto (2)', preco: '300 PO',
                           dano: { medio: '1d8'  }, critico: '×3',
                           categorias: { distancia: true },
                           incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_3: { nome: 'arco longo composto (3)', preco: '400 PO',
                         dano: { medio: '1d8'  }, critico: '×3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_4: { nome: 'arco longo composto (4)', preco: '500 PO',
                         dano: { medio: '1d8'  }, critico: '×3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_5: { nome: 'arco longo composto (5)', preco: '600 PO',
                         dano: { medio: '1d8'  }, critico: '×3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

  arco_longo_composto_6: { nome: 'arco longo composto (6)', preco: '700 PO',
                         dano: { medio: '1d8'  }, critico: '×3',
                         categorias: { distancia: true },
                         incremento_distancia: '22 quadrados', peso: '1,5kg', tipo: 'perfurante' },

//Arrows (20) 1 gp  — — — — 3 lb. —
};

var tabelas_armas_exoticas = {

// Exotic Weapons  Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons

  kama: { nome: 'kama', preco: '2 PO', dano: { medio: '1d6' } ,
          categorias: { cac_leve: true } ,
          critico: '×2', peso: '1Kg', tipo: 'cortante' },

  nunchaku: { nome: 'nunchaku', preco: '2 PO', dano: { medio: '1d6' } ,
              categorias: { cac_leve: true } ,
              critico: '×2', peso: '1Kg', tipo: 'concussão' },

  sai: { nome: 'sai', preco: '1 PO', dano: { medio: '1d4' } ,
         categorias: { cac_leve: true, arremesso: true } ,
         incremento_distancia: '2 quadrados', critico: '×2', peso: '0,5kg', tipo: 'concussão' },

  siangham: { preco: '3 PO', dano: { medio: '1d6' } ,
              categorias: { cac_leve: true } ,
              critico: '×2', peso: '0,5kg', tipo: 'perfurante' },

// One-Handed Melee Weapons

  chicote: { nome: 'chicote', preco: '1 PO', dano: { medio: '1d3' } ,
             categorias: { cac: true } ,
             critico: '×2', peso: '1kg', tipo: 'cortante' },

  espada_bastarda: { nome: 'espada bastarda', preco: '35 PO', dano: { medio: '1d10' } ,
                     categorias: { cac: true } ,
                     critico: '19-20/×2', peso: '3Kg', tipo: 'cortante' },

  machado_de_guerra_anao: { nome: 'machado de guerra anão', preco: '30 PO',
                            dano: { medio: '1d10'}, categorias: { cac: true  } ,
                            critico: '×3', peso: '4Kg', tipo: 'cortante' },

// Two-Handed Melee Weapons


  corrente_com_cravos: { nome: 'corrente com cravos', preco: '25 PO', dano: { medio: '2d4' } ,
                         categorias: { cac_duas_maos: true },
                         critico: '×2', peso: '10kg', tipo: 'perfurante', },

  espada_de_duas_laminas: { nome: 'espada de duas lâminas', preco: '100 PO',
                            dano: { medio: '1d8'  },
                            dano_secundario: {pequeno: '1d6', medio: '1d8' },
                            categorias: { cac: true }, arma_dupla: true,
                            critico: '19-20/×2', peso: '10Kg', tipo: 'cortante' },

  machado_orc_duplo: { nome: 'machado orc duplo', preco: '60 PO',
                       dano: { medio: '1d8'  },
                       dano_secundario: { pequeno: '1d6', medio: '1d8' },
                       arma_dupla: true,
                       categorias: { cac: true }, critico: '×3', peso: '12,5kg', tipo: 'cortante' },

  mangual_atroz: { nome: 'mangual atroz', preco: '90 PO',
                   dano: { medio: '1d8' },
                   dano_secundario: { pequeno: '1d6', medio: '1d8'},
                   categorias: { cac: true }, arma_dupla: true,
                   critico: '×2', peso: '10kg', tipo: 'concussão' },

  martelo_gnomo_com_gancho: { nome: 'martelo gnomo com gancho', preco: '20 PO',
                              dano: { medio: '1d8' },
                              dano_secundario: { pequeno: '1d4', medio: '1d6'},
                              categorias: { cac: true }, arma_dupla: true,
                              critico: '×3/×4', peso: '3kg', tipo: 'concussão e perfurante' },

  urgrosh_anao: { nome: 'urgrosh anão', preco: '50 PO',
                  dano: { medio: '1d8' },
                  dano_secundario: { pequeno: '1d4', medio: '1d6'},
                  categorias: { cac: true }, arma_dupla: true,
                  critico: '×3', peso: '11kg', tipo: 'cortante ou perfurante' },

// Ranged Weapons

  besta_leve_de_repeticao: { nome: 'besta leve de repetição', preco: '250 PO',
                             dano: { medio: '1d8'  }, critico: '19-20/×2',
                             categorias: { distancia: true },
                             incremento_distancia: '16 quadrados', peso: '3Kg', tipo: 'perfurante' },

  besta_pesada_de_repeticao: { nome: 'besta pesada de repetição', preco: '400 PO',
                               dano: { medio: '1d10'  }, critico: '19-20/×2',
                               categorias: { distancia: true },
                               incremento_distancia: '24 quadrados', peso: '11kg', tipo: 'perfurante' },

  besta_de_mao: { nome: 'besta de mão', preco: '100 PO', dano: { medio: '1d4'  },
                  critico: '19-20/×2', categorias: { distancia: true },
                  incremento_distancia: '6 quadrados', peso: '1kg', tipo: 'perfurante' },

  boleadeira: { nome: 'boleadeira', preco: '5 PO', dano: { medio: '1d4'  }, critico: '×2',
                categorias: { distancia: true },
                incremento_distancia: '2 quadrados', peso: '1kg', tipo: 'concussão' },

  rede: { nome: 'rede', preco: '20 PO', dano: { medio: '-'  }, critico: '-',
          categorias: { distancia: true },
          incremento_distancia: '2 quadrados', peso: '3kg', tipo: '-' },

  shuriken: { nome: 'shuriken (5)', preco: '1 PO', dano: { medio: '1d2'  }, critico: '×2',
              categorias: { arremesso: true },
              incremento_distancia: '2 quadrados', peso: '0,25kg', tipo: 'perfurante' },

//Bolts (10)  1 gp  — — — — 1 lb. —
//Bolts (5) 1 gp  — — — — 1 lb. —
};

// Cada entrada tem suas dependencias.
// { nome,
//   bonus_pericias: { percicia1: valor, pericia2: valor, ... },
//   bonus_pv, (quantos pontos de vida o talento concede).
//   bonus_salvacao: { tipo: valor }, (quantos pontos o talento fornece em salvacoes).
//   bonus_iniciativa,  (bonus que o talento fornece na iniciativa do personagem)
//   bonus_ca: { tipo: valor }
//   cumulativo, (se o talento puder ser selecionado mais de uma vez e acumular.
//                eg vitalidade).
//   multiplas_vezes, (se o talento puder ser selecionado mais de uma vez com
//                     complementos diferentes - eg foco em arma)
//   complemento, (se o talento precisa de um complemento por exemplo,
//                 usar arma exotica. Pode ser arma, arma_leve, arma_exotica,
//                 arma_comum, pericia)
//   guerreiro, indica se o talento pode ser usado em bonus de guerreiro
//                  (que tambem devera atender aos requisitos)
//   // A classe do nivel pode ser 'conjurador', 'total' ou uma chave de classe.
//   requisitos: { bba, talentos: [], atributos: { nome: valor },
//                 nivel: { classe: nivel }, proficiencia_arma, arma_leve, }
// },
var tabelas_talentos = {
/*
Encontrão Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de encontrão e não provoca ataques de oportunidade
Atropelar Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de atropelar e não provoca ataques de oportunidade
Separar Aprimorado¹ Ataque Poderoso +4 de bônus nas tentativas de Separar e não provoca ataques de oportunidade
Arquearia Montada¹ Combate Montado Sofre metade das penalidades nos ataques à distância realizados sobre montarias
Investida Implacável¹ Combate Montado, Investida Montada Investidas montadas causam dano dobrado
Pisotear¹ Combate Montado A vítima não pode evitar um atropelamento montada
Bloqueio Ambidestro¹ Combater com Duas Armas A arma da mão inábil concede +1 de bônus de escudo na CA
Contramágica Aprimorada - Contramágica com magias da mesma escola
Ataque Giratório¹ Des 13, Especialização em Combate, Esquiva, Mobilidade, Ataque em Movimento, bônus base de ataque +4 Realiza um ataque corporal contra cada oponente dentro do alcance
Expulsão Aprimorada Habilidade de expulsar ou fascinar criaturas +1 nível efetivo para testes de expulsão
Potencializar Invocação Foco em Magia (conjuração) As criaturas invocadas recebem +4 For e +4 Cons
Rapidez de Recarga¹ Usar Arma Simples (besta) Recarrega bestas mais rapidamente
Sorrateiro - +2 nos testes de Esconder-se e Furtividade
Tiro Longo¹ Tiro Certeiro Aumenta o incremento de distância em 50% ou 100%
Tiro em Movimento¹ Des 13, Esquiva, Mobilidade, Tiro Certeiro, bônus base de ataque +4 Pode se deslocar antes e depois de um ataque à distância
Tiro Preciso Aprimorado¹ Des 19, Tiro Certeiro, Tiro Preciso, bônus base de ataque +11 Ignorar qualquer cobertura ou camuflagem (exceto total) para ataques à distância
*/
  acrobatico: {
      nome: 'Acrobático',
      bonus_pericias: { saltar: 2, acrobacias: 2 }
  },
  acuidade_arma: {
      nome: 'Acuidade com Arma',
      guerreiro: true,
      requisitos: { bba: 1, proficiencia_arma: true, arma_leve: true },
      descricao: 'Aplica o modificador de Des (em vez de For) nas jogadas ' +
                 'de ataque corporal com armas leves.'
  },
  afinidade_com_animais: {
      nome: 'Afinidade com Animais',
      bonus_pericias: { cavalgar: 2, adestrar_animais: 2 }
  },
  agarrar_aprimorado: {
      nome: 'Agarrar Aprimorado',
      guerreiro: true,
      monge: 1,
      requisitos: { atributos: { destreza: 13 }, talentos: [ 'ataque_desarmado_aprimorado' ] },
      descricao: '+4 de bônus nos testes de Agarrar e não provoca ataques de oportunidade.',
  },
  agil: {
      nome: 'Ágil',
      bonus_pericias: { equilibrio: 2, arte_da_fuga: 2 }
  },
  apanhar_objetos: {
      nome: 'Apanhar Objetos',
      requisitos: { atributos: { destreza: 15 }, talentos: ['desviar_objetos', 'ataque_desarmado_aprimorado'], },
      descricao: 'Apanha uma arma arremessada ou projétil',
      guerreiro: true,
  },
  aptidao_magica: {
      nome: 'Aptidão Mágica',
      bonus_pericias: { identificar_magia: 2, usar_instrumento_magico: 2 }
  },
  ataque_atordoante: {
      nome: 'Ataque Atordoante',
      monge: 1,
      guerreiro: true,
      descricao: 'Atordoa a vítima com um ataque desarmado.',
      requisitos: { bba: 8, talentos: [ 'ataque_desarmado_aprimorado' ], atributos: { destreza: 13, sabedoria: 13 } },
  },
  ataque_desarmado_aprimorado: {
      nome: 'Ataque Desarmado Aprimorado',
      guerreiro: true,
      descricao: 'Considerado armado quando estiver desarmado',
  },
  ataque_movimento: {
      nome: 'Ataque em Movimento',
      descricao: 'Capaz de deslocar antes e depois do ataque',
      requisitos: { bba: 4, talentos: [ 'mobilidade' ], },
      guerreiro: true,
  },
  ataque_poderoso: {
      nome: 'Ataque Poderoso',
      requisitos: { atributos: { forca: 13 } },
      guerreiro: true,
      descricao: 'Substitui bônus de ataque por dano (máximo: bônus base de ataque).'
  },
  atletico: {
      nome: 'Atlético',
      bonus_pericias: { escalar: 2, natacao: 2 }
  },
  auto_suficiente: {
      nome: 'Auto-Suficiente',
      bonus_pericias: { cura: 2, sobrevivencia: 2 }
  },
  combate_montado: {
      nome: 'Combate Montado',
      requisitos: { pericias: { cavalgar: 1 } },
      guerreiro: true,
      descricao: 'Evita os ataques contra a montaria com um teste de Cavalgar',
  },
  combater_duas_armas: {
      nome: 'Combater com duas armas',
      requisitos: { atributos: { destreza: 15 } },
      guerreiro: true,
      ranger: 2,
      descricao: 'Reduz penalidade ao usar duas maos em 2.',
  },
  combater_duas_armas_aprimorado: {
      nome: 'Combater com duas armas aprimorado',
      requisitos: { atributos: { destreza: 17 }, bba: 6, talentos: [ 'combater_duas_armas'] },
      guerreiro: true,
      ranger: 6,
      descricao: 'Ataque adicional com a segunda mao.',
  },
  // TODO regra do terceiro ataque.
  combater_duas_armas_maior: {
      nome: 'Combater com Duas Armas Maior',
      guerreiro: true,
      ranger: 11,
      requisitos: { atributos: { destreza: 19 }, talentos: ['combater_duas_armas_aprimorado', ], bba: 11 },
      descricao: 'Adquire um terceiro ataque com a mão inábil',
  },
  // TODO teoricamente esse bonus eh so se correr...
  corrida: {
      nome: 'Corrida',
      bonus_pericias: { saltar: 4 },
      descricao: 'Percorre 5 vezes o deslocamento padrão, ' +
                 '+4 de bônus nos testes de Saltar no final de uma corrida.', },
  dedos_lepidos: {
      nome: 'Dedos Lépidos',
      bonus_pericias: { operar_mecanismos: 2, abrir_fechaduras: 2 } },
  desarme_aprimorado: {
      nome: 'Desarme Aprimorado',
      guerreiro: true,
      monge: 6,
      descricao: '+4 de bônus nas tentativas de desarme e não provoca ataques de oportunidade.',
  },
  desviar_objetos: {
      nome: 'Desviar Objetos',
      requisitos: { atributos: { destreza: 13 } }, talentos: [ 'ataque_desarmado_aprimorado' ],
      monge: 2,
      guerreiro: true,
      descricao: 'Desvia um ataque à distância por rodada',
  },
  diligente: {
      nome: 'Diligente',
      bonus_pericias: { avaliacao: 2, decifrar_escrita: 2 } },
  duro_de_matar: {
      nome: 'Duro de Matar',
      requisitos: { talentos: [ 'tolerancia' ], },
      descricao: 'Permanece consciente entre -1 e -9 PV.', },
  // Nao da pra modelar automatico porque as dependencias de especiais vem
  // depois dos talentos. Da mais 4 expulsoes.
  expulsao_adicional: {
      nome: 'Expulsão Adicional',
  },
  //Escrever Pergaminho 1° nível de conjurador Criar pergaminhos mágicos
  escrever_pergaminho: {
    nome: 'Escrever Pergaminho',
    descricao: 'Criar pergaminhos mágicos.',
    requisitos: { nivel: { conjurador: 1 } },
    mago: 1,
  },
  especializacao_arma: {
    nome: 'Especialização em Arma',
    guerreiro: true,
    complemento: 'arma',
    requisitos: { proficiencia_arma: true, talentos: [ 'foco_em_arma'], nivel: { guerreiro: 4 }},
    descrição: '+2 de bônus no dano com a arma escolhida.', },
  // TODO implementar/mostrar esse bonus de alguma forma.
  esquiva: {
    nome: 'Esquiva',
    requisitos: { atributos: { destreza: 13 } },
    descricao: '+1 de bônus de esquiva na CA contra um adversário à sua escolha.',
    bonus_ca: { esquiva: 1, },
    guerreiro: true,
  },
  especializacao_arma_maior: {
    nome: 'Especialização em Arma Maior',
    guerreiro: true,
    complemento: 'arma',
    requisitos: { talentos: [ 'foco_em_arma_maior', 'especializacao_arma'],
                  nivel: { guerreiro: 12 } },
    descricao: '+4 de bônus no dano com a arma escolhida (ao invés de 2 da especialização normal).', },
  fintar_aprimorado: {
    nome: 'Fintar Aprimorado',
    requisitos: { talentos: ['especializacao_em_combate'], atributos: { inteligencia: 13 } },
    guerreiro: true,
    descricao: 'Fintar em combate se torna uma ação de movimento.'
  },
  // TODO fazer funcionar.
  foco_em_pericia: {
    nome: 'Foco em Perícia',
    complemento: 'pericia',
    descricao: '+3 de bônus nos teste da perícia escolhida.'
  },
  foco_em_arma: {
      nome: 'Foco em arma',
      complemento: 'arma',
      requisitos: { bba: 1, proficiencia_arma: true },
      guerreiro: true,
      descricao: '+1 de bônus nas jogadas de ataque com a arma escolhida.' },
  foco_em_arma_maior: {
      nome: 'Foco em arma maior',
      complemento: 'arma',
      requisitos: { talentos: [ 'foco_em_arma'], nivel: { guerreiro: 8 } },
      guerreiro: true,
      descricao: '+2 de bônus nas jogadas de ataque com a arma escolhida.'
  },
  // TODO aplicar os bonus de CD.
  foco_em_magia: {
    nome: 'Foco em Magia',
    complemento: 'escola_magia',
    descricao: '+1 de bônus na CD dos testes de resistência de uma escola de magia específica.',
  },
  foco_em_magia_maior: {
    nome: 'Foco em Magia Maior',
    complemento: 'escola_magia',
    requisitos: { talentos: ['foco_em_magia'] },
    descricao: '+1 de bônus na CD dos testes de resistência de uma escola de magia específica.',
  },
  forjar_anel: {
    nome: 'Forjar Anel',
    requisitos: { nivel: { conjurador: 12 } },
    descricao: 'Criar anéis mágicos.',
    mago: 1,
  },
  fortitude_maior: {
      nome: 'Fortitude Maior',
      bonus_salvacao: { fortitude: 2, },
      descricao: '+2 de bônus nos teste de resistência de Fortitude.', },
  fraudulento: {
      nome: 'Fraudulento',
      bonus_pericias: { disfarces: 2, falsificacao: 2 } },
  ignorar_componentes_materiais: {
      nome: 'Ignorar Componentes Materiais',
      descricao: 'Conjura magias ignorando os componentes materiais.', },
  investida_montada: {
      nome: 'Investida Montada',
      guerreiro: true,
      requisitos: { talentos: ['combate_montado'] },
      descricao: 'Pode se deslocar antes e depois de uma investida montada',
  },
  derrubar_aprimorado: {
      nome: 'Derrubar Aprimorado (Imobilização Aprimorada)',
      requisitos: { talentos: ['especializacao_em_combate'] },
      guerreiro: true,
      monge: 6,
      descricao: '+4 de bônus nas tentativas de derrubar e não provoca ataques de oportunidade.',
  },
  especializacao_em_combate: {
      nome: 'Especialização em Combate',
      guerreiro: true,
      requisitos: { atributos: { inteligencia: 13 } },
      descricao: 'Substitui bônus de ataque por CA (máximo 5 pontos).',
  },
  iniciativa_aprimorada: {
      nome: 'Iniciativa Aprimorada',
      bonus_iniciativa: 4,
      guerreiro: true,
      descricao: '+4 de bônus nos testes de iniciativa.'
  },
  investigador: {
      nome: 'Investigador',
      bonus_pericias: { obter_informacao: 2, procurar: 2 }
  },
  lideranca: {
      nome: 'Liderança',
      requisitos: { nivel: { total: 6, }, },
      descricao: 'Personagem atrai parceiros e seguidores.',
  },
  lutar_as_cegas: {
      nome: 'Lutar as Cegas',
      guerreiro: true,
      descricao: 'Joga novamente a chance de falha por camuflagem.', },
  dominar_magia: {
    nome: "Dominar Magia",
    descricao: "Capaz de preparar magias escolhidas (bônus inteligência) sem um grimório.",
    requisito: { nivel: { mago: 1, mago_necromante: 1 } },
    mago: 1,
  },
  // Habilidade Forma Selvagem Capaz de lançar magias na forma selvagem
  magia_natural: {
      nome: 'Magia Natural',
      requisitos: { atributos: { sabedoria: 13 } } },
  magia_penetrante: {
      nome: 'Magia Penetrante',
      descricao: '+2 de bônus nos testes de conjurador contra Resistência à Magia.',
  },
  // Magia Penetrante TODO +2 de bônus nos testes de conjurador contra Resistência à Magia
  // (cumulativo com magia penetrante).
  magia_penetrante_maior: {
      nome: 'Magia Penetrante Maior',
      requisitos: { talentos: [ 'magia_penetrante' ] },
      descricao: '+2 de bônus nos testes de conjurador contra Resistência à Magia (cumulativo).',
  },
  magia_combate: {
      nome: 'Magia em Combate', descricao: '+4 de bônus nos teste de Concentração para conjurar na defensiva.',
  },
  maos_level: {
      nome: 'Mãos Leves',
      bonus_pericias: { prestidigitacao: 2, usar_cordas: 2 }
  },
  mobilidade: {
      nome: 'Mobilidade',
      requisitos: { talentos: [ 'esquiva'], },
      descricao: '+4 de bônus de esquiva na CA contra ataques de oportunidade.',
      bonus_ca: { esquiva: 4 },
      guerreiro: true,
  },
  negociador: {
      nome: 'Negociador',
      descricao: '+2 de bônus nos testes de Diplomacia e Sentir Motivação.',
      bonus_pericias: { diplomacia: 2, sentir_motivacao: 2, },
  },
  persuasivo: {
      nome: 'Persuasivo',
      descricao: '+2 de bônus nos testes de blefar e intimidação.',
      bonus_pericias: { blefar: 2, intimidacao: 2 } },
  prontidao: {
      nome: 'Prontidão',
      bonus_pericias: { ouvir: 2, observar: 2 },
      descricao: 'Bonus de +2 em ouvir e observar.' },
  rastrear: {
      nome: 'Rastrear',
      descricao: 'Utiliza Sobrevivência para rastrear.', },
  reflexos_em_combate: {
      nome: 'Reflexos em Combate',
      guerreiro: true,
      monge: 2,
      descricao: 'Permite número de ataques de oportunidade na rodada igual ao bonus de destreza.',
  },
  reflexos_rapidos: {
      nome: 'Reflexos Rápidos',
      bonus_salvacao: { reflexo: 2, },
      descricao: '+2 de bônus nos testes de resistência de Reflexos.', },
  saque_rapido: {
      nome: 'Saque rápido',
      requisitos: { bba: 1 },
      guerreiro: true,
      descricao: 'Saca uma arma branca como ação livre.',
  },
  tiro_certeiro: {
    nome: 'Tiro Certeiro',
    guerreiro: true,
    descricao: '+1 de bônus nos ataques à distância e dano contra alvos num raio de 9 metros.',
  },
  tiro_multiplo: {
      nome: 'Tiro Múltiplo',
      guerreiro: true,
      ranger: 6,
      requisitos: { atributos: { destreza: 17 }, talentos: ['tiro_certeiro', 'tiro_rapido'], bba: 6, },
      descricao: 'Dispara duas ou mais flechas simultaneamente.',
  },
  tiro_preciso: {
    nome: 'Tiro Preciso',
    guerreiro: true,
    ranger: 11,
    requisitos: { talentos: [ 'tiro_certeiro'], },
    descricao: 'Anula a penalidade por disparar contra um adversário em combate corporal com um aliado (-4)',
  },
  tiro_rapido: {
      nome : 'Tiro Rápido',
      guerreiro: true,
      ranger: 2,
      requisitos: { atributos: { destreza: 13 }, talentos: ['tiro_certeiro'], },
      descricao: 'Um ataque à distância adicional por rodada.',
  },
  tolerancia: {
      nome: 'Tolerância',  // Endurance.
      descricao: '+4 de bônus nos testes para resistir a danos não letais (nadar, correr, marcha ' +
                 'forçada, respiração, fome e sede, frio, calor e sufocamento. Pode dormir em armadura ' +
                 'leve ou média sem fatigar.',
  },
  trespassar: {
      nome: 'Trespassar',  // Cleave
      descricao: 'Desfere um ataque corporal extra depois de imobilizar um oponente',
      requisitos: { talentos: [ 'ataque_poderoso' ] },
      guerreiro: true, },
  usar_armas_simples: {
      nome: 'Usar armas simples',
      descricao: 'Não sofre penalidades nos ataques com armas simples.', },
  usar_arma_comum: {
      nome: 'Usar arma comum',
      complemento: 'arma_comum',
      descricao: 'Não sofre penalidade nos ataques com uma arma comum específica.', },
  usar_arma_exotica: {
      nome: 'Usar arma exótica', complemento: 'arma_exotica',
      requisitos: { bba: 1 },
      guerreiro: true,
      descricao: 'Não sofre penalidade nos ataques com uma arma exótica específica.', },
  usar_armadura_leve: {
    nome: 'Usar Armadura (leve)',
    descricao: 'Não sofre penalidade de armadura nas jogadas de ataque.'
  },
  usar_armadura_media: {
    nome: 'Usar Armadura (média)',
    requisitos: { talentos: ['usar_armadura_leve'] },
    descricao: 'Não sofre penalidade de armadura nas jogadas de ataque.'
  },
  usar_armadura_pesada: {
    nome: 'Usar Armadura (pesada)',
    requisitos: { talentos: ['usar_armadura_leve', 'usar_armadura_media'] },
    descricao: 'Não sofre penalidade de armadura nas jogadas de ataque.'
  },
  // TODO implementar efeitos de nao ter o feat.
  usar_escudo: {
      nome: 'Usar Escudo',
      descricao: 'Não sofre penalidade de armadura nas jogadas de ataque.' },
  // TODO A chave certa desse aqui eh ataque_escudo_aprimorado.
  usar_escudo_aprimorado: {
      nome: 'Ataque com Escudo Aprimorado',
      guerreiro: true,
      requisitos: { talentos: [ 'usar_escudo', ] },
      descricao: 'Conserva o bônus do escudo na CA quando ataca com ele.' },
  // Usar Escudo de Corpo Usar Escudo Não sofre penalidade de armadura nas jogadas de ataque
  usar_escudo_corpo: {
      nome: 'Usar Escudo de Corpo', },
  // toughness em ingles.
  vitalidade: {
      nome: 'Vitalidade',
      bonus_pv: 3,
      cumulativo: true,
      descricao: '+3 pontos de vida.', },
  vontade_ferro: {
      nome: 'Vontade de Ferro',
      bonus_salvacao: { vontade: 2, },
      descricao: '+2 de bônus nos testes de resistência de Vontade.', },
  criar_armaduras_e_armas_magicas: {
    nome: 'Criar Armaduras e Armas Mágicas',
    requisitos: { nivel: { conjurador: 5, }, },
    descricao: 'Permite a criação de armas, armaduras e escudos mágicos.',
    mago: 1,
  },
  criar_bastao: {
    nome: 'Criar Bastão',
    requisitos: { nivel: { conjurador: 9 }, },
    descricao: 'Permite a criação de bastões mágicos.',
    mago: 1,
  },
  criar_cajado: {
    nome: 'Criar Cajado',
    requisitos: { nivel: { conjurador: 12 }, },
    descricao: 'Permite a criação de cajados mágicos',
    mago: 1,
  },
  criar_item_maravilhoso: {
    nome: 'Criar Item Maravilhoso',
    requisitos: { nivel: { conjurador: 3 }, },
    descricao: 'Permite a criação de itens mágicos maravilhosos.',
    mago: 1,
  },
  criar_varinha: {
    nome: 'Criar Varinha',
    requisitos: { nivel: { conjurador: 5 }, },
    descricao: 'Permite a criação de varinhas mágicas .',
    mago: 1,
  },
  preparar_pocao: {
    nome: 'Preparar Poção',
    requisitos: { nivel: { conjurador: 3 }, },
    descricao: 'Permite a criação de poções mágicas.',
    mago: 1,
  },
  // Sucesso Decisivo Aprimorado¹² Usar a arma, bônus base de ataque +8 Dobra a margem de ameaça da arma
  sucesso_decisivo_aprimorado: {
    nome: 'Sucesso Decisivo Aprimorado',
    requisitos: { proficiencia_arma: true },
    complemento: 'arma',
    descricao: 'Dobra margem de ameaça da arma.',
    guerreiro: true,
  },
  // Talentos Metamágicos Pré-requisitos Benefícios
  // TODO implementar niveis_adicionais.
  acelerar_magia: {
    nome: 'Acelerar Magia',
    descricao: 'Permite conjurar magia como ação livre, ao custo de três níveis adicionais.',
    niveis_adicionais: 3,
    mago: 1,
  },
  ampliar_magia: {
    nome: 'Ampliar Magia',
    descricao: 'Dobra a área da magia, ao custo de três níveis adicionais',
    niveis_adicionais: 3,
    mago: 1,
  },
  aumentar_magia: {
    nome: 'Aumentar Magia',
    descricao: 'Dobra o alcance da magia, ao custo de um nível adicional',
    niveis_adicionais: 1,
    mago: 1,
  },
  elevar_magia: {
    nome: 'Elevar Magia',
    descricao: 'Conjura a magia num nível mais elevado, alterando sua classe de dificuldade, nível etc.',
    mago: 1,
    //niveis_adicionais: variavel
  },
  estender_magia: {
    nome: 'Estender Magia',
    descricao: 'Dobra a duração da magia, ao custo de um nível adicional.',
    niveis_adicionais: 1,
    mago: 1,
  },
  magia_sem_gestos: {
    nome: 'Magia sem Gestos',
    descricao: 'Ignora os componentes gestuais da magia, ao custo de um nível adicional.',
    niveis_adicionais: 1,
    mago: 1,
  },
  magia_silenciosa: {
    nome: 'Magia Silenciosa',
    descricao: 'Ignora os componentes verbais da magia, ao custo de um nível adicional',
    niveis_adicionais: 1,
    mago: 1,
    // TODO feiticos de bardo nao podem.
  },
  maximizar_magia: {
    nome: 'Maximizar Magia',
    descricao: 'Maximiza todas as variáveis numéricas dos efeitos da magia, ao custo de três níveis adicionais',
    niveis_adicionais: 3,
    mago: 1,
  },
  potencializar_magia: {
    nome: 'Potencializar Magia',
    descricao: 'Aumenta em 50% todas as variáveis numéricas dos efeitos da magia, ao custo de dois níveis adicionais.',
    niveis_adicionais: 2,
    mago: 1,
  },

  // Outros talentos que nao se encaixam...
  outros: {
    nome: 'Outros',
    descricao: 'Para talentos que não estão presentes na planilha.',
    complemento: 'livre'
  },
};

// A penalidade de armadura indica o multiplicador de penalidade da armadura (default 0).
var tabelas_pericias = {
  abrir_fechaduras: {
      nome: 'Abrir Fechaduras',
      classes: [ 'ladino', ],
      sem_treinamento: false, habilidade: 'destreza' },
  acrobacias: {
      nome: 'Acrobacias',
      classes: [ 'bardo', 'monge', 'ladino' ],
      sem_treinamento: false, habilidade: 'destreza', penalidade_armadura: 1 },
  adestrar_animais: {
      nome: 'Adestrar Animais',
      classes: [ 'barbaro', 'druida', 'guerreiro', 'paladino', 'ranger', 'aristocrata' ],
      sem_treinamento: false, habilidade: 'carisma' },
  arte_da_fuga: {
      nome: 'Arte da Fuga',
      classes: [ 'bardo', 'monge', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  atuacao: {
      nome: 'Atuação',
      classes: [ 'bardo', 'monge', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  avaliacao: {
      nome: 'Avaliação',
      classes: [ 'bardo', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  blefar: {
      nome: 'Blefar',
      classes: [  'bardo', 'ladino', 'feiticeiro', 'aristocrata' ],
      sem_treinamento: true,  habilidade: 'carisma' },
  cavalgar: {
      nome: 'Cavalgar',
      classes: [  'barbaro', 'druida', 'guerreiro', 'paladino', 'ranger', 'aristocrata' ],
      sem_treinamento: true,  habilidade: 'destreza' },
  concentracao: {
      nome: 'Concentração',
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ranger', 'feiticeiro', 'mago' ],
      sem_treinamento: true,  habilidade: 'constituicao' },
  conhecimento_arcano: {
      nome: 'Conhecimento (arcano)',
      classes: [  'bardo', 'clerigo', 'monge', 'feiticeiro', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_arquitetura_e_engenharia: {
      nome: 'Conhecimento (arquitetura e engenharia)',
      classes: [  'bardo', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_geografia: {
      nome: 'Conhecimento (geografia)',
      classes: [  'bardo', 'ranger', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_historia: {
      nome: 'Conhecimento (história)',
      classes: [  'bardo', 'clerigo', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_local: {
      nome: 'Conhecimento (local)',
      classes: [  'bardo', 'ladino', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_masmorras: {
      nome: 'Conhecimento (masmorras)',
      classes: [  'bardo', 'ranger', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_natureza: {
      nome: 'Conhecimento (natureza)',
      classes: [  'bardo', 'druida', 'ranger', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_nobreza_e_realeza: {
      nome: 'Conhecimento (nobreza e realeza)',
      classes: [  'bardo', 'paladino', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_planos: {
      nome: 'Conhecimento (planos)',
      classes: [  'bardo', 'clerigo', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  conhecimento_religiao: {
      nome: 'Conhecimento (religião)',
      classes: [  'bardo', 'clerigo', 'monge', 'paladino', 'mago', 'aristocrata' ],
      habilidade: 'inteligencia' },
  cura: {
      nome: 'Cura',
      classes: [  'clerigo', 'druida', 'paladino', 'ranger' ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  decifrar_escrita: {
      nome: 'Decifrar Escrita',
      classes: [  'bardo', 'ladino', 'mago' ],
      habilidade: 'inteligencia' },
  diplomacia: {
      nome: 'Diplomacia',
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ladino', 'aristocrata', ],
      sem_treinamento: true, habilidade: 'carisma' },
  disfarces: {
      nome: 'Disfarces',
      classes: [  'bardo', 'ladino', 'aristocrata', ],
      sem_treinamento: true, habilidade: 'carisma' },
  equilibrio: {
      nome: 'Equilíbrio',
      classes: [  'bardo', 'monge', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  escalar: {
      nome: 'Escalar',
      classes: [  'barbaro', 'bardo', 'guerreiro', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 1 },
  esconderse: {
      nome: 'Esconder-se',
      classes: [  'bardo', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  falar_idioma: {
      nome: 'Falar Idioma',
      classes: [ 'bardo', 'aristocrata' ],
      habilidade: 'sabedoria' },
  falsificacao: {
      nome: 'Falsificação',
      classes: [  'ladino', 'aristocrata', ],
      sem_treinamento: true, habilidade: 'inteligencia' },
  furtividade: {
      nome: 'Furtividade',
      classes: [  'bardo', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza', penalidade_armadura: 1 },
  identificar_magia: {
      nome: 'Identificar magia',
      classes: [  'bardo', 'clerigo', 'druida', 'feiticeiro', 'mago'],
      habilidade: 'inteligencia' },
  intimidacao: {
      nome: 'Intimidação',
      classes: [  'barbaro', 'guerreiro', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'carisma' },
  natacao: {
      nome: 'Natação',
      classes: [  'barbaro', 'bardo', 'druida', 'guerreiro', 'monge', 'ranger', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 2 },
  observar: {
      nome: 'Observar',
      classes: [  'druida', 'monge', 'ranger', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  obter_informacao: {
      nome: 'Obter Informação',
      classes: [  'bardo', 'ladino', 'aristocrata', ],
      sem_treinamento: true, habilidade: 'carisma' },
  oficios: {
      nome: 'Ofícios (outros)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_alquimia: {
      nome: 'Ofícios (alquimia)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_armoraria: {
      nome: 'Ofícios (armoraria)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_arquearia: {
      nome: 'Ofícios (arquearia)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_armeiro: {
      nome: 'Ofícios (armeiro)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  oficios_armadilharia: {
      nome: 'Ofícios (armadilharia)',
      classes: [  'barbaro', 'bardo', 'clerigo', 'druida', 'guerreiro', 'monge',
                  'paladino', 'ranger', 'ladino', 'feiticeiro', 'mago', ],
      sem_treinamento: true, habilidade: 'inteligencia'
  },
  operar_mecanismo: {
      nome: 'Operar Mecanismo',
      classes: [  'ladino'],
      habilidade: 'inteligencia' },
  ouvir: {
      nome: 'Ouvir',
      classes: [  'barbaro', 'bardo', 'druida', 'monge', 'ranger', 'ladino', 'aristocrata' ],
       sem_treinamento: true, habilidade: 'sabedoria' },
  prestidigitacao: {
      nome: 'Prestidigitação',
      classes: [  'bardo', 'ladino'],
      habilidade: 'destreza', penalidade_armadura: 1 },
  procurar: {
      nome: 'Procurar',
      classes: [  'ranger', 'ladino', ],
       sem_treinamento: true,habilidade: 'inteligencia' },
  profissao: {
      nome: 'Profissão',
      classes: [  'bardo', 'clerigo', 'druida', 'monge', 'paladino', 'ranger',
                  'ladino', 'feiticeiro', 'mago'],
      habilidade: 'sabedoria' },
  saltar: {
      nome: 'Saltar',
      classes: [  'barbaro', 'bardo', 'guerreiro', 'monge', 'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'forca', penalidade_armadura: 1 },
  sentir_motivacao: {
      nome: 'Sentir Motivação',
      classes: [  'bardo', 'monge', 'paladino', 'ladino', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  sobrevivencia: {
      nome: 'Sobrevivência',
      classes: [  'barbaro', 'druida', 'ranger', 'aristocrata' ],
      sem_treinamento: true, habilidade: 'sabedoria' },
  usar_cordas: {
      nome: 'Usar Cordas',
      classes: [  'ranger', 'ladino', ],
      sem_treinamento: true, habilidade: 'destreza' },
  usar_instrumento_magico: {
      nome: 'Usar Instrumento Mágico',
      classes: [  'bardo', 'ladino' ],
      habilidade: 'carisma' },
};

// Todos os elementos devem pertencer a classe divs-principais e
// nao podem ser filhos de um elemento da classe divs-principais.
var tabelas_visoes = {
  completo: {
    nome: 'Completo',
    esconder: { classes: [], elementos: [] },
    mostrar: { classes: ['divs-principais'], elementos:[] },
  },
  combate: {
    nome: 'Combate',
    esconder: {
      classes: ['divs-principais'], elementos: [] },
    mostrar: {
      classes: [],
      elementos:['div-pontos-vida', 'div-ataque'] },
  },
  pericias: {
    nome: 'Perícias',
    esconder: { classes: ['divs-principais'], elementos: [] },
    mostrar: { classes: [], elementos:[ 'div-pericias' ] },
  },
  feiticos: {
    nome: 'Feitiços',
    esconder: { classes: ['divs-principais'], elementos: [] },
    mostrar: { classes: [], elementos:[ 'div-feiticos' ] },
  },
};

var tabelas_atributos = {
  forca: "Força",
  destreza: "Destreza",
  constituicao: "Constituição",
  inteligencia: "Inteligência",
  sabedoria: "Sabedoria",
  carisma: "Carisma",
};

var tabelas_atributos_invertidos = {
  'Força': 'forca',
  'Destreza': 'destreza',
  'Constituição': 'constituicao',
  'Inteligência': 'inteligencia',
  'Sabedoria': 'sabedoria',
  'Carisma': 'carisma',
};

// As propriedades podem ser:
// ca: { tipo: valor}
// pericias: { chave: valor, ... }
// atributos: { chave: valor, ... }
// tamanho: +- valor.
// salvacoes: { chave: valor}, chave pode ser 'todas'.
// bonus_pv: { chave: valor }
// especiais: { chave: valor }
var tabelas_aneis = {
  protecao_1: {
      nome: 'Proteção +1', preco: '2000 PO',
      propriedades: { ca: { deflexao: 1 } },  },
  queda_suave: { nome: 'Queda suave', preco: '2200 PO', },
  sustento: { nome: 'Sustento', preco: '2500 PO', },
  escalada: { nome: 'Escalada', preco: '2500 PO',
      propriedades: { pericias: { escalar: { competencia: 5 } } }, },
  salto: { nome: 'Salto', preco: '2500 PO',
      propriedades: { pericias: { saltar: { competencia: 5 } } }, },
  natacao: { nome: 'Natação', preco: '2500 PO',
      propriedades: { pericias: { natacao: { competencia: 5 } } }, },
  contramagica: { nome: 'Contramágica', preco: '4000 PO', },
  escudo_mental: { nome: 'Escudo mental', preco: '8000 PO', },
  protecao_2: { nome: 'Proteção +2', preco: '8000 PO',
      propriedades: { ca: { deflexao: 2 } }, },
  escudo_energia: { nome: 'Escudo de energia', preco: '8500 PO', },
  ariete: { nome: 'Aríete', preco: '8600 PO', },
  escalada_aprimorada: { nome: 'Escalada aprimorada', preco: '10000 PO',
      propriedades: { pericias: { escalar: { competencia: 10 } } }, },
  salto_aprimorado: { nome: 'Salto aprimorado', preco: '10000 PO',
      propriedades: { pericias: { saltar: { competencia: 10 } } }, },
  natacao_aprimorada: { nome: 'Natação aprimorada', preco: '10000 PO',
      propriedades: { pericias: { natacao: { competencia: 10 } } }, },
  cativar_animais: { nome: 'Cativar animais', preco: '10800 PO', },
  resistencia_elementos_menor: { nome: 'Resistência a elementos (menor)', preco: '12000 PO', },
  poder_camaleao: { nome: 'Poder do camaleão', preco: '12700 PO', },
  caminhar_agua: { nome: 'Caminhar na água', preco: '15000 PO', },
  protecao_3: { nome: 'Proteção +3', preco: '18000 PO',
      propriedades: { ca: { deflexao: 3 } },  },
  armazenar_magia_menor: { nome: 'Armazenar magias (menor)', preco: '18000 PO', },
  invisibilidade: { nome: 'Invisibilidade', preco: '20000 PO', },
  arcano_i: { nome: 'Arcano (I)', preco: '20000 PO', },
  evasao: { nome: 'Evasão', preco: '25000 PO', },
  visao_continua: { nome: 'Visão contínua', preco: '25000 PO', },
  movimento_subito: { nome: 'Movimento súbito', preco: '27000 PO', },
  mesclarse_as_pedras: { nome: 'Mesclar-se as pedras', preco: '27000 PO', },
  resistencia_elementos_maior: { nome: 'Resistência a elementos (maior)', preco: '28000 PO', },
  protecao_4: { nome: 'Proteção +4', preco: '32000 PO',
      propriedades: { ca: { deflexao: 4 } },  },
  arcano_ii: { nome: 'Arcano (II)', preco: '40000 PO', },
  movimentacao_livre: { nome: 'Movimentação livre', preco: '40000 PO', },
  resistencia_elementos_superior: { nome: 'Resistência a elementos (superior)', preco: '44000 PO', },
  escudo_aliado_par: { nome: 'Escudo alidado (par)', preco: '50000 PO', },
  protecao_5: { nome: 'Proteção +5', preco: '50000 PO',
      propriedades: { ca: { deflexao: 5 } },  },
  estrelas_cadentes: { nome: 'Estrelas cadentes', preco: '50000 PO', },
  armazenar_magias: { nome: 'Armazenar magias', preco: '50000 PO', },
  arcano_iii: { nome: 'Arcano (III)', preco: '70000 PO', },
  telecinesia: { nome: 'Telecinésia', preco: '75000 PO', },
  regeneracao: { nome: 'Regeneração', preco: '90000 PO', },
  tres_desejos: { nome: 'Três desejos', preco: '97950 PO', },
  refletir_magias: { nome: 'Refletir magias', preco: '98280 PO', },
  arcano_iv: { nome: 'Arcano (IV)', preco: '100000 PO', },
  convocar_djinn: { nome: 'Convocar djinn', preco: '125000 PO', },
  comandar_elemental_ar: { nome: 'Comandar elemental (ar)', preco: '200000 PO', },
  comandar_elemental_terra: { nome: 'Comandar elemental (terra)', preco: '200000 PO', },
  comandar_elemental_fogo: { nome: 'Comandar elemental (fogo)', preco: '200000 PO', },
  comandar_elemental_agua: { nome: 'Comandar elemental (água)', preco: '200000 PO', },
  armazenar_magias_maior: { nome: 'Armazenar magias (maior)', preco: '200000 PO', },
};

var tabelas_amuletos = {
  armadura_natural_1: {
    nome: 'Armadura Natural +1', preco: '2000 PO',
    propriedades: { ca: { armadura_natural: 1 } },  },
  armadura_natural_2: {
    nome: 'Armadura Natural +2', preco: '8000 PO',
    propriedades: { ca: { armadura_natural: 2 } },  },
  armadura_natural_3: {
    nome: 'Armadura Natural +3', preco: '18000 PO',
    propriedades: { ca: { armadura_natural: 3 } },  },
  armadura_natural_4: {
    nome: 'Armadura Natural +4', preco: '32000 PO',
    propriedades: { ca: { armadura_natural: 4 } },  },
  armadura_natural_5: {
    nome: 'Armadura Natural +5', preco: '50000 PO',
    propriedades: { ca: { armadura_natural: 5 } },  },
  punhos_poderosos_1: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +1', preco: '6000 PO',
    propriedades: {} },
  punhos_poderosos_2: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +2', preco: '24000 PO',
    propriedades: {} },
  punhos_poderosos_3: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +3', preco: '54000 PO',
    propriedades: {} },
  punhos_poderosos_4: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +4', preco: '96000 PO',
    propriedades: {} },
  punhos_poderosos_5: {
    // ataque desarmado e natural ganha bonus de melhoria
    nome: 'Punhos Poderosos +5', preco: '150000 PO',
    propriedades: {} },
  saude_2: {
    nome: 'Saúde +2', preco: '4000 PO',
    propriedades: { atributos: { constituicao: 2 } } },
  saude_4: {
    nome: 'Saúde +4', preco: '16000 PO',
    propriedades: { atributos: { constituicao: 4 } } },
  saude_6: {
    nome: 'Saúde +6', preco: '36000 PO',
    propriedades: { atributos: { constituicao: 6 } } },
  planos: {
    // permite usar magia viagem planar...
    nome: 'Planos', preco: '120000 PO',
    propriedades: {} },
  protecao_deteccao: {
    // como se estivesse sob efeito de dificultar detecção...
    nome: 'Proteção contra Localização e Detecção', preco: '35000 PO',
    propriedades: {} },
  quaal_ancora: {
    // Prender embarcações.
    nome: 'Quaal Âncora', preco: '50 PO',
    propriedades: {} },
  quaal_passaro: {
    // Pombo correio para entregar mensagem.
    nome: 'Quaal Pássaro', preco: '300 PO',
    propriedades: {} },
  quaal_leque: {
    // Gerar vento.
    nome: 'Quaal Leque', preco: '200 PO',
    propriedades: {} },
  quaal_barco_cisne: {
    // Transforma-se em um barco.
    nome: 'Quaal Barco de Cisnes', preco: '450 PO',
    propriedades: {} },
  quaal_arvore: {
    // Cria um grande carvalho.
    nome: 'Quaal Árvore', preco: '400 PO',
    propriedades: {} },
  quaal_chicote: {
    // Cria um chicote que ataca sozinho como arma dancarina.
    nome: 'Quaal Chicote', preco: '500 PO',
    propriedades: {} },
  periapto_saude: {
    // Usuario fica imune a doencas (inclusive sobrenaturais).
    nome: 'Periapto da Saúde', preco: '7500 PO',
    propriedades: { imunidades: ['doencas'] } },
  periapto_resistencia_veneno: {
    // Usuário fica imune a veneno.
    nome: 'Periapto da Resistência a Veneno', preco: '27000 PO',
    propriedades: { imunidades: ['veneno'] } },
  periapto_sabedoria_2: {
    // Aumento sabedoria do usuario (bonus melhoria).
    nome: 'Periapto da Sabedoria +2', preco: '4000 PO',
    propriedades: { atributos: { sabedoria: 2 } } },
  periapto_sabedoria_4: {
    // Aumento sabedoria do usuario (bonus melhoria).
    nome: 'Periapto da Sabedoria +4', preco: '16000 PO',
    propriedades: { atributos: { sabedoria: 4 } } },
  periapto_sabedoria_6: {
    // Aumento sabedoria do usuario (bonus melhoria).
    nome: 'Periapto da Sabedoria +6', preco: '36000 PO',
    propriedades: { atributos: { sabedoria: 6 } } },
};

var tabelas_bracaduras = {
  armadura_1: {
    nome: 'Braçadeira da Armadura +1', preco: '1000 PO',
    propriedades: { ca: { armadura: 1 } },
  },
  armadura_2: {
    nome: 'Braçadeira da Armadura +2', preco: '4000 PO',
    propriedades: { ca: { armadura: 2 } },
  },
  armadura_3: {
    nome: 'Braçadeira da Armadura +3', preco: '9000 PO',
    propriedades: { ca: { armadura: 3 } },
  },
  armadura_4: {
    nome: 'Braçadeira da Armadura +4', preco: '16000 PO',
    propriedades: { ca: { armadura: 4 } },
  },
  armadura_4: {
    nome: 'Braçadeira da Armadura +5', preco: '25000 PO',
    propriedades: { ca: { armadura: 5 } },
  },
  armadura_6: {
    nome: 'Braçadeira da Armadura +6', preco: '36000 PO',
    propriedades: { ca: { armadura: 6 } },
  },
  armadura_7: {
    nome: 'Braçadeira da Armadura +7', preco: '49000 PO',
    propriedades: { ca: { armadura: 7 } },
  },
  armadura_8: {
    nome: 'Braçadeira da Armadura +8', preco: '64000 PO',
    propriedades: { ca: { armadura: 8 } },
  },
  arqueiro_menor: {
    nome: 'Braçadeira de Arqueiro (Menor)', preco: '5000 PO',
    propriedades: {  },
    // Da pericia em arcos (exceto bestas). Se ja tiver, da +2 ataque, +1 dano.
  },
  arqueiro_maior: {
    nome: 'Braçadeira de Arqueiro (Maior)', preco: '25000 PO',
    propriedades: { },
    // Da pericia em arcos (exceto bestas). Se ja tiver, da +1 ataque.
  },
};

var tabelas_botas = {
  botas_aladas: {
    nome: 'Botas Aladas', preco: '16000 PO',
    descricao: 'magia vôo 3x/dia.',
    propriedades: { },
  },
  botas_caminhar_saltar: {
    nome: 'Botas de Caminhar e Saltar', preco: '5500 PO',
    descricao: 'Aumenta deslocamento básico em dois quadrados e +5 de competência em saltar',
    propriedades: { pericias: { saltar: { competencia: 5 } } }
  },
  botas_elficas: {
    nome: 'Botas Élficas', preco: '2500 PO',
    propriedades: { pericias: { furtividade: { competencia: 5 } } }
  },
  botas_inverno: {
    nome: 'Botas do Inverno', preco: '2500 PO',
    descricao: 'Andar na neve com deslocamento normal, sem rastro. Andar no gelo escorregadio deslocamento normal. Suportar elementos.',
    propriedades: { },
  },
  botas_levitacao: {
    nome: 'Botas da Levitação', preco: '7500 PO',
    descricao: 'Permite lançar levitar sobre si mesmo',
    propriedades: {},
  },
  botas_teletransporte: {
    nome: 'Botas do Teletransporte', preco: '49000 PO',
    descricao: 'Permite lançar teletransportar 3x/dia.',
    propriedades: {},
  },
  botas_velocidade: {
    nome: 'Botas da velocidade', preco: '12000 PO',
    descricao: 'Permite usar velocidade por 10 rodadas em um dia (não precisam ser rodadas consecutivas).',
    propriedades: {},
  },
};

// Var traduzir.
var tabelas_pocoes = {
  curar_ferimentos_leves: { nome: 'Curar ferimentos leves', tipo: 'pocao', preco: '50 PO' },
  suportar_elementos: { nome: 'Suportar elementos', tipo: 'pocao', preco: '50 PO' },
  invisibilidade_contra_animais: { nome: 'Invisibilidade contra animais', tipo: 'pocao', preco: '50 PO' },
  invisibilidade_contra_mortos_vivos: { nome: 'Invisibilidade contra mortos-vivos', tipo: 'pocao', preco: '50 PO' },
  salto: { nome: 'Salto', tipo: 'pocao' , preco: '50 PO' },
  armadura_arcana: { nome: 'Armadura arcana', tipo: 'pocao', preco: '50 PO' },
  presa_magica: { nome: 'Presa mágica', tipo: 'pocao', preco: '50 PO' },
  pedra_encantada: { nome: 'Pedra encantada', tipo: 'oleo' , preco: '50 PO' },
  arma_magica: { nome: 'Arma mágica', tipo: 'oleo', preco: '50 PO' },
  passos_sem_pegadas: { nome: 'Passos sem pegadas', tipo: 'pocao' , preco: '50 PO' },
  protecao_contra_tendencia: { nome: 'Proteção contra (tendência)', tipo: 'pocao'  , preco: '50 PO' },
  remover_medo: { nome: 'Remover medo', tipo: 'pocao', preco: '50 PO' },
  santuario: { nome: 'Santuário', tipo: 'pocao', preco: '50 PO' },
  escudo_da_fe_2: {
    nome: 'Escudo da fé +2', tipo: 'pocao', preco: '50 PO',
    propriedades: { ca: { deflexao: 2 } },
  },
  arma_abencoada: { nome: 'Arma Abençoada (Shillelagh)', tipo: 'oleo', preco: '50 PO' },
  abencoar_arma: { nome: 'Abençoar arma', tipo: 'oleo', preco: '100 PO' },
  aumentar_pessoa: {
    nome: 'Aumentar pessoa', tipo: 'pocao' , preco: '250 PO',
    propriedades: { tamanho: 1, atributos: { forca: 2, destreza: -2 } },
  },
  reduzir_pessoa: {
    nome: 'Reduzir pessoa', tipo: 'pocao'  , preco: '250 PO',
    propriedades: { tamanho: -1, atributos: { forca: -2, destreza: 2} },
  },
  ajuda: { nome: 'Ajuda', tipo: 'pocao'  , preco: '300 PO' },
  pele_arvore_2: { nome: 'Pele de árvore +2', tipo: 'pocao'  , preco: '300 PO',
    propriedades: { ca: { armadura_natural: 2 } },
  },
  vigor_urso: {
    nome: 'Vigor do urso', tipo: 'pocao' , preco: '300 PO',
    propriedades: { atributos: { constituicao: 4 } }
  },
  nublar: { nome: 'Nublar', tipo: 'pocao' , preco: '300 PO' },
  forca_touro: {
    nome: 'Força do touro', tipo: 'pocao'  , preco: '300 PO',
    propriedades: { atributos: { forca: 4 } }
  },
  agilidade_gato: {
    nome: 'Agilidade do gato', tipo: 'pocao'  , preco: '300 PO',
    propriedades: { atributos: { destreza: 4 } }
  },
  curar_ferimentos_moderados: { nome: 'Curar ferimentos moderados', tipo: 'pocao' , preco: '300 PO' },
  escuridao: { nome: 'Escuridão', tipo: 'oleo', preco: '300 PO' },
  visao_escuro: {
    nome: 'Visão no escuro', tipo: 'pocao', preco: '300 PO',
    propriedades: { especiais: { visao_escuro: 1 } }
  },
  retardar_envenenamento: { nome: 'Retardar envenenamento', tipo: 'pocao' , preco: '300 PO' },
  esplendor_aguia: {
    nome: 'Esplendor da águia', tipo: 'pocao' , preco: '300 PO',
    propriedades: { atributos: { carisma: 4 } }
  },
  astucia_raposa: {
    nome: 'Astúcia da raposa', tipo: 'pocao', preco: '300 PO',
    propriedades: { atributos: { inteligencia: 4 } }
  },
  invisibilidade: { nome: 'Invisibilidade', tipo: 'ambos', preco: '300 PO' },
  restauracao_menor: { nome: 'Restauração menor', tipo: 'pocao' , preco: '300 PO' },
  levitacao: { nome: 'Levitação', tipo: 'ambos', preco: '300 PO' },
  confundir_deteccao: { nome: 'Confundir detecção', tipo: 'pocao' , preco: '300 PO' },
  sabedoria_coruja: {
    nome: 'Sabedoria da coruja', tipo: 'pocao' , preco: '300 PO',
    propriedades: { atributos: { sabedoria: 4 } }
  },
  protecao_contra_flechas_10: { nome: 'Proteção contra flechas 10/mágica', tipo: 'pocao', preco: '300 PO' },
  remover_paralisia: { nome: 'Remover paralisia', tipo: 'pocao', preco: '300 PO' },
  resistencia_elementos_10: { nome: 'Resistência a elementos (tipo) 10', tipo: 'pocao', preco: '300 PO' },
  escudo_da_fe_3: {
    nome: 'Escudo da fé +3', tipo: 'pocao', preco: '300 PO',
    propriedades: { ca: { deflexao: 3 } },
  },
  patas_aranha: { nome: 'Patas de aranha', tipo: 'pocao', preco: '300 PO' },
  dissimular_tendencia: { nome: 'Dissimular tendência', tipo: 'pocao', preco: '300 PO' },
  pele_arvore_3: { nome: 'Pele de árvore +3', tipo: 'pocao', preco: '600 PO',
    propriedades: { ca: { armadura_natural: 3 } },
  },
  escudo_da_fe_4: {
    nome: 'Escudo da fé +4', tipo: 'pocao', preco: '600 PO',
    propriedades: { ca: { deflexao: 4 } },
  },
  resistencia_elementos_20: { nome: 'Resistência a elementos (tipo) 20', tipo: 'pocao'  , preco: '700 PO' },
  curar_ferimentos_serios: { nome: 'Curar ferimentos sérios', tipo: 'pocao', preco: '750 PO' },
  luz_dia: { nome: 'Luz do dia', tipo: 'oleo', preco: '750 PO' },
  deslocamento: { nome: 'Deslocamento', tipo: 'pocao' , preco: '750 PO' },
  flecha_chamas: { nome: 'Flecha de chamas', tipo: 'oleo' , preco: '750 PO' },
  voo: { nome: 'Vôo', tipo: 'pocao'  , preco: '750 PO' },
  forma_gasosa: { nome: 'Forma gasosa', tipo: 'pocao' , preco: '750 PO' },
  presa_magica_maior_1: { nome: 'Presa mágica maior +1', tipo: 'pocao'  , preco: '750 PO' },
  arma_magica_maior: { nome: 'Arma mágica +1', tipo: 'oleo' , preco: '750 PO' },
  velocidade: { nome: 'Velocidade', tipo: 'pocao'  , preco: '750 PO' },
  heroismo: { nome: 'Heroismo', tipo: 'pocao'  , preco: '750 PO' },
  lamina_afiada: { nome: 'Lâmina afiada', tipo: 'oleo' , preco: '750 PO' },
  circulo_magico_contra_tendencia: { nome: 'Círculo mágico contra (tendência)', tipo: 'pocao' , preco: '750 PO' },
  roupa_encantada_1: { nome: 'Roupa encantada +1', tipo: 'oleo' , preco: '750 PO' },
  neutralizar_venenos: { nome: 'Neutralizar venenos', tipo: 'pocao', preco: '750 PO' },
  dificultar_deteccao: { nome: 'Dificultar detecção', tipo: 'pocao' , preco: '750 PO' },
  protecao_contra_elementos: { nome: 'Proteção contra elementos (tipo)', tipo: 'pocao', preco: '750 PO' },
  furia: { nome: 'Fúria', tipo: 'pocao' , preco: '750 PO' },
  remover_cegueira_surdez: { nome: 'Remover cegueira/surdez', tipo: 'pocao', preco: '750 PO' },
  remover_maldicao: { nome: 'Remover maldição', tipo: 'pocao', preco: '750 PO' },
  remover_doenca: { nome: 'Remover doença', tipo: 'pocao', preco: '750 PO' },
  idiomas: { nome: 'Idiomas', tipo: 'pocao', preco: '750 PO' },
  respirar_agua: { nome: 'Respirar na água', tipo: 'pocao', preco: '750 PO' },
  caminhar_agua: { nome: 'Caminhar na água', tipo: 'pocao' , preco: '750 PO' },
  pele_arvore_4: { nome: 'Pele de árvore +4', tipo: 'pocao'  , preco: '900 PO',
    propriedades: { ca: { armadura_natural: 4 } },
  },
  escudo_da_fe_5: {
    nome: 'Escudo da fé +5', tipo: 'pocao' , preco: '900 PO',
    propriedades: { ca: { deflexao: 5 } },
  },
  boa_esperanca: { nome: 'Boa esperança', tipo: 'pocao'  , preco: '1050 PO' },
  resistencia_elementos_30: { nome: 'Resistência a elementos (tipo) 30', tipo: 'pocao'  , preco: '1100 PO' },
  pele_arvore_5: { nome: 'Pele de árvore +5', tipo: 'pocao'  , preco: '1200 PO',
    propriedades: { ca: { armadura_natural: 5 } },
  },
  presa_magica_maior_2: { nome: 'Presa mágica maior +2', tipo: 'pocao'  , preco: '1200 PO' },
  arma_magica_maior_2: { nome: 'Arma mágica maior +2', tipo: 'oleo' , preco: '1200 PO' },
  roupa_encantada_2: { nome: 'Roupa encantada +2', tipo: 'oleo' , preco: '1200 PO' },
  protecao_contra_flechas_15: { nome: 'Proteção contra flechas 15/mágica', tipo: 'pocao'  , preco: '1500 PO' },
  presa_magica_maior_3: { nome: 'Presa mágica maior +3', tipo: 'pocao'  , preco: '1800 PO' },
  arma_magica_maior_3: { nome: 'Arma mágica maior +3', tipo: 'oleo' , preco: '1800 PO' },
  roupa_encantada_3: { nome: 'Roupa encantada +3', tipo: 'oleo', preco: '1800 PO' },
  presa_magica_maior_4: { nome: 'Presa mágica maior +4', tipo: 'pocao', preco: '2400 PO' },
  arma_magica_maior_4: { nome: 'Arma mágica maior +4', tipo: 'oleo', preco: '2400 PO' },
  roupa_encantada_4: { nome: 'Roupa encantada +4', tipo: 'oleo', preco: '2400 PO' },
  presa_magica_maior_5: { nome: 'Presa mágica maior +5', tipo: 'pocao', preco: '3000 PO' },
  arma_magica_maior_5: { nome: 'Arma mágica maior +5', tipo: 'oleo', preco: '3000 PO' },
  roupa_encantada_5: { nome: 'Roupa encantada +5', tipo: 'oleo', preco: '3000 PO' },
};

// TODO: terminar as propriedades de outras capas.
var tabelas_capas = {
  manto_resistencia_1: { nome: 'Manto da resistência +1', preco: '1000 PO',
    propriedades: { salvacoes: { todas: 1} },  },
  manto_elfico: {
    nome: 'Manto élfico', preco: '2500 PO',
    propriedades: { pericias: { esconderse: { competencia: 5 } } }
  },
  manto_carisma_2: { nome: 'Manto do carisma +2', preco: '4000 PO',
    propriedades: { atributos: { carisma: 2 } },  },
  manto_resistencia_2: { nome: 'Manto da resistência +2', preco: '4000 PO',
    propriedades: { salvacoes: { todas: 2 } },  },
  manto_arraia: { nome: 'Manto da arraia', preco: '7200 PO'},
  manto_resistencia_3: { nome: 'Manto da resistência +3', preco: '9000 PO',
    propriedades: { salvacoes: { todas: 3 } },  },
  capa_saltimbanco: { nome: 'Capa do saltimbanco', preco: '10080 PO'},
  manto_aranha: { nome: 'Manto da aranha', preco: '14000 PO' },
  manto_carisma_4: { nome: 'Manto do carisma +4', preco: '16000 PO',
    propriedades: { atributos: { carisma: 4 } },  },
  manto_resistencia_4: { nome: 'Manto da resistência +4', preco: '16000 PO',
    propriedades: { salvacoes: { todas: 4 } },  },
  manto_deslocamento_menor: { nome: 'Manto do deslocamento (menor)', preco: '24000 PO'},
  manto_resistencia_5: { nome: 'Manto da resistência +5', preco: '25000 PO',
    propriedades: { salvacoes: { todas: 5 } },  },
  manto_morcego: { nome: 'Manto do morcego', preco: '26000 PO'},
  manto_carisma_6: { nome: 'Manto do carisma +6', preco: '36000 PO',
    propriedades: { atributos: { carisma: 6 } },  },
  manto_deslocamento_maior: { nome: 'Manto do deslocamento (maior)', preco: '50000 PO'},
  manto_forma_eterea: { nome: 'Manto da forma etérea', preco: '55000 PO'},
  manto_fe: { nome: 'Túnica da fé', preco: '76000 PO'},
  tunica_resistencia_magia: { nome: 'Túnica de resistência a magia', preco: '90000 PO'},
};

var tabelas_itens = {
  aneis: { nome: 'Anéis', tabela: tabelas_aneis, maximo: 2 },
  amuletos: { nome: 'Amuletos', tabela: tabelas_amuletos, maximo: 1 },
  botas: { nome: 'Botas', tabela: tabelas_botas, maximo: 1 },
  bracaduras: { nome: 'Braçadeiras', tabela: tabelas_bracaduras, maximo: 1 },
  pocoes: { nome: 'Poções', tabela: tabelas_pocoes, maximo: 0, },
  capas: { nome: 'Capas', tabela: tabelas_capas, maximo: 1 },
};

// Materiais especiais.
// TODO terminar de modelar custos.
// TODO modelar os requisitos.
var tabelas_materiais_especiais = {
  nenhum: { nome: 'nenhum', },
  adamante: {
      nome: 'adamante',
      requisitos: { metal: true, obra_prima: true, },
      custo_por_tipo: {
          // Tirei o custo da obra prima.
          municao: '54 PO',
          arma: '2700 PO',
          armadura: { por_subtipo: { leve: '4850 PO', media: '9850 PO', pesada: '14850 PO' }, },
          escudo: '1850 PO' }, },
  madeira_negra: {
      nome: 'madeira negra',
      custo_por_kg: '20 PO',
      requisito: { madeira: true, obra_prima: true, }, },
  // O custo adicional do couro do dragão é o da armadura ou escudo obra prima. Fica difícil modelar aqui
  // de forma genérica, então preferi tratar especificamente no código.
  couro_dragao: {
      nome: 'couro de dragão',
      requisitos: { armadura: true, obra_prima: true, }, },
  // O custo adicional do ferro frio é o da arma normal. Cada bônus mágico adiciona +2000 PO. Assim como
  // couro_dragao, modelei no código.
  ferro_frio: {
      nome: 'ferro frio',
      requisito: { arma: true, }, },
  // Custo do mitral é tabelado de acordo com tipo de armadura ou escudo.
  // armadura leve: 1000, media: 4000, pesada: 9000, escudo: 1000. O preco unclui valor da obra prima.
  mitral: {
      nome: 'mitral',
      requisitos: { armadura: true, metal: true, obra_prima: true, }, },
  // Custo da prata alquimica varia com o subtipo de arma.
  prata_alquimica: {
      nome: 'prata alquímica',
      requisitos: { arma: true, metal: true, }, },
};

var tabelas_dominios = {
  agua: {
    nome: 'Água',
    habilidade_especial: 'expulsar_fascinar_criaturas_fogo',
    descricao: 'Expulsa ou destrói criaturas do fogo como um clérigo bondoso usaria Expulsar. ' +
               'Fascina ou comanda criaturas da água como um clérigo maligno usaria Fascinar. ' +
               'Essa habilidade pode ser usada uma quantidade de vezes equivalente a 3+ seu modificador de Carisma por dia. ' +
               'Este poder concedido é uma habilidade sobrenatural.' },
  animal: {
    nome: 'Animal',
    habilidade_especial: 'falar_com_animais',
    descricao: 'Você pode lançar falar com animais uma vez por dia como uma habilidade similar a magia. ' +
               'Conhecimento (natureza) passa a ser uma perícia de classe.' },
  ar: {
    nome: 'Ar',
    habilidade_especial: 'expulsar_fascinar_criaturas_terra',
    descricao: 'Expulsa ou destrói criaturas da terra como um clérigo bondoso usaria Expulsar. ' +
               'Fascina ou comanda criaturas do ar como um clérigo maligno usaria Fascinar. ' +
               'Essa habilidade pode ser usada uma quantidade de vezes equivalente a 3+ seu modificador de Carisma por dia. ' +
               'Este poder concedido é uma habilidade sobrenatural.' },
  bem: { nome: 'Bem',
         descricao: 'Você conjura magias do bem com +1 no nível de conjurador.' },
  caos: { nome: 'Caos',
          descricao: 'Você conjura magias do caos com +1 no nível de conjurador.' },
  conhecimento: {
    nome: 'Conhecimento',
    pericias: [ 'conhecimento_arcano', 'conhecimento_arquitetura_e_engenharia', 'conhecimento_geografia', 'conhecimento_historia', 'conhecimento_local',
                'conhecimento_masmorras', 'conhecimento_natureza', 'conhecimento_nobreza_e_realeza', 'conhecimento_planos', 'conhecimento_religiao'],
    descricao: 'Todas as perícias de Conhecimento passam a ser perícias de classe. ' +
               'Você conjura magias de adivinhação com +1 no nível de conjurador.' },
  cura: { nome: 'Cura', descricao: 'Você conjura magias de cura com +1 no nível de conjurador.' },
  destruicao: {
    nome: 'Destruição',
    habilidade_especial: 'destruir',
    descricao: 'Uma vez por dia, você ganha o poder de destruir, uma habilidade sobrenatural; ' +
               'pode-se realizar um único ataque corpo a corpo com +4 de bônus na jogada de ataque e ' +
               'um modificador de dano equivalente ao seu nível de clérigo (caso você acerte). ' +
               'Você precisa declarar o uso do poder antes de fazer a jogada de ataque.' },
  enganacao: {
    nome: 'Enganação',
    pericias: [ 'blefar', 'disfarces', 'esconderse'],
    descricao: 'Blefar, Disfarces e Esconder-se passam a ser perícias de classe' },
  fogo: {
    nome: 'Fogo',
    habilidade_especial: 'expulsar_fascinar_criaturas_agua',
    descricao: 'Expulsa ou destrói criaturas da água como um clérigo bondoso usaria Expulsar. ' +
                'Fascina ou comanda criaturas do fogo como um clérigo maligno usaria Fascinar. ' +
                'Essa habilidade pode ser usada uma quantidade de vezes equivalente a 3+ seu modificador de Carisma por dia. ' +
                'Este poder concedido é uma habilidade sobrenatural.' },
  forca: {
    nome: 'Força',
    habilidade_especial: 'feito_de_forca',
    descricao: 'Você pode realizar um feito de força, uma habilidade sobrenatural que concede um bônus de melhoria para sua Força ' +
               'igual ao seu nível de clérigo. Ativar esse poder é uma ação livre. Ele pode ser usado uma vez por dia e dura 1 rodada.' },
  guerra: {
    nome: 'Guerra',
    talentos: [ 'usar_arma_comum', 'foco_em_arma' ],
    descricao: 'Adquire o talento Usar Arma Comum (se necessário) e Foco em Arma da arma predileta de seu deus.' },
  magia: {
    nome: 'Magia',
    habilidade_especial: 'aptidao_items_magicos',
    descricao: 'Você usa pergaminhos, varinhas e outros itens mágicos de complemento a magia ou ativação de magia como um mago com metade ' +
               'de seu nível de clérigo (no mínimo 1° nível). Se você também for um mago, seu nível de mago e esses níveis são somados para esses fins.' },
  mal: { nome: 'Mal', descricao: '+1 no nível de conjurador de magias com descritor "mau"' },
  morte: {
    nome: 'Morte',
    habilidade_especial: 'toque_morte',
    descricao: 'Você pode usar o toque da morte uma vez por dia; ele é uma habilidade sobrenatural que gera um efeito de morte. ' +
               'É preciso realizar um ataque de toque corporal contra uma criatura viva (usando as regras para magias de toque). ' +
               'Caso acerte, jogue 1d6 por nível de clérigo. Se o total igualar ou superar os pontos de vida do alvo, ele morre (sem testes de resistência).' },
  ordem: { nome: 'Ordem', descricao: 'Você conjura magias da ordem com +1 no nível de conjurador.' },
  planta: {
    nome: 'Planta',
    habilidade_especial: 'fascinar_plantas',
    descricao: 'Fascina ou comanda criaturas da terra como um clérigo maligno usaria Fascinar. ' +
               'Essa habilidade pode ser usada uma quantidade de vezes equivalente a 3+ seu modificador de Carisma por dia. ' +
               'Este poder concedido é uma habilidade sobrenatural. Conhecimento (natureza) passa a ser uma perícia de classe.' },
  protecao: {
    nome: 'Proteção',
    habilidade_especial: 'escudo_protecao',
    descricao: 'Você pode gerar um escudo de proteção, uma habilidade sobrenatural que concede ao alvo tocado um bônus de resistência ' +
               'no próximo teste de resistência igual ao seu nível de clérigo. Ativar este poder usa uma ação padrão. ' +
               'O escudo de proteção é um efeito de abjuração, com duração de 1 hora, que pode ser usado uma vez por dia.' },
  sol: {
    nome: 'Sol',
    habilidade_especial: 'expulsao_aprimorada_mortos_vivos',
    descricao: 'Uma vez por dia, você pode usar a Expulsão Aprimorada contra mortos-vivos no lugar de uma Expulsão comum. ' +
               'A Expulsão Aprimorada é idêntica à Expulsão normal, mas todos os mortos-vivos que seriam expulsos, serão destruídos.' },
  sorte: {
    nome: 'Sorte',
    habilidade_especial: 'boa_sorte',
    descricao: 'Você adquire o poder da boa sorte, que pode ser usado uma vez por dia. ' +
               'Esta habilidade extraordinária lhe permite realizar novamente uma jogada. ' +
               'Você é obrigado a ficar com o novo resultado, mesmo se este for pior que o resultado original.' },
  terra: {
    nome: 'Terra',
    habilidade_especial: 'expulsar_fascinar_criaturas_ar',
    descricao: 'Expulsa ou destrói criaturas do ar como um clérigo bondoso usaria Expulsar. ' +
               'Fascina ou comanda criaturas da terra como um clérigo maligno usaria Fascinar. ' +
               'Essa habilidade pode ser usada uma quantidade de vezes equivalente a 3+ seu modificador de Carisma por dia. ' +
               'Este poder concedido é uma habilidade sobrenatural.'  },
  viagem: {
    nome: 'Viagem',
    habilidade_especial: 'movimentacao_livre',
    descricao: 'Durante 1 rodada/nível de clérigo por dia, você pode agir sem ser incomodado por efeitos mágicos que impedem o movimento ' +
               '(similar ao efeito da magia movimentação livre). ' +
               'Esse efeito é automático e permanece até seu tempo máximo diário se esgotar ou não ser mais necessário. ' +
               'Ele pode ser ativado várias vezes em um dia (até a quantidade máxima de rodadas disponível). ' +
               'Essa é uma habilidade sobrenatural. A Sobrevivência passa a ser uma perícia de classe.' },
  // Abaixo, os de FR.
  equilibrio: { nome: 'Equilíbrio' },
  caverna: { nome: 'Caverna' },
  encantamento: { nome: 'Encantamento' },
  frio: { nome: 'Frio' },
  oficios: { nome: 'Ofícios' },
  escuridao: { nome: 'Escuridão' },
  drow: { nome: 'Drow' },
  anao: { nome: 'Anão' },
  elfo: { nome: 'Elfo' },
  familia: { nome: 'Família' },
  destino: { nome: 'Destino' },
  gnomo: { nome: 'Gnomo' },
  halfling: { nome: 'Halfling' },
  odio: { nome: 'Ódio' },
  ilusao: { nome: 'Ilusão' },
  mentalismo: { nome: 'Mentalismo' },
  metal: { nome: 'Metal' },
  lua: { nome: 'Lua' },
  nobreza: { nome: 'Nobreza' },
  oceano: { nome: 'Oceano' },
  orc: { nome: 'Orc' },
  planejamento: { nome: 'Planejamento' },
  portal: { nome: 'Portal' },
  renovacao: { nome: 'Renovação' },
  repouso: { nome: 'Repouso' },
  retribuicao: { nome: 'Retribuição' },
  runa: { nome: 'Runa' },
  escamas: { nome: 'Escamas' },
  geleia: { nome: 'Geléia' },
  magicas: { nome: 'Mágicas' },
  aranha: { nome: 'Aranha' },
  tempestade: { nome: 'Tempestade' },
  sofrimento: { nome: 'Sofrimento' },
  tempo: { nome: 'Tempo' },
  comercio: { nome: 'Comércio' },
  tirania: { nome: 'Tirania' },
  mortos_vivos: { nome: 'Mortos-Vivos' },
  morte_aquosa: { nome: 'Morte Aquosa (Prestígio)' },
};

var tabelas_familiares = {
  morcego: {
    nome: 'Morcego',
    propriedades: { pericias: { ouvir: 3 } },
  },
  gato: {
    nome: 'Gato',
    propriedades: { pericias: { furtividade: { familiar: 3 } } },
  },
  falcao: {
    nome: 'Falcão',
    propriedades: { pericias: { observar: { familiar: 3 } } },  // na luz
  },
  lagarto: {
    nome: 'Lagarto',
    propriedades: { pericias: { escalar: { familiar: 3 } } },
  },
  coruja: {
    nome: 'Coruja',
    propriedades: { pericias: { observar: { familiar: 3 } } },  // nas sombras.
  },
  rato: {
    nome: 'Rato',
    propriedades: { salvacoes: { fortitude: 2 } },
  },
  corvo: {
    nome: 'Corvo',
    propriedades: { pericias: { avaliacao: { familiar: 3 } } },  // na luz
  },
  cobra: {
    nome: 'Cobra',
    propriedades: { pericias: { blefar: { familiar: 3 } } },
  },
  sapo: {
    nome: 'Sapo',
    propriedades: { bonus_pv: { familiar: 3 } },
  },
  texugo: {
    nome: 'Texugo',
    propriedades: { salvacoes: { reflexo: 2 } },
  },
  // Aprimorado.
  // FR.
  aranha_cabeluda: {
    nome: 'Aranha Cabeluda',
    propriedades: { especiais: { visao_escuro: 1, mordida_venenosa: 1 } },
  },
  polvo: {
    nome: 'Polvo',
    // Interessante. o bonus eh menor pq nao eh condicionado a sombra ou luz.
    propriedades: { pericias: { observar: { familiar: 2 } } },
  },
};
// Tudo que for util e nao se encaixar em lugar nenhum.

// Notice para funcoes de diacriticals.
/*
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var defaultDiacriticsRemovalap = [
    {'base':'A', 'letters':'\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F'},
    {'base':'AA','letters':'\uA732'},
    {'base':'AE','letters':'\u00C6\u01FC\u01E2'},
    {'base':'AO','letters':'\uA734'},
    {'base':'AU','letters':'\uA736'},
    {'base':'AV','letters':'\uA738\uA73A'},
    {'base':'AY','letters':'\uA73C'},
    {'base':'B', 'letters':'\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181'},
    {'base':'C', 'letters':'\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E'},
    {'base':'D', 'letters':'\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779'},
    {'base':'DZ','letters':'\u01F1\u01C4'},
    {'base':'Dz','letters':'\u01F2\u01C5'},
    {'base':'E', 'letters':'\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E'},
    {'base':'F', 'letters':'\u0046\u24BB\uFF26\u1E1E\u0191\uA77B'},
    {'base':'G', 'letters':'\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E'},
    {'base':'H', 'letters':'\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D'},
    {'base':'I', 'letters':'\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197'},
    {'base':'J', 'letters':'\u004A\u24BF\uFF2A\u0134\u0248'},
    {'base':'K', 'letters':'\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2'},
    {'base':'L', 'letters':'\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780'},
    {'base':'LJ','letters':'\u01C7'},
    {'base':'Lj','letters':'\u01C8'},
    {'base':'M', 'letters':'\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C'},
    {'base':'N', 'letters':'\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4'},
    {'base':'NJ','letters':'\u01CA'},
    {'base':'Nj','letters':'\u01CB'},
    {'base':'O', 'letters':'\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C'},
    {'base':'OI','letters':'\u01A2'},
    {'base':'OO','letters':'\uA74E'},
    {'base':'OU','letters':'\u0222'},
    {'base':'OE','letters':'\u008C\u0152'},
    {'base':'oe','letters':'\u009C\u0153'},
    {'base':'P', 'letters':'\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754'},
    {'base':'Q', 'letters':'\u0051\u24C6\uFF31\uA756\uA758\u024A'},
    {'base':'R', 'letters':'\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782'},
    {'base':'S', 'letters':'\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784'},
    {'base':'T', 'letters':'\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786'},
    {'base':'TZ','letters':'\uA728'},
    {'base':'U', 'letters':'\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244'},
    {'base':'V', 'letters':'\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245'},
    {'base':'VY','letters':'\uA760'},
    {'base':'W', 'letters':'\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72'},
    {'base':'X', 'letters':'\u0058\u24CD\uFF38\u1E8A\u1E8C'},
    {'base':'Y', 'letters':'\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE'},
    {'base':'Z', 'letters':'\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762'},
    {'base':'a', 'letters':'\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250'},
    {'base':'aa','letters':'\uA733'},
    {'base':'ae','letters':'\u00E6\u01FD\u01E3'},
    {'base':'ao','letters':'\uA735'},
    {'base':'au','letters':'\uA737'},
    {'base':'av','letters':'\uA739\uA73B'},
    {'base':'ay','letters':'\uA73D'},
    {'base':'b', 'letters':'\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253'},
    {'base':'c', 'letters':'\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184'},
    {'base':'d', 'letters':'\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A'},
    {'base':'dz','letters':'\u01F3\u01C6'},
    {'base':'e', 'letters':'\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD'},
    {'base':'f', 'letters':'\u0066\u24D5\uFF46\u1E1F\u0192\uA77C'},
    {'base':'g', 'letters':'\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F'},
    {'base':'h', 'letters':'\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265'},
    {'base':'hv','letters':'\u0195'},
    {'base':'i', 'letters':'\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131'},
    {'base':'j', 'letters':'\u006A\u24D9\uFF4A\u0135\u01F0\u0249'},
    {'base':'k', 'letters':'\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3'},
    {'base':'l', 'letters':'\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747'},
    {'base':'lj','letters':'\u01C9'},
    {'base':'m', 'letters':'\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F'},
    {'base':'n', 'letters':'\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5'},
    {'base':'nj','letters':'\u01CC'},
    {'base':'o', 'letters':'\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275'},
    {'base':'oi','letters':'\u01A3'},
    {'base':'ou','letters':'\u0223'},
    {'base':'oo','letters':'\uA74F'},
    {'base':'p','letters':'\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755'},
    {'base':'q','letters':'\u0071\u24E0\uFF51\u024B\uA757\uA759'},
    {'base':'r','letters':'\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783'},
    {'base':'s','letters':'\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B'},
    {'base':'t','letters':'\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787'},
    {'base':'tz','letters':'\uA729'},
    {'base':'u','letters': '\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289'},
    {'base':'v','letters':'\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C'},
    {'base':'vy','letters':'\uA761'},
    {'base':'w','letters':'\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73'},
    {'base':'x','letters':'\u0078\u24E7\uFF58\u1E8B\u1E8D'},
    {'base':'y','letters':'\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF'},
    {'base':'z','letters':'\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763'}
];

var diacriticsMap = {};

// Chamado no carrega.js, _CarregaTabelaNormalizacaoStrings.
function PreencheMapaDiacriticals() {
  for (var i = 0; i < defaultDiacriticsRemovalap.length; i++) {
    var letters = defaultDiacriticsRemovalap[i].letters;
    for (var j=0; j < letters.length ; j++){
      diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
    }
  }
}

// "what?" version ... http://jsperf.com/diacritics/12
function _RemoveDiacritics(str) {
    return str.replace(/[^\u0000-\u007E]/g, function(a) {
       return diacriticsMap[a] || a;
    });
}
// Fim funcao diacriticals.

// Retorna a string em minuscula, sem caracteres especiais.
function StringNormalizada(s) {
  return _RemoveDiacritics(s.toLowerCase());
}

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

// Adiciona um elemento span ao div e o retorna.
function AdicionaSpanAoDiv(texto, id_span, classe, div) {
  var span = CriaSpan(texto, id_span, classe);
  div.appendChild(span);
  return span;
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

// @return a soma de dois preços.
function SomaPrecos(preco1, preco2) {
  var moedas = { platina: 0, ouro: 0, prata: 0, cobre: 0 };
  for (tipo_moeda in moedas) {
    if (tipo_moeda in preco1) {
      moedas[tipo_moeda] += preco1[tipo_moeda];
    }
    if (tipo_moeda in preco2) {
      moedas[tipo_moeda] += preco2[tipo_moeda];
    }
  }
  return moedas;
}

// Recebe uma string de preço e retorna um objeto contendo as moedas.
// @param invertido (default false) se true, os valores sao invertidos (para realizar compras por exemplo).
// @return objeto de moedas ou null em caso de erro.
function LePreco(preco, invertido) {
  var moedas = { platina: 0, ouro: 0, prata: 0, cobre: 0 };
  var sufixos = { platina: 'pl', ouro: 'po', prata: 'pp', cobre: 'pc' };
  var preco_minusculo = preco.toLowerCase();
  var encontrou_tipo = false;
  for (var tipo_moeda in moedas) {
    var indice_tipo = preco_minusculo.indexOf(sufixos[tipo_moeda]);
    if (indice_tipo == -1) {
      continue;
    }
    encontrou_tipo = true;
    var string_val = preco_minusculo.substr(0, indice_tipo);
    var val = parseInt(string_val);
    if (val != NaN) {
      moedas[tipo_moeda] = invertido ? -parseInt(string_val) : parseInt(string_val);
    }
  }
  return encontrou_tipo ? moedas : null;
}

// Le uma entrada de peso e retorna o valor em Kg.
// @param peso string com formato [0-9]*[,[0-9]*]\s*[g|kg].
// @return peso em Kg.
// TODO implementar.
function LePeso(peso) {
  var peso_minusculo = peso.toLowerCase();
  var indice_unidade = peso_minusculo.indexOf('kg');
  var unidade_gramas = false;
  if (indice_unidade == -1) {
    indice_unidade = peso_minusculo.indexOf('g');
    unidade_gramas = true;
  }
  // Não encontrei a unidade.
  if (indice_unidade == -1) {
    return null;
  }

  var peso_sem_unidade = peso_minusculo.substr(0, indice_unidade).replace(',', '.');
  var peso = parseFloat(peso_sem_unidade);

  return unidade_gramas ? peso / 1000.0 : peso;
}

// Armaduras e escudos tem o mesmo preco, so arma que muda.
// @param tipo arma, armadura, escudo.
// @param tabela onde o item sera consultado.
// @param chave do item na tabela.
// @param material do item (exemplo: nenhum, ou adamante).
// @param obra_prima se a arma for obra-prima (mas nao magica).
// @param bonus se a arma for magica (e o bonus). Sera computado o
//        valor da obra prima.
// @param invertido inverter os valores para negativo.
// @return o preco de uma arma, armadura ou escudo. null em caso de erro.
function PrecoArmaArmaduraEscudo(tipo, tabela, chave, material, obra_prima, bonus, invertido) {
  var entrada_tabela = tabela[chave];
  if (entrada_tabela == null || entrada_tabela.preco == null) {
    return null;
  }
  // Nao pode usar invertido aqui, pq la embaixo inverte tudo.
  var preco = LePreco(entrada_tabela.preco);
  var preco_adicional = { platina: 0, ouro: 0, prata: 0, cobre: 0 };
  if (bonus && bonus > 0) {
    switch (bonus) {
      case 1: preco.ouro += tipo == 'arma' ? 2000 : 1000; break; 
      case 2: preco.ouro += tipo == 'arma' ? 8000 : 4000; break; 
      case 3: preco.ouro += tipo == 'arma' ? 18000 : 9000; break; 
      case 4: preco.ouro += tipo == 'arma' ? 32000 : 16000; break; 
      case 5: preco.ouro += tipo == 'arma' ? 50000 : 25000; break; 
      default:
          return null;
    }
  }
  if (obra_prima) {
    // Armas op custam 300 a mais, armaduras e escudos, 150.
    preco_adicional.ouro += tipo == 'arma' ? 300 : 150; 
  }
  // Modificadores de materiais.
  if (material != 'nenhum') {
    var preco_material = null;
    var tabela_material = tabelas_materiais_especiais[material];
    if (tabela_material.custo_por_tipo) {
      var custo = tabela_material.custo_por_tipo[tipo];
      if (custo.por_subtipo) {
        // TODO
      } else {
        preco_material = LePreco(custo);
      }
    } else if (tabela_material.custo_por_kg) {
      var peso_kg = LePeso(entrada_tabela.peso);
      preco_material = LePreco(tabela_material.custo_por_kg);
      for (var tipo_moeda in preco_material) {
        preco_material[tipo_moeda] *= peso_kg;
      }
    } else if (material == 'couro_dragao') {
      // Preco da armadura mais obra prima.
      preco_material = SomaPrecos(LePreco(entrada_tabela.preco), { ouro: 150 });
    } else if (material == 'ferro_frio') {
      // Preço da arma normal e cada bonus custa 2000 PO a mais.
      preco_material = LePreco(entrada_tabela.preco);
      preco_material['ouro'] += bonus * 2000;
    } else if (material == 'mitral') {
      // Preco tabelado de acordo com tipo da armadura ou escudo (excluidindo custo de obra prima).
      var custo = 0;  // escudo ou leve.
      if (tipo == 'escudo') {
        custo = 850;
      } else {
        var talento_relacionado = entrada_tabela.talento_relacionado;
        if (talento_relacionado == 'usar_armaduras_leves') {
          custo = 850;
        } else if (talento_relacionado == 'usar_armaduras_medias') {
          custo = 3850;
        } else if (talento_relacionado == 'usar_armaduras_pesadas') {
          custo = 8850;
        }
      }
      preco_material = { ouro: custo };
    } else if (material == 'prata_alquimica') {
      var categorias = entrada_tabela.categorias;
      var custo = 0;
      if ('cac_leve' in categorias) {
        custo = 20;
      } else if ('cac' in categorias) {
        custo = 90;
      } else if ('cac_duas_maos' in categorias) {
        custo = 180;
      }
      preco_material = { ouro: custo };
    }
    // Adiciona preco do material.
    preco_adicional = SomaPrecos(preco_adicional, preco_material);
  }

  // Soma e se necessario, inverte.
  preco = SomaPrecos(preco, preco_adicional);
  if (invertido) {
    for (var tipo_moeda in preco) {
      preco[tipo_moeda] = -preco[tipo_moeda];
    }
  }
  return preco;
}

// Gera o titulo de um elemento HTML (o texto que aparece no mouseover).
// @param titulo que apareceea.
// Dom o objeto que recebera o titulo.
function TituloSimples(titulo, dom) {
  dom.title = titulo;
}

// Gera o titulo de um elemento HTML (o texto que aparece no mouseover).
// @param pares um array de chave:valor.
// Dom o objeto que recebera o titulo.
function Titulo(pares, dom) {
  var titulo = '';
  for (var i = 0; i < pares.length; ++i) {
    var parcial = pares[i];
    for (var chave in parcial) {
      titulo += chave + ': ' + StringSinalizada(parcial[chave]) + '\n';
    }
  }
  if (titulo.length > 0) {
    titulo = titulo.slice(0, -1);
  }
  dom.title = titulo;
}

// Semelhante a acima, mas recebe um objeto com { chave: valor, chave2: valor2 } a ser impresso.
// TODO deixar somente essa funcao.
function TituloChaves(obj, dom) {
  var titulo = '';
  for (var chave in obj) {
    titulo += chave + ': ' + StringSinalizada(obj[chave]) + '\n';
  }
  if (titulo.length > 0) {
    titulo = titulo.slice(0, -1);
  }
  dom.title = titulo;
}

// Realiza o trim da string (remove espacos antes e depois).
function AjustaString(str) {
  if (String.prototype.trim != null) {
    return str.trim();
  } else {
    str = str.replace(/\s*$/, "");  // direita.
    str = str.replace(/^\s*/, "");  // esquerda.
    return str;
  }
}

// Wrapper do alert.
function Mensagem(msg) {
  JanelaMensagem(Traduz(msg));
}

// Converte as chaves de um mapa para um array de chaves.
function MapaParaLista(mapa) {
  var lista = [];
  for (var chave in mapa) {
    lista.push(chave);
  }
  return lista;
}

// Funções de Storage (Armazem). Por causa da API assíncrona do chrome,
// fiz todas as versões da mesma forma. Uma pena, porque a outra era bem mais simples.
// @return true se o armazem do chrome estiver presente.
function _ArmazemChrome() {
  return (typeof chrome !== 'undefined') && 
         chrome.storage && chrome.storage.sync;
}

// Salva o 'valor' usando 'nome' como chave. Chama callback quando terminar.
// @param valor string a ser salva.
function SalvaNoArmazem(nome, valor, callback) {
  if (_ArmazemChrome()) {
    var obj = {};
    obj[nome] = valor;
    chrome.storage.sync.set(obj, function() {
      if (chrome.runtime.lastError) {
        Mensagem(chrome.runtime.lastError.message + ': ' + Traduz('salvando local'));
        chrome.storage.local.set(obj, callback);
      } else {
        callback();
      }
    });
  } else {
    localStorage.setItem(nome, valor);
    callback();
  }
}

// Le o valor de nome do Armazem. Chama callback({ nome: valor }). O valor será
// uma string.
// Caso nao haja valor, chamará callback({ nome: null }).
function AbreDoArmazem(nome, eh_local, callback) {
  if (_ArmazemChrome()) {
    var storage = eh_local ? chrome.storage.local : chrome.storage.sync;
    storage.get(nome, function(items) {
      if (chrome.runtime.lastError) {
        Mensagem(chrome.runtime.lastError.message);
        callback({});
      } else {
        callback(items);
      }
    });
  } else {
    var obj = {};
    obj[nome] = (nome in localStorage) ? localStorage.getItem(nome) : null;
    callback(obj);
  }
}

// @param callback chamado como callback(lista_nomes_sync, lista_nomes_local).
function ListaDoArmazem(callback) {
  if (_ArmazemChrome()) {
    var lista_sync, lista_local;
    chrome.storage.sync.get(null, function(items) {
      lista_sync = MapaParaLista(items);
      chrome.storage.local.get(null, function(items) {
        lista_local = MapaParaLista(items);
        callback(lista_sync, lista_local);
      })
    });
  } else {
    callback([], MapaParaLista(localStorage));
  }
}

// Excluir um nome do armazem.
// @param callback chamado quando a operação terminar.
function ExcluiDoArmazem(nome, callback) {
  if (_ArmazemChrome()) {
    chrome.storage.sync.remove(nome, callback);
  } else {
    localStorage.removeItem(nome);
    callback();
  }
}

// Dado um objeto de valores, atualiza o objeto para ter os mesmos valores.
// Exemplo: valores: { a: { b: 'valor_b' } }
//          objeto: { o: {} }
// Após a chamada:
//          objeto: { o: {}, a: { b: 'valor_b' }  }
function AtualizaObjeto(valores, objeto) {
// TODO  
}

// @param ver codigo para valores validos.
function DobraMargemCritico(critico) {
  var pos = critico.indexOf('-20');
  if (pos == -1) {
    return '19-20/' + critico;
  }
  var multiplicador = critico.substr(pos + 3);
  var valor_baixo = parseInt(critico.substr(0, pos)) || 0;
  if (valor_baixo == 0) {
    // Erro!
    return critico;
  }
  var margem = (20 - valor_baixo + 1) * 2;
  valor_baixo = 20 - margem + 1;
  if (valor_baixo < 0 || valor_baixo >= 20) {
    return critico;
  } 
  return valor_baixo + '-20' + multiplicador; 
}

// Fim das funções de Storage.
// As habilidades de classe conhecidas.
var tabelas_habilidades = {
  ataque_furtivo: { nome: 'Ataque Furtivo', complemento: true, },
  evasao: { nome: 'Evasão', },
  evasao_aprimorada: { nome: 'Evasão Aprimorada', },
  esquiva_sobrenatural: { nome: 'Esquiva Sobrenatural', },
  esquiva_sobrenatural_aprimorada: { nome: 'Esquiva Sobrenatural Aprimorada', },
  encontrar_armadilha: { nome: 'Encontrar Armadilha' },
  sentir_armadilha: { nome: 'Sentir Armadilha', complemento: true },
} 
// Todas as tabelas que forem referentes a geracao automatica de personagem.

// Tabelas de geracao de atributos.
var tabelas_geracao = {
  // Peguei do livro do mestre.
  barbaro: {
    atributos: ['forca', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
    pericias: [],
    por_nivel: {
      1: { moedas: { ouro: 200 },
           armadura: { nome: 'brunea', obra_prima: true },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      2: { moedas: { ouro: 1200 },
           armadura: { nome: 'peitoral_de_aco', obra_prima: true, },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      3: { moedas: { ouro: 1700 },
           armadura: { nome: 'peitoral_de_aco', obra_prima: true, },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      4: { moedas: { ouro: 2500 },
           armadura: { nome: 'peitoral_de_aco', obra_prima: true, },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      5: { moedas: { ouro: 2500 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      6: { moedas: { ouro: 3800 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      7: { moedas: { ouro: 3500 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [],
      },
      8: { moedas: { ouro: 3500 },
           armadura: { nome: 'peitoral_de_aco', bonus: 1 },
           armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      9: { moedas: { ouro: 6000 },
           armadura: { nome: 'peitoral_de_aco', bonus: 2 },
           armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
           amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      10: { moedas: { ouro: 1000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 2 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      11: { moedas: { ouro: 1000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
      },
      12: { moedas: { ouro: 1000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      13: { moedas: { ouro: 9000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      14: { moedas: { ouro: 11000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      15: { moedas: { ouro: 14000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      16: { moedas: { ouro: 25000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 3 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      17: { moedas: { ouro: 3000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 4 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
      18: { moedas: { ouro: 17000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 5 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 3, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_3', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
      19: { moedas: { ouro: 16000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 5 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 3, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_3', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
      20: { moedas: { ouro: 66000 },
            armadura: { nome: 'peitoral_de_aco', bonus: 5 },
            armas: [ { chave: 'machado_grande', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 3, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_3', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_3', em_uso: true } ],
      },
    },
  },
  bardo: {
    atributos: [ 'carisma', 'inteligencia', 'destreza', 'constituicao', 'forca', 'sabedoria' ],
    ordem_pericias: [
      'blefar', 'diplomacia', 'usar_instrumento_magico', 'sentir_motivacao', 'acrobacias', 'arte_da_fuga', 'atuacao', 'conhecimento_nobreza_e_realeza'
    ],
    talentos: [
      'esquiva', 'iniciativa_aprimorada', 'foco_em_arma', 'foco_em_pericia'
    ],
    ordem_magias: {
      0: [ 'pasmar', 'som_fantasma', 'luz', 'ler_magia', 'cancao_de_ninar' ],
      1: [ 'sono', 'encantar_pessoa', 'curar_ferimentos_leves', 'causar_medo' ],
    },
    por_nivel: {
      1: { moedas: { ouro: 0 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           armas: [ { chave: 'sabre', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
      },
      2: { moedas: { ouro: 1000 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           armas: [ { chave: 'sabre', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
      },
      3: { moedas: { ouro: 1500 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           armas: [ { chave: 'sabre', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
      },
      4: { moedas: { ouro: 2300 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           armas: [ { chave: 'sabre', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
      },
    },
  },
  clerigo: {
    atributos: [
      'sabedoria', 'constituicao', 'forca', 'carisma', 'inteligencia',  'destreza'
    ],
    ordem_pericias: [
      'concentracao', 'cura', 'diplomacia', 'conhecimento_religiao', 'conhecimento_historia',
      'conhecimento_arcano', 'conhecimento_planos', 'profissao', 'identificar_magia', 'oficios'
    ],
    talentos: [
      'preparar_pocao', 'magia_combate', 'escrever_pergaminho', 'reflexos_rapidos', 'foco_em_arma',
    ],
    ordem_magias: {
      0: [ 'luz', 'resistencia', 'orientacao', 'ler_magias', 'consertar', ],
      1: [ 'compreender_idiomas', 'escudo_da_fe', 'invocar_criaturas_i', 'santuario', 'auxilio_divino' ],
      2: [ 'ajuda', 'forca_do_touro', 'forca_do_touro', 'curar_ferimentos_moderados', 'imobilizar_pessoa', 'explosao_sonora' ],
      3: [ 'dissipar_magia', 'purgar_invisibilidade', 'circulo_magico_contra', 'protecao_contra_elementos', 'luz_cegante' ],
      4: [ 'poder_divino', 'envenenamento', 'inseto_gigante', 'imunidade_a_magia' ],
    },
    por_nivel: {
      1: { moedas: { ouro: 300 },
          armadura: { nome: 'cota_de_talas' },
          escudo: { nome: 'pesado_aco' },
          armas: [ { chave: 'maca_estrela', obra_prima: true },
                   { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
          aneis: [],
      },
      2: { moedas: { ouro: 1000 },
           armadura: { nome: 'meia_armadura' },
           escudo: { nome: 'pesado_aco' },
           armas: [ { chave: 'maca_estrela', obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      3: { moedas: { ouro: 600 },
           armadura: { nome: 'armadura_de_batalha' },
           escudo: { nome: 'pesado_aco' },
           armas: [ { chave: 'maca_estrela', obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      4: { moedas: { ouro: 1400 },
           armadura: { nome: 'armadura_de_batalha' },
           escudo: { nome: 'pesado_aco' },
           armas: [ { chave: 'maca_estrela', obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      5: { moedas: { ouro: 2500 },
           armadura: { nome: 'armadura_de_batalha' },
           escudo: { nome: 'pesado_aco' },
           armas: [ { chave: 'maca_estrela', obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      6: { moedas: { ouro: 3600 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', obra_prima: false },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      7: { moedas: { ouro: 4200 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', obra_prima: false },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      8: { moedas: { ouro: 6200 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', bonus: 1 },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      9: { moedas: { ouro: 7000 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           escudo: { nome: 'pesado_aco', bonus: 1 },
           armas: [ { chave: 'maca_estrela', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
           aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
      17: { moedas: { ouro: 44000 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            escudo: { nome: 'pesado_aco', bonus: 2 },
            armas: [ { chave: 'maca_estrela', bonus: 1, obra_prima: true },
                     { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: true } ],
            // luvas +2
            // periapt sabedoria +6
      },
      18: { moedas: { ouro: 74000 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            escudo: { nome: 'pesado_aco', bonus: 2 },
            armas: [ { chave: 'maca_estrela', bonus: 1, obra_prima: true },
                     { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: false },
                        { chave: 'periapto_sabedoria_6', em_uso: true } ],
            // luvas destreza +2
      },
      19: { moedas: { ouro: 114000 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            escudo: { nome: 'pesado_aco', bonus: 2 },
            armas: [ { chave: 'maca_estrela', bonus: 1, obra_prima: true },
                     { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: false },
                        { chave: 'periapto_sabedoria_6', em_uso: true } ],
            // luvas destreza +2
      },
      20: { moedas: { ouro: 164000 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            escudo: { nome: 'pesado_aco', bonus: 2 },
            armas: [ { chave: 'maca_estrela', bonus: 1, obra_prima: true },
                     { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_1', em_uso: false },
                        { chave: 'periapto_sabedoria_6', em_uso: true } ],
            // luvas destreza +2
      },
    },
  },
  druida: {
    atributos: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
    por_nivel: {
      1: { moedas: { ouro: 250 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      2: { moedas: { ouro: 1350 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      3: { moedas: { ouro: 1800 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      4: { moedas: { ouro: 2600 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
      5: { moedas: { ouro: 3000 },
           armadura: { nome: 'gibao_de_peles', },
           escudo: { nome: 'pesado_madeira', },
           armas: [ { chave: 'cimitarra', bonus: 0, obra_prima: true },
                    { chave: 'funda', bonus: 0, obra_prima: true}, ],
      },
    },
  },
  guerreiro: {
    atributos: [ 'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
    ordem_pericias: [ 'escalar', 'saltar', 'intimidar', 'cura' ],
    talentos: [ 'ataque_poderoso', 'trespassar', 'esquiva', 'usar_arma_exotica', 'sucesso_decisivo_aprimorado', 'iniciativa_aprimorada' ],
    por_nivel: {
      1: { moedas: { ouro: 350 },
           armadura: { nome: 'cota_de_talas', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: false }, ],
           aneis: [],
      },
      2: { moedas: { ouro: 750 },
           armadura: { nome: 'meia_armadura', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      3: { moedas: { ouro: 350 },
           armadura: { nome: 'armadura_de_batalha', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: { ouro: 1150 },
           armadura: { nome: 'armadura_de_batalha', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: { ouro: 2150 },
           armadura: { nome: 'armadura_de_batalha', },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: { ouro: 2300 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 0, obra_prima: true },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      7: { moedas: { ouro: 2900 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      8: { moedas: { ouro: 4900 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      9: { moedas: { ouro: 4500 },
           armadura: { nome: 'armadura_de_batalha', bonus: 1 },
           armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                    { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
           aneis: [],
      },
      10: { moedas: { ouro: 5500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [],
      },
      11: { moedas: { ouro: 8500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 1, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
      12: { moedas: { ouro: 9500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
      13: { moedas: { ouro: 18500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
      },
      14: { moedas: { ouro: 20500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 2, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      15: { moedas: { ouro: 21500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_1', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      16: { moedas: { ouro: 27500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 2 },
            armas: [ { chave: 'espada_bastarda', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      17: { moedas: { ouro: 41500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 3 },
            armas: [ { chave: 'espada_bastarda', bonus: 3, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      18: { moedas: { ouro: 56500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 4 },
            armas: [ { chave: 'espada_bastarda', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      19: { moedas: { ouro: 52500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 4 },
            armas: [ { chave: 'espada_bastarda', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_2', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
      20: { moedas: { ouro: 78500 },
            armadura: { nome: 'armadura_de_batalha', bonus: 4 },
            armas: [ { chave: 'espada_bastarda', bonus: 4, obra_prima: false },
                     { chave: 'arco_longo_composto', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: 'protecao_4', em_uso: true } ],
            amuletos: [ { chave: 'armadura_natural_2', em_uso: true } ],
      },
    },
  },
  feiticeiro: {
    atributos: [ 'carisma', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'forca' ],
    ordem_pericias: [
      'concentracao', 'blefar', 'conhecimento_arcano', 'identificar_magia'],
    talentos: [
      'escrever_pergaminho', 'foco_em_magia', 'magia_penetrante', 'magia_penetrante_maior',
    ],
    ordem_magias: {
      // Essas magias sao para necromantes.
      0: [ 'pasmar', 'detectar_magia', 'som_fantasma', 'mao_arcana', 'toque '],
      1: [ 'armadura_arcana', 'misseis_magicos', 'area_escorregadia', 'raio_enfraquecimento', 'toque_macabro', ],
      2: [ 'invisibilidade', 'invocar_enxames', 'vida_falsa', 'resistir_elementos', 'suportar_elementos',
           'toque_do_carnical', 'nublar', 'patas_de_aranha'],
      3: [ 'relampago', 'toque_vampirico', 'velocidade', 'voo', 'dissipar_magia'],
      4: [ 'pele_rochosa', ]
    },
    por_nivel: {
      4: {
        moedas: { ouro: 950 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      5: {
        moedas: { ouro: 2000 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      6: {
        moedas: { ouro: 4300 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      7: {
        moedas: { ouro: 3900 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      8: {
        moedas: { ouro: 6100 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      11: {
        moedas: { ouro: 12700 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        amuletos: [ 'armadura_natural_1' ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
    },
  },
  ladino: {
    atributos: [ 'destreza', 'inteligencia', 'constituicao', 'forca', 'sabedoria', 'carisma' ],
    ordem_pericias: [
      'esconderse', 'furtividade', 'observar', 'ouvir', 'abrir_fechaduras', 'procurar', 'operar_mecanismo',
      'avaliacao', 'acrobacias', 'blefar', 'usar_instrumento_magico', 'equilibrio', 'saltar', 'cavalgar' ],
    talentos: [
      'iniciativa_aprimorada', 'tiro_certeiro', 'usar_escudo', 'tiro_preciso',
    ],
    por_nivel: {
      3: { moedas: {  ouro: 1500 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: {  ouro: 2300 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: {  ouro: 3000 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: {  ouro: 4600 },
           armadura: { nome: 'couro_batido', obra_prima: true },
           escudo: { nome: 'broquel', obra_prima: true },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      7: { moedas: {  ouro: 4200 },
           armadura: { nome: 'couro_batido', bonus: 1 },
           escudo: { nome: 'broquel', bonus: 1, },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      8: { moedas: {  ouro: 6400 },
           armadura: { nome: 'couro_batido', bonus: 1 },
           escudo: { nome: 'broquel', bonus: 1, },
           armas: [ { chave: 'adaga', bonus: 0, obra_prima: true },
                    { chave: 'arco_curto', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      9: {
        moedas: { ouro: 5000 },
        armadura: { nome: 'couro_batido', bonus: 1 },
        escudo: { nome: 'broquel', bonus: 1, },
        armas: [ { chave: 'adaga', bonus: 1, obra_prima: true },
                 { chave: 'arco_curto', bonus: 1, obra_prima: true }, ],
        aneis: [],
      },
      10: {
        moedas: { ouro: 1000 },
        escudo: { nome: 'broquel', bonus: 2, },
        armas: [ { chave: 'adaga', bonus: 1, obra_prima: true },
                 { chave: 'arco_curto', bonus: 1, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_2', em_uso: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
      },
      11: {
        moedas: { ouro: 6000 },
        escudo: { nome: 'broquel', bonus: 2, },
        armas: [ { chave: 'adaga', bonus: 1, obra_prima: true },
                 { chave: 'arco_curto', bonus: 1, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_2', em_uso: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
      },
    },
  },
  mago: {
    atributos: [ 'inteligencia', 'destreza', 'constituicao', 'sabedoria', 'forca', 'carisma' ],
    ordem_pericias: [
      'concentracao', 'cura', 'diplomacia', 'conhecimento_arcano', 'ouvir', 'identificar_magia', 'observar', 'oficios'],
    talentos: [
      'escrever_pergaminho', 'preparar_pocao', 'foco_em_magia', 'foco_em_magia_maior', 'fortitude_maior',
    ],
    ordem_magias: {
      // Essas magias sao para necromantes.
      0: [ 'detectar_magia', 'ler_magias', 'raio_de_gelo', 'romper_morto_vivo', 'som_fantasma'],
      1: [ 'armadura_arcana', 'maos_flamejantes', 'misseis_magicos', 'area_escorregadia', 'raio_enfraquecimento', 'toque_macabro', ],
      2: [ 'invisibilidade', 'vitalidade_ilusoria', 'invocar_enxames', 'queimadura_aganazzar', 'resistir_elementos', 'suportar_elementos',
           'toque_do_carnical', 'patas_de_aranha' ],
      3: [ 'relampago', 'toque_vampirico', 'velocidade', 'voo', 'dissipar_magia'],
      4: [ 'pele_rochosa', ]
    },
    por_nivel: {
      1: {
        moedas: { ouro: 800 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: false }, ],
      },
      2: {
        moedas: { ouro: 1650 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
      },
      3: {
        moedas: { ouro: 2150 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
      },
      4: {
        moedas: { ouro: 950 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      5: {
        moedas: { ouro: 2000 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      6: {
        moedas: { ouro: 4300 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      7: {
        moedas: { ouro: 3900 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      8: {
        moedas: { ouro: 6100 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      11: {
        moedas: { ouro: 12700 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        amuletos: [ 'armadura_natural_1' ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
    },
  },
  mago_necromante: {
    atributos: [ 'inteligencia', 'destreza', 'constituicao', 'sabedoria', 'forca', 'carisma' ],
    ordem_pericias: [
      'concentracao', 'cura', 'diplomacia', 'conhecimento_arcano', 'ouvir', 'identificar_magia', 'observar', 'oficios'],
    talentos: [
      'oficios', 'escrever_pergaminho', 'preparar_pocao', 'foco_em_magia', 'foco_em_magia_maior', 'fortitude_maior',
    ],
    ordem_magias: {
      0: [ 'detectar_magia', 'ler_magias', 'raio_de_gelo', 'romper_morto_vivo', 'som_fantasma'],
      1: [ 'armadura_arcana', 'maos_flamejantes', 'misseis_magicos', 'area_escorregadia', 'raio_enfraquecimento', 'toque_macabro', ],
      2: [ 'invisibilidade', 'invocar_enxames', 'queimadura_aganazzar', 'resistir_elementos', 'suportar_elementos',
           'toque_do_carnical', 'patas_de_aranha'],
      3: [ 'relampago', 'toque_vampirico', 'velocidade', 'voo', 'dissipar_magia'],
      4: [ 'rogar_maldicao', 'criar_mortos_vivos_menor', 'invocar_criaturas_iv', 'grito', 'pedra_rochosa'],
      5: [ 'recipiente_arcano', 'cone_glacial', 'invocar_criaturas_v', 'onda_fadiga'],
      6: [ 'circulo_morte', 'criar_mortos_vivos', 'ataque_visual' ],
    },
    por_nivel: {
      7: {
        moedas: { ouro: 3900 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      8: {
        moedas: { ouro: 6100 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
      11: {
        moedas: { ouro: 12700 },
        armas: [ { chave: 'bordao', bonus: 0, obra_prima: false },
                 { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
        amuletos: [ { chave: 'armadura_natural_1', em_uso: true }, ],
        aneis: [ { chave: 'protecao_1', em_uso: true }, ],
        bracaduras: [ { chave: 'armadura_1', em_uso: true }, ],
      },
    },
  },
  monge: {
    atributos: [ 'sabedoria', 'forca', 'destreza', 'constituicao', 'inteligencia', 'carisma' ],
  },
  paladino: {
    atributos: [ 'carisma', 'forca', 'sabedoria', 'constituicao', 'inteligencia', 'destreza' ],
  },
  ranger: {
    ordem_pericias: [
      'esconderse', 'furtividade', 'observar', 'sobrevivencia', 'ouvir', 'saltar', 'afinidade_com_animais', 'cavalgar'
    ],
    talentos: [
      'tolerancia', 'tiro_certeiro', 'ataque_poderoso', 'tiro_preciso', 'foco_em_arma', 'combater_duas_armas_maior'
    ],
    atributos: [ 'destreza', 'forca', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
    por_nivel: {
      7: {
        moedas: { ouro: 1400 },
        armadura: { nome: 'couro_batido', bonus: 1 },
        armas: [ { chave: 'espada_longa', bonus: 1, obra_prima: true },
                 { chave: 'arco_longo', bonus: 1, obra_prima: true }, ],
      },
    },
  },
  // classes NPC: nao existe uma tabela para esses, coloquei o que achei mais adequado.
  adepto: {
    atributos: [ 'sabedoria', 'constituicao', 'forca', 'inteligencia',  'destreza', 'carisma' ],
    ordem_pericias: [
      'concentracao', 'cura', 'diplomacia', 'conhecimento_religiao', 'conhecimento_historia',
      'conhecimento_arcano', 'conhecimento_planos', 'profissao', 'identificar_magia', 'oficios' ],
    talentos: [
      'usar_armadura_leve', 'escrever_pergaminho', 'usar_escudo',
    ],
    ordem_magias: {
      0: [ 'luz', 'orientacao', 'som_fantasma', ],
      1: [ 'maos_flamejantes', 'protecao_contra_caos_mal_bem_ordem', 'bencao' ],
      2: [ 'ajuda', 'curar_ferimentos_moderados', 'teia' ],
      3: [ 'relampago', 'luz_do_dia', 'rogar_maldicao' ],
      4: [ 'pele_de_pedra', 'polimorfismo', 'barreira_de_fogo' ],
      5: [ 'cura_completa', 'levantar_os_mortos', 'visao_verdadeira' ],
    },
    por_nivel: {
      // Tesouro de NPC tabela 4-23, usando um nivel a menos (Nivel de Desafio).
      1: { moedas: { ouro: 450 },
      },
      2: { moedas: { ouro: 900 },
      },
      3: { moedas: { ouro: 2000 },
      },
      4: { moedas: { ouro: 2500 },
      },
      5: { moedas: { ouro: 3300 },
      },
      6: { moedas: { ouro: 4300 },
      },
      7: { moedas: { ouro: 5600 },
      },
      8: { moedas: { ouro: 7200 },
      },
      9: { moedas: { ouro: 9400 },
      },
      10: { moedas: { ouro: 12000 },
      },
      11: { moedas: { ouro: 16000 },
      },
      12: { moedas: { ouro: 21000 },
      },
      13: { moedas: { ouro: 27000 },
      },
      14: { moedas: { ouro: 35000 },
      },
      15: { moedas: { ouro: 45000 },
      },
      16: { moedas: { ouro: 59000 },
      },
      17: { moedas: { ouro: 77000 },
      },
      18: { moedas: { ouro: 100000 },
      },
      19: { moedas: { ouro: 130000 },
      },
      20: { moedas: { ouro: 170000 },
      },
    },
  },
  aristocrata: {
    atributos: [ 'inteligencia', 'destreza', 'constituicao', 'forca', 'carisma', 'sabedoria' ],
    por_nivel: {
      1: { moedas: {  ouro: 50 },
           armadura: { nome: 'brunea', obra_prima: true },
           escudo: { nome: 'broquel' },
           armas: [ { chave: 'sabre', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      2: { moedas: {  ouro: 2000 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      3: { moedas: {  ouro: 2500 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: {  ouro: 3300 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: {  ouro: 4300 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: {  ouro: 5600 },
           armadura: { nome: '', bonus: 0 },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
    },
  },
  plebeu: {
    atributos: [ 'forca', 'constituicao', 'sabedoria', 'destreza', 'inteligencia', 'carisma' ],
    1: {
      moedas: { ouro: 450 },
    },
    2: {
      moedas: { ouro: 900 },
    },
    3: {
      moedas: { ouro: 2000 },
    },
    4: {
      moedas: { ouro: 2500 },
    },
    5: {
      moedas: { ouro: 3300 },
    },
    6: {
      moedas: { ouro: 4300 },
    },
    7: {
      moedas: { ouro: 5600 },
    },
    8: {
      moedas: { ouro: 7200 },
    },
    9: {
      moedas: { ouro: 9400 },
    },
    10: {
      moedas: { ouro: 12000 },
    },
    11: {
      moedas: { ouro: 16000 },
    },
    12: {
      moedas: { ouro: 21000 },
    },
    13: {
      moedas: { ouro: 27000 },
    },
    14: {
      moedas: { ouro: 35000 },
    },
    15: {
      moedas: { ouro: 45000 },
    },
    16: {
      moedas: { ouro: 59000 },
    },
    17: {
      moedas: { ouro: 77000 },
    },
    18: {
      moedas: { ouro: 100000 },
    },
    19: {
      moedas: { ouro: 130000 },
    },
    20: {
      moedas: { ouro: 170000 },
    },
  },
  // esse aqui varia de acordo com as escolhas da area de expertise.
  expert: {
    atributos: [ 'inteligencia', 'forca', 'destreza', 'constituicao', 'sabedoria', 'carisma' ],
    por_nivel: {
      1: {
        moedas: { ouro: 450 },
      },
      2: {
        moedas: { ouro: 900 },
      },
      3: {
        moedas: { ouro: 2000 },
      },
      4: {
        moedas: { ouro: 2500 },
      },
      5: {
        moedas: { ouro: 3300 },
      },
      6: {
        moedas: { ouro: 4300 },
      },
      7: {
        moedas: { ouro: 5600 },
      },
      8: {
        moedas: { ouro: 7200 },
      },
      9: {
        moedas: { ouro: 9400 },
      },
      10: {
        moedas: { ouro: 12000 },
      },
      11: {
        moedas: { ouro: 16000 },
      },
      12: {
        moedas: { ouro: 21000 },
      },
      13: {
        moedas: { ouro: 27000 },
      },
      14: {
        moedas: { ouro: 35000 },
      },
      15: {
        moedas: { ouro: 45000 },
      },
      16: {
        moedas: { ouro: 59000 },
      },
      17: {
        moedas: { ouro: 77000 },
      },
      18: {
        moedas: { ouro: 100000 },
      },
      19: {
        moedas: { ouro: 130000 },
      },
      20: {
        moedas: { ouro: 170000 },
      },
    },
  },
  combatente: {
    atributos: [  'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
    // Tesouro de NPC tabela 4-23, usando um nivel a menos (Nivel de Desafio).
    por_nivel: {
      1: {
        moedas: { ouro: 450 },
      },
      2: {
        moedas: { ouro: 900 },
      },
      3: {
        moedas: { ouro: 2000 },
      },
      4: {
        moedas: { ouro: 2500 },
      },
      5: {
        moedas: { ouro: 3300 },
      },
      6: {
        moedas: { ouro: 4300 },
      },
      7: {
        moedas: { ouro: 5600 },
      },
      8: {
        moedas: { ouro: 7200 },
      },
      9: {
        moedas: { ouro: 9400 },
      },
      10: {
        moedas: { ouro: 12000 },
      },
      11: {
        moedas: { ouro: 16000 },
      },
      12: {
        moedas: { ouro: 21000 },
      },
      13: {
        moedas: { ouro: 27000 },
      },
      14: {
        moedas: { ouro: 35000 },
      },
      15: {
        moedas: { ouro: 45000 },
      },
      16: {
        moedas: { ouro: 59000 },
      },
      17: {
        moedas: { ouro: 77000 },
      },
      18: {
        moedas: { ouro: 100000 },
      },
      19: {
        moedas: { ouro: 130000 },
      },
      20: {
        moedas: { ouro: 170000 },
      },
    },
  },
  aristocrata: {
    atributos: [ 'inteligencia', 'destreza', 'constituicao', 'forca', 'carisma', 'sabedoria' ],
    por_nivel: {
      1: { moedas: {  ouro: 50 },
           armadura: { nome: 'brunea', obra_prima: true },
           escudo: { nome: 'broquel' },
           armas: [ { chave: 'sabre', bonus: 0, obra_prima: true },
                    { chave: 'besta_leve', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      2: { moedas: {  ouro: 2000 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      3: { moedas: {  ouro: 2500 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      4: { moedas: {  ouro: 3300 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      5: { moedas: {  ouro: 4300 },
           armadura: { nome: '', },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      6: { moedas: {  ouro: 5600 },
           armadura: { nome: '', bonus: 0 },
           armas: [ { chave: '', bonus: 0, obra_prima: true },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      7: { moedas: {  ouro: 0 },
           armadura: { nome: '', bonus: 1 },
           armas: [ { chave: '', bonus: 1, obra_prima: false },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      8: { moedas: {  ouro: 0 },
           armadura: { nome: '', bonus: 1 },
           armas: [ { chave: '', bonus: 1, obra_prima: false },
                    { chave: '', bonus: 0, obra_prima: true }, ],
           aneis: [],
      },
      9: { moedas: {  ouro: 0 },
           armadura: { nome: '', bonus: 1 },
           armas: [ { chave: '', bonus: 1, obra_prima: false },
                    { chave: '', bonus: 1, obra_prima: false }, ],
           aneis: [],
      },
      10: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 1, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [],
      },
      11: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 1, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      12: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 2, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      13: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 2, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      14: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 2, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      15: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 3, obra_prima: false },
                     { chave: '', bonus: 1, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      16: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 2 },
            armas: [ { chave: '', bonus: 3, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      17: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 3 },
            armas: [ { chave: '', bonus: 3, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      18: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 4 },
            armas: [ { chave: '', bonus: 4, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      19: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 4 },
            armas: [ { chave: '', bonus: 4, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
      20: { moedas: {  ouro: 0 },
            armadura: { nome: '', bonus: 4 },
            armas: [ { chave: '', bonus: 4, obra_prima: false },
                     { chave: '', bonus: 2, obra_prima: false }, ],
            aneis: [ { chave: '', em_uso: true } ],
      },
    },
  },
};
// Feiticos das classes.

var tabelas_lista_feiticos = {
  adepto: {
    0: {},
    1: {},
    2: {},
    3: {},
    4: {},
    5: {},
  },
  // a entrada dominio lista a quais dominios a magia pertence. Se alem de dominio for geral, tambem sera listada.
  clerigo: {
    0: {
      'consertar': { nome: 'Consertar', descricao: 'Faz pequenos reparos em um objeto.' },
      'criar_agua': { nome: 'Criar Água', descricao: 'Cria 8 litros/nível de água pura.' },
      'curar_ferimentos_minimos': { nome: 'Curar Ferimentos Mínimos', descricao: 'Cura 1 ponto de dano.' },
      'detectar_magia': { nome: 'Detectar Magia', descricao: 'Detecta magias e itens mágicos a menos de 18 m.' },
      'detectar_venenos': { nome: 'Detectar Venenos', descricao: 'Detecta veneno em uma criatura ou objeto.' },
      'inflingir_ferimentos_minimos': { nome: 'Infligir Ferimentos Mínimos', descricao: 'Ataque de toque, 1 ponto de dano.' },
      'ler_magias': { nome: 'Ler Magias', descricao: 'Decifra pergaminhos ou grimórios.' },
      'luz': { nome: 'Luz', descricao: 'Um objeto brilha como uma tocha.' },
      'orientacao': { nome: 'Orientação', descricao: '+1 para uma jogada ou teste.' },
      'purificar_alimentos': { nome: 'Purificar Alimentos', descricao: 'Purifica um cubo de 30 cm/nível de comida ou água.' },
      'resistencia': { nome: 'Resistência', descricao: 'O alvo recebe +1 para testes de resistência.' },
      'virtude': { nome: 'Virtude', descricao: 'O alvo ganha 1 PV temporário.' },
    },
    1: {
      'abencoar_agua': { nome: 'Abençoar Água', componente_material: true, descricao: 'Cria água benta.' },
      'amaldicoar_agura': { nome: 'Amaldiçoar Água', componente_material: true, descricao: 'Cria água profana.' },
      'arma_magica': { nome: 'Arma Mágica', descricao: 'Uma arma recebe +1 de bônus.' },
      'auxilio_divino': { nome: 'Auxílio Divino', descricao: 'Você recebe +1 de bônus/3 níveis para ataques e dano.' },
      'bencao': { nome: 'Bênção', descricao: 'Aliados recebem +1 para ataques e testes contra medo.' },
      'causar_medo': { nome: 'Causar Medo', descricao: 'Uma criatura foge durante 1d4 rodadas.' },
      'comando': { nome: 'Comando', descricao: 'Um alvo obedece a uma palavra de comando durante 1 rodada.' },
      'compreender_idiomas': { nome: 'Compreender Idiomas', descricao: 'Entenda todas as línguas faladas e escritas.' },
      'curar_ferimentos_leves': { nome: 'Curar Ferimentos Leves', descricao: ' Cura 1d8 +1/nível de dano (máx. +5).' },
      'desespero': { nome: 'Desespero', descricao: ' Um alvo recebe -2 para ataques, dano e testes.' },
      'detectar_caos_mal_bem_ordem': { nome: 'Caos/Mal/Bem/Ordem', descricao: 'Revela criaturas, magias ou objetos.' },
      'detectar_mortos_vivos': { nome: 'Detectar Mortos-Vivos', descricao: 'Revela mortos-vivos a menos de 18 m.' },
      'escudo_da_fe': { nome: 'Escudo da Fé', descricao: 'Aura concede +2 ou mais de bônus de deflexão.' },
      'escudo_entropico': { nome: 'Escudo Entrópico', descricao: 'Ataques à distância contra você possuem 20% de chance de falha.' },
      'inflingir_ferimentos_leves': { nome: 'Infligir Ferimentos Leves', descricao: ' Ataque de toque, 1d8 +1/nível de dano (máx. +5).' },
      'invisibilidade_contra_mortos_vivos': { nome: 'Invisibilidade Contra Mortos-Vivos', descricao: ' Mortos-vivos não podem perceber 1 alvo/nível.' },
      'invocar_criaturas_i': { nome: 'Invocar Criaturas I', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador' },
      'maldicao_menor': { nome: 'Maldição Menor', descricao: 'Inimigos recebem -1 em ataques e testes contra medo.' },
      'nevoa_obscurescente': { nome: 'Névoa Obscurescente', descricao: 'Névoa espessa envolve o conjurador' },
      'pedra_encantada': { nome: 'Pedra Encantada', descricao: 'Três pedras recebem +1 para ataque e causam 1d6+l de dano.' },
      'protecao_contra_caos_mal_bem_ordem': { nome: 'Proteção Contra o Caos/Mal/Bem/Ordem', descricao: ' +2 na CA e testes de resistência, impede controle mental, isola elementais e seres extra-planares.' },
      'remover_medo': { nome: 'Remover Medo', descricao: '+4 em testes contra medo para 1 alvo/4 níveis.' },
      'santuario': { nome: 'Santuário', descricao: 'Os oponentes não podem atacar o conjurador e vice-versa.' },
      'suportar_elementos': { nome: 'Suportar Elementos', descricao: 'Mantém uma criatura confortável dentro de ambientes áridos.' },
      'visao_da_morte': { nome: 'Visão da Morte', descricao: 'Detecta a situação de criaturas a menos de 9 m.' },
    },
    2: {
      'acalmar_emocoes': { nome: 'Acalmar Emoções', descricao: 'Acalma criaturas, anula efeitos de emoção.' },
      'ajuda': { nome: 'Ajuda', descricao: '+1 para ataques e testes de resistência contra medo, 1d8 pontos de vida temporários.' },
      'arma_espiritual': { nome: 'Arma Espiritual', descricao: 'Arma mágica ataca sozinha' },
      'augurio': { nome: 'Augúrio', descricao: 'Descobre se uma ação será boa ou má.', material: true, foco: true, },
      'cativar': { nome: 'Cativar', descricao: 'Cativa todos num raio de 30 m + 3 m/nível.' },
      'condição': { nome: 'Condição', descricao: 'Monitora condição e posição de aliados.' },
      'consagrar': { nome: 'Consagrar', descricao: 'Enche uma área com energia positiva, enfraquecendo mortosvivos.', material: true },
      'curar_ferimentos_moderados': { nome: 'Curar Ferimentos Moderados', descricao: 'Cura 2d8 +l/nível de dano (máx. +10).' },
      'descanso_tranquilo': { nome: 'Descanso Tranqüilo', descricao: 'Preserva um corpo.' },
      'despedaçar': { nome: 'Despedaçar', descricao: 'Vibrações sônicas causam dano a objetos ou criaturas cristalinas.' },
      'dissimular_tendencia': { nome: 'Dissimular Tendência', descricao: 'Esconde uma tendência durante 24 horas.' },
      'drenar_força_vital': { nome: 'Drenar Força Vital', descricao: 'Mata uma criatura ferida. Você ganha 1d8 PV temporários, +2 Força e +1 nível de conjurador.' },
      'encontrar_armadilha': { nome: 'Encontrar Armadilha', descricao: 'Descobre armadilhas como um ladino.' },
      'escuridao': { nome: 'Escuridão', descricao: 'Cria 6 m de raio de escuridão sobrenatural.' },
      'esplendor_da_aguia': { nome: 'Esplendor da Águia', descricao: 'O alvo recebe +4 Car durante 1 min/nível.' },
      'explosao_sonora': { nome: 'Explosão Sonora', descricao: 'Causa 1d8 de dano sônico ao alvo e pode atordoá-lo.' },
      'forca_do_touro': { nome: 'Força do Touro', descricao: 'O alvo ganha +4 For por 1 min/nível.' },
      'imobilizar_pessoa': { nome: 'Imobilizar Pessoa', descricao: 'Paralisa uma pessoa durante 1 rodada/nível.' },
      'infligir_ferimentos_moderados': { nome: 'Infligir Ferimentos Moderados', descricao: 'Ataque de toque, 2d8 +l/nível de dano (máx. +10).' },
      'invisibilidade': { nome: 'Invisibilidade', descricao: 'O alvo fica invisível durante 1 min/nível ou até atacar.', dominios: ['enganacao'] },
      'invocar_criaturas_ii': { nome: 'Invocar Criaturas II', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },
      'profanar': { nome: 'Profanar', descricao: 'Preenche uma área com energia negativa, fortalecendo mortosvivos.' },
      'proteger_outro': { nome: 'Proteger OutroF', descricao: 'Você sofre metade do dano dirigido ao alvo.', foco: true },
      'remover_paralisia': { nome: 'Remover Paralisia', descricao: 'Liberta uma ou mais criaturas de paralisia ou lentidão.' },
      'resistencia_a_elementos': { nome: 'Resistência à Elementos', descricao: 'Ignora 10 dano/ataque de um tipo de energia.' },
      'restauracao_menor': { nome: 'Restauração Menor', descricao: 'Dissipa penalidades mágicas de habilidade ou recupera 1d4 de dano de habilidade.' },
      'retardar_envenenamento': { nome: 'Retardar Envenenamento', descricao: 'Impede que veneno cause dano ao alvo durante 1 hora/nível.' },
      'sabedoria_da_coruja': { nome: 'Sabedoria da Coruja', descricao: 'O alvo ganha +4 Sab por 1 min/nível. ' },
      'silencio': { nome: 'Silêncio', descricao: 'Anula todo o som num raio de 4,5 m.' },
      'tendencia_em_arma': { nome: 'Tendência em Arma', descricao: 'Arma se torna sagrada, profana, axiomática ou anárquica.' },
      'tornar_inteiro': { nome: 'Tornar Inteiro', descricao: 'Repara um objeto.' },
      'vigor_do_urso': { nome: 'Vigor do Urso', descricao: 'O alvo ganha +4 Con por 1 min/nível.' },
      'zona_da_verdade': { nome: 'Zona da Verdade', descricao: 'Os alvos na área não podem mentir.' },
    },
    3: {
      'caminhar_na_agua': { nome: 'Caminhar na Água', descricao: 'O alvo caminha sobre a água como se ela fosse sólida.'},
      'cegueira_surdez': { nome: 'Cegueira/Surdez', descricao: 'Torna o alvo cego ou surdo.' },
      'chama_continua': { nome: 'Chama ContinuaM', descricao: 'Cria fogo ilusório.', material: true },
      'circulo_magico_contra': { nome: 'Circulo Mágico Contra o Caos/Mal/Bem/Ordem', descricao: 'Como as magias de proteção, mas com 3 m de raio e 10 min/nível.' },
      'criar_alimentos': { nome: 'Criar Alimentos', descricao: 'Alimenta três humanos (ou um cavalo) /nível.' },
      'criar_mortos_vivos_menor': { nome: 'Criar Mortos-Vivos Menor', descricao: 'Cria zumbis e esqueletos.', material: true },
      'curar_ferimentos_graves': { nome: 'Curar Ferimentos Graves', descricao: 'Cura 3d8 + l/nível de dano (máx. +15).' },
      'dissipar_magia': { nome: 'Dissipar Magia', descricao: 'Cancela magias e efeitos mágicos.' },
      'escuridao_profunda': { nome: 'Escuridão Profunda', descricao: 'Objeto cria escuridão absoluta em um raio de 18 m.' },
      'falar_com_os_mortos': { nome: 'Falar Com os Mortos', descricao: 'Corpo responde a uma pergunta/2 níveis.' },
      'infligir_ferimentos_graves': { nome: 'Infligir Ferimentos Graves', descricao: 'Ataque de toque, 3d8 +l/nível de dano (máx. + 15' },
      'invocar_criaturas_iii': { nome: 'Invocar Criaturas III', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },
      'localizar_objetos': { nome: 'Localizar Objetos', descricao: 'Sente a direção do objeto (especifico ou tipo).' },
      'luz_cegante': { nome: 'Luz Cegante', descricao: 'Raio causa 1d8 de dano/2 níveis ou mais contra mortos-vivos.' },
      'luz_do_dia': { nome: 'Luz do Dia', descricao: 'Ilumina 18 m de raio com uma luz brilhante.' },
      'mao_opifera': { nome: 'Mão Opífera', descricao: 'Mão fantasmagórica guia uma pessoa até você.' },
      'mesclar_se_as_rochas': { nome: 'Mesclar-se as Rochas', descricao: 'Você e seu equipamento se unem a pedras.' },
      'moldar_rochas': { nome: 'Moldar Rochas', descricao: 'Molda pedra em qualquer forma.' },
      'muralha_de_vento': { nome: 'Muralha de Vento', descricao: 'Desvia disparos, criaturas pequenas e gases.' },
      'obscurecer_objeto': { nome: 'Obscurecer Objeto', descricao: 'Protege um objeto contra adivinhações.' },
      'oracao': { nome: 'Oração', descricao: 'Os abados recebem +1 em várias jogadas e os inimigos sofrem -1.' },
      'praga': { nome: 'Praga', descricao: 'Infecta um alvo com a doença escolhida.' },
      'protecao_contra_elementos': { nome: 'Proteção Contra Elementos', descricao: 'Absorve 12 de dano/nível de um tipo de energia.' },
      'purgar_invisibilidade': { nome: 'Purgar Invisibilidade', descricao: 'Dissipa invisibilidade em uma área de 13 m/nível.' },
      'remover_cegueira_surdez': { nome: 'Remover Cegueira/Surdez', descricao: 'Cura condições normais ou mágicas.' },
      'remover_doencas': { nome: 'Remover Doenças', descricao: 'Cura todas as doenças que afetam o alvo.' },
      'remover_maldicao': { nome: 'Remover Maldição', descricao: 'Liberta objeto ou pessoa de maldição.' },
      'respirar_na_agua': { nome: 'Respirar na Água', descricao: 'Os alvos podem respirar sob a água.' },
      'rogar_maldição': { nome: 'Rogar Maldição', descricao: 'toque causa -6 numa habilidade ou -4 nos ataques e testes ou 50% de chance de perder cada ação.' },
      'roupa_encantada': { nome: 'Roupa Encantada', descricao: ' Armadura ou escudo recebe bônus de melhoria de +1/4 níveis.' },
      'símbolo_de_proteção': { nome: 'Símbolo de Proteção', descricao: ' Inscrição fere os intrusos', material: true },
    },
    4: {
      'adivinhacao': { nome: 'Adivinhação', descricao: 'Oferece conselhos úteis sobre as ações propostas.' },
      'aliado_extra_planar_menor': { nome: 'Aliado Extra-Planar Menor', descricao: 'Negocia serviços com um ser extra-planar de 6 DV.' },
      'ancora_dimensional': { nome: 'Ancora Dimensional', descricao: 'Impede movimento extra-dimensional.' },
      'andar_no_ar': { nome: 'Andar no Ar', descricao: 'O alvo caminha no ar como se fosse sólido (num ângulo de 45°).' },
      'arma_magica_maior': { nome: 'Arma Mágica Maior', descricao: '+1/4 níveis, máx. +5.' },
      'controlar_a_agua': { nome: 'Controlar a Água', descricao: 'Aumenta ou abaixa água.' },
      'curar_ferimentos_criticos': { nome: 'Curar Ferimentos Críticos', descricao: 'Cura 4d8+ l/nível de dano (máx. +20).' },
      'discernir_mentiras': { nome: 'Discernir Mentiras', descricao: 'Revela mentiras deliberadas.' },
      'envenenamento': { nome: 'Envenenamento', descricao: 'Toque causa 1d10 de dano de Con, que se repete após 1 min.' },
      'enviar_mensagem': { nome: 'Enviar Mensagem', descricao: 'Entrega uma mensagem curta em qualquer lugar, instantaneamente.' },
      'expulsao': { nome: 'Expulsão', descricao: 'Força uma criatura a retornar para seu plano nativo.' },
      'idiomas': { nome: 'Idiomas', descricao: 'Fala qualquer idioma.' },
      'imunidade_a_magia': { nome: 'Imunidade à Magia', descricao: 'O alvo fica imune a 1 magia/4 níveis.' },
      'infligir_ferimentos_criticos': { nome: 'Infligir Ferimentos Críticos', descricao: 'Ataque de toque, 4d8 +l/nível de dano (máx. +20).' },
      'inseto_gigante': { nome: 'Inseto Gigante', descricao: 'Transforma centopéias, escorpiões ou aranhas comuns em insetos gigantes.' },
      'invocar_criaturas_iv': { nome: 'Invocar Criaturas IV', descricao: 'Invoca um ser extra-planar para auxiliar o conjurador.' },
      'movimentacao_livre': { nome: 'Movimentação Livre', descricao: 'O alvo se move normalmente apesar de impedimentos.' },
      'neutralizar_venenos': { nome: 'Neutralizar Venenos', descricao: 'Imuniza contra ou retira o veneno de um personagem.' },
      'poder_divino': { nome: 'Poder Divino', descricao: 'Você recebe bônus de ataque, +6 For e 1 PV/nível.' },
      'protecao_contra_morte': { nome: 'Proteção Contra a Morte', descricao: 'Fornece imunidade a magias e efeitos de morte.' },
      'repelir_insetos': { nome: 'Repelir Insetos', descricao: 'Insetos se mantêm a 3 m de distância.' },
      'restauracao': { nome: 'Restauração', descricao: 'Recupera níveis negativos e valores de habilidade.' },
      'transferencia_poder_divino': { nome: 'Transferência de Poder Divino', descricao: 'Transfere magias para alvo.' },
      'nuvem_profana': { nome: 'Nuvem Profana', descricao: 'Causa dano e adoece criaturas bondosas.', dominios: ['mal'] },  // unholy blight
    },
  },
  mago: {
    0: {
      'detectar_magia': {
        nome: 'Detectar Magia', descricao: 'Detecta magias e itens mágicos a menos de 18m.', escola: 'adivinhacao'
      },
      'som_fantasma': {
        nome: 'Som Fantasma', descricao: 'Imita sons.', escola: 'ilusao',
      },
      'toque_fadiga': {
        nome: 'Toque da Fadiga', descricao: 'Ataque de toque fatiga o alvo', escola: 'necromancia',
      },
      'romper_morto_vivo': {
        nome: 'Romper Morto-Vivo', descricao: 'Romper Morto-Vivo', escola: 'necromancia',
      },
      'raio_de_gelo': {
        nome: 'Raio de Gelo', descricao: 'Raio causa 1d3 de dano de frio', escola: 'evocacao',
      },
      'raio_de_acido': {
        nome: 'Raio de Ácido', descricao: 'Raio causa 1d3 de dano de ácido', escola: 'conjuracao',
      },
      'ler_magias': {
        nome: 'Ler Magias', descricao: 'Decifra pergaminho ou grimórios', escola: '',
      },
      'luz': {
        nome: 'Luz', descricao: 'Um objeto brilha como uma tocha', escola: 'evocacao',
      },
      'pasmar': {
        nome: 'Pasmar', descricao: 'Criatura de até 4 HD perde próxima ação', escola: 'encantamento', duracao: '1 rodada'
      },
      'toque_da_fadiga': {
        nome: 'Toque da Fadiga', descricao: 'Alvo tocado fica fatigado.', duracao: '1 rodada / nível', escola: 'necromancia'
      },
    },
    1: {
      'area_escorregadia': {
        nome: 'Área Escorregadia', descricao: 'Torna 3 m quadrados ou um objeto escorregadios.', escola: 'conjuracao'
      },
      'armadura_arcana': {
        nome: 'Armadura Arcana', descricao: 'Concede ao alvo +4 de bônus de armadura.', escola: 'abjuracao'
      },
      'maos_flamejantes': {
        nome: 'Mãos Flamejantes', descricao: 'Cone de fogo de 3 quadrados dando 1d4/nível até máximo 5d4.', escola: 'evocacao',
      },
      'misseis_magicos': {
        nome: 'Mísseis Mágicos', descricao: '1d4+1 de dano, 1 Míssil/2 níveis acima do 1º, máximo 5', escola: 'evocacao',
      },
      'raio_enfraquecimento': {
        nome: 'Raio do Enfraquecimento', descricao: 'Raio reduz For em 1d6+1/2 níveis até 1d6+5.', escola: 'necromancia',
      },
    },
    2: {
      'invisibilidade': {
        nome: 'Invisibilidade', descricao: 'O alvo fica invisível durante 1 min/nível ou até atacar.', escola: 'ilusao'
      },
      'queimadura_aganazzar': {
        nome: 'Queimadura de Aganazzar', descricao: 'Linha de fogo causa 1d8/2 níveis até 5d8.', escola: 'evocacao', fonte: 'FR',
      },
      'mao_espectral': {
        nome: 'Mão Espectral', descricao: 'Mão brilhante realiza ataques de toque, permitindo lançamento de feitiços de 4º nível ou menor com +2 de bônus, como ação de ataque. Ao criar a mão, perde-se 1d4 pontos de vida.', escola: 'evocacao', fonte: 'FR',
      },
      'patas_de_aranha': {
        nome: 'Patas de Aranha', descricao: 'Concede habilidade para andar em parede e tetos.', escola: 'transmutacao'
      },
      'resistir_elementos': {
        nome: 'Resistência a Elementos', descricao: 'Criatura ganha resistência 10, 20 no 7º nível ou 30 no 11º nível) a um tipo de elemento', escola: 'abjuracao', duracao: '10 min / nível',
      },
      'teia': {
        nome: 'Teia', descricao: '4 quadrados de teia apoiada em lados opostos prende criaturas na área. Ver descrição para mais detalhes.'
      },
      'vitalidade_ilusoria': {
        nome: 'Vitalidade Ilusória', descricao: 'Ganha 1d10 + (1 PV / nível) temporários por 1h / nível.',
        escola: 'necromancia', duracao: '1h / nível'
      },
      'nublar': {
        nome: 'Nublar', descricao: 'Ataques têm 20% de chance de falha.', escola: 'ilusao', duracao: '1 min / nível'
      }
    },
    3: {
      'relampago': {
        nome: 'Relâmpago', descricao: 'Eletricidade causa 1d6/nível', escola: 'evocacao',
      },
      'toque_vampirico': {
        nome: 'Toque Vampírico', descricao: 'Toque causa 1d6/2 níveis, conjurador recebe os PV como temporários.', escola: 'necromancia',
      },
    },
    4: {
      'pele_rochosa': {
        nome: 'Pele Rochosa', descricao: 'Resistência de 10 dano/adamante até 10/nível, max 150.', escola: 'abjuracao',
      },
    },
  },
  bardo: {
  },
  druida: {
  },
  feiticeiro: {
  },
  ranger: {
    1: {
      'acalmar_animais': {
        nome: 'Acalmar Animais', descricao: 'Acalma 2d4+nivel DV de animais', escola: 'encantamento',
      },
      'alarme': {
        nome: 'Alarme', descricao: 'Protege uma área durante 2h/nível', escola: 'abjuracao',
      },
      'constricao': {
        nome: 'Constrição', descricao: 'Plantas enredam todos em um círculo de 12m de raio', escola: 'transmutacao',
      },
      'detectar_animais_ou_plantas': {
        nome: 'Detectar Animais ou Plantas', descricao: 'Detecta espécies de animais ou plantas.', escola: '',
      },
      'detectar_armadilhas': {
        nome: 'Detectar Armadilhas', descricao: 'Revela armadilhas naturais ou primitivas', escola: '',
      },
      'detectar_venenos': {
        nome: 'Detectar Venenos', descricao: 'Detecta veneno em uma criatura ou objeto', escola: '',
      },
      'enfeiticar_animal': {
        nome: 'Torna um animal seu aliado', descricao: '', escola: '',
      },
      'falar_com_animais': {
        nome: 'Falar com Animais', descricao: 'Comunicação com animais naturais', escola: '',
      },
      'invisibilidade_contra_animais': {
        nome: 'Invisibilidade Contra Animais', descricao: 'Animais não percebem 1 alvo/nível.', escola: '',
      },
      'invocar_aliado_natureza_i': {
        nome: 'Invocar Aliado da Natureza I', descricao: 'Invoca animais para auxílio.', escola: 'conjuracao',
      },
      'ler_magias': {
        nome: 'Ler Magias', descricao: 'Decifra pergaminho ou grimórios', escola: '',
      },
      'mensageiro_animal': {
        nome: 'Mensageiro Animal', descricao: 'Envia um animal miúdo para um local específico.', escola: '',
      },
      'passos_longos': {
        nome: 'Passos Longos', descricao: 'Aumenta deslocamento em 3m (dois quadrados)', escola: '',
      },
      'passos_sem_pegadas': {
        nome: 'Passos sem Pegadas', descricao: 'Um alvo/nível não deixa rastro.', escola: '',
      },
      'presa_magica': {
        nome: 'Presa mágica', descricao: 'Uma arma natural do alvo recebe +1 ataque e dano', escola: '',
      },
      'resistencia_elementos': {
        nome: 'Ignora 10 ou mais dano/ataque contra um tipo de energia', descricao: '', escola: '',
      },
      'retardar_envenenamento': {
        nome: 'Retardar Envenenamento', descricao: 'Impede que veneno cause dano ao alvo durante 1 hora/nível', escola: '',
      },
      'salto': {
        nome: 'Salto', descricao: 'Alvo recebe bônus de saltar.', escola: '',
      },
      'suportar_elementos': {
        nome: 'Suportar Elementos', descricao: 'Mantém uma criatura confortável dentro de ambientes áridos.', escola: '',
      },
    },
    2: {
      '': {
        nome: '', descricao: '', escola: '',
      },
    },
    3: {
      '': {
        nome: '', descricao: '', escola: '',
      },
    },
    4: {
      '': {
        nome: '', descricao: '', escola: '',
      },
    },
  },
};
tabelas_lista_feiticos['mago_necromante'] = tabelas_lista_feiticos['mago'];
// Todos os feiticos ordenados por chave.
var tabelas_lista_feiticos_completa = {};
// Tabela de nome para chave_feitico.
var tabelas_lista_feiticos_invertida = {};

// Tabelas de feiticos. Todas as entradas de por dia e conhecidos devem ter o mesmo numero de caracteres.
// ATENCAO: todas as tabelas sao indexadas pelo nivel da classe. Porem, algumas classes alteram esse valor, por exemplo, teurgista mistico.
// O valor a ser usado da classe eh indice_feiticos.
// TODO adicionar uma variavel precisa_memorizar. O precisa_conhecer esta sendo sobreusado para este proposito.
var tabelas_feiticos = {
  adepto: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: true,
      por_nivel: {
          1: { por_dia: '31',   },
          2: { por_dia: '31',   },
          3: { por_dia: '32',   },
          4: { por_dia: '320',  },
          5: { por_dia: '321',  },
          6: { por_dia: '321',  },
          7: { por_dia: '332',  },
          8: { por_dia: '3320', },
          9: { por_dia: '3321', },
          10: { por_dia: '3321', },
          11: { por_dia: '3332', },
          12: { por_dia: '33320', },
          13: { por_dia: '33321', },
          14: { por_dia: '33321', },
          15: { por_dia: '33332', },
          16: { por_dia: '333320', },
          17: { por_dia: '333321', },
          18: { por_dia: '333321', },
          19: { por_dia: '333332', },
          20: { por_dia: '333332', }, }, },
  bardo: {
      atributo_chave: 'carisma',
      precisa_conhecer: true,
      possui_nivel_zero: true,
      por_nivel: {
          1: { por_dia: '2', conhecidos: '4', },
          2: { por_dia: '30', conhecidos: '52', },
          3: { por_dia: '31', conhecidos: '63', },
          4: { por_dia: '320', conhecidos: '632', },
          5: { por_dia: '331', conhecidos: '643', },
          6: { por_dia: '332', conhecidos: '643', },
          7: { por_dia: '3320', conhecidos: '6442', },
          8: { por_dia: '3331', conhecidos: '6443', },
          9: { por_dia: '3332', conhecidos: '6443', },
          10: { por_dia: '33320', conhecidos: '64442', },
          11: { por_dia: '33331', conhecidos: '64443', },
          12: { por_dia: '33332', conhecidos: '64443', },
          13: { por_dia: '333320', conhecidos: '644442', },
          14: { por_dia: '433331', conhecidos: '644443', },
          15: { por_dia: '443332', conhecidos: '644443', },
          16: { por_dia: '4443320', conhecidos: '6544442', },
          17: { por_dia: '4444331', conhecidos: '6554443', },
          18: { por_dia: '4444432', conhecidos: '6555443', },
          19: { por_dia: '4444443', conhecidos: '6555544', },
          20: { por_dia: '4444444', conhecidos: '6555554', }, }, },
  clerigo: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: true,
      possui_dominio: true,
      por_nivel: {
          1: { por_dia: '31', },
          2: { por_dia: '42', },
          3: { por_dia: '421', },
          4: { por_dia: '532', },
          5: { por_dia: '5321', },
          6: { por_dia: '5332', },
          7: { por_dia: '64321', },
          8: { por_dia: '64332', },
          9: { por_dia: '644321', },
          10: { por_dia: '644332', },
          11: { por_dia: '6544321', },
          12: { por_dia: '6544332', },
          13: { por_dia: '65544321', },
          14: { por_dia: '65544332', },
          15: { por_dia: '655544321', },
          16: { por_dia: '655544332', },
          17: { por_dia: '6555544321', },
          18: { por_dia: '6555544332', },
          19: { por_dia: '6555554433', },
          20: { por_dia: '6555554444', }, }, },
  druida: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: true,
      por_nivel: {
          1: { por_dia: '31' },
          2: { por_dia: '42' },
          3: { por_dia: '421' },
          4: { por_dia: '532' },
          5: { por_dia: '5321' },
          6: { por_dia: '5332' },
          7: { por_dia: '64321' },
          8: { por_dia: '64332' },
          9: { por_dia: '644321' },
          10: { por_dia: '644332' },
          11: { por_dia: '6544321' },
          12: { por_dia: '6544332' },
          13: { por_dia: '65544321' },
          14: { por_dia: '65544332' },
          15: { por_dia: '655544321' },
          16: { por_dia: '655544332' },
          17: { por_dia: '6555544321' },
          18: { por_dia: '6555544332' },
          19: { por_dia: '6555554433' },
          20: { por_dia: '6555554444' }, }, },
  feiticeiro: {
      atributo_chave: 'carisma',
      precisa_conhecer: true,
      possui_nivel_zero: true,
      por_nivel: {
          1: { por_dia: '53', conhecidos: '42', },
          2: { por_dia: '64', conhecidos: '52', },
          3: { por_dia: '65', conhecidos: '53', },
          4: { por_dia: '663', conhecidos: '631', },
          5: { por_dia: '664', conhecidos: '642', },
          6: { por_dia: '6653', conhecidos: '7421', },
          7: { por_dia: '6664', conhecidos: '7532', },
          8: { por_dia: '66653', conhecidos: '85321', },
          9: { por_dia: '66664', conhecidos: '85432', },
          10: { por_dia: '666653', conhecidos: '954321', },
          11: { por_dia: '666664', conhecidos: '955432', },
          12: { por_dia: '6666653', conhecidos: '9554321', },
          13: { por_dia: '6666664', conhecidos: '9554432', },
          14: { por_dia: '66666653', conhecidos: '95544321', },
          15: { por_dia: '66666664', conhecidos: '95544432', },
          16: { por_dia: '666666653', conhecidos: '955444321', },
          17: { por_dia: '666666664', conhecidos: '955444332', },
          18: { por_dia: '6666666653', conhecidos: '9554443321', },
          19: { por_dia: '6666666664', conhecidos: '9554443332', },
          20: { por_dia: '6666666666', conhecidos: '9554443333', }, }, },
  mago: {
      atributo_chave: 'inteligencia',
      precisa_conhecer: false,
      possui_nivel_zero: true,
      por_nivel: {
          1:  { por_dia: '31', },
          2:  { por_dia: '42', },
          3:  { por_dia: '421', },
          4:  { por_dia: '432', },
          5:  { por_dia: '4321', },
          6:  { por_dia: '4332', },
          7:  { por_dia: '44321', },
          8:  { por_dia: '44332', },
          9:  { por_dia: '444321', },
          10: { por_dia: '444332', },
          11: { por_dia: '4444321', },
          12: { por_dia: '4444332', },
          13: { por_dia: '44444321', },
          14: { por_dia: '44444332', },
          15: { por_dia: '444444321', },
          16: { por_dia: '444444332', },
          17: { por_dia: '4444444321', },
          18: { por_dia: '4444444332', },
          19: { por_dia: '4444444433', },
          20: { por_dia: '4444444444', }, }, },
  mago_necromante: {
      atributo_chave: 'inteligencia',
      escola_especializada: 'necromancia',
      num_escolas_proibidas: 2,
      precisa_conhecer: false,
      possui_nivel_zero: true,
      por_nivel: {
          1:  { por_dia: '31', },
          2:  { por_dia: '42', },
          3:  { por_dia: '421', },
          4:  { por_dia: '432', },
          5:  { por_dia: '4321', },
          6:  { por_dia: '4332', },
          7:  { por_dia: '44321', },
          8:  { por_dia: '44332', },
          9:  { por_dia: '444321', },
          10: { por_dia: '444332', },
          11: { por_dia: '4444321', },
          12: { por_dia: '4444332', },
          13: { por_dia: '44444321', },
          14: { por_dia: '44444332', },
          15: { por_dia: '444444321', },
          16: { por_dia: '444444332', },
          17: { por_dia: '4444444321', },
          18: { por_dia: '4444444332', },
          19: { por_dia: '4444444433', },
          20: { por_dia: '4444444444', }, }, },
  paladino: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: false,
      por_nivel: {
          1: { por_dia: '' },
          2: { por_dia: '' },
          3: { por_dia: '' },
          4: { por_dia: '0' },
          5: { por_dia: '0' },
          6: { por_dia: '1' },
          7: { por_dia: '1' },
          8: { por_dia: '10' },
          9: { por_dia: '10' },
          10: { por_dia: '11' },
          11: { por_dia: '110' },
          12: { por_dia: '111' },
          13: { por_dia: '111' },
          14: { por_dia: '2110' },
          15: { por_dia: '2111' },
          16: { por_dia: '2211' },
          17: { por_dia: '2221' },
          18: { por_dia: '3221' },
          19: { por_dia: '3332' },
          20: { por_dia: '3333' }, }, },
  ranger: {
      atributo_chave: 'sabedoria',
      precisa_conhecer: false,
      possui_nivel_zero: false,
      por_nivel: {
          1: { por_dia: '' },
          2: { por_dia: '' },
          3: { por_dia: '' },
          4: { por_dia: '0' },
          5: { por_dia: '0' },
          6: { por_dia: '1' },
          7: { por_dia: '1' },
          8: { por_dia: '10' },
          9: { por_dia: '10' },
          10: { por_dia: '11' },
          11: { por_dia: '110' },
          12: { por_dia: '111' },
          13: { por_dia: '111' },
          14: { por_dia: '2110' },
          15: { por_dia: '2111' },
          16: { por_dia: '2211' },
          17: { por_dia: '2221' },
          18: { por_dia: '3221' },
          19: { por_dia: '3332' },
          20: { por_dia: '3333' }, }, },
};
// Este arquivo nao deve ter nenhuma referencia ao objeto entradas. A unica funcao exportada
// calcula todas as dependencias das entradas ja convertidas. Como durante a conversao nem sempre
// eh possivel podar os valores, as verificacoes de consistencia devem ser feitas aqui ao inves
// do arquivo converte.

function DependenciasGerais() {
  _DependenciasNivelConjurador();
  _DependenciasEquipamentos();
  _DependenciasFamiliar();
  _DependenciasDadosVida();
  _DependenciasAtributos();
  _DependenciasTalentos();
  _DependenciasPontosVida();
  _DependenciasIniciativa();
  _DependenciasTamanho();
  _DependenciasBba();
  _DependenciasProficienciaArmas();
  _DependenciasHabilidadesEspeciais();
  _DependenciasImunidades();
  _DependenciasResistenciaMagia();

  // So pode fazer aqui, pois os pre requisitos dependem de atributos, classes,
  // talentos, proficiencias...
  // TODO se essa funcao falhar, potencialmente o personagem tera que ser recarregado.
  _VerificaPrerequisitosTalento();

  _DependenciasPericias();
  _DependenciasFocoArmas();
  _DependenciasEspecializacaoArmas();
  _DependenciasClasseArmadura();
  _DependenciasArmas();
  _DependenciasEstilos();
  _DependenciasSalvacoes();
  _DependenciasFeiticos();
}

// Calcula a classe de conjurador para cada classe de personagem.
function _DependenciasNivelConjurador() {
  // Niveis basicos de conjurador.
  gPersonagem.classes.forEach(function(entrada_classe) {
    var classe_tabela = tabelas_classes[entrada_classe.classe];
    if (classe_tabela.nivel_conjurador == null) {
      entrada_classe.nivel_conjurador = 0;
      entrada_classe.linha_tabela_feiticos = 0;
    } else {
      var nivel_minimo = classe_tabela.nivel_conjurador.minimo || 0;
      if (entrada_classe.nivel < nivel_minimo) {
        entrada_classe.nivel_conjurador = 0;
        entrada_classe.linha_tabela_feiticos = 0;
        return;
      }
      var modificador_nivel_conjurador = classe_tabela.nivel_conjurador.modificador || 0;
      entrada_classe.nivel_conjurador = Math.floor(entrada_classe.nivel * modificador_nivel_conjurador);
      entrada_classe.linha_tabela_feiticos = entrada_classe.nivel;
    }
  });
  // Niveis incrementais de conjurador.
  gPersonagem.classes.forEach(function(classe_personagem_modificadora) {
    var classe_tabela = tabelas_classes[classe_personagem_modificadora.classe];
    if (classe_tabela.incremento_nivel_conjurador == null) {
      return;
    }
    classe_tabela.incremento_nivel_conjurador.forEach(function(tipo) {
      var classe_personagem = PersonagemMaiorClasseConjurador(tipo);
      if (classe_personagem == null) {
        return;
      }
      classe_personagem.nivel_conjurador += classe_personagem_modificadora.nivel;
      classe_personagem.linha_tabela_feiticos += classe_personagem_modificadora.nivel;
    });
  });
}

function _DependenciasFamiliar() {
  if (gPersonagem.familiar == null ||
      !(gPersonagem.familiar.chave in tabelas_familiares)) {
    return;
  }
  if (!gPersonagem.familiar.em_uso) {
    return;
  }
  _DependenciasItemOuFamiliar('familiar', tabelas_familiares[gPersonagem.familiar.chave]);
  // Pontos de vida base feito no DependenciasPontosVida.
}

function _DependenciasEquipamentos() {
  for (var chave_item in tabelas_itens) {
    _DependenciasItens(chave_item);
  }
}

function _DependenciasItens(tipo_item) {
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    var item = gPersonagem[tipo_item][i];
    if (!item.em_uso) {
      continue;
    }
    _DependenciasItemOuFamiliar(item.chave, tabelas_itens[tipo_item].tabela[item.chave]);
  }
}

// Calcula as dependencias do item.
// @param chave_item a chave do item.
// @param item_tabela ou familiar, deve conter propriedades.
function _DependenciasItemOuFamiliar(chave_item, item_tabela) {
  for (var propriedade in item_tabela.propriedades) {
    if (propriedade == 'ca') {
      _DependenciasItemCa(chave_item, item_tabela);
    } else if (propriedade == 'pericias') {
      _DependenciasItemPericias(chave_item, item_tabela);
    } else if (propriedade == 'salvacoes') {
      _DependenciasItemSalvacoes(chave_item, item_tabela);
    } else if (propriedade == 'atributos') {
      _DependenciasItemAtributos(chave_item, item_tabela);
    } else if (propriedade == 'tamanho') {
      _DependenciasItemTamanho(chave_item, item_tabela);
    } else if (propriedade == 'bonus_pv') {
      _DependenciasItemPontosVida(chave_item, item_tabela);
    } else if (propriedade == 'especiais') {
      _DependenciasItemEspeciais(chave_item, item_tabela);
    }
  }
}

// Item que afeta as salvacoes (resistencias).
function _DependenciasItemSalvacoes(chave_item, item_tabela) {
  if ('todas' in item_tabela.propriedades.salvacoes) {
    for (var chave_personagem in gPersonagem.salvacoes) {
      gPersonagem.salvacoes[chave_personagem].Adiciona(
          'resistencia', chave_item, item_tabela.propriedades.salvacoes['todas']);
    }
    return;
  }
  for (var chave_salvacao in item_tabela.propriedades.salvacoes) {
    gPersonagem.salvacoes[chave_salvacao].Adiciona(
        'resistencia', chave_item, item_tabela.propriedades.salvacoes[chave_salvacao]);
  }
}

// Item que afeta atributos.
function _DependenciasItemAtributos(chave_item, item_tabela) {
  for (var chave_atributo in item_tabela.propriedades.atributos) {
    gPersonagem.atributos[chave_atributo].bonus.Adiciona(
        'melhoria', chave_item, item_tabela.propriedades.atributos[chave_atributo]);
  }
}

function _DependenciasItemTamanho(chave_item, item_tabela) {
  var quantidade = item_tabela.propriedades.tamanho;
  while (quantidade != 0) {
    var tamanho_personagem = tabelas_tamanho[gPersonagem.tamanho.categoria];
    var proximo = quantidade > 0 ? tamanho_personagem.maior : tamanho_personagem.menor;
    if (proximo == null) {
      break;
    }
    gPersonagem.tamanho.categoria = proximo;
    quantidade += (quantidade > 0) ? -1 : 1;
  }
}

// Item que afeta a classe de armadura.
function _DependenciasItemCa(chave_item, item_tabela) {
  for (var chave_ca in item_tabela.propriedades.ca) {
    gPersonagem.ca.bonus.Adiciona(
        chave_ca, chave_item, item_tabela.propriedades.ca[chave_ca]);
  }
}

// Item que afeta pericias.
function _DependenciasItemPericias(chave_item, item_tabela) {
  for (var chave_pericia in item_tabela.propriedades.pericias) {
    for (var chave_bonus in item_tabela.propriedades.pericias[chave_pericia]) {
      gPersonagem.pericias.lista[chave_pericia].bonus.Adiciona(
          chave_bonus, chave_item, item_tabela.propriedades.pericias[chave_pericia][chave_bonus]);
    }
  }
}

function _DependenciasItemPontosVida(chave_item, item_tabela) {
  for (var chave_bonus in item_tabela.propriedades.bonus_pv) {
    gPersonagem.pontos_vida.bonus.Adiciona(
        chave_bonus, chave_item, item_tabela.propriedades.bonus_pv[chave_bonus]);
  }
}

function _DependenciasItemEspeciais(chave_item, item_tabela) {
  for (var chave_especial in item_tabela.propriedades.especiais) {
    if (chave_especial in gPersonagem.especiais) {
      gPersonagem.especiais.vezes += item_tabela.propriedades.especiais[chave_especial];
    } else {
      gPersonagem.especiais[chave_especial] = {
        vezes: item_tabela.propriedades.especiais[chave_especial], usado: 0, complemento: ''
      }
    }
  }
}

function _DependenciasDadosVida() {
}

function _DependenciasAtributos() {
  // Bonus de atributos de acordo com nivel total de gPersonagem.
  var nivel_total = gPersonagem.dados_vida.nivel_personagem;
  gPersonagem.atributos.pontos.disponiveis =
     Math.floor(nivel_total / 4);
  if (gPersonagem.atributos.pontos.gastos.length >
      gPersonagem.atributos.pontos.disponiveis) {
    // Pode acontecer com retirada ou diminuicao de niveis.
    gPersonagem.atributos.pontos.gastos.length =
        gPersonagem.atributos.pontos.disponiveis;
  }

  // Calcula o componentes dos atributos.
  var bonus_nivel_por_atributo = {};
  for (var atributo in tabelas_atributos) {
    var atributo_personagem = gPersonagem.atributos[atributo];
    // racial.
    atributo_personagem.bonus.Adiciona('racial', null, tabelas_raca[gPersonagem.raca].atributos[atributo] || 0);
    // template.
    if (gPersonagem.template.length != 0 && ('atributos' in tabelas_template[gPersonagem.template])) {
      atributo_personagem.bonus.Adiciona('template', null, tabelas_template[gPersonagem.template].atributos[atributo] || 0);
    }
    bonus_nivel_por_atributo[atributo] = 0;
  }
  // Calcula os bonus de nivel para cada atributo.
  for (var i = 0; i < gPersonagem.atributos.pontos.gastos.length; ++i) {
    ++bonus_nivel_por_atributo[gPersonagem.atributos.pontos.gastos[i]];
  }
  for (var atributo in bonus_nivel_por_atributo) {
    gPersonagem.atributos[atributo].bonus.Adiciona('nivel', null, bonus_nivel_por_atributo[atributo]);
  }
  // Valor final e modificador.
  for (var atributo in tabelas_atributos) {
    var atributo_personagem = gPersonagem.atributos[atributo];
    atributo_personagem.modificador = modificador_atributo(atributo_personagem.bonus.Total());
  }
}

function _DependenciasTalentos() {
  // Gerais.
  var talentos_gerais_por_nivel =
      1 + Math.floor(gPersonagem.dados_vida.nivel_personagem / 3);
  if (tabelas_raca[gPersonagem.raca].talento_extra) {
    ++talentos_gerais_por_nivel;
  }
  if (gPersonagem.familiar != null && gPersonagem.familiar.em_uso) {
    gPersonagem.talentos['gerais'][talentos_gerais_por_nivel] = {
      chave: 'prontidao', complemento: 'familiar', imutavel: true
    };
    ++talentos_gerais_por_nivel;  // alerta
  }
  gPersonagem.talentos['gerais'].length = talentos_gerais_por_nivel;

  // Outros nao precisa fazer nada.
  // Guerreiro.
  var nivel_guerreiro = PersonagemNivelClasse('guerreiro');
  if (nivel_guerreiro > 0) {
    gPersonagem.talentos['guerreiro'].length = 1 + Math.floor(nivel_guerreiro / 2);
  } else {
    gPersonagem.talentos['guerreiro'].length = 0;
  }
  // Mago.
  gPersonagem.talentos['mago'].length =
      Math.floor(PersonagemNivelClasse('mago') / 5) +
      Math.floor(PersonagemNivelClasse('mago_necromante') / 5);
  // Monge.
  var nivel_monge = PersonagemNivelClasse('monge');
  if (nivel_monge >= 6) {
    gPersonagem.talentos['monge'].length = 3;
  } else if (nivel_monge >= 2) {
    gPersonagem.talentos['monge'].length = 2;
  } else if (nivel_monge == 1) {
    gPersonagem.talentos['monge'].length = 1;
  } else {
    gPersonagem.talentos['monge'].length = 0;
  }
  // Ranger.
  var nivel_ranger = PersonagemNivelClasse('ranger');
  if (nivel_ranger >= 11) {
    gPersonagem.talentos['ranger'].length = 3;
  } else if (nivel_ranger >= 6) {
    gPersonagem.talentos['ranger'].length = 2;
  } else if (nivel_ranger == 2) {
    gPersonagem.talentos['ranger'].length = 1;
  } else {
    gPersonagem.talentos['ranger'].length = 0;
  }

  // Calcula o impacto dos talentos no resto.
  for (var chave_classe in gPersonagem.talentos) {
    for (var i = 0; i < gPersonagem.talentos[chave_classe].length; ++i) {
      if (gPersonagem.talentos[chave_classe][i] != null) {
        _DependenciasTalento(gPersonagem.talentos[chave_classe][i]);
      } else {
        gPersonagem.talentos[chave_classe][i] = { chave: '', complemento: '' };
      }
    }
  }
}

// @param indice necessario para geracao de subtipos unicos.
function _DependenciasTalento(talento_personagem, indice) {
  var chave_talento = talento_personagem.chave;
  var talento = tabelas_talentos[chave_talento];
  if (talento == null) {
    return;
  }
  var bonus_pericias = talento.bonus_pericias;
  for (var chave_pericia in bonus_pericias) {
    gPersonagem.pericias.lista[chave_pericia].bonus.Adiciona(
        'talento', chave_talento, bonus_pericias[chave_pericia]);
  }
  // Caso o talento seja cumulativo, a chave deve ser unica pro bonus acumular.
  var subchave_bonus = talento.cumulativo ?
      chave_talento + '-' + indice : chave_talento;
  if ('bonus_iniciativa' in talento) {
    gPersonagem.iniciativa.Adiciona(
        'talento', subchave_bonus, talento.bonus_iniciativa);
  }
  if ('bonus_pv' in talento) {
    gPersonagem.pontos_vida.bonus.Adiciona(
        'talento', subchave_bonus, talento.bonus_pv);
  }
  if ('bonus_salvacao' in talento) {
    for (var tipo_salvacao in talento['bonus_salvacao']) {
      gPersonagem.salvacoes[tipo_salvacao].Adiciona(
          'talento', subchave_bonus, talento.bonus_salvacao[tipo_salvacao]);
    }
  }
  if ('bonus_ca' in talento) {
    for (var tipo_bonus in talento['bonus_ca']) {
      gPersonagem.ca.bonus.Adiciona(tipo_bonus, 'talento_' + chave_talento , talento.bonus_ca[tipo_bonus]);
    }
  }
}

function _DependenciasPontosVida() {
  gPersonagem.pontos_vida.bonus.Adiciona(
      'atributo', 'constituicao',
      gPersonagem.dados_vida.nivel_personagem * gPersonagem.atributos['constituicao'].modificador);
  gPersonagem.pontos_vida.bonus.Adiciona(
      'niveis_negativos', '-', -5 * gPersonagem.niveis_negativos);
  // Familiar tem que ser aqui, pq depende dos pontos de vida do personagem e o personagem pode depender do familiar tb.
  if (gPersonagem.familiar == null ||
      !(gPersonagem.familiar.chave in tabelas_familiares) ||
      !gPersonagem.familiar.em_uso) {
    return;
  }
  gPersonagem.familiar.pontos_vida.base =
    Math.floor((gPersonagem.pontos_vida.total_dados + gPersonagem.pontos_vida.bonus.Total()) / 2.0);
}

function _DependenciasIniciativa() {
  gPersonagem.iniciativa.Adiciona(
      'atributo', 'destreza', gPersonagem.atributos['destreza'].modificador);
}

function _DependenciasTamanho() {
  gPersonagem.tamanho.modificador_ataque_defesa =
      tabelas_tamanho[gPersonagem.tamanho.categoria].ataque_defesa;
  gPersonagem.tamanho.modificador_agarrar =
      tabelas_tamanho[gPersonagem.tamanho.categoria].agarrar;
}

function _DependenciasBba() {
  gPersonagem.bba = 0;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    gPersonagem.bba +=
        tabelas_classes[gPersonagem.classes[i].classe].bba(gPersonagem.classes[i].nivel);
  }

  gPersonagem.bba -= gPersonagem.niveis_negativos;
  gPersonagem.bba_cac =
      gPersonagem.bba + gPersonagem.atributos['forca'].modificador +
      gPersonagem.tamanho.modificador_ataque_defesa;
  gPersonagem.bba_cac_acuidade =
      gPersonagem.bba + gPersonagem.atributos['destreza'].modificador +
      gPersonagem.tamanho.modificador_ataque_defesa;
  // Por enquanto, nao encontrei nenhum caso que seja diferente de acuidade e distancia.
  gPersonagem.bba_distancia = gPersonagem.bba_cac_acuidade;
  gPersonagem.numero_ataques = (gPersonagem.bba == 0) ? 1 : Math.floor((gPersonagem.bba - 1) / 5) + 1;
  gPersonagem.agarrar =
      gPersonagem.bba +
      gPersonagem.atributos['forca'].modificador +
      gPersonagem.tamanho.modificador_agarrar;
}

// Converte a proficiencia em armas do personagem.
function _DependenciasProficienciaArmas() {
  var todas_simples = false;
  var todas_comuns = false;
  gPersonagem.proficiencia_armas = {};
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var chave_classe = gPersonagem.classes[i].classe;
    var tabela_classe = tabelas_classes[chave_classe];
    var armas_classe = tabela_classe.proficiencia_armas || [];
    for (var j = 0; j < armas_classe.length; ++j) {
      gPersonagem.proficiencia_armas[armas_classe[j]] = true;
      if (armas_classe[j] == 'arco_curto' || armas_classe[j] == 'arco_longo') {
        for (var arma_tabela in tabelas_armas_comuns) {
          if (arma_tabela.indexOf(armas_classe[j]) == 0) {
            gPersonagem.proficiencia_armas[arma_tabela] = true;
          } 
        }
      }
    }
    // TODO usar a nova funcao de PersonagemProficienteTipoArma.
    var talentos_classe = tabela_classe.talentos || [];
    for (var j = 0; j < talentos_classe.length; ++j) {
      if (talentos_classe[j] == 'usar_armas_simples') {
        todas_simples = true;
      } else if (talentos_classe[j] == 'usar_armas_comuns') {
        todas_comuns = true;
      }
    }
  }
  gPersonagem.proficiencia_armas['desarmado'] = true;
  gPersonagem.proficiencia_armas['manopla'] = true;
  if (todas_simples) {
    for (var arma in tabelas_armas_simples) {
      gPersonagem.proficiencia_armas[arma] = true;
    }
  }
  if (todas_comuns) {
    for (var arma in tabelas_armas_comuns) {
      gPersonagem.proficiencia_armas[arma] = true;
    }
    // Familiaridade.
    for (var arma in tabelas_raca[gPersonagem.raca].familiaridade_arma) {
      gPersonagem.proficiencia_armas[arma] = true;
    }
  }
  // Raciais.
  var armas_raca = tabelas_raca[gPersonagem.raca].proficiencia_armas;
  for (var i = 0; armas_raca != null && i < armas_raca.length; ++i) {
    gPersonagem.proficiencia_armas[armas_raca[i]] = true;
  }

  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in gPersonagem.talentos) {
    var lista_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_classe.length; ++i) {
      var talento = lista_classe[i];
      if ((talento.chave == 'usar_arma_comum' ||
           talento.chave == 'usar_arma_exotica') &&
          (talento.complemento != null) &&
          talento.complemento.length > 0) {
        var chave_arma = tabelas_armas_invertida[talento.complemento];
        // TODO remover essa verificacao quando o input dos talentos estiver
        // terminado.
        if (chave_arma == null) {
          Mensagem(Traduz('Arma') + ' "' + talento.complemento + '" ' + Traduz('inválida para talento') + ' "' +
                Traduz(tabelas_talentos[talento.chave].nome) + '"');
          continue;
        }
        var arma_tabela = tabelas_armas[chave_arma];
        if (arma_tabela.talento_relacionado != talento.chave) {
          // verifica familiaridade.
          var familiar = false;
          if (arma_tabela.talento_relacionado == 'usar_arma_exotica' &&
              tabelas_raca[gPersonagem.raca].familiaridade_arma &&
              tabelas_raca[gPersonagem.raca].familiaridade_arma[chave_arma] &&
              talento.chave == 'usar_arma_comum') {
            familiar = true;
          }
          if (!familiar) {
            Mensagem(Traduz('Arma') + ' "' + talento.complemento + '" ' + Traduz('inválida para talento') + ' "' +
                  Traduz(tabelas_talentos[talento.chave].nome) + '"');
            continue;
          }
        }
        gPersonagem.proficiencia_armas[chave_arma] = true;
      }
    }
  }
}

// Retorna o numero de vezes que o especial pode ser usado.
function _VezesEspecial(especial) {
  var especial_tabela = tabelas_especiais[especial];
  var valor = 0;
  if ('vezes' in especial_tabela) {
    var valor = especial_tabela.vezes.fixo || 0;
    if ('nivel' in especial_tabela.vezes) {
      valor += PersonagemNivelClasse(especial_tabela.vezes.nivel);
    }
    if ('atributo' in especial_tabela.vezes) {
      valor += gPersonagem.atributos[especial_tabela.vezes.atributo].modificador;
    }
    if ('talento' in especial_tabela.vezes && PersonagemPossuiTalento(especial_tabela.vezes.talento.chave)) {
      valor += especial_tabela.vezes.talento.fixo;
    }
  }
  return valor;
}

function _DependenciaHabilidadeEspecial(especial) {
  var valor = _VezesEspecial(especial);
  if (especial in gPersonagem.especiais) {
    gPersonagem.especiais[especial].vezes += valor;
  } else {
    gPersonagem.especiais[especial] = { vezes: valor };
  }
}

// Habilidades especiais do gPersonagem.
function _DependenciasHabilidadesEspeciais() {
  var especiais_antes = gPersonagem.especiais;
  var especiais_nivel_classe = [];
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var entrada_classe = gPersonagem.classes[i];
    if (tabelas_classes[entrada_classe.classe].especiais == null) {
      continue;
    }
    especiais_nivel_classe.push(
        { nivel: PersonagemNivelClasse(entrada_classe.classe), especiais_classe: tabelas_classes[entrada_classe.classe].especiais });
  }
  if ('especiais' in tabelas_raca[gPersonagem.raca]) {
    especiais_nivel_classe.push({ nivel: PersonagemNivel(), especiais_classe: tabelas_raca[gPersonagem.raca].especiais });
  }
  var template_pc = PersonagemTemplate();
  if (template_pc != null && 'especiais' in template_pc) {
    especiais_nivel_classe.push({ nivel: PersonagemNivel(), especiais_classe: template_pc.especiais });
  }

  for (var i = 0; i < especiais_nivel_classe.length; ++i) {
    var dados_nivel_classe = especiais_nivel_classe[i];
    for (var nivel = 1; nivel <= dados_nivel_classe.nivel; ++nivel) {
      var especiais_por_nivel = dados_nivel_classe.especiais_classe;
      if (!(nivel in especiais_por_nivel)) {
        continue;
      }
      for (var j = 0; j < especiais_por_nivel[nivel].length; ++j) {
        _DependenciaHabilidadeEspecial(especiais_por_nivel[nivel][j]);
      }
    }
  }
  gPersonagem.dominios.forEach(function(dominio) {
    if ('habilidade_especial' in tabelas_dominios[dominio]) {
      _DependenciaHabilidadeEspecial(tabelas_dominios[dominio].habilidade_especial);
    }
  });

  // Atualiza o numero de usos de cada especial.
  for (var chave_especial in gPersonagem.especiais) {
    if (chave_especial in especiais_antes) {
      gPersonagem.especiais[chave_especial].usado = especiais_antes[chave_especial].usado || 0;
    } else {
      gPersonagem.especiais[chave_especial].usado = 0;
    }
  }
}

function _DependenciasImunidades() {
  var tabelas = [ tabelas_raca[gPersonagem.raca] ];
  if (gPersonagem.template.length > 0) {
    tabelas.push(tabelas_template[gPersonagem.template]);
  }
  tabelas.forEach(function(tabela) {
    if ('imunidades' in tabela) {
      gPersonagem.imunidades = gPersonagem.imunidades.concat(tabela['imunidades']);
    }
  });
}

function _DependenciasResistenciaMagia() {
  var tabelas = [ tabelas_raca[gPersonagem.raca] ];
  if (gPersonagem.template.length > 0) {
    tabelas.push(tabelas_template[gPersonagem.template]);
  }
  tabelas.forEach(function(tabela) {
    if ('resistencia_magia' in tabela) {
      gPersonagem.resistencia_magia = gPersonagem.resistencia_magia.concat(tabela['resistencia_magia']);
    }
  });
}

function _VerificaPrerequisitosTalento() {
  for (var chave_classe in gPersonagem.talentos) {
    var lista_talentos_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_talentos_classe.length; ++i) {
      var talento = lista_talentos_classe[i];
      if (tabelas_talentos[talento.chave] == null) {
        continue;
      }
      if (tabelas_talentos[talento.chave].complemento &&
          talento.complemento &&
          talento.complemento != '' &&
          !_VerificaTipoComplementoTalento(talento)) {
        talento.complemento = null;
      }
      // Talentos de monge e ranger nao precisa do prerequisito.
      if (chave_classe == 'monge' || chave_classe == 'ranger') {
        continue;
      }
      var erro = PersonagemVerificaPrerequisitosTalento(talento.chave, talento.complemento);
      if (erro != null) {
        talento.complemento = null;
        talento.chave = 'usar_armas_simples';
        Mensagem(erro);
      }
    }
  }
}

// @return true se o complemento for do tipo correto.
function _VerificaTipoComplementoTalento(talento) {
  var talento_tabela = tabelas_talentos[talento.chave];
  if (talento_tabela.complemento.indexOf('arma') != -1) {
    var chave_arma = tabelas_armas_invertida[talento.complemento];
    if (chave_arma == null) {
      return false;
    }
    if (talento_tabela.complemento == 'arma_leve') {
      return tabelas_armas[chave_arma].categorias['cac_leve'] != null;
    } else if (talento_tabela.complemento == 'arma_comum') {
      return tabelas_armas_comuns[chave_arma] != null;
    } else if (talento_tabela.complemento == 'arma_exotica') {
      return tabelas_armas_exoticas[chave_arma] != null;
    }
  }
  return true;
}

function _DependenciasPericias() {
  gPersonagem.pericias.total_pontos = 0;
  var primeiro_nivel = true;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var nivel = gPersonagem.classes[i].nivel;
    var pontos_classe = tabelas_classes[gPersonagem.classes[i].classe].pontos_pericia;
    var pontos_raca = tabelas_raca[gPersonagem.raca].pontos_pericia || 0;
    var pontos_inteligencia = gPersonagem.atributos.inteligencia.modificador;

    // Se o primeiro nivel estiver neste pacote de niveis, ele conta como 3 niveis a mais.
    var pontos_iteracao = 0;
    if (primeiro_nivel) {
      nivel += 3;
      primeiro_nivel = false;
    }
    gPersonagem.pericias.total_pontos +=
        Math.max(pontos_classe + pontos_raca + pontos_inteligencia, 1) * nivel;
  }

  var max_pontos = gPersonagem.dados_vida.nivel_personagem + 3;
  gPersonagem.pericias.pontos_gastos = 0;
  for (var chave_pericia in gPersonagem.pericias.lista) {
    var pericia = tabelas_pericias[chave_pericia];
    var pericia_personagem = gPersonagem.pericias.lista[chave_pericia];
    pericia_personagem.de_classe = PersonagemPossuiUmaDasClasses(pericia.classes);
    pericia_personagem.pontos = Math.min(pericia_personagem.pontos, max_pontos);
    pericia_personagem.graduacoes = pericia_personagem.de_classe ?
        pericia_personagem.pontos : Math.floor(pericia_personagem.pontos / 2);
    pericia_personagem.bonus.Adiciona(
        'atributo', pericia.habilidade, gPersonagem.atributos[pericia.habilidade].modificador);
    // TODO isso aqui deve ta quebrado.
    // soma todos os bonus de talentos.
    for (var chave_talento in pericia_personagem.bonus_talentos) {
      pericia_personagem.bonus.Adiciona(
          'talento', chave_talento, pericia_personagem.bonus_talentos[chave_talento]);
    }
    // soma todos os bonus raciais.
    var bonus_racial_total = 0;
    gPersonagem.pericias.lista[chave_pericia].bonus_racial = 0;
    var raca_personagem = tabelas_raca[gPersonagem.raca];
    if (raca_personagem.bonus_pericias &&
        raca_personagem.bonus_pericias[chave_pericia] != null) {
      pericia_personagem.bonus.Adiciona(
          'racial', gPersonagem.raca, raca_personagem.bonus_pericias[chave_pericia]);
    }
    // template (tambem eh racial).
    var template_personagem = PersonagemTemplate();
    if (template_personagem != null) {
      if (template_personagem.bonus_pericias &&
          template_personagem.bonus_pericias[chave_pericia] != null) {
        pericia_personagem.bonus.Adiciona(
            'racial', gPersonagem.template, template_personagem.bonus_pericias[chave_pericia]);
      }
    }

    // Nivel negativo:
    if (gPersonagem.niveis_negativos > 0) {
      pericia_personagem.bonus.Adiciona(
          'niveis_negativos', '-', -gPersonagem.niveis_negativos);
    }

    pericia_personagem.total =
        pericia_personagem.graduacoes + pericia_personagem.bonus.Total();
    gPersonagem.pericias.pontos_gastos += pericia_personagem.pontos;
  }
}

function _DependenciasFocoArmas() {
  gPersonagem.foco_armas = {};
  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in gPersonagem.talentos) {
    var lista_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_classe.length; ++i) {
      var talento = lista_classe[i];
      if (talento.chave && talento.chave.indexOf('foco_em_arma') != -1 &&
          talento.complemento != null) {
        var chave_arma = tabelas_armas_invertida[talento.complemento];
        if (talento.complemento == '') {
          continue;
        }
        if (chave_arma == null) {
          Mensagem('Arma "' + talento.complemento + '" inválida para talento "' +
                tabelas_talentos[talento.chave].nome + '"');
          continue;
        }
        gPersonagem.foco_armas[chave_arma] = talento.chave.indexOf('_maior') == -1 ? 1 : 2;
      }
    }
  }
}

function _DependenciasEspecializacaoArmas() {
  gPersonagem.especializacao_armas = {};
  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in gPersonagem.talentos) {
    var lista_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_classe.length; ++i) {
      var talento = lista_classe[i];
      if (talento.chave && talento.chave.indexOf('especializacao_arma') != -1 &&
          talento.complemento != null) {
        var chave_arma = tabelas_armas_invertida[talento.complemento];
        if (chave_arma == null) {
          Mensagem('Arma "' + talento.complemento + '" inválida para talento "' +
                tabelas_talentos[talento.chave].nome + '"');
          continue;
        }
        gPersonagem.especializacao_armas[chave_arma] = talento.chave.indexOf('_maior') == -1 ? 2 : 4;
      }
    }
  }
}

// Dependencias de armaduras e escudos.
function _DependenciasClasseArmadura() {
  gPersonagem.armadura = null;
  for (var i = 0; i < gPersonagem.armaduras.length; ++i) {
    if (gPersonagem.armaduras[i].entrada.em_uso) {
      gPersonagem.armadura = gPersonagem.armaduras[i];
      break;
    }
  }

  gPersonagem.escudo = null;
  for (var i = 0; i < gPersonagem.escudos.length; ++i) {
    if (gPersonagem.escudos[i].entrada.em_uso) {
      gPersonagem.escudo = gPersonagem.escudos[i];
      break;
    }
  }

  var bonus_ca = gPersonagem.ca.bonus;
  // Por classe.
  var bonus_classe = 0;
  for (var i_classe = 0; i_classe < gPersonagem.classes.length; ++i_classe) {
    var chave_classe = gPersonagem.classes[i_classe].classe;
    var nivel = gPersonagem.classes[i_classe].nivel;
    var tabela_classe = tabelas_classes[chave_classe];
    for (var i = 1; i <= nivel; ++i) {
      if (tabela_classe.especiais != null && tabela_classe.especiais[i] != null) {
        var especiais_classe_nivel = tabela_classe.especiais[i];
        for (var j = 0; j < especiais_classe_nivel.length; ++j) {
          if (especiais_classe_nivel[j] == 'bonus_ca') {
            ++bonus_classe;
          }
        }
      }
    }
  }
  bonus_ca.Adiciona('classe', 'monge', bonus_classe);

  if (gPersonagem.armadura != null) {
    bonus_ca.Adiciona(
        'armadura', 'armadura', tabelas_armaduras[gPersonagem.armadura.entrada.chave].bonus);
    bonus_ca.Adiciona(
        'armadura_melhoria', 'armadura', gPersonagem.armadura.entrada.bonus);
  }
  if (gPersonagem.escudo != null) {
    bonus_ca.Adiciona(
        'escudo', 'escudo', tabelas_escudos[gPersonagem.escudo.entrada.chave].bonus);
    bonus_ca.Adiciona(
        'escudo_melhoria', 'escudo', gPersonagem.escudo.entrada.bonus);
  }
  bonus_ca.Adiciona(
      'atributo', 'destreza', gPersonagem.atributos.destreza.modificador);
  if (PersonagemNivelClasse('monge') > 0) {
    bonus_ca.Adiciona(
        'atributo', 'sabedoria', gPersonagem.atributos.sabedoria.modificador);
  }

  bonus_ca.Adiciona(
      'tamanho', 'tamanho', gPersonagem.tamanho.modificador_ataque_defesa);
  // Pode adicionar as armaduras naturais aqui que elas nao se acumulam.
  bonus_ca.Adiciona(
      'armadura_natural', 'racial', tabelas_raca[gPersonagem.raca].armadura_natural || 0);
  var template_personagem = PersonagemTemplate();
  if (template_personagem != null) {
    if ('bonus_ca' in template_personagem) {
      for (var chave in template_personagem.bonus_ca) {
        bonus_ca.Adiciona(chave, 'template', template_personagem.bonus_ca[chave]);
      }
    }
    bonus_ca.Adiciona(
        'armadura_natural', 'template', template_personagem.armadura_natural || 0);
  }
}

function _DependenciasArmas() {
  for (var i = 0; i < gPersonagem.armas.length; ++i) {
    _DependenciasArma(gPersonagem.armas[i]);
  }
}

// TODO testar essa funcao.
function _DependenciasArma(arma_personagem) {
  var arma_entrada = arma_personagem.entrada;
  var arma_tabela =
      arma_personagem.arma_tabela = tabelas_armas[arma_entrada.chave];
  arma_personagem.nome_gerado = arma_tabela.nome;
  arma_personagem.texto_nome = Traduz(arma_tabela.nome);
  arma_personagem.critico = arma_tabela.critico;
  if (arma_entrada.material && arma_entrada.material != 'nenhum') {
    arma_personagem.nome_gerado +=
        ' (' + tabelas_materiais_especiais[arma_entrada.material].nome + ')';
    arma_personagem.texto_nome +=
        ' (' + Traduz(tabelas_materiais_especiais[arma_entrada.material].nome) + ')';
  }

  if (arma_entrada.bonus > 0) {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = arma_entrada.bonus;
    arma_personagem.nome_gerado += ' +' + arma_personagem.bonus_ataque;
    arma_personagem.texto_nome += ' +' + arma_personagem.bonus_ataque;
  } else if (arma_entrada.obra_prima) {
    arma_personagem.bonus_ataque = 1;
    arma_personagem.bonus_dano = 0;
    arma_personagem.nome_gerado += ' OP';
    arma_personagem.texto_nome += Traduz(' OP');
  } else {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = 0;
  }
  var template_pc = PersonagemTemplate();
  if (template_pc != null && 'bonus_dano' in template_pc) {
    for (var tipo_bonus in template_pc.bonus_dano) {
      arma_personagem.bonus_dano += template_pc.bonus_dano[tipo_bonus];
    }
  }
  if (template_pc != null && 'bonus_ataque' in template_pc) {
    for (var tipo_bonus in template_pc.bonus_dano) {
      arma_personagem.bonus_ataque += template_pc.bonus_ataque[tipo_bonus];
    }
  }

  arma_personagem.proficiente = PersonagemProficienteComArma(arma_entrada.chave);
  if (!arma_personagem.proficiente) {
    if (arma_entrada.chave.indexOf('arco_') != -1 &&
        (PersonagemUsandoItem('bracaduras', 'arqueiro_menor') || PersonagemUsandoItem('bracaduras', 'arqueiro_maior'))) {
      arma_personagem.proficiente = true;
    } else if (arma_entrada.chave == 'espada_bastarda' && PersonagemProficienteTipoArma('comuns')) {
      arma_personagem.proficiente_duas_maos = true;
    }
  }
  arma_personagem.foco = PersonagemFocoComArma(arma_entrada.chave);
  arma_personagem.especializado = PersonagemEspecializacaoComArma(arma_entrada.chave);
  if ('cac_leve' in arma_tabela.categorias ||
      arma_entrada.chave == 'sabre' ||
      arma_entrada.chave == 'chicote' ||
      arma_entrada.chave == 'corrente_com_cravos') {
    arma_personagem.acuidade = PersonagemPossuiTalento('acuidade_arma');
  }
  if (PersonagemPossuiTalento('sucesso_decisivo_aprimorado', Traduz(arma_tabela.nome))) {
    arma_personagem.critico = DobraMargemCritico(arma_personagem.critico);
  }
}

function _DependenciasEstilos() {
  for (var i = 0; i < gPersonagem.estilos_luta.length; ++i) {
    _DependenciasEstilo(gPersonagem.estilos_luta[i]);
  }
}

// TODO merece um teste.
function _DependenciasEstilo(estilo_personagem) {
  var arma_primaria = ArmaPersonagem(estilo_personagem.arma_primaria.nome);
  if (arma_primaria == null) {
    estilo_personagem.arma_primaria.nome = 'desarmado';
    arma_primaria = ArmaPersonagem(estilo_personagem.arma_primaria.nome);
  }
  var arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);
  if (arma_secundaria == null) {
    estilo_personagem.arma_secundaria.nome = 'desarmado';
    arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);
  }

  if (estilo_personagem.nome == 'arma_dupla' &&
      (arma_primaria == null || !arma_primaria.arma_tabela.arma_dupla)) {
    Mensagem(Traduz('Arma') + ' "' + Traduz(estilo_personagem.arma_primaria.nome) + '" ' + Traduz('não é dupla.'));
    estilo_personagem.nome = 'uma_arma';
  }

  if (estilo_personagem.nome == 'rajada' && PersonagemNivelClasse('monge') == 0) {
    Mensagem('Estilo "rajada de golpes" requer nível de monge.');
    estilo_personagem.nome = 'uma_arma';
  }

  if (estilo_personagem.nome == 'tiro_rapido' &&
      (!PersonagemPossuiTalento('tiro_rapido') || (!('distancia' in arma_primaria.arma_tabela.categorias) && !('arremesso' in arma_primaria.arma_tabela.categorias)))) {
    Mensagem('Estilo "tiro_rapido" requer talento tiro rapido e arma de distância.');
    estilo_personagem.nome = 'uma_arma';
  }

  if ('cac_duas_maos' in arma_primaria.arma_tabela.categorias &&
      estilo_personagem.nome != 'uma_arma') {
    Mensagem(Traduz('Arma') + ' "' + Traduz(estilo_personagem.arma_primaria.nome) + '" ' + Traduz('requer duas mãos.'));
    estilo_personagem.nome = 'uma_arma';
  }

  // Se o estilo eh duplo, forca segunda arma ser igual a primeira.
  if (estilo_personagem.nome == 'arma_dupla') {
    estilo_personagem.arma_secundaria.nome = estilo_personagem.arma_primaria.nome;
    arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);
  }

  // Atualiza cada categoria da arma no estilo.
  var secundaria_leve = false;
  for (var categoria in arma_secundaria.arma_tabela.categorias) {
    secundaria_leve =
        (estilo_personagem.nome == 'duas_armas' && categoria.indexOf('leve') != -1) ||
         estilo_personagem.nome == 'arma_dupla';
  }

  for (var categoria in arma_primaria.arma_tabela.categorias) {
    estilo_personagem.arma_primaria.bonus_por_categoria[categoria] =
        _DependenciasBonusPorCategoria(
            categoria, arma_primaria, estilo_personagem, true, secundaria_leve);
  }
  if (estilo_personagem.nome == 'duas_armas' || estilo_personagem.nome == 'arma_dupla') {
    for (var categoria in arma_secundaria.arma_tabela.categorias) {
        estilo_personagem.arma_secundaria.bonus_por_categoria[categoria] =
            _DependenciasBonusPorCategoria(
                categoria, arma_secundaria, estilo_personagem, false, secundaria_leve);
    }
  }
}

// Calcula as dependencias dos bonus de ataque e dano para a categoria passada.
// @param categoria o nome da categoria da arma.
// @param arma_personagem a arma do gPersonagem.
// @param primaria se true, indica se a arma eh primaria.
function _DependenciasBonusPorCategoria(
    categoria, arma_personagem, estilo, primaria, secundaria_leve) {
  // TODO arrumar a arma leve na tabela. Aqui eh um hack.
  var arma_leve = false;
  for (var categoria in arma_personagem.arma_tabela.categorias) {
    if (categoria.indexOf('leve') != -1) {
      arma_leve = true;
      break;
    }
  }
  var bonus_por_categoria = { ataque: [0], dano: 0 };
  var multiplicador_dano_forca = 0;
  var nivel_monge = PersonagemNivelClasse('monge');
  if (estilo.nome == 'uma_arma') {
    multiplicador_dano_forca = 1.0;
    if (gPersonagem.atributos.forca.modificador > 0 && !arma_leve) {
      // arcos vao entrar aqui mas na hora de computar o dano nao vao levar isso em consideracao.
      multiplicador_dano_forca = 1.5;
    }
  } else if (estilo.nome == 'arma_escudo') {
    multiplicador_dano_forca = 1.0;
  } else if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    if (primaria) {
      bonus_por_categoria.ataque[0] = secundaria_leve ? -4 : -6;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque[0] += 2;
      }
    } else {
      bonus_por_categoria.ataque[0] = secundaria_leve ? -8 : -10;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque[0] += 6;
      }
    }
    multiplicador_dano_forca = primaria ? 1.0 : 0.5;
  } else if (estilo.nome == 'rajada') {
    if (nivel_monge >= 9) {
      bonus_por_categoria.ataque[0] = 0;
    } else if (nivel_monge >= 5) {
      bonus_por_categoria.ataque[0] = -1;
    } else {
      bonus_por_categoria.ataque[0] = -2;
    }
  } else if (estilo.nome == 'tiro_rapido') {
    bonus_por_categoria.ataque[0] = -2;
  }

  if (categoria.indexOf('cac') != -1 || estilo.nome == 'rajada') {
    // Quando tem acuidade, usa destreza.
    if (arma_personagem.acuidade && gPersonagem.bba_cac < gPersonagem.bba_cac_acuidade) {
      bonus_por_categoria.ataque[0] += gPersonagem.bba_cac_acuidade;
    } else {
      bonus_por_categoria.ataque[0] += gPersonagem.bba_cac;
    }
    bonus_por_categoria.ataque[0] += arma_personagem.bonus_ataque;
    bonus_por_categoria.dano +=
        Math.floor(gPersonagem.atributos.forca.modificador * multiplicador_dano_forca) +
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('arremesso') != -1) {
    bonus_por_categoria.ataque[0] +=
        gPersonagem.bba_distancia + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano +=
        Math.floor(gPersonagem.atributos.forca.modificador * multiplicador_dano_forca) +
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('distancia') != -1) {
    bonus_por_categoria.ataque[0] +=
        gPersonagem.bba_distancia + arma_personagem.bonus_ataque;
    if (arma_personagem.entrada.chave.indexOf('besta_') != -1 && estilo.nome == 'arma_escudo') {
      // Vale para bestas de repeticao tb. Vou considerar que o ataque de uma arma usa duas maos. Entao
      // a penalidade aqui so eh aplicada sobre arma e escudo.
      if (arma_personagem.entrada.chave.indexOf('leve') != -1) {
        bonus_por_categoria.ataque[0] -= 2;
      } else if (arma_personagem.entrada.chave.indexOf('pesada') != -1) {
        bonus_por_categoria.ataque[0] -= 4;
      }
    }
    bonus_por_categoria.dano += arma_personagem.bonus_dano;
    var bonus_forca = gPersonagem.atributos.forca.modificador;
    if (bonus_forca < 0) {
      if (arma_personagem.entrada.chave.indexOf('arco_') != -1 || arma_personagem.entrada.chave.indexOf('funda') != -1) {
        bonus_por_categoria.dano += bonus_forca;
      } 
    } else {
      var indice_composto = arma_personagem.entrada.chave.indexOf('composto_');
      if (indice_composto != -1) {
        var bonus_arco = parseInt(arma_personagem.entrada.chave.slice(indice_composto + 9)) || 0;
        if (gPersonagem.atributos.forca.modificador >= bonus_arco) {
          bonus_por_categoria.dano += bonus_arco;
        } else {
          // Nao consegue usar direito.
          bonus_por_categoria.ataque[0] -= 2;
        }
      }
    }
  }

  // Proficiencia e foco.
  var proficiente = arma_personagem.proficiente || (estilo.nome == 'uma_arma' && arma_personagem.proficiente_duas_maos);
  if (!proficiente) {
    bonus_por_categoria.ataque[0] -= 4;
  } else if (arma_personagem.foco) {
    bonus_por_categoria.ataque[0] += arma_personagem.foco;
  }
  // Especialização.
  if (arma_personagem.especializado) {
    bonus_por_categoria.dano += arma_personagem.especializado;
  }
  // Alguns itens magicos especificos.
  if (arma_personagem.entrada.chave.indexOf('arco') != -1) {
    // Tem que pegar direto das proficiencias aqui, porque a arma ja foi marcada como proficiente nas DependenciasProficienciasArmas.
    var proficiente = PersonagemProficienteComArma(arma_personagem.entrada.chave);
    if (proficiente) {
      // TODO os bonus sao de competencia.
      if (PersonagemUsandoItem('bracaduras', 'arqueiro_menor')) {
        bonus_por_categoria.ataque[0] += 1;
      } else if (PersonagemUsandoItem('bracaduras', 'arqueiro_maior')) {
        bonus_por_categoria.ataque[0] += 2;
        bonus_por_categoria.dano += 1;
      }
    }
  }

  // Bonus raciais.
  var bonus_racial = tabelas_raca[gPersonagem.raca].bonus_ataque;
  if (bonus_racial) {
    if (bonus_racial.armas[arma_personagem.entrada.chave]) {
      bonus_por_categoria.ataque[0] += bonus_racial.armas[arma_personagem.entrada.chave];
    } else if (bonus_racial.categorias[categoria]) {
      bonus_por_categoria.ataque[0] += bonus_racial.categorias[categoria];
    }
  }

  // Ataques adicionais.
  if (estilo.nome == 'rajada' && nivel_monge > 0) {
    bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0]);
    if (nivel_monge >= 11) {
      bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0]);
    }
  } else if (estilo.nome == 'tiro_rapido') {
    bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0]);
  }
  // Por nivel.
  if (primaria) {
    var num_ataques = gPersonagem.numero_ataques - 1;
    var modificador = -5;
    while (num_ataques > 0) {
      bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0] + modificador);
      --num_ataques;
      modificador -= 5;
    }
  } else if (PersonagemPossuiTalento('combater_duas_armas_aprimorado')) {
    bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0] - 5);
  }
  return bonus_por_categoria;
}

function _DependenciasSalvacoes() {
  var habilidades_salvacoes = {
    fortitude: 'constituicao',
    reflexo: 'destreza',
    vontade: 'sabedoria'
  };
  var bonus_carisma = gPersonagem.atributos['carisma'].modificador;
  if (bonus_carisma < 0) {
    bonus_carisma = 0;
  }
  for (var tipo_salvacao in habilidades_salvacoes) {
    var valor_base = 0;
    for (var i = 0; i < gPersonagem.classes.length; ++i) {
      var classe = gPersonagem.classes[i].classe;
      valor_base +=
          tabelas_salvacao[classe][tipo_salvacao](gPersonagem.classes[i].nivel);
    }
    gPersonagem.salvacoes[tipo_salvacao].Adiciona('base', '-', valor_base);
    gPersonagem.salvacoes[tipo_salvacao].Adiciona('niveis_negativos', '-', -gPersonagem.niveis_negativos);
    var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
    gPersonagem.salvacoes[tipo_salvacao].Adiciona(
        'atributo', habilidade_modificadora, gPersonagem.atributos[habilidade_modificadora].modificador);
    // modificador racial.
    var salvacoes_raca = tabelas_raca[gPersonagem.raca].salvacoes;
    if (salvacoes_raca && salvacoes_raca[tipo_salvacao]) {
      gPersonagem.salvacoes[tipo_salvacao].Adiciona('racial', null, salvacoes_raca[tipo_salvacao]);
    }
    if ('graca_divina' in gPersonagem.especiais) {
      gPersonagem.salvacoes[tipo_salvacao].Adiciona('atributo', 'carisma', bonus_carisma);
    }
  }
  var template_pc = PersonagemTemplate();
  if (template_pc != null && 'bonus_salvacoes' in template_pc) {
    for (var tipo_salvacao in template_pc.bonus_salvacoes) {
      for (var tipo_bonus in template_pc.bonus_salvacoes[tipo_salvacao]) {
        gPersonagem.salvacoes[tipo_salvacao].Adiciona(tipo_bonus, '-', template_pc.bonus_salvacoes[tipo_salvacao][tipo_bonus]);
      }
    }
  }

  var outras_salvacoes_raca = tabelas_raca[gPersonagem.raca].outras_salvacoes;
  for (var tipo_salvacao in outras_salvacoes_raca) {
    for (var i = 0; i < outras_salvacoes_raca[tipo_salvacao].base.length; ++i) {
      var salvacao_base = outras_salvacoes_raca[tipo_salvacao].base[i];
      var nome_salvacao = tipo_salvacao + ' (' + salvacao_base + ')';
      gPersonagem.salvacoes[nome_salvacao] = gPersonagem.salvacoes[salvacao_base].Clona();
      // Entra como racial, em adição ao que já possui.
      gPersonagem.salvacoes[nome_salvacao].Adiciona(
          'racial', null,
          gPersonagem.salvacoes[nome_salvacao].Le('racial', null) + outras_salvacoes_raca[tipo_salvacao].bonus);
    }
  }
}

function _DependenciasFeiticos() {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var chave_classe = gPersonagem.classes[i].classe;
    var tabela_feiticos_classe = tabelas_feiticos[chave_classe];
    if (tabela_feiticos_classe == null) {
      continue;
    }
    _DependenciasEscolasProibidas(chave_classe);
    _DependenciasNumeroFeiticosParaClasse(gPersonagem.classes[i]);
  }
}

function _DependenciasEscolasProibidas(chave_classe) {
  var tabela_feitico_classe = tabelas_feiticos[chave_classe];
  var feiticos_classe = gPersonagem.feiticos[chave_classe];
  if (gPersonagem.feiticos[chave_classe].escolas_proibidas == null) {
    gPersonagem.feiticos[chave_classe].escolas_proibidas = [];
  }
  gPersonagem.feiticos[chave_classe].escolas_proibidas.length = tabela_feitico_classe.num_escolas_proibidas || 0;
  for (var i = 0; i < tabela_feitico_classe.num_escolas_proibidas; ++i) {
    if (gPersonagem.feiticos[chave_classe].escolas_proibidas[i] == null) {
      gPersonagem.feiticos[chave_classe].escolas_proibidas[i] = '';
    }
  }
}

// Limita o numero de feiticos para a classe.
function _DependenciasNumeroFeiticosParaClasse(classe_personagem) {
  var chave_classe = classe_personagem.classe;
  var tabela_feiticos_classe = tabelas_feiticos[chave_classe];
  if (tabela_feiticos_classe == null) {
    return;
  }
  // Possivel para paladinos e rangers.
  if (classe_personagem.nivel_conjurador == 0) {
    return;
  }
  var atributo_chave = tabela_feiticos_classe.atributo_chave;
  var valor_atributo_chave = gPersonagem.atributos[atributo_chave].bonus.Total();
  var feiticos_por_nivel = tabela_feiticos_classe.por_nivel[classe_personagem.linha_tabela_feiticos];
  var nivel_inicial = tabela_feiticos_classe.possui_nivel_zero ? 0 : 1;
  gPersonagem.feiticos[chave_classe].em_uso = true;
  // Feiticos conhecidos (se houver para a classe). Se nao houver, vai usar o que vier da entrada.
  // Por exemplo, magos nao tem limite de conhecidos.
  for (var indice = 0;
       feiticos_por_nivel.conhecidos != null && indice < feiticos_por_nivel.conhecidos.length;
       ++indice) {
    var conhecidos_nivel = parseInt(feiticos_por_nivel.conhecidos.charAt(indice)) || 0;
    _DependenciasNumeroFeiticosConhecidosParaClassePorNivel(
        chave_classe, nivel_inicial + indice, conhecidos_nivel, feiticos_por_nivel);
  }
  // Slots de feiticos.
  var array_bonus_feiticos_atributo = feiticos_atributo(valor_atributo_chave);
  var bonus_atributo_chave = gPersonagem.atributos[atributo_chave].modificador;
  var possui_dominio =  tabela_feiticos_classe.possui_dominio;
  var escola_especializada = tabela_feiticos_classe.escola_especializada;
  for (var indice = 0; indice < feiticos_por_nivel.por_dia.length; ++indice) {
    var num_slots_nivel = parseInt(feiticos_por_nivel.por_dia.charAt(indice)) || 0;
    _DependenciasNumeroSlotsParaClassePorNivel(
        chave_classe, nivel_inicial + indice, num_slots_nivel, feiticos_por_nivel,
        array_bonus_feiticos_atributo, bonus_atributo_chave, possui_dominio, escola_especializada);
  }
  gPersonagem.feiticos[chave_classe].nivel_maximo = nivel_inicial + feiticos_por_nivel.por_dia.length - 1;
}

// Computa as dependencias do numero de feiticos conhecidos para uma classe e um determinado nivel.
function _DependenciasNumeroFeiticosConhecidosParaClassePorNivel(
    chave_classe, nivel, conhecidos_nivel, feiticos_por_nivel) {
  var personagem_conhecidos_nivel = gPersonagem.feiticos[chave_classe].conhecidos[nivel];
  // Ajusta feiticos conhecidos.
  personagem_conhecidos_nivel.length = conhecidos_nivel;
  // Cria um feitico vazio se nao houver.
  for (var i = 0; i < personagem_conhecidos_nivel.length; ++i) {
    if (personagem_conhecidos_nivel[i] == null) {
      personagem_conhecidos_nivel[i] = '';
    }
  }
}

// Calcula as dependencias do numero de slots para uma classe por nivel.
function _DependenciasNumeroSlotsParaClassePorNivel(
    chave_classe, nivel, num_slots_nivel, feiticos_por_nivel,
    array_bonus_feiticos_atributo, bonus_atributo_chave, possui_dominio, escola_especializada) {
  // Slots de feiticos.
  var personagem_slots_nivel = gPersonagem.feiticos[chave_classe].slots[nivel];
  personagem_slots_nivel.base = num_slots_nivel;
  personagem_slots_nivel.bonus_atributo = array_bonus_feiticos_atributo[nivel];
  personagem_slots_nivel.cd = 10 + nivel + bonus_atributo_chave;

  var slots_por_dia = personagem_slots_nivel.base + personagem_slots_nivel.bonus_atributo;
  personagem_slots_nivel.feiticos.length = slots_por_dia;
  // cria um slot vazio se nao houver.
  for (var i = 0; i < slots_por_dia; ++i) {
    if (personagem_slots_nivel.feiticos[i] == null) {
      personagem_slots_nivel.feiticos[i] = { nome: '', gasto: false };
    }
  }
  // Dominio, apenas para niveis acima do zero.
  if (possui_dominio && nivel > 0 && personagem_slots_nivel.feitico_dominio == null) {
    personagem_slots_nivel.feitico_dominio = { nome: '', gasto: false };
  }
  // Especializacao em escolas.
  if (escola_especializada != null && personagem_slots_nivel.feitico_especializado == null) {
    personagem_slots_nivel.feitico_especializado = { nome: '', gasto: false };
  }
}
// Funcoes relacionadas ao estado do Desfazer e Refazer.

function Estado() {
  this.estado_corrente = null;
  this.estado_anterior = null;
};

// Salva o estado e passa o corrente para o anterior.
Estado.prototype.Salva = function(estado) {
  this.estado_anterior = this.estado_corrente;
  this.estado_corrente = estado;
}

// Retorna o estado anterior ao corrente.
Estado.prototype.Restaura = function() {
  return this.estado_anterior;
}

var gEstado = new Estado();
// Tudo relacionado a gEntradas. Isso eh o que devera ser
// serializado e deserializado. A entrada serve como o mínimo que representa o personagem.
// É possível salvar apenas as gEntradas e restaurar o personagem depois chamando a função
// AtualizaGeralSemLerEntradas.

// Variavel contendo os valores das gEntradas. Iniciado com valores padroes da criacao.
var gEntradas = {
  modo_mestre: '',
  modo_visao: 'completo',
  // geral
  nome: '',
  raca: 'humano',
  template: '',
  tamanho: 'medio',  // É possivel ter tamanhos fora do padrao através de magias.
  alinhamento: 'LB',
  divindade: '',
  // Cada entrada possui classe e nivel.
  classes: [ { classe: 'guerreiro', nivel: 1 } ],
  dominios: [],
  // Familiar nao tem base de PV porque depende do PV do personagem.
  familiar: { em_uso: false, chave: '', temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 },
  canimal: { raca: '', base: 0, temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0, notas: '' },
  niveis_negativos: 0,
  // pontos de vida.
  pontos_vida: 0,
  pontos_vida_temporarios: 0,
  ferimentos: 0,  // Valor deve ser >=  0.
  ferimentos_nao_letais: 0,  // Valor deve ser >= 0.
  // experiencia.
  experiencia: 0,
  // atributos.
  bonus_atributos: [],
  forca: 10,
  destreza: 10,
  constituicao: 10,
  inteligencia: 10,
  sabedoria: 10,
  carisma: 10,
  // Cada entrada: { nome, arma_primaria, arma_secundaria}.
  estilos_luta: [],
  // Cada entrada: chave: [ true/false, ... ]
  habilidades_especiais: {},
  // moedas
  platina: 0,
  ouro: 0,
  prata: 0,
  cobre: 0,
  // equipamentos.
  // armas: [ { chave: 'desarmado', nome_gerado: 'desarmado', material: 'nenhum', obra_prima: false, bonus: 0} ],
  armas: [],
  // Cada entrada eh do tipo: { em_uso, chave, material, obra_prima, bonus }
  armaduras: [],
  // Cada entrada { em_uso, chave, material, obra_prima, bonus },
  escudos: [],
  elmo: '',
  // cada entrada: { chave, em_uso }
  aneis: [],
  amuletos: [],
  braceletes: [],
  pocoes: [],
  capas: [],
  outros_equipamentos: '',
  // talentos. Cada chave possui { chave, complemento }, se houver.
  talentos: { gerais: [], guerreiro: [], mago: [], monge: [], ranger: [], outros: [] },

  // pericias: cada entrada possui { chave, pontos, complemento }
  pericias: [],

  // Para magos especialistas. Cada entrada:
  // chave_classe: [],
  escolas_proibidas: {},
  // Feitiços conhecidos, cada entrada:
  // chave_classe: { 0: [ feitico, ... ], 1: [] ...}
  feiticos_conhecidos: {},
  // Slots de feitiços, cada entrada:
  // chave_classe: { 0: [ { nivel, indice, gasto }, ... ], 1: [] ...}
  // Nivel é o nível do feitiço, que pode ser diferente do nível do slot.
  // indice eh o ponteiro para o feitico nos conhecidos para o nível.
  // gasto indica se o feitico está gasto ou não.
  slots_feiticos: {},

  notas: '',
};

function EntradasRenovaSlotsFeiticos() {
  for (var chave in gEntradas.slots_feiticos) {
    for (var nivel in gEntradas.slots_feiticos[chave]) {
      for (var indice = 0; indice <  gEntradas.slots_feiticos[chave][nivel].length; ++indice) {
        gEntradas.slots_feiticos[chave][nivel][indice].gasto = false;
      }
    }
  }
}

// Le todos os inputs da planilha e armazena em 'gEntradas'.
function LeEntradas() {
  // Modo mestre ligado ou nao.
  gEntradas.modo_mestre = Dom('input-modo-mestre').checked;

  // nome
  gEntradas.nome = Dom('nome').value;
  // raca
  gEntradas.raca = ValorSelecionado(Dom('raca'));
  // template
  gEntradas.template = ValorSelecionado(Dom('template'));
  // tamanho
  gEntradas.tamanho = ValorSelecionado(Dom('tamanho')) || tabelas_raca[gEntradas.raca].tamanho;
  // alinhamento
  gEntradas.alinhamento = ValorSelecionado(Dom('alinhamento'));
  // divindade
  gEntradas.divindade = Dom('divindade-patrona').value;
  // classes.
  gEntradas.classes.length = 0;
  var div_classes = Dom('classes');
  for (var i = 0; i < div_classes.childNodes.length; ++i) {
    var elemento = div_classes.childNodes[i];
    if (elemento.tagName == "DIV") {
      var select = elemento.getElementsByTagName("SELECT")[0];
      var input = elemento.getElementsByTagName("INPUT")[0];
      gEntradas.classes.push({
        classe: ValorSelecionado(select),
        nivel: parseInt(input.value)});
    }
  }
  // Dominios de clerigo.
  _LeDominios();
  // Familiares.
  _LeFamiliar();
  _LeCompanheiroAnimal();
  gEntradas.niveis_negativos = parseInt(Dom('niveis-negativos').value) || 0;
  // pontos de vida e ferimentos.
  gEntradas.pontos_vida = parseInt(Dom('pontos-vida-dados').value) || 0;
  gEntradas.pontos_vida_temporarios = parseInt(Dom('pontos-vida-temporarios').value) || 0;
  gEntradas.ferimentos = Math.abs(parseInt(Dom('ferimentos').textContent)) || 0;
  gEntradas.ferimentos_nao_letais = Math.abs(parseInt(Dom('ferimentos-nao-letais').textContent)) || 0;
  // Experiencia.
  gEntradas.experiencia = parseInt(Dom('pontos-experiencia').value) || 0;
  // atributos
  var span_bonus_atributos = Dom('pontos-atributos-gastos');
  if (span_bonus_atributos.textContent.length > 0) {
    var array_bonus = span_bonus_atributos.textContent.split(',');
    for (var i = 0; i < array_bonus.length; ++i) {
      // Trim direita.
      var nome_atributo = AjustaString(array_bonus[i]);
      array_bonus[i] = tabelas_atributos_invertidos[nome_atributo];
    }
    gEntradas.bonus_atributos = array_bonus;
  } else {
    gEntradas.bonus_atributos = [];
  }
  var atributos = [
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    gEntradas[atributos[i]] =
        parseInt(Dom(atributos[i] + '-valor-base').value);
  }

  // Estilos de luta.
  gEntradas.estilos_luta = [];
  var div_estilos_luta = Dom('div-estilos-luta');
  for (var i = 0; i < div_estilos_luta.childNodes.length; ++i) {
    gEntradas.estilos_luta.push(
        _LeEntradaEstiloLuta(div_estilos_luta.childNodes[i]));
  }

  _LeHabilidadesEspeciais();

  _LeEquipamentos();

  _LeTalentos();

  // Pericias.
  _LePericias();

  // Feiticos.
  _LeFeiticos();

  gEntradas.notas = Dom('text-area-notas').value;
}

function _LePericias() {
  for (var i = 0; i < gEntradas.pericias.length; ++i) {
    var entrada_pericia = gEntradas.pericias[i];
    var input_pontos = Dom('pericia-' + entrada_pericia.chave + '-pontos');
    entrada_pericia.pontos = parseInt(input_pontos.value) || 0;
    var input_complemento = Dom('pericia-' + entrada_pericia.chave + '-complemento');
    entrada_pericia.complemento = (input_complemento == null) ? '' : input_complemento.value;
  }
}

function _LeTalentos() {
  for (var chave_classe in gEntradas.talentos) {
    gEntradas.talentos[chave_classe].length = 0;
    var div_talentos = Dom('div-talentos-' + chave_classe + '-selects');
    for (var i = 0; i < div_talentos.childNodes.length; ++i) {
      gEntradas.talentos[chave_classe].push(
          _LeTalento(div_talentos.childNodes[i]));
    }
  }
}

function _LeDominios() {
  gEntradas.dominios = [];
  var doms_dominios = [ Dom('dominio-0'), Dom('dominio-1') ];
  for (var dom of doms_dominios) {
    gEntradas.dominios.push(ValorSelecionado(dom));
  }
}

function _LeFamiliar() {
  if (gEntradas.familiar == null) {
    gEntradas.familiar = { em_uso: false, chave: '', temporarios: 0 };
  }
  var dom_em_uso = Dom('familiar-em-uso');
  var dom_familiar = Dom('select-familiar');
  if (dom_familiar.style.display == 'none') {
    return;
  }
  gEntradas.familiar.em_uso = dom_em_uso.checked;
  gEntradas.familiar.chave = ValorSelecionado(dom_familiar);
  // A base nao eh input para familiar, eh dependencia de pontos de vida do personagem.
  gEntradas.familiar.temporarios = parseInt(Dom('pontos-vida-temporarios-familiar').value) || 0;
  gEntradas.familiar.ferimentos = -parseInt(Dom('ferimentos-familiar').textContent) || 0;
  gEntradas.familiar.ferimentos_nao_letais = -parseInt(Dom('ferimentos-nao-letais-familiar').textContent) || 0;
}

function _LeCompanheiroAnimal() {
  if (gEntradas.canimal == null) {
    gEntradas.canimal = { raca: '', temporarios: 0 };
  }
  if (Dom('div-canimal').style.display == 'none') {
    return;
  }
  gEntradas.canimal.raca = Dom('canimal-raca').value;
  gEntradas.canimal.base = parseInt(Dom('pontos-vida-base-canimal').value) || 0;
  gEntradas.canimal.temporarios = parseInt(Dom('pontos-vida-temporarios-canimal').value) || 0;
  gEntradas.canimal.ferimentos = -parseInt(Dom('ferimentos-canimal').textContent) || 0;
  gEntradas.canimal.ferimentos_nao_letais = -parseInt(Dom('ferimentos-nao-letais-canimal').textContent) || 0;
  gEntradas.canimal.notas = Dom('notas-canimal').value;
}

// Le o talento do div e o retorna no formato da entrada.
function _LeTalento(div_talento) {
  var entrada_talento = {
    chave: null,
    complemento: null
  };
  for (var j = 0; j < div_talento.childNodes.length; ++j) {
    var filho = div_talento.childNodes[j];
    if (filho.name == 'chave-talento') {
      entrada_talento.chave = ValorSelecionado(filho);
    } else if (filho.name == 'complemento-talento' && !filho.disabled) {
      entrada_talento.complemento = filho.value;
    }
  }
  return entrada_talento;
}

function _LeEscolasProibidas() {
  gEntradas.escolas_proibidas = {};
  // nomes_feiticos eh um NodeList, portanto não possui forEach.
  var doms_escolas_proibidas = DomsPorClasse('escolas-proibidas');
  for (var i = 0; i < doms_escolas_proibidas.length; ++i) {
    var doms_escola_proibida = doms_escolas_proibidas[i];
    var id = doms_escola_proibida.id.split('-');
    id.shift();  // tira div.
    id.shift();  // tira escolas
    id.shift();  // tira proibidas.
    var chave_classe = id[0];
    if (!(chave_classe in gEntradas.escolas_proibidas)) {
      gEntradas.escolas_proibidas[chave_classe] = [];
    }
    gEntradas.escolas_proibidas[chave_classe].push(doms_escolas_proibidas[i].value);
  }
}

function _LeFeiticosConhecidos() {
  gEntradas.feiticos_conhecidos = {};
  // nomes_feiticos eh um NodeList, portanto não possui forEach.
  var doms_feiticos = DomsPorClasse('feiticos-conhecidos');
  for (var indice = 0; indice < doms_feiticos.length; ++indice) {
    var dom_feitico = doms_feiticos[indice];
    // remove o prefixo input-feiticos-conhecidos
    var classe_nivel_indice = dom_feitico.id.split('-');
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    var chave_classe = classe_nivel_indice[0];
    var nivel = classe_nivel_indice[1];
    var feitico = dom_feitico.value;
    if (gEntradas.feiticos_conhecidos[chave_classe] == null) {
      gEntradas.feiticos_conhecidos[chave_classe] = {};
    }
    if (gEntradas.feiticos_conhecidos[chave_classe][nivel] == null) {
      gEntradas.feiticos_conhecidos[chave_classe][nivel] = [];
    }
    gEntradas.feiticos_conhecidos[chave_classe][nivel].push(feitico);
  }
}

// Dado um id no formato p-p-p-p-classe-nivel-indice, retorna [classe, nivel, indice].
function _LeClasseNivelIndice(id) {
  var classe_nivel_indice = id.split('-');
  var num_shifts = classe_nivel_indice.length - 3;
  for (var i = 0; i < num_shifts; ++i) {
    classe_nivel_indice.shift();
  }
  return classe_nivel_indice;
}

// Le um slot gasto, criando os valores intermediarios se eles nao existirem.
function _PreencheSlotGasto(chave_classe, nivel_slot, indice_slot, gasto) {
  if (indice_slot == 'dom') {
    if (gEntradas.slots_feiticos_dominio[chave_classe] == null) {
      gEntradas.slots_feiticos_dominio[chave_classe] = {};
    }
    gEntradas.slots_feiticos_dominio[chave_classe][nivel_slot] = { gasto: gasto };
  } else if (indice_slot == 'esp') {
    if (gEntradas.slots_feiticos_especializados[chave_classe] == null) {
      gEntradas.slots_feiticos_especializados[chave_classe] = {};
    }
    gEntradas.slots_feiticos_especializados[chave_classe][nivel_slot] = { gasto: gasto };
  } else {
    if (gEntradas.slots_feiticos[chave_classe] == null) {
      gEntradas.slots_feiticos[chave_classe] = {};
    }
    if (gEntradas.slots_feiticos[chave_classe][nivel_slot] == null) {
      gEntradas.slots_feiticos[chave_classe][nivel_slot] = [];
    }
    gEntradas.slots_feiticos[chave_classe][nivel_slot].push({ gasto: gasto });
  }
}

function _LeSlotsFeiticos() {
  // Comecar pelo gasto que esta sempre presente.
  gEntradas.slots_feiticos = {};
  gEntradas.slots_feiticos_dominio = {};
  gEntradas.slots_feiticos_especializados = {};
  var doms_feiticos_gastos = DomsPorClasse('feiticos-slots-gastos');

  // Este primeiro loop vai criar todas as gEntradas com apenas o atributo gasto preenchido.
  // O proximo loop preencherá o resto.
  for (var i = 0; i < doms_feiticos_gastos.length; ++i) {
    var classe_nivel_indice = _LeClasseNivelIndice(doms_feiticos_gastos[i].id);
    _PreencheSlotGasto(
        classe_nivel_indice[0],
        classe_nivel_indice[1],
        classe_nivel_indice[2],
        doms_feiticos_gastos[i].checked);
  }

  // O restante ja foi preenchido acima. So falta o feitico em si.
  // O indice_conhecido é formado por nivel_indice. O nível é necessário porque é possível
  // selecionar um feitiço de nível inferior ao do slot.
  var doms_select_feitico = DomsPorClasse('feiticos-slots');
  for (var i = 0; i < doms_select_feitico.length; ++i) {
    var classe_nivel_indice = _LeClasseNivelIndice(doms_select_feitico[i].id);
    var chave_classe = classe_nivel_indice[0];
    var nivel_slot = classe_nivel_indice[1];
    var indice_slot = classe_nivel_indice[2];
    var slot = gEntradas.slots_feiticos[chave_classe][nivel_slot][indice_slot];
    var nivel_indice = ValorSelecionado(doms_select_feitico[i]);
    if (nivel_indice != null) {
      nivel_indice = nivel_indice.split('-');
      if (nivel_indice.length == 1) {
        // Compatibilidade... Se só tiver 1, usa de índice do mesmo nível.
        slot.nivel = nivel_slot;
        slot.indice = nivel_indice[0];
      } else {
        slot.nivel = nivel_indice[0];
        slot.indice = nivel_indice[1];
      }
    }
  }

}

function _LeFeiticos() {
  _LeEscolasProibidas();
  _LeFeiticosConhecidos();
  _LeSlotsFeiticos();
}

// Le um div de estilo de luta.
// Como existem spans aninhados, tem que empilhar spans.
// @return o estilo lido.
function _LeEntradaEstiloLuta(div_estilo_luta) {
  var estilo = {};
  var proximos_elementos = [ div_estilo_luta ];
  while (proximos_elementos.length > 0) {
    var elemento_corrente = proximos_elementos.pop();
    for (var i = 0; i < elemento_corrente.childNodes.length; ++i) {
      var filho = elemento_corrente.childNodes[i];
      if (filho.tagName == 'INPUT') {
        if (filho.checked) {
          estilo.nome = filho.value;
        }
      } else if (filho.tagName == 'SELECT') {
        if (filho.id.indexOf('primario') != -1) {
          estilo.arma_primaria = ValorSelecionado(filho);
        } else {
          estilo.arma_secundaria = ValorSelecionado(filho);
        }
      } else if (filho.tagName == 'SPAN') {
        proximos_elementos.push(filho);
      }
    }
  }
  return estilo;
}

function _LeHabilidadesEspeciais() {
 gEntradas.habilidades_especiais = {};
 var filhos = Dom('habilidades-especiais').childNodes;
 for (var i = 0; i < filhos.length; ++i) {
   var filho = filhos.item(i);
   if (filho.tagName != "DIV") {
     continue;
   }
   _LeHabilidadeEspecial(filhos.item(i));
 }
}

// Recebe o div da habilidade especial, que deve ter o id 'habilidade-especial-' + chave_especial.
// Caso possua usos, estarao dentro de checkboxes.
function _LeHabilidadeEspecial(dom_habilidade) {
  var filhos = dom_habilidade.childNodes;
  // Tira prefixo habilidade-especial-.
  var chave_especial = dom_habilidade.id.split('-');
  chave_especial.shift();
  chave_especial.shift();
  chave_especial = chave_especial.shift();
  var usos = [];  // array de boolean representando cada uso.
  for (var i = 0; i < filhos.length; ++i) {
    var filho = filhos.item(i);
    if (filho.tagName != "INPUT") {
      continue;
    }
    usos.push(filho.checked);
  }
  if (usos.length > 0) {
    gEntradas.habilidades_especiais[chave_especial] = usos;
  }
}

function _LeEquipamentos() {
  // Armadura e escudo.
  //gEntradas.armadura.nome =
  //    ValorSelecionado(Dom('armadura'));
  //gEntradas.armadura.bonus_magico =
  //    parseInt(Dom('bonus-armadura').value) || 0;
  //gEntradas.escudo.nome =
  //    ValorSelecionado(Dom('escudo'));
  //gEntradas.escudo.bonus_magico =
  //    parseInt(Dom('bonus-escudo').value) || 0;
  gEntradas.outros_equipamentos = Dom('text-area-outros-equipamentos').value;

  // Moedas
  gEntradas.platina = parseInt(Dom('moedas-platina').value);
  gEntradas.ouro = parseInt(Dom('moedas-ouro').value);
  gEntradas.prata = parseInt(Dom('moedas-prata').value);
  gEntradas.cobre = parseInt(Dom('moedas-cobre').value);

  // Equipamentos.
  // Armas e armaduras: estes divs possuem divs filhos com select, checkbox, input
  _LeArmas();
  _LeArmaduras();
  _LeEscudos();

  for (var tipo_item in tabelas_itens) {
    _LeItens(tipo_item);
  }
}

// Funcoes iguais que chamam apenas LeArmasArmadurasEscudos com parametros corretos.
function _LeArmas() {
  _LeArmasArmadurasEscudos(gEntradas.armas, Dom('div-equipamentos-armas'));
}

function _LeArmaduras() {
  _LeArmasArmadurasEscudos(gEntradas.armaduras, Dom('div-equipamentos-armaduras'));
}

function _LeEscudos() {
  _LeArmasArmadurasEscudos(gEntradas.escudos, Dom('div-equipamentos-escudos'));
}
// Fim funcoes iguais.

// Le armas e armaduras.
// @param array_entrada o array na entrada. Pode ser gEntradas.armas ou armaduras.
// @param div que contem os elementos.
function _LeArmasArmadurasEscudos(array_entrada, div) {
  array_entrada.length = 0;
  for (var i = 0; i < div.childNodes.length; ++i) {
    array_entrada.push(LeEntradaArmaArmadura(div.childNodes[i]));
  }
}

// Le uma arma ou armadura de seu div. Usada tambem no tratamento de compra e venda
// de armas.
// @return o que foi lido.
function LeEntradaArmaArmadura(div) {
  var lido = {};
  for (var i = 0; i < div.childNodes.length; ++i) {
    var filho = div.childNodes[i];
    if (filho.name == null) {
      continue;
    }
    if (filho.name.indexOf('em-uso') != -1) {
      lido.em_uso = filho.checked;
    } else if (filho.name.indexOf('select-principal') != -1) {
      lido.chave = ValorSelecionado(filho);
    } else if (filho.name.indexOf('select-material') != -1) {
      lido.material = ValorSelecionado(filho);
    } else if (filho.name.indexOf('obra-prima') != -1) {
      lido.obra_prima = filho.checked;
    } else if (filho.name.indexOf('bonus-magico') != -1) {
      lido.bonus = parseInt(filho.value) || 0;
    }
  }
  return lido;
}



function _LeItens(tipo_item) {
  gEntradas[tipo_item] = [];
  var dom = DomsPorClasse('div-' + tipo_item);
  for (var i = 0; i < dom.length; ++i) {
    gEntradas[tipo_item].push(LeItem(dom[i]));
  }
}

// Usado tambem na compra e venda de itens.
// @return o item lido do dom.
function LeItem(dom) {
  var item = {
      chave: '',
      em_uso: false,
  };
  for (var i = 0; i < dom.childNodes.length; ++i) {
    var filho = dom.childNodes[i];
    if (filho.name == 'item') {
      item.chave = ValorSelecionado(filho);
    } else if (filho.name == 'em_uso') {
      item.em_uso = filho.checked;
    }
  }
  return item;
}

// Adiciona moedas as gEntradas. Valores podem ser negativos.
// O personagem nunca pode ficar com moedas negativas, neste caso
// a funcao nao fara nada.
// @param moedas um objeto contendo { ouro, platina, prata, cobre}
// @return true se foi possivel adicionar as moedas.
function EntradasAdicionarMoedas(moedas) {
  // verifica fundos.
  for (var tipo_moeda in moedas) {
    if (gEntradas[tipo_moeda] + moedas[tipo_moeda] < 0) {
      return false;
    }
  }

  for (var tipo_moeda in moedas) {
    gEntradas[tipo_moeda] += moedas[tipo_moeda];
  }
  return true;
}

// Adiciona ferimentos as gEntradas.
function EntradasAdicionarFerimentos(valor, nao_letal) {
  var tipo = nao_letal ? "ferimentos_nao_letais" : "ferimentos";
  gEntradas[tipo] += valor;
  if (gEntradas[tipo] < 0) {
    gEntradas[tipo] = 0;
  }
}


function _EntradasAdicionarFerimentosGeral(valor, nao_letal, obj) {
  var tipo = nao_letal ? "ferimentos_nao_letais" : "ferimentos";
  obj[tipo] += valor;
  if (obj[tipo] < 0) {
    obj[tipo] = 0;
  }
}

function EntradasAdicionarFerimentosFamiliar(valor, nao_letal) {
  _EntradasAdicionarFerimentosGeral(valor, nao_letal, gEntradas.familiar);
}

function EntradasAdicionarFerimentosCompanheiroAnimal(valor, nao_letal) {
  _EntradasAdicionarFerimentosGeral(valor, nao_letal, gEntradas.canimal);
}
// Este arquivo deve conter funções para criação de elementos Doms específicos para a planilha.

// Retorna um Div de feitico conhecido.
function CriaDomFeiticoConhecido(chave_classe, nivel, indice) {
  var div_feitico = CriaDiv();
  div_feitico.appendChild(CriaInputTexto(
      '',
      'input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + indice,
      'feiticos-conhecidos',
      AtualizaGeral));
  if (!tabelas_feiticos[chave_classe].precisa_conhecer) {
    div_feitico.appendChild(CriaBotao('-', null, null, {
      chave_classe: chave_classe,
      nivel: nivel,
      indice: indice,
      handleEvent: function () {
        var indice_a_remover = 0;
        gEntradas.feiticos_conhecidos[this.chave_classe][this.nivel].splice(this.indice, 1);
        // Arruma todos os slots de nivel maior ou igual.
        var slots_classe = gEntradas.slots_feiticos[this.chave_classe];
        for (var nivel in slots_classe) {
          if (nivel < this.nivel) {
            continue;
          }
          // Ajusta slots.
          slots_classe[nivel].forEach(function(slot, indice_slot) {
            if (slot.nivel == this.nivel && slot.indice >= this.indice && slot.indice > 0) {
              --slot.indice;
            }
          }.bind(this));
          // Ajusta slot de dominio e especializados (se houver).
          ['slots_feiticos_dominio', 'slots_feiticos_especializados'].forEach(function(tipo_slot) {
            var slot_classe = gEntradas[tipo_slot][this.chave_classe];
            if (slot_classe != null) {
              var slot = slot_classe[this.nivel];
              if (slot != null &&
                  slot.nivel == this.nivel &&
                  slot.indice >= this.indice &&
                  slot.indice > 0) {
                --slot.indice;
              }
            }
          });
          // Ajusta o slot specializado, se houver.
        }
        AtualizaGeralSemLerEntradas();
      }
    }));
  }
  div_feitico.appendChild(CriaBr());
  return div_feitico;
}

// Cria o esqueleto de um nível de slots de feitiço.
function CriaDomSlotsNivel(chave_classe, nivel, slots) {
  var precisa_conhecer = tabelas_feiticos[chave_classe].precisa_conhecer;
  var div_nivel = CriaDiv();
  div_nivel.appendChild(CriaSpan('Nível ' + nivel + ' (CD '));
  div_nivel.appendChild(CriaSpan(slots.cd, 'span-cd-' + chave_classe + '-' + nivel));
  div_nivel.appendChild(CriaSpan('):'));
  div_nivel.appendChild(CriaBr());
  // Este dom so deve ter os doms slots e mais nada.
  div_nivel.appendChild(CriaDiv('div-feiticos-slots-' + chave_classe + '-' + nivel));
  return div_nivel;
}

// Cria um slot de feitico, que pode conter o select ou não.
function CriaDomSlotFeitico(precisa_memorizar, chave_classe, nivel, indice, slots) {
  var classe = 'span-feiticos-slots-' + chave_classe + '-' + nivel;
  var id = classe + '-' + indice;
  var dom_slot = precisa_memorizar ? CriaDiv(id, classe) : CriaSpan('', id, classe);

  // Label para dominio e especialista.
  dom_slot.appendChild(CriaSpan('', 'label-feiticos-slots-' + chave_classe + '-' + nivel + '-' + indice));
  // Adiciona os inputs de indices.
  if (precisa_memorizar) {
    dom_slot.appendChild(CriaSelect(
        'input-feiticos-slots-' + chave_classe + '-' + nivel + '-' + indice,
        'feiticos-slots-' + chave_classe + '-' + nivel + ' feiticos-slots',  // Duas classes.
        AtualizaGeral));
  }

  // Cria o input de gasto.
  dom_slot.appendChild(CriaInputCheckbox(
      false,
      'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + indice,
      'feiticos-slots-gastos',
      ClickGastarFeitico));

  return dom_slot;
}

// Cria o dom para um slot de feitico de dominio.
function CriaDomSlotFeiticoDominio(chave_classe, nivel, conhecidos, slots) {
  var div_slot = CriaDiv();
  div_slot.appendChild(CriaSpan('D:'));
  var select = CriaSelect(
      'input-feiticos-slots-' + chave_classe + '-' + nivel + '-dom',
      'feiticos-slots',
      AtualizaGeral);
  PopulaSelectComOptGroup(conhecidos, select);
  SelecionaValor(//slots.feitico_dominio.indice_conhecido, select);
      slots.feitico_dominio.nivel_conhecido + '-' + slots.feitico_dominio.indice_conhecido,
      select);
  div_slot.appendChild(select);
  div_slot.appendChild(CriaInputCheckbox(
      slots.feitico_dominio.gasto,
      'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-dom',
      'feiticos-slots-gastos',
      ClickGastarFeitico));
  div_slot.appendChild(CriaBr());
  return div_slot;
}

// Cria o dom para um slot de feitico de dominio.
function CriaDomSlotFeiticoEspecializado(chave_classe, nivel, conhecidos, slots) {
  var div_slot = CriaDiv();
  div_slot.appendChild(CriaSpan('E:'));
  var select = CriaSelect(
      'input-feiticos-slots-' + chave_classe + '-' + nivel + '-esp',
      'feiticos-slots',
      AtualizaGeral);
  PopulaSelectComOptGroup(conhecidos, select);
  SelecionaValor(
      slots.feitico_especializado.nivel_conhecido + '-' + slots.feitico_especializado.indice_conhecido,
      select);
  div_slot.appendChild(select);
  div_slot.appendChild(CriaInputCheckbox(
      slots.feitico_especializado.gasto,
      'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-esp',
      'feiticos-slots-gastos',
      ClickGastarFeitico));
  div_slot.appendChild(CriaBr());
  return div_slot;
}
