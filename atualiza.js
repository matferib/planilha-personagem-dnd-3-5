// Todas as funcoes de atualizacao.

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha. Partes que dependem de outras devem vir apos sua dependencia.
function AtualizaGeral() {
  // Apenas le as entradas para a estrutura de entradas.
  LeEntradas(); 
  // converte a estrutura de entradas para a de personagem.
  ConverteEntradasParaPersonagem();
  _AtualizaGeral();
}

// Chamada apenas para a atualizacao inicial apos leitura da URL.
function AtualizaGeralSemLerOuEscrever() {
  _AtualizaGeral();
}

// Apenas atualizacoes, sem leitura ou escrita de entradas.
function _AtualizaGeral() {
  _AtualizaTamanho();
  _AtualizaModificadoresAtributos();
  _AtualizaDadosVida();
  _AtualizaAtaque();
  _AtualizaEstilosLuta();
  _AtualizaDefesa();
  _AtualizaSalvacoes();
  _AtualizaTalentos();
}

// Atualiza o tamanho em funcao da raca.
function _AtualizaTamanho() {
  // Busca o modificador de tamanho da raca.
  personagem.tamanho.categoria =
    tabelas_raca[personagem.raca].tamanho;
  personagem.tamanho.modificador_ataque_defesa =
    tabelas_tamanho[personagem.tamanho.categoria].ataque_defesa;
  ImprimeSinalizado(
      personagem.tamanho.modificador_ataque_defesa,
      goog.dom.getElementsByClass('tamanho-mod-ataque-defesa'));
  goog.dom.getElement('tamanho').innerText =
      tabelas_tamanho[personagem.tamanho.categoria].nome;
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car),
// a raca, class etc.
function _AtualizaModificadoresAtributos() {
  // busca a raca e seus modificadores.
  var modificadores_raca = tabelas_raca[personagem.raca].atributos;

  // Busca cada elemento das estatisticas e atualiza modificadores.
  for (var habilidade in personagem.atributos) {
    // modificador racial.
    if (modificadores_raca[habilidade]) {
      var modificador_racial = modificadores_raca[habilidade];
      personagem.atributos[habilidade].valor += modificador_racial;
      // Escreve o modificador racial.
      ImprimeSinalizado(
          modificador_racial,
          goog.dom.getElement(habilidade + '-mod-racial'));
    } 
    else {
      ImprimeNaoSinalizado('', goog.dom.getElement(habilidade + '-mod-racial'));
    }

    // Escreve o valor total.
    ImprimeNaoSinalizado(
        personagem.atributos[habilidade].valor, 
        goog.dom.getElement(habilidade + '-valor-total'));

    // modificador da habilidade.
    personagem.atributos[habilidade].modificador = 
      Math.floor((personagem.atributos[habilidade].valor - 10) / 2);
    // Caso especial: destreza. Depende da armadura e escudo.
    if (habilidade == 'destreza') {
      var armadura = tabelas_armaduras[personagem.armadura.nome];
      if (armadura.maximo_bonus_destreza && 
          armadura.maximo_bonus_destreza < personagem.atributos[habilidade].modificador) {
        personagem.atributos[habilidade].modificador = armadura.maximo_bonus_destreza;
      }
      var escudo = tabelas_escudos[personagem.escudo.nome];
      if (escudo.maximo_bonus_destreza &&
          escudo.maximo_bonus_destreza < personagem.atributos[habilidade].modificador) {
        personagem.atributos[habilidade].modificador = escudo.maximo_bonus_destreza;
      }
    }
    // Escreve o modificador.
    ImprimeSinalizado(
        personagem.atributos[habilidade].modificador,
        goog.dom.getElementsByClass(habilidade + '-mod-total'));
  }
}

// Atualiza os dados de vida do personagem de acordo com as classes.
function _AtualizaDadosVida() {
  var primeiro = true;  // primeira classe nao eh sinalizada.
  var string_dados_vida = '';
  var dados_vida_total = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
      dados_vida_total += personagem.classes[i].nivel;
      if (primeiro) {
        primeiro = false;
      } else {
        string_dados_vida += ' +';
      }
      string_dados_vida += 
        personagem.classes[i].nivel + 'd' + tabelas_dados_vida[personagem.classes[i].classe];

  }
  personagem.pontos_vida.dados_vida = dados_vida_total;
  if (personagem.atributos.constituicao.modificador > 0 && dados_vida_total > 0) {
    string_dados_vida += 
      ' +' + (personagem.atributos.constituicao.modificador*dados_vida_total);
  }
  var span_dados = goog.dom.getElement('dados-vida-classes');
  span_dados.innerText = dados_vida_total + ' = ' + string_dados_vida;
  // Pontos de vida.
  var pontos_vida_corrente = personagem.pontos_vida.total - personagem.pontos_vida.ferimentos;
  ImprimeNaoSinalizado(pontos_vida_corrente, goog.dom.getElement('pontos-vida-corrente'));
}

// Atualiza os diversos tipos de ataques lendo a classe e os modificadores relevantes. 
function _AtualizaAtaque() {
  var bba = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
    bba += tabelas_bba[personagem.classes[i].classe](personagem.classes[i].nivel);
  }
  ImprimeSinalizado(bba, goog.dom.getElementsByClass('bba'));
  personagem.bba = bba;
  // Corpo a corpo.
  personagem.bba_cac = 
      bba + personagem.atributos.forca.modificador + 
      personagem.tamanho.modificador_ataque_defesa;
  ImprimeSinalizado(
      personagem.bba_cac,
      goog.dom.getElementsByClass('bba-corpo-a-corpo'));

  // Distancia.
  personagem.bba_distancia = 
      bba + personagem.atributos.destreza.modificador + 
      personagem.tamanho.modificador_ataque_defesa;
  ImprimeSinalizado(
      personagem.bba_distancia,
      goog.dom.getElementsByClass('bba-distancia'));
}

// Atualiza a lista de armas de cada estilo.
function _AtualizaEstilosLuta() {
  var div_estilos = goog.dom.getElement("div-estilos-luta");
  for (var i = 0; i < div_estilos.childNodes.length; ++i) {
    _AtualizaEstilo(div_estilos.childNodes[i]);
  }
}

// Usada por _AtualizaEstilosLuta.
function _AtualizaEstilo(div_estilo) {
  var id_estilo = div_estilo.id; 

  var id_select_primario = 
      id_estilo.replace('id-estilo', 'id-select-primario-estilo');
  var id_span_primario =
      id_estilo.replace('id-estilo', 'id-span-primario-estilo');
  var select_primario = goog.dom.getElement(id_select_primario);
  var nome_arma_primaria = ValorSelecionado(select_primario);
  AdicionaArmasAoEstilo(select_primario, nome_arma_primaria);
  _AtualizaArma(nome_arma_primaria, goog.dom.getElement(id_span_primario));

  var id_select_secundario = 
      id_estilo.replace('id-estilo', 'id-select-secundario-estilo');
  var id_span_secundario =
      id_estilo.replace('id-estilo', 'id-span-secundario-estilo');
  var select_secundario = goog.dom.getElement(id_select_secundario);
  var nome_arma_secundaria = ValorSelecionado(select_secundario);
  AdicionaArmasAoEstilo(select_secundario, nome_arma_secundaria);
  _AtualizaArma(nome_arma_secundaria, goog.dom.getElement(id_span_secundario));
}

// Atualiza o span de uma arma no estilo de luta com seus valores de ataque e defesa
// @param span_arma o dom da arma, que eh um span.
function _AtualizaArma(nome_arma, span_arma) {
  // TODO terminar.
  span_arma.innerText = '';
  var arma = ArmaPersonagem(nome_arma);
  var arma_tabela = arma.arma_tabela;
  for (var categoria in arma_tabela.categorias) {
    if (!arma_tabela.categorias[categoria]) {
      continue;
    }
    if (categoria.indexOf('cac') != -1) {
      span_arma.innerText += categoria + ': ' + 
                             StringSinalizada(personagem.bba_cac + arma.bonus_ataque) + ', ' + 
                             arma_tabela.dano[personagem.tamanho.categoria] + 
                             StringSinalizada(personagem.atributos.forca.modificador + arma.bonus_dano) +
                             '; ';
    } else {
      span_arma.innerText += categoria + ': ...';
    }
  }
}

// Atualiza os varios tipos de defesa lendo tamanho, armadura e modificadores relevantes.
function _AtualizaDefesa() {
  ImprimeSinalizado(tabelas_armaduras[personagem.armadura.nome].bonus +
                    personagem.armadura.bonus_magico,
                    goog.dom.getElementsByClass('ca-armadura'));
  ImprimeSinalizado(tabelas_escudos[personagem.escudo.nome].bonus + 
                    personagem.escudo.bonus_magico,
                    goog.dom.getElementsByClass('ca-escudo'));

  // AC normal.
  ImprimeNaoSinalizado(
      10 + personagem.atributos.destreza.modificador +
          tabelas_armaduras[personagem.armadura.nome].bonus +
          personagem.armadura.bonus_magico +
          tabelas_escudos[personagem.escudo.nome].bonus +
          personagem.escudo.bonus_magico +
          personagem.tamanho.modificador_ataque_defesa, 
      goog.dom.getElementsByClass('ca-normal'));
  // AC surpreso.
  ImprimeNaoSinalizado(
      10 + personagem.tamanho.modificador_ataque_defesa + 
          tabelas_armaduras[personagem.armadura.nome].bonus +
          tabelas_escudos[personagem.escudo.nome].bonus,
      goog.dom.getElementsByClass('ca-surpreso'));
  // AC toque.
  ImprimeNaoSinalizado(
      10 + personagem.atributos.destreza.modificador + 
          personagem.tamanho.modificador_ataque_defesa, 
      goog.dom.getElementsByClass('ca-toque'));
}

// Atualiza as salvacoes, calculando o bonus base de acordo com a classe e
// modificando pelo atributo relevante.
function _AtualizaSalvacoes() {
  var habilidades_salvacoes = {
    fortitude: 'constituicao',
    reflexo: 'destreza',
    vontade: 'sabedoria'
  };
  for (var tipo_salvacao in habilidades_salvacoes) {
    var valor_base = 0;
    for (var i = 0; i < personagem.classes.length; ++i) {
      var classe = personagem.classes[i].classe;
      valor_base += 
        tabelas_salvacao[classe][tipo_salvacao](personagem.classes[i].nivel);
    }
    var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
    var modificador_atributo = 
      personagem.atributos[habilidade_modificadora].modificador;
    personagem.salvacoes[tipo_salvacao] = valor_base + modificador_atributo;
    ImprimeNaoSinalizado(
        valor_base,
        goog.dom.getElement(tipo_salvacao + '-valor-base'));
    ImprimeSinalizado(
        personagem.salvacoes[tipo_salvacao],
        goog.dom.getElement(tipo_salvacao + '-mod-total'));
  }
}

// Um talento inicial mais um a cada 3 niveis.
function _AtualizaTalentos() {
  personagem.talentos.nivel = 1 + Math.floor(personagem.pontos_vida.dados_vida / 3);

  ImprimeNaoSinalizado(personagem.talentos.nivel, goog.dom.getElementByClass('talentos-total'));
  ImprimeNaoSinalizado(personagem.talentos.nivel, goog.dom.getElementByClass('talentos-nivel'));

}

