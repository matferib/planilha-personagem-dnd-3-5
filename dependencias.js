// Este arquivo nao deve ter nenhuma referencia ao objeto entradas. A unica funcao exportada
// calcula todas as dependencias das entradas ja convertidas. Como durante a conversao nem sempre
// eh possivel podar os valores, as verificacoes de consistencia devem ser feitas aqui ao inves
// do arquivo converte.

function DependenciasGerais() {
  _DependenciasNivelConjurador();
  _DependenciasEquipamentos();
  _DependenciasDadosVida();
  _DependenciasAtributos();
  _DependenciasTalentos();
  _DependenciasPontosVida();
  _DependenciasIniciativa();
  _DependenciasTamanho();
  _DependenciasBba();
  _DependenciasProficienciaArmas();
  _DependenciasEspeciais();

  // So pode fazer aqui, pois os pre requisitos dependem de atributos, classes,
  // talentos, proficiencias...
  // TODO se essa funcao falhar, potencialmente o personagem tera que ser recarregado.
  _VerificaPrerequisitosTalento();

  _DependenciasPericias();
  _DependenciasFocoArmas();
  _DependenciasEspecializacaoArmas();
  _DependenciasArmadurasEscudos();
  _DependenciasArmas();
  _DependenciasEstilos();
  _DependenciasSalvacoes();
  _DependenciasFeiticos();
}

// Calcula a classe de conjurador para cada classe de personagem.
function _DependenciasNivelConjurador() {
  gPersonagem.classes.forEach(function(entrada_classe) {
    var classe_tabela = tabelas_classes[entrada_classe.classe];
    if (classe_tabela.nivel_conjurador == null) {
      entrada_classe.nivel_conjurador = 0;
      return;
    }
    var nivel_minimo = classe_tabela.nivel_conjurador.minimo || 0;
    if (entrada_classe.nivel < nivel_minimo) {
      entrada_classe.nivel_conjurador = 0;
      return;
    }
    var modificador_nivel_conjurador = classe_tabela.nivel_conjurador.modificador || 0;
    entrada_classe.nivel_conjurador = Math.floor(entrada_classe.nivel * modificador_nivel_conjurador);
  });
}

function _DependenciasEquipamentos() {
  // TODO usar tabelas_itens aqui?
  var tipos_itens = [ 'aneis', 'amuletos', 'capas' ];
  for (var i = 0; i < tipos_itens.length; ++i) {
    _DependenciasItens(tipos_itens[i]);
  }
}

function _DependenciasItens(tipo_item) {
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    var item = gPersonagem[tipo_item][i];
    if (!item.em_uso) {
      continue;
    }
    _DependenciasItem(item.chave, tabelas_itens[tipo_item].tabela[item.chave]);
  }
}

// Calcula as dependencias do item.
// @param chave_item a chave do item.
// @param item_tabela o item na tabela apropriada.
function _DependenciasItem(chave_item, item_tabela) {
  for (var propriedade in item_tabela.propriedades) {
    if (propriedade == 'ca') {
      _DependenciasItemCa(chave_item, item_tabela);
    } else if (propriedade == 'pericias') {
      _DependenciasItemPericias(chave_item, item_tabela);
    } else if (propriedade == 'salvacoes') {
      _DependenciasItemSalvacoes(chave_item, item_tabela);
    } else if (propriedade == 'atributos') {
      _DependenciasItemAtributos(chave_item, item_tabela);
    }
  }
}

// Item que afeta as salvacoes (resistencias).
function _DependenciasItemSalvacoes(chave_item, item_tabela) {
  if ('todas' in item_tabela.propriedades.salvacoes) {
    for (var chave_personagem in gPersonagem.salvacoes) {
      gPersonagem.salvacoes[chave_personagem].Adiciona(
          'resistencia', chave_item, item_tabela.propriedades.salvacoes['todas']);
    }
    return;
  }
  for (var chave_salvacao in item_tabela.propriedades.salvacoes) {
    gPersonagem.salvacoes[chave_salvacao].Adiciona(
        'resistencia', chave_item, item_tabela.propriedades.salvacoes[chave_salvacao]);
  }
}

// Item que afeta atributos.
function _DependenciasItemAtributos(chave_item, item_tabela) {
  for (var chave_atributo in item_tabela.propriedades.atributos) {
    //gPersonagem.atributos[chave_atributo].Adiciona(
    //    'melhoria', chave_item, item_tabela.propriedades.atributos[chave_atributo]);
  }
}

// Item que afeta a classe de armadura.
function _DependenciasItemCa(chave_item, item_tabela) {
  for (var chave_ca in item_tabela.propriedades.ca) {
    gPersonagem.ca.bonus.Adiciona(
        chave_ca, chave_item, item_tabela.propriedades.ca[chave_ca]);
  }
}

// Item que afeta pericias.
function _DependenciasItemPericias(chave_item, item_tabela) {
  for (var chave_pericia in item_tabela.propriedades.pericias) {
    for (var chave_bonus in item_tabela.propriedades.pericias[chave_pericia]) {
      gPersonagem.pericias.lista[chave_pericia].bonus.Adiciona(
          chave_bonus, chave_item, item_tabela.propriedades.pericias[chave_pericia][chave_bonus]);
    }
  }
}

function _DependenciasDadosVida() {
}

function _DependenciasAtributos() {
  // Bonus de atributos de acordo com nivel total de gPersonagem.
  var nivel_total = gPersonagem.dados_vida.nivel_personagem;
  gPersonagem.atributos.pontos.disponiveis =
     Math.floor(nivel_total / 4);
  if (gPersonagem.atributos.pontos.gastos.length >
      gPersonagem.atributos.pontos.disponiveis) {
    // Pode acontecer com retirada ou diminuicao de niveis.
    gPersonagem.atributos.pontos.gastos.length =
        gPersonagem.atributos.pontos.disponiveis;
  }

  // Calcula o componentes dos atributos.
  for (var atributo in tabelas_atributos) {
    gPersonagem.atributos[atributo].bonus_nivel = 0;
    gPersonagem.atributos[atributo].racial =
        tabelas_raca[gPersonagem.raca].atributos[atributo] || 0;
  }
  // Calcula os bonus de nivel para cada atributo.
  for (var i = 0; i < gPersonagem.atributos.pontos.gastos.length; ++i) {
    ++gPersonagem.atributos[gPersonagem.atributos.pontos.gastos[i]].bonus_nivel;
  }
  // Valor final e modificador.
  for (var atributo in gPersonagem.atributos) {
    gPersonagem.atributos[atributo].valor =
        gPersonagem.atributos[atributo].base +
        gPersonagem.atributos[atributo].bonus_nivel +
        gPersonagem.atributos[atributo].racial;
    gPersonagem.atributos[atributo].modificador =
        modificador_atributo(gPersonagem.atributos[atributo].valor);
  }
}

function _DependenciasTalentos() {
  // Gerais.
  var talentos_gerais_por_nivel =
      1 + Math.floor(gPersonagem.dados_vida.nivel_personagem / 3);
  if (tabelas_raca[gPersonagem.raca].talento_extra) {
    ++talentos_gerais_por_nivel;
  }
  gPersonagem.talentos['gerais'].length = talentos_gerais_por_nivel;
  // Guerreiro.
  var nivel_guerreiro = PersonagemNivelClasse('guerreiro');
  if (nivel_guerreiro > 0) {
    gPersonagem.talentos['guerreiro'].length = 1 + Math.floor(nivel_guerreiro / 2);
  } else {
    gPersonagem.talentos['guerreiro'].length = 0;
  }

  // Calcula o impacto dos talentos no resto.
  for (var chave_classe in gPersonagem.talentos) {
    for (var i = 0; i < gPersonagem.talentos[chave_classe].length; ++i) {
      if (gPersonagem.talentos[chave_classe][i] != null) {
        _DependenciasTalento(gPersonagem.talentos[chave_classe][i]);
      } else {
        gPersonagem.talentos[chave_classe][i] = { chave: '', complemento: '' };
      }
    }
  }
}

// @param indice necessario para geracao de subtipos unicos.
function _DependenciasTalento(talento_personagem, indice) {
  var chave_talento = talento_personagem.chave;
  var talento = tabelas_talentos[chave_talento];
  if (talento == null) {
    return;
  }
  var bonus_pericias = talento.bonus_pericias;
  for (var chave_pericia in bonus_pericias) {
    gPersonagem.pericias.lista[chave_pericia].bonus.Adiciona(
        'talento', chave_talento, bonus_pericias[chave_pericia]);
  }
  // Caso o talento seja cumulativo, a chave deve ser unica pro bonus acumular.
  var subchave_bonus = talento.cumulativo ?
      chave_talento + '-' + indice : chave_talento;
  if ('bonus_iniciativa' in talento) {
    gPersonagem.iniciativa.Adiciona(
        'talento', subchave_bonus, talento.bonus_iniciativa);
  }
  if ('bonus_pv' in talento) {
    gPersonagem.pontos_vida.bonus.Adiciona(
        'talento', subchave_bonus, talento.bonus_pv);
  }
  if ('bonus_salvacao' in talento) {
    for (var tipo_salvacao in talento['bonus_salvacao']) {
      gPersonagem.salvacoes[tipo_salvacao].Adiciona(
          'talento', subchave_bonus, talento.bonus_salvacao[tipo_salvacao]);
    }
  }
}

function _DependenciasPontosVida() {
  gPersonagem.pontos_vida.bonus.Adiciona(
      'atributo', 'constituicao',
      gPersonagem.dados_vida.nivel_personagem * gPersonagem.atributos['constituicao'].modificador);
  gPersonagem.pontos_vida.bonus.Adiciona(
      'niveis_negativos', '-', -5 * gPersonagem.niveis_negativos);
  gPersonagem.pontos_vida.total =
      gPersonagem.pontos_vida.total_dados + gPersonagem.pontos_vida.bonus.Total();
}

function _DependenciasIniciativa() {
  gPersonagem.iniciativa.Adiciona(
      'atributo', 'destreza', gPersonagem.atributos['destreza'].modificador);
}

function _DependenciasTamanho() {
  gPersonagem.tamanho.modificador_ataque_defesa =
      tabelas_tamanho[gPersonagem.tamanho.categoria].ataque_defesa;
  gPersonagem.tamanho.modificador_agarrar =
      tabelas_tamanho[gPersonagem.tamanho.categoria].agarrar;
}

function _DependenciasBba() {
  gPersonagem.bba = 0;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    gPersonagem.bba +=
        tabelas_classes[gPersonagem.classes[i].classe].bba(gPersonagem.classes[i].nivel);
  }
  gPersonagem.bba -= gPersonagem.niveis_negativos;
  gPersonagem.bba_cac =
      gPersonagem.bba + gPersonagem.atributos['forca'].modificador +
      gPersonagem.tamanho.modificador_ataque_defesa;
  gPersonagem.bba_cac_acuidade =
      gPersonagem.bba + gPersonagem.atributos['destreza'].modificador +
      gPersonagem.tamanho.modificador_ataque_defesa;
  // Por enquanto, nao encontrei nenhum caso que seja diferente de acuidade e distancia.
  gPersonagem.bba_distancia = gPersonagem.bba_cac_acuidade;
  gPersonagem.numero_ataques = Math.floor((gPersonagem.bba - 1) / 5) + 1;
  gPersonagem.agarrar =
      gPersonagem.bba +
      gPersonagem.atributos['forca'].modificador +
      gPersonagem.tamanho.modificador_agarrar;
}

// Converte a proficiencia em armas do personagem.
function _DependenciasProficienciaArmas() {
  var todas_simples = false;
  var todas_comuns = false;
  gPersonagem.proficiencia_armas = {};
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var nome_classe = gPersonagem.classes[i].classe;
    var armas_classe = tabelas_proficiencia_arma_por_classe[nome_classe].armas;
    for (var j = 0; armas_classe != null && j < armas_classe.length; ++j) {
      gPersonagem.proficiencia_armas[armas_classe[j]] = true;
    }
    var talentos_classe = tabelas_proficiencia_arma_por_classe[nome_classe].talentos;
    for (var j = 0; talentos_classe != null && j < talentos_classe.length; ++j) {
      if (talentos_classe[j] == 'usar_armas_simples') {
        todas_simples = true;
      } else if (talentos_classe[j] == 'usar_armas_comuns') {
        todas_comuns = true;
      }
    }
  }
  if (todas_simples) {
    for (var arma in tabelas_armas_simples) {
      gPersonagem.proficiencia_armas[arma] = true;
    }
  }
  if (todas_comuns) {
    for (var arma in tabelas_armas_comuns) {
      gPersonagem.proficiencia_armas[arma] = true;
    }
    // Familiaridade.
    for (var arma in tabelas_raca[gPersonagem.raca].familiaridade_arma) {
      gPersonagem.proficiencia_armas[arma] = true;
    }
  }
  // Raciais.
  var armas_raca = tabelas_raca[gPersonagem.raca].proficiencia_armas;
  for (var i = 0; armas_raca != null && i < armas_raca.length; ++i) {
    gPersonagem.proficiencia_armas[armas_raca[i]] = true;
  }

  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in gPersonagem.talentos) {
    var lista_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_classe.length; ++i) {
      var talento = lista_classe[i];
      if ((talento.chave == 'usar_arma_comum' ||
           talento.chave == 'usar_arma_exotica') &&
          (talento.complemento != null) &&
          talento.complemento.length > 0) {
        var chave_arma = tabelas_armas_invertida[talento.complemento];
        // TODO remover essa verificacao quando o input dos talentos estiver
        // terminado.
        if (chave_arma == null) {
          Mensagem('Arma "' + talento.complemento + '" inválida para talento "' +
                tabelas_talentos[talento.chave].nome + '"');
          continue;
        }
        var arma_tabela = tabelas_armas[chave_arma];
        if (arma_tabela.talento_relacionado != talento.chave) {
          // verifica familiaridade.
          var familiar = false;
          if (arma_tabela.talento_relacionado == 'usar_arma_exotica' &&
              tabelas_raca[gPersonagem.raca].familiaridade_arma &&
              tabelas_raca[gPersonagem.raca].familiaridade_arma[chave_arma] &&
              talento.chave == 'usar_arma_comum') {
            familiar = true;
          }
          if (!familiar) {
            Mensagem('Arma "' + talento.complemento +
                  '" inválida para talento "' +
                  tabelas_talentos[talento.chave].nome + '"');
            continue;
          }
        }
        gPersonagem.proficiencia_armas[chave_arma] = true;
      }
    }
  }
}

// Habilidades especiais do gPersonagem.
function _DependenciasEspeciais() {
  gPersonagem.especiais = {};
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var entrada_classe = gPersonagem.classes[i];
    if (tabelas_classes[entrada_classe.classe].especiais == null) {
      continue;
    }
    var especiais_classe = tabelas_classes[entrada_classe.classe].especiais;
    for (var nivel = 1; nivel <= entrada_classe.nivel; ++nivel) {
      var especiais_nivel = especiais_classe[nivel];
      if (especiais_nivel == null) {
        continue;
      }
      for (var j = 0; j < especiais_nivel.length; ++j) {
        var especial = especiais_nivel[j];
        // Alguns especiais sao tratados de forma diferente.
        if (especial == 'expulsar_fascinar_mortos_vivos') {
          var num_expulsoes = 3 + gPersonagem.atributos['carisma'].modificador +
            (PersonagemPossuiTalento('expulsao_adicional') ? 4 : 0);
          gPersonagem.especiais[especial] = { vezes: num_expulsoes };
        } else {
          if (!(especial in gPersonagem.especiais)) {
            gPersonagem.especiais[especial] = { vezes: 1 };
          } else {
            ++gPersonagem.especiais[especial].vezes;
          }
        }
      }
    }
  }
}

function _VerificaPrerequisitosTalento() {
  for (var chave_classe in gPersonagem.talentos) {
    var lista_talentos_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_talentos_classe.length; ++i) {
      var talento = lista_talentos_classe[i];
      if (tabelas_talentos[talento.chave] == null) {
        continue;
      }
      if (tabelas_talentos[talento.chave].complemento &&
          talento.complemento &&
          !_VerificaTipoComplementoTalento(talento)) {
        talento.complemento = null;
      }
      var erro = PersonagemVerificaPrerequisitosTalento(talento.chave, talento.complemento);
      if (erro != null) {
        talento.complemento = null;
        talento.chave = 'usar_armas_simples';
        Mensagem(erro);
      }
    }
  }
}

// @return true se o complemento for do tipo correto.
function _VerificaTipoComplementoTalento(talento) {
  var talento_tabela = tabelas_talentos[talento.chave];
  if (talento_tabela.complemento.indexOf('arma') != -1) {
    var chave_arma = tabelas_armas_invertida[talento.complemento];
    if (chave_arma == null) {
      return false;
    }
    if (talento_tabela.complemento == 'arma_leve') {
      return tabelas_armas[chave_arma].categorias['cac_leve'] != null;
    } else if (talento_tabela.complemento == 'arma_comum') {
      return tabelas_armas_comuns[chave_arma] != null;
    } else if (talento_tabela.complemento == 'arma_exotica') {
      return tabelas_armas_exoticas[chave_arma] != null;
    }
  }
  return true;
}

function _DependenciasPericias() {
  gPersonagem.pericias.total_pontos = 0;
  var primeiro_nivel = true;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var nivel = gPersonagem.classes[i].nivel;
    var pontos_classe = tabelas_classes[gPersonagem.classes[i].classe].pontos_pericia;
    var pontos_raca = tabelas_raca[gPersonagem.raca].pontos_pericia || 0;
    var pontos_inteligencia = gPersonagem.atributos.inteligencia.modificador;

    // Se o primeiro nivel estiver neste pacote de niveis, ele conta como 3 niveis a mais.
    var pontos_iteracao = 0;
    if (primeiro_nivel) {
      nivel += 3;
      primeiro_nivel = false;
    }
    gPersonagem.pericias.total_pontos +=
        Math.max(pontos_classe + pontos_raca + pontos_inteligencia, 1) * nivel;
  }

  var max_pontos = gPersonagem.dados_vida.nivel_personagem + 3;
  gPersonagem.pericias.pontos_gastos = 0;
  for (var chave_pericia in gPersonagem.pericias.lista) {
    var pericia = tabelas_pericias[chave_pericia];
    var pericia_personagem = gPersonagem.pericias.lista[chave_pericia];
    pericia_personagem.de_classe = PersonagemPossuiUmaDasClasses(pericia.classes);
    pericia_personagem.pontos = Math.min(pericia_personagem.pontos, max_pontos);
    pericia_personagem.graduacoes = pericia_personagem.de_classe ?
        pericia_personagem.pontos : Math.floor(pericia_personagem.pontos / 2);
    pericia_personagem.bonus.Adiciona(
        'atributo', pericia.habilidade, gPersonagem.atributos[pericia.habilidade].modificador);
    // TODO isso aqui deve ta quebrado.
    // soma todos os bonus de talentos.
    for (var chave_talento in pericia_personagem.bonus_talentos) {
      pericia_personagem.bonus.Adiciona(
          'talento', chave_talento, pericia_personagem.bonus_talentos[chave_talento]);
    }
    // soma todos os bonus raciais.
    var bonus_racial_total = 0;
    gPersonagem.pericias.lista[chave_pericia].bonus_racial = 0;
    var raca_personagem = tabelas_raca[gPersonagem.raca];
    if (raca_personagem.bonus_pericias &&
        raca_personagem.bonus_pericias[chave_pericia] != null) {
      pericia_personagem.bonus.Adiciona(
          'racial', gPersonagem.raca, raca_personagem.bonus_pericias[chave_pericia]);
    }
    // template (tambem eh racial).
    var template_personagem = PersonagemTemplate();
    if (template_personagem != null) {
      if (template_personagem.bonus_pericias &&
          template_personagem.bonus_pericias[chave_pericia] != null) {
        pericia_personagem.bonus.Adiciona(
            'racial', gPersonagem.template, template_personagem.bonus_pericias[chave_pericia]);
      }
    }

    // Nivel negativo:
    if (gPersonagem.niveis_negativos > 0) {
      pericia_personagem.bonus.Adiciona(
          'niveis_negativos', '-', -gPersonagem.niveis_negativos);
    }

    pericia_personagem.total =
        pericia_personagem.graduacoes + pericia_personagem.bonus.Total();
    gPersonagem.pericias.pontos_gastos += pericia_personagem.pontos;
  }
}

function _DependenciasFocoArmas() {
  gPersonagem.foco_armas = {};
  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in gPersonagem.talentos) {
    var lista_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_classe.length; ++i) {
      var talento = lista_classe[i];
      if (talento.chave && talento.chave.indexOf('foco_em_arma') != -1 &&
          talento.complemento != null) {
        var chave_arma = tabelas_armas_invertida[talento.complemento];
        if (chave_arma == null) {
          Mensagem('Arma "' + talento.complemento + '" inválida para talento "' +
                tabelas_talentos[talento.chave].nome + '"');
          continue;
        }
        gPersonagem.foco_armas[chave_arma] = talento.chave.indexOf('_maior') == -1 ? 1 : 2;
      }
    }
  }
}

function _DependenciasEspecializacaoArmas() {
  gPersonagem.especializacao_armas = {};
  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in gPersonagem.talentos) {
    var lista_classe = gPersonagem.talentos[chave_classe];
    for (var i = 0; i < lista_classe.length; ++i) {
      var talento = lista_classe[i];
      if (talento.chave && talento.chave.indexOf('especializacao_arma') != -1 &&
          talento.complemento != null) {
        var chave_arma = tabelas_armas_invertida[talento.complemento];
        if (chave_arma == null) {
          Mensagem('Arma "' + talento.complemento + '" inválida para talento "' +
                tabelas_talentos[talento.chave].nome + '"');
          continue;
        }
        gPersonagem.especializacao_armas[chave_arma] = talento.chave.indexOf('_maior') == -1 ? 2 : 4;
      }
    }
  }
}

// Dependencias de armaduras e escudos.
function _DependenciasArmadurasEscudos() {
  gPersonagem.armadura = null;
  for (var i = 0; i < gPersonagem.armaduras.length; ++i) {
    if (gPersonagem.armaduras[i].entrada.em_uso) {
      gPersonagem.armadura = gPersonagem.armaduras[i];
      break;
    }
  }

  gPersonagem.escudo = null;
  for (var i = 0; i < gPersonagem.escudos.length; ++i) {
    if (gPersonagem.escudos[i].entrada.em_uso) {
      gPersonagem.escudo = gPersonagem.escudos[i];
      break;
    }
  }

  var bonus_ca = gPersonagem.ca.bonus;
  if (gPersonagem.armadura != null) {
    bonus_ca.Adiciona(
        'armadura', 'armadura', tabelas_armaduras[gPersonagem.armadura.entrada.chave].bonus);
    bonus_ca.Adiciona(
        'armadura_melhoria', 'armadura', gPersonagem.armadura.entrada.bonus);
  }
  if (gPersonagem.escudo != null) {
    bonus_ca.Adiciona(
        'escudo', 'escudo', tabelas_escudos[gPersonagem.escudo.entrada.chave].bonus);
    bonus_ca.Adiciona(
        'escudo_melhoria', 'escudo', gPersonagem.escudo.entrada.bonus);
  }
  bonus_ca.Adiciona(
      'atributo', 'destreza', gPersonagem.atributos.destreza.modificador);
  bonus_ca.Adiciona(
      'tamanho', 'tamanho', gPersonagem.tamanho.modificador_ataque_defesa);
  // Pode adicionar as armaduras naturais aqui que elas nao se acumulam.
  bonus_ca.Adiciona(
      'armadura_natural', 'racial', tabelas_raca[gPersonagem.raca].armadura_natural || 0);
  var template_personagem = PersonagemTemplate();
  if (template_personagem != null) {
    bonus_ca.Adiciona(
        'armadura_natural', 'template', template_personagem.armadura_natural || 0);
  }
}

function _DependenciasArmas() {
  for (var i = 0; i < gPersonagem.armas.length; ++i) {
    _DependenciasArma(gPersonagem.armas[i]);
  }
}

// TODO testar essa funcao.
function _DependenciasArma(arma_personagem) {
  var arma_entrada = arma_personagem.entrada;
  var arma_tabela =
      arma_personagem.arma_tabela = tabelas_armas[arma_entrada.chave];
  arma_personagem.nome_gerado = arma_tabela.nome;
  if (arma_entrada.material && arma_entrada.material != 'nenhum') {
    arma_personagem.nome_gerado +=
        ' (' + tabelas_materiais_especiais[arma_entrada.material].nome + ')';
  }
  if (arma_entrada.bonus > 0) {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = arma_entrada.bonus;
    arma_personagem.nome_gerado += ' +' + arma_personagem.bonus_ataque;
  } else if (arma_entrada.obra_prima) {
    arma_personagem.bonus_ataque = 1;
    arma_personagem.bonus_dano = 0;
    arma_personagem.nome_gerado += ' OP';
  } else {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = 0;
  }
  arma_personagem.proficiente = PersonagemProficienteComArma(
      arma_entrada.chave);
  arma_personagem.foco = PersonagemFocoComArma(arma_entrada.chave);
  arma_personagem.especializado = PersonagemEspecializacaoComArma(arma_entrada.chave);
  arma_personagem.acuidade = PersonagemPossuiTalento(
      'acuidade_arma', arma_entrada.chave);
}

function _DependenciasEstilos() {
  for (var i = 0; i < gPersonagem.estilos_luta.length; ++i) {
    _DependenciasEstilo(gPersonagem.estilos_luta[i]);
  }
}

// TODO merece um teste.
function _DependenciasEstilo(estilo_personagem) {
  var arma_primaria = ArmaPersonagem(estilo_personagem.arma_primaria.nome);
  if (arma_primaria == null) {
    estilo_personagem.arma_primaria.nome = 'desarmado';
    arma_primaria = ArmaPersonagem(estilo_personagem.arma_primaria.nome);
  }
  var arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);
  if (arma_secundaria == null) {
    estilo_personagem.arma_secundaria.nome = 'desarmado';
    arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);
  }

  if (estilo_personagem.nome == 'arma_dupla' &&
      (arma_primaria == null || !arma_primaria.arma_tabela.arma_dupla)) {
    Mensagem('Arma "' + estilo_personagem.arma_primaria.nome + '" não é dupla.');
    estilo_personagem.nome = 'uma_arma';
  }

  if ('cac_duas_maos' in arma_primaria.arma_tabela.categorias &&
      estilo_personagem.nome != 'uma_arma') {
    Mensagem('Arma "' + estilo_personagem.arma_primaria.nome + '" requer duas mãos.');
    estilo_personagem.nome = 'uma_arma';
  }

  // Se o estilo eh duplo, forca segunda arma ser igual a primeira.
  if (estilo_personagem.nome == 'arma_dupla') {
    estilo_personagem.arma_secundaria.nome = estilo_personagem.arma_primaria.nome;
    arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);
  }

  // Atualiza cada categoria da arma no estilo.
  var secundaria_leve = false;
  for (var categoria in arma_secundaria.arma_tabela.categorias) {
    secundaria_leve =
        (estilo_personagem.nome == 'duas_armas' && categoria.indexOf('leve') != -1) ||
         estilo_personagem.nome == 'arma_dupla';
  }

  for (var categoria in arma_primaria.arma_tabela.categorias) {
    estilo_personagem.arma_primaria.bonus_por_categoria[categoria] =
        _DependenciasBonusPorCategoria(
            categoria, arma_primaria, estilo_personagem, true, secundaria_leve);
  }
  if (estilo_personagem.nome == 'duas_armas' || estilo_personagem.nome == 'arma_dupla') {
    for (var categoria in arma_secundaria.arma_tabela.categorias) {
        estilo_personagem.arma_secundaria.bonus_por_categoria[categoria] =
            _DependenciasBonusPorCategoria(
                categoria, arma_secundaria, estilo_personagem, false, secundaria_leve);
    }
  }
}

// Calcula as dependencias dos bonus de ataque e dano para a categoria passada.
// @param categoria o nome da categoria da arma.
// @param arma_personagem a arma do gPersonagem.
// @param primaria se true, indica se a arma eh primaria.
function _DependenciasBonusPorCategoria(
    categoria, arma_personagem, estilo, primaria, secundaria_leve) {
  // TODO arrumar a arma leve na tabela. Aqui eh um hack.
  var arma_leve = false;
  for (var categoria in arma_personagem.arma_tabela.categorias) {
    if (categoria.indexOf('leve') != -1) {
      arma_leve = true;
      break;
    }
  }
  var bonus_por_categoria = { ataque: 0, dano: 0 };
  var multiplicador_dano_forca = 0;
  if (estilo.nome == 'uma_arma') {
    multiplicador_dano_forca = 1.0;
    if (gPersonagem.atributos.forca.modificador > 0 && !arma_leve) {
      multiplicador_dano_forca = 1.5;
    }
  } else if (estilo.nome == 'arma_escudo') {
    multiplicador_dano_forca = 1.0;
  } else if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    if (primaria) {
      bonus_por_categoria.ataque = secundaria_leve ? -4 : -6;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque += 2;
      }
    } else {
      bonus_por_categoria.ataque = secundaria_leve ? -8 : -10;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque += 6;
      }
    }
    multiplicador_dano_forca = primaria ? 1.0 : 0.5;
  }

  if (categoria.indexOf('cac') != -1) {
    // Quando tem acuidade, usa destreza.
    if (arma_leve && arma_personagem.acuidade && gPersonagem.bba_cac < gPersonagem.bba_cac_acuidade) {
      bonus_por_categoria.ataque += gPersonagem.bba_cac_acuidade;
    } else {
      bonus_por_categoria.ataque += gPersonagem.bba_cac;
    }
    bonus_por_categoria.ataque += arma_personagem.bonus_ataque;
    bonus_por_categoria.dano +=
        Math.floor(gPersonagem.atributos.forca.modificador * multiplicador_dano_forca) +
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('arremesso') != -1) {
    bonus_por_categoria.ataque +=
        gPersonagem.bba_distancia + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano +=
        Math.floor(gPersonagem.atributos.forca.modificador * multiplicador_dano_forca) +
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('distancia') != -1) {
    bonus_por_categoria.ataque +=
        gPersonagem.bba_distancia + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano += arma_personagem.bonus_dano;
  }

  // Proficiencia e foco.
  if (!arma_personagem.proficiente) {
    bonus_por_categoria.ataque -= 4;
  } else if (arma_personagem.foco) {
    bonus_por_categoria.ataque += arma_personagem.foco;
  }
  // Especialização.
  if (arma_personagem.especializado) {
    bonus_por_categoria.dano += arma_personagem.especializado;
  }

  // Bonus raciais.
  var bonus_racial = tabelas_raca[gPersonagem.raca].bonus_ataque;
  if (bonus_racial) {
    if (bonus_racial.armas[arma_personagem.entrada.chave]) {
      bonus_por_categoria.ataque += bonus_racial.armas[arma_personagem.entrada.chave];
    } else if (bonus_racial.categorias[categoria]) {
      bonus_por_categoria.ataque += bonus_racial.categorias[categoria];
    }
  }
  return bonus_por_categoria;
}

function _DependenciasSalvacoes() {
  var habilidades_salvacoes = {
    fortitude: 'constituicao',
    reflexo: 'destreza',
    vontade: 'sabedoria'
  };
  for (var tipo_salvacao in habilidades_salvacoes) {
    var valor_base = 0;
    for (var i = 0; i < gPersonagem.classes.length; ++i) {
      var classe = gPersonagem.classes[i].classe;
      valor_base +=
          tabelas_salvacao[classe][tipo_salvacao](gPersonagem.classes[i].nivel);
    }
    gPersonagem.salvacoes[tipo_salvacao].Adiciona('base', '-', valor_base);
    gPersonagem.salvacoes[tipo_salvacao].Adiciona('niveis_negativos', '-', -gPersonagem.niveis_negativos);
    var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
    gPersonagem.salvacoes[tipo_salvacao].Adiciona(
        'atributo', habilidade_modificadora, gPersonagem.atributos[habilidade_modificadora].modificador);
    // modificador racial.
    var salvacoes_raca = tabelas_raca[gPersonagem.raca].salvacoes;
    if (salvacoes_raca && salvacoes_raca[tipo_salvacao]) {
      gPersonagem.salvacoes[tipo_salvacao].Adiciona('racial', null, salvacoes_raca[tipo_salvacao]);
    }
  }
  var outras_salvacoes_raca = tabelas_raca[gPersonagem.raca].outras_salvacoes;
  for (var tipo_salvacao in outras_salvacoes_raca) {
    for (var i = 0; i < outras_salvacoes_raca[tipo_salvacao].base.length; ++i) {
      var salvacao_base = outras_salvacoes_raca[tipo_salvacao].base[i];
      var nome_salvacao = tipo_salvacao + ' (' + salvacao_base + ')';
      gPersonagem.salvacoes[nome_salvacao] = gPersonagem.salvacoes[salvacao_base].Clona();
      // Entra como racial, em adição ao que já possui.
      gPersonagem.salvacoes[nome_salvacao].Adiciona(
          'racial', null,
          gPersonagem.salvacoes[nome_salvacao].Le('racial', null) + outras_salvacoes_raca[tipo_salvacao].bonus);
    }
  }
}

function _DependenciasFeiticos() {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    _DependenciasNumeroFeiticosParaClasse(gPersonagem.classes[i]);
  }
}

// Limita o numero de feiticos para a classe.
function _DependenciasNumeroFeiticosParaClasse(classe_personagem) {
  var chave_classe = classe_personagem.classe;
  var feiticos_classe = tabelas_feiticos[chave_classe];
  if (feiticos_classe == null) {
    return;
  }
  var chave_classe = classe_personagem.classe;
  var atributo_chave = tabelas_feiticos[chave_classe].atributo_chave;
  var valor_atributo_chave = gPersonagem.atributos[atributo_chave].valor;
  var feiticos_por_nivel = feiticos_classe.por_nivel[classe_personagem.nivel];
  var nivel_inicial = feiticos_classe.possui_nivel_zero ? 0 : 1;
  gPersonagem.feiticos[chave_classe].em_uso = true;
  // Feiticos conhecidos (se houver para a classe). Se nao houver, vai usar o que vier da entrada.
  // Por exemplo, magos nao tem limite de conhecidos.
  for (var indice = 0;
       feiticos_por_nivel.conhecidos != null && indice < feiticos_por_nivel.conhecidos.length;
       ++indice) {
    var conhecidos_nivel = parseInt(feiticos_por_nivel.conhecidos.charAt(indice)) || 0;
    _DependenciasNumeroFeiticosConhecidosParaClassePorNivel(
        chave_classe, nivel_inicial + indice, conhecidos_nivel, feiticos_por_nivel);
  }
  // Slots de feiticos.
  var array_bonus_feiticos_atributo = feiticos_atributo(valor_atributo_chave);
  var bonus_atributo_chave = gPersonagem.atributos[atributo_chave].modificador;
  var possui_dominio =  tabelas_feiticos[chave_classe].possui_dominio;
  for (var indice = 0; indice < feiticos_por_nivel.por_dia.length; ++indice) {
    var num_slots_nivel = parseInt(feiticos_por_nivel.por_dia.charAt(indice)) || 0;
    _DependenciasNumeroSlotsParaClassePorNivel(
        chave_classe, nivel_inicial + indice, num_slots_nivel, feiticos_por_nivel,
        array_bonus_feiticos_atributo, bonus_atributo_chave, possui_dominio);
  }
  gPersonagem.feiticos[chave_classe].nivel_maximo = nivel_inicial + feiticos_por_nivel.por_dia.length - 1;
}

// Computa as dependencias do numero de feiticos conhecidos para uma classe e um determinado nivel.
function _DependenciasNumeroFeiticosConhecidosParaClassePorNivel(
    chave_classe, nivel, conhecidos_nivel, feiticos_por_nivel) {
  var personagem_conhecidos_nivel = gPersonagem.feiticos[chave_classe].conhecidos[nivel];
  // Ajusta feiticos conhecidos.
  personagem_conhecidos_nivel.length = conhecidos_nivel;
  // Cria um feitico vazio se nao houver.
  for (var i = 0; i < personagem_conhecidos_nivel.length; ++i) {
    if (personagem_conhecidos_nivel[i] == null) {
      personagem_conhecidos_nivel[i] = '';
    }
  }
}

// Calcula as dependencias do numero de slots para uma classe por nivel.
function _DependenciasNumeroSlotsParaClassePorNivel(
    chave_classe, nivel, num_slots_nivel, feiticos_por_nivel,
    array_bonus_feiticos_atributo, bonus_atributo_chave, possui_dominio) {
  // Slots de feiticos.
  var personagem_slots_nivel = gPersonagem.feiticos[chave_classe].slots[nivel];
  personagem_slots_nivel.base = num_slots_nivel;
  personagem_slots_nivel.bonus_atributo = array_bonus_feiticos_atributo[nivel];
  personagem_slots_nivel.cd = 10 + nivel + bonus_atributo_chave;

  var slots_por_dia = personagem_slots_nivel.base + personagem_slots_nivel.bonus_atributo;
  personagem_slots_nivel.feiticos.length = slots_por_dia;
  // cria um slot vazio se nao houver.
  for (var i = 0; i < slots_por_dia; ++i) {
    if (personagem_slots_nivel.feiticos[i] == null) {
      personagem_slots_nivel.feiticos[i] = { nome: '', gasto: false };
    }
  }
  // Dominio, apenas para niveis acima do zero.
  if (possui_dominio && nivel > 0 && personagem_slots_nivel.feitico_dominio == null) {
    personagem_slots_nivel.feitico_dominio = { nome: '', gasto: false };
  }
}
