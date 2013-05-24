// Gera os atributos do personagem usando as tabelas do modo.
// @todo submodo.
function _GeraAtributos(modo, submodo) {
  var valores = null;
  if (modo == 'elite') {
    valores = [ 15, 14, 13, 12, 10, 8 ];
  } else {
    valores = [ 13, 12, 11, 10, 9, 8 ];
  }
  if (personagem.classes.length == 0) {
    // Nunca deve acontecer.
    Mensagem('Personagem sem classe');
    return;
  }

  var primeira_classe = personagem.classes[0];
  if (primeira_classe.classe == 'aristocrata' || primeira_classe.classe == 'expert') {
    Mensagem("É recomendado colocar os valores na mão para aristocratas e experts");
  }

  var atributos_primeira_classe = tabelas_geracao[primeira_classe.classe].atributos;
  for (var i = 0; i < valores.length; ++i) {
    personagem.atributos[atributos_primeira_classe[i]].base = valores[i];
  }

  // Incrementa o atributo mais valioso do personagem
  var atributo_mais_valioso = atributos_primeira_classe[0];
  for (var i = personagem.atributos.pontos.disponiveis; i > 0; --i) {
    personagem.atributos.pontos.gastos.push(atributo_mais_valioso);
    ++personagem.atributos[atributo_mais_valioso].bonus_nivel;
  }
  personagem.atributos.pontos.disponiveis = 0;
}

// Gera os pontos de vida do personagem de acordo com as classes.
// @param modo pode ser elite, comum, personagem.
// @param submodo 'tabelado' ou 'aleatorio'.
function _GeraPontosDeVida(modo, submodo) {
  if (modo != 'personagem' && modo != 'elite' && modo != 'comum') {
    Mensagem('Modo ' + modo + ' invalido. Deve ser elite, comum ou personagem.');
    return;
  }
  // Para cada classe, rolar o dado.
  var total_pontos_vida = 0;
  // Primeiro eh diferente na elite e personagem.
  var primeiro = (modo == 'comum') ? false : true;
  for (var i = 0; i < personagem.classes.length; ++i) {
    var info_classe = personagem.classes[i];
    for (var j = 0; j < info_classe.nivel; ++j) {
      var pontos_vida_nivel = 0;
      if (primeiro) {
        if (modo == 'elite') {
          pontos_vida_nivel = tabelas_classes[info_classe.classe].dados_vida;
        } else if (modo == 'personagem') {
          // O modificador de constituicao eh subtraido aqui pq sera adicionado 
          // no calculo de pontos de vida, nos bonus.
          pontos_vida_nivel = tabelas_classes[info_classe.classe].dados_vida +
              personagem.atributos['constituicao'].valor -  
              personagem.atributos['constituicao'].modificador;
        } else {
          pontos_vida_nivel = submodo == 'tabelado' ?
              tabelas_classes[info_classe.classe].dados_vida / 2 :
              Rola(1, tabelas_classes[info_classe.classe].dados_vida);
        }
        primeiro = false;
      } else {
        pontos_vida_nivel = submodo == 'tabelado' ?
            tabelas_classes[info_classe.classe].dados_vida / 2 :
            Rola(1, tabelas_classes[info_classe.classe].dados_vida);

      }
      // Nunca pode ganhar menos de 1 ponto por nivel.
      if (pontos_vida_nivel < 1) {
        pontos_vida_nivel = 1;
      }
      total_pontos_vida += pontos_vida_nivel;
    }
  }
  personagem.pontos_vida.total_dados = Math.floor(total_pontos_vida);
}

// Gera os equipamentos que nao afetam outras coisas (ou ainda nao implementados)
// como moedas. Assume um personagem do nivel da primeira classe.
function _GeraEquipamentos(tabela_geracao_classe_por_nivel) {
  for (var chave_moeda in tabela_geracao_classe_por_nivel.moedas) {
    personagem.moedas[chave_moeda] = tabela_geracao_classe_por_nivel.moedas[chave_moeda];
  }
}

function _GeraArmaduras(tabela_geracao_classe_por_nivel) {
  var tabela = tabela_geracao_classe_por_nivel;
  personagem.armaduras.length = 0;
  if (tabela.armadura != null) {
    var entrada_armadura = {
      entrada: {
        chave: tabela.armadura.nome,
        obra_prima: tabela.armadura.obra_prima || false,
        bonus: tabela.armadura.bonus || 0,
        em_uso: true,
      },
    };
    personagem.armaduras.push(entrada_armadura);
  }

  personagem.escudos.length = 0;
  if (tabela.escudo != null) {
    var entrada_escudo = {
      entrada: {
        chave: tabela.escudo.nome,
        obra_prima: tabela.escudo.obra_prima || false,
        bonus: tabela.escudo.bonus || 0,
        em_uso: true,
      },
    };
    personagem.escudos.push(entrada_escudo);
  }
}

function _GeraArmas(tabela_geracao_classe_por_nivel) {
  // Mantem desarmado.
  personagem.armas.length = 1;
  with (tabela_geracao_classe_por_nivel) {
    for (var i = 0; i < armas.length; ++i) {
      var arma_entrada = { 
          entrada: { 
              chave: armas[i].chave, 
              bonus: armas[i].bonus, 
              obra_prima: armas[i].obra_prima 
          } 
      };
      personagem.armas.push(arma_entrada);
    }
  }
}

// @param tipo_item o tipo do item sendo gerado (aneis, amuletos etc).
function _GeraItens(tipo_item, tabela_geracao_classe_por_nivel) {
  personagem[tipo_item].length = 0;
  if (tabela_geracao_classe_por_nivel[tipo_item] == null) {
    // Sem itens do tipo.
    return;
  }
  for (var i = 0; i < tabela_geracao_classe_por_nivel[tipo_item].length; ++i) {
    var item = tabela_geracao_classe_por_nivel[tipo_item][i];
    var item_entrada = { 
        chave: item.chave, 
        em_uso: item.em_uso,
    };
    personagem[tipo_item].push(item_entrada);
  }
}

// Gera um personagem a partir das classes e niveis.
// @param modo 'elite' ou 'comum'.
// @param submodo opcional 'tabelado' ou 'aleatorio'.
function GeraPersonagem(modo, submodo) {
  PersonagemLimpaGeral();
  if (!submodo) {
    submodo = 'tabelado';
  }
  if (tabelas_geracao[personagem.classes[0].classe] == null) {
    Mensagem('Geração de ' + personagem.classes[0].classe + ' não disponível');
    return;
  }
  _GeraAtributos(modo, submodo);
  _GeraPontosDeVida(modo, submodo);

  // Atualiza aqui para ja ter alguns numeros usados abaixo.
  AtualizaGeralSemConverterEntradas();

  var tabelas_geracao_classe = tabelas_geracao[personagem.classes[0].classe];
  if (tabelas_geracao_classe.por_nivel == null ||
      tabelas_geracao_classe.por_nivel[personagem.classes[0].nivel] == null) {
    Mensagem('Geração avançada de ' + personagem.classes[0].classe + ' não disponível');
    return;
  }
  var tabela_geracao_classe_por_nivel =
      tabelas_geracao_classe.por_nivel[personagem.classes[0].nivel];

  _GeraEquipamentos(tabela_geracao_classe_por_nivel);
  _GeraArmaduras(tabela_geracao_classe_por_nivel);
  _GeraArmas(tabela_geracao_classe_por_nivel);
  var tipos_items = [ 'aneis', 'amuletos', 'capas' ];
  for (var i = 0; i < tipos_items.length; ++i ) {
    _GeraItens(tipos_items[i], tabela_geracao_classe_por_nivel);
  }
  /*
  _GeraEstilosDeLuta();
  _GeraTalentos();
  */
  _GeraPericias(tabelas_classes[personagem.classes[0].classe], 
                tabelas_geracao_classe, 
                personagem.classes[0].nivel);
  /*
  _GeraFeiticos();
  */
  AtualizaGeralSemConverterEntradas();
}

// Gera as pericias do personagem de forma tabelada.
function _GeraPericias(tabela_classe, tabela_geracao_classe, nivel) {
  if (tabela_geracao_classe.ordem_pericias == null) {
    // Nao possui ordem das pericias.
    return;
  }
  // Pra simplificar, usa so o basico + inteligencia.
  var num_pericias = tabela_classe.pontos_pericia + personagem.atributos['inteligencia'].modificador;
  var max_pontos = nivel + 3;
  for (var i = 0; i < num_pericias && i < tabela_geracao_classe.ordem_pericias.length; ++i) {
    personagem.pericias.lista[tabela_geracao_classe.ordem_pericias[i]].pontos = max_pontos;
  }
}

// Gera o resumo para uma arma do estilo.
function GeraResumoArmaEstilo(arma_personagem, primaria, estilo) {
  var resumo = '';
  var arma_estilo = primaria ? estilo.arma_primaria : estilo.arma_secundaria;
  for (var categoria in arma_estilo.bonus_por_categoria) {
    var bonus = arma_estilo.bonus_por_categoria[categoria];
    resumo += categoria + ': ' + StringSinalizada(bonus.ataque) + ', ';
    var arma_tabela = arma_personagem.arma_tabela;
    if (estilo.nome == 'arma_dupla' && !primaria) {
      resumo += arma_tabela.dano_secundario[personagem.tamanho.categoria];
    } else {
      resumo += arma_tabela.dano[personagem.tamanho.categoria];
    }
    resumo += StringSinalizada(bonus.dano, false) + '; ';
  }
  return resumo.slice(0, -2);
}

// String de resumo para um estilo de luta.
function _GeraResumoEstilo(estilo) {
  var resumo = estilo.nome + ': (';
  resumo += estilo.arma_primaria.nome + ': [' + 
      GeraResumoArmaEstilo(
        ArmaPersonagem(estilo.arma_primaria.nome), true, estilo) + ']';
  if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    resumo += ', ' + estilo.arma_secundaria.nome + ': [' + 
        GeraResumoArmaEstilo(
            ArmaPersonagem(estilo.arma_secundaria.nome), false, estilo) + ']';
  }
  resumo += ')';
  return resumo;
}

// @return a string com o resumo do personagem.
function GeraResumo() {
  // TODO(terminar resumo)
  var resumo =
    personagem.nome + '; ' + personagem.raca + '; ' + 
    'Tend: ' + personagem.alinhamento.toUpperCase() + ', ' +
    'Tam: ' + personagem.tamanho.categoria +
    '; ';
  // Dados de vida e pontos de vida.
  resumo += 
    'DV: ' + PersonagemStringDadosVida() + 
    ', pv: ' + personagem.pontos_vida.total + '; ';

  for (var i = 0; i < personagem.classes.length; ++i) {
    var info_classe = personagem.classes[i];
    resumo += tabelas_classes[info_classe.classe].nome + ': ' + info_classe.nivel + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // combate:
  resumo += 'Iniciativa: ' + personagem.iniciativa.Total() + '; ';
  resumo += 'BBA: ' + StringSinalizada(personagem.bba) + '; ';
  resumo += 'Número de Ataques: ' + personagem.numero_ataques + '; ';
  resumo += 'BBA cac: ' + StringSinalizada(personagem.bba_cac) + '/';
  resumo += 'Agarrar: ' + StringSinalizada(personagem.agarrar) + '; ';
  resumo += 'BBA distância: ' + StringSinalizada(personagem.bba_distancia) + '; ';
  resumo += 'Estilos: ';
  for (var i = 0; i < personagem.estilos_luta.length; ++i) {
    resumo += _GeraResumoEstilo(personagem.estilos_luta[i]) + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';
  resumo += 'Classe de Armadura: total ' + (10 + personagem.ca.bonus.Total()) + ', ';
  resumo += 'surpreso ' + (10 + personagem.ca.bonus.Total(['atributo'])) + ', ';
  resumo += 'toque ' + 
      (10 + personagem.ca.bonus.Total(
          ['armadura', 'escudo', 'armadura_melhoria', 'escudo_melhoria', 'armadura_natural'])) + '; ';

  // Pericias: apenas as rankeadas.
  resumo += 'Perícias (total ' + personagem.pericias.total_pontos + '): ';
  if (personagem.pericias.pontos_gastos < personagem.pericias.total_pontos) {
    resumo += 'INCOMPLETO! ';
  }
  for (var chave_pericia in personagem.pericias.lista) {
    var pericia_personagem = personagem.pericias.lista[chave_pericia];
    if (pericia_personagem.pontos > 0) {
      resumo += 
          tabelas_pericias[chave_pericia].nome + ' ' + 
          StringSinalizada(pericia_personagem.total, true) +
          ', ';
    }
  }
  resumo = resumo.slice(0, -2) + '; ';
  // Talentos.
  resumo += 'Talentos: '
  for (var categoria in personagem.talentos) {
    var talentos_categoria = personagem.talentos[categoria];
    for (var i = 0; i < talentos_categoria.length; ++i) {
      var talento = talentos_categoria[i];
      resumo += tabelas_talentos[talento.chave].nome;
      if (talento.complemento != null) {
        resumo += ' (' + talento.complemento + ')';
      }
      resumo += ', ';
    }
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Salvacoes.
  resumo += 'Testes de Resistência: ';
  for (var tipo_salvacao in personagem.salvacoes) {
    var salvacao = personagem.salvacoes[tipo_salvacao];
    var nome_salvacao = tipo_salvacao in tabelas_nome_salvacao ?
        tipo_salvacao.substr(0, 3) : tipo_salvacao;
    resumo += nome_salvacao + ': ' + StringSinalizada(salvacao.total, true) + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Habilidades especiais.
  resumo += 'Habilidades especiais: ';
  for (var chave in personagem.habilidades) {
    resumo += tabelas_habilidades[chave].nome + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Atributos.
  for (var atributo in tabelas_atributos) {
    resumo += tabelas_atributos[atributo].substr(0, 3) + ': ' + personagem.atributos[atributo].valor + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';
  
  // Itens. TODO nome correto.
  for (var tipo_item in tabelas_itens_nova) {
    if (personagem[tipo_item].length > 0) {
      resumo += tabelas_itens_nova[tipo_item].nome + ': ';
      for (var i = 0; i < personagem[tipo_item].length; ++i) {
        var item = tabelas_itens_nova[tipo_item].tabela[personagem[tipo_item][i].chave];
        resumo += item.nome + ', ';
      }
      resumo = resumo.slice(0, -2) + '; ';
    }
  }

  // TODO: so imprimir se tiver feiticos.
  // TODO: classe de dificuldade, conhecidos.
  // Feiticos: por classe, por nivel.
  resumo += 'Feitiços por classe: ';
  for (var chave_classe in personagem.feiticos) {
    if (!personagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    var slots_classe = personagem.feiticos[chave_classe].slots;
    resumo += '(' + tabelas_classes[chave_classe].nome + ': ';
    for (var nivel_slot in slots_classe) {
      var slots_nivel = slots_classe[nivel_slot];
      if (slots_nivel.feiticos.length == 0) {
        break;
      }
      resumo += nivel_slot + '- ';
      for (var i = 0; i < slots_nivel.feiticos.length; ++i) {
        resumo += slots_nivel.feiticos[i].nome + ', ';
      }
      if (slots_nivel.feitico_dominio) {
        resumo += slots_nivel.feitico_dominio.nome + '*, ';
      }
      resumo = resumo.slice(0, -2) + '; ';
    }
    resumo = resumo.slice(0, -2) + ')';
  }
  resumo += '; ';

  // Notas.
  resumo += personagem.notas + '; ';

  return resumo;
}
