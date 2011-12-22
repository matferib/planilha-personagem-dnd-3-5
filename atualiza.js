// Todas as funcoes de atualizacao.

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha. Partes que dependem de outras devem vir apos sua dependencia.
function AtualizaGeral() {
  // Apenas le as entradas para a estrutura de entradas.
  LeEntradas(); 
  // converte a estrutura de entradas para a de personagem.
  ConverteEntradasParaPersonagem();
  _AtualizaGeral();
}

// Chamada apenas para a atualizacao inicial apos leitura da URL.
function AtualizaGeralSemLerOuEscrever() {
  _AtualizaGeral();
}

// Apenas atualizacoes, sem leitura ou escrita de entradas.
function _AtualizaGeral() {
  _AtualizaClasses();
  _AtualizaTamanho();
  _AtualizaModificadoresAtributos();
  _AtualizaDadosVida();
  _AtualizaAtaque();
  _AtualizaEstilosLuta();
  _AtualizaDefesa();
  _AtualizaSalvacoes();
  _AtualizaTalentos();
  _AtualizaPericias();
}

// Torna todas as classes exceto a ultima desabilitadas. 
function _AtualizaClasses() {
  var selects_classes = goog.dom.getElementsByClass('selects-classes'); 
  for (var i = 0; i < selects_classes.length - 1; ++i) {
    selects_classes[i].disabled = true;
  }
  selects_classes[selects_classes.length - 1].disabled = false;
}

// Atualiza o tamanho em funcao da raca.
function _AtualizaTamanho() {
  // Busca o modificador de tamanho da raca.
  ImprimeSinalizado(
      personagem.tamanho.modificador_ataque_defesa,
      goog.dom.getElementsByClass('tamanho-mod-ataque-defesa'));
  goog.dom.getElement('tamanho').innerText =
      tabelas_tamanho[personagem.tamanho.categoria].nome;
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car),
// a raca, class etc.
function _AtualizaModificadoresAtributos() {
  // busca a raca e seus modificadores.
  var modificadores_raca = tabelas_raca[personagem.raca].atributos;

  // Busca cada elemento das estatisticas e atualiza modificadores.
  for (var habilidade in personagem.atributos) {
    // modificador racial.
    if (modificadores_raca[habilidade]) {
      var modificador_racial = modificadores_raca[habilidade];
      // Escreve o modificador racial.
      ImprimeSinalizado(
          modificador_racial,
          goog.dom.getElement(habilidade + '-mod-racial'));
    } 
    else {
      ImprimeNaoSinalizado('', goog.dom.getElement(habilidade + '-mod-racial'));
    }

    // Escreve o valor total.
    ImprimeNaoSinalizado(
        personagem.atributos[habilidade].valor, 
        goog.dom.getElement(habilidade + '-valor-total'));

    // Escreve o modificador.
    ImprimeSinalizado(
        personagem.atributos[habilidade].modificador,
        goog.dom.getElementsByClass(habilidade + '-mod-total'));
  }
}

// Atualiza os dados de vida do personagem de acordo com as classes.
function _AtualizaDadosVida() {
  var primeiro = true;  // primeira classe nao eh sinalizada.
  var string_dados_vida = '';
  var dados_vida_total = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
      dados_vida_total += personagem.classes[i].nivel;
      if (primeiro) {
        primeiro = false;
      } else {
        string_dados_vida += ' +';
      }
      string_dados_vida += 
        personagem.classes[i].nivel + 'd' + tabelas_dados_vida[personagem.classes[i].classe];

  }
  if (personagem.atributos.constituicao.modificador > 0 && dados_vida_total > 0) {
    string_dados_vida += 
      ' +' + (personagem.atributos.constituicao.modificador*dados_vida_total);
  }
  var span_dados = goog.dom.getElement('dados-vida-classes');
  span_dados.innerText = dados_vida_total + ' = ' + string_dados_vida;
  // Pontos de vida.
  var pontos_vida_corrente = personagem.pontos_vida.total - personagem.pontos_vida.ferimentos;
  ImprimeNaoSinalizado(pontos_vida_corrente, goog.dom.getElement('pontos-vida-corrente'));
}

// Atualiza os diversos tipos de ataques lendo a classe e os modificadores relevantes. 
function _AtualizaAtaque() {
  ImprimeSinalizado(personagem.bba, goog.dom.getElementsByClass('bba'));
  // Corpo a corpo.
  ImprimeSinalizado(
      personagem.bba_cac,
      goog.dom.getElementsByClass('bba-corpo-a-corpo'));

  // Distancia.
  ImprimeSinalizado(
      personagem.bba_distancia,
      goog.dom.getElementsByClass('bba-distancia'));
}

// Atualiza a lista de armas de cada estilo.
function _AtualizaEstilosLuta() {
  var div_estilos = goog.dom.getElement("div-estilos-luta");
  for (var i = 0; i < div_estilos.childNodes.length; ++i) {
    _AtualizaEstilo(div_estilos.childNodes[i], personagem.estilos_luta[i]);
  }
}

// Usada por _AtualizaEstilosLuta.
// @param div_estilo o div do estilo.
// @param estilo a entrada do estilo no personagem.
function _AtualizaEstilo(div_estilo, estilo) {
  var id_estilo = div_estilo.id; 

  var id_radio = 
    id_estilo.replace('id-estilo', 'id-estilo-' + estilo.nome.replace('_', '-'));
  goog.dom.getElement(id_radio).checked = true;

  var id_span_primario =
      id_estilo.replace('id-estilo', 'id-span-primario-estilo');
  var id_select_primario = 
      id_estilo.replace('id-estilo', 'id-select-primario-estilo');
  var arma_primaria = ArmaPersonagem(estilo.arma_primaria.nome);
  AdicionaArmasAoEstilo(goog.dom.getElement(id_select_primario), 
                        estilo.arma_primaria.nome);
  _AtualizaArmaEstilo(arma_primaria, true, estilo,
                      goog.dom.getElement(id_span_primario));

  var id_span_secundario =
    id_estilo.replace('id-estilo', 'id-span-secundario-estilo');
  if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    var id_select_secundario = 
        id_estilo.replace('id-estilo', 'id-select-secundario-estilo');
    var arma_secundaria = ArmaPersonagem(estilo.arma_secundaria.nome);
    AdicionaArmasAoEstilo(goog.dom.getElement(id_select_secundario), 
                          estilo.arma_secundaria.nome);
    _AtualizaArmaEstilo(arma_secundaria, false, estilo,
                        goog.dom.getElement(id_span_secundario));
  } else {
    goog.dom.getElement(id_span_secundario).innerText = '';
  }
}

// Atualiza o span de uma arma no estilo de luta com seus valores de ataque e defesa
// @param arma do personagem.
// @param primaria booleano indicando se a arma eh primaria ou secundaria.
// @param estilo de luta cuja arma esta sendo atualizada.
// @param span_arma o dom da arma, que eh um span.
function _AtualizaArmaEstilo(arma, primaria, estilo, span_arma) {
  span_arma.innerText = '';
  var arma_estilo = primaria ? estilo.arma_primaria : estilo.arma_secundaria;
  for (var categoria in arma_estilo.bonus_por_categoria) {
    var bonus = arma_estilo.bonus_por_categoria[categoria];
    span_arma.innerText += categoria + ': ' + StringSinalizada(bonus.ataque) + ', ';
    var arma_tabela = arma.arma_tabela;
    if (estilo.nome == 'arma_dupla' && !primaria) {
      span_arma.innerText += arma_tabela.dano_secundario[personagem.tamanho.categoria];
    } else {
      span_arma.innerText += arma_tabela.dano[personagem.tamanho.categoria];
    }
    span_arma.innerText += StringSinalizada(bonus.dano, false) + '; ';
  }
}

// Atualiza os varios tipos de defesa lendo tamanho, armadura e modificadores relevantes.
function _AtualizaDefesa() {
  ImprimeSinalizado(tabelas_armaduras[personagem.armadura.nome].bonus +
                    personagem.armadura.bonus_magico,
                    goog.dom.getElementsByClass('ca-armadura'));
  ImprimeSinalizado(tabelas_escudos[personagem.escudo.nome].bonus + 
                    personagem.escudo.bonus_magico,
                    goog.dom.getElementsByClass('ca-escudo'));

  // AC normal.
  ImprimeNaoSinalizado(
      10 + personagem.atributos.destreza.modificador +
          tabelas_armaduras[personagem.armadura.nome].bonus +
          personagem.armadura.bonus_magico +
          tabelas_escudos[personagem.escudo.nome].bonus +
          personagem.escudo.bonus_magico +
          personagem.tamanho.modificador_ataque_defesa, 
      goog.dom.getElementsByClass('ca-normal'));
  // AC surpreso.
  ImprimeNaoSinalizado(
      10 + personagem.tamanho.modificador_ataque_defesa + 
          tabelas_armaduras[personagem.armadura.nome].bonus +
          tabelas_escudos[personagem.escudo.nome].bonus,
      goog.dom.getElementsByClass('ca-surpreso'));
  // AC toque.
  ImprimeNaoSinalizado(
      10 + personagem.atributos.destreza.modificador + 
          personagem.tamanho.modificador_ataque_defesa, 
      goog.dom.getElementsByClass('ca-toque'));
}

// Atualiza as salvacoes, calculando o bonus base de acordo com a classe e
// modificando pelo atributo relevante.
// TODO fazer outros tipo tb.
function _AtualizaSalvacoes() {
  var div_salvacoes = goog.dom.getElement('div-salvacoes');
  RemoveFilhos(div_salvacoes);
  for (var tipo_salvacao in personagem.salvacoes) {
    var div_salvacao = CriaDiv();
    AdicionaSpanAoDiv(tipo_salvacao + ': ', null, div_salvacao);
    AdicionaSpanAoDiv(StringSinalizada(personagem.salvacoes[tipo_salvacao].base, true) + ' ', 
                      null, div_salvacao);
    AdicionaSpanAoDiv(StringSinalizada(personagem.salvacoes[tipo_salvacao].racial) + ' ', 
                      null, div_salvacao);
    AdicionaSpanAoDiv('= ' + StringSinalizada(personagem.salvacoes[tipo_salvacao].total), 
                      null, div_salvacao);
    div_salvacoes.appendChild(div_salvacao);
  }
}

// Atualiza os numeros e listas relacionados a talentos.
function _AtualizaTalentos() {
  ImprimeNaoSinalizado(personagem.talentos.total, goog.dom.getElementByClass('talentos-total'));
  var div_talentos = goog.dom.getElement('div-select-talentos');
  RemoveFilhos(div_talentos);
  for (var i = 0; i < personagem.talentos.total; ++i) {
    AdicionaTalento(i, 
        i < personagem.talentos.lista.length ? personagem.talentos.lista[i].nome : null,
        i < personagem.talentos.lista.length ? personagem.talentos.lista[i].complemento : null);
  }
  var span_proficiencia_armas = goog.dom.getElement('div-proficiencia-armas');
  var string_proficiencia = '';
  for (var proficiencia in personagem.proficiencia_armas) {
    string_proficiencia += tabelas_armas[proficiencia].nome + ', ';
  }
  string_proficiencia += '.';
  span_proficiencia_armas.innerText = string_proficiencia.replace(', .', '.');
}

// Escreve todas as pericias e atualiza de acordo com a classe dos personagem.
function _AtualizaPericias() {
  var span_total = goog.dom.getElement('pericias-total-pontos');
  span_total.innerText = personagem.pericias.total_pontos;
  var span_gastos = goog.dom.getElement('pericias-pontos-gastos');
  span_gastos.innerText = personagem.pericias.pontos_gastos;

  for (var chave in personagem.pericias.lista) {
    var dom_graduacoes = goog.dom.getElement('pericia-' + chave + '-graduacoes');
    dom_graduacoes.innerText = personagem.pericias.lista[chave].pontos;
    var dom_sinergia = goog.dom.getElement('pericia-' + chave + '-sinergia');
    dom_sinergia.innerText = StringSinalizada(personagem.pericias.lista[chave].bonus_sinergia, false);
    var bonus_talentos_total = 0;
    for (var chave_talento in personagem.pericias.lista[chave].bonus_talentos) {
      bonus_talentos_total += personagem.pericias.lista[chave].bonus_talentos[chave_talento];
    }
    var dom_bonus_talento = goog.dom.getElement('pericia-' + chave + '-bonus-talento');
    dom_bonus_talento.innerText = StringSinalizada(bonus_talentos_total, false);
    var dom_total = goog.dom.getElement('pericia-' + chave + '-total');
    dom_total.innerText = StringSinalizada(personagem.pericias.lista[chave].total);
  }
}
