// Todas as funcoes de atualizacao dos campos da interface.
// Idealmente, nao deve haver nenhuma referencia a entradas neste arquivo,
// exceto na chamada AtualizaGeral.

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

// AVISO:
// Essa funcao eh bem perigosa. Varios botoes atualizam o personagem mas nao os objetos de entradas.
// Portanto, se essa funcao for chamada nesse intervalo onde personagem e entradas ficam fora de 
// sincronismo, o personagem sera revertido para a versao das entradas (por exemplo, apos gerar um
// personagem, tentar adicionar algo em entradas e chamar essa funcao vai zerar o personagem).
//
// Sempre que for necessaria uma atualizacao sem leitura de entradas, essa funcao sera chamada.
// Eh o caso de elementos criados de forma independente (armas, estilos) que devem ser adicionados
// manualmente a entrada e em seguida chamam essa funcao. As funcoes de carregamento tambem
// devem usar esta funcao, pois a entrada que eh salva.
function AtualizaGeralSemLerEntradas() {
  PersonagemLimpaGeral();
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
  _AtualizaSalvacoes();
  _AtualizaEspeciais();
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
  Dom('nome').value = personagem.nome;
  document.title = personagem.nome.length > 0 ? personagem.nome : 'anonimo';
  SelecionaValor(personagem.raca, Dom('raca'));
  SelecionaValor(personagem.alinhamento, Dom('alinhamento'));
  Dom('pontos-experiencia').value = personagem.experiencia;
  Dom('divindade-patrona').value = personagem.divindade;
}

// Atualiza os dados de vida do personagem de acordo com as classes.
function _AtualizaDadosVida() {
  var span_dados = Dom('dados-vida-classes');
  span_dados.textContent = 
      personagem.dados_vida.nivel_personagem + ' = ' + PersonagemStringDadosVida();
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
  var botoes_atributos = DomsPorClasse('botoes-atributos');
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
  var divs_classes = DomsPorClasse('classe');
  var maior_indice = divs_classes.length > personagem.classes.length ?
      divs_classes.length : personagem.classes.length;
  for (var i = 0; i < maior_indice; ++i) {
    var div_classe = divs_classes[i];
    if (i < personagem.classes.length) {
      if (!div_classe) {
        AdicionaClasse(i, div_classes);
      }
      _AtualizaClasse(
          classes_desabilitadas, personagem.classes[i].classe, 
          personagem.classes[i].nivel, personagem.classes[i].nivel_conjurador, i);
      classes_desabilitadas.push(personagem.classes[i].classe);
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

// Atualiza uma classe.
function _AtualizaClasse(classes_desabilitadas, classe, nivel, nivel_conjurador, indice) {
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
  Dom('nivel-conjurador-' + indice).textContent = nivel_conjurador;
}

// Atualiza o tamanho em funcao da raca.
function _AtualizaTamanho() {
  // Busca o modificador de tamanho da raca.
  ImprimeSinalizado(
      personagem.tamanho.modificador_ataque_defesa,
      DomsPorClasse('tamanho-mod-ataque-defesa'));
  ImprimeSinalizado(
      personagem.tamanho.modificador_agarrar,
      DomsPorClasse('tamanho-mod-agarrar'));
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
        DomsPorClasse(atributo + '-mod-total'));
  }
}

function _AtualizaIniciativa() {
  var span_iniciativa = Dom('iniciativa');
  ImprimeSinalizado(personagem.iniciativa.Total(), span_iniciativa);
  Titulo(personagem.iniciativa.Exporta(), span_iniciativa);
}

// Atualiza os diversos tipos de ataques lendo a classe e os modificadores relevantes. 
function _AtualizaAtaque() {
  ImprimeSinalizado(personagem.bba, DomsPorClasse('bba'));
  ImprimeNaoSinalizado(personagem.numero_ataques, 
                       DomsPorClasse('numero-ataques'));
  // Corpo a corpo.
  var span_bba_cac = Dom('bba-corpo-a-corpo');
  ImprimeSinalizado(personagem.bba_cac, span_bba_cac);
  Titulo(
      [{'bba': personagem.bba}, 
       {'força': personagem.atributos['forca'].modificador}, 
       {'tamanho': personagem.tamanho.modificador_ataque_defesa}], 
      span_bba_cac);

  // Distancia.
  var span_bba_distancia = Dom('bba-distancia');
  ImprimeSinalizado(personagem.bba_distancia, span_bba_distancia);
  Titulo(
      [{'bba': personagem.bba},
       {'destreza': personagem.atributos['destreza'].modificador},
       {'tamanho': personagem.tamanho.modificador_ataque_defesa}],
      span_bba_distancia);

  // Agarrar
  var span_bba_agarrar = Dom('bba-agarrar');
  ImprimeSinalizado(personagem.agarrar, span_bba_agarrar);
  Titulo(
      [{'bba': personagem.bba},
       {'força': personagem.atributos['forca'].modificador}, 
       {'tamanho especial': personagem.tamanho.modificador_agarrar}],
      span_bba_agarrar);

}

// Atualiza a lista de armas de cada estilo.
function _AtualizaEstilosLuta() {
  var dom_estilos = Dom('div-estilos-luta');
  AjustaFilhos(dom_estilos, personagem.estilos_luta.length, function(indice_filho) {
    AdicionaEstiloLuta(personagem.estilos_luta[indice_filho].nome);
  });
  // Atualiza os valores dos estilos. Neste ponto, 
  // dom_filhos.length == personagem.estilos_luta.length.
  var dom_filhos = dom_estilos.childNodes;
  for (var i = 0; i < personagem.estilos_luta.length; ++i) {
    _AtualizaEstilo(dom_filhos[i], personagem.estilos_luta[i]);
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
      10 + personagem.ca.bonus.Total(array_exclusao),
      span_ca_normal);
  Titulo(personagem.ca.bonus.Exporta(array_exclusao), span_ca_normal);
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
      10 + personagem.ca.bonus.Total(array_exclusao),
      span_ca_surpreso);
  Titulo(personagem.ca.bonus.Exporta(array_exclusao), span_ca_surpreso);
  span_classe_armadura.appendChild(span_ca_surpreso);
  span_ca_surpreso.textContent = 'Surpresa: ' + span_ca_surpreso.textContent + ', ';
  // AC toque.
  var span_ca_toque = CriaSpan();
  array_exclusao = 
    ['armadura', 'escudo', 'armadura_melhoria', 'escudo_melhoria', 'armadura_natural'];
  ImprimeNaoSinalizado(
      10 + personagem.ca.bonus.Total(array_exclusao),
      span_ca_toque);
  Titulo(
      personagem.ca.bonus.Exporta(array_exclusao),
      span_ca_toque);
  span_ca_toque.textContent = 'Toque: ' + span_ca_toque.textContent;
  span_classe_armadura.appendChild(span_ca_toque);
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
    var span_salvacao = 
      AdicionaSpanAoDiv(StringSinalizada(personagem.salvacoes[tipo_salvacao].Total()), 
                        null, div_salvacao);
    Titulo(personagem.salvacoes[tipo_salvacao].Exporta(), span_salvacao);
    div_salvacoes.appendChild(div_salvacao);
  }
}

// Atualiza as habilidades especiais, vindas de classe e raca.
function _AtualizaEspeciais() {
  var string_especiais = '';
  for (especial in personagem.especiais) {
    string_especiais += tabelas_especiais[especial].nome;
    var especial_personagem = personagem.especiais[especial];
    if (especial_personagem.vezes > 1) {
      string_especiais += ' (' + especial_personagem.vezes + ')';
    }
    string_especiais += ', ';
  }
  if (string_especiais.length > 0) {
    string_especiais = string_especiais.slice(0, -2);
  }
  Dom('habilidades-especiais').textContent = string_especiais;
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
function _AtualizaTalento(talento_personagem, div_talento, chave_classe, div_pai) {
  if (div_talento == null) {
    div_talento = AdicionaTalento(chave_classe, div_pai);
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
    TituloSimples(talento.descricao, div_talento);
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

// TODO reusar os divs ao inves de apagar tudo e criar de novo.
function _AtualizaFeiticos() {
  var div_feiticos = Dom('div-feiticos');
  // Remove os filhos que nao existem mais.
  var filhos_a_remover = [];
  for (var i = 0; i < div_feiticos.childNodes.length; ++i) {
    var filho = div_feiticos.childNodes[i];
    var remover_filho = true;
    for (var chave_classe in personagem.feiticos) {
      if (!personagem.feiticos[chave_classe].em_uso) {
        continue;
      }
      if (filho.id.indexOf(chave_classe) != -1 ) {
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
  for (var chave_classe in personagem.feiticos) {
    if (!personagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    if (Dom('div-feiticos-' + chave_classe) == null) {
      AdicionaEsqueletoFeiticoParaClasse(chave_classe, div_feiticos);
    }
  }

  // Atualiza os esqueletos dos filhos.
  for (var chave_classe in personagem.feiticos) {
    if (!personagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    // Da classe.
    var div_classe = Dom('div-feiticos-' + chave_classe);
    _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe);
    _AtualizaFeiticosSlotsParaClasse(chave_classe, div_classe);
  }
}

// Atualiza os feiticos conhecidos para uma determinada classe. 
// @param novo_div se true, indica que um novo div for criado.
function _AtualizaFeiticosConhecidosParaClasse(chave_classe, div_classe) {
  var feiticos_classe = personagem.feiticos[chave_classe];
  var div_conhecidos = Dom('div-feiticos-conhecidos-' + chave_classe);
  RemoveFilhos(div_conhecidos);
  // Por nivel.
  for (var nivel in feiticos_classe.conhecidos) {
    if (parseInt(nivel) > feiticos_classe.nivel_maximo) {
      break;
    }
    _AtualizaFeiticosConhecidosParaClassePorNivel(
        chave_classe, nivel, feiticos_classe.conhecidos[nivel], div_conhecidos);
  }
}

// Atualiza os feiticos conhecidos para uma classe de um determinado nivel.
// @param feiticos_conhecidos array de feiticos conhecidos para a chave_classe e nivel.
// @param div_conhecidos div onde os feiticos conhecidos sao colocados.
function _AtualizaFeiticosConhecidosParaClassePorNivel(chave_classe, nivel, feiticos_conhecidos, div_conhecidos) {
  var precisa_conhecer = tabelas_feiticos[chave_classe].precisa_conhecer;
  // Se não precisa conhecer, o jogador pode adicionar feiticos como se fosse um grimório.
  if (feiticos_conhecidos.length == 0 && precisa_conhecer) {
    return;
  }
  var div_nivel = CriaDiv('div-feiticos-conhecidos-' + chave_classe + '-' + nivel);
  div_nivel.appendChild(CriaSpan('Nível ' + nivel + ':')); 
  if (!precisa_conhecer) {
    div_nivel.appendChild(CriaBotao('+', null, null, function() {
      feiticos_conhecidos.push('');
      AtualizaGeralSemConverterEntradas();
    }));
  }

  div_nivel.appendChild(CriaBr());
  for (var indice = 0; indice < feiticos_conhecidos.length; ++indice) {
    // Adiciona os inputs.
    div_nivel.appendChild(CriaInputTexto(
        feiticos_conhecidos[indice],
        'input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + indice, 
        'feiticos-conhecidos',
        AtualizaGeral));
    if (!precisa_conhecer) {
      div_nivel.appendChild(CriaBotao('-', null, null, {
        indice_remocao: indice,
        feiticos_conhecidos: feiticos_conhecidos,
        handleEvent: function () {
          this.feiticos_conhecidos.splice(this.indice_remocao, 1);
          AtualizaGeralSemConverterEntradas();
        }
      }));
    }
    div_nivel.appendChild(CriaBr());
  }
  div_conhecidos.appendChild(div_nivel);
}

function _AtualizaFeiticosSlotsParaClasse(chave_classe, div_classe) {
  var div_slots = Dom('div-feiticos-slots-' + chave_classe);
  RemoveFilhos(div_slots);
  // Por nivel.
  var feiticos_classe = personagem.feiticos[chave_classe];
  for (var nivel in feiticos_classe.slots) {
    _AtualizaFeiticosSlotsParaClassePorNivel(
        chave_classe, 
        nivel, 
        feiticos_classe.slots[nivel], 
        feiticos_classe.conhecidos[nivel], 
        div_slots);
  }
}

// Atualiza os slots de feiticos para a classe por nivel.
// @param conhecidos array de feiticos conhecidos.
function _AtualizaFeiticosSlotsParaClassePorNivel(chave_classe, nivel, slots, conhecidos, div_slots) {
  if (slots.feiticos.length == 0) {
    return;
  }
  var precisa_conhecer = tabelas_feiticos[chave_classe].precisa_conhecer;
  var div_nivel = CriaDiv('div-feiticos-slots-' + chave_classe + '-' + nivel);
  div_nivel.appendChild(
      CriaSpan('Nível ' + nivel + ' (CD ' + slots.cd + '):'));
  div_nivel.appendChild(CriaBr());
  // Popula as possibilidades de feitico para o nivel.
  // TODO
  var valores_select = [];
  conhecidos.forEach(function(nome_feitico, indice) {
    var entrada = {};
    entrada[indice] = nome_feitico;
    valores_select.push(entrada);
  });
  for (var indice = 0; indice < slots.feiticos.length; ++indice) {
    // Adiciona os inputs de indices.
    if (!precisa_conhecer) {
      var select = CriaSelect(
          'input-feiticos-slots-' + chave_classe + '-' + nivel + '-' + indice, 
          'feiticos-slots',
          AtualizaGeral);
      PopulaSelect(valores_select, select);
      SelecionaValor(slots.feiticos[indice].indice_conhecido, select);
      div_nivel.appendChild(select);
    }
    div_nivel.appendChild(CriaInputCheckbox(
        slots.feiticos[indice].gasto,
        'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + indice, 
        'feiticos-slots-gastos',
        ClickGastarFeitico));
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
  if (slots.feitico_dominio != null) {
    div_nivel.appendChild(CriaSpan('D:'));
    var select = CriaSelect(
        'input-feiticos-slots-' + chave_classe + '-' + nivel + '-dom',
        'feiticos-slots',
        AtualizaGeral);
    PopulaSelect(valores_select, select);
    SelecionaValor(slots.feitico_dominio.indice_conhecido, select);
    div_nivel.appendChild(select);
    div_nivel.appendChild(CriaInputCheckbox(
        slots.feitico_dominio.gasto,
        'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-dom', 
        'feiticos-slots-gastos'));
    div_nivel.appendChild(CriaBr());
  }
  div_slots.appendChild(div_nivel);
}

function _AtualizaEquipamentos() {
  for (var tipo_moeda in personagem.moedas) {
    Dom('moedas-' + tipo_moeda).value = personagem.moedas[tipo_moeda];
  }
  for (var tipo_item in tabelas_itens) {
    _AtualizaItens(tipo_item);
  }
  Dom('text-area-outros-equipamentos').value =
      personagem.outros_equipamentos;;
}

function _AtualizaItens(tipo_item) {
  var div_pai = Dom('div-equipamentos-' + tipo_item);
  AjustaFilhos(div_pai, personagem[tipo_item].length, function(indice_filho) {
    var div_filho = CriaDiv(null, 'div-' + tipo_item);
    AdicionaItem(tipo_item, div_filho, div_pai);
  });

  var div_filhos = DomsPorClasse('div-' + tipo_item);
  for (var i = 0; i < personagem[tipo_item].length; ++i) {
    var div_filho = div_filhos[i];
    _AtualizaItem(personagem[tipo_item][i], div_filho, div_pai);
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
      'armas', Dom('div-equipamentos-armas'), personagem.armas, AdicionaArma);
}

// Atualiza a lista de armaduras.
function _AtualizaListaArmaduras() {
  _AtualizaListaArmasArmaduras(
      'armaduras', Dom('div-equipamentos-armaduras'), personagem.armaduras, AdicionaArmadura);
}

// Atualiza a lista de escudos.
function _AtualizaListaEscudos() {
  _AtualizaListaArmasArmaduras(
      'escudos', Dom('div-equipamentos-escudos'), personagem.escudos, AdicionaEscudo);
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
  Dom('text-area-notas').value = personagem.notas;
}

function _AtualizaModoVisao() {
  for (var visao in tabelas_visoes) {
    var span_visao = Dom('span-' + visao);
    span_visao.className = personagem.modo_visao == visao ?
        'selecionado': '';
  }
  Dom('input-modo-mestre').checked = personagem.modo_mestre;
  var botoes_geracao = DomsPorClasse('botao-geracao');
  for (var i = 0; i < botoes_geracao.length; ++i) {
    botoes_geracao[i].style.display = personagem.modo_mestre ? 'inline' : 'none';
  }
}

