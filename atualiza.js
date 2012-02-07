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
  DependenciasGerais();
  _AtualizaGeral();
}

// Sempre que for necessaria uma atualizacao sem leitura de entradas, essa funcao sera chamada.
// Eh o caso de elementos criados de forma independente (armas, estilos) que devem ser adicionados
// manualmente a entrada e em seguida chamam essa funcao. As funcoes de carregamento tambem
// devem usar esta funcao, pois a entrada que eh salva.
function AtualizaGeralSemLerEntradas() {
  ConverteEntradasParaPersonagem();
  DependenciasGerais();
  _AtualizaGeral();
}

// Esta atualizacao eh usada quando se tem o personagem pronto, sem ser necessaria a leitura das 
// entradas. Normalmente os tratamentos de eventos alteram algum campo do personagem e chamam
// esta funcao para atualizar tudo.
function AtualizaGeralSemConverterEntradas() {
  DependenciasGerais();
  _AtualizaGeral();
}

// Apenas atualizacoes a planilha a partir do personagem, sem leitura de entradas.
function _AtualizaGeral() {
  _AtualizaNomeRacaAlinhamentoXp();
  _AtualizaDadosVida();
  _AtualizaPontosVida();
  _AtualizaAtributos();
  _AtualizaClasses();
  _AtualizaTamanho();
  _AtualizaModificadoresAtributos();
  _AtualizaIniciativa();
  _AtualizaAtaque();
  _AtualizaEstilosLuta();
  _AtualizaDefesa();
  _AtualizaSalvacoes();
  _AtualizaTalentos();
  _AtualizaProficienciaArmas();
  _AtualizaPericias();
  _AtualizaListaArmas();
  _AtualizaEquipamentos();
  _AtualizaFeiticos();
  _AtualizaNotas();
  _AtualizaModoVisao();
}

function _AtualizaNomeRacaAlinhamentoXp() {
  Dom('nome').value = personagem.nome;
  SelecionaValor(personagem.raca, Dom('raca'));
  SelecionaValor(personagem.alinhamento, Dom('alinhamento'));
  Dom('pontos-experiencia').value = personagem.experiencia;
}

// Atualiza os dados de vida do personagem de acordo com as classes.
function _AtualizaDadosVida() {
  var primeiro = true;  // primeira classe nao eh sinalizada.
  var string_dados_vida = '';
  for (var i = 0; i < personagem.classes.length; ++i) {
      if (primeiro) {
        primeiro = false;
      } else {
        string_dados_vida += ' +';
      }
      string_dados_vida += 
        personagem.classes[i].nivel + 'd' + tabelas_classes[personagem.classes[i].classe].dados_vida;
  }
  if (personagem.atributos.constituicao.modificador > 0) {
    string_dados_vida += 
      ' +' + (personagem.atributos.constituicao.modificador * personagem.dados_vida.nivel_personagem);
  }
  var span_dados = Dom('dados-vida-classes');
  span_dados.textContent = personagem.dados_vida.nivel_personagem + ' = ' + string_dados_vida;
}

// Atualiza as informacoes referentes a pontos de vida do personagem.
function _AtualizaPontosVida() {
  var pontos_vida_corrente = 
      personagem.pontos_vida.total - personagem.pontos_vida.ferimentos;
  ImprimeNaoSinalizado(
      pontos_vida_corrente, Dom('pontos-vida-corrente'));
  Dom('pontos-vida-dados').value = personagem.pontos_vida.total_dados ?
      personagem.pontos_vida.total_dados : '';
  ImprimeSinalizado(
      personagem.pontos_vida.bonus.Total(), Dom('pontos-vida-bonus'), false);
  Dom('ferimentos').value = personagem.pontos_vida.ferimentos > 0 ? 
      personagem.pontos_vida.ferimentos : '';
}

function _AtualizaAtributos() {
  // Botoes de atributos.
  var botoes_atributos = goog.dom.getElementsByClass('botoes-atributos');
  for (var i = 0; i < botoes_atributos.length; ++i) {
    if (personagem.atributos.pontos.gastos.length < 
        personagem.atributos.pontos.disponiveis) {
      // habilita botoes de atributos.
      botoes_atributos[i].style.display = 'inline';
    } else {
      // desabilita botoes de atributos.
      botoes_atributos[i].style.display = 'none';
    }
  }
  var botao_atributo_menos = Dom('botao-atributos-menos');
  if (personagem.atributos.pontos.gastos.length > 0) {
    botao_atributo_menos.style.display = 'inline';
  } else {
    botao_atributo_menos.style.display = 'none';
  }
  // Bonus gastos.
  var string_gastos = '';
  for (var i = 0; i < personagem.atributos.pontos.gastos.length; ++i) {
    string_gastos += tabelas_atributos[personagem.atributos.pontos.gastos[i]];
    if (i < personagem.atributos.pontos.gastos.length - 1) {
      string_gastos += ', ';
    }
  }
  Dom('pontos-atributos-gastos').textContent = string_gastos;
  Dom('pontos-atributos-total').textContent =
      personagem.atributos.pontos.disponiveis;

  var div_atributos = Dom('div-stats');
  var atributos = [ 
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    var atributo = atributos[i];
    var input_atributo = Dom(atributo + '-valor-base');
    input_atributo.value = personagem.atributos[atributo].base;
  }
}

// Torna todas as classes exceto a ultima desabilitadas. 
// Remove classes sobrando e adiciona faltantes.
function _AtualizaClasses() {
  var classes_desabilitadas = [];
  var div_classes = Dom('classes');
  var divs_classes = goog.dom.getElementsByClass('classe');
  var maior_indice = divs_classes.length > personagem.classes.length ?
      divs_classes.length : personagem.classes.length;
  for (var i = 0; i < maior_indice; ++i) {
    var div_classe = divs_classes[i];
    if (i < personagem.classes.length) {
      if (!div_classe) {
        AdicionaClasse(i, div_classes);
      }
      _AtualizaClasse(classes_desabilitadas, personagem.classes[i].classe, 
                      personagem.classes[i].nivel, i);
      classes_desabilitadas.push(personagem.classes[i].classe);
    } else {
      RemoveFilho(div_classe.id, div_classes);
    }
  }

  // Desabilita selects.
  var selects_classes = goog.dom.getElementsByClass('selects-classes'); 
  for (var i = 0; i < selects_classes.length - 1; ++i) {
    selects_classes[i].disabled = true;
  }
  selects_classes[selects_classes.length - 1].disabled = false;
}

// Atualiza uma classe.
function _AtualizaClasse(classes_desabilitadas, classe, nivel, indice) {
  var select_classe = Dom('select-classe-' + indice);
  select_classe.options.length = 0;
  for (var chave_classe in tabelas_classes) {
    if (tabelas_classes[chave_classe].mestre && !personagem.modo_mestre) {
      // So adiciona as classes de mestre se estiver no modo mestre.
      continue;
    }
    var desabilitar_classe = false;
    for (var j = 0; j < classes_desabilitadas.length; ++j) {
      if (chave_classe == classes_desabilitadas[j]) {
        desabilitar_classe = true;
        break;
      }
    }
    if (desabilitar_classe) {
      // Nao adiciona classe desabilitada.
      continue;
    }
    var option = CriaOption(tabelas_classes[chave_classe].nome, chave_classe);
    option.setAttribute('name', chave_classe);
    option.selected = (chave_classe == classe) && !desabilitar_classe;
    option.disabled = desabilitar_classe;
    select_classe.appendChild(option);
  }
  Dom('nivel-classe-' + indice).value = nivel;
}

// Atualiza o tamanho em funcao da raca.
function _AtualizaTamanho() {
  // Busca o modificador de tamanho da raca.
  ImprimeSinalizado(
      personagem.tamanho.modificador_ataque_defesa,
      goog.dom.getElementsByClass('tamanho-mod-ataque-defesa'));
  Dom('tamanho').textContent =
      tabelas_tamanho[personagem.tamanho.categoria].nome;
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car),
// a raca, class etc.
function _AtualizaModificadoresAtributos() {
  // busca a raca e seus modificadores.
  var modificadores_raca = tabelas_raca[personagem.raca].atributos;

  // Busca cada elemento das estatisticas e atualiza modificadores.
  var atributos = [ 
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    var atributo = atributos[i];
    // modificador racial.
    var modificador_racial = modificadores_raca[atributo] || 0;
    ImprimeSinalizado(
        modificador_racial,
        Dom(atributo + '-mod-racial'),
        false);

    // bonus nivel;
    ImprimeSinalizado(
        personagem.atributos[atributo].bonus_nivel,
        Dom(atributo + '-mod-nivel'),
        false);

    // Escreve o valor total.
    ImprimeNaoSinalizado(
        personagem.atributos[atributo].valor, 
        Dom(atributo + '-valor-total'));

    // Escreve o modificador.
    ImprimeSinalizado(
        personagem.atributos[atributo].modificador,
        goog.dom.getElementsByClass(atributo + '-mod-total'));
  }
}

function _AtualizaIniciativa() {
  ImprimeSinalizado(personagem.iniciativa.Total(), Dom('iniciativa'));
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
  RemoveFilhos(Dom('div-estilos-luta'));
  for (var i = 0; i < personagem.estilos_luta.length; ++i) {
    var estilo = personagem.estilos_luta[i];
    AdicionaEstiloLuta(estilo.nome, estilo.arma_primaria, estilo.arma_secundaria);
  }

  // Atualiza os valores dos estilos.
  var div_estilos = Dom("div-estilos-luta");
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
  Dom(id_radio).checked = true;

  var id_span_primario =
      id_estilo.replace('id-estilo', 'id-span-primario-estilo');
  var id_select_primario = 
      id_estilo.replace('id-estilo', 'id-select-primario-estilo');
  var arma_primaria = ArmaPersonagem(estilo.arma_primaria.nome);
  AdicionaArmasAoEstilo(Dom(id_select_primario), 
                        estilo.arma_primaria.nome);
  _AtualizaArmaEstilo(arma_primaria, true, estilo,
                      Dom(id_span_primario));

  var id_span_secundario =
    id_estilo.replace('id-estilo', 'id-span-secundario-estilo');
  if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    var id_select_secundario = 
        id_estilo.replace('id-estilo', 'id-select-secundario-estilo');
    var arma_secundaria = ArmaPersonagem(estilo.arma_secundaria.nome);
    AdicionaArmasAoEstilo(Dom(id_select_secundario), 
                          estilo.arma_secundaria.nome);
    _AtualizaArmaEstilo(arma_secundaria, false, estilo,
                        Dom(id_span_secundario));
  } else {
    Dom(id_span_secundario).textContent = '';
  }
}

// Atualiza o span de uma arma no estilo de luta com seus valores de ataque e defesa
// @param arma do personagem.
// @param primaria booleano indicando se a arma eh primaria ou secundaria.
// @param estilo de luta cuja arma esta sendo atualizada.
// @param span_arma o dom da arma, que eh um span.
function _AtualizaArmaEstilo(arma, primaria, estilo, span_arma) {
  span_arma.textContent = '';
  var arma_estilo = primaria ? estilo.arma_primaria : estilo.arma_secundaria;
  for (var categoria in arma_estilo.bonus_por_categoria) {
    var bonus = arma_estilo.bonus_por_categoria[categoria];
    span_arma.textContent += categoria + ': ' + StringSinalizada(bonus.ataque) + ', ';
    var arma_tabela = arma.arma_tabela;
    if (estilo.nome == 'arma_dupla' && !primaria) {
      span_arma.textContent += arma_tabela.dano_secundario[personagem.tamanho.categoria];
    } else {
      span_arma.textContent += arma_tabela.dano[personagem.tamanho.categoria];
    }
    span_arma.textContent += StringSinalizada(bonus.dano, false) + '; ';
  }
}

// Atualiza os varios tipos de defesa lendo tamanho, armadura e modificadores relevantes.
function _AtualizaDefesa() {
  // Armadura e escudo.
  SelecionaValor(personagem.armadura.nome, 
                 Dom('armadura')); 
  Dom('bonus-armadura').value =
      personagem.ca.bonus.Le('armadura_melhoria', 'armadura');
  SelecionaValor(personagem.escudo.nome, 
                 Dom('escudo'));
  Dom('bonus-escudo').value =
      personagem.ca.bonus.Le('escudo_melhoria', 'escudo');

  ImprimeSinalizado(personagem.ca.bonus.Le('armadura', 'armadura') +
                    personagem.ca.bonus.Le('armadura_melhoria', 'armadura'),
                    goog.dom.getElementsByClass('ca-armadura'));
  ImprimeSinalizado(personagem.ca.bonus.Le('escudo', 'escudo') + 
                    personagem.ca.bonus.Le('escudo_melhoria', 'escudo'),
                    goog.dom.getElementsByClass('ca-escudo'));

  // AC normal.
  ImprimeNaoSinalizado(
      10 + personagem.ca.bonus.Total(),
      goog.dom.getElementsByClass('ca-normal'));
  // AC surpreso.
  ImprimeNaoSinalizado(
      10 + personagem.ca.bonus.Total(['atributo']),
      goog.dom.getElementsByClass('ca-surpreso'));
  // AC toque.
  ImprimeNaoSinalizado(
      10 + personagem.ca.bonus.Total(
          ['armadura', 'escudo', 'armadura_melhoria', 'escudo_melhoria', 'armadura_natural']),
      goog.dom.getElementsByClass('ca-toque'));
}

// Atualiza as salvacoes, calculando o bonus base de acordo com a classe e
// modificando pelo atributo relevante.
// TODO fazer outros tipo tb.
function _AtualizaSalvacoes() {
  var div_salvacoes = Dom('div-salvacoes');
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
  // Talentos de classe.
  for (var chave_classe in personagem.talentos) {
    var div_talentos_classe = Dom('div-talentos-' + chave_classe);
    var lista_classe = personagem.talentos[chave_classe];
    var div_selects = Dom('div-talentos-' + chave_classe + '-selects');
    if (lista_classe.length > 0) {
      ImprimeNaoSinalizado(
          lista_classe.length, 
          Dom('talentos-' + chave_classe + '-total'));
      for (var i = 0; i < lista_classe.length; ++i) {
        _AtualizaTalento(
            lista_classe[i], 
            i < div_selects.childNodes.length ? 
                div_selects.childNodes[i] : null,
            (chave_classe == 'gerais') ? null : chave_classe,
            div_selects);
      }
      div_talentos_classe.style.display = 'block';
    } else {
      div_talentos_classe.style.display = 'none';
      RemoveFilhos(div_selects.childNodes);
    }
  }
}

// Atualiza um talento. Se 'div_talento' nao for null, usa o div para o talento.
// Caso contrario, cria o div em questao.
// @param chave_classe chave da classe para talentos de classe, null caso contrario.
// @param div_pai o div onde o talento sera adicionado, caso nao exista.
function _AtualizaTalento(talento_personagem, div_talento, chave_classe, div_pai) {
  if (div_talento == null) {
    div_talento = AdicionaTalento(chave_classe, div_pai);
  }
  if (talento_personagem.chave.length == 0) {
    return;
  }
  for (var i = 0; i < div_talento.childNodes.length; ++i) {
    var filho = div_talento.childNodes[i];
    if (filho.name == 'chave-talento') {
      SelecionaValor(talento_personagem.chave, filho);
    } else if (filho.name == 'complemento-talento') {
      filho.disabled = !('complemento' in tabelas_talentos[talento_personagem.chave]);
      filho.value = talento_personagem.complemento;
    }
  }
}

function _AtualizaProficienciaArmas() {
  var span_proficiencia_armas = Dom('div-proficiencia-armas');
  var string_proficiencia = '';
  for (var proficiencia in personagem.proficiencia_armas) {
    string_proficiencia += tabelas_armas[proficiencia].nome + ', ';
  }
  string_proficiencia += '.';
  span_proficiencia_armas.textContent = string_proficiencia.replace(', .', '.');
}

// Escreve todas as pericias e atualiza de acordo com a classe dos personagem.
function _AtualizaPericias() {
  var span_total = Dom('pericias-total-pontos');
  span_total.textContent = personagem.pericias.total_pontos;
  var span_gastos = Dom('pericias-pontos-gastos');
  span_gastos.textContent = personagem.pericias.pontos_gastos;

  for (var chave in personagem.pericias.lista) {
    var dom_pericia = Dom('pericia-' + chave);
    var pericia_personagem = personagem.pericias.lista[chave];
    if (pericia_personagem.de_classe) {
      dom_pericia.className = 'pericia-de-classe';
    } else {
      dom_pericia.className = '';
    }
    var input_pontos = Dom('pericia-' + chave + '-pontos');
    input_pontos.value = pericia_personagem.pontos;
    var dom_graduacoes = Dom('pericia-' + chave + '-graduacoes');
    dom_graduacoes.textContent = pericia_personagem.graduacoes;
    var dom_total_bonus = Dom('pericia-' + chave + '-total-bonus');
    dom_total_bonus.textContent = StringSinalizada(pericia_personagem.bonus.Total(), false);
    var dom_total = Dom('pericia-' + chave + '-total');
    dom_total.textContent = StringSinalizada(pericia_personagem.total);
  }
}

function _AtualizaFeiticos() {
  var div_feiticos = Dom('div-feiticos');
  RemoveFilhos(div_feiticos);
  for (var chave_classe in personagem.feiticos) {
    if (!personagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    // Da classe.
    var div_classe = CriaDiv('div-feiticos-' + chave_classe, 'div-feiticos-classe');
    div_classe.appendChild(CriaSpan('Feitiços de ' + tabelas_classes[chave_classe].nome));
    _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe);
    _AtualizaFeiticosSlotsParaClasse(chave_classe, div_classe);
    div_feiticos.appendChild(div_classe);
  }
}

function _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe) {
  var feiticos_classe = personagem.feiticos[chave_classe];
  // Conhecidos.
  var div_conhecidos = CriaDiv('div-feiticos-conhecidos-' + chave_classe);
  div_conhecidos.appendChild(CriaSpan('Feitiços conhecidos'));
  // Por nivel.
  for (var nivel in feiticos_classe.conhecidos) {
    if (feiticos_classe.conhecidos[nivel].length == 0) {
      continue;
    }
    var div_nivel = CriaDiv('div-feiticos-conhecidos-' + chave_classe + '-' + nivel);
    div_nivel.appendChild(
        CriaSpan('Nível ' + nivel + ':')); 
    div_nivel.appendChild(CriaBr());
    for (var indice = 0; indice < feiticos_classe.conhecidos[nivel].length; ++indice) {
      // Adiciona os inputs.
      div_nivel.appendChild(CriaInputTexto(
          feiticos_classe.conhecidos[nivel][indice],
          'input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + indice, 
          'feiticos-conhecidos'));
      div_nivel.appendChild(CriaBr());
    }
    div_conhecidos.appendChild(div_nivel);
  }
  div_classe.appendChild(div_conhecidos);
}

function _AtualizaFeiticosSlotsParaClasse(chave_classe, div_classe) {
  var precisa_conhecer = tabelas_feiticos[chave_classe].precisa_conhecer;
  var div_slots = CriaDiv('div-feiticos-slots-' + chave_classe);
  div_slots.appendChild(CriaSpan('Feitiços por Dia'));
  // Por nivel.
  var feiticos_classe = personagem.feiticos[chave_classe];
  for (var nivel in feiticos_classe.slots) {
    if (feiticos_classe.slots[nivel].feiticos.length == 0) {
      continue;
    }
    var div_nivel = CriaDiv('div-feiticos-slots-' + chave_classe + '-' + nivel);
    div_nivel.appendChild(
        CriaSpan('Nível ' + nivel + ':'));
    div_nivel.appendChild(CriaBr());
    for (var indice = 0; indice < feiticos_classe.slots[nivel].feiticos.length; ++indice) {
      // Adiciona os inputs de indices.
      if (!precisa_conhecer) {
        div_nivel.appendChild(CriaInputTexto(
            feiticos_classe.slots[nivel].feiticos[indice].nome,
            'input-feiticos-slots-' + chave_classe + '-' + nivel + '-' + indice, 
            'feiticos-slots'));
      }
      div_nivel.appendChild(CriaInputCheckbox(
          feiticos_classe.slots[nivel].feiticos[indice].gasto,
          'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + indice, 
          'feiticos-slots-gastos'));
      if (!precisa_conhecer) {
        // Um br apos cada feitico.
        div_nivel.appendChild(CriaBr());
      }
    }
    // Todos os checkbox em uma linha so, por o br no final.
    if (precisa_conhecer) {
      div_nivel.appendChild(CriaBr());
    }

    // Adiciona input de dominio se houver.
    if (feiticos_classe.slots[nivel].feitico_dominio != null) {
      div_nivel.appendChild(CriaSpan('D:'));
      div_nivel.appendChild(CriaInputTexto(
          feiticos_classe.slots[nivel].feitico_dominio.nome,
          'input-feiticos-slots-' + chave_classe + '-' + nivel + '-dom', 
          'feiticos-slots'));
      div_nivel.appendChild(CriaInputCheckbox(
          feiticos_classe.slots[nivel].feitico_dominio.gasto,
          'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-dom', 
          'feiticos-slots-gastos'));
      div_nivel.appendChild(CriaBr());
    }
    div_slots.appendChild(div_nivel);
  }
  div_classe.appendChild(div_slots);
}

function _AtualizaEquipamentos() {
  for (var tipo_moeda in personagem.moedas) {
    Dom('moedas-' + tipo_moeda).value = personagem.moedas[tipo_moeda];
  }
  _AtualizaAneis();
  Dom('text-area-outros-equipamentos').value =
      personagem.outros_equipamentos;;
}

function _AtualizaAneis() {
  var div_aneis_pai = Dom('div-equipamentos-aneis');
  var div_aneis_filhos = goog.dom.getElementsByClass('div-aneis');
  for (var i = 0; i < personagem.aneis.length; ++i) {
    _AtualizaAnel(
        personagem.aneis[i],
        (i >= div_aneis_filhos.length) ? null : div_aneis_filhos[i],
        div_aneis_pai);
  }
}

// Atualiza um anel, o div pode ser null, nesse caso criara um novo.
// @param anel do personagem (aneis[i]).
function _AtualizaAnel(anel, div_anel, div_aneis) {
  if (div_anel == null) {
    div_anel = CriaDiv(null, 'div-aneis');
    AdicionaAnel(div_anel, div_aneis);
    div_aneis.appendChild(div_anel);
  }
  for (var i = 0; i < div_anel.childNodes.length; ++i) {
    var filho = div_anel.childNodes[i];
    if (filho.name == 'anel') {
      SelecionaValor(anel.chave, filho);
    } else if (filho.name == 'em_uso') {
      filho.checked = anel.em_uso;
    }
  }
}

function _AtualizaListaArmas() {
  var div_armas = Dom('div-equipamentos-armas');
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

function _AtualizaNotas() {
  Dom('text-area-notas').value = personagem.notas;
}

function _AtualizaModoVisao() {
  for (var visao in tabelas_visoes) {
    var span_visao = goog.dom.getElement('span-' + visao);
    span_visao.className = personagem.modo_visao == visao ?
        'selecionado': '';
  }
  Dom('input-modo-mestre').checked = personagem.modo_mestre;
  var botoes_geracao = goog.dom.getElementsByClass('botao-geracao');
  for (var i = 0; i < botoes_geracao.length; ++i) {
    botoes_geracao[i].style.display = personagem.modo_mestre ? 'inline' : 'none';
  }
}

function AtualizaFerimentos(valor) {
  personagem.pontos_vida.ferimentos += valor;
  if (personagem.pontos_vida.ferimentos < 0) {
    personagem.pontos_vida.ferimentos = 0;
  }
  AtualizaGeralSemConverterEntradas();
}