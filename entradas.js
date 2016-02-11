// Tudo relacionado a gEntradas. Isso eh o que devera ser
// serializado e deserializado. A entrada serve como o mínimo que representa o personagem.
// É possível salvar apenas as gEntradas e restaurar o personagem depois chamando a função
// AtualizaGeralSemLerEntradas.

// Variavel contendo os valores das gEntradas. Iniciado com valores padroes da criacao.
var gEntradas = {
  modo_mestre: '',
  modo_visao: 'completo',
  // geral
  nome: '',
  raca: 'humano',
  template: '',
  tamanho: 'medio',  // É possivel ter tamanhos fora do padrao através de magias.
  alinhamento: 'LB',
  divindade: '',
  // Cada entrada possui classe e nivel.
  classes: [ { classe: 'guerreiro', nivel: 1 } ],
  niveis_negativos: 0,
  // pontos de vida.
  pontos_vida: 0,
  pontos_vida_temporarios: 0,
  ferimentos: 0,  // Valor deve ser >=  0.
  ferimentos_nao_letais: 0,  // Valor deve ser >= 0.
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
  // Cada entrada: chave: [ true/false, ... ]
  habilidades_especiais: {},
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
  braceletes: [],
  pocoes: [],
  capas: [],
  outros_equipamentos: '',
  // talentos. Cada chave possui { chave, complemento }, se houver.
  talentos: { gerais: [], guerreiro: [], mago: [], monge: [], ranger: [] },

  // pericias: cada entrada possui { chave, pontos }
  pericias: [],

  // Para magos especialistas. Cada entrada:
  // chave_classe: [],
  escolas_proibidas: {},
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

// Le todos os inputs da planilha e armazena em 'gEntradas'.
function LeEntradas() {
  // Modo mestre ligado ou nao.
  gEntradas.modo_mestre = Dom('input-modo-mestre').checked;

  // nome
  gEntradas.nome = Dom('nome').value;
  // raca
  gEntradas.raca = ValorSelecionado(Dom('raca'));
  // template
  gEntradas.template = ValorSelecionado(Dom('template'));
  // tamanho
  gEntradas.tamanho = ValorSelecionado(Dom('tamanho')) || tabelas_raca[gEntradas.raca].tamanho;
  // alinhamento
  gEntradas.alinhamento = ValorSelecionado(Dom('alinhamento'));
  // divindade
  gEntradas.divindade = Dom('divindade-patrona').value;
  // classes.
  gEntradas.classes.length = 0;
  var div_classes = Dom('classes');
  for (var i = 0; i < div_classes.childNodes.length; ++i) {
    var elemento = div_classes.childNodes[i];
    if (elemento.tagName == "DIV") {
      var select = elemento.getElementsByTagName("SELECT")[0];
      var input = elemento.getElementsByTagName("INPUT")[0];
      gEntradas.classes.push({
        classe: ValorSelecionado(select),
        nivel: parseInt(input.value)});
    }
  }
  gEntradas.niveis_negativos = parseInt(Dom('niveis-negativos').value) || 0;
  // pontos de vida e ferimentos.
  gEntradas.pontos_vida = parseInt(Dom('pontos-vida-dados').value) || 0;
  gEntradas.pontos_vida_temporarios = parseInt(Dom('pontos-vida-temporarios').value) || 0;
  gEntradas.ferimentos = Math.abs(parseInt(Dom('ferimentos').textContent)) || 0;
  gEntradas.ferimentos_nao_letais = Math.abs(parseInt(Dom('ferimentos-nao-letais').textContent)) || 0;
  // Experiencia.
  gEntradas.experiencia = parseInt(Dom('pontos-experiencia').value) || 0;
  // atributos
  var span_bonus_atributos = Dom('pontos-atributos-gastos');
  if (span_bonus_atributos.textContent.length > 0) {
    var array_bonus = span_bonus_atributos.textContent.split(',');
    for (var i = 0; i < array_bonus.length; ++i) {
      // Trim direita.
      var nome_atributo = AjustaString(array_bonus[i]);
      array_bonus[i] = tabelas_atributos_invertidos[nome_atributo];
    }
    gEntradas.bonus_atributos = array_bonus;
  } else {
    gEntradas.bonus_atributos = [];
  }
  var atributos = [
      'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma' ];
  for (var i = 0; i < atributos.length; ++i) {
    gEntradas[atributos[i]] =
        parseInt(Dom(atributos[i] + '-valor-base').value);
  }

  // Estilos de luta.
  gEntradas.estilos_luta = [];
  var div_estilos_luta = Dom('div-estilos-luta');
  for (var i = 0; i < div_estilos_luta.childNodes.length; ++i) {
    gEntradas.estilos_luta.push(
        _LeEntradaEstiloLuta(div_estilos_luta.childNodes[i]));
  }

  _LeHabilidadesEspeciais();

  _LeEquipamentos();

  _LeTalentos();

  // Pericias.
  for (var i = 0; i < gEntradas.pericias.length; ++i) {
    var entrada_pericia = gEntradas.pericias[i];
    var input_pontos = Dom('pericia-' + entrada_pericia.chave + '-pontos');
    entrada_pericia.pontos = parseInt(input_pontos.value) || 0;
  }

  // Feiticos.
  _LeFeiticos();

  gEntradas.notas = Dom('text-area-notas').value;
}

function _LeTalentos() {
  for (var chave_classe in gEntradas.talentos) {
    gEntradas.talentos[chave_classe].length = 0;
    var div_talentos = Dom('div-talentos-' + chave_classe + '-selects');
    for (var i = 0; i < div_talentos.childNodes.length; ++i) {
      gEntradas.talentos[chave_classe].push(
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

function _LeEscolasProibidas() {
  gEntradas.escolas_proibidas = {};
  // nomes_feiticos eh um NodeList, portanto não possui forEach.
  var doms_escolas_proibidas = DomsPorClasse('escolas-proibidas');
  for (var i = 0; i < doms_escolas_proibidas.length; ++i) {
    var doms_escola_proibida = doms_escolas_proibidas[i];
    var id = doms_escola_proibida.id.split('-');
    id.shift();  // tira div.
    id.shift();  // tira escolas
    id.shift();  // tira proibidas.
    var chave_classe = id[0];
    if (!(chave_classe in gEntradas.escolas_proibidas)) {
      gEntradas.escolas_proibidas[chave_classe] = [];
    }
    gEntradas.escolas_proibidas[chave_classe].push(doms_escolas_proibidas[i].value);
  }
}

function _LeFeiticosConhecidos() {
  gEntradas.feiticos_conhecidos = {};
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
    if (gEntradas.feiticos_conhecidos[chave_classe] == null) {
      gEntradas.feiticos_conhecidos[chave_classe] = {};
    }
    if (gEntradas.feiticos_conhecidos[chave_classe][nivel] == null) {
      gEntradas.feiticos_conhecidos[chave_classe][nivel] = [];
    }
    gEntradas.feiticos_conhecidos[chave_classe][nivel].push(feitico);
  }
}

// Dado um id no formato p-p-p-p-classe-nivel-indice, retorna [classe, nivel, indice].
function _LeClasseNivelIndice(id) {
  var classe_nivel_indice = id.split('-');
  var num_shifts = classe_nivel_indice.length - 3;
  for (var i = 0; i < num_shifts; ++i) {
    classe_nivel_indice.shift();
  }
  return classe_nivel_indice;
}

// Le um slot gasto, criando os valores intermediarios se eles nao existirem.
function _PreencheSlotGasto(chave_classe, nivel_slot, indice_slot, gasto) {
  if (indice_slot == 'dom') {
    if (gEntradas.slots_feiticos_dominio[chave_classe] == null) {
      gEntradas.slots_feiticos_dominio[chave_classe] = {};
    }
    gEntradas.slots_feiticos_dominio[chave_classe][nivel_slot] = { gasto: gasto };
  } else if (indice_slot == 'esp') {
    if (gEntradas.slots_feiticos_especializados[chave_classe] == null) {
      gEntradas.slots_feiticos_especializados[chave_classe] = {};
    }
    gEntradas.slots_feiticos_especializados[chave_classe][nivel_slot] = { gasto: gasto };
  } else {
    if (gEntradas.slots_feiticos[chave_classe] == null) {
      gEntradas.slots_feiticos[chave_classe] = {};
    }
    if (gEntradas.slots_feiticos[chave_classe][nivel_slot] == null) {
      gEntradas.slots_feiticos[chave_classe][nivel_slot] = [];
    }
    gEntradas.slots_feiticos[chave_classe][nivel_slot].push({ gasto: gasto });
  }
}

function _LeSlotsFeiticos() {
  // Comecar pelo gasto que esta sempre presente.
  gEntradas.slots_feiticos = {};
  gEntradas.slots_feiticos_dominio = {};
  gEntradas.slots_feiticos_especializados = {};
  var doms_feiticos_gastos = DomsPorClasse('feiticos-slots-gastos');

  // Este primeiro loop vai criar todas as gEntradas com apenas o atributo gasto preenchido.
  // O proximo loop preencherá o resto.
  for (var i = 0; i < doms_feiticos_gastos.length; ++i) {
    var classe_nivel_indice = _LeClasseNivelIndice(doms_feiticos_gastos[i].id);
    _PreencheSlotGasto(
        classe_nivel_indice[0],
        classe_nivel_indice[1],
        classe_nivel_indice[2],
        doms_feiticos_gastos[i].checked);
  }

  // O restante ja foi preenchido acima. So falta o feitico em si.
  // O indice_conhecido é formado por nivel_indice. O nível é necessário porque é possível
  // selecionar um feitiço de nível inferior ao do slot.
  var doms_select_feitico = DomsPorClasse('feiticos-slots');
  for (var i = 0; i < doms_select_feitico.length; ++i) {
    var classe_nivel_indice = _LeClasseNivelIndice(doms_select_feitico[i].id);
    var chave_classe = classe_nivel_indice[0];
    var nivel_slot = classe_nivel_indice[1];
    var indice_slot = classe_nivel_indice[2];
    var slot = gEntradas.slots_feiticos[chave_classe][nivel_slot][indice_slot];
    var nivel_indice = ValorSelecionado(doms_select_feitico[i]);
    if (nivel_indice != null) {
      nivel_indice = nivel_indice.split('-');
      if (nivel_indice.length == 1) {
        // Compatibilidade... Se só tiver 1, usa de índice do mesmo nível.
        slot.nivel = nivel_slot;
        slot.indice = nivel_indice[0];
      } else {
        slot.nivel = nivel_indice[0];
        slot.indice = nivel_indice[1];
      }
    }
  }

}

function _LeFeiticos() {
  _LeEscolasProibidas();
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

function _LeHabilidadesEspeciais() {
 gEntradas.habilidades_especiais = {};
 var filhos = Dom('habilidades-especiais').childNodes;
 for (var i = 0; i < filhos.length; ++i) {
   var filho = filhos.item(i);
   if (filho.tagName != "DIV") {
     continue;
   }
   _LeHabilidadeEspecial(filhos.item(i));
 }
}

// Recebe o div da habilidade especial, que deve ter o id 'habilidade-especial-' + chave_especial.
// Caso possua usos, estarao dentro de checkboxes.
function _LeHabilidadeEspecial(dom_habilidade) {
  var filhos = dom_habilidade.childNodes;
  // Tira prefixo habilidade-especial-.
  var chave_especial = dom_habilidade.id.split('-');
  chave_especial.shift();
  chave_especial.shift();
  chave_especial = chave_especial.shift();
  var usos = [];  // array de boolean representando cada uso.
  for (var i = 0; i < filhos.length; ++i) {
    var filho = filhos.item(i);
    if (filho.tagName != "INPUT") {
      continue;
    }
    usos.push(filho.checked);
  }
  if (usos.length > 0) {
    gEntradas.habilidades_especiais[chave_especial] = usos;
  }
}

function _LeEquipamentos() {
  // Armadura e escudo.
  //gEntradas.armadura.nome =
  //    ValorSelecionado(Dom('armadura'));
  //gEntradas.armadura.bonus_magico =
  //    parseInt(Dom('bonus-armadura').value) || 0;
  //gEntradas.escudo.nome =
  //    ValorSelecionado(Dom('escudo'));
  //gEntradas.escudo.bonus_magico =
  //    parseInt(Dom('bonus-escudo').value) || 0;
  gEntradas.outros_equipamentos = Dom('text-area-outros-equipamentos').value;

  // Moedas
  gEntradas.platina = parseInt(Dom('moedas-platina').value);
  gEntradas.ouro = parseInt(Dom('moedas-ouro').value);
  gEntradas.prata = parseInt(Dom('moedas-prata').value);
  gEntradas.cobre = parseInt(Dom('moedas-cobre').value);

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
  _LeArmasArmadurasEscudos(gEntradas.armas, Dom('div-equipamentos-armas'));
}

function _LeArmaduras() {
  _LeArmasArmadurasEscudos(gEntradas.armaduras, Dom('div-equipamentos-armaduras'));
}

function _LeEscudos() {
  _LeArmasArmadurasEscudos(gEntradas.escudos, Dom('div-equipamentos-escudos'));
}
// Fim funcoes iguais.

// Le armas e armaduras.
// @param array_entrada o array na entrada. Pode ser gEntradas.armas ou armaduras.
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
  gEntradas[tipo_item] = [];
  var dom = DomsPorClasse('div-' + tipo_item);
  for (var i = 0; i < dom.length; ++i) {
    gEntradas[tipo_item].push(LeItem(dom[i]));
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

// Adiciona moedas as gEntradas. Valores podem ser negativos.
// O personagem nunca pode ficar com moedas negativas, neste caso
// a funcao nao fara nada.
// @param moedas um objeto contendo { ouro, platina, prata, cobre}
// @return true se foi possivel adicionar as moedas.
function EntradasAdicionarMoedas(moedas) {
  // verifica fundos.
  for (var tipo_moeda in moedas) {
    if (gEntradas[tipo_moeda] + moedas[tipo_moeda] < 0) {
      return false;
    }
  }

  for (var tipo_moeda in moedas) {
    gEntradas[tipo_moeda] += moedas[tipo_moeda];
  }
  return true;
}

// Adiciona ferimentos as gEntradas.
function EntradasAdicionarFerimentos(valor, nao_letal) {
  var tipo = nao_letal ? "ferimentos_nao_letais" : "ferimentos";
  gEntradas[tipo] += valor;
  if (gEntradas[tipo] < 0) {
    gEntradas[tipo] = 0;
  }
}
