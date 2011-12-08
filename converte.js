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
  // Atualiza as armas que podem ter mudado.
  arma_primaria = ArmaPersonagem(estilo_personagem.arma_primaria.nome);
  arma_secundaria = ArmaPersonagem(estilo_personagem.arma_secundaria.nome);

  // Atualiza cada categoria da arma no estilo.
  var secundaria_leve = false;
  for (var categoria in arma_secundaria.arma_tabela.categorias) {
    if (estilo_entrada.nome == 'duas_armas') {
      if (categoria.indexOf('leve') != -1) {
        secundaria_leve = true;
      }
    }
  }
  for (var categoria in arma_secundaria.arma_tabela.categorias) {
    if (estilo_entrada.nome == 'duas_armas') {
      if (categoria.indexOf('leve') != -1) {
        secundaria_leve = true;
      }
      estilo_personagem.arma_secundaria.bonus_por_categoria[categoria] =
        _ConverteBonusPorCategoria(
            categoria, arma_secundaria, estilo_personagem, false, secundaria_leve);
    }
  }

  for (var categoria in arma_primaria.arma_tabela.categorias) {
    estilo_personagem.arma_primaria.bonus_por_categoria[categoria] =
      _ConverteBonusPorCategoria(
          categoria, arma_primaria, estilo_personagem, true, secundaria_leve);
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
  } else if (estilo.nome == 'duas_armas') {
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

  return bonus_por_categoria;
}

// Converte os talentos do personagem.
function _ConverteTalentos() {
  personagem.talentos.nivel = 1 + Math.floor(personagem.pontos_vida.dados_vida / 3);
  personagem.talentos.total = personagem.talentos.nivel + 
                              personagem.talentos.raca + 
                              personagem.talentos.classe;
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
        alert('Arma "' + talento.complemento + '" inválida para talento "' + 
              tabelas_talentos[talento.nome].nome + '"');
        continue;
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
  arma_personagem.dano_basico = arma_tabela.dano[personagem.tamanho.categoria];
  arma_personagem.proficiente = PersonagemProficienteComArma(arma_entrada.nome);
  return arma_personagem;
}


