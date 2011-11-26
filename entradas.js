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
  // Cada entrada: { nome, arma_principal, arma_secundaria}.
  estilos_luta: [],
  // moedas
  platina: 0,
  ouro: 0,
  prata: 0,
  cobre: 0,
  // equipamentos.
  // Cada entrada eh do tipo: { nome: '', obra_prima: false, bonus: 0 }
  armas: [],
  armadura: { nome: '', bonus_magico: 0 },
  escudo: { nome: '', bonus_magico: 0 },
};

// Le todos os inputs da planilha e armazena em 'entradas'. 
function LeEntradas() {
  // nome
  entradas.nome = goog.dom.getElement('nome').value;
  // raca
  entradas.raca = ValorSelecionado(goog.dom.getElement('raca'));
  // alinhamento
  entradas.alinhamento = ValorSelecionado(goog.dom.getElement('alinhamento'));
  // classes.
  entradas.classes.length = 0;
  var div_classes = goog.dom.getElement('classes');
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
  entradas.pontos_vida = parseInt(goog.dom.getElement('pontos-vida-total').value) || 0;
  entradas.ferimentos = parseInt(goog.dom.getElement('ferimentos').value) || 0;
  // Experiencia.
  entradas.experiencia = parseInt(goog.dom.getElement('pontos-experiencia').value) || 0;
  // atributos
  var div_atributos = goog.dom.getElement('div-stats');
  for (var i = 0; i < div_atributos.childNodes.length; ++i) {
    var elemento = div_atributos.childNodes[i];
    if (elemento.tagName == "INPUT") {
      entradas[elemento.name] = parseInt(elemento.value);
    }
  }

  // Estilos de luta.
  entradas.estilos_luta = [];
  var div_estilos_luta = goog.dom.getElement('div-estilos-luta');
  for (var i = 0; i < div_estilos_luta.childNodes.length; ++i) {
    entradas.estilos_luta.push(_LeEntradaEstiloLuta(div_estilos_luta.childNodes[i]));
  }

  // Armadura e escudo.
  entradas.armadura.nome = 
      ValorSelecionado(goog.dom.getElement('armadura')); 
  entradas.armadura.bonus_magico = 
      parseInt(goog.dom.getElement('bonus-armadura').value) || 0; 
  entradas.escudo.nome = 
      ValorSelecionado(goog.dom.getElement('escudo'));
  entradas.escudo.bonus_magico = 
      parseInt(goog.dom.getElement('bonus-escudo').value) || 0;

  // Moedas
  entradas.platina = parseInt(goog.dom.getElement('moedas-platina').value);
  entradas.ouro = parseInt(goog.dom.getElement('moedas-ouro').value);
  entradas.prata = parseInt(goog.dom.getElement('moedas-prata').value);
  entradas.cobre = parseInt(goog.dom.getElement('moedas-cobre').value);

  // Equipamentos.
  // Armas: Este div possui divs filhos com select, checkbox, input
  entradas.armas = [];
  var div_armas = goog.dom.getElement('div-equipamentos-armas');
  for (var i = 0; i < div_armas.childNodes.length; ++i) {
    entradas.armas.push(_LeEntradaArma(div_armas.childNodes[i]));
  }
}

// Le uma arma de seu div.
// @return a arma lida.
function _LeEntradaArma(div_arma) {
  var arma_lida = {};
  for (var i = 0; i < div_arma.childNodes.length; ++i) {
    var filho = div_arma.childNodes[i];
    if (filho.tagName == 'SELECT') {
      arma_lida.nome = ValorSelecionado(filho);
    } else if (filho.tagName == 'INPUT') {
      if (filho.type == 'checkbox') {
        arma_lida.obra_prima = filho.checked;
      } else {
        arma_lida.bonus = parseInt(filho.value) || 0;
      }
    }
  }
  return arma_lida;
}

// Le um div de estilo de luta.
// @return o estilo lido. 
function _LeEntradaEstiloLuta(div_estilo_luta) {
  var estilo = {};
  for (var i = 0; i < div_estilo_luta.childNodes.length; ++i) {
    var filho = div_estilo_luta.childNodes[i];
    if (filho.tagName == 'INPUT') {
      if (filho.checked) {
        estilo.nome = filho.value; 
      }
    } else if (filho.tagName == 'SELECT') {
      if (filho.id.indexOf('primario') != -1) {
        estilo.arma_primaria = ValorSelecionado(filho);
      } else {
        estilo.arma_secundaria = ValorSelecionado(filho);
      }
    }
  }
  return estilo;
}

// Escreve todos os inputs com os valores de 'entradas'.
function EscreveEntradas() {
  // nome
  goog.dom.getElement('nome').value = entradas.nome;

  // raca
  SelecionaValor(entradas.raca, goog.dom.getElement('raca'));

  // alinhamento
  SelecionaValor(entradas.alinhamento, goog.dom.getElement('alinhamento'));

  // classes.
  var classes_desabilitadas = [];
  for (var i = 0; i < entradas.classes.length; ++i) {
    AdicionaClasse(classes_desabilitadas, entradas.classes[i].classe, entradas.classes[i].nivel);
    //classes_desabilitadas.push(entradas.classes[i].classe);
  }

  // pontos de vida e ferimentos.
  goog.dom.getElement('pontos-vida-total').value = entradas.pontos_vida;
  goog.dom.getElement('ferimentos').value = entradas.ferimentos;

  // experiencia.
  goog.dom.getElement('pontos-experiencia').value = entradas.experiencia;

  // atributos.
  var div_atributos = goog.dom.getElement('div-stats');
  for (var i = 0; i < div_atributos.childNodes.length; ++i) {
    var elemento = div_atributos.childNodes[i];
    if (elemento.tagName == "INPUT") {
      elemento.value = entradas[elemento.name];
    }
  }

  // Armadura e escudo.
  SelecionaValor(entradas.armadura.nome, 
                 goog.dom.getElement('armadura')); 
  goog.dom.getElement('bonus-armadura').value = 
    entradas.armadura.bonus_magico; 
  SelecionaValor(entradas.escudo.nome, 
                 goog.dom.getElement('escudo'));
  goog.dom.getElement('bonus-escudo').value = 
    entradas.escudo.bonus_magico; 

  // Moedas.
  goog.dom.getElement('moedas-platina').value = entradas.platina;
  goog.dom.getElement('moedas-ouro').value = entradas.ouro;
  goog.dom.getElement('moedas-prata').value = entradas.prata;
  goog.dom.getElement('moedas-cobre').value = entradas.cobre;
  // Equipamentos.
  // Armas.
  for (var i = 0; i < entradas.armas.length; ++i) {
    var arma = entradas.armas[i];
    AdicionaArma(arma.nome, arma.obra_prima, arma.bonus);
  }

  // Estilos de luta. Depende das armas.
  goog.dom.getElement('div-estilos-luta').childNodes = [];
  for (var i = 0; i < entradas.estilos_luta.length; ++i) {
    var estilo = entradas.estilos_luta[i];
    AdicionaEstiloLuta(estilo.nome, estilo.arma_primaria, estilo.arma_secundaria);
  }
}

