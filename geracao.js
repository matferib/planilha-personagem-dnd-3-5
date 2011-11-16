// Gera os pontos de vida do personagem de acordo com as classes.
// TODO personagens elite recebem maximo no primeiro nivel.
function GeraPontosDeVida() {
  // Para cada classe, rolar o dado.
  var total_pontos_vida = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
    var info_classe = personagem.classes[i];
    for (var j = 0; j < info_classe.nivel; ++j) {
      total_pontos_vida += 
        Math.floor((Math.random() * tabelas_dados_vida[info_classe.classe])) + 1;
    }
  }
  goog.dom.getElement(PONTOS_VIDA_TOTAL).value = 
    total_pontos_vida;
  AtualizaGeral();
}

// Gera os atributos do personagem rolando 3d6 para cada um.
function GeraAleatorio() {
  var atributos = [ FORCA, DESTREZA, CONSTITUICAO, INTELIGENCIA, SABEDORIA, CARISMA ];
  for (var i = 0; i < atributos.length; ++i) {
    goog.dom.getElement(atributos[i] + VALOR_BASE).value = Rola(3, 6);
  }
  AtualizaGeral();
}

// Gera os atributos do personagem rolando 4d6 menos o menor.
function GeraAleatorioElite() {
  var atributos = [ FORCA, DESTREZA, CONSTITUICAO, INTELIGENCIA, SABEDORIA, CARISMA ];
  //var rolagens = [];
  for (var i = 0; i < atributos.length; ++i) {
    var total = 0;
    var menor = 7;
    for (var j = 0; j < 4; ++j) {
      var rolagem = Rola(1, 6);
      //rolagens.push(rolagem);
      if (rolagem < menor) {
        menor = rolagem;
      }
      total += rolagem;
    }
    goog.dom.getElement(atributos[i] + VALOR_BASE).value = total - menor;
  }
  AtualizaGeral();
}

// Gera os atributos do personagem usando o 'elite array'. Usa a primeira classe.
function GeraElite() {
  if (personagem.classes.length == 0) {
    // Nunca deve acontecer.
    alert('Personagem sem classe');
    return;
  }

  var primeira_classe = personagem.classes[0];
  if (primeira_classe.classe == ARISTOCRATA || primeira_classe.classe == EXPERT) {
    alert("É recomendado colocar os valores na mão para aristocratas e experts");
  }

  var valores = [ 15, 14, 13, 12, 10, 8 ];
  for (var i = 0; i < valores.length; ++i) {
    goog.dom.getElement(tabelas_geracao_atributos[primeira_classe.classe][i]  + VALOR_BASE).value = valores[i];
  }
  AtualizaGeral();
}

// Gera os atributos do personagem usando o 'non elite array'. Usa a primeira classe.
function GeraComum() {
  if (personagem.classes.length == 0) {
    // Nunca deve acontecer.
    alert('Personagem sem classe');
    return;
  }

  var primeira_classe = personagem.classes[0];
  if (primeira_classe.classe == ARISTOCRATA || primeira_classe.classe == EXPERT) {
    alert("É recomendado colocar os valores na mão para aristocratas e experts");
  }

  var valores = [ 13, 12, 11, 10, 9, 8 ];
  for (var i = 0; i < valores.length; ++i) {
    goog.dom.getElement(tabelas_geracao_atributos[primeira_classe.classe][i]  + VALOR_BASE).value = valores[i];
  }
  AtualizaGeral();
}

