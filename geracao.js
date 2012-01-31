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
}

// Gera um personagem a partir das classes e niveis.
// @param modo 'elite' ou 'comum'.
function GeraPersonagem(modo) {
  _GeraAtributos(modo);
  _GeraPontosDeVida(modo);

  /*
  _GeraEquipamentos();
  _GeraArmas();
  _GeraArmaduras();
  _GeraEstilosDeLuta();
  _GeraTalentos();
  _GeraPericias();
  _GeraFeiticos();
  */
  AtualizaGeralSemConverterEntradas();
}
