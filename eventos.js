// Apenas tratamento de eventos.
goog.require('goog.json');

// Funcao de CarregamentoInicial no arquivo carrega.js.

//Evento para mudar divs visiveis na planilha.

function ClickVisao(modo) { 
  // Loop para esconder tudo.
  for (var j = 0; j < tabelas_visoes[modo].esconder.classes.length; ++j) {
    var divs_esconder = goog.dom.getElementsByClass(tabelas_visoes[modo].esconder.classes[j]);
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
    var divs_mostrar = goog.dom.getElementsByClass(tabelas_visoes[modo].mostrar.classes[j]);
    for (var i = 0; i < divs_mostrar.length; ++i) {
      divs_mostrar[i].style.display = 'block';
    }
  }
  for (var i = 0; i < tabelas_visoes[modo].mostrar.elementos.length; ++i) {
    var divs_combate = Dom(tabelas_visoes[modo].mostrar.elementos[i]);
    divs_combate.style.display = 'block';
  }
  personagem.modo_visao = modo;
  _AtualizaGeral();
}


// Botao de adicionar classe apertado.
function ClickAdicionarClasse() {
  var classes_desabilitadas = [];
  for (var i = 0; i < personagem.classes.length; ++i) {
    classes_desabilitadas.push(personagem.classes[i].classe);
  }
  // Tenta uma entrada nao esteja desabilidada.
  var nova_classe = null;
  for (var classe in tabelas_classes) {
    if (!PersonagemPossuiUmaDasClasses([ classe ])) {
      nova_classe = classe;
      break;
    }
  }
  if (nova_classe == null) {
    alert('Impossível criar nova classe');
    return;
  }
  entradas.classes.push({ classe: nova_classe, nivel: 1 });
  AtualizaGeralSemLerEntradas();
}

// Botao de remover classe apertado.
function ClickRemoveClasse() {
  entradas.classes.pop();
  AtualizaGeralSemLerEntradas();
}

// Salva entrada do personagem no historico local.
function ClickSalvar() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  localStorage.setItem('saved_pc', goog.json.serialize(personagem));
  alert('Personagem salvo com sucesso');
}

// Carrega o personagem do historico local.
function ClickAbrir() {
  personagem = goog.json.parse(localStorage.getItem('saved_pc'));
  AtualizaGeralSemConverterEntradas();
}

// Codifica o objeto personagem como JSON e gera o link.
function ClickLink() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  var indice_interrogacao = document.URL.indexOf('?');
  var url = 
    (indice_interrogacao != -1 ?  document.URL.slice(0, indice_interrogacao) : document.URL) + 
    '?pc=' + encodeURIComponent(goog.json.serialize(personagem));
  Dom("link-personagem").innerHTML = 
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
  Dom("resumo-personagem").innerHTML = resumo; 
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
  entradas.armas.push({ chave: 'adaga', obra_prima: false, bonus: 0 });
  AtualizaGeralSemLerEntradas();
}

// Evento para adicionar um novo estilo de luta.
function ClickAdicionarEstiloLuta() {
  entradas.estilos_luta.push({ nome: 'uma_arma', arma_primaria: 'desarmado'});
  AtualizaGeralSemLerEntradas();
}

// Remove uma arma especifica da lista de equipamentos. 
function ClickRemoverFilho(id_filho, id_pai) {
  RemoveFilho(id_filho, Dom(id_pai));
  AtualizaGeral();
}

// Trata o clique de um estilo de luta.
// @param nome_estilo nome do estilo selecionado.
// @param id_select_secundario id do select secundario do estilo sendo modificado.
function ClickEstilo(nome_estilo, id_select_secundario) {
  var select_secundario = Dom(id_select_secundario);
  if (nome_estilo == 'uma_arma' || nome_estilo == 'arma_escudo' || nome_estilo == 'arma_dupla') {
    select_secundario.disabled = true;
  } else if (nome_estilo == 'duas_armas')  {
    select_secundario.disabled = false;
  } else {
    alert('Nome de estilo invalido: ' + nome_estilo);
  }
  AtualizaGeral();
}

// Trata a alteracao de uma pericia.
// @param chave_pericia a chave da pericia.
function ClickPericia(chave_pericia) {
  // pega o input do campo
  var input_pericia = Dom('pericia-' + chave_pericia + '-pontos');
  var input_pericia_valor = parseInt(input_pericia.value) || 0;
  var valor_corrente = personagem.pericias.lista[chave_pericia].pontos;
  if (input_pericia_valor - valor_corrente > 
      personagem.pericias.total_pontos - personagem.pericias.pontos_gastos) {
    input_pericia.value = valor_corrente;
    alert('Não há pontos de perícia disponíveis');
    return;
  }
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
  var input = Dom('feiticos-' + chave_pericia + '-pontos');
  var input = parseInt(input_pericia.value) || 0;
  if (incremento < 0 && input_pericia_valor == 0) {
    alert('Feitiço não possui pontos');
    return;
  }

  input.value = input + incremento;
  AtualizaGeral();
  */
}

// Trata o click de adicionar bonus a um atributo, colocando-o no final da fila.
function ClickBotaoAtributoMais(chave_atributo) {
  entradas.bonus_atributos.push(chave_atributo);
  AtualizaGeralSemLerEntradas();
}

// Trata o click de remover bonus de um atributo. 
// Retira o ultimo bonus colocado (se houver).
function ClickBotaoAtributoMenos() {
  entradas.bonus_atributos.pop();
  AtualizaGeralSemLerEntradas();
}


// Soma valor aos ferimentos do personagem. Um valor positivo significa dano,
// valor negativo eh cura.
function ClickAjustarFerimentos(valor) {
  personagem.pontos_vida.ferimentos += valor;
  if (personagem.pontos_vida.ferimentos < 0) {
    personagem.pontos_vida.ferimentos = 0;
    return;
  }
  AtualizaGeralSemConverterEntradas();
}

// Esconde/mostra os botoes de geracao (class="botao-geracao)".
// @param mostrar true se for para mostrar botoes de geracao.
function ClickVisualizacaoGeracao(mostrar) {
}
