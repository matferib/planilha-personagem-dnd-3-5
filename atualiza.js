// Todas as funcoes de atualizacao.
// Idealmente, nao deve haver nenhuma referencia a entradas neste arquivo,
// exceto a chamada AtualizaGeral.

// Quase sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha. Ela lera as entradas, convertendo-nas e em seguida atualizara
// os diversos elementos da planilha.
function AtualizaGeral() {
  // Apenas le as entradas para a estrutura de entradas.
  LeEntradas(); 
  // converte a estrutura de entradas para a de personagem.
  ConverteEntradasParaPersonagem();
  _AtualizaGeral();
}

// Sempre que for necessaria uma atualizacao sem leitura de entradas, essa funcao sera chamada.
// Eh o caso de elementos criados de forma independente (armas, estilos) que devem ser adicionados
// manualmente a entrada e em seguida chamam essa funcao. O carregamento inicial por URL faz o mesmo,
// ja que as entradas vem todas no objeto JSON.
function AtualizaGeralSemLerEntradas() {
  ConverteEntradasParaPersonagem();
  _AtualizaGeral();
}

// Apenas atualizacoes a planilha a partir do personagem, sem leitura de entradas.
function _AtualizaGeral() {
  _AtualizaNomeRacaAlinhamentoXp();
  _AtualizaDadosPontosVida();
  _AtualizaAtributos();
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
  _AtualizaListaArmas();
  _AtualizaMoedas();
  _AtualizaFeiticos();
}

function _AtualizaNomeRacaAlinhamentoXp() {
  goog.dom.getElement('nome').value = personagem.nome;
  SelecionaValor(personagem.raca, goog.dom.getElement('raca'));
  SelecionaValor(personagem.alinhamento, goog.dom.getElement('alinhamento'));
  goog.dom.getElement('pontos-experiencia').value = personagem.experiencia;
}

function _AtualizaDadosPontosVida() {
  goog.dom.getElement('pontos-vida-total').value = personagem.pontos_vida.total;
  goog.dom.getElement('ferimentos').value = personagem.pontos_vida.ferimentos;
}

function _AtualizaAtributos() {
  var div_atributos = goog.dom.getElement('div-stats');
  for (var atributo in personagem.atributos) {
    var input_atributo = goog.dom.getElement(atributo + '-valor-base');
    input_atributo.value = personagem.atributos[atributo].base;
  }
}

// Torna todas as classes exceto a ultima desabilitadas. 
function _AtualizaClasses() {
  RemoveFilhos(goog.dom.getElement('classes'));
  var classes_desabilitadas = [];
  // Cria os selects.
  for (var i = 0; i < personagem.classes.length; ++i) {
    AdicionaClasse(classes_desabilitadas, personagem.classes[i].classe, personagem.classes[i].nivel);
    classes_desabilitadas.push(personagem.classes[i].classe);
  }

  // Desabilita selects.
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
        personagem.classes[i].nivel + 'd' + tabelas_classes[personagem.classes[i].classe].dados_vida;

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
  // Recria os elementos do estilos. 
  RemoveFilhos(goog.dom.getElement('div-estilos-luta'));
  for (var i = 0; i < personagem.estilos_luta.length; ++i) {
    var estilo = personagem.estilos_luta[i];
    AdicionaEstiloLuta(estilo.nome, estilo.arma_primaria, estilo.arma_secundaria);
  }

  // Atualiza os valores dos estilos.
  var div_estilos = goog.dom.getElement("div-estilos-luta");
  for (var i = 0; i < div_estilos.childNodes.length; ++i) {
    _AtualizaEstilo(div_estilos.childNodes[i], personagem.estilos_luta[i]);
  }
}

// Usada por _AtualizaEstilosLuta.
// @param div_estilo o div do estilo.
// @param estilo no personagem.
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
  // Armadura e escudo.
  SelecionaValor(personagem.armadura.nome, 
                 goog.dom.getElement('armadura')); 
  goog.dom.getElement('bonus-armadura').value = personagem.armadura.bonus_magico; 
  SelecionaValor(personagem.escudo.nome, 
                 goog.dom.getElement('escudo'));
  goog.dom.getElement('bonus-escudo').value = personagem.escudo.bonus_magico; 


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
    var input_pontos = goog.dom.getElement('pericia-' + chave + '-pontos');
    input_pontos.value = personagem.pericias.lista[chave].pontos;
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

function _AtualizaFeiticos() {
  // Cria os elementos da planilha.
  var div_feiticos = goog.dom.getElement('div-feiticos');
  RemoveFilhos(div_feiticos);
  for (var chave_classe in personagem.feiticos) {
    // Da classe.
    var div_classe = CriaDiv('div-feiticos-' + chave_classe);
    div_classe.appendChild(CriaSpan('Feitiços de ' + tabelas_classes[chave_classe].nome));
    // Conhecidos.
    var div_conhecidos = CriaDiv('div-feiticos-conhecidos-' + chave_classe);
    div_conhecidos.appendChild(CriaSpan('Feitiços conhecidos'));
    // Por nivel.
    var feiticos_classe = personagem.feiticos[chave_classe];
    for (var nivel in feiticos_classe.conhecidos) {
      var div_nivel = CriaDiv('div-feiticos-conhecidos-' + chave_classe + '-' + nivel);
      div_nivel.appendChild(
          CriaSpan('Nível: ' + nivel + 
                   ', feitiços: ' + feiticos_classe.conhecidos[nivel].length));
      div_nivel.appendChild(CriaBr());
      for (var j = 0; j < feiticos_classe.conhecidos[nivel].length; ++j) {
        // Adiciona os inputs.
        div_nivel.appendChild(CriaInputTexto(
            feiticos_classe.conhecidos[nivel][j],
            'input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + j, 
            'feiticos-conhecidos'));
        div_nivel.appendChild(CriaBr());
      }
      div_conhecidos.appendChild(div_nivel);
    }
    div_classe.appendChild(div_conhecidos);
    div_feiticos.appendChild(div_classe);
  }
}

function _AtualizaMoedas() {
  for (var tipo_moeda in personagem.moedas) {
    goog.dom.getElement('moedas-' + tipo_moeda).value = personagem.moedas[tipo_moeda];
  }
}

function _AtualizaListaArmas() {
  var div_armas = goog.dom.getElement('div-equipamentos-armas');
  RemoveFilhos(div_armas);
  // Ignoramos a primeira arma, desarmado.
  for (var i = 1; i < personagem.armas.length; ++i) {
    var arma_personagem_entrada = personagem.armas[i].entrada;
    AdicionaArma(
        arma_personagem_entrada.chave, 
        arma_personagem_entrada.obra_prima, 
        arma_personagem_entrada.bonus);
  }
}
