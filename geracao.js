// Gera os atributos do personagem usando as tabelas do modo.
// @todo submodo.
function _GeraAtributos(modo, submodo) {
  var valores = null;
  if (modo == 'elite') {
    valores = [ 15, 14, 13, 12, 10, 8 ];
  } else {
    valores = [ 13, 12, 11, 10, 9, 8 ];
  }
  if (gPersonagem.classes.length == 0) {
    // Nunca deve acontecer.
    Mensagem('Personagem sem classe');
    return;
  }

  var primeira_classe = gPersonagem.classes[0];
  if (primeira_classe.classe == 'aristocrata' || primeira_classe.classe == 'expert') {
    Mensagem("É recomendado colocar os valores na mão para aristocratas e experts");
  }

  var atributos_primeira_classe = tabelas_geracao[primeira_classe.classe].atributos;
  for (var i = 0; i < valores.length; ++i) {
    gPersonagem.atributos[atributos_primeira_classe[i]].bonus.Adiciona('base', null, valores[i]);
  }

  // Incrementa o atributo mais valioso do personagem
  var atributo_mais_valioso = atributos_primeira_classe[0];
  for (var i = gPersonagem.atributos.pontos.disponiveis; i > 0; --i) {
    gPersonagem.atributos.pontos.gastos.push(atributo_mais_valioso);
    ++gPersonagem.atributos[atributo_mais_valioso].bonus_nivel;
  }
  gPersonagem.atributos.pontos.disponiveis = 0;
}

// Gera os pontos de vida do personagem de acordo com as classes.
// @param modo pode ser elite, comum, personagem.
// @param submodo 'tabelado' ou 'aleatorio'.
function _GeraPontosDeVida(modo, submodo) {
  if (modo != 'personagem' && modo != 'elite' && modo != 'comum') {
    Mensagem(Traduz('Modo') + ' ' + modo + ' ' + Traduz('invalido') + '. ' + Traduz('Deve ser elite, comum ou personagem.'));
    return;
  }
  // Para cada classe, rolar o dado.
  var total_pontos_vida = 0;
  // Primeiro eh diferente na elite e personagem.
  var primeiro = (modo == 'comum') ? false : true;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var info_classe = gPersonagem.classes[i];
    for (var j = 0; j < info_classe.nivel; ++j) {
      var pontos_vida_nivel = 0;
      var template_personagem = PersonagemTemplate();
      var dados_vida = template_personagem != null && 'dados_vida' in template_personagem ?
          template_personagem.dados_vida :
          tabelas_classes[info_classe.classe].dados_vida;
      if (primeiro) {
        if (modo == 'elite') {
          pontos_vida_nivel = dados_vida;
        } else if (modo == 'personagem') {
          // O modificador de constituicao eh subtraido aqui pq sera adicionado
          // no calculo de pontos de vida, nos bonus.
          pontos_vida_nivel = dados_vida +
              gPersonagem.atributos['constituicao'].valor -
              gPersonagem.atributos['constituicao'].modificador;
        } else {
          pontos_vida_nivel = submodo == 'tabelado' ? dados_vida / 2 : Rola(1, dados_vida);
        }
        primeiro = false;
      } else {
        pontos_vida_nivel = submodo == 'tabelado' ? dados_vida / 2 : Rola(1, dados_vida);

      }
      // Nunca pode ganhar menos de 1 ponto por nivel.
      if (pontos_vida_nivel < 1) {
        pontos_vida_nivel = 1;
      }
      total_pontos_vida += pontos_vida_nivel;
    }
  }
  gPersonagem.pontos_vida.total_dados = Math.floor(total_pontos_vida);
}

// Gera os equipamentos que nao afetam outras coisas (ou ainda nao implementados)
// como moedas. Assume um personagem do nivel da primeira classe.
function _GeraEquipamentos(tabela_geracao_classe_por_nivel) {
  for (var chave_moeda in tabela_geracao_classe_por_nivel.moedas) {
    gPersonagem.moedas[chave_moeda] = tabela_geracao_classe_por_nivel.moedas[chave_moeda];
  }
}

function _GeraArmaduras(tabela_geracao_classe_por_nivel) {
  var tabela = tabela_geracao_classe_por_nivel;
  gPersonagem.armaduras.length = 0;
  if (tabela.armadura != null) {
    var entrada_armadura = {
      entrada: {
        chave: tabela.armadura.nome,
        obra_prima: tabela.armadura.obra_prima || false,
        bonus: tabela.armadura.bonus || 0,
        em_uso: true,
      },
    };
    gPersonagem.armaduras.push(entrada_armadura);
  }

  gPersonagem.escudos.length = 0;
  if (tabela.escudo != null) {
    var entrada_escudo = {
      entrada: {
        chave: tabela.escudo.nome,
        obra_prima: tabela.escudo.obra_prima || false,
        bonus: tabela.escudo.bonus || 0,
        em_uso: true,
      },
    };
    gPersonagem.escudos.push(entrada_escudo);
  }
}

function _GeraArmas(tabela_geracao_classe_por_nivel) {
  // Mantem desarmado.
  gPersonagem.armas.length = 1;
  if (!('armas' in tabela_geracao_classe_por_nivel)) {
    return;
  }
  for (var i = 0; i < tabela_geracao_classe_por_nivel.armas.length; ++i) {
    var arma_entrada = {
        entrada: {
            chave: tabela_geracao_classe_por_nivel.armas[i].chave,
            bonus: tabela_geracao_classe_por_nivel.armas[i].bonus,
            obra_prima: tabela_geracao_classe_por_nivel.armas[i].obra_prima
        }
    };
    gPersonagem.armas.push(arma_entrada);
  }
}

// @param tipo_item o tipo do item sendo gerado (aneis, amuletos etc).
function _GeraItens(tipo_item, tabela_geracao_classe_por_nivel) {
  gPersonagem[tipo_item].length = 0;
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
    gPersonagem[tipo_item].push(item_entrada);
  }
}

// Gera um personagem a partir das classes e niveis.
// @param modo 'elite' ou 'comum'.
// @param submodo opcional 'tabelado' ou 'aleatorio'.
// TODO refazer essa funcao gerando tudo a partir das entradas para nao ficar essa coisa de ir do personagem para as entradas e voltar.
function GeraPersonagem(modo, submodo) {
  if (!submodo) {
    submodo = 'tabelado';
  }
  var classe_principal = gPersonagem.classes[0];
  if (tabelas_geracao[classe_principal.classe] == null) {
    Mensagem(Traduz('Geração de ') + Traduz(tabelas_classes[gPersonagem.classes[0].classe].nome) + ' ' + Traduz('não disponível'));
    return;
  }
  var tabelas_geracao_classe = tabelas_geracao[classe_principal.classe];
  // So pode limpar aqui, pois isso zerara as classes.
  PersonagemLimpaGeral();
  gPersonagem.classes.push(classe_principal);
  _GeraAtributos(modo, submodo);
  _GeraPontosDeVida(modo, submodo);

  // Atualiza aqui para ja ter alguns numeros usados abaixo.
  AtualizaGeralSemConverterEntradas();

  if (tabelas_geracao_classe.por_nivel == null ||
      tabelas_geracao_classe.por_nivel[gPersonagem.classes[0].nivel] == null) {
    Mensagem(Traduz('Geração avançada de ') + Traduz(tabelas_classes[gPersonagem.classes[0].classe].nome) + ' ' + Traduz('não disponível'));
    return;
  }
  var tabela_geracao_classe_por_nivel =
      tabelas_geracao_classe.por_nivel[gPersonagem.classes[0].nivel];

  _GeraEquipamentos(tabela_geracao_classe_por_nivel);
  _GeraArmaduras(tabela_geracao_classe_por_nivel);
  _GeraArmas(tabela_geracao_classe_por_nivel);
  var tipos_items = [ 'aneis', 'amuletos', 'capas', 'bracaduras' ];
  for (var i = 0; i < tipos_items.length; ++i ) {
    _GeraItens(tipos_items[i], tabela_geracao_classe_por_nivel);
  }
  /*
  _GeraEstilosDeLuta();
  */
  _GeraTalentos(gPersonagem.classes[0].classe,
                tabelas_classes[gPersonagem.classes[0].classe],
                tabelas_geracao_classe,
                gPersonagem.classes[0].nivel);
  _GeraPericias(tabelas_classes[gPersonagem.classes[0].classe],
                tabelas_geracao_classe,
                gPersonagem.classes[0].nivel);
  _GeraFeiticos();
  // Importante regerar aqui para evitar duplicacoes.
  gPersonagem.especiais = {};
  AtualizaGeralSemConverterEntradas();
  LeEntradas();  // importante, pois as entradas estao vazias. Isso efetivamente salva o personagem.
}

function _GeraTalentos(chave_classe, tabela_classe, tabela_geracao_classe, nivel) {
  if (tabela_geracao_classe.talentos == null) {
    // Nao possui talentos.
    return;
  }
  var indice_geracao = 0;
  var tipos_talentos = [ chave_classe, 'gerais' ];
  for (var ti = 0; ti < tipos_talentos.length; ++ti) {
    var tipo_talento = tipos_talentos[ti];
    for (var i = 0;
         (tipo_talento in gPersonagem.talentos) && (i < gPersonagem.talentos[tipo_talento].length) &&
         indice_geracao < tabela_geracao_classe.talentos.length;
         ++i, ++indice_geracao) {
      gPersonagem.talentos[tipo_talento][i] = { chave: tabela_geracao_classe.talentos[indice_geracao], complemento: '' };
    }
  }
}

// Gera as pericias do personagem de forma tabelada.
function _GeraPericias(tabela_classe, tabela_geracao_classe, nivel) {
  if (tabela_geracao_classe.ordem_pericias == null) {
    // Nao possui ordem das pericias.
    return;
  }
  // Pra simplificar, usa so o basico + inteligencia.
  var num_pericias = tabela_classe.pontos_pericia + gPersonagem.atributos['inteligencia'].modificador;
  var max_pontos = nivel + 3;
  for (var i = 0; i < num_pericias && i < tabela_geracao_classe.ordem_pericias.length; ++i) {
    gPersonagem.pericias.lista[tabela_geracao_classe.ordem_pericias[i]].pontos = max_pontos;
  }
}

// Gera os feiticos para as classes do personagem.
function _GeraFeiticos() {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var classe_personagem = gPersonagem.classes[i];
    var chave_classe = gPersonagem.classes[i].classe;
    // Tabela de geracao da classe.
    if (!(chave_classe in tabelas_geracao)) {
      continue;
    }
    // Tabela de feiticos da classe.
    if (!(chave_classe in tabelas_feiticos)) {
      continue;
    }
    if (!(chave_classe in gPersonagem.feiticos)) {
      continue;
    }
    _GeraFeiticosClasse(
        classe_personagem, gPersonagem.feiticos[chave_classe], tabelas_geracao[chave_classe], tabelas_lista_feiticos[chave_classe]);
  }
}

// Percorre os niveis de feiticos da classe do personagem.
// @param classe estrutura do tipo gPersonagem.classes[i].
// @param feiticos_classe estrutura do tipo gPersonagem.feiticos[chave_classe].
// @param tabela_geracao_classe a tabela de geracao para a classe passada.
// @param lista_feiticos_classe a tabela com a lista de feiticos da classe.
function _GeraFeiticosClasse(classe_personagem, feiticos_classe, tabela_geracao_classe, lista_feiticos_classe) {
  for (var nivel in feiticos_classe.slots) {
    if (!('ordem_magias' in tabela_geracao_classe) || !(nivel in tabela_geracao_classe.ordem_magias)) {
      continue;
    }
    _GeraFeiticosClasseNivel(classe_personagem,
                             nivel,
                             feiticos_classe.conhecidos[nivel],
                             feiticos_classe.slots[nivel],
                             tabela_geracao_classe.ordem_magias[nivel],
                             (lista_feiticos_classe != null) && (nivel in lista_feiticos_classe) ? lista_feiticos_classe[nivel] : {});
  }
}

// Gera os feiticos de um determinado nivel para a classe.
// @param classe estrutura do tipo gPersonagem.classes[i].
// @param conhecidos_nivel array do tipo gPersonagem.feiticos[chave_classe].conhecidos[nivel].
// @param slots_nivel estrutura do tipo gPersonagem.feiticos[chave_classe].slots[nivel].
// @param ordem_magias array com a preferencia de ordem das magias para o nivel.
// @param lista_feiticos_classe_nivel.
function _GeraFeiticosClasseNivel(classe_personagem, nivel, conhecidos_nivel, slots_nivel, ordem_magias, lista_feiticos_classe_nivel) {
  // Preenche conhecidos para ter referencia.
  if (!tabelas_feiticos[classe_personagem.classe].precisa_conhecer) {
    conhecidos_nivel.length = ordem_magias.length;
  }
  for (var i = 0; i < conhecidos_nivel.length && i < ordem_magias.length; ++i) {
    conhecidos_nivel[i] = ordem_magias[i] in lista_feiticos_classe_nivel ? lista_feiticos_classe_nivel[ordem_magias[i]].nome : ordem_magias[i];
  }
  // Preenche os slots, fazendo referencia aos conhecidos.
  var indice_geracao = 0;
  for (var i = 0; i < slots_nivel.feiticos.length; ++i) {
    slots_nivel.feiticos[i].nivel_conhecido = nivel;
    slots_nivel.feiticos[i].indice_conhecido = indice_geracao++;
    indice_geracao = indice_geracao % ordem_magias.length;
  }
}

// Gera o resumo para uma arma do estilo.
function GeraResumoArmaEstilo(arma_personagem, primaria, estilo) {
  var resumo = '';
  var arma_estilo = primaria ? estilo.arma_primaria : estilo.arma_secundaria;
  for (var categoria in arma_estilo.bonus_por_categoria) {
    var bonus = arma_estilo.bonus_por_categoria[categoria];
    var string_ataque = '';
    bonus.ataque.forEach(function(at) {
      string_ataque += StringSinalizada(at) + '/';
    });
    string_ataque = string_ataque.slice(0, -1);
    resumo += Traduz(categoria) + ': ' + string_ataque + ', ';
    var arma_tabela = arma_personagem.arma_tabela;
    var nivel_monge = PersonagemNivelClasse('monge');
    if (estilo.nome == 'arma_dupla' && !primaria) {
      resumo += arma_tabela.dano_secundario[gPersonagem.tamanho.categoria];
    } else if (arma_personagem.entrada.chave == 'desarmado' && nivel_monge > 0) {
      resumo += tabelas_monge_desarmado[nivel_monge].dano[gPersonagem.tamanho.categoria];
    } else {
      resumo += arma_tabela.dano[gPersonagem.tamanho.categoria];
    }
    resumo += StringSinalizada(bonus.dano, false);
    resumo += ' (' + arma_personagem.critico + ')';
    resumo += '; ';
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
    gPersonagem.nome + '; ' + gPersonagem.raca + '; ' +
    'Tend: ' + gPersonagem.alinhamento.toUpperCase() + ', ' +
    'Tam: ' + gPersonagem.tamanho.categoria +
    '; ';
  // Dados de vida e pontos de vida.
  resumo +=
    'DV: ' + PersonagemStringDadosVida() +
    ', pv: ' + gPersonagem.pontos_vida.total + '; ';

  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var info_classe = gPersonagem.classes[i];
    resumo += tabelas_classes[info_classe.classe].nome + ': ' + info_classe.nivel + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // combate:
  resumo += 'Iniciativa: ' + gPersonagem.iniciativa.Total() + '; ';
  resumo += 'BBA: ' + StringSinalizada(gPersonagem.bba) + '; ';
  resumo += 'Número de Ataques: ' + gPersonagem.numero_ataques + '; ';
  resumo += 'BBA cac: ' + StringSinalizada(gPersonagem.bba_cac) + '/';
  resumo += 'Agarrar: ' + StringSinalizada(gPersonagem.agarrar) + '; ';
  resumo += 'BBA distância: ' + StringSinalizada(gPersonagem.bba_distancia) + '; ';
  resumo += 'Estilos: ';
  for (var i = 0; i < gPersonagem.estilos_luta.length; ++i) {
    resumo += _GeraResumoEstilo(gPersonagem.estilos_luta[i]) + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';
  resumo += 'Classe de Armadura: total ' + (10 + gPersonagem.ca.bonus.Total()) + ', ';
  resumo += 'surpreso ' + (10 + gPersonagem.ca.bonus.Total(['atributo'])) + ', ';
  resumo += 'toque ' +
      (10 + gPersonagem.ca.bonus.Total(
          ['armadura', 'escudo', 'armadura_melhoria', 'escudo_melhoria', 'armadura_natural'])) + '; ';

  // Pericias: apenas as rankeadas.
  resumo += 'Perícias (total ' + gPersonagem.pericias.total_pontos + '): ';
  if (gPersonagem.pericias.pontos_gastos < gPersonagem.pericias.total_pontos) {
    resumo += 'INCOMPLETO! ';
  }
  for (var chave_pericia in gPersonagem.pericias.lista) {
    var pericia_personagem = gPersonagem.pericias.lista[chave_pericia];
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
  for (var categoria in gPersonagem.talentos) {
    var talentos_categoria = gPersonagem.talentos[categoria];
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
  for (var tipo_salvacao in gPersonagem.salvacoes) {
    var salvacao = gPersonagem.salvacoes[tipo_salvacao];
    var nome_salvacao = tipo_salvacao in tabelas_nome_salvacao ?
        tipo_salvacao.substr(0, 3) : tipo_salvacao;
    resumo += nome_salvacao + ': ' + StringSinalizada(salvacao.Total(), true) + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Habilidades especiais.
  resumo += 'Habilidades especiais: ';
  for (var chave in gPersonagem.habilidades) {
    resumo += tabelas_habilidades[chave].nome + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Atributos.
  resumo += 'Atributos: ';
  for (var atributo in tabelas_atributos) {
    resumo += tabelas_atributos[atributo].substr(0, 3) + ': ' + gPersonagem.atributos[atributo].bonus.Total() + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // Itens. TODO nome correto.
  for (var tipo_item in tabelas_itens) {
    if (gPersonagem[tipo_item].length > 0) {
      resumo += tabelas_itens[tipo_item].nome + ': ';
      for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
        var item = tabelas_itens[tipo_item].tabela[gPersonagem[tipo_item][i].chave];
        resumo += item.nome + ', ';
      }
      resumo = resumo.slice(0, -2) + '; ';
    }
  }

  // TODO: classe de dificuldade, conhecidos.
  // Feiticos: por classe, por nivel.
  resumo += 'Feitiços por classe: ';
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    var feiticos_classe = gPersonagem.feiticos[chave_classe];
    var slots_classe = feiticos_classe.slots;
    resumo += '(' + tabelas_classes[chave_classe].nome + ': ';
    if (feiticos_classe.escolas_proibidas.length > 0) {
      resumo += 'escolas proibidas: ';
      for (var i = 0; i < feiticos_classe.escolas_proibidas.length; ++i) {
        resumo += feiticos_classe.escolas_proibidas[i] + ', ';
      }
      resumo = resumo.slice(0, -2) + '; ';
    }
    for (var nivel_slot in slots_classe) {
      var slots_nivel = slots_classe[nivel_slot];
      if (slots_nivel.feiticos.length == 0) {
        break;
      }
      resumo += nivel_slot + '- ';
      for (var i = 0; i < slots_nivel.feiticos.length; ++i) {
        var slot = slots_nivel.feiticos[i];
        resumo += feiticos_classe.conhecidos[slot.nivel_conhecido][slot.indice_conhecido] + ', ';
      }
      resumo = resumo.slice(0, -2) + '; ';
      var slot;
      if (slots_nivel.feitico_dominio) {
        slot = slots_nivel.feitico_dominio;
      }
      if (slots_nivel.feitico_especializado) {
        slot = slots_nivel.feitico_especializado;
      }
      if (slot != null) {
        resumo = resumo.slice(0, -2) + ', ' + feiticos_classe.conhecidos[slot.nivel_conhecido][slot.indice_conhecido] + '*; ';
      }
    }
    resumo = resumo.slice(0, -2) + ')';
  }
  resumo += '; ';

  // Notas.
  resumo += gPersonagem.notas + '; ';

  return resumo;
}
