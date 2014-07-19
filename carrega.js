// Funcoes de carregamento chamadas ao se carregar a pagina.

// Chamado pelo carregamento inicial da pagina. Apesar de ser um tratador de eventos,
// preferi manter neste arquivo ja que eh chamada apenas uma vez.
function CarregamentoInicial() {
  _CarregaHandlers();
  CarregaPersonagens();
  _CarregaRacas();
  _CarregaTemplates();
  _CarregaBotoesVisao();
  _CarregaAtributos();
  _CarregaTalentos();

  // Monta a tabela de armas e cria as opcoes dinamicamente.
  _CarregaTabelaArmasArmaduras();
  _CarregaPericias();
  _CarregaFeiticos();

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
  }
  AtualizaGeralSemLerEntradas();
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
    "botao-link": { callback:  ClickLink, evento: 'click', },
    "botao-gerar-resumo": { callback:  ClickGerarResumo, evento: 'click', },
    "botao-adicionar-arma": { callback:  ClickAdicionarArma, evento: 'click', },
    "botao-adicionar-armadura": { callback:  ClickAdicionarArmadura, evento: 'click', },
    "botao-adicionar-escudo": { callback:  ClickAdicionarEscudo, evento: 'click', },
    "botao-adicionar-anel": { callback:  function() { ClickAdicionarItem('aneis'); }, evento: 'click', },
    "botao-adicionar-amuleto": { callback:  function() { ClickAdicionarItem('amuletos'); }, evento: 'click', },
    "botao-adicionar-bracadura": { callback:  function() { ClickAdicionarItem('bracaduras'); }, evento: 'click', },
    "botao-adicionar-pocao": { callback:  function() { ClickAdicionarItem('pocoes'); }, evento: 'click', },
    "botao-adicionar-capa": { callback:  function() { ClickAdicionarItem('capas'); }, evento: 'click', },
    "json-personagem": { callback: function() { var dom = Dom("json-personagem"); dom.focus(); dom.select(); }, evento: 'click', },
    "botao-ferir-1": { callback: function() { ClickAjustarFerimentos(1); }, evento: 'click', },
    "botao-ferir-3": { callback: function() { ClickAjustarFerimentos(3); }, evento: 'click', },
    "botao-ferir-5": { callback: function() { ClickAjustarFerimentos(5); }, evento: 'click', },
    "botao-curar-1": { callback: function() { ClickAjustarFerimentos(-1); }, evento: 'click', },
    "botao-curar-3": { callback: function() { ClickAjustarFerimentos(-3); }, evento: 'click', },
    "botao-curar-5": { callback: function() { ClickAjustarFerimentos(-5); }, evento: 'click', },
    "botao-descansar": { callback: function() { ClickDescansar(); }, evento: 'click', },
    // Changes.
    "nome": { callback: AtualizaGeral, evento: 'change', },
    "raca": { callback: ChangeRaca, evento: 'change', },
    "template": { callback: ChangeTemplate, evento: 'change', },
    "tamanho": { callback: AtualizaGeral, evento: 'change', },
    "alinhamento": { callback: AtualizaGeral, evento: 'change', },
    "pontos-vida-dados": { callback: AtualizaGeral, evento: 'change', },
    "ferimentos": { callback: AtualizaGeral, evento: 'change', },
    "niveis-negativos": { callback: AtualizaGeral, evento: 'change' },
    "pontos-experiencia": { callback: AtualizaGeral, evento: 'change', },
    "pontos-experiencia-adicionais": { callback: ChangePontosExperienciaAdicionais, evento: 'change', },
    "input-adicionar-ferimentos": { callback:  function() {
        var dom = Dom('input-adicionar-ferimentos');
        ClickAjustarFerimentos(parseInt(dom.value));
        dom.value = ''; }, evento: 'change', },
    "input-remover-ferimentos": { callback:  function() {
        var dom = Dom('input-remover-ferimentos');
        ClickAjustarFerimentos(-parseInt(dom.value));
        dom.value = ''; }, evento: 'change', },
    "moedas-platina": { callback: AtualizaGeral, evento: 'change', },
    "moedas-ouro": { callback: AtualizaGeral, evento: 'change', },
    "moedas-prata": { callback: AtualizaGeral, evento: 'change', },
    "moedas-cobre": { callback: AtualizaGeral, evento: 'change', },
    "moedas-adicionais": { callback: ChangeAdicionarMoedas, evento: 'change', },
    "pontos-experiencia": { callback: AtualizaGeral, evento: 'change', },
    "divindade-patrona": { callback: AtualizaGeral, evento: 'change', },
    "text-area-notas": { callback:  ChangeNotas, evento: 'change', },
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
    select_raca.appendChild(CriaOption(tabelas_raca[chave_raca].nome, chave_raca))
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
    select_template.appendChild(CriaOption(tabelas_template[chave_template].nome, chave_template))
  }
}

// Popula o select de personagens. Chamado no início e ao salvar um personagem novo.
function CarregaPersonagens() {
  var select_personagens = Dom('select-personagens');
  if (select_personagens == null) {
    // Nos testes não existe.
    return;
  }

  ListaDoArmazem(function(lista_nomes) {
    LimpaSelect(select_personagens);
    select_personagens.add(CriaOption('nenhum', '--'));
    for (var i = 0; i < lista_nomes.length; ++i) {
      select_personagens.add(CriaOption(lista_nomes[i], lista_nomes[i]));
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
    var botao_visao = CriaSpan(tabelas_visoes[visao].nome, 'span-' + visao, null);
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
  TituloSimples('Modo Mestre', input_modo_mestre);
  input_modo_mestre.style.paddingBottom = '0';
  //input_modo_mestre.textContent = 'modo-mestre';
  var span_input = CriaSpan();
  span_input.appendChild(input_modo_mestre);
  div_visoes.appendChild(span_input);
  // Aba do Desfazer e Refazer.
  var botao_desfazer = CriaBotao('Desfazer');
  botao_desfazer.style.paddingBottom = '0';
  botao_desfazer.style.marginBottom = '0'
  botao_desfazer.style.marginLeft = '30px';
  botao_desfazer.addEventListener('click', ClickDesfazer);
  div_visoes.appendChild(botao_desfazer);
}

function _CarregaAtributos() {
  var div = Dom('div-stats');
  if (div == null) {
    // testes.
    return;
  }

  div.appendChild(CriaSpan('Atributos', null, 'titulo'));
  div.appendChild(CriaBr());
  div.appendChild(CriaSpan('Total: '));
  div.appendChild(CriaSpan('0', 'pontos-atributos-total'));
  div.appendChild(CriaSpan(', gastos: [ '));
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
    var span_rotulo = CriaSpan(atributos[chave_atributo]);
    span_rotulo.style.display = 'inline-block';
    span_rotulo.style.width = '80px';
    div_atributo.appendChild(span_rotulo);
    var input_atributo = CriaInputTexto('10', chave_atributo + '-valor-base');
    input_atributo.size = 2;
    input_atributo.maxLength = 2;
    input_atributo.addEventListener('change', AtualizaGeral);
    div_atributo.appendChild(input_atributo);
    div_atributo.appendChild(CriaSpan('0', chave_atributo + '-mod-bonus'));
    div_atributo.appendChild(CriaSpan(' = '));
    div_atributo.appendChild(CriaSpan('0', chave_atributo + '-valor-total'));
    div_atributo.appendChild(CriaSpan(', modificador: '));
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
          CriaSpan('Gerais: '));
    } else {
      div_talentos_classe.appendChild(
          CriaSpan('De ' + tabelas_classes[chave_classe].nome + ': '));
    }
    div_talentos_classe.appendChild(CriaSpan(null, 'talentos-' + chave_classe + '-total'));
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
      tabela_invertida[entrada_especifica.nome] = entrada;
    }
  }
}

// Popula as pericias iniciais.
function _CarregaPericias() {
  var div_pericias = Dom('div-pericias');
  if (div_pericias == null) {
    // Testes.
    return;
  }
  for (var chave_pericia in tabelas_pericias) {
    var pericia = tabelas_pericias[chave_pericia];
    var habilidade = pericia.habilidade;
    var prefixo_id = 'pericia-' + chave_pericia;
    var div = CriaDiv(prefixo_id);
    var texto_span = pericia.nome + ' (' + pericia.habilidade + '): ';
    if (tabelas_pericias[chave_pericia].sem_treinamento) {
      texto_span += 'ϛτ';
    }
    div.appendChild(
        CriaSpan(texto_span, null, 'pericias-nome'));

    var input_pontos =
        CriaInputNumerico('0', prefixo_id + '-pontos', null,
        { chave_pericia: chave_pericia,
          handleEvent: function(evento) {
            ClickPericia(this.chave_pericia);
            evento.stopPropagation(); } });
    input_pontos.min = 0;
    input_pontos.maxlength = input_pontos.size = 2;
    div.appendChild(input_pontos);

    div.appendChild(CriaSpan(' pontos; '));
    div.appendChild(CriaSpan('0', prefixo_id + '-graduacoes'));
    div.appendChild(CriaSpan('+0', prefixo_id + '-total-bonus'));
    div.appendChild(CriaSpan(' = '));
    div.appendChild(CriaSpan('+0', prefixo_id + '-total'));

    // Adiciona ao div.
    div_pericias.appendChild(div);

    // Adiciona as gEntradas
    gEntradas.pericias.push({ chave: chave_pericia, pontos: 0 });
    // Adiciona ao personagem.
    gPersonagem.pericias.lista[chave_pericia] = {
        graduacoes: 0, bonus: new Bonus(),
    };
  }
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
}

// Aqui é onde tudo começa.
document.addEventListener('DOMContentLoaded', function() {
  CarregamentoInicial();
});
