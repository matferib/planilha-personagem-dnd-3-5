// Funcoes de carregamento chamadas ao se carregar a pagina.

// Chamado pelo carregamento inicial da pagina. Apesar de ser um tratador de eventos,
// preferi manter neste arquivo ja que eh chamada apenas uma vez.
function CarregamentoInicial() {
  _CarregaBotoesVisao();
  _CarregaAtributos();

  // Monta a tabela de armas e cria as opcoes dinamicamente.
  _CarregaTabelaArmas();
  _CarregaPericias();

  var indice_igual = document.URL.indexOf('=');
  if (indice_igual != -1) {
    // carrega pelos parametros. Caso contrario, usara a entrada padrao.
    var json_personagem = decodeURIComponent(document.URL.slice(indice_igual + 1));
    entradas = goog.json.parse(json_personagem);
  }
  AtualizaGeralSemLerEntradas();
}


// Adiciona botoes dinamicamente na planilha.
function _CarregaBotoesVisao() {
  var div_visoes = goog.dom.getElement('div-visoes');
  for (var visao in tabelas_visoes) {
    var botao_visao = CriaBotao(visao, null, null);
    botao_visao.setAttribute('onclick', "ClickVisao('" + visao + "')");
    div_visoes.appendChild(botao_visao);
  }
}


function _CarregaAtributos() {
  var div = goog.dom.getElement('div-stats');

  div.appendChild(CriaSpan('Atributos'));
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
      constituicao: 'Constituicao', 
      inteligencia: 'Inteligencia',
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
    div_atributo.appendChild(CriaSpan(atributos[chave_atributo]));
    var input_atributo = CriaInputTexto('10', chave_atributo + '-valor-base');
    input_atributo.size = 2;
    input_atributo.maxLength = 2;
    input_atributo.setAttribute('onchange', 'AtualizaGeral()');
    div_atributo.appendChild(input_atributo);
    div_atributo.appendChild(CriaSpan('0', chave_atributo + '-mod-racial'));
    div_atributo.appendChild(CriaSpan('0', chave_atributo + '-mod-nivel'));
    div_atributo.appendChild(CriaSpan(' = '));
    div_atributo.appendChild(CriaSpan('0', chave_atributo + '-valor-total'));
    div_atributo.appendChild(CriaSpan(', modificador: '));
    div_atributo.appendChild(CriaSpan('0', null, chave_atributo + '-mod-total'));

    div.appendChild(div_atributo);
  }
}


// Preenche os nomes faltantes na tabela de armas e chama as funcoes
// para preencher os selects de armas corpo a corpo e a distancia.
function _CarregaTabelaArmas() {
  var tabelas_armas_especificas = [ 
      tabelas_armas_simples, tabelas_armas_comuns, tabelas_armas_exoticas ];
  var talento_relacionado = [
      'usar_armas_simples', 'usar_arma_comum', 'usar_arma_exotica' ];
  for (var i = 0; i < tabelas_armas_especificas.length; ++i) {
    var tabela_especifica = tabelas_armas_especificas[i];
    for (var arma in tabela_especifica) {
      // Primeiro, preenche o nome da arma.
      if (tabela_especifica[arma].nome == null) {
        tabela_especifica[arma].nome = arma;
      }
      tabela_especifica[arma].talento_relacionado = talento_relacionado[i];
      // Compoe a tabela principal.
      tabelas_armas[arma] = tabela_especifica[arma];
      // Compoe a tabela invertida.
      tabelas_armas_invertida[tabela_especifica[arma].nome] = arma;
    }
  }
}

// Popula as pericias iniciais.
function _CarregaPericias() {
  var div_pericias = goog.dom.getElement('div-pericias');
  for (var chave_pericia in tabelas_pericias) {
    var pericia = tabelas_pericias[chave_pericia];
    var habilidade = pericia.habilidade;
    var prefixo_id = 'pericia-' + chave_pericia;
    var div = CriaDiv(prefixo_id);
    div.appendChild(CriaSpan(pericia.nome + ' (' + pericia.habilidade + '): '));
    div.appendChild(CriaBotoesMaisMenos(prefixo_id + '-pontos', null, 'ClickPericia', chave_pericia));

    div.appendChild(CriaSpan(' pontos; '));
    div.appendChild(CriaSpan('0', prefixo_id + '-graduacoes'));
    div.appendChild(CriaSpan('+0', null, habilidade + '-mod-total'));
    div.appendChild(CriaSpan('+0', prefixo_id + '-sinergia'));
    div.appendChild(CriaSpan('+0', prefixo_id + '-bonus-talento'));
    div.appendChild(CriaSpan(' = '));
    div.appendChild(CriaSpan('+0', prefixo_id + '-total'));

    // Adiciona ao div.
    div_pericias.appendChild(div);

    // Adiciona as entradas
    entradas.pericias.push({ chave: chave_pericia, pontos: 0 });
    // Adiciona ao personagem.
    personagem.pericias.lista[chave_pericia] = {
        graduacoes: 0, bonus_habilidade: 0, bonus_talentos: {}, bonus_sinergia: 0
    };
  }
}
