// Funcoes de carregamento chamadas ao se carregar a pagina.

// Preenche os nomes faltantes na tabela de armas e chama as funcoes
// para preencher os selects de armas corpo a corpo e a distancia.
function CarregaTabelaArmas() {
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
function CarregaPericias() {
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

    // Adiciona ao personagem.
    personagem.pericias.lista[chave_pericia] = {
        graduacoes: 0, bonus_habilidade: 0, bonus_talentos: {}, bonus_sinergia: 0
    };
  }
}