// Todas as funcoes de atualizacao dos campos da interface.
// Idealmente, nao deve haver nenhuma referencia a gEntradas neste arquivo,
// exceto na chamada AtualizaGeral.

// Quase sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha. Ela lera as gEntradas, convertendo-nas e em seguida atualizara
// os diversos elementos da planilha.
function AtualizaGeral() {
  // Apenas le as gEntradas para a estrutura de gEntradas.
  LeEntradas();
  // converte a estrutura de gEntradas para a de personagem.
  ConverteEntradasParaPersonagem();
  PersonagemLimpaPericias();
  DependenciasGerais();
  _AtualizaGeral();
  gEstado.Salva(JSON.stringify(gEntradas));
}

// AVISO:
// Essa funcao eh bem perigosa. Varios botoes atualizam o personagem mas nao os objetos de gEntradas.
// Portanto, se essa funcao for chamada nesse intervalo onde personagem e gEntradas ficam fora de
// sincronismo, o personagem sera revertido para a versao das gEntradas (por exemplo, apos gerar um
// personagem, tentar adicionar algo em gEntradas e chamar essa funcao vai zerar o personagem).
//
// Sempre que for necessaria uma atualizacao sem leitura de gEntradas, essa funcao sera chamada.
// Eh o caso de elementos criados de forma independente (armas, estilos) que devem ser adicionados
// manualmente a entrada e em seguida chamam essa funcao. As funcoes de carregamento tambem
// devem usar esta funcao, pois a entrada que eh salva.
function AtualizaGeralSemLerEntradas() {
  PersonagemLimpaGeral();
  ConverteEntradasParaPersonagem();
  DependenciasGerais();
  _AtualizaGeral();
  gEstado.Salva(JSON.stringify(gEntradas));
}

// Esta atualizacao eh usada quando se tem o personagem pronto, sem ser necessaria a leitura das
// gEntradas.
function AtualizaGeralSemConverterEntradas() {
  DependenciasGerais();
  _AtualizaGeral();
}

// Apenas atualizacoes a planilha a partir do personagem, sem leitura de gEntradas.
function _AtualizaGeral() {
  _AtualizaNomeRacaAlinhamentoXp();
  _AtualizaDadosVida();
  _AtualizaPontosVida();
  _AtualizaAtributos();
  _AtualizaClasses();
  _AtualizaDominios();
  _AtualizaFamiliar();
  _AtualizaTamanho();
  _AtualizaModificadoresAtributos();
  _AtualizaIniciativa();
  _AtualizaAtaque();
  _AtualizaEstilosLuta();
  _AtualizaSalvacoes();
  _AtualizaHabilidadesEspeciais();
  _AtualizaImunidades();
  _AtualizaResistenciaMagia();
  _AtualizaTalentos();
  _AtualizaProficienciaArmas();
  _AtualizaPericias();
  _AtualizaListaArmas();
  _AtualizaListaArmaduras();
  _AtualizaListaEscudos();
  _AtualizaEquipamentos();
  _AtualizaFeiticos();
  _AtualizaNotas();
  _AtualizaModoVisao();
}

function _AtualizaNomeRacaAlinhamentoXp() {
  Dom('nome').value = gPersonagem.nome;
  document.title = gPersonagem.nome.length > 0 ? gPersonagem.nome : 'anonimo';
  SelecionaValor(gPersonagem.raca, Dom('raca'));
  SelecionaValor(gPersonagem.template, Dom('template'));
  SelecionaValor(gPersonagem.alinhamento, Dom('alinhamento'));
  Dom('pontos-experiencia').value = gPersonagem.experiencia;
  Dom('divindade-patrona').value = gPersonagem.divindade;
}

// Atualiza os dados de vida do personagem de acordo com as classes.
function _AtualizaDadosVida() {
  var span_dados = Dom('dados-vida-classes');
  span_dados.textContent =
      gPersonagem.dados_vida.nivel_personagem + ' = ' + PersonagemStringDadosVida();
}

// Atualiza as informacoes referentes a pontos de vida do personagem.
function _AtualizaPontosVida() {
  // O valor dos ferimentos deve ser <= 0.
  var pontos_vida_corrente =
      gPersonagem.pontos_vida.total_dados + gPersonagem.pontos_vida.bonus.Total() + gPersonagem.pontos_vida.temporarios
      - gPersonagem.pontos_vida.ferimentos - gPersonagem.pontos_vida.ferimentos_nao_letais;
  ImprimeNaoSinalizado(
      pontos_vida_corrente, Dom('pontos-vida-corrente'));
  Dom('pontos-vida-dados').value = gPersonagem.pontos_vida.total_dados ?
      gPersonagem.pontos_vida.total_dados : '';
  ImprimeSinalizado(
      gPersonagem.pontos_vida.bonus.Total(), Dom('pontos-vida-bonus'), false);
  ImprimeSinalizado(
      gPersonagem.pontos_vida.temporarios, Dom('pontos-vida-temporarios'), false);
  ImprimeSinalizado(
      -gPersonagem.pontos_vida.ferimentos, Dom('ferimentos'), false);
  ImprimeSinalizado(
      -gPersonagem.pontos_vida.ferimentos_nao_letais, Dom('ferimentos-nao-letais'), false);
}

function _AtualizaAtributos() {
  // Botoes de atributos.
  var botoes_atributos = DomsPorClasse('botoes-atributos');
  for (var i = 0; i < botoes_atributos.length; ++i) {
    if (gPersonagem.atributos.pontos.gastos.length <
        gPersonagem.atributos.pontos.disponiveis) {
      // habilita botoes de atributos.
      botoes_atributos[i].style.display = 'inline';
    } else {
      // desabilita botoes de atributos.
      botoes_atributos[i].style.display = 'none';
    }
  }
  var botao_atributo_menos = Dom('botao-atributos-menos');
  if (gPersonagem.atributos.pontos.gastos.length > 0) {
    botao_atributo_menos.style.display = 'inline';
  } else {
    botao_atributo_menos.style.display = 'none';
  }
  // Bonus gastos.
  var string_gastos = '';
  for (var i = 0; i < gPersonagem.atributos.pontos.gastos.length; ++i) {
    string_gastos += tabelas_atributos[gPersonagem.atributos.pontos.gastos[i]];
    if (i < gPersonagem.atributos.pontos.gastos.length - 1) {
      string_gastos += ', ';
    }
  }
  Dom('pontos-atributos-gastos').textContent = string_gastos;
  Dom('pontos-atributos-total').textContent =
      gPersonagem.atributos.pontos.disponiveis;

  // Os atributos base.
  var div_atributos = Dom('div-stats');
  var atributos = [
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    var atributo = atributos[i];
    var input_atributo = Dom(atributo + '-valor-base');
    input_atributo.value = gPersonagem.atributos[atributo].bonus.Le('base');
  }
}

// Torna todas as classes exceto a ultima desabilitadas.
// Remove classes sobrando e adiciona faltantes.
function _AtualizaClasses() {
  var classes_desabilitadas = [];
  var div_classes = Dom('classes');
  var divs_classes = DomsPorClasse('classe');
  var maior_indice = divs_classes.length > gPersonagem.classes.length ?
      divs_classes.length : gPersonagem.classes.length;
  for (var i = 0; i < maior_indice; ++i) {
    var div_classe = divs_classes[i];
    if (i < gPersonagem.classes.length) {
      if (!div_classe) {
        AdicionaClasse(i, div_classes);
      }
      _AtualizaClasse(
          classes_desabilitadas, gPersonagem.classes[i].classe,
          gPersonagem.classes[i].nivel, gPersonagem.classes[i].nivel_conjurador, i);
      classes_desabilitadas.push(gPersonagem.classes[i].classe);
    } else {
      RemoveFilho(div_classe.id, div_classes);
    }
  }

  // Desabilita selects.
  var selects_classes = DomsPorClasse('selects-classes');
  for (var i = 0; i < selects_classes.length - 1; ++i) {
    selects_classes[i].disabled = true;
  }
  selects_classes[selects_classes.length - 1].disabled = false;
}

function _AtualizaDominios() {
  if (PersonagemNivelClasse('clerigo') == 0) {
    Dom('span-dominios').style.display = 'none';
  } else {
    Dom('span-dominios').style.display = 'inline';
  }
}

function _AtualizaFamiliar() {
  if (PersonagemNivelClasse('feiticeiro') == 0 &&
      PersonagemNivelClasse('mago') == 0 &&
      PersonagemNivelClasse('mago_necromante') == 0) {
    Dom('familiar').style.display = 'none';
  } else {
    Dom('familiar').style.display = 'block';
  }
}

// Atualiza uma classe.
function _AtualizaClasse(classes_desabilitadas, classe, nivel, nivel_conjurador, indice) {
  var select_classe = Dom('select-classe-' + indice);
  select_classe.options.length = 0;
  var options = [];
  for (var chave_classe in tabelas_classes) {
    if (tabelas_classes[chave_classe].mestre && !gPersonagem.modo_mestre) {
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
    var option = CriaOption(Traduz(tabelas_classes[chave_classe].nome), chave_classe);
    option.setAttribute('name', chave_classe);
    option.selected = (chave_classe == classe) && !desabilitar_classe;
    option.disabled = desabilitar_classe;
    options.push(option);
  }
  options.sort(function(oe, od) {
    return Traduz(oe.text).localeCompare(od.text);
  });
  options.forEach(function(option) {
    select_classe.appendChild(option);
  });
  Dom('nivel-classe-' + indice).value = nivel;
  Dom('nivel-conjurador-' + indice).textContent = nivel_conjurador;
}

// Atualiza o tamanho em funcao da raca.
function _AtualizaTamanho() {
  // Busca o modificador de tamanho da raca.
  ImprimeSinalizado(
      gPersonagem.tamanho.modificador_ataque_defesa,
      DomsPorClasse('tamanho-mod-ataque-defesa'));
  ImprimeSinalizado(
      gPersonagem.tamanho.modificador_agarrar,
      DomsPorClasse('tamanho-mod-agarrar'));
  SelecionaValor(PersonagemTamanhoRaca(), Dom('tamanho'));
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car),
// a raca, class etc.
function _AtualizaModificadoresAtributos() {
  // busca a raca e seus modificadores.
  var modificadores_raca = tabelas_raca[gPersonagem.raca].atributos;

  // Busca cada elemento das estatisticas e atualiza modificadores.
  var atributos = [
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    var atributo = atributos[i];
    // Valor do bonus sem base.
    var dom_bonus = Dom(atributo + '-mod-bonus');
    ImprimeSinalizado(gPersonagem.atributos[atributo].bonus.Total(['base']), dom_bonus, false);
    Titulo(gPersonagem.atributos[atributo].bonus.Exporta(['base']), dom_bonus);

    // Escreve o valor total.
    var dom_valor = Dom(atributo + '-valor-total');
    ImprimeNaoSinalizado(gPersonagem.atributos[atributo].bonus.Total(), dom_valor);
    Titulo(gPersonagem.atributos[atributo].bonus.Exporta(), dom_valor);

    // Escreve o modificador.
    ImprimeSinalizado(
        gPersonagem.atributos[atributo].modificador,
        DomsPorClasse(atributo + '-mod-total'));
  }
}

function _AtualizaIniciativa() {
  var span_iniciativa = Dom('iniciativa');
  ImprimeSinalizado(gPersonagem.iniciativa.Total(), span_iniciativa);
  Titulo(gPersonagem.iniciativa.Exporta(), span_iniciativa);
}

// Atualiza os diversos tipos de ataques lendo a classe e os modificadores relevantes.
function _AtualizaAtaque() {
  ImprimeSinalizado(gPersonagem.bba, DomsPorClasse('bba'));
  ImprimeNaoSinalizado(gPersonagem.numero_ataques,
                       DomsPorClasse('numero-ataques'));
  // Corpo a corpo.
  var span_bba_cac = Dom('bba-corpo-a-corpo');
  ImprimeSinalizado(gPersonagem.bba_cac, span_bba_cac);
  var titulo_span_bba_cac = {};
  titulo_span_bba_cac[Traduz('bba')] = gPersonagem.bba;
  titulo_span_bba_cac[Traduz('força')] = gPersonagem.atributos['forca'].modificador;
  titulo_span_bba_cac[Traduz('tamanho')] = gPersonagem.tamanho.modificador_ataque_defesa;
  TituloChaves(titulo_span_bba_cac, span_bba_cac);

  // Distancia.
  var span_bba_distancia = Dom('bba-distancia');
  ImprimeSinalizado(gPersonagem.bba_distancia, span_bba_distancia);
  var titulo_span_bba_distancia = {};
  titulo_span_bba_distancia[Traduz('bba')] = gPersonagem.bba;
  titulo_span_bba_distancia[Traduz('destreza')] = gPersonagem.atributos['destreza'].modificador;
  titulo_span_bba_distancia[Traduz('tamanho')] = gPersonagem.tamanho.modificador_ataque_defesa;
  TituloChaves(titulo_span_bba_distancia, span_bba_distancia);

  // Agarrar
  var span_bba_agarrar = Dom('bba-agarrar');
  ImprimeSinalizado(gPersonagem.agarrar, span_bba_agarrar);
  var titulo_span_bba_agarrar = {};
  titulo_span_bba_agarrar[Traduz('bba')] = gPersonagem.bba;
  titulo_span_bba_agarrar[Traduz('força')] = gPersonagem.atributos['forca'].modificador;
  titulo_span_bba_agarrar[Traduz('tamanho especial')] = gPersonagem.tamanho.modificador_agarrar;
  TituloChaves(titulo_span_bba_agarrar, span_bba_agarrar);
}

// Atualiza a lista de armas de cada estilo.
function _AtualizaEstilosLuta() {
  var dom_estilos = Dom('div-estilos-luta');
  AjustaFilhos(dom_estilos, gPersonagem.estilos_luta.length, function(indice_filho) {
    AdicionaEstiloLuta(gPersonagem.estilos_luta[indice_filho].nome);
  });
  // Atualiza os valores dos estilos. Neste ponto,
  // dom_filhos.length == gPersonagem.estilos_luta.length.
  var dom_filhos = dom_estilos.childNodes;
  for (var i = 0; i < gPersonagem.estilos_luta.length; ++i) {
    _AtualizaEstilo(dom_filhos[i], gPersonagem.estilos_luta[i]);
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
  var id_span_classe_armadura =
      id_estilo.replace('id-estilo', 'id-span-classe-armadura');
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
  _AtualizaClasseArmaduraEstilo(estilo.nome, Dom(id_span_classe_armadura));
}

// Atualiza o span de uma arma no estilo de luta com seus valores de ataque e defesa
// @param arma do personagem.
// @param primaria booleano indicando se a arma eh primaria ou secundaria.
// @param estilo de luta cuja arma esta sendo atualizada.
// @param span_arma o dom da arma, que eh um span.
function _AtualizaArmaEstilo(arma, primaria, estilo, span_arma) {
  span_arma.textContent = GeraResumoArmaEstilo(arma, primaria, estilo);
}

// Atualiza o span de classe de armadura do estilo.
function _AtualizaClasseArmaduraEstilo(nome_estilo, span_classe_armadura) {
  var usar_escudo = (nome_estilo == 'arma_escudo');
  RemoveFilhos(span_classe_armadura);
  // AC normal.
  var span_ca_normal = CriaSpan();
  var array_exclusao = usar_escudo ? null : ['escudo', 'escudo_melhoria'];
  ImprimeNaoSinalizado(
      10 + gPersonagem.ca.bonus.Total(array_exclusao),
      span_ca_normal);
  Titulo(gPersonagem.ca.bonus.Exporta(array_exclusao), span_ca_normal);
  span_classe_armadura.appendChild(span_ca_normal);
  span_ca_normal.textContent += ', ';
  // AC surpreso.
  var span_ca_surpreso = CriaSpan();
  array_exclusao = ['atributo'];
  if (!usar_escudo) {
    array_exclusao.push('escudo');
    array_exclusao.push('escudo_melhoria');
  }
  ImprimeNaoSinalizado(
      10 + gPersonagem.ca.bonus.Total(array_exclusao),
      span_ca_surpreso);
  Titulo(gPersonagem.ca.bonus.Exporta(array_exclusao), span_ca_surpreso);
  span_classe_armadura.appendChild(span_ca_surpreso);
  span_ca_surpreso.textContent = Traduz('Surpresa') + ': ' + span_ca_surpreso.textContent + ', ';
  // AC toque.
  var span_ca_toque = CriaSpan();
  array_exclusao =
    ['armadura', 'escudo', 'armadura_melhoria', 'escudo_melhoria', 'armadura_natural'];
  ImprimeNaoSinalizado(
      10 + gPersonagem.ca.bonus.Total(array_exclusao),
      span_ca_toque);
  Titulo(
      gPersonagem.ca.bonus.Exporta(array_exclusao),
      span_ca_toque);
  span_ca_toque.textContent = Traduz('Toque') + ': ' + span_ca_toque.textContent;
  span_classe_armadura.appendChild(span_ca_toque);
}

// Atualiza as salvacoes, calculando o bonus base de acordo com a classe e
// modificando pelo atributo relevante.
// TODO fazer outros tipo tb.
function _AtualizaSalvacoes() {
  var div_salvacoes = Dom('div-salvacoes');
  RemoveFilhos(div_salvacoes);
  for (var tipo_salvacao in gPersonagem.salvacoes) {
    var div_salvacao = CriaDiv();
    AdicionaSpanAoDiv(Traduz(tipo_salvacao) + ': ', null, 'salvacao-rotulo', div_salvacao);
    var span_salvacao =
      AdicionaSpanAoDiv(StringSinalizada(gPersonagem.salvacoes[tipo_salvacao].Total()),
                        null, null, div_salvacao);
    Titulo(gPersonagem.salvacoes[tipo_salvacao].Exporta(), span_salvacao);
    div_salvacoes.appendChild(div_salvacao);
  }
}

// Atualiza as habilidades especiais, vindas de classe e raca.
function _AtualizaHabilidadesEspeciais() {
  var dom_especiais = Dom('habilidades-especiais');
  RemoveFilhos(dom_especiais);
  for (var especial in gPersonagem.especiais) {
    _AtualizaHabilidadeEspecial(especial, dom_especiais);
  }
}

function _AtualizaHabilidadeEspecial(chave_especial, dom_especiais) {
  // TODO atualizar de verdade e so adicionar quando preciso.
  var dom_especial = AdicionaHabilidadeEspecial(chave_especial, dom_especiais);
  var usado = gPersonagem.especiais[chave_especial].usado;
  for (var i = 0; i < dom_especial.childNodes.length && usado > 0; ++i) {
    var filho = dom_especial.childNodes[i];
    if (filho.tagName != 'INPUT') {
      continue;
    }
    filho.checked = true;
    --usado;
  }
}

// Atualiza as imunidades do personagem.
function _AtualizaImunidades() {
  var dom_imunidades = Dom('imunidades');
  RemoveFilhos(dom_imunidades);
  gPersonagem.imunidades.forEach(function(imunidade) {
    AdicionaImunidade(imunidade, dom_imunidades);
  });
}

function _AtualizaResistenciaMagia() {
  var dom_resistencias = Dom('resistencia-magia');
  RemoveFilhos(dom_resistencias);
  if (gPersonagem.resistencia_magia.length == 0) {
    dom_resistencias.style.visibility = false;
    return;
  }
  dom_resistencias.style.visibility = true;
  gPersonagem.resistencia_magia.forEach(function(rm) {
    var valor = 'valor' in rm ? rm.valor : PersonagemNivel() + rm.por_nivel;
    AdicionaResistenciaMagia(rm.chave, valor, dom_resistencias);
  });
}

// Atualiza os numeros e listas relacionados a talentos.
function _AtualizaTalentos() {
  // Talentos de classe.
  for (var chave_classe in gPersonagem.talentos) {
    var div_talentos_classe = Dom('div-talentos-' + chave_classe);
    var lista_classe = gPersonagem.talentos[chave_classe];
    var div_selects = Dom('div-talentos-' + chave_classe + '-selects');
    if (lista_classe.length > 0 || chave_classe == 'outros') {
      ImprimeNaoSinalizado(
          lista_classe.length,
          Dom('talentos-' + chave_classe + '-total'));
      for (var i = 0; i < lista_classe.length; ++i) {
        _AtualizaTalento(
            i,  // indice do talento.
            lista_classe[i],
            i < div_selects.childNodes.length ?
                div_selects.childNodes[i] : null,
            chave_classe,
            div_selects);
      }
      // Se tinha mais talentos, tira os que estavam a mais.
      for (var i = 0; div_selects.childNodes.length > lista_classe.length; ++i) {
        RemoveUltimoFilho(div_selects);
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
function _AtualizaTalento(indice_talento, talento_personagem, div_talento, chave_classe, div_pai) {
  if (div_talento == null) {
    div_talento = AdicionaTalento(indice_talento, chave_classe, div_pai);
  }
  // A verificacao de pre-requisitos de talento pode gerar um talento null.
  if (talento_personagem.chave == null || talento_personagem.chave.length == 0) {
    return;
  }
  var talento = tabelas_talentos[talento_personagem.chave];
  for (var i = 0; i < div_talento.childNodes.length; ++i) {
    var filho = div_talento.childNodes[i];
    if (filho.name == 'chave-talento') {
      SelecionaValor(talento_personagem.chave, filho);
    } else if (filho.name == 'complemento-talento') {
      filho.disabled = !('complemento' in talento);
      filho.value = talento_personagem.complemento;
    }
  }
  if (talento.descricao != null && talento.descricao.length > 0) {
    TituloSimples(Traduz(talento.descricao), div_talento);
  }
}

function _AtualizaProficienciaArmas() {
  var span_proficiencia_armas = Dom('span-proficiencia-armas');
  var string_proficiencia = '';
  for (var proficiencia in gPersonagem.proficiencia_armas) {
    string_proficiencia += Traduz(tabelas_armas[proficiencia].nome) + ', ';
  }
  string_proficiencia += '.';
  span_proficiencia_armas.textContent = string_proficiencia.replace(', .', '.');
}

// Escreve todas as pericias e atualiza de acordo com a classe dos personagem.
function _AtualizaPericias() {
  var span_total = Dom('pericias-total-pontos');
  span_total.textContent = gPersonagem.pericias.total_pontos;
  var span_gastos = Dom('pericias-pontos-gastos');
  span_gastos.textContent = gPersonagem.pericias.pontos_gastos;

  for (var chave in gPersonagem.pericias.lista) {
    var dom_pericia = Dom('pericia-' + chave);
    var pericia_personagem = gPersonagem.pericias.lista[chave];
    if (pericia_personagem.de_classe) {
      dom_pericia.className = 'pericia-de-classe';
    } else {
      dom_pericia.className = '';
    }
    var input_complemento = Dom('pericia-' + chave + '-complemento');
    input_complemento.value = pericia_personagem.complemento;
    var input_pontos = Dom('pericia-' + chave + '-pontos');
    input_pontos.value = pericia_personagem.pontos;

    var dom_graduacoes = Dom('pericia-' + chave + '-graduacoes');
    dom_graduacoes.textContent = pericia_personagem.graduacoes;
    var dom_total_bonus = Dom('pericia-' + chave + '-total-bonus');
    dom_total_bonus.textContent = StringSinalizada(pericia_personagem.bonus.Total(), false);
    Titulo(pericia_personagem.bonus.Exporta(), dom_total_bonus);
    var dom_total = Dom('pericia-' + chave + '-total');
    dom_total.textContent = StringSinalizada(pericia_personagem.total);
  }
}

function _AtualizaFeiticos() {
  var div_feiticos = Dom('div-feiticos');
  // Remove os filhos que nao existem mais. Cada classe é um filho.
  var filhos_a_remover = [];
  for (var i = 0; i < div_feiticos.childNodes.length; ++i) {
    var filho = div_feiticos.childNodes[i];
    var remover_filho = true;
    for (var chave_classe in gPersonagem.feiticos) {
      if (!gPersonagem.feiticos[chave_classe].em_uso) {
        continue;
      }
      // Ao carregar por link, o id pode vir null.
      if ((filho.id == null) || filho.id.indexOf(chave_classe) != -1 ) {
        remover_filho = false;
        break;
      }
    }
    if (remover_filho) {
      filhos_a_remover.push(filho);
    }
  }
  filhos_a_remover.forEach(function(filho) {
    RemoveFilho(filho, div_feiticos);
  });

  // Adiciona o esqueleto dos filhos que nao existem ainda.
  var filhos_a_adicionar = [];
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    if (Dom('div-feiticos-' + chave_classe) == null) {
      AdicionaEsqueletoFeiticoParaClasse(chave_classe, div_feiticos);
    }
  }

  // Atualiza os esqueletos dos filhos.
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    // Da classe.
    var div_classe = Dom('div-feiticos-' + chave_classe);
    _AtualizaEscolasProibidas(chave_classe, div_classe);
    _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe);
    _AtualizaSlotsFeiticosParaClasse(chave_classe, div_classe);
  }
}

// Atualiza as escolas proibidas da classe.
function _AtualizaEscolasProibidas(chave_classe, div_classe) {
  var escolas_proibidas_classe = gPersonagem.feiticos[chave_classe].escolas_proibidas || [];
  for (var i = 0; i < escolas_proibidas_classe.length; ++i) {
    Dom('div-escola-proibida-' + chave_classe + '-' + i).value = escolas_proibidas_classe[i];
  }
}

// Atualiza os feiticos conhecidos para uma determinada classe.
// @param novo_div se true, indica que um novo div for criado.
function _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe) {
  var feiticos_classe = gPersonagem.feiticos[chave_classe];
  var tabelas_feiticos_classe = tabelas_feiticos[chave_classe];
  var div_conhecidos = Dom('div-feiticos-conhecidos-' + chave_classe + '-por-nivel');
  AjustaFilhos(
      div_conhecidos,
      feiticos_classe.nivel_maximo + (tabelas_feiticos_classe.possui_nivel_zero ? 1 : 0),  // num filhos.
      AdicionaNivelFeiticoConhecido.bind(
          null,  // this
          chave_classe,
          tabelas_feiticos_classe.precisa_conhecer,
          div_conhecidos));
  // Por nivel.
  for (var nivel_str in feiticos_classe.conhecidos) {
    var nivel = parseInt(nivel_str);
    if (nivel > feiticos_classe.nivel_maximo) {
      break;
    }
    if (nivel == 0 && !tabelas_feiticos[chave_classe].possui_nivel_zero) {
      continue;
    }
    _AtualizaFeiticosConhecidosParaClassePorNivel(
        chave_classe,
        nivel,
        tabelas_feiticos_classe.precisa_conhecer,
        feiticos_classe.conhecidos[nivel]);
  }
}

// Atualiza os feiticos conhecidos para uma classe de um determinado nivel.
// @param feiticos_conhecidos array de feiticos conhecidos para a chave_classe e nivel.
function _AtualizaFeiticosConhecidosParaClassePorNivel(
    chave_classe, nivel, precisa_conhecer, feiticos_conhecidos) {
  // Se não precisa conhecer, o jogador pode adicionar feiticos como se fosse um grimório.
  if (feiticos_conhecidos.length == 0 && precisa_conhecer) {
    return;
  }
  var div_nivel = Dom('div-feiticos-conhecidos-' + chave_classe + '-' + nivel);
  AjustaFilhos(
      div_nivel,
      feiticos_conhecidos.length,
      // A funcao AjustaFilhos fornecera o indice.
      AdicionaFeiticoConhecido.bind(
          null,  // this
          chave_classe,
          nivel));
  for (var indice = 0; indice < feiticos_conhecidos.length; ++indice) {
    // Adiciona os inputs.
    var dom = Dom('input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + indice);
    dom.value = feiticos_conhecidos[indice];
    var feitico_str = StringNormalizada(feiticos_conhecidos[indice]);
    if (feitico_str in tabelas_lista_feiticos_invertida) {
      feitico_str = tabelas_lista_feiticos_invertida[feitico_str];
    }
    if ((feitico_str in tabelas_lista_feiticos_completa) && ('descricao' in tabelas_lista_feiticos_completa[feitico_str])) {
      TituloSimples(tabelas_lista_feiticos_completa[feitico_str].descricao, dom);
    }
  }
}

function _AtualizaSlotsFeiticosParaClasse(chave_classe, div_classe) {
  var feiticos_classe = gPersonagem.feiticos[chave_classe];
  var div_slots = Dom('div-feiticos-slots-' + chave_classe);
  // Remove niveis excedentes.
  var niveis_presentes = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false };
  for (var nivel = (tabelas_feiticos[chave_classe].possui_nivel_zero ? 0 : 1) ; nivel <= feiticos_classe.nivel_maximo; ++nivel) {
    niveis_presentes[nivel] = true;
  }
  for (var nivel in niveis_presentes) {
    var dom = Dom('div-feiticos-slots-' + chave_classe + '-' + nivel);
    if (niveis_presentes[nivel]) {
      if (dom == null) {
        // Adiciona filho.
        div_slots.appendChild(CriaDomSlotsNivel(chave_classe, nivel, feiticos_classe.slots[nivel]));
      }
    } else {
      if (dom != null) {
        RemoveFilho(div_slots, dom);
      }
    }
  }

  // Por nivel.
  // TODO criar o array com niveis a serem removidos e outro com niveis a adicionar.
  // Entao criar uma funcao AdicionarEsqueletoSlotsNivel.
  // or fim, tirar o RemoveFilhos daqui de cima e la embaixo pegar o Dom direto
  // ao inves de criar.
  for (var nivel_str in niveis_presentes) {
    var nivel = parseInt(nivel_str);
    if (!niveis_presentes[nivel]) {
      continue;
    }
    // Monta os feiticos que poderão ser escolhidos no slot.
    var feiticos_conhecidos = {};
    for (var nivel_corrente = nivel; nivel_corrente >= 0; --nivel_corrente) {
      var conhecidos_nivel_corrente = [];
      feiticos_classe.conhecidos[nivel_corrente].forEach(function(texto, indice) {
        conhecidos_nivel_corrente.push(
          { valor: nivel_corrente + '-' + indice, texto: texto });
      });
      feiticos_conhecidos['Nível: ' + nivel_corrente] = conhecidos_nivel_corrente;
    }
    // TODO: metamagicos.

    _AtualizaSlotsFeiticosParaClassePorNivel(
        chave_classe,
        nivel,
        feiticos_classe.slots[nivel],
        feiticos_conhecidos);
  }
}

// Atualiza os slots de feiticos para a classe por nivel.
// @param conhecidos cada entrada: { nivel: [ { valor, texto}, ...] }..
// @param slots do nivel para a clase.
function _AtualizaSlotsFeiticosParaClassePorNivel(chave_classe, nivel, slots, conhecidos) {
  if (slots.feiticos.length == 0) {
    return;
  }
  var precisa_conhecer = tabelas_feiticos[chave_classe].precisa_conhecer;
  var possui_dominio = tabelas_feiticos[chave_classe].possui_dominio;
  var possui_especializacao = 'escola_especializada' in tabelas_feiticos[chave_classe];
  var possui_extra = (nivel > 0 && possui_dominio) || possui_especializacao;
  var div_nivel_slots = Dom('div-feiticos-slots-' + chave_classe + '-' + nivel);
  AjustaFilhos(
      div_nivel_slots,
      slots.feiticos.length + (possui_extra ? 1 : 0),
      AdicionaSlotFeitico.bind(null, div_nivel_slots, !precisa_conhecer, chave_classe, nivel, slots));

  // Atualiza a CD.
  var span = Dom('span-cd-' + chave_classe + '-' + nivel);
  if (span != null) {
    span.textContent = slots.cd;
  }

  // Popula os selects.
  var selects_nivel = DomsPorClasse('feiticos-slots-' + chave_classe + '-' + nivel);
  for (var indice = 0; indice < selects_nivel.length; ++indice) {
    PopulaSelectComOptGroup(conhecidos, selects_nivel[indice]);
  }
  var classe_span = 'span-feiticos-slots-' + chave_classe + '-' + nivel;
  var spans = DomsPorClasse(classe_span);
  for (var i = 0; i < spans.length - (possui_extra ? 1 : 0); ++i) {
    var slot_feitico = slots.feiticos[i];
    if (selects_nivel.length > 0) {
      SelecionaValor(
          slot_feitico.nivel_conhecido + '-' + slot_feitico.indice_conhecido,
          selects_nivel[i]);
    }
    Dom('input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + i).checked = slot_feitico.gasto;
    Dom('label-feiticos-slots-' + chave_classe + '-' + nivel + '-' + i).textContent = '';
    // TODO Gasto.
  }

  if (possui_extra) {
    var ultimo = spans.length - 1;
    var slot_feitico_extra = null;
    var span_label = Dom('label-feiticos-slots-' + chave_classe + '-' + nivel + '-' + ultimo);
    if (nivel > 0 && possui_dominio) {
      span_label.textContent = 'D';
      slot_feitico_extra = slots.feitico_dominio;
    } else if (possui_especializacao) {
      span_label.textContent = 'E';
      slot_feitico_extra = slots.feitico_especializado;
    }
    SelecionaValor(
        slot_feitico_extra.nivel_conhecido + '-' + slot_feitico_extra.indice_conhecido,
        selects_nivel[ultimo]);
    Dom('input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + i).checked = slot_feitico_extra.gasto;
  }
}

function _AtualizaEquipamentos() {
  for (var tipo_moeda in gPersonagem.moedas) {
    Dom('moedas-' + tipo_moeda).value = gPersonagem.moedas[tipo_moeda];
  }
  for (var tipo_item in tabelas_itens) {
    _AtualizaItens(tipo_item);
  }
  Dom('text-area-outros-equipamentos').value =
      gPersonagem.outros_equipamentos;;
}

function _AtualizaItens(tipo_item) {
  var div_pai = Dom('div-equipamentos-' + tipo_item);
  AjustaFilhos(div_pai, gPersonagem[tipo_item].length, function(indice_filho) {
    var div_filho = CriaDiv(null, 'div-' + tipo_item);
    AdicionaItem(tipo_item, div_filho, div_pai);
  });

  var div_filhos = DomsPorClasse('div-' + tipo_item);
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    var div_filho = div_filhos[i];
    _AtualizaItem(gPersonagem[tipo_item][i], div_filho, div_pai);
  }
}

// Atualiza um item.
// @param item do personagem.
function _AtualizaItem(item, div_item, div_itens) {
  for (var i = 0; i < div_item.childNodes.length; ++i) {
    var filho = div_item.childNodes[i];
    if (filho.name == 'item') {
      SelecionaValor(item.chave, filho);
    } else if (filho.name == 'em_uso') {
      filho.checked = item.em_uso;
    }
  }
}

// Atualiza a lista de armas.
function _AtualizaListaArmas() {
  _AtualizaListaArmasArmaduras(
      'armas', Dom('div-equipamentos-armas'), gPersonagem.armas, AdicionaArma);
}

// Atualiza a lista de armaduras.
function _AtualizaListaArmaduras() {
  _AtualizaListaArmasArmaduras(
      'armaduras', Dom('div-equipamentos-armaduras'), gPersonagem.armaduras, AdicionaArmadura);
}

// Atualiza a lista de escudos.
function _AtualizaListaEscudos() {
  _AtualizaListaArmasArmaduras(
      'escudos', Dom('div-equipamentos-escudos'), gPersonagem.escudos, AdicionaEscudo);
}

// Atualiza uma lista de armas ou armaduras.
// @param nome armas ou armaduras, para algumas diferencas.
// @param div pai das armas ou armaduras.
// @param array_personagem array de armas ou armaduras do personagem.
// @param funcao_adicao caso seja necessario adicionar um div novo.
function _AtualizaListaArmasArmaduras(nome, div, array_personagem, funcao_adicao) {
  var filho = div.firstChild;
  // No caso de armas, ignora a primeira (nao deve ser mostrada para evitar
  // problemas de consistencia.
  for (var i = (nome == 'armas') ? 1 : 0; i < array_personagem.length; ++i) {
    var personagem_entrada = array_personagem[i].entrada;
    if (filho == null) {
      // O div nao existe, chama a funcao.
      filho = funcao_adicao();
    }
    _AtualizaArmaArmadura(
        personagem_entrada.chave,
        // Armas nao tem o checkbox, mas em uso eh null.
        personagem_entrada.em_uso,
        personagem_entrada.obra_prima,
        personagem_entrada.bonus,
        filho);
    filho = filho.nextSibling;
  }
}

// Atualiza o div que contem uma arma ou armadura.
// @param chave opcional chave da arma ou armadura sendo adicionada.
// @param obra_prima indica se a arma eh obra_prima.
// @param bonus da arma.
function _AtualizaArmaArmadura(chave, em_uso, obra_prima, bonus, div) {
  var lido = {};
  for (var i = 0; i < div.childNodes.length; ++i) {
    var filho = div.childNodes.item(i);
    if (filho.name == null) {
      continue;
    }
    if (filho.name.indexOf('em-uso') != -1) {
      filho.checked = em_uso;
    } else if (filho.name.indexOf('select-principal') != -1) {
      SelecionaValor(chave, filho);
    } else if (filho.name.indexOf('select-material') != -1) {
      SelecionaValor(chave, filho);
    } else if (filho.name.indexOf('obra-prima') != -1) {
      filho.checked = obra_prima;
    } else if (filho.name.indexOf('bonus-magico') != -1) {
      filho.value = bonus || 0;
    }
  }
}

function _AtualizaNotas() {
  Dom('text-area-notas').value = gPersonagem.notas;
}

function _AtualizaModoVisao() {
  for (var visao in tabelas_visoes) {
    var span_visao = Dom('span-' + visao);
    span_visao.className = gPersonagem.modo_visao == visao ?
        'selecionado': '';
  }
  Dom('input-modo-mestre').checked = gPersonagem.modo_mestre;
  var modo_str = gPersonagem.modo_mestre ? 'inline' : 'none';
  var botoes_geracao = DomsPorClasse('botao-geracao');
  for (var i = 0; i < botoes_geracao.length; ++i) {
    botoes_geracao[i].style.display = modo_str;
  }
  Dom('span-template').style.display = modo_str;
  Dom('div-versao').style.display = modo_str;
}
