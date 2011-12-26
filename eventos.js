// Apenas tratamento de eventos.
goog.require('goog.json');

// Chamado pelo carregamento inicial da pagina.
function CarregamentoInicial() {
  // Monta a tabela de armas e cria as opcoes dinamicamente.
  CarregaTabelaArmas();
  CarregaPericias();

  var indice_igual = document.URL.indexOf('=');
  if (indice_igual == -1) {
    // Comeca do zero.
    AdicionaClasse();
    AtualizaGeral();
  }
  else {
    // carrega pelos parametros.
    var json_personagem = decodeURIComponent(document.URL.slice(indice_igual + 1));
    entradas = goog.json.parse(json_personagem);
    ConverteEntradasParaPersonagem();
    EscreveEntradas();
    AtualizaGeralSemLerOuEscrever();
  }
}

// Botao de adicionar classe apertado.
function ClickAdicionarClasse() {
  var classes_desabilitadas = [];
  for (var i = 0; i < personagem.classes.length; ++i) {
    classes_desabilitadas.push(personagem.classes[i].classe);
  }
  AdicionaClasse(classes_desabilitadas);
  AtualizaGeral();
}

// Botao de remover classe apertado.
function ClickRemoveClasse() {
  RemoveClasse();
  AtualizaGeral();
}

// Codifica o objeto personagem como JSON.
function ClickSalvar() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  var indice_interrogacao = document.URL.indexOf('?');
  var url = 
    (indice_interrogacao != -1 ?  document.URL.slice(0, indice_interrogacao) : document.URL) + 
    '?pc=' + encodeURIComponent(goog.json.serialize(entradas));
  goog.dom.getElement("link-personagem").innerHTML = 
    '<a href="' + url + '">Link</a>';
}

// Gera o resumo do personagem para utilizacao em aventuras. 
function ClickGerarResumo() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  // TODO(terminar resumo)
  var resumo = personagem.nome + '; ' + personagem.raca + '; ';
  for (var i = 0; i < personagem.classes.length; ++i) {
    var info_classe = personagem.classes[i];
    resumo += info_classe.classe + ': ' + info_classe.nivel + ', ';
  }
  goog.dom.getElement("resumo-personagem").innerHTML = resumo; 
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
function ClickAdicionarArma(arma) {
  AdicionaArma(arma);
  AtualizaGeral();
}

// Evento para adicionar um novo estilo de luta.
function ClickAdicionarEstiloLuta() {
  AdicionaEstiloLuta('uma_arma');
  AtualizaGeral();
}

// Remove uma arma especifica da lista de equipamentos. 
function ClickRemoverFilho(id_filho, id_pai) {
  RemoveFilho(id_filho, goog.dom.getElement(id_pai));
  AtualizaGeral();
}

// Trata o clique de um estilo de luta.
// @param nome_estilo nome do estilo selecionado.
// @param id_select_secundario id do select secundario do estilo sendo modificado.
function ClickEstilo(nome_estilo, id_select_secundario) {
  var select_secundario = goog.dom.getElement(id_select_secundario);
  if (nome_estilo == 'uma_arma' || nome_estilo == 'arma_escudo' || nome_estilo == 'arma_dupla') {
    select_secundario.disabled = true;
  } else if (nome_estilo == 'duas_armas')  {
    select_secundario.disabled = false;
  } else {
    alert('Nome de estilo invalido: ' + nome_estilo);
  }
  AtualizaGeral();
}

// Trata o clique dos botoes de pericia.
// @param chave_pericia a chave da pericia.
// @param incremento -1 ou 1.
function ClickPericia(chave_pericia, incremento) {
  if (incremento > 0 && personagem.pericias.total_pontos == personagem.pericias.pontos_gastos) {
    alert('Não há pontos de perícia disponíveis');
    return;
  }
  // pega o input do campo
  var input_pericia = goog.dom.getElement('pericia-' + chave_pericia + '-pontos');
  var input_pericia_valor = parseInt(input_pericia.value) || 0;
  if (incremento < 0 && input_pericia_valor == 0) {
    alert('Perícia não possui pontos');
    return;
  }

  input_pericia.value = input_pericia_valor + incremento;
  AtualizaGeral();
}

// Trata o click de um feitico.
// @param classe_nivel_slot a classe, nivel e slot do feitico em questao, separados por -;
// @param incremento do clique.
function ClickFeitico(classe_nivel_slot, incremento) {
/*
  var classe_nivel_slot_array = classe_nivel_slot.split('-');
  if (incremento > 0 && personagem.feiticos.total == personagem.feiticos.gastos) {
    alert('Não há feitiços disponíveis para o nível');
    return;
  }
  // pega o input do campo
  var input = goog.dom.getElement('feiticos-' + chave_pericia + '-pontos');
  var input = parseInt(input_pericia.value) || 0;
  if (incremento < 0 && input_pericia_valor == 0) {
    alert('Feitiço não possui pontos');
    return;
  }

  input.value = input + incremento;
  AtualizaGeral();
  */
}

