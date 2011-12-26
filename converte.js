// Funcoes de conversao de entrada para personagem.

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
  personagem.nome = entradas.nome;
  personagem.raca = entradas.raca;
  personagem.tamanho.categoria =
    tabelas_raca[personagem.raca].tamanho;
  personagem.tamanho.modificador_ataque_defesa =
    tabelas_tamanho[personagem.tamanho.categoria].ataque_defesa;

  personagem.alinhamento = entradas.alinhamento;
  personagem.classes = entradas.classes;
  personagem.pontos_vida.total = entradas.pontos_vida;
  personagem.pontos_vida.ferimentos = entradas.ferimentos;
  personagem.pontos_vida.dados_vida = 0;
  personagem.experiencia = entradas.experiencia;
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
        tabelas_classes[personagem.classes[i].classe].bba(personagem.classes[i].nivel);
  }
  personagem.bba_cac = 
      personagem.bba + personagem.atributos.forca.modificador + 
      personagem.tamanho.modificador_ataque_defesa;
  personagem.bba_distancia = 
      personagem.bba + personagem.atributos.destreza.modificador + 
      personagem.tamanho.modificador_ataque_defesa;

  // Talentos.
  _ConverteTalentos();

  // Pericias.
  _ConvertePericias();

  // Atualizacao da proficiencia e foco em armas.
  _ConverteProficienciaArmas();
  _ConverteFocoArmas();
  //_ConverteEspecializacaoArmas();

  // Atualizacao de equipamentos.
  // moedas.
  for (var tipo_moeda in personagem.moedas) {
    personagem.moedas[tipo_moeda] = entradas[tipo_moeda];
  }
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

  // Feiticos.
  _ConverteFeiticos();
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
  } else if (arma_personagem.foco) {
    bonus_por_categoria.ataque += arma_personagem.foco;
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
// TODO verificar pre requisitos de cada talento.
function _ConverteTalentos() {
  // Zera os bonus de talentos de todas as pericias.
  for (var chave_pericia in personagem.pericias.lista) {
    personagem.pericias.lista[chave_pericia].bonus_talentos = {};
  }

  personagem.talentos.nivel = 1 + Math.floor(personagem.pontos_vida.dados_vida / 3);
  personagem.talentos.total = 
      personagem.talentos.nivel + 
      (tabelas_raca[personagem.raca].talento_extra ? 1 : 0);
  personagem.talentos.lista = [];
  for (var i = 0; i < entradas.talentos.length; ++i) {
    var chave_talento = entradas.talentos[i].nome;
    personagem.talentos.lista.push({
        nome: chave_talento,
        complemento: entradas.talentos[i].complemento });
    var bonus_pericias = tabelas_talentos[chave_talento].bonus_pericias;
    for (var chave_pericia in bonus_pericias) {
      personagem.pericias.lista[chave_pericia].bonus_talentos[chave_talento] = bonus_pericias[chave_pericia];
    }
  }
}

// Converte todas as pericias. Primeiro calcula o total de pontos e depois varre as entradas
// de pericia, computando o valor de cada uma e o numero de pontos disponiveis.
function _ConvertePericias() {
  personagem.pericias.total_pontos = 0;
  var first_level = true;
  for (var i = 0; i < personagem.classes.length; ++i) {
    var nivel = personagem.classes[i].nivel;
    var pontos_classe = tabelas_classes[personagem.classes[i].classe].pontos_pericia;
    var pontos_inteligencia = personagem.atributos.inteligencia.modificador;

    // Se o primeiro nivel estiver neste pacote de niveis, ele conta como 3 niveis a mais.
    var pontos_iteracao = 0;
    if (first_level) {
      nivel += 3;
      first_level = false;
    }
    personagem.pericias.total_pontos += (pontos_classe + pontos_inteligencia) * nivel;
  }

  personagem.pericias.pontos_gastos = 0;
  for (var i = 0; i < entradas.pericias.length; ++i) {
    var pericia = tabelas_pericias[entradas.pericias[i].chave];
    var pericia_personagem = personagem.pericias.lista[entradas.pericias[i].chave];
    pericia_personagem.pontos = entradas.pericias[i].pontos;
    pericia_personagem.graduacoes = PersonagemPossuiUmaDasClasse(pericia.classes) ?
        pericia_personagem.pontos : Math.floor(pericia_personagem.pontos / 2);
    pericia_personagem.bonus_sinergia = 0;
    pericia_personagem.bonus_habilidade = personagem.atributos[pericia.habilidade].modificador;
    // soma todos os bonus de talentos.
    var bonus_talentos_total = 0;
    for (var chave_talento in pericia_personagem.bonus_talentos) {
      bonus_talentos_total += pericia_personagem.bonus_talentos[chave_talento];
    }
    pericia_personagem.total = 
        pericia_personagem.graduacoes + 
        pericia_personagem.bonus_habilidade + 
        bonus_talentos_total +
        pericia_personagem.bonus_sinergia;

    personagem.pericias.pontos_gastos += pericia_personagem.pontos;
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

// Converte o foco em armas do personagem.
function _ConverteFocoArmas() {
  personagem.foco_armas = {};
  // Talentos. Preciso obter o nome da chave na tabela de armas.
  for (var i = 0; i < personagem.talentos.lista.length; ++i) {
    var talento = personagem.talentos.lista[i];
    if (talento.nome == 'foco_em_arma' && talento.complemento != null) {
      var chave_arma = tabelas_armas_invertida[talento.complemento];
      if (chave_arma == null) {
        alert('Arma "' + talento.complemento + '" inválida para talento "' + 
              tabelas_talentos[talento.nome].nome + '"');
        continue;
      }
      personagem.foco_armas[chave_arma] = 1;
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
  arma_personagem.foco = PersonagemFocoComArma(arma_entrada.nome);
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

// Converte todos os feiticos do personagem.
function _ConverteFeiticos() {
  // Completa o objeto de feiticos de acordo com as classes de personagem.
  personagem.feiticos = {};
  for (var i = 0; i < personagem.classes.length; ++i) {
    var chave_classe = personagem.classes[i].classe;
    var feiticos_classe = tabelas_feiticos[chave_classe];
    if (feiticos_classe == null) {
      continue;
    }
    personagem.feiticos[chave_classe] = {
      habilidade_chave: tabelas_feiticos[chave_classe].habilidade_chave,
      conhecidos: {},
      slots: {}
    };
    var nivel_inicial = feiticos_classe.possui_nivel_zero ? 0 : 1;
    var feiticos_por_nivel = feiticos_classe.por_nivel[personagem.classes[i].nivel];
    // TODO usar slots ao inves de conhecidos, ja que nem sempre a classe usa conhecidos.
    for (var indice = 0; indice < feiticos_por_nivel.conhecidos.length; ++indice) {
      var nivel_feitico = nivel_inicial + indice;
      // conhecidos.
      var array_conhecidos_nivel = new Array();
      array_conhecidos_nivel.length = parseInt(feiticos_por_nivel.conhecidos.charAt(indice)) || 0;
      personagem.feiticos[chave_classe].conhecidos[nivel_feitico] = array_conhecidos_nivel;

      // slots.
      var personagem_slots_nivel = {
          base: parseInt(feiticos_por_nivel.por_dia.charAt(indice)) || 0,
          bonus_habilidade: 0,  // TODO
          feiticos: [],
      }
      personagem_slots_nivel.feiticos.length = 
          personagem_slots_nivel.base + personagem_slots_nivel.bonus_habilidade;
      personagem.feiticos[chave_classe].slots[nivel_feitico] = personagem_slots_nivel;
    }
  }

  // Preenche objeto de feiticos com as entradas.
  for (var i = 0; i < entradas.feiticos.conhecidos.length; ++i) {
    var entrada_feitico = entradas.feiticos.conhecidos[i];
    var personagem_feiticos = personagem.feiticos[entrada_feitico.classe];
    if (personagem_feiticos == null ||
        personagem_feiticos.conhecidos == null || 
        personagem_feiticos.conhecidos[entrada_feitico.nivel] == null ||
        personagem_feiticos.conhecidos[entrada_feitico.nivel].length <= entrada_feitico.slot) {
      // Pode acontecer ao diminuir nivel ou remover classe com feitico.
      continue;
    }
    personagem_feiticos.conhecidos[entrada_feitico.nivel][entrada_feitico.slot] =
        entrada_feitico.feitico;
  }

  // TODO slots.
}

