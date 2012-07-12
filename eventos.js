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
  AtualizaGeralSemConverterEntradas();
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
  personagem.classes.push({ classe: nova_classe, nivel: 1 });
  AtualizaGeralSemConverterEntradas();
}

// Botao de remover classe apertado.
function ClickRemoveClasse() {
  personagem.classes.pop();
  AtualizaGeralSemConverterEntradas();
}

// Salva entrada do personagem no historico local.
function ClickSalvar() {
  AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  localStorage.setItem('saved_entradas', goog.json.serialize(entradas));
  alert('Personagem salvo com sucesso');
}

// Carrega o personagem do historico local.
function ClickAbrir() {
  entradas = goog.json.parse(localStorage.getItem('saved_entradas'));
  // Esse caso eh valido, porque a gente salva as entradas.
  AtualizaGeralSemLerEntradas();
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
  var arma_entrada = { entrada: { chave: 'adaga', obra_prima: false, bonus: 0 } };
  personagem.armas.push(arma_entrada);
  AtualizaGeralSemConverterEntradas();
}

// Adiciona uma armadura a lista de equipamentos.
function ClickAdicionarArmadura() {
  var armadura_entrada = { entrada: { chave: 'nenhuma', obra_prima: false, bonus: 0 } };
  personagem.armaduras.push(armadura_entrada);
  AtualizaGeralSemConverterEntradas();
}

// Evento para adicionar um novo estilo de luta.
function ClickAdicionarEstiloLuta() {
  var estilo_entrada = { 
    nome: 'uma_arma', 
    arma_primaria: { 
      nome: 'desarmado',
      bonus_por_categoria: {}
    },
    arma_secundaria: {  
      nome: 'desarmado',
      bonus_por_categoria: {}
    }
  };
  personagem.estilos_luta.push(estilo_entrada);
  AtualizaGeralSemConverterEntradas();
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
  personagem.atributos.pontos.gastos.push(chave_atributo);
  AtualizaGeralSemConverterEntradas();
}

// Trata o click de remover bonus de um atributo. 
// Retira o ultimo bonus colocado (se houver).
function ClickBotaoAtributoMenos() {
  personagem.atributos.pontos.gastos.pop();
  AtualizaGeralSemConverterEntradas();
}

// Soma valor aos ferimentos do personagem. Um valor positivo significa dano,
// valor negativo eh cura.
function ClickAjustarFerimentos(valor) {
  PersonagemAdicionarFerimentos(valor);
  AtualizaGeralSemConverterEntradas();
}

// Esconde/mostra os botoes de geracao (class="botao-geracao)".
function ClickVisualizacaoModoMestre() {
  personagem.modo_mestre = Dom('input-modo-mestre').checked;
  AtualizaGeralSemConverterEntradas();
}

// Trata o evento de adicionar aneis. Se a estrutura for alterada aqui,
// mudar tambem a leitura das entradas que depende da ordem dos doms.
function ClickAdicionarItem(tipo_item) {
  personagem[tipo_item].push({ nome: 'nome', caracteristicas: 'caracteristicas'});
  AtualizaGeralSemConverterEntradas();
}

// Trata o click de uso de um item.
// @param tipo_item.
// @param checkbox que causou a mudanca (null em caso de remocao).
function ClickUsarItem(tipo_item, checkbox) {
  if (checkbox.checked) {
    var total_em_uso = 0;
    for (var i = 0; i < personagem.aneis.length && total_em_uso < 2; ++i) {
      if (personagem[tipo_item][i].em_uso) {
        ++total_em_uso;
      }
    }
    // Maior aqui so pra garantir no caso de algum bisiu louco passar de 2.
    if (total_em_uso >= 2) {
      // Desmarca o anel para nao permitir um terceiro.
      alert('São permitidos no máximo 2 anéis');
      checkbox.checked = false;
      return;
    }
  }
  AtualizaGeral();
}

// Trata os botoes de personagem.
// @param modo 'elite' ou 'comum'.
function ClickGerarPersonagem(modo) {
  GeraPersonagem(modo);
}

// Trata o botao de descansar
function ClickDescansar(valor) {
  PersonagemAdicionarFerimentos(valor);
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
  AtualizaGeralSemConverterEntradas();
}

// Encontra a arma ou armadura no dom.
function _AchaArmaArmadura(dom) {
  var lido = LeEntradaArmaArmadura(dom); 
}

// Vende a arma/armadura contida no dom.
// @param dom contendo a arma ou armadura.
// @oaram tipo que esta sendo vendido.
// @param tabela que contem o item sendo vendido.
// TODO unit test.
function ClickVenderArmaArmadura(dom, tipo, tabela) {
  var lido = LeEntradaArmaArmadura(dom);
  var preco = PrecoArmaArmadura(
      tipo, tabela, lido.chave, lido.obra_prima, lido.bonus, false);
  if (preco == null) {
    alert("Arma ou armadura magica invalida");
    return;
  }
  PersonagemAdicionarMoedas(preco);
  AtualizaGeralSemConverterEntradas();
}

// Compra a arma/armadura contida no dom.
// @param dom contendo a arma ou armadura.
// @param tipo do que esta sendo vendido (arma, armadura).
// @param tabela do que esta sendo comprado.
function ClickComprarArmaArmadura(dom, tipo, tabela) {
  var lido = LeEntradaArmaArmadura(dom);
  var preco = PrecoArmaArmadura(
      tipo, tabela, lido.chave, lido.obra_prima, lido.bonus, true);
  if (preco == null) {
    alert("Arma ou armadura magica invalida");
    return;
  }
  if (!PersonagemAdicionarMoedas(preco)) {
    alert('Não há fundos para compra do item');
    return;
  }
  AtualizaGeralSemConverterEntradas();
}

// Compra o item contido no dom.
// @param dom contendo o item. 
// @param tabela do que esta sendo comprado.
function ClickComprarItem(dom, tabela) {
  var lido = LeItem(dom);
  var entrada_tabela = tabela[lido.chave];
  if (entrada_tabela == null || entrada_tabela.preco == null) {
    alert('Item inválido ou sem preço');
    return;
  }
  var preco = LePreco(entrada_tabela.preco, true);
  if (!PersonagemAdicionarMoedas(preco)) {
    alert('Não há fundos para compra do item');
    return;
  }
  AtualizaGeralSemConverterEntradas();
}

// Vende o item contido no dom.
// @param dom contendo o item. 
// @param tabela do que esta sendo comprado.
function ClickVenderItem(dom, tabela) {
  var lido = LeItem(dom);
  var entrada_tabela = tabela[lido.chave];
  if (entrada_tabela == null || entrada_tabela.preco == null) {
    alert('Item inválido ou sem preço');
    return;
  }
  PersonagemAdicionarMoedas(LePreco(entrada_tabela.preco));
  AtualizaGeralSemConverterEntradas();
}
