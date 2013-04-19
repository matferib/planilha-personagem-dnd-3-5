// Funcoes de carregamento chamadas ao se carregar a pagina.

// Chamado pelo carregamento inicial da pagina. Apesar de ser um tratador de eventos,
// preferi manter neste arquivo ja que eh chamada apenas uma vez.
function CarregamentoInicial() {
  _CarregaRacas();
  _CarregaBotoesVisao();
  _CarregaAtributos();
  _CarregaTalentos();

  // Monta a tabela de armas e cria as opcoes dinamicamente.
  _CarregaTabelaArmasArmaduras();
  _CarregaPericias();
  _CarregaFeiticos();

  // Inicia o objeto de personagem.
  IniciaPersonagem();

  var indice_igual = document.URL.indexOf('=');
  if (indice_igual != -1) {
    // carrega pelos parametros. Caso contrario, usara a entrada padrao.
    json_entradas = decodeURIComponent(document.URL.slice(indice_igual + 1));
    entradas = goog.json.parse(json_entradas);
  } 
  AtualizaGeralSemLerEntradas();
}

// Adiciona racas dinamicamente na planilha
function _CarregaRacas() {
  var select_raca = Dom('raca');
  for (var chave_raca in tabelas_raca) {
    select_raca.appendChild(CriaOption(tabelas_raca[chave_raca].nome, chave_raca))
  }
}  


// Adiciona botoes dinamicamente na planilha.
function _CarregaBotoesVisao() {
  var div_visoes = Dom('div-visoes');
  for (var visao in tabelas_visoes) {
    var botao_visao = CriaSpan(tabelas_visoes[visao].nome, 'span-' + visao, null);
    botao_visao.setAttribute('onclick', "ClickVisao('" + visao + "')");
    div_visoes.appendChild(botao_visao);
  }
  var input_modo_mestre = CriaInputCheckbox(false, 'input-modo-mestre', null);
  input_modo_mestre.setAttribute('onchange', 'ClickVisualizacaoModoMestre()');
  //input_modo_mestre.textContent = 'modo-mestre';
  var span_input = CriaSpan();
  span_input.appendChild(input_modo_mestre);
  div_visoes.appendChild(span_input);
}

function _CarregaAtributos() {
  var div = Dom('div-stats');

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

// Cria os divs com talentos de classe.
function _CarregaTalentos() {
  var div_talentos = Dom('div-talentos');
  for (var chave_classe in personagem.talentos) {
    var div_talentos_classe = CriaDiv('div-talentos-' + chave_classe);
    if (chave_classe == 'gerais') {
      div_talentos_classe.appendChild(
          CriaSpan('Talentos Gerais: '));
    } else {
      div_talentos_classe.appendChild(
          CriaSpan('Talentos de ' + tabelas_classes[chave_classe].nome + ': '));
    }
    div_talentos_classe.appendChild(CriaSpan(null, 'talentos-' + chave_classe + '-total'));
    div_talentos_classe.appendChild(CriaBr());
    div_talentos_classe.appendChild(CriaDiv('div-talentos-' + chave_classe + '-selects'));
    div_talentos.appendChild(div_talentos_classe);
  }
}

// Preenche os nomes faltantes na tabela de armas e chama as funcoes
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
      // Primeiro, preenche o nome da entrada se nao houver.
      if (tabela_especifica[entrada].nome == null) {
        tabela_especifica[entrada].nome = entrada;
      }
      tabela_especifica[entrada].talento_relacionado = talentos_relacionados[i];
      // Compoe a tabela principal.
      tabela_composta[entrada] = tabela_especifica[entrada];
      // Compoe a tabela invertida.
      tabela_invertida[tabela_especifica[entrada].nome] = entrada;
    }
  }
}

// Popula as pericias iniciais.
function _CarregaPericias() {
  var div_pericias = Dom('div-pericias');
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

    // Adiciona as entradas
    entradas.pericias.push({ chave: chave_pericia, pontos: 0 });
    // Adiciona ao personagem.
    personagem.pericias.lista[chave_pericia] = {
        graduacoes: 0, bonus: new Bonus(),
    };
  }
}

// Cria os objetos das classes que possuem feiticos no personagem.
function _CarregaFeiticos() {
  for (var chave_classe in tabelas_feiticos) {
    personagem.feiticos[chave_classe] = {
      atributo_chave: tabelas_feiticos[chave_classe].atributo_chave,
      conhecidos: {},
      slots: {},
    };
    for (var i = 0; i <= 9; ++i) {
      personagem.feiticos[chave_classe].conhecidos[i] = [];
      personagem.feiticos[chave_classe].slots[i] = {
        atributo_chave: tabelas_feiticos[chave_classe].atributo_chave,
        base: 0,
        bonus_atributo: 0,
        feiticos: [],
        feitico_dominio: null,
      };
    }
  }
}
