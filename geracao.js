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
    alert('Personagem sem classe');
    return;
  }

  var primeira_classe = personagem.classes[0];
  if (primeira_classe.classe == 'aristocrata' || primeira_classe.classe == 'expert') {
    alert("É recomendado colocar os valores na mão para aristocratas e experts");
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
    alert('Modo ' + modo + ' invalido. Deve ser elite, comum ou personagem.');
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
  with (tabela_geracao_classe_por_nivel) {
    personagem.armadura.nome = armadura.nome;
    personagem.armadura.obra_prima = armadura.obra_prima || false;
    personagem.armadura.bonus_magico = armadura.bonus_magico || 0;
  }
}

function _GeraArmas(tabela_geracao_classe_por_nivel) {
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
  if (!submodo) {
    submodo = 'tabelado';
  }
  if (tabelas_geracao[personagem.classes[0].classe] == null) {
    alert('Geração de ' + personagem.classes[0].classe + ' não disponível');
    return;
  }
  _GeraAtributos(modo, submodo);
  _GeraPontosDeVida(modo, submodo);

  var tabelas_geracao_classe = tabelas_geracao[personagem.classes[0].classe];
  if (tabelas_geracao_classe.por_nivel == null ||
      tabelas_geracao_classe.por_nivel[personagem.classes[0].nivel] == null) {
    AtualizaGeralSemConverterEntradas();
    alert('Geração avançada de ' + personagem.classes[0].classe + ' não disponível');
    return;
  }
  var tabela_geracao_classe_por_nivel =
      tabelas_geracao_classe.por_nivel[personagem.classes[0].nivel];

  _GeraEquipamentos(tabela_geracao_classe_por_nivel);
  _GeraArmaduras(tabela_geracao_classe_por_nivel);
  _GeraArmas(tabela_geracao_classe_por_nivel);
  var tipos_items = [ 'aneis', 'amuletos' ];
  for (var i = 0; i < tipos_items.length; ++i ) {
    _GeraItens(tipos_items[i], tabela_geracao_classe_por_nivel);
  }
  /*
  _GeraEstilosDeLuta();
  _GeraTalentos();
  _GeraPericias();
  _GeraFeiticos();
  */
  AtualizaGeralSemConverterEntradas();
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
    resumo += info_classe.classe + ': ' + info_classe.nivel + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

  // combate:
  resumo += 'Iniciativa: ' + personagem.iniciativa.Total() + '; ';
  resumo += 'Estilos: ';
  for (var i = 0; i < personagem.estilos_luta.length; ++i) {
    resumo += _GeraResumoEstilo(personagem.estilos_luta[i]) + ', ';
  }
  resumo = resumo.slice(0, -2) + '; ';

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
  
  // TODO: classe de dificuldade, conhecidos.
  // Feiticos: por classe, por nivel.
  resumo += 'Feitiços por classe: ';
  for (var chave_classe in personagem.feiticos) {
    if (!personagem.feiticos[chave_classe].em_uso) {
      continue;
    }

    resumo += '(' + tabelas_classes[chave_classe].nome + ': ';
    for (var nivel_slot in personagem.feiticos.slots) {
      resumo += nivel_slot + '- ';
      for (var i = 0; i < personagem.feiticos.slots[nivel_slot].feiticos; ++i) {
        resumo += personagem.feiticos.slots[nivel_slot].feiticos[i] + ', ';
      }
      if (personagem.feiticos.slots[nivel_slot].feitico_dominio) {
        resumo += personagem.feiticos.slots[nivel_slot].feitico_dominio + '*, ';
      }
      resumo = resumo.slice(0, -2) + '; ';
    }
    resumo += ')';
  }


  return resumo;
}
