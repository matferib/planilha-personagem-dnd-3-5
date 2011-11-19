// Tudo relacionado a entradas. Isso eh o que devera ser
// serializado e deserializado.

// Variavel contendo os valores das entradas.
var entradas = {
  // geral
  nome: "",
  raca: "",
  alinhamento: "",
  // Cada entrada possui classe e nivel.
  classes: [],
  // pontos de vida.
  pontos_vida: 0,
  ferimentos: 0,
  // experiencia.
  experiencia: 0,
  // atributos.
  forca: 10,
  destreza: 10,
  constituicao: 10,
  inteligencia: 10,
  sabedoria: 10,
  carisma: 10,
  // equipamentos.
  armas_cac: [ { nome: '', obra_prima: false, bonus: 0 }, ],
  armas_arremesso: [ { nome: '', obra_prima: false, bonus: 0 }, ],
  armas_distancia: [ { nome: '', obra_prima: false, bonus: 0 }, ],
  armadura: { nome: '', bonus_magico: 0 },
  escudo: { nome: '', bonus_magico: 0 },
  // moedas
  platina: 0,
  ouro: 0,
  prata: 0,
  cobre: 0,
};

// Le todos os inputs da planilha e armazena em 'entradas'. 
function LeEntradas() {
  // nome
  entradas.nome = goog.dom.getElement(NOME).value;
  // raca
  entradas.raca = ValorSelecionado(goog.dom.getElement(RACA));
  // alinhamento
  entradas.alinhamento = ValorSelecionado(goog.dom.getElement(ALINHAMENTO));
  // classes.
  entradas.classes.length = 0;
  var div_classes = goog.dom.getElement(DIV_CLASSES);
  for (var i = 0; i < div_classes.childNodes.length; ++i) {
    var elemento = div_classes.childNodes[i];
    if (elemento.tagName == "DIV") {
      var select = elemento.getElementsByTagName("SELECT")[0];
      var input = elemento.getElementsByTagName("INPUT")[0];
      entradas.classes.push({ 
        classe: ValorSelecionado(select),
        nivel: parseInt(input.value)});
    }
  }
  // pontos de vida e ferimentos.
  entradas.pontos_vida = parseInt(goog.dom.getElement(PONTOS_VIDA_TOTAL).value) || 0;
  entradas.ferimentos = parseInt(goog.dom.getElement(FERIMENTOS).value) || 0;
  // Experiencia.
  entradas.experiencia = parseInt(goog.dom.getElement(PONTOS_EXPERIENCIA).value) || 0;
  // atributos
  var div_atributos = goog.dom.getElement(DIV_STATS);
  for (var i = 0; i < div_atributos.childNodes.length; ++i) {
    var elemento = div_atributos.childNodes[i];
    if (elemento.tagName == "INPUT") {
      entradas[elemento.name] = parseInt(elemento.value);
    }
  }
  // Armas.
  // Corpo a corpo.
  entradas.armas_cac[0].nome =
      ValorSelecionado(goog.dom.getElement(ARMA_CORPO_A_CORPO + "-0"));
  entradas.armas_cac[0].obra_prima =
      goog.dom.getElement(ARMA_CORPO_A_CORPO_OBRA_PRIMA + "-0").checked;
  if (entradas.armas_cac[0].obra_prima) {
    entradas.armas_cac[0].bonus = 0;
  } else {
    entradas.armas_cac[0].bonus =
        parseInt(goog.dom.getElement(BONUS_ARMA_CORPO_A_CORPO + "-0").value) || 0;
  }
  goog.dom.getElement(BONUS_ARMA_CORPO_A_CORPO + "-0").disabled = 
      entradas.armas_cac[0].obra_prima;
  // Distancia.
  // Arremesso.
  entradas.armas_arremesso[0].nome =
      ValorSelecionado(goog.dom.getElement(ARMA_ARREMESSO + "-0"));
  entradas.armas_arremesso[0].bonus =
      parseInt(goog.dom.getElement(BONUS_ARMA_ARREMESSO + "-0").value) || 0;
  // Projetil.
  //entradas.armas_distancia[0].nome =
  //    ValorSelecionado(goog.dom.getElement(ARMA_DISTANCIA + "-0"));
  //entradas.armas_distancia[0].bonus =
  //    parseInt(goog.dom.getElement(BONUS_ARMA_DISTANCIA + "-0").value) || 0;

  // Armadura e escudo.
  entradas.armadura.nome = 
      ValorSelecionado(goog.dom.getElement(ARMADURA)); 
  entradas.armadura.bonus_magico = 
      parseInt(goog.dom.getElement(BONUS_ARMADURA).value) || 0; 
  entradas.escudo.nome = 
      ValorSelecionado(goog.dom.getElement(ESCUDO));
  entradas.escudo.bonus_magico = 
      parseInt(goog.dom.getElement(BONUS_ESCUDO).value) || 0;

  // Moedas
  entradas.platina = parseInt(goog.dom.getElement(MOEDAS_PLATINA).value);
  entradas.ouro = parseInt(goog.dom.getElement(MOEDAS_OURO).value);
  entradas.prata = parseInt(goog.dom.getElement(MOEDAS_PRATA).value);
  entradas.cobre = parseInt(goog.dom.getElement(MOEDAS_COBRE).value);
}

// Escreve todos os inputs com os valores de 'entradas'.
function EscreveEntradas() {
  // nome
  goog.dom.getElement(NOME).value = entradas.nome;
  // raca
  SelecionaValor(entradas.raca, goog.dom.getElement(RACA));
  // alinhamento
  SelecionaValor(entradas.alinhamento, goog.dom.getElement(ALINHAMENTO));
  // classes.
  var classes_desabilitadas = [];
  for (var i = 0; i < entradas.classes.length; ++i) {
    AdicionaClasse(classes_desabilitadas, entradas.classes[i].classe, entradas.classes[i].nivel);
    //classes_desabilitadas.push(entradas.classes[i].classe);
  }
  // pontos de vida e ferimentos.
  goog.dom.getElement(PONTOS_VIDA_TOTAL).value = entradas.pontos_vida;
  goog.dom.getElement(FERIMENTOS).value = entradas.ferimentos;
  // experiencia.
  goog.dom.getElement(PONTOS_EXPERIENCIA).value = entradas.experiencia;
  // atributos.
  var div_atributos = goog.dom.getElement(DIV_STATS);
  for (var i = 0; i < div_atributos.childNodes.length; ++i) {
    var elemento = div_atributos.childNodes[i];
    if (elemento.tagName == "INPUT") {
      elemento.value = entradas[elemento.name];
    }
  }
  // Armas.
  // cac.
  SelecionaValor(entradas.armas_cac[0].nome, goog.dom.getElement(ARMA_CORPO_A_CORPO + "-0"));
  goog.dom.getElement(ARMA_CORPO_A_CORPO_OBRA_PRIMA + "-0").checked =
    entradas.armas_cac[0].obra_prima;
  goog.dom.getElement(BONUS_ARMA_CORPO_A_CORPO + "-0").value = entradas.armas_cac[0].bonus;
  // distancia.
  // Arremesso.
  SelecionaValor(entradas.armas_distancia[0].nome, goog.dom.getElement(ARMA_ARREMESSO + "-0"));
  goog.dom.getElement(BONUS_ARMA_ARREMESSO + "-0").value = entradas.armas_distancia[0].bonus;
  // Projetil.
  //SelecionaValor(entradas.armas_distancia[0].nome, goog.dom.getElement(ARMA_DISTANCIA + "-0"));
  //goog.dom.getElement(BONUS_ARMA_DISTANCIA + "-0").value = entradas.armas_distancia[0].bonus;
  // Armadura e escudo.
  SelecionaValor(entradas.armadura.nome, 
                 goog.dom.getElement(ARMADURA)); 
  goog.dom.getElement(BONUS_ARMADURA).value = 
    entradas.armadura.bonus_magico; 
  SelecionaValor(entradas.escudo.nome, 
                 goog.dom.getElement(ESCUDO));
  goog.dom.getElement(BONUS_ESCUDO).value = 
    entradas.escudo.bonus_magico; 

  // Moedas.
  goog.dom.getElement(MOEDAS_PLATINA).value = entradas.platina;
  goog.dom.getElement(MOEDAS_OURO).value = entradas.ouro;
  goog.dom.getElement(MOEDAS_PRATA).value = entradas.prata;
  goog.dom.getElement(MOEDAS_COBRE).value = entradas.cobre;
}

