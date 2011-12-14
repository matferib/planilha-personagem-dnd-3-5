// Funcoes de conversao de entrada para personagem.

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  personagem.nome = entradas.nome;
  personagem.raca = entradas.raca;
  personagem.alinhamento = entradas.alinhamento;
  personagem.classes = entradas.classes;
  personagem.pontos_vida.total = entradas.pontos_vida;
  personagem.pontos_vida.ferimentos = entradas.ferimentos;
  personagem.pontos_vida.dados_vida = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
    personagem.pontos_vida.dados_vida += personagem.classes[i].nivel;
  }
  for (var atributo in personagem.atributos) {
    personagem.atributos[atributo].valor = entradas[atributo];
    if (tabelas_raca[personagem.raca].atributos[atributo]) {
      // Modificador racial.
      personagem.atributos[atributo].valor += 
          tabelas_raca[personagem.raca].atributos[atributo];
    }
    personagem.atributos[atributo].modificador = 
        Math.floor((personagem.atributos[atributo].valor - 10) / 2);
  }
  personagem.bba = 0;
  for (var i = 0; i < personagem.classes.length; ++i) {
    personagem.bba += 
        tabelas_bba[personagem.classes[i].classe](personagem.classes[i].nivel);
  }
  personagem.bba_cac = 
      personagem.bba + personagem.atributos.forca.modificador + 
      personagem.tamanho.modificador_ataque_defesa;
  personagem.bba_distancia = 
      personagem.bba + personagem.atributos.destreza.modificador + 
      personagem.tamanho.modificador_ataque_defesa;

  // Talentos.
  _ConverteTalentos();

  // Atualizacao da proficiencia em armas.
  _ConverteProficienciaArmas();

  // Atualizacao de equipamentos.
  personagem.armadura = entradas.armadura;
  personagem.escudo = entradas.escudo;
  personagem.armas = [];
  // entrada fake para desarmado.
  var entrada_desarmado = {
    nome: 'desarmado', 
    nome_gerado: 'desarmado', 
    obra_prima: false, 
    bonus: 0
  };
  personagem.armas.push(_ConverteArma(entrada_desarmado));
  for (var i = 0; i < entradas.armas.length; ++i) {
    personagem.armas.push(_ConverteArma(entradas.armas[i]));
  }

  // Estilos tem que vir apos a atualizacao das armas do personagem, talentos e lista de armas.
  personagem.estilos_luta = [];
  for (var i = 0; i < entradas.estilos_luta.length; ++i) {
    personagem.estilos_luta.push(_ConverteEstilo(entradas.estilos_luta[i]));
  }

  // Salvacoes
  _ConverteSalvacoes();
}

// Converte um estilo da entrada para o personagem.
function _ConverteEstilo(estilo_entrada) {
  var arma_primaria = ArmaPersonagem(estilo_entrada.arma_primaria);
  var arma_secundaria = ArmaPersonagem(estilo_entrada.arma_secundaria);
  var estilo_personagem = { 
    nome: estilo_entrada.nome,
    arma_primaria: { 
      nome: arma_primaria != null ? 
          estilo_entrada.arma_primaria : 'desarmado',
      bonus_por_categoria: {}
    },
    arma_secundaria: {
      nome: arma_secundaria != null ? 
          estilo_entrada.arma_secundaria : 'desarmado',
      bonus_por_categoria: {}
    },
  };
  if (estilo_entrada.nome == 'arma_dupla' &&
      (arma_primaria == null || !arma_primaria.arma_tabela.arma_dupla)) {
    alert('Arma "' + estilo_personagem.arma_primaria.nome + '" não é dupla');
    estilo_personagem.nome = 'uma_arma';
  }

  // Se o estilo eh duplo, forca segunda arma ser igual a primeira.
  if (estilo_entrada.nome == 'arma_dupla') {
    estilo_personagem.arma_secundaria.nome = estilo_personagem.arma_primaria.nome;
  }

  // Atualiza as armas de novo, que podem ter virado 'desarmado' acima.
  arma_primaria = ArmaPersonagem(estilo_personagem.arma_primaria.nome);
  arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);

  // Atualiza cada categoria da arma no estilo.
  var secundaria_leve = false;
  for (var categoria in arma_secundaria.arma_tabela.categorias) {
    secundaria_leve = 
        (estilo_entrada.nome == 'duas_armas' && categoria.indexOf('leve') != -1) ||
        estilo_entrada.nome == 'arma_dupla';
  }

  for (var categoria in arma_primaria.arma_tabela.categorias) {
    estilo_personagem.arma_primaria.bonus_por_categoria[categoria] =
        _ConverteBonusPorCategoria(
            categoria, arma_primaria, estilo_personagem, true, secundaria_leve);
  }
  if (estilo_entrada.nome == 'duas_armas' || estilo_entrada.nome == 'arma_dupla') {
    for (var categoria in arma_secundaria.arma_tabela.categorias) {
        estilo_personagem.arma_secundaria.bonus_por_categoria[categoria] =
            _ConverteBonusPorCategoria(
                categoria, arma_secundaria, estilo_personagem, false, secundaria_leve);
    }
  }

  return estilo_personagem;
}

// Converte os bonus de ataque e dano para a categoria passada.
// @param categoria o nome da categoria da arma.
// @param arma_personagem a arma do personagem.
// @param primaria se true, indica se a arma eh primaria.
function _ConverteBonusPorCategoria(
    categoria, arma_personagem, estilo, primaria, secundaria_leve) {
  var bonus_por_categoria = { ataque: 0, dano: 0 };
  var multiplicador_dano_forca = 0;
  if (estilo.nome == 'uma_arma') {
    multiplicador_dano_forca = categoria.indexOf('leve') != -1 ? 1.0 : 1.5;
  } else if (estilo.nome == 'arma_escudo') {
    multiplicador_dano_forca = 1.0;
  } else if (estilo.nome == 'duas_armas' || estilo.nome == 'arma_dupla') {
    if (primaria) {
      bonus_por_categoria.ataque = secundaria_leve ? -4 : -6;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque += 2; 
      }
    } else {
      bonus_por_categoria.ataque = secundaria_leve ? -8 : -10;
      if (PersonagemPossuiTalento('combater_duas_armas')) {
        bonus_por_categoria.ataque += 6; 
      }
    }
    multiplicador_dano_forca = primaria ? 1.0 : 0.5;
  }

  if (categoria.indexOf('cac') != -1) {
    bonus_por_categoria.ataque += 
        personagem.bba_cac + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano += 
        Math.floor(personagem.atributos.forca.modificador * multiplicador_dano_forca) + 
        arma_personagem.bonus_dano;
  } else if (categoria.indexOf('arremesso') != -1) {
    bonus_por_categoria.ataque += 
        personagem.bba_distancia + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano += 
        personagem.atributos.forca.modificador + arma_personagem.bonus_dano;
  } else if (categoria.indexOf('distancia')) {
    bonus_por_categoria.ataque += 
        personagem.bba_distancia + arma_personagem.bonus_ataque;
    bonus_por_categoria.dano += arma_personagem.bonus_dano;
  }

  // Proficiencia.
  if (!arma_personagem.proficiente) {
    bonus_por_categoria.ataque -= 4;
  }

  // Bonus raciais.
  var bonus_racial = tabelas_raca[personagem.raca].bonus_ataque;
  if (bonus_racial) {
    if (bonus_racial.armas[arma_personagem.nome]) {
      bonus_por_categoria.ataque += bonus_racial.armas[arma_personagem.nome];
    } else if (bonus_racial.categorias[categoria]) {
      bonus_por_categoria.ataque += bonus_racial.categorias[categoria];
    }
  }

  return bonus_por_categoria;
}

// Converte os talentos do personagem.
function _ConverteTalentos() {
  personagem.talentos.nivel = 1 + Math.floor(personagem.pontos_vida.dados_vida / 3);
  personagem.talentos.total = 
      personagem.talentos.nivel + 
      (tabelas_raca[personagem.raca].talento_extra ? 1 : 0);
  personagem.talentos.lista = [];
  for (var i = 0; i < entradas.talentos.length; ++i) {
    personagem.talentos.lista.push({
        nome: entradas.talentos[i].nome,
        complemento: entradas.talentos[i].complemento });
  }
}

// Converte a proficiencia em armas do personagem.
function _ConverteProficienciaArmas() {
  var todas_simples = false;
  var todas_comuns = false;
  personagem.proficiencia_armas = [];
  for (var i = 0; i < personagem.classes.length; ++i) {
    var nome_classe = personagem.classes[i].classe;
    var armas_classe = tabelas_proficiencia_arma_por_classe[nome_classe].armas;
    for (var j = 0; armas_classe != null && j < armas_classe.length; ++j) {
      personagem.proficiencia_armas[armas_classe[j]] = true;
    }
    var talentos_classe = tabelas_proficiencia_arma_por_classe[nome_classe].talentos;
    for (var j = 0; talentos_classe != null && j < talentos_classe.length; ++j) {
      if (talentos_classe[j] == 'usar_armas_simples') {
        todas_simples = true;
      } else if (talentos_classe[j] == 'usar_armas_comuns') {
        todas_comuns = true;
      }
    }
  }
  if (todas_simples) {
    for (var arma in tabelas_armas_simples) {
      personagem.proficiencia_armas[arma] = true;
    }
  }
  if (todas_comuns) {
    for (var arma in tabelas_armas_comuns) {
      personagem.proficiencia_armas[arma] = true;
    }
    // Familiaridade.
    for (var arma in tabelas_raca[personagem.raca].familiaridade_arma) {
      personagem.proficiencia_armas[arma] = true;
    }
  }
  // Raciais.
  var armas_raca = tabelas_raca[personagem.raca].proficiencia_armas;
  for (var i = 0; armas_raca != null && i < armas_raca.length; ++i) {
    personagem.proficiencia_armas[armas_raca[i]] = true;
  }

  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var i = 0; i < personagem.talentos.lista.length; ++i) {
    var talento = personagem.talentos.lista[i];
    if ((talento.nome == 'usar_arma_comum' || talento.nome == 'usar_arma_exotica') && 
        (talento.complemento != null)) {
      var chave_arma = tabelas_armas_invertida[talento.complemento];
      if (chave_arma == null) {
        alert('Arma "' + talento.complemento + '" inválida para talento "' + 
              tabelas_talentos[talento.nome].nome + '"');
        continue;
      }
      var arma_tabela = tabelas_armas[chave_arma];
      if (arma_tabela.talento_relacionado != talento.nome) {
        // verifica familiaridade.
        var familiar = false;
        if (arma_tabela.talento_relacionado == 'usar_arma_exotica' && 
            tabelas_raca[personagem.raca].familiaridade_arma &&
            tabelas_raca[personagem.raca].familiaridade_arma[chave_arma] &&
            talento.nome == 'usar_arma_comum') {
          familiar = true;
        }
        if (!familiar) {
          alert('Arma "' + talento.complemento + '" inválida para talento "' + 
                tabelas_talentos[talento.nome].nome + '"');
          continue;
        }
      }
      personagem.proficiencia_armas[chave_arma] = true;
    }
  }
}

// Converte uma arma da entrada para personagem.
// @return a arma convertida.
function _ConverteArma(arma_entrada) {
  var arma_tabela = tabelas_armas[arma_entrada.nome];
  var arma_personagem = {};
  arma_personagem.arma_tabela = arma_tabela;
  // O nome da entrada eh apenas um indice na tabela de armas.
  arma_personagem.nome = arma_tabela.nome;
  arma_personagem.nome_gerado = arma_personagem.nome;
  if (arma_entrada.obra_prima) {
    arma_personagem.bonus_ataque = 1;
    arma_personagem.bonus_dano = 0;
    arma_personagem.nome_gerado += ' OP';
  } else {
    arma_personagem.bonus_ataque = arma_personagem.bonus_dano = 
        arma_entrada.bonus;
    if (arma_entrada.bonus > 0) {
      arma_personagem.nome_gerado += ' +' + arma_personagem.bonus_ataque;
    }
  }
  arma_personagem.proficiente = PersonagemProficienteComArma(arma_entrada.nome);
  return arma_personagem;
}

// Converte as salvacoes dos personagem de acordo com classes e modificadores.
// TODO fazer outros tipos de salvacao tb.
function _ConverteSalvacoes() {
  personagem.salvacoes = {};
  var habilidades_salvacoes = {
    fortitude: 'constituicao',
    reflexo: 'destreza',
    vontade: 'sabedoria'
  };
  for (var tipo_salvacao in habilidades_salvacoes) {
    personagem.salvacoes[tipo_salvacao] = {};
    var valor_base = 0;
    for (var i = 0; i < personagem.classes.length; ++i) {
      var classe = personagem.classes[i].classe;
      valor_base += 
          tabelas_salvacao[classe][tipo_salvacao](personagem.classes[i].nivel);
    }
    var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
    personagem.salvacoes[tipo_salvacao].base = valor_base;
    // modificador racial.
    var salvacoes_raca = tabelas_raca[personagem.raca].salvacoes;
    if (salvacoes_raca && salvacoes_raca[tipo_salvacao]) {
      personagem.salvacoes[tipo_salvacao].racial = salvacoes_raca[tipo_salvacao];
    } else {
      personagem.salvacoes[tipo_salvacao].racial = 0;
    }
    personagem.salvacoes[tipo_salvacao].total = 
        personagem.salvacoes[tipo_salvacao].base +
        personagem.salvacoes[tipo_salvacao].racial +
        personagem.atributos[habilidade_modificadora].modificador;
  }
  var outras_salvacoes_raca = tabelas_raca[personagem.raca].outras_salvacoes;
  for (var tipo_salvacao in outras_salvacoes_raca) {
    for (var i = 0; i < outras_salvacoes_raca[tipo_salvacao].base.length; ++i) {
      var nome_salvacao = tipo_salvacao + ' (' + outras_salvacoes_raca[tipo_salvacao].base[i] + ')';
      personagem.salvacoes[nome_salvacao] = {};
      personagem.salvacoes[nome_salvacao].base =
          personagem.salvacoes[outras_salvacoes_raca[tipo_salvacao].base[i]].total;
      personagem.salvacoes[nome_salvacao].racial = outras_salvacoes_raca[tipo_salvacao].bonus;
      personagem.salvacoes[nome_salvacao].total = personagem.salvacoes[nome_salvacao].base  +
                                                  personagem.salvacoes[nome_salvacao].racial;
    }
  }
}
