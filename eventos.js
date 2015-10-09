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
    Mensagem('Personagem "' + nome + '" salvo com sucesso.');
  });
}

// Carrega o personagem do historico local.
function ClickAbrir() {
  var nome = ValorSelecionado(Dom('select-personagens'));
  if (nome == '--') {
    Mensagem('Nome "--" não é válido.');
    return;
  }
  var handler = {
    nome: nome,
    f: function(dado) {
      if (nome in dado) {
        gEntradas = JSON.parse(dado[nome]);
        CorrigePericias();
        AtualizaGeralSemLerEntradas();
        SelecionaValor('--', Dom('select-personagens'));
        Mensagem('Personagem "' + nome + '" carregado com sucesso.');
      } else {
        Mensagem('Não encontrei personagem com nome "' + nome + '"');
      }
      DesabilitaOverlay();
    },
  };
  HabilitaOverlay();
  AbreDoArmazem(nome, handler.f);
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
        Mensagem('Personagem "' + nome + '" excluído com sucesso.');
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
  Mensagem('Personagem "' + gPersonagem.nome + '" exportado com sucesso. ' +
        'Copie para a área de transferência.');
}

// Abre o personagem lendo do campo de texto.
function ClickImportar() {
  var input = Dom("json-personagem");
  gEntradas = JSON.parse(input.value);
  CorrigePericias();
  AtualizaGeralSemLerEntradas();
  Mensagem('Personagem "' + gPersonagem.nome + '" importado com sucesso');
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
  Dom("resumo-personagem").innerHTML = GeraResumo();
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
  if (nome_estilo == 'uma_arma' || nome_estilo == 'arma_escudo' || nome_estilo == 'arma_dupla' || nome_estilo == 'rajada') {
    select_secundario.disabled = true;
  } else if (nome_estilo == 'duas_armas')  {
    select_secundario.disabled = false;
  } else {
    Mensagem('Nome de estilo invalido: ' + nome_estilo);
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
function ClickAjustarFerimentos(valor) {
  EntradasAdicionarFerimentos(valor);
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
// TODO arrumar.
function ClickDescansar(valor) {
  /*
  for (var chave_classe in personagem.feiticos) {
    if (!personagem.feiticos[chave_classe].em_uso) {
      continue;
    }
    var feiticos_classe = personagem.feiticos[chave_classe];
    for (var nivel in feiticos_classe.slots) {
      if (feiticos_classe.slots[nivel].feiticos.length == 0) {
        continue;
      }
      for (var indice = 0; indice < feiticos_classe.slots[nivel].feiticos.length; ++indice) {
        feiticos_classe.slots[nivel].feiticos[indice].gasto = 0;
      }
    }
  }
  */
  EntradasAdicionarFerimentos(-PersonagemNivel());
  AtualizaGeralSemLerEntradas();
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
    Mensagem("Arma ou armadura magica invalida");
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
    Mensagem("Arma ou armadura magica invalida");
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

// Trata o evento de change no campo de notas.
function ChangeNotas() {
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
