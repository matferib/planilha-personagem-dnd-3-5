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
    "botao-adicionar-chapeu": { callback:  function() { ClickAdicionarItem('chapeus'); }, evento: 'click', },
    "botao-adicionar-pocao": { callback:  function() { ClickAdicionarItem('pocoes'); }, evento: 'click', },
    "botao-adicionar-capa": { callback:  function() { ClickAdicionarItem('capas'); }, evento: 'click', },
    "botao-adicionar-luvas": { callback:  function() { ClickAdicionarItem('luvas'); }, evento: 'click', },
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
