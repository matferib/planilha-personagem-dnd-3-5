// Tudo relacionado a entradas. Isso eh o que devera ser
// serializado e deserializado. A entrada serve como o mínimo que representa o personagem.
// É possível salvar apenas as entradas e restaurar o personagem depois chamando a função 
// AtualizaGeralSemLerEntradas.

// Variavel contendo os valores das entradas. Iniciado com valores padroes da criacao.
var entradas = {
  modo_mestre: '',
  // geral
  nome: '',
  raca: 'humano',
  tamanho: 'medio',  // É possivel ter tamanhos fora do padrao através de magias.
  alinhamento: 'LB',
  divindade: '',
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
  // armas: [ { chave: 'desarmado', nome_gerado: 'desarmado', material: 'nenhum', obra_prima: false, bonus: 0} ],
  armas: [],
  // Cada entrada eh do tipo: { em_uso, chave, material, obra_prima, bonus }
  armaduras: [],
  // Cada entrada { em_uso, chave, material, obra_prima, bonus },
  escudos: [],
  elmo: '',
  // cada entrada: { chave, em_uso }
  aneis: [],
  amuletos: [],
  pocoes: [],
  capas: [],
  outros_equipamentos: '',
  // talentos. Cada chave possui { chave, complemento }, se houver.
  talentos: { gerais: [], guerreiro: [], mago: [], monge: [] },

  // pericias: cada entrada possui { chave, pontos }
  pericias: [],

  // Feitiços conhecidos, cada entrada:
  // chave_classe: { 0: [ feitico, ... ], 1: [] ...}
  feiticos_conhecidos: {},
  // Slots de feitiços, cada entrada:
  // chave_classe: { 0: [ { nivel, indice, gasto }, ... ], 1: [] ...}
  // Nivel é o nível do feitiço, que pode ser diferente do nível do slot.
  // indice eh o ponteiro para o feitico nos conhecidos para o nível.
  // gasto indica se o feitico está gasto ou não.
  slots_feiticos: {},

  notas: '',
};

// Le todos os inputs da planilha e armazena em 'entradas'. 
function LeEntradas() {
  // Modo mestre ligado ou nao.
  entradas.modo_mestre = Dom('input-modo-mestre').checked;
  // nome
  entradas.nome = Dom('nome').value;
  // raca
  entradas.raca = ValorSelecionado(Dom('raca'));
  // tamanho
  entradas.tamanho = ValorSelecionado(Dom('tamanho')) || tabelas_raca[entradas.raca].tamanho;
  // alinhamento
  entradas.alinhamento = ValorSelecionado(Dom('alinhamento'));
  // divindade
  entradas.divindade = Dom('divindade-patrona').value;
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
  entradas.pontos_vida = parseInt(Dom('pontos-vida-dados').value) || 0;
  entradas.ferimentos = parseInt(Dom('ferimentos').value) || 0;
  // Experiencia.
  entradas.experiencia = parseInt(Dom('pontos-experiencia').value) || 0;
  // atributos
  var span_bonus_atributos = Dom('pontos-atributos-gastos');
  if (span_bonus_atributos.textContent.length > 0) {
    var array_bonus = span_bonus_atributos.textContent.split(',');
    for (var i = 0; i < array_bonus.length; ++i) {
      // Trim direita.
      var nome_atributo = AjustaString(array_bonus[i]);
      array_bonus[i] = tabelas_atributos_invertidos[nome_atributo];
    }
    entradas.bonus_atributos = array_bonus;
  } else {
    entradas.bonus_atributos = [];
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
    entradas.estilos_luta.push(
        _LeEntradaEstiloLuta(div_estilos_luta.childNodes[i]));
  }

  _LeEquipamentos();

  _LeTalentos();

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

function _LeTalentos() {
  for (var chave_classe in entradas.talentos) {
    entradas.talentos[chave_classe].length = 0;
    var div_talentos = Dom('div-talentos-' + chave_classe + '-selects');
    for (var i = 0; i < div_talentos.childNodes.length; ++i) {
      entradas.talentos[chave_classe].push(
          _LeTalento(div_talentos.childNodes[i]));
    }
  }
}

// Le o talento do div e o retorna no formato da entrada.
function _LeTalento(div_talento) {
  var entrada_talento = {
    chave: null,
    complemento: null
  };
  for (var j = 0; j < div_talento.childNodes.length; ++j) {
    var filho = div_talento.childNodes[j];
    if (filho.name == 'chave-talento') {
      entrada_talento.chave = ValorSelecionado(filho);
    } else if (filho.name == 'complemento-talento' && !filho.disabled) {
      entrada_talento.complemento = filho.value;
    }
  }
  return entrada_talento;
}

function _LeFeiticosConhecidos() {
  entradas.feiticos_conhecidos = {};
  // nomes_feiticos eh um NodeList, portanto não possui forEach.
  var doms_feiticos = DomsPorClasse('feiticos-conhecidos');
  for (var indice = 0; indice < doms_feiticos.length; ++indice) {
    var dom_feitico = doms_feiticos[indice];
    // remove o prefixo input-feiticos-conhecidos
    var classe_nivel_indice = dom_feitico.id.split('-');
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    var chave_classe = classe_nivel_indice[0];
    var nivel = classe_nivel_indice[1];
    var feitico = dom_feitico.value;
    if (entradas.feiticos_conhecidos[chave_classe] == null) {
      entradas.feiticos_conhecidos[chave_classe] = {};
    }
    if (entradas.feiticos_conhecidos[chave_classe][nivel] == null) {
      entradas.feiticos_conhecidos[chave_classe][nivel] = [];
    }
    entradas.feiticos_conhecidos[chave_classe][nivel].push(feitico);
  }
}

function _LeSlotsFeiticos() {
  // Comecar pelo gasto que esta sempre presente.
  entradas.slots_feiticos = {};
  var doms_feiticos_gastos = DomsPorClasse('feiticos-slots-gastos');
  for (var i = 0; i < doms_feiticos_gastos.length; ++i) {
    var classe_nivel_indice = doms_feiticos_gastos[i].id.split('-');
    // remove o prefixo input-feiticos-slots-gastos.
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    var chave_classe = classe_nivel_indice[0];
    var nivel_slot = classe_nivel_indice[1];
    var gasto = doms_feiticos_gastos[i].checked;

    if (entradas.slots_feiticos[chave_classe] == null) {
      entradas.slots_feiticos[chave_classe] = {};
    }
    if (entradas.slots_feiticos[chave_classe][nivel_slot] == null) {
      entradas.slots_feiticos[chave_classe][nivel_slot] = [];
    }
    entradas.slots_feiticos[chave_classe][nivel_slot].push({ gasto: gasto });
  }

  // O restante ja foi preenchido acima. So falta o feitico em si.
  // O indice_conhecido é formado por nivel_indice. O nível é necessário porque é possível
  // selecionar um feitiço de nível inferior ao do slot.
  var doms_select_feitico = DomsPorClasse('feiticos-slots');
  for (var i = 0; i < doms_select_feitico.length; ++i) {
    var classe_nivel_indice = doms_select_feitico[i].id.split('-');
    // remove o prefixo input-feiticos-slots.
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    classe_nivel_indice.shift();
    var chave_classe = classe_nivel_indice[0];
    var nivel_slot = classe_nivel_indice[1];

    var nivel_indice = ValorSelecionado(doms_select_feitico[i]);
    if (nivel_indice != null) {
      nivel_indice = nivel_indice.split('-');
      if (nivel_indice.length == 1) {
        // Compatibilidade... Se só tiver 1, usa de índice do mesmo nível.
        entradas.slots_feiticos[chave_classe][nivel_slot].nivel = nivel_slot;
        entradas.slots_feiticos[chave_classe][nivel_slot].indice = nivel_indice[0];
      } else {
        entradas.slots_feiticos[chave_classe][nivel_slot].nivel = nivel_indice[0];
        entradas.slots_feiticos[chave_classe][nivel_slot].indice = nivel_indice[1];
      }
    }
  }

}

function _LeFeiticos() {
  _LeFeiticosConhecidos();
  _LeSlotsFeiticos();
}

// Le um div de estilo de luta.
// Como existem spans aninhados, tem que empilhar spans.
// @return o estilo lido. 
function _LeEntradaEstiloLuta(div_estilo_luta) {
  var estilo = {};
  var proximos_elementos = [ div_estilo_luta ];
  while (proximos_elementos.length > 0) {
    var elemento_corrente = proximos_elementos.pop();
    for (var i = 0; i < elemento_corrente.childNodes.length; ++i) {
      var filho = elemento_corrente.childNodes[i];
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
      } else if (filho.tagName == 'SPAN') {
        proximos_elementos.push(filho);
      }
    }
  }
  return estilo;
}

function _LeEquipamentos() {
  // Armadura e escudo.
  //entradas.armadura.nome = 
  //    ValorSelecionado(Dom('armadura')); 
  //entradas.armadura.bonus_magico = 
  //    parseInt(Dom('bonus-armadura').value) || 0; 
  //entradas.escudo.nome = 
  //    ValorSelecionado(Dom('escudo'));
  //entradas.escudo.bonus_magico = 
  //    parseInt(Dom('bonus-escudo').value) || 0;
  entradas.outros_equipamentos = Dom('text-area-outros-equipamentos').value;

  // Moedas
  entradas.platina = parseInt(Dom('moedas-platina').value);
  entradas.ouro = parseInt(Dom('moedas-ouro').value);
  entradas.prata = parseInt(Dom('moedas-prata').value);
  entradas.cobre = parseInt(Dom('moedas-cobre').value);

  // Equipamentos.
  // Armas e armaduras: estes divs possuem divs filhos com select, checkbox, input
  _LeArmas();
  _LeArmaduras();
  _LeEscudos();

  for (var tipo_item in tabelas_itens) {
    _LeItens(tipo_item);
  }
}

// Funcoes iguais que chamam apenas LeArmasArmadurasEscudos com parametros corretos.
function _LeArmas() {
  _LeArmasArmadurasEscudos(entradas.armas, Dom('div-equipamentos-armas'));
}

function _LeArmaduras() {
  _LeArmasArmadurasEscudos(entradas.armaduras, Dom('div-equipamentos-armaduras'));
}

function _LeEscudos() {
  _LeArmasArmadurasEscudos(entradas.escudos, Dom('div-equipamentos-escudos'));
}
// Fim funcoes iguais.

// Le armas e armaduras. 
// @param array_entrada o array na entrada. Pode ser entradas.armas ou armaduras.
// @param div que contem os elementos.
function _LeArmasArmadurasEscudos(array_entrada, div) {
  array_entrada.length = 0;
  for (var i = 0; i < div.childNodes.length; ++i) {
    array_entrada.push(LeEntradaArmaArmadura(div.childNodes[i]));
  }
}

// Le uma arma ou armadura de seu div. Usada tambem no tratamento de compra e venda
// de armas.
// @return o que foi lido.
function LeEntradaArmaArmadura(div) {
  var lido = {};
  for (var i = 0; i < div.childNodes.length; ++i) {
    var filho = div.childNodes[i];
    if (filho.name == null) {
      continue;
    }
    if (filho.name.indexOf('em-uso') != -1) {
      lido.em_uso = filho.checked;
    } else if (filho.name.indexOf('select-principal') != -1) {
      lido.chave = ValorSelecionado(filho);
    } else if (filho.name.indexOf('select-material') != -1) {
      lido.material = ValorSelecionado(filho);
    } else if (filho.name.indexOf('obra-prima') != -1) {
      lido.obra_prima = filho.checked;
    } else if (filho.name.indexOf('bonus-magico') != -1) {
      lido.bonus = parseInt(filho.value) || 0;
    }
  }
  return lido;
}



function _LeItens(tipo_item) {
  entradas[tipo_item] = [];
  var dom = DomsPorClasse('div-' + tipo_item);
  for (var i = 0; i < dom.length; ++i) {
    entradas[tipo_item].push(LeItem(dom[i]));
  }
}

// Usado tambem na compra e venda de itens.
// @return o item lido do dom.
function LeItem(dom) {
  var item = {
      chave: '',
      em_uso: false, 
  };
  for (var i = 0; i < dom.childNodes.length; ++i) {
    var filho = dom.childNodes[i];
    if (filho.name == 'item') {
      item.chave = ValorSelecionado(filho);
    } else if (filho.name == 'em_uso') {
      item.em_uso = filho.checked;
    }
  }
  return item;
}

