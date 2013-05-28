// Este arquivo nao deve ter nenhuma referencia ao objeto entradas. A unica funcao exportada
// calcula todas as dependencias das entradas ja convertidas. Como durante a conversao nem sempre
// eh possivel podar os valores, as verificacoes de consistencia devem ser feitas aqui ao inves
// do arquivo converte.

function DependenciasGerais() {
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

function _DependenciasEquipamentos() {
  // TODO usar tabelas_itens aqui?
  var tipos_itens = [ 'aneis', 'amuletos', 'capas' ];
  for (var i = 0; i < tipos_itens.length; ++i) {
    _DependenciasItens(tipos_itens[i]);
  }
}

function _DependenciasItens(tipo_item) {
  for (var i = 0; i < personagem[tipo_item].length; ++i) {
    var item = personagem[tipo_item][i];
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
    }
  }
}

// Item que afeta a classe de armadura.
function _DependenciasItemCa(chave_item, item_tabela) {
  for (var chave_ca in item_tabela.propriedades.ca) {
    personagem.ca.bonus.Adiciona(
        chave_ca, chave_item, item_tabela.propriedades.ca[chave_ca]);
  }
}

// Item que afeta pericias.
function _DependenciasItemPericias(chave_item, item_tabela) {
  for (var chave_pericia in item_tabela.propriedades.pericias) {
    for (var chave_bonus in item_tabela.propriedades.pericias[chave_pericia]) {
      personagem.pericias.lista[chave_pericia].bonus.Adiciona(
          chave_bonus, chave_item, item_tabela.propriedades.pericias[chave_pericia][chave_bonus]);
    }
  }
}

function _DependenciasDadosVida() {
}

function _DependenciasAtributos() {
  // Bonus de atributos de acordo com nivel total de personagem.
  var nivel_total = personagem.dados_vida.nivel_personagem;
  personagem.atributos.pontos.disponiveis = 
     Math.floor(nivel_total / 4);
  if (personagem.atributos.pontos.gastos.length > 
      personagem.atributos.pontos.disponiveis) {
    // Pode acontecer com retirada ou diminuicao de niveis.
    personagem.atributos.pontos.gastos.length = 
        personagem.atributos.pontos.disponiveis;
  }

  // Calcula o componentes dos atributos.
  for (var atributo in tabelas_atributos) {
    personagem.atributos[atributo].bonus_nivel = 0;
    personagem.atributos[atributo].racial = 
        tabelas_raca[personagem.raca].atributos[atributo] || 0;
  }
  // Calcula os bonus de nivel para cada atributo.
  for (var i = 0; i < personagem.atributos.pontos.gastos.length; ++i) {
    ++personagem.atributos[personagem.atributos.pontos.gastos[i]].bonus_nivel;
  }
  // Valor final e modificador.
  for (var atributo in personagem.atributos) {
    personagem.atributos[atributo].valor = 
        personagem.atributos[atributo].base +
        personagem.atributos[atributo].bonus_nivel +
        personagem.atributos[atributo].racial;
    personagem.atributos[atributo].modificador =
        modificador_atributo(personagem.atributos[atributo].valor);
  }
}

function _DependenciasTalentos() {
  // Gerais.
  var talentos_gerais_por_nivel = 
      1 + Math.floor(personagem.dados_vida.nivel_personagem / 3);
  if (tabelas_raca[personagem.raca].talento_extra) {
    ++talentos_gerais_por_nivel;
  }
  personagem.talentos['gerais'].length = talentos_gerais_por_nivel;
  // Guerreiro.
  var nivel_guerreiro = PersonagemNivelClasse('guerreiro');
  if (nivel_guerreiro > 0) {
    personagem.talentos['guerreiro'].length = 1 + Math.floor(nivel_guerreiro / 2);
  } else {
    personagem.talentos['guerreiro'].length = 0;
  }

  // Calcula o impacto dos talentos no resto.
  for (var chave_classe in personagem.talentos) {
    for (var i = 0; i < personagem.talentos[chave_classe].length; ++i) {
      if (personagem.talentos[chave_classe][i] != null) {
        _DependenciasTalento(personagem.talentos[chave_classe][i]);
      } else {
        personagem.talentos[chave_classe][i] = { chave: '', complemento: '' };
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
    personagem.pericias.lista[chave_pericia].bonus.Adiciona(
        'talento', chave_talento, bonus_pericias[chave_pericia]);
  }
  // Caso o talento seja cumulativo, a chave deve ser unica pro bonus acumular.
  var subchave_bonus = talento.cumulativo ?
      chave_talento + '-' + indice : chave_talento;
  if ('bonus_iniciativa' in talento) {
    personagem.iniciativa.Adiciona(
        'talento', subchave_bonus, talento.bonus_iniciativa);
  }
  if ('bonus_pv' in talento) {
    personagem.pontos_vida.bonus.Adiciona(
        'talento', subchave_bonus, talento.bonus_pv);
  }
  if ('bonus_salvacao' in talento) {
    for (var tipo_salvacao in talento['bonus_salvacao']) {
      personagem.salvacoes[tipo_salvacao].Adiciona(
          'talento', subchave_bonus, talento.bonus_salvacao[tipo_salvacao]);
    }
  }
}

function _DependenciasPontosVida() {
  personagem.pontos_vida.bonus.Adiciona(
      'atributo', 'constituicao', 
      personagem.dados_vida.nivel_personagem * personagem.atributos['constituicao'].modificador);
  personagem.pontos_vida.total = 
      personagem.pontos_vida.total_dados + personagem.pontos_vida.bonus.Total();
}

function _DependenciasIniciativa() {
  personagem.iniciativa.Adiciona(
      'atributo', 'destreza', personagem.atributos['destreza'].modificador);
}

function _DependenciasTamanho() {
  personagem.tamanho.categoria =
      tabelas_raca[personagem.raca].tamanho;
  personagem.tamanho.modificador_ataque_defesa =
      tabelas_tamanho[personagem.tamanho.categoria].ataque_defesa;
  personagem.tamanho.modificador_agarrar =
      tabelas_tamanho[personagem.tamanho.categoria].agarrar;
}

function _DependenciasBba() {
  personagem.bba = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
    personagem.bba += 
        tabelas_classes[personagem.classes[i].classe].bba(personagem.classes[i].nivel);
  }
  personagem.bba_cac = 
      personagem.bba + personagem.atributos['forca'].modificador + 
      personagem.tamanho.modificador_ataque_defesa;
  personagem.bba_cac_acuidade = 
      personagem.bba + personagem.atributos['destreza'].modificador + 
      personagem.tamanho.modificador_ataque_defesa;
  // Por enquanto, nao encontrei nenhum caso que seja diferente de acuidade e distancia.
  personagem.bba_distancia = personagem.bba_cac_acuidade;
  personagem.numero_ataques = Math.floor((personagem.bba - 1) / 5) + 1;
  personagem.agarrar =
      personagem.bba + 
      personagem.atributos['forca'].modificador + 
      personagem.tamanho.modificador_agarrar;
}

// Converte a proficiencia em armas do personagem.
function _DependenciasProficienciaArmas() {
  var todas_simples = false;
  var todas_comuns = false;
  personagem.proficiencia_armas = {};
  for (var i = 0; i < personagem.classes.length; ++i) { 
    var nome_classe = personagem.classes[i].classe;
    var armas_classe = tabelas_proficiencia_arma_por_classe[nome_classe].armas;
    for (var j = 0; armas_classe != null && j < armas_classe.length; ++j) {
      personagem.proficiencia_armas[armas_classe[j]] = true;
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
      personagem.proficiencia_armas[arma] = true;
    }
  }
  if (todas_comuns) {
    for (var arma in tabelas_armas_comuns) {
      personagem.proficiencia_armas[arma] = true;
    }
    // Familiaridade.
    for (var arma in tabelas_raca[personagem.raca].familiaridade_arma) {
      personagem.proficiencia_armas[arma] = true;
    }
  }
  // Raciais.
  var armas_raca = tabelas_raca[personagem.raca].proficiencia_armas;
  for (var i = 0; armas_raca != null && i < armas_raca.length; ++i) {
    personagem.proficiencia_armas[armas_raca[i]] = true;
  }

  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in personagem.talentos) {
    var lista_classe = personagem.talentos[chave_classe];
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
              tabelas_raca[personagem.raca].familiaridade_arma &&
              tabelas_raca[personagem.raca].familiaridade_arma[chave_arma] &&
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
        personagem.proficiencia_armas[chave_arma] = true;
      }
    }
  }
}

// Habilidades especiais do personagem.
function _DependenciasEspeciais() {
  personagem.especiais = {};
  for (var i = 0; i < personagem.classes.length; ++i) {
    var entrada_classe = personagem.classes[i];
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
          var num_expulsoes = 3 + personagem.atributos['carisma'].modificador +
            (PersonagemPossuiTalento('expulsao_adicional') ? 4 : 0);
          personagem.especiais[especial] = { vezes: num_expulsoes };
        } else {
          if (!(especial in personagem.especiais)) {
            personagem.especiais[especial] = { vezes: 1 };
          } else {
            ++personagem.especiais[especial].vezes;
          }
        }
      }
    }
  }
}

function _VerificaPrerequisitosTalento() {
  for (var chave_classe in personagem.talentos) {
    var lista_talentos_classe = personagem.talentos[chave_classe];
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
  personagem.pericias.total_pontos = 0;
  var primeiro_nivel = true;
  for (var i = 0; i < personagem.classes.length; ++i) {
    var nivel = personagem.classes[i].nivel;
    var pontos_classe = tabelas_classes[personagem.classes[i].classe].pontos_pericia;
    var pontos_raca = tabelas_raca[personagem.raca].pontos_pericia || 0;
    var pontos_inteligencia = personagem.atributos.inteligencia.modificador;

    // Se o primeiro nivel estiver neste pacote de niveis, ele conta como 3 niveis a mais.
    var pontos_iteracao = 0;
    if (primeiro_nivel) {
      nivel += 3;
      primeiro_nivel = false;
    }
    personagem.pericias.total_pontos += 
        Math.max(pontos_classe + pontos_raca + pontos_inteligencia, 1) * nivel;
  }

  var max_pontos = personagem.dados_vida.nivel_personagem + 3;
  personagem.pericias.pontos_gastos = 0;
  for (var chave_pericia in personagem.pericias.lista) {
    var pericia = tabelas_pericias[chave_pericia];
    var pericia_personagem = personagem.pericias.lista[chave_pericia];
    pericia_personagem.de_classe = PersonagemPossuiUmaDasClasses(pericia.classes);
    pericia_personagem.pontos = Math.min(pericia_personagem.pontos, max_pontos);
    pericia_personagem.graduacoes = pericia_personagem.de_classe ?
        pericia_personagem.pontos : Math.floor(pericia_personagem.pontos / 2);
    pericia_personagem.bonus.Adiciona(
        'atributo', pericia.habilidade, personagem.atributos[pericia.habilidade].modificador);
    // TODO isso aqui deve ta quebrado.
    // soma todos os bonus de talentos.
    for (var chave_talento in pericia_personagem.bonus_talentos) {
      pericia_personagem.bonus.Adiciona(
          'talento', chave_talento, pericia_personagem.bonus_talentos[chave_talento]);
    }
    // soma todos os bonus raciais.
    var bonus_racial_total = 0;
    personagem.pericias.lista[chave_pericia].bonus_racial = 0;
    var raca_personagem = tabelas_raca[personagem.raca];
    if (raca_personagem.bonus_pericias && 
        raca_personagem.bonus_pericias[chave_pericia] != null) {
      pericia_personagem.bonus.Adiciona(
          'racial', personagem.raca, raca_personagem.bonus_pericias[chave_pericia]);
    }
    pericia_personagem.total = 
        pericia_personagem.graduacoes + pericia_personagem.bonus.Total(); 
    personagem.pericias.pontos_gastos += pericia_personagem.pontos;
  }
}

function _DependenciasFocoArmas() {
  personagem.foco_armas = {};
  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in personagem.talentos) {
    var lista_classe = personagem.talentos[chave_classe];
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
        personagem.foco_armas[chave_arma] = talento.chave.indexOf('_maior') == -1 ? 1 : 2;
      }
    }
  }
}

function _DependenciasEspecializacaoArmas() {
  personagem.especializacao_armas = {};
  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var chave_classe in personagem.talentos) {
    var lista_classe = personagem.talentos[chave_classe];
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
        personagem.especializacao_armas[chave_arma] = talento.chave.indexOf('_maior') == -1 ? 2 : 4;
      }
    }
  }
}

// Dependencias de armaduras e escudos.
function _DependenciasArmadurasEscudos() {
  personagem.armadura = null;
  for (var i = 0; i < personagem.armaduras.length; ++i) {
    if (personagem.armaduras[i].entrada.em_uso) {
      personagem.armadura = personagem.armaduras[i];
      break;
    }
  }

  personagem.escudo = null;
  for (var i = 0; i < personagem.escudos.length; ++i) {
    if (personagem.escudos[i].entrada.em_uso) {
      personagem.escudo = personagem.escudos[i];
      break;
    }
  }

  var bonus_ca = personagem.ca.bonus;
  if (personagem.armadura != null) {
    bonus_ca.Adiciona(
        'armadura', 'armadura', tabelas_armaduras[personagem.armadura.entrada.chave].bonus);
    bonus_ca.Adiciona(
        'armadura_melhoria', 'armadura', personagem.armadura.entrada.bonus);
  }
  if (personagem.escudo != null) {
    bonus_ca.Adiciona(
        'escudo', 'escudo', tabelas_escudos[personagem.escudo.entrada.chave].bonus);
    bonus_ca.Adiciona(
        'escudo_melhoria', 'escudo', personagem.escudo.entrada.bonus);
  }
  bonus_ca.Adiciona(
      'atributo', 'destreza', personagem.atributos.destreza.modificador);
  bonus_ca.Adiciona(
      'tamanho', 'tamanho', personagem.tamanho.modificador_ataque_defesa);
  bonus_ca.Adiciona(
      'armadura_natural', 'racial', tabelas_raca[personagem.raca].armadura_natural || 0);
}

function _DependenciasArmas() {
  for (var i = 0; i < personagem.armas.length; ++i) {
    _DependenciasArma(personagem.armas[i]);
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
  for (var i = 0; i < personagem.estilos_luta.length; ++i) {
    _DependenciasEstilo(personagem.estilos_luta[i]);
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
// @param arma_personagem a arma do personagem.
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
    if (personagem.atributos.forca.modificador > 0 && !arma_leve) {
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
    if (arma_leve && arma_personagem.acuidade && personagem.bba_cac < personagem.bba_cac_acuidade) {
      bonus_por_categoria.ataque += personagem.bba_cac_acuidade;
    } else {
      bonus_por_categoria.ataque += personagem.bba_cac;
    }
    bonus_por_categoria.ataque += arma_personagem.bonus_ataque;
    bonus_por_categoria.dano += 
        Math.floor(personagem.atributos.forca.modificador * multiplicador_dano_forca) + 
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('arremesso') != -1) {
    bonus_por_categoria.ataque += 
        personagem.bba_distancia + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano += 
        Math.floor(personagem.atributos.forca.modificador * multiplicador_dano_forca) + 
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('distancia') != -1) {
    bonus_por_categoria.ataque += 
        personagem.bba_distancia + arma_personagem.bonus_ataque;
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
  var bonus_racial = tabelas_raca[personagem.raca].bonus_ataque;
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
    for (var i = 0; i < personagem.classes.length; ++i) {
      var classe = personagem.classes[i].classe;
      valor_base += 
          tabelas_salvacao[classe][tipo_salvacao](personagem.classes[i].nivel);
    }
    personagem.salvacoes[tipo_salvacao].Adiciona('base', '-', valor_base);
    var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
    personagem.salvacoes[tipo_salvacao].Adiciona(
        'atributo', habilidade_modificadora, personagem.atributos[habilidade_modificadora].modificador);
    // modificador racial.
    var salvacoes_raca = tabelas_raca[personagem.raca].salvacoes;
    if (salvacoes_raca && salvacoes_raca[tipo_salvacao]) {
      personagem.salvacoes[tipo_salvacao].Adiciona('racial', null, salvacoes_raca[tipo_salvacao]);
    }
  }
  var outras_salvacoes_raca = tabelas_raca[personagem.raca].outras_salvacoes;
  for (var tipo_salvacao in outras_salvacoes_raca) {
    for (var i = 0; i < outras_salvacoes_raca[tipo_salvacao].base.length; ++i) {
      var salvacao_base = outras_salvacoes_raca[tipo_salvacao].base[i];
      var nome_salvacao = tipo_salvacao + ' (' + salvacao_base + ')';
      personagem.salvacoes[nome_salvacao] = personagem.salvacoes[salvacao_base].Clona();
      // Entra como racial, em adição ao que já possui.
      personagem.salvacoes[nome_salvacao].Adiciona(
          'racial', null, 
          personagem.salvacoes[nome_salvacao].Le('racial', null) + outras_salvacoes_raca[tipo_salvacao].bonus);
    }
  }
}

function _DependenciasFeiticos() {
  for (var i = 0; i < personagem.classes.length; ++i) {
    _DependenciasNumeroFeiticosParaClasse(personagem.classes[i]);
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
  var valor_atributo_chave = personagem.atributos[atributo_chave].valor;
  var bonus_atributo_chave = personagem.atributos[atributo_chave].modificador;
  var possui_dominio =  tabelas_feiticos[chave_classe].possui_dominio;
  var feiticos_por_nivel = feiticos_classe.por_nivel[classe_personagem.nivel];
  var nivel_inicial = feiticos_classe.possui_nivel_zero ? 0 : 1;
  personagem.feiticos[chave_classe].em_uso = true;
  // Feiticos conhecidos (se houver para a classe).
  for (var indice = 0; 
       feiticos_por_nivel.conhecidos != null && indice < feiticos_por_nivel.conhecidos.length; 
       ++indice) {
    var nivel_feitico = nivel_inicial + indice;
    var personagem_conhecidos_nivel = personagem.feiticos[chave_classe].conhecidos[nivel_feitico];
    // Feiticos conhecidos.
    personagem_conhecidos_nivel.length =
        parseInt(feiticos_por_nivel.conhecidos.charAt(indice)) || 0;
    // Cria um feitico vazio se nao houver.
    for (var i = 0; i < personagem_conhecidos_nivel.length; ++i) {
      if (personagem_conhecidos_nivel[i] == null) {
        personagem_conhecidos_nivel[i] = '';
      }
    }
  }
  // Slots de feiticos.
  var array_bonus_feiticos_atributo = feiticos_atributo(valor_atributo_chave);
  for (var indice = 0; indice < feiticos_por_nivel.por_dia.length; ++indice) {
    var nivel_feitico = nivel_inicial + indice;
    // Slots de feiticos.
    var personagem_slots_nivel = personagem.feiticos[chave_classe].slots[nivel_feitico];
    personagem_slots_nivel.base = parseInt(feiticos_por_nivel.por_dia.charAt(indice)) || 0;
    personagem_slots_nivel.bonus_atributo = array_bonus_feiticos_atributo[nivel_feitico];
    personagem_slots_nivel.cd = 10 + nivel_feitico + bonus_atributo_chave; 

    var slots_por_dia = personagem_slots_nivel.base + personagem_slots_nivel.bonus_atributo;
    personagem_slots_nivel.feiticos.length = slots_por_dia;
    // cria um slot vazio se nao houver.
    for (var i = 0; i < slots_por_dia; ++i) {
      if (personagem_slots_nivel.feiticos[i] == null) {
        personagem_slots_nivel.feiticos[i] = { nome: '', gasto: false };
      }
    }
    // Dominio, apenas para niveis acima do zero.
    if (possui_dominio && 
        (nivel_inicial == 1 || indice > 0) && 
        personagem_slots_nivel.feitico_dominio == null) {
      personagem_slots_nivel.feitico_dominio = { nome: '', gasto: false };
    }
  }
}
