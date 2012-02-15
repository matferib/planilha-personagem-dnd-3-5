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

// TODO ataque ta sem sinal quando zero e dano ta sem o dado de dano.
function GeraResumoArma(arma_estilo) {
  var resumo = arma_estilo.nome + ' ';
  for (var categoria in arma_estilo.bonus_por_categoria) {
    var bonus_categoria = arma_estilo.bonus_por_categoria[categoria];
    resumo += categoria + ': ';
    resumo += bonus_categoria.ataque + ' ' + bonus_categoria.dano;
  }
  return resumo;
}

// @return a string com o resumo do personagem.
function GeraResumo() {
  // TODO(terminar resumo)
  var resumo = personagem.nome + '; ' + personagem.raca + '; ' + personagem.alinhamento + '; ';
  for (var i = 0; i < personagem.classes.length; ++i) {
    var info_classe = personagem.classes[i];
    resumo += info_classe.classe + ': ' + info_classe.nivel + ', ';
  }
  resumo += '; ';

  for (var atributo in tabelas_atributos) {
    resumo += tabelas_atributos[atributo] + ': ' + personagem.atributos[atributo].valor + ', ';
  }
  resumo += '; ';
  
  // combate:
  resumo += 'Iniciativa: ' + personagem.iniciativa.Total() + '; ';
  resumo += 'Estilos: ';
  for (var i = 0; i < personagem.estilos_luta.length; ++i) {
    var estilo = personagem.estilos_luta[i];
    resumo += estilo.nome + ': (';
    resumo += GeraResumoArma(estilo.arma_primaria);
    if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
      resumo += ', ' + GeraResumoArma(estilo.arma_secundaria);
    }
    resumo += '), ';
  }
  resumo += '; ';


  return resumo;
}
