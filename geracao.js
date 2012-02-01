// Gera os atributos do personagem usando as tabelas do modo.
function _GeraAtributos(modo) {
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
function _GeraPontosDeVida(modo) {
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
          pontos_vida_nivel = Rola(1, tabelas_classes[info_classe.classe].dados_vida);
        }
        primeiro = false;
      } else {
        pontos_vida_nivel = Rola(1, tabelas_classes[info_classe.classe].dados_vida);
      }
      // Nunca pode ganhar menos de 1 ponto por nivel.
      if (pontos_vida_nivel < 1) {
        pontos_vida_nivel = 1;
      }
      total_pontos_vida += pontos_vida_nivel;
    }
  }
  personagem.pontos_vida.total_dados = total_pontos_vida;
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

function _GeraAneis(tabela_geracao_classe_por_nivel) {
  with (tabela_geracao_classe_por_nivel) {
    for (var i = 0; i < aneis.length; ++i) {
      var anel_entrada = { 
          chave: aneis[i].chave, 
          em_uso: aneis[i].em_uso,
      };
      personagem.aneis.push(anel_entrada);
    }
  }
}

// Gera um personagem a partir das classes e niveis.
// @param modo 'elite' ou 'comum'.
function GeraPersonagem(modo) {
  _GeraAtributos(modo);
  _GeraPontosDeVida(modo);

  var tabela_geracao_classe_por_nivel =
      tabelas_geracao[personagem.classes[0].classe].por_nivel[personagem.classes[0].nivel];
  _GeraEquipamentos(tabela_geracao_classe_por_nivel);
  _GeraArmaduras(tabela_geracao_classe_por_nivel);
  _GeraArmas(tabela_geracao_classe_por_nivel);
  _GeraAneis(tabela_geracao_classe_por_nivel);
  /*
  _GeraEstilosDeLuta();
  _GeraTalentos();
  _GeraPericias();
  _GeraFeiticos();
  */
  AtualizaGeralSemConverterEntradas();
}
