// Tudo relacionado a entradas. Isso eh o que devera ser
// serializado e deserializado.

// Variavel contendo os valores das entradas. Iniciado com valores padroes da criacao.
var entradas = {
  // geral
  nome: "",
  raca: "humano",
  alinhamento: "LB",
  // Cada entrada possui classe e nivel.
  classes: [ { classe: 'guerreiro', nivel: 1 } ],
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
  // Cada entrada eh do tipo: { nome: obra_prima, bonus }
  armas: [],
  armadura: { nome: 'nenhuma', bonus_magico: 0 },
  escudo: { nome: 'nenhum', bonus_magico: 0 },

  // talentos. Cada entrada possui { nome, complemento }, se houver.
  talentos: [],

  // pericias: cada entrada possui { chave, pontos }
  pericias: [],

  // Feiticos. cada entrada:
  // TODO mudar esse slot do conhecimento que ta fazendo confusao com slots.
  // conhecidos: { feitico, classe, nivel, slot, gastos },
  // slots: 
  feiticos: { conhecidos: [], slots: [] },
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

  // Talentos.
  entradas.talentos = [];
  // Ler ate nao achar mais talentos.
  for (var i = 0; ; ++i) {
    var select_talento = goog.dom.getElement('select-talento-' + i);
    var input_complemento_talento = goog.dom.getElement('input-complemento-talento-' + i);
    if (select_talento == null) {
      break;
    }
    entradas.talentos.push({ 
        nome: ValorSelecionado(select_talento), 
        complemento: input_complemento_talento.disabled ? null : input_complemento_talento.value});
  }

  // Pericias.
  entradas.pericias = [];
  for (var chave_pericia in tabelas_pericias) {
    var input_pontos = goog.dom.getElement('pericia-' + chave_pericia + '-pontos');
    entradas.pericias.push({ chave: chave_pericia, pontos: parseInt(input_pontos.value) || 0 });
  }

  // Feiticos.
  _LeFeiticos();
}

function _LeFeiticos() {
  entradas.feiticos.conhecidos = [];
  var nomes_feiticos = goog.dom.getElementsByClass('feiticos-conhecidos');
  for (var i = 0; i < nomes_feiticos.length; ++i) {
    var classe_nivel_slot = nomes_feiticos[i].id.split('-');
    // remove o prefixo input-feiticos-conhecidos
    classe_nivel_slot.shift();
    classe_nivel_slot.shift();
    classe_nivel_slot.shift();
    entradas.feiticos.conhecidos.push({ 
      feitico: nomes_feiticos[i].value,
      classe: classe_nivel_slot[0],
      nivel: classe_nivel_slot[1],
      slot: classe_nivel_slot[2],
      gastos: 0 
    });
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
