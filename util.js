// Tudo que for util e nao se encaixar em lugar nenhum.

// Retorna uma string do valor de forma sinalizada.
// @param valor a ser impresso.
// @param imprime_zero opcional, default true. Se false, retorna vazio quando
// o valor for zero.
function StringSinalizada(valor, imprime_zero) {
  if (imprime_zero == null) {
    imprime_zero = true;
  }
  if (!imprime_zero && valor == 0) {
    return '';
  }
  var return_value = '';
  if (valor >= 0) {
    return_value = '+';
  }
  return return_value + valor;
}

// Imprime um valor de forma sinalizada ou seja, com +/- na frente).
// @param dom pode ser um span ou div, ou qualquer elemento que possua textContent.
// Tambem pode ser um array de dom.
// @param imprime_zero opcional, default true. Se false, imprime_vazio no dom. 
function ImprimeSinalizado(valor, dom, imprime_zero) {
  if (imprime_zero == null) {
    imprime_zero = true;
  }

  if (dom.length == null) {
    if (valor > 0) {
      dom.textContent = '+' + valor;
    } else if (valor == 0) {
      dom.textContent = imprime_zero ? '+0' : '';
    } else {
      dom.textContent = valor;
    }
  }
  else {
    for (var i = 0; i < dom.length; ++i) {
      ImprimeSinalizado(valor, dom[i], imprime_zero);
    }
  }
}

// Imprime um valor de forma nao sinalizada no caso positivo.
// @param dom pode ser um span ou div, ou qualquer elemento que possua textContent.
function ImprimeNaoSinalizado(valor, dom, imprime_zero) {
  if (imprime_zero == null) {
    imprime_zero = true;
  }

  if (dom.length == null) {
    dom.textContent = imprime_zero ? valor : '';
  }
  else {
    for (var i = 0; i < dom.length; ++i) {
      ImprimeNaoSinalizado(valor, dom[i]);
    }
  }
}

// Adiciona um elemento span ao div e o retorna.
function AdicionaSpanAoDiv(texto, id_span, div) {
  var span = CriaSpan(texto, id_span);
  div.appendChild(span);
  return span;
}

// Retorna numero * [1, limite].
function Rola(numero, limite) {
  var resultado = 0;
  for (var i = 0; i < numero; ++i) {
    resultado += Math.floor(Math.random() * limite) + 1;
  }
  return resultado;
}

// Gera um identificador unico para o filho de um elemento.
// @return prefixo-id, onde nenhum outro filho do elemento possui
// identificador igual.
function GeraId(prefixo, elemento) {
  //return prefixo + '-' + elemento.childNodes.length;
  var id = 0;
  while (true) {
    var tentativa = prefixo + '-' + id;
    var encontrou_igual = false;
    for (var i = 0; i < elemento.childNodes.length; ++i) {
      var filho = elemento.childNodes[i];
      if (filho.id && filho.id.indexOf(tentativa) != -1) {
        encontrou_igual = true;
      }
    }
    if (encontrou_igual) {
      ++id;
    } else {
      return tentativa;
    }
  }
}

// @return a soma de dois preços.
function SomaPrecos(preco1, preco2) {
  var moedas = { platina: 0, ouro: 0, prata: 0, cobre: 0 };
  for (tipo_moeda in moedas) {
    if (tipo_moeda in preco1) {
      moedas[tipo_moeda] += preco1[tipo_moeda];
    }
    if (tipo_moeda in preco2) {
      moedas[tipo_moeda] += preco2[tipo_moeda];
    }
  }
  return moedas;
}

// Recebe uma string de preço e retorna um objeto contendo as moedas.
// @return objeto de moedas ou null em caso de erro.
// @param invertido (default false) se true, os valores sao invertidos (para realizar compras por exemplo).
function LePreco(preco, invertido) {
  var moedas = { platina: 0, ouro: 0, prata: 0, cobre: 0 };
  var sufixos = { platina: 'pl', ouro: 'po', prata: 'pp', cobre: 'pc' };
  var preco_minusculo = preco.toLowerCase();
  for (var tipo_moeda in moedas) {
    var indice_tipo = preco_minusculo.indexOf(sufixos[tipo_moeda]);
    if (indice_tipo != -1) {
      var string_val = preco_minusculo.substr(0, indice_tipo);
      var val = parseInt(string_val);
      if (val != NaN) {
        moedas[tipo_moeda] = invertido ? -parseInt(string_val) : parseInt(string_val);
      }
    }
  }
  return moedas;
}

// Le uma entrada de peso e retorna o valor em Kg.
// @param peso string com formato [0-9]*[,[0-9]*]\s*[g|kg].
// @return peso em Kg.
// TODO implementar.
function LePeso(peso) {
  var peso_minusculo = peso.toLowerCase();
  var indice_unidade = peso_minusculo.indexOf('kg');
  var unidade_gramas = false;
  if (indice_unidade == -1) {
    indice_unidade = peso_minusculo.indexOf('g');
    unidade_gramas = true;
  }
  // Não encontrei a unidade.
  if (indice_unidade == -1) {
    return null;
  }

  var peso_sem_unidade = peso_minusculo.substr(0, indice_unidade).replace(',', '.');
  var peso = parseFloat(peso_sem_unidade);

  return unidade_gramas ? peso / 1000.0 : peso;
}

// Armaduras e escudos tem o mesmo preco, so arma que muda.
// @param tipo arma, armadura, escudo.
// @param tabela onde o item sera consultado.
// @param chave do item na tabela.
// @param material do item (exemplo: nenhum, ou adamante).
// @param obra_prima se a arma for obra-prima (mas nao magica).
// @param bonus se a arma for magica (e o bonus). Sera computado o
//        valor da obra prima.
// @param invertido inverter os valores para negativo.
// @return o preco de uma arma, armadura ou escudo. null em caso de erro.
function PrecoArmaArmaduraEscudo(tipo, tabela, chave, material, obra_prima, bonus, invertido) {
  var entrada_tabela = tabela[chave];
  if (entrada_tabela == null || entrada_tabela.preco == null) {
    return null;
  }
  // Nao pode usar invertido aqui, pq la embaixo inverte tudo.
  var preco = LePreco(entrada_tabela.preco);
  var preco_adicional = { platina: 0, ouro: 0, prata: 0, cobre: 0 };
  if (bonus && bonus > 0) {
    switch (bonus) {
      case 1: preco.ouro += tipo == 'arma' ? 2000 : 1000; break; 
      case 2: preco.ouro += tipo == 'arma' ? 8000 : 4000; break; 
      case 3: preco.ouro += tipo == 'arma' ? 18000 : 9000; break; 
      case 4: preco.ouro += tipo == 'arma' ? 32000 : 16000; break; 
      case 5: preco.ouro += tipo == 'arma' ? 50000 : 25000; break; 
      default:
          return null;
    }
  }
  if (obra_prima) {
    // Armas op custam 300 a mais, armaduras e escudos, 150.
    preco_adicional.ouro += tipo == 'arma' ? 300 : 150; 
  }
  // Modificadores de materiais.
  if (material != 'nenhum') {
    var preco_material = null;
    var tabela_material = tabelas_materiais_especiais[material];
    if (tabela_material.custo_por_tipo) {
      var custo = tabela_material.custo_por_tipo[tipo];
      if (custo.por_subtipo) {
        // TODO
      } else {
        preco_material = LePreco(custo);
      }
    } else if (tabela_material.custo_por_kg) {
      var peso_kg = LePeso(entrada_tabela.peso);
      preco_material = LePreco(tabela_material.custo_por_kg);
      for (var tipo_moeda in preco_material) {
        preco_material[tipo_moeda] *= peso_kg;
      }
    } else if (material == 'couro_dragao') {
      // Preco da armadura mais obra prima.
      preco_material = SomaPrecos(LePreco(entrada_tabela.preco), { ouro: 150 });
    } else if (material == 'ferro_frio') {
      // Preço da arma normal e cada bonus custa 2000 PO a mais.
      preco_material = LePreco(entrada_tabela.preco);
      preco_material['ouro'] += bonus * 2000;
    } else if (material == 'mitral') {
      // Preco tabelado de acordo com tipo da armadura ou escudo (excluidindo custo de obra prima).
      var custo = 0;  // escudo ou leve.
      if (tipo == 'escudo') {
        custo = 850;
      } else {
        var talento_relacionado = entrada_tabela.talento_relacionado;
        if (talento_relacionado == 'usar_armaduras_leves') {
          custo = 850;
        } else if (talento_relacionado == 'usar_armaduras_medias') {
          custo = 3850;
        } else if (talento_relacionado == 'usar_armaduras_pesadas') {
          custo = 8850;
        }
      }
      preco_material = { ouro: custo };
    } else if (material == 'prata_alquimica') {
      var categorias = entrada_tabela.categorias;
      var custo = 0;
      if ('cac_leve' in categorias) {
        custo = 20;
      } else if ('cac' in categorias) {
        custo = 90;
      } else if ('cac_duas_maos' in categorias) {
        custo = 180;
      }
      preco_material = { ouro: custo };
    }
    // Adiciona preco do material.
    preco_adicional = SomaPrecos(preco_adicional, preco_material);
  }

  // Soma e se necessario, inverte.
  preco = SomaPrecos(preco, preco_adicional);
  if (invertido) {
    for (var tipo_moeda in preco) {
      preco[tipo_moeda] = -preco[tipo_moeda];
    }
  }
  return preco;
}

// Gera o titulo de um elemento HTML (o texto que aparece no mouseover).
// @param titulo que apareceea.
// Dom o objeto que recebera o titulo.
function TituloSimples(titulo, dom) {
  dom.title = titulo;
}

// Gera o titulo de um elemento HTML (o texto que aparece no mouseover).
// @param pares um array de par: texto valor.
// Dom o objeto que recebera o titulo.
function Titulo(pares, dom) {
  var titulo = '';
  for (var i = 0; i < pares.length; ++i) {
    var parcial = pares[i];
    for (var chave in parcial) {
      titulo += chave + ': ' + StringSinalizada(parcial[chave]) + '\n';
    }
  }
  if (titulo.length > 0) {
    titulo = titulo.slice(0, -1);
  }
  dom.title = titulo;
}

// Realiza o trim da string (remove espacos antes e depois).
function AjustaString(str) {
  if (String.prototype.trim != null) {
    return str.trim();
  } else {
    str = str.replace(/\s*$/, "");  // direita.
    str = str.replace(/^\s*/, "");  // esquerda.
    return str;
  }
}

// Wrapper do alert.
function Mensagem(msg) {
  JanelaMensagem(msg);
}

// Converte as chaves de um mapa para um array de chaves.
function MapaParaLista(mapa) {
  var lista = [];
  for (var chave in mapa) {
    lista.push(chave);
  }
  return lista;
}

// Funções de Storage (Armazem). Por causa da API assíncrona do chrome,
// fiz todas as versões da mesma forma. Uma pena, porque a outra era bem mais simples.
// @return true se o armazem do chrome estiver presente.
function _ArmazemChrome() {
  return (typeof chrome !== 'undefined') && 
         chrome.storage && chrome.storage.sync;
}

// Salva o 'valor' usando 'nome' como chave. Chama callback quando terminar.
// @param valor string a ser salva.
function SalvaNoArmazem(nome, valor, callback) {
  if (_ArmazemChrome()) {
    var obj = {};
    obj[nome] = valor;
    chrome.storage.sync.set(obj, callback);
  } else {
    localStorage.setItem(nome, valor);
    callback();
  }
}

// Le o valor de nome do Armazem. Chama callback({ nome: valor }). O valor será
// uma string.
// Caso nao haja valor, chamará callback({ nome: null }).
function AbreDoArmazem(nome, callback) {
  if (_ArmazemChrome()) {
    chrome.storage.sync.get(nome, callback);
  } else {
    var obj = {};
    obj[nome] = (nome in localStorage) ? localStorage.getItem(nome) : null;
    callback(obj);
  }
}

// @param callback chamado como callback(lista_nomes).
function ListaDoArmazem(callback) {
  if (_ArmazemChrome()) {
    chrome.storage.sync.get(null, function(items) {
      callback(MapaParaLista(items));
    });
  } else {
    callback(MapaParaLista(localStorage));
  }
}

// Excluir um nome do armazem.
// @param callback chamado quando a operação terminar.
function ExcluiDoArmazem(nome, callback) {
  if (_ArmazemChrome()) {
    chrome.storage.sync.remove(nome, callback);
  } else {
    localStorage.removeItem(nome);
    callback();
  }
}

// Dado um objeto de valores, atualiza o objeto para ter os mesmos valores.
// Exemplo: valores: { a: { b: 'valor_b' } }
//          objeto: { o: {} }
// Após a chamada:
//          objeto: { o: {}, a: { b: 'valor_b' }  }
function AtualizaObjeto(valores, objeto) {
// TODO  
}


// Fim das funções de Storage.



