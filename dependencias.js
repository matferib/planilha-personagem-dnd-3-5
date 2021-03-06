// Este arquivo nao deve ter nenhuma referencia ao objeto entradas. A unica funcao exportada
// calcula todas as dependencias das entradas ja convertidas. Como durante a conversao nem sempre
// eh possivel podar os valores, as verificacoes de consistencia devem ser feitas aqui ao inves
// do arquivo converte.

function DependenciasGerais() {
  _DependenciasNivelConjurador();
  _DependenciasEquipamentos();
  _DependenciasFamiliar();
  _DependenciasDadosVida();
  _DependenciasAtributos();
  _DependenciasTalentos();
  _DependenciasPontosVida();
  _DependenciasIniciativa();
  _DependenciasTamanho();
  _DependenciasBba();
  _DependenciasProficienciaArmas();
  _DependenciasHabilidadesEspeciais();
  _DependenciasImunidades();
  _DependenciasResistenciaMagia();

  // So pode fazer aqui, pois os pre requisitos dependem de atributos, classes,
  // talentos, proficiencias...
  // TODO se essa funcao falhar, potencialmente o personagem tera que ser recarregado.
  _VerificaPrerequisitosTalento();

  _DependenciasPericias();
  _DependenciasFocoArmas();
  _DependenciasEspecializacaoArmas();
  _DependenciasClasseArmadura();
  _DependenciasArmas();
  _DependenciasEstilos();
  _DependenciasSalvacoes();
  _DependenciasFeiticos();
}

// Calcula a classe de conjurador para cada classe de personagem.
function _DependenciasNivelConjurador() {
  // Niveis basicos de conjurador.
  gPersonagem.classes.forEach(function(entrada_classe) {
    var classe_tabela = tabelas_classes[entrada_classe.classe];
    if (classe_tabela.nivel_conjurador == null) {
      entrada_classe.nivel_conjurador = 0;
      entrada_classe.linha_tabela_feiticos = 0;
    } else {
      var nivel_minimo = classe_tabela.nivel_conjurador.minimo || 0;
      if (entrada_classe.nivel < nivel_minimo) {
        entrada_classe.nivel_conjurador = 0;
        entrada_classe.linha_tabela_feiticos = 0;
        return;
      }
      var modificador_nivel_conjurador = classe_tabela.nivel_conjurador.modificador || 0;
      entrada_classe.nivel_conjurador = Math.floor(entrada_classe.nivel * modificador_nivel_conjurador);
      entrada_classe.linha_tabela_feiticos = entrada_classe.nivel;
    }
  });
  // Niveis incrementais de conjurador.
  gPersonagem.classes.forEach(function(classe_personagem_modificadora) {
    var classe_tabela = tabelas_classes[classe_personagem_modificadora.classe];
    if (classe_tabela.incremento_nivel_conjurador == null) {
      return;
    }
    classe_tabela.incremento_nivel_conjurador.forEach(function(tipo) {
      var classe_personagem = PersonagemMaiorClasseConjurador(tipo);
      if (classe_personagem == null) {
        return;
      }
      classe_personagem.nivel_conjurador += classe_personagem_modificadora.nivel;
      classe_personagem.linha_tabela_feiticos += classe_personagem_modificadora.nivel;
    });
  });
}

function _DependenciasFamiliar() {
  if (gPersonagem.familiar == null ||
      !(gPersonagem.familiar.chave in tabelas_familiares)) {
    return;
  }
  if (!gPersonagem.familiar.em_uso) {
    return;
  }
  _DependenciasItemOuFamiliar('familiar', tabelas_familiares[gPersonagem.familiar.chave]);
  // Pontos de vida base feito no DependenciasPontosVida.
}

function _DependenciasEquipamentos() {
  for (var chave_item in tabelas_itens) {
    _DependenciasItens(chave_item);
  }
}

function _DependenciasItens(tipo_item) {
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    var item = gPersonagem[tipo_item][i];
    if (!item.em_uso) {
      continue;
    }
    _DependenciasItemOuFamiliar(item.chave, tabelas_itens[tipo_item].tabela[item.chave]);
  }
}

// Calcula as dependencias do item.
// @param chave_item a chave do item.
// @param item_tabela ou familiar, deve conter propriedades.
function _DependenciasItemOuFamiliar(chave_item, item_tabela) {
  for (var propriedade in item_tabela.propriedades) {
    if (propriedade == 'ca') {
      _DependenciasItemCa(chave_item, item_tabela);
    } else if (propriedade == 'ataque') {
      _DependenciasItemAtaque(chave_item, item_tabela);
    } else if (propriedade == 'pericias') {
      _DependenciasItemPericias(chave_item, item_tabela);
    } else if (propriedade == 'salvacoes') {
      _DependenciasItemSalvacoes(chave_item, item_tabela);
    } else if (propriedade == 'atributos') {
      _DependenciasItemAtributos(chave_item, item_tabela);
    } else if (propriedade == 'tamanho') {
      _DependenciasItemTamanho(chave_item, item_tabela);
    } else if (propriedade == 'bonus_pv') {
      _DependenciasItemPontosVida(chave_item, item_tabela);
    } else if (propriedade == 'especiais') {
      _DependenciasItemEspeciais(chave_item, item_tabela);
    }
  }
}

// Item que afeta os ataques.
function _DependenciasItemAtaque(chave_item, item_tabela) {
  for (var chave_bonus in item_tabela.propriedades.ataque) {
    var valor = item_tabela.propriedades.ataque[chave_bonus];
    gPersonagem.outros_bonus_ataque.Adiciona(chave_bonus, chave_item, valor);
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
    gPersonagem.atributos[chave_atributo].bonus.Adiciona(
        'melhoria', chave_item, item_tabela.propriedades.atributos[chave_atributo]);
  }
}

function _DependenciasItemTamanho(chave_item, item_tabela) {
  var quantidade = item_tabela.propriedades.tamanho;
  while (quantidade != 0) {
    var tamanho_personagem = tabelas_tamanho[gPersonagem.tamanho.categoria];
    var proximo = quantidade > 0 ? tamanho_personagem.maior : tamanho_personagem.menor;
    if (proximo == null) {
      break;
    }
    gPersonagem.tamanho.categoria = proximo;
    quantidade += (quantidade > 0) ? -1 : 1;
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
  if ('todas' in item_tabela.propriedades.pericias) {
    for (var chave_pericia in tabelas_pericias) {
      for (var chave_bonus in item_tabela.propriedades.pericias['todas']) {
        gPersonagem.pericias.lista[chave_pericia].bonus.Adiciona(
            chave_bonus, chave_item, item_tabela.propriedades.pericias['todas'][chave_bonus]);
      }
    }
  } else {
    for (var chave_pericia in item_tabela.propriedades.pericias) {
      for (var chave_bonus in item_tabela.propriedades.pericias[chave_pericia]) {
        gPersonagem.pericias.lista[chave_pericia].bonus.Adiciona(
            chave_bonus, chave_item, item_tabela.propriedades.pericias[chave_pericia][chave_bonus]);
      }
    }
  }
}

function _DependenciasItemPontosVida(chave_item, item_tabela) {
  for (var chave_bonus in item_tabela.propriedades.bonus_pv) {
    gPersonagem.pontos_vida.bonus.Adiciona(
        chave_bonus, chave_item, item_tabela.propriedades.bonus_pv[chave_bonus]);
  }
}

function _DependenciasItemEspeciais(chave_item, item_tabela) {
  for (var chave_especial in item_tabela.propriedades.especiais) {
    if (chave_especial in gPersonagem.especiais) {
      gPersonagem.especiais.vezes += item_tabela.propriedades.especiais[chave_especial];
    } else {
      gPersonagem.especiais[chave_especial] = {
        vezes: item_tabela.propriedades.especiais[chave_especial], usado: 0, complemento: ''
      }
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
  var bonus_nivel_por_atributo = {};
  for (var atributo in tabelas_atributos) {
    var atributo_personagem = gPersonagem.atributos[atributo];
    // racial.
    atributo_personagem.bonus.Adiciona('racial', null, tabelas_raca[gPersonagem.raca].atributos[atributo] || 0);
    // template.
    if (gPersonagem.template.length != 0 && ('atributos' in tabelas_template[gPersonagem.template])) {
      atributo_personagem.bonus.Adiciona('template', null, tabelas_template[gPersonagem.template].atributos[atributo] || 0);
    }
    bonus_nivel_por_atributo[atributo] = 0;
  }
  // Calcula os bonus de nivel para cada atributo.
  for (var i = 0; i < gPersonagem.atributos.pontos.gastos.length; ++i) {
    ++bonus_nivel_por_atributo[gPersonagem.atributos.pontos.gastos[i]];
  }
  for (var atributo in bonus_nivel_por_atributo) {
    gPersonagem.atributos[atributo].bonus.Adiciona('nivel', null, bonus_nivel_por_atributo[atributo]);
  }
  // Valor final e modificador.
  for (var atributo in tabelas_atributos) {
    var atributo_personagem = gPersonagem.atributos[atributo];
    atributo_personagem.modificador = modificador_atributo(atributo_personagem.bonus.Total());
  }
}

function _DependenciasTalentos() {
  // Gerais.
  var talentos_gerais_por_nivel =
      1 + Math.floor(gPersonagem.dados_vida.nivel_personagem / 3);
  if (tabelas_raca[gPersonagem.raca].talento_extra) {
    ++talentos_gerais_por_nivel;
  }
  if (gPersonagem.familiar != null && gPersonagem.familiar.em_uso) {
    gPersonagem.talentos['gerais'][talentos_gerais_por_nivel] = {
      chave: 'prontidao', complemento: 'familiar', imutavel: true
    };
    ++talentos_gerais_por_nivel;  // alerta
  }
  gPersonagem.talentos['gerais'].length = talentos_gerais_por_nivel;

  // Outros nao precisa fazer nada.
  // Guerreiro.
  var nivel_guerreiro = PersonagemNivelClasse('guerreiro');
  if (nivel_guerreiro > 0) {
    gPersonagem.talentos['guerreiro'].length = 1 + Math.floor(nivel_guerreiro / 2);
  } else {
    gPersonagem.talentos['guerreiro'].length = 0;
  }
  // Mago.
  gPersonagem.talentos['mago'].length =
      Math.floor(PersonagemNivelClasse('mago') / 5) +
      Math.floor(PersonagemNivelClasse('mago_necromante') / 5);
  // Monge.
  var nivel_monge = PersonagemNivelClasse('monge');
  if (nivel_monge >= 6) {
    gPersonagem.talentos['monge'].length = 3;
  } else if (nivel_monge >= 2) {
    gPersonagem.talentos['monge'].length = 2;
  } else if (nivel_monge == 1) {
    gPersonagem.talentos['monge'].length = 1;
  } else {
    gPersonagem.talentos['monge'].length = 0;
  }
  // Ranger.
  var nivel_ranger = PersonagemNivelClasse('ranger');
  if (nivel_ranger >= 11) {
    gPersonagem.talentos['ranger'].length = 3;
  } else if (nivel_ranger >= 6) {
    gPersonagem.talentos['ranger'].length = 2;
  } else if (nivel_ranger == 2) {
    gPersonagem.talentos['ranger'].length = 1;
  } else {
    gPersonagem.talentos['ranger'].length = 0;
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
  if ('bonus_ca' in talento) {
    for (var tipo_bonus in talento['bonus_ca']) {
      gPersonagem.ca.bonus.Adiciona(tipo_bonus, 'talento_' + chave_talento , talento.bonus_ca[tipo_bonus]);
    }
  }
}

function _DependenciasPontosVida() {
  gPersonagem.pontos_vida.bonus.Adiciona(
      'atributo', 'constituicao',
      gPersonagem.dados_vida.nivel_personagem * gPersonagem.atributos['constituicao'].modificador);
  gPersonagem.pontos_vida.bonus.Adiciona(
      'niveis_negativos', '-', -5 * gPersonagem.niveis_negativos);
  // Familiar tem que ser aqui, pq depende dos pontos de vida do personagem e o personagem pode depender do familiar tb.
  if (gPersonagem.familiar == null ||
      !(gPersonagem.familiar.chave in tabelas_familiares) ||
      !gPersonagem.familiar.em_uso) {
    return;
  }
  gPersonagem.familiar.pontos_vida.base =
    Math.floor((gPersonagem.pontos_vida.total_dados + gPersonagem.pontos_vida.bonus.Total()) / 2.0);
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

  var total_outros = gPersonagem.outros_bonus_ataque.Total();
  gPersonagem.bba += tabelas_raca[gPersonagem.raca].bba || 0;
  gPersonagem.bba -= gPersonagem.niveis_negativos;
  gPersonagem.bba_cac =
      gPersonagem.bba + gPersonagem.atributos['forca'].modificador +
      gPersonagem.tamanho.modificador_ataque_defesa + total_outros;
  gPersonagem.bba_cac_acuidade =
      gPersonagem.bba + gPersonagem.atributos['destreza'].modificador +
      gPersonagem.tamanho.modificador_ataque_defesa + total_outros;
  // Por enquanto, nao encontrei nenhum caso que seja diferente de acuidade e distancia.
  gPersonagem.bba_distancia = gPersonagem.bba_cac_acuidade;
  gPersonagem.numero_ataques = (gPersonagem.bba == 0) ? 1 : Math.floor((gPersonagem.bba - 1) / 5) + 1;
  gPersonagem.agarrar =
      gPersonagem.bba +
      gPersonagem.atributos['forca'].modificador +
      gPersonagem.tamanho.modificador_agarrar +
      total_outros;
}

// Converte a proficiencia em armas do personagem.
function _DependenciasProficienciaArmas() {
  var todas_simples = false;
  var todas_comuns = false;
  gPersonagem.proficiencia_armas = {};
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var chave_classe = gPersonagem.classes[i].classe;
    var tabela_classe = tabelas_classes[chave_classe];
    var armas_classe = tabela_classe.proficiencia_armas || [];
    for (var j = 0; j < armas_classe.length; ++j) {
      gPersonagem.proficiencia_armas[armas_classe[j]] = true;
      if (armas_classe[j] == 'arco_curto' || armas_classe[j] == 'arco_longo') {
        for (var arma_tabela in tabelas_armas_comuns) {
          if (arma_tabela.indexOf(armas_classe[j]) == 0) {
            gPersonagem.proficiencia_armas[arma_tabela] = true;
          } 
        }
      }
    }
    // TODO usar a nova funcao de PersonagemProficienteTipoArma.
    var talentos_classe = tabela_classe.talentos || [];
    for (var j = 0; j < talentos_classe.length; ++j) {
      if (talentos_classe[j] == 'usar_armas_simples') {
        todas_simples = true;
      } else if (talentos_classe[j] == 'usar_armas_comuns') {
        todas_comuns = true;
      }
    }
  }
  gPersonagem.proficiencia_armas['desarmado'] = true;
  gPersonagem.proficiencia_armas['manopla'] = true;
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
          Mensagem(Traduz('Arma') + ' "' + talento.complemento + '" ' + Traduz('inválida para talento') + ' "' +
                Traduz(tabelas_talentos[talento.chave].nome) + '"');
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
            Mensagem(Traduz('Arma') + ' "' + talento.complemento + '" ' + Traduz('inválida para talento') + ' "' +
                  Traduz(tabelas_talentos[talento.chave].nome) + '"');
            continue;
          }
        }
        gPersonagem.proficiencia_armas[chave_arma] = true;
      }
    }
  }
}

// Retorna o numero de vezes que o especial pode ser usado.
function _VezesEspecial(especial) {
  var especial_tabela = tabelas_especiais[especial];
  var valor = 0;
  if ('vezes' in especial_tabela) {
    var valor = especial_tabela.vezes.fixo || 0;
    if ('nivel' in especial_tabela.vezes) {
      valor += PersonagemNivelClasse(especial_tabela.vezes.nivel);
    }
    if ('atributo' in especial_tabela.vezes) {
      valor += gPersonagem.atributos[especial_tabela.vezes.atributo].modificador;
    }
    if ('talento' in especial_tabela.vezes && PersonagemPossuiTalento(especial_tabela.vezes.talento.chave)) {
      valor += especial_tabela.vezes.talento.fixo;
    }
  }
  return valor;
}

function _DependenciaHabilidadeEspecial(especial) {
  var valor = _VezesEspecial(especial);
  if (especial in gPersonagem.especiais) {
    gPersonagem.especiais[especial].vezes += valor;
  } else {
    gPersonagem.especiais[especial] = { vezes: valor };
  }
}

// Habilidades especiais do gPersonagem.
function _DependenciasHabilidadesEspeciais() {
  var especiais_antes = gPersonagem.especiais;
  var especiais_nivel_classe = [];
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var entrada_classe = gPersonagem.classes[i];
    if (tabelas_classes[entrada_classe.classe].especiais == null) {
      continue;
    }
    especiais_nivel_classe.push(
        { nivel: PersonagemNivelClasse(entrada_classe.classe), especiais_classe: tabelas_classes[entrada_classe.classe].especiais });
  }
  if ('especiais' in tabelas_raca[gPersonagem.raca]) {
    especiais_nivel_classe.push({ nivel: PersonagemNivel(), especiais_classe: tabelas_raca[gPersonagem.raca].especiais });
  }
  var template_pc = PersonagemTemplate();
  if (template_pc != null && 'especiais' in template_pc) {
    especiais_nivel_classe.push({ nivel: PersonagemNivel(), especiais_classe: template_pc.especiais });
  }

  for (var i = 0; i < especiais_nivel_classe.length; ++i) {
    var dados_nivel_classe = especiais_nivel_classe[i];
    for (var nivel = 1; nivel <= dados_nivel_classe.nivel; ++nivel) {
      var especiais_por_nivel = dados_nivel_classe.especiais_classe;
      if (!(nivel in especiais_por_nivel)) {
        continue;
      }
      for (var j = 0; j < especiais_por_nivel[nivel].length; ++j) {
        _DependenciaHabilidadeEspecial(especiais_por_nivel[nivel][j]);
      }
    }
  }
  gPersonagem.dominios.forEach(function(dominio) {
    if ('habilidade_especial' in tabelas_dominios[dominio]) {
      _DependenciaHabilidadeEspecial(tabelas_dominios[dominio].habilidade_especial);
    }
  });

  // Atualiza o numero de usos de cada especial.
  for (var chave_especial in gPersonagem.especiais) {
    if (chave_especial in especiais_antes) {
      gPersonagem.especiais[chave_especial].usado = especiais_antes[chave_especial].usado || 0;
    } else {
      gPersonagem.especiais[chave_especial].usado = 0;
    }
  }
}

function _DependenciasImunidades() {
  var tabelas = [ tabelas_raca[gPersonagem.raca] ];
  if (gPersonagem.template.length > 0) {
    tabelas.push(tabelas_template[gPersonagem.template]);
  }
  tabelas.forEach(function(tabela) {
    if ('imunidades' in tabela) {
      gPersonagem.imunidades = gPersonagem.imunidades.concat(tabela['imunidades']);
    }
  });
}

function _DependenciasResistenciaMagia() {
  var tabelas = [ tabelas_raca[gPersonagem.raca] ];
  if (gPersonagem.template.length > 0) {
    tabelas.push(tabelas_template[gPersonagem.template]);
  }
  tabelas.forEach(function(tabela) {
    if ('resistencia_magia' in tabela) {
      gPersonagem.resistencia_magia = gPersonagem.resistencia_magia.concat(tabela['resistencia_magia']);
    }
  });
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
          talento.complemento != '' &&
          !_VerificaTipoComplementoTalento(talento)) {
        talento.complemento = null;
      }
      // Talentos de monge e ranger nao precisa do prerequisito.
      if (chave_classe == 'monge' || chave_classe == 'ranger') {
        continue;
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
  // Bonus de esconder.
  var bonus_esconder_por_tamanho = {
    minusculo: 16, diminuto: 12, miudo: 8, pequeno: 4, medio: 0, grande: -4, enorme: -8, imenso: -12, colossal: -16
  };
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

    if (chave_pericia == 'esconderse') {
      gPersonagem.pericias.lista[chave_pericia].bonus.Adiciona('tamanho', '-', bonus_esconder_por_tamanho[gPersonagem.tamanho.categoria]);
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
        if (talento.complemento == '') {
          continue;
        }
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
function _DependenciasClasseArmadura() {
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
  // Por classe.
  var bonus_classe = 0;
  for (var i_classe = 0; i_classe < gPersonagem.classes.length; ++i_classe) {
    var chave_classe = gPersonagem.classes[i_classe].classe;
    var nivel = gPersonagem.classes[i_classe].nivel;
    var tabela_classe = tabelas_classes[chave_classe];
    for (var i = 1; i <= nivel; ++i) {
      if (tabela_classe.especiais != null && tabela_classe.especiais[i] != null) {
        var especiais_classe_nivel = tabela_classe.especiais[i];
        for (var j = 0; j < especiais_classe_nivel.length; ++j) {
          if (especiais_classe_nivel[j] == 'bonus_ca') {
            ++bonus_classe;
          }
        }
      }
    }
  }
  bonus_ca.Adiciona('classe', 'monge', bonus_classe);

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
  if (PersonagemNivelClasse('monge') > 0) {
    bonus_ca.Adiciona(
        'atributo', 'sabedoria', gPersonagem.atributos.sabedoria.modificador);
  }

  bonus_ca.Adiciona(
      'tamanho', 'tamanho', gPersonagem.tamanho.modificador_ataque_defesa);
  // Pode adicionar as armaduras naturais aqui que elas nao se acumulam.
  bonus_ca.Adiciona(
      'armadura_natural', 'racial', tabelas_raca[gPersonagem.raca].armadura_natural || 0);
  var template_personagem = PersonagemTemplate();
  if (template_personagem != null) {
    if ('bonus_ca' in template_personagem) {
      for (var chave in template_personagem.bonus_ca) {
        bonus_ca.Adiciona(chave, 'template', template_personagem.bonus_ca[chave]);
      }
    }
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
  arma_personagem.texto_nome = Traduz(arma_tabela.nome);
  arma_personagem.critico = arma_tabela.critico;
  if (arma_entrada.material && arma_entrada.material != 'nenhum') {
    arma_personagem.nome_gerado +=
        ' (' + tabelas_materiais_especiais[arma_entrada.material].nome + ')';
    arma_personagem.texto_nome +=
        ' (' + Traduz(tabelas_materiais_especiais[arma_entrada.material].nome) + ')';
  }

  if (arma_entrada.bonus > 0) {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = arma_entrada.bonus;
    arma_personagem.nome_gerado += ' +' + arma_personagem.bonus_ataque;
    arma_personagem.texto_nome += ' +' + arma_personagem.bonus_ataque;
  } else if (arma_entrada.obra_prima) {
    arma_personagem.bonus_ataque = 1;
    arma_personagem.bonus_dano = 0;
    arma_personagem.nome_gerado += ' OP';
    arma_personagem.texto_nome += Traduz(' OP');
  } else {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = 0;
  }
  var template_pc = PersonagemTemplate();
  if (template_pc != null && 'bonus_dano' in template_pc) {
    for (var tipo_bonus in template_pc.bonus_dano) {
      arma_personagem.bonus_dano += template_pc.bonus_dano[tipo_bonus];
    }
  }
  if (template_pc != null && 'bonus_ataque' in template_pc) {
    for (var tipo_bonus in template_pc.bonus_dano) {
      arma_personagem.bonus_ataque += template_pc.bonus_ataque[tipo_bonus];
    }
  }

  arma_personagem.proficiente = PersonagemProficienteComArma(arma_entrada.chave);
  if (!arma_personagem.proficiente) {
    if (arma_entrada.chave.indexOf('arco_') != -1 &&
        (PersonagemUsandoItem('bracaduras', 'arqueiro_menor') || PersonagemUsandoItem('bracaduras', 'arqueiro_maior'))) {
      arma_personagem.proficiente = true;
    } else if (arma_entrada.chave == 'espada_bastarda' && PersonagemProficienteTipoArma('comuns')) {
      arma_personagem.proficiente_duas_maos = true;
    }
  }
  arma_personagem.foco = PersonagemFocoComArma(arma_entrada.chave);
  arma_personagem.especializado = PersonagemEspecializacaoComArma(arma_entrada.chave);
  if ('cac_leve' in arma_tabela.categorias ||
      arma_entrada.chave == 'sabre' ||
      arma_entrada.chave == 'chicote' ||
      arma_entrada.chave == 'corrente_com_cravos') {
    arma_personagem.acuidade = PersonagemPossuiTalento('acuidade_arma');
  }
  if (PersonagemPossuiTalento('sucesso_decisivo_aprimorado', Traduz(arma_tabela.nome))) {
    arma_personagem.critico = DobraMargemCritico(arma_personagem.critico);
  }
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
    Mensagem(Traduz('Arma') + ' "' + Traduz(estilo_personagem.arma_primaria.nome) + '" ' + Traduz('não é dupla.'));
    estilo_personagem.nome = 'uma_arma';
  }

  if (estilo_personagem.nome == 'rajada' && PersonagemNivelClasse('monge') == 0) {
    Mensagem('Estilo "rajada de golpes" requer nível de monge.');
    estilo_personagem.nome = 'uma_arma';
  }

  if (estilo_personagem.nome == 'tiro_rapido' &&
      (!PersonagemPossuiTalento('tiro_rapido') || (!('distancia' in arma_primaria.arma_tabela.categorias) && !('arremesso' in arma_primaria.arma_tabela.categorias)))) {
    Mensagem('Estilo "tiro_rapido" requer talento tiro rapido e arma de distância.');
    estilo_personagem.nome = 'uma_arma';
  }

  if ('cac_duas_maos' in arma_primaria.arma_tabela.categorias &&
      estilo_personagem.nome != 'uma_arma') {
    Mensagem(Traduz('Arma') + ' "' + Traduz(estilo_personagem.arma_primaria.nome) + '" ' + Traduz('requer duas mãos.'));
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
  var bonus_por_categoria = { ataque: [0], dano: 0 };
  var multiplicador_dano_forca = 0;
  var nivel_monge = PersonagemNivelClasse('monge');
  if (estilo.nome == 'uma_arma') {
    multiplicador_dano_forca = 1.0;
    if (gPersonagem.atributos.forca.modificador > 0 && !arma_leve) {
      // arcos vao entrar aqui mas na hora de computar o dano nao vao levar isso em consideracao.
      multiplicador_dano_forca = 1.5;
    }
  } else if (estilo.nome == 'arma_escudo') {
    multiplicador_dano_forca = 1.0;
  } else if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    if (primaria) {
      bonus_por_categoria.ataque[0] = secundaria_leve ? -4 : -6;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque[0] += 2;
      }
    } else {
      bonus_por_categoria.ataque[0] = secundaria_leve ? -8 : -10;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque[0] += 6;
      }
    }
    multiplicador_dano_forca = primaria ? 1.0 : 0.5;
  } else if (estilo.nome == 'rajada') {
    if (nivel_monge >= 9) {
      bonus_por_categoria.ataque[0] = 0;
    } else if (nivel_monge >= 5) {
      bonus_por_categoria.ataque[0] = -1;
    } else {
      bonus_por_categoria.ataque[0] = -2;
    }
  } else if (estilo.nome == 'tiro_rapido') {
    bonus_por_categoria.ataque[0] = -2;
  }

  if (categoria.indexOf('cac') != -1 || estilo.nome == 'rajada') {
    // Quando tem acuidade, usa destreza.
    if (arma_personagem.acuidade && gPersonagem.bba_cac < gPersonagem.bba_cac_acuidade) {
      bonus_por_categoria.ataque[0] += gPersonagem.bba_cac_acuidade;
    } else {
      bonus_por_categoria.ataque[0] += gPersonagem.bba_cac;
    }
    bonus_por_categoria.ataque[0] += arma_personagem.bonus_ataque;
    bonus_por_categoria.dano +=
        Math.floor(gPersonagem.atributos.forca.modificador * multiplicador_dano_forca) +
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('arremesso') != -1) {
    bonus_por_categoria.ataque[0] +=
        gPersonagem.bba_distancia + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano +=
        Math.floor(gPersonagem.atributos.forca.modificador * multiplicador_dano_forca) +
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('distancia') != -1) {
    bonus_por_categoria.ataque[0] +=
        gPersonagem.bba_distancia + arma_personagem.bonus_ataque;
    var escudo = gPersonagem.escudo;
    if (arma_personagem.entrada.chave.indexOf('besta_') != -1 && estilo.nome == 'arma_escudo' &&
        escudo != null && escudo.entrada.chave != 'broquel') {
      // Vale para bestas de repeticao tb. Vou considerar que o ataque de uma arma usa duas maos. Entao
      // a penalidade aqui so eh aplicada sobre arma e escudo.
      if (arma_personagem.entrada.chave.indexOf('leve') != -1) {
        bonus_por_categoria.ataque[0] -= 2;
      } else if (arma_personagem.entrada.chave.indexOf('pesada') != -1) {
        bonus_por_categoria.ataque[0] -= 4;
      }
    }
    bonus_por_categoria.dano += arma_personagem.bonus_dano;
    var bonus_forca = gPersonagem.atributos.forca.modificador;
    if (bonus_forca < 0) {
      if (arma_personagem.entrada.chave.indexOf('arco_') != -1 || arma_personagem.entrada.chave.indexOf('funda') != -1) {
        bonus_por_categoria.dano += bonus_forca;
      }
    } else {
      var indice_composto = arma_personagem.entrada.chave.indexOf('composto_');
      if (indice_composto != -1) {
        var bonus_arco = parseInt(arma_personagem.entrada.chave.slice(indice_composto + 9)) || 0;
        if (gPersonagem.atributos.forca.modificador >= bonus_arco) {
          bonus_por_categoria.dano += bonus_arco;
        } else {
          // Nao consegue usar direito.
          bonus_por_categoria.ataque[0] -= 2;
        }
      }
    }
  }

  // Proficiencia e foco.
  var proficiente = arma_personagem.proficiente || (estilo.nome == 'uma_arma' && arma_personagem.proficiente_duas_maos);
  if (!proficiente) {
    bonus_por_categoria.ataque[0] -= 4;
  } else if (arma_personagem.foco) {
    bonus_por_categoria.ataque[0] += arma_personagem.foco;
  }
  // Especialização.
  if (arma_personagem.especializado) {
    bonus_por_categoria.dano += arma_personagem.especializado;
  }
  // Alguns itens magicos especificos.
  if (arma_personagem.entrada.chave.indexOf('arco') != -1) {
    // Tem que pegar direto das proficiencias aqui, porque a arma ja foi marcada como proficiente nas DependenciasProficienciasArmas.
    var proficiente = PersonagemProficienteComArma(arma_personagem.entrada.chave);
    if (proficiente) {
      // TODO os bonus sao de competencia.
      if (PersonagemUsandoItem('bracaduras', 'arqueiro_menor')) {
        bonus_por_categoria.ataque[0] += 1;
      } else if (PersonagemUsandoItem('bracaduras', 'arqueiro_maior')) {
        bonus_por_categoria.ataque[0] += 2;
        bonus_por_categoria.dano += 1;
      }
    }
  }

  // Bonus raciais.
  var bonus_racial = tabelas_raca[gPersonagem.raca].bonus_ataque;
  if (bonus_racial) {
    if (bonus_racial.armas[arma_personagem.entrada.chave]) {
      bonus_por_categoria.ataque[0] += bonus_racial.armas[arma_personagem.entrada.chave];
    } else if (bonus_racial.categorias[categoria]) {
      bonus_por_categoria.ataque[0] += bonus_racial.categorias[categoria];
    }
  }

  // Ataques adicionais.
  if (estilo.nome == 'rajada' && nivel_monge > 0) {
    bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0]);
    if (nivel_monge >= 11) {
      bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0]);
    }
  } else if (estilo.nome == 'tiro_rapido') {
    bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0]);
  }
  // Por nivel.
  if (primaria) {
    var num_ataques = gPersonagem.numero_ataques - 1;
    var modificador = -5;
    while (num_ataques > 0) {
      bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0] + modificador);
      --num_ataques;
      modificador -= 5;
    }
  } else if (PersonagemPossuiTalento('combater_duas_armas_aprimorado')) {
    bonus_por_categoria.ataque.push(bonus_por_categoria.ataque[0] - 5);
  }
  return bonus_por_categoria;
}

function _DependenciasSalvacoes() {
  var habilidades_salvacoes = {
    fortitude: 'constituicao',
    reflexo: 'destreza',
    vontade: 'sabedoria'
  };
  var bonus_carisma = gPersonagem.atributos['carisma'].modificador;
  if (bonus_carisma < 0) {
    bonus_carisma = 0;
  }
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
    if ('graca_divina' in gPersonagem.especiais) {
      gPersonagem.salvacoes[tipo_salvacao].Adiciona('atributo', 'carisma', bonus_carisma);
    }
  }
  var template_pc = PersonagemTemplate();
  if (template_pc != null && 'bonus_salvacoes' in template_pc) {
    for (var tipo_salvacao in template_pc.bonus_salvacoes) {
      for (var tipo_bonus in template_pc.bonus_salvacoes[tipo_salvacao]) {
        gPersonagem.salvacoes[tipo_salvacao].Adiciona(tipo_bonus, '-', template_pc.bonus_salvacoes[tipo_salvacao][tipo_bonus]);
      }
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
    var chave_classe = gPersonagem.classes[i].classe;
    var tabela_feiticos_classe = tabelas_feiticos[chave_classe];
    if (tabela_feiticos_classe == null) {
      continue;
    }
    _DependenciasEscolasProibidas(chave_classe);
    _DependenciasNumeroFeiticosParaClasse(gPersonagem.classes[i]);
  }
}

function _DependenciasEscolasProibidas(chave_classe) {
  var tabela_feitico_classe = tabelas_feiticos[chave_classe];
  var feiticos_classe = gPersonagem.feiticos[chave_classe];
  if (gPersonagem.feiticos[chave_classe].escolas_proibidas == null) {
    gPersonagem.feiticos[chave_classe].escolas_proibidas = [];
  }
  gPersonagem.feiticos[chave_classe].escolas_proibidas.length = tabela_feitico_classe.num_escolas_proibidas || 0;
  for (var i = 0; i < tabela_feitico_classe.num_escolas_proibidas; ++i) {
    if (gPersonagem.feiticos[chave_classe].escolas_proibidas[i] == null) {
      gPersonagem.feiticos[chave_classe].escolas_proibidas[i] = '';
    }
  }
}

// Limita o numero de feiticos para a classe.
function _DependenciasNumeroFeiticosParaClasse(classe_personagem) {
  var chave_classe = classe_personagem.classe;
  var tabela_feiticos_classe = tabelas_feiticos[chave_classe];
  if (tabela_feiticos_classe == null) {
    return;
  }
  // Possivel para paladinos e rangers.
  if (classe_personagem.nivel_conjurador == 0) {
    return;
  }
  var atributo_chave = tabela_feiticos_classe.atributo_chave;
  var valor_atributo_chave = gPersonagem.atributos[atributo_chave].bonus.Total();
  var feiticos_por_nivel = tabela_feiticos_classe.por_nivel[classe_personagem.linha_tabela_feiticos];
  var nivel_inicial = tabela_feiticos_classe.possui_nivel_zero ? 0 : 1;
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
  var possui_dominio =  tabela_feiticos_classe.possui_dominio;
  var escola_especializada = tabela_feiticos_classe.escola_especializada;
  for (var indice = 0; indice < feiticos_por_nivel.por_dia.length; ++indice) {
    var num_slots_nivel = parseInt(feiticos_por_nivel.por_dia.charAt(indice)) || 0;
    _DependenciasNumeroSlotsParaClassePorNivel(
        chave_classe, nivel_inicial + indice, num_slots_nivel, feiticos_por_nivel,
        array_bonus_feiticos_atributo, bonus_atributo_chave, possui_dominio, escola_especializada);
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
    array_bonus_feiticos_atributo, bonus_atributo_chave, possui_dominio, escola_especializada) {
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
  // Especializacao em escolas.
  if (escola_especializada != null && personagem_slots_nivel.feitico_especializado == null) {
    personagem_slots_nivel.feitico_especializado = { nome: '', gasto: false };
  }
}
