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
  bonus_atributos: [],
  forca: 10,
  destreza: 10,
  constituicao: 10,
  inteligencia: 10,
  sabedoria: 10,
  carisma: 10,
  // Cada entrada: { nome, arma_primaria, arma_secundaria}.
  estilos_luta: [],
  // moedas
  platina: 0,
  ouro: 0,
  prata: 0,
  cobre: 0,
  // equipamentos.
  // Cada entrada eh do tipo: { chave, obra_prima, bonus }
  armas: [],
  armadura: { nome: 'nenhuma', bonus_magico: 0 },
  escudo: { nome: 'nenhum', bonus_magico: 0 },
  elmo: '',
  // cada entrada: { chave, em_uso }
  aneis: [],
  outros_equipamentos: '',
  // talentos. Cada entrada possui { nome, complemento }, se houver.
  talentos: [],

  // pericias: cada entrada possui { chave, pontos }
  pericias: [],

  // Feiticos. cada entrada:
  // conhecidos: { feitico, classe, nivel, indice, },
  // slots: { feitico, classe, nivel, indice, }, // indice pode ser dom para dominio.
  feiticos: { conhecidos: [], slots: [] },

  notas: '',
};

// Le todos os inputs da planilha e armazena em 'entradas'. 
function LeEntradas() {
  // nome
  entradas.nome = Dom('nome').value;
  // raca
  entradas.raca = ValorSelecionado(Dom('raca'));
  // alinhamento
  entradas.alinhamento = ValorSelecionado(Dom('alinhamento'));
  // classes.
  entradas.classes.length = 0;
  var div_classes = Dom('classes');
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
  entradas.pontos_vida = parseInt(Dom('pontos-vida-total').value) || 0;
  entradas.ferimentos = parseInt(Dom('ferimentos').value) || 0;
  // Experiencia.
  entradas.experiencia = parseInt(Dom('pontos-experiencia').value) || 0;
  // atributos
  var span_bonus_atributos = Dom('pontos-atributos-gastos');
  var array_bonus = span_bonus_atributos.textContent.split(',');
  for (var i = 0; i < array_bonus; ++i) {
    // Trim direita.
    array_bonus[i] = tabelas_atributos_invertidos[
        array_bonus[i].replace(/\s*$/, "")];
  }
  var atributos = [ 
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    entradas[atributos[i]] = 
        parseInt(Dom(atributos[i] + '-valor-base').value);
  }

  // Estilos de luta.
  entradas.estilos_luta = [];
  var div_estilos_luta = Dom('div-estilos-luta');
  for (var i = 0; i < div_estilos_luta.childNodes.length; ++i) {
    entradas.estilos_luta.push(_LeEntradaEstiloLuta(div_estilos_luta.childNodes[i]));
  }

  _LeEquipamentos();

  // Talentos.
  entradas.talentos = [];
  // Ler ate nao achar mais talentos.
  for (var i = 0; ; ++i) {
    var select_talento = Dom('select-talento-' + i);
    var input_complemento_talento = Dom('input-complemento-talento-' + i);
    if (select_talento == null) {
      break;
    }
    entradas.talentos.push({ 
        nome: ValorSelecionado(select_talento), 
        complemento: input_complemento_talento.disabled ? null : input_complemento_talento.value});
  }

  // Pericias.
  for (var i = 0; i < entradas.pericias.length; ++i) {
    var entrada_pericia = entradas.pericias[i];
    var input_pontos = Dom('pericia-' + entrada_pericia.chave + '-pontos');
    entrada_pericia.pontos = parseInt(input_pontos.value) || 0;
  }

  // Feiticos.
  _LeFeiticos();
  
  entradas.notas = Dom('text-area-notas').value;
}

function _LeFeiticos() {
  entradas.feiticos.conhecidos = [];
  var nomes_feiticos = goog.dom.getElementsByClass('feiticos-conhecidos');
  for (var i = 0; i < nomes_feiticos.length; ++i) {
    var classe_nivel_indice = nomes_feiticos[i].id.split('-');
    // remove o prefixo input-feiticos-conhecidos
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    entradas.feiticos.conhecidos.push({ 
      feitico: nomes_feiticos[i].value,
      classe: classe_nivel_indice[0],
      nivel: classe_nivel_indice[1],
      indice: classe_nivel_indice[2],
    });
  }

  // Comecar pelo gasto que esta sempre presente.
  entradas.feiticos.slots = [];
  var feiticos_gastos = goog.dom.getElementsByClass('feiticos-slots-gastos');
  for (var i = 0; i < feiticos_gastos.length; ++i) {
    var classe_nivel_indice = feiticos_gastos[i].id.split('-');
    // remove o prefixo input-feiticos-slots-gastos.
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    entradas.feiticos.slots.push({ 
        feitico: null,
        classe: classe_nivel_indice[0],
        nivel: classe_nivel_indice[1],
        indice: classe_nivel_indice[2],
        gasto: feiticos_gastos[i].checked,
    });
  }

  nomes_feiticos = goog.dom.getElementsByClass('feiticos-slots');
  for (var i = 0; i < nomes_feiticos.length; ++i) {
    var classe_nivel_indice = nomes_feiticos[i].id.split('-');
    // remove o prefixo input-feiticos-slots
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    entradas.feiticos.slots[i].feitico = nomes_feiticos[i].value;
  }
}

// Le uma arma de seu div.
// @return a arma lida.
function _LeEntradaArma(div_arma) {
  var arma_lida = {};
  for (var i = 0; i < div_arma.childNodes.length; ++i) {
    var filho = div_arma.childNodes[i];
    if (filho.tagName == 'SELECT') {
      arma_lida.chave = ValorSelecionado(filho);
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

function _LeEquipamentos() {
  // Armadura e escudo.
  entradas.armadura.nome = 
      ValorSelecionado(Dom('armadura')); 
  entradas.armadura.bonus_magico = 
      parseInt(Dom('bonus-armadura').value) || 0; 
  entradas.escudo.nome = 
      ValorSelecionado(Dom('escudo'));
  entradas.escudo.bonus_magico = 
      parseInt(Dom('bonus-escudo').value) || 0;
  entradas.outros_equipamentos = Dom('text-area-outros-equipamentos').value;

  // Moedas
  entradas.platina = parseInt(Dom('moedas-platina').value);
  entradas.ouro = parseInt(Dom('moedas-ouro').value);
  entradas.prata = parseInt(Dom('moedas-prata').value);
  entradas.cobre = parseInt(Dom('moedas-cobre').value);

  // Equipamentos.
  // Armas: Este div possui divs filhos com select, checkbox, input
  entradas.armas = [];
  var div_armas = Dom('div-equipamentos-armas');
  for (var i = 0; i < div_armas.childNodes.length; ++i) {
    entradas.armas.push(_LeEntradaArma(div_armas.childNodes[i]));
  }

  _LeAneis();
}

function _LeAneis() {
  entradas.aneis = [];
  var dom_aneis = goog.dom.getElementsByClass('div-aneis');
  for (var i = 0; i < dom_aneis.length; ++i) {
    _LeAnel(dom_aneis[i]);
  }
}

function _LeAnel(dom_anel) {
  var anel = {
      chave: '',
      em_uso: false, 
  };
  for (var i = 0; i < dom_anel.childNodes.length; ++i) {
    var filho = dom_anel.childNodes[i];
    if (filho.name == 'anel') {
      anel.chave = ValorSelecionado(filho);
    } else if (filho.name == 'em_uso') {
      anel.em_uso = filho.checked;
    }
  }
  entradas.aneis.push(anel);
}

