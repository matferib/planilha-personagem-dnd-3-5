// Apenas tratamento de eventos.
goog.require('goog.json');

// Chamado pelo carregamento inicial da pagina.
function CarregamentoInicial() {
	var indice_igual = document.URL.indexOf('=');
	if (indice_igual == -1) {
		// Comeca do zero.
		AdicionaClasse();
    CarregaTabelaArmas();
    CarregaTabelaArmasDistancia();
	}
	else {
		// carrega pelos parametros.
		var json_personagem = decodeURIComponent(document.URL.slice(indice_igual + 1));
		entradas = goog.json.parse(json_personagem);
		EscreveEntradas();
	}
	AtualizaGeral();
}

// Botao de adicionar classe apertado.
function ClickAdicionaClasse() {
	var classes_desabilitadas = [];
	//for (var i = 0; i < personagem.classes.length; ++i) {
	//	classes_desabilitadas.push(personagem.classes[i].classe);
	//}
	AdicionaClasse(classes_desabilitadas);
	AtualizaGeral();
}

// Botao de remover classe apertado.
function ClickRemoveClasse() {
	RemoveClasse();
	AtualizaGeral();
}

// Codifica o objeto personagem como JSON.
function ClickSalvar() {
	AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
	var indice_interrogacao = document.URL.indexOf('?');
	var url = 
		(indice_interrogacao != -1 ?  document.URL.slice(0, indice_interrogacao) : document.URL) + 
		'?pc=' + encodeURIComponent(goog.json.serialize(entradas));
	goog.dom.getElement("link-personagem").innerHTML = 
		'<a href="' + url + '">Link</a>';
}

// Gera o resumo do personagem para utilizacao em aventuras. 
function ClickGerarResumo() {
	AtualizaGeral();  // garante o preenchimento do personagem com tudo que ta na planilha.
  // TODO(terminar resumo)
  var resumo = personagem.nome + '; ' + personagem.raca + '; ';
  for (var i = 0; i < personagem.classes.length; ++i) {
    var info_classe = personagem.classes[i];
    resumo += info_classe.classe + ': ' + info_classe.nivel + ', ';
  }
	goog.dom.getElement("resumo-personagem").innerHTML = resumo; 

}

// Gera os pontos de vida do personagem de acordo com as classes.
// TODO personagens elite recebem maximo no primeiro nivel.
function ClickGerarPontosDeVida() {
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
function ClickGerarAleatorio() {
  var atributos = [ FORCA, DESTREZA, CONSTITUICAO, INTELIGENCIA, SABEDORIA, CARISMA ];
  for (var i = 0; i < atributos.length; ++i) {
    goog.dom.getElement(atributos[i] + VALOR_BASE).value = Rola(3, 6);
  }
  AtualizaGeral();
}

// Gera os atributos do personagem rolando 4d6 menos o menor.
function ClickGerarAleatorioHeroi() {
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
function ClickGerarElite() {
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
function ClickGerarComum() {
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

function ClickAdicionarArma() {
}

function ClickAdicionarArmaDistancia() {
}
