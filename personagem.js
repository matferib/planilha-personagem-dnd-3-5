// Apenas os dados do personagem e funcoes de conversao de entrada para personagem.
var gPersonagem = {
  modo_visao: 'completo',
  modo_mestre: false,
  nome: '',
  raca: 'humano',
  template: '',
  tamanho: {
    categoria: 'medio', modificador_ataque_defesa: 0, modificador_agarrar: 0
  },
  alinhamento: '',
  experiencia: 0,
  divindade: '',
  // Cada entrada: { classe, nivel, nivel_conjurador, linha_tabela_feiticos }.
  // linha_tabela_feiticos indica qual linha ler da tabela de feiticos, que pode ser diferente do nivel da classe e do nivel de conjurador (paladino, por exemplo).
  classes: [
      { classe: 'guerreiro', nivel: 1, nivel_conjurador: 0, linha_tabela_feiticos: 0 },
  ],
  // Chave dos dominios.
  dominios: [],
  familiar: { chave: '', em_uso: false, pontos_vida: { base: 0, bonus: new Bonus(), temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 } },
  companheiro_animal: { chave: '', em_uso: false, pontos_vida: { base: 0, bonus: new Bonus(), temporarios: 0, ferimentos: 0, ferimentos_nao_letais: 0 } },
  niveis_negativos: 0,
  // TODO remover dados de vida do pontos de vida e usar este.
  dados_vida: {
    nivel_personagem: 0,  // nivel efetivo do personagem.
    //dados: [],  // cada dado de vida rolado.
  },
  pontos_vida: {
    total_dados: 0,  // total dos dados de pontos de vida.
    bonus: new Bonus(), // outros bonus.
    temporarios: 0,  // pontos de vida temporarios
    ferimentos: 0,  // ferimentos do personagem. Valores devem ser >= 0.
    ferimentos_nao_letais: 0,  // ferimentos nao letais.
  },
  // O valor do atributo é o valor final dados todos os modificadores. O modificador
  // é computado sobre esse valor.
  atributos: {
    pontos: {
      disponiveis: 0,
      gastos: [],  // cada entrada, um atributo
    },
    forca: {
      bonus: new Bonus(),
      modificador: 0
    },
    destreza: {
      bonus: new Bonus(),
      modificador: 0
    },
    constituicao: {
      bonus: new Bonus(),
      modificador: 0
    },
    inteligencia: {
      bonus: new Bonus(),
      modificador: 0
    },
    sabedoria: {
      bonus: new Bonus(),
      modificador: 0
    },
    carisma: {
      bonus: new Bonus(),
      modificador: 0
    }
  },
  iniciativa: new Bonus(),
  bba: 1,
  bba_cac: 1,  // inclui tamanho e forca.
  bba_cac_acuidade: 1,  // inclui tamanho e destreza.
  bba_distancia: 1,  // inclui tamanho e destreza.
  agarrar: 1,
  outros_bonus_ataque: new Bonus(),
  numero_ataques: 1,
  // talentos
  talentos: {
    // Algumas classes ganham talentos especificos.
    // Gerais sao talentos normais, sem serem de classes especificas.
    // TODO outras classes.
    // Cada talento: { chave, complemento, imutavel }
    // Outros se referem a talentos que vem de excecoes de regras, muito dificeis
    // de implementar e a pessoa poe manualmente.
    // Se imutavel, o select nao permitira mudanca (usado para talentos derivados, como
    // prontidao de familiar).
    gerais: [],
    guerreiro: [],
    mago: [],
    monge: [],
    ranger: [],
    outros: [],
  },
  // pericias.
  pericias: {
    // Quantos pontos o personagem pode gastar.
    total_pontos: 8,
    // Quantos ele ja gastou.
    pontos_gastos: 0,
    // Algumas pericias tem complementos. Tipo conhecimento.
    complemento: '',
    // Cada entrada:
    // chave_pericia: { pontos, graduacoes, bonus, de_classe, total }.
    // pontos sao os pontos gastos, graduacoes sao os pontos modificados
    // de acordo com a pericia ser de classe ou nao.
    lista: {},
  },
  // Cada entrada: { nome,
  //                 arma_primaria: {  nome,
  //                                   bonus_por_categoria: { categoria: { ataque: [], dano: valor }, ... } },
  //                 arma_secundaria: { idem }, }.
  // A categoria pode ser cac, cac_leve, cac_duas_maos, distancia, arremesso...
  estilos_luta: [],
  ca: {
      normal: 10, surpreso: 10, toque: 10,
      bonus: new Bonus(),
  },
  // As habilidades especiais do personagem de acordo com a classe e raca. Cada entrada:
  // chave_habilidade: { vezes, usado, complemento }
  especiais: {},
  // Imunidades do personagem, como frio, fogo etc. Cada entrada: chave.
  imunidades: [],
  // Podem haver diferentes resistencias. Cada entrada: {chave, valor}.
  resistencia_magia: [],
  salvacoes: {
    fortitude: new Bonus(),
    reflexo: new Bonus(),
    vontade: new Bonus(),
    // Outras salvacoes.
  },
  // Lista de armas que o personagem eh proficiente.
  // Cada entrada: { nome: true }, onde nome eh o nome da chave. So a presenca do campo eh
  // suficiente para indicar proficiencia, sem necessidade de um booleano.
  proficiencia_armas: {},
  // Cada entrada: { chave_arma: 1|2 }.
  foco_armas: {},
  // Cada entrada: { chave_arma: 2|4 }.
  especializacao_armas: {},
  // Cada entrada:
  //     { entrada: { chave, bonus, obra_prima }, nome_gerado, texto_nome, bonus_ataque, bonus_dano, critico,
  //       proficiente, proficiente_duas_maos, foco, especializado, acuidade, arma_tabela };
  // O nome_gerado junta o nome com OP ou o bonus. Por exemplo, espada longa +1.
  // Sempre havera um ataque desarmado aqui.
  // O texto do nome eh o nome gerado internacionalizado. O nome_gerado eh usado
  // para ligar entradas com a arma, o texto_nome so eh usado para display.
  // Caso o personagem seja proficiente, ele tambem o sera com duas maos. Mas eh possivel ser proficiente apenas com duas
  // maos, caso da espada bastarda sem pericia em arma exotica.
  armas: [],
  // Armadura: aponta para a armadura que estiver sendo usada.
  armadura: null,
  // Cada entrada:
  //      entrada: { chave, obra_prima, bonus, em_uso }, nome_gerado, texto_nome.
  armaduras: [],
  // Aponta para um dos escudos.
  escudo: null,
  // Cada entrada:
  //      entrada: { chave, obra_prima, bonus }, nome_gerado, texto_nome.
  escudos: [],
  elmo: '',
  // TODO: passar pra dentro de itens?
  // Cada entrada { chave, em_uso }
  aneis: [],
  amuletos: [],
  botas: [],
  bracaduras: [],
  capas: [],
  pocoes: [],

  // Valor pode ser qualquer coisa.
  outros_equipamentos: '',
  // Feiticos. As chaves sao criadas no carregamento. Cada entrada:
  // TODO transformar a CD em Bonus para poder ter mouse over.
  // chave_classe: {
  //   atributo_chave,
  //   em_uso,  // se o personagem utiliza feiticos da classe.
  //   conhecidos: { 0: [], ..., 9: [] },
  //   nivel_maximo,  // nivel de feitico mais alto para a classe.
  //   escolas_proibidas: ['nome_escola', ...],
  //   especializacao: 'nome_escola',
  //   slots: {
  //       0: { base, bonus_atributo, cd,
  //            feiticos: [ { nivel_conhecido, indice_conhecido, gasto } ], // o indice eh referente aos conhecidos.
  //            feitico_dominio: { nivel_conhecido, indice_conhecido, gasto },
  //            feitico_especializado: {nome, gasto} },
  //       1: ...} }
  feiticos: {},
  moedas: { platina: 0, ouro: 0, prata: 0, cobre: 0 },

  notas: '',
};

// Limpa o uso de todos os feiticos.
function PersonagemRenovaFeiticos() {
  for (var chave_classe in gPersonagem.feiticos) {
    if (!gPersonagem.feiticos[chave_classe].em_uso) {
      continue;
    }
    var slots_classe = gPersonagem.feiticos[chave_classe].slots;
    for (var nivel in slots_classe) {
      for (var indice = 0; indice < slots_classe[nivel].feiticos.length; ++indice) {
        slots_classe[nivel].feiticos[indice].gasto = false;
      }
      if ('feitico_dominio' in slots_classe[nivel] && slots_classe[nivel].feitico_dominio != null) {
        slots_classe[nivel].feitico_dominio.gasto = false;
      }
      if ('feitico_especializado' in slots_classe[nivel] && slots_classe[nivel].feitico_especializado != null) {
        slots_classe[nivel].feitico_especializado.gasto = false;
      }
    }
  }
}

// Retorna true se o personagem tiver a pericia. Se ranks nao for null, verifica o minimo tambem. Por ultimo, verifica complemento.
function PersonagemTemPericia(chave, ranks, complemento) {
  if (ranks == null) {
    ranks = 1;
  }
  if (!(chave in gPersonagem.pericias.lista)) {
    return false;
  }
  if (gPersonagem.pericias.lista[chave].graduacoes < ranks) {
    return false;
  }
  return true;
}

// Limpa dependencias antes de comecar a conversao das entradas para o personagem. Tambem chamada na geracao de personagens.
function PersonagemLimpaGeral() {
  gPersonagem.classes.length = 0;
  gPersonagem.pontos_vida.bonus.Limpa();
  gPersonagem.pontos_vida.temporarios = 0;
  gPersonagem.pontos_vida.ferimentos_nao_letais = 0;
  gPersonagem.armas.length = 1;  // para manter desarmado.
  gPersonagem.armaduras.length = 0;
  gPersonagem.ca.bonus.Limpa();
  gPersonagem.iniciativa.Limpa();
  gPersonagem.outros_bonus_ataque.Limpa();
  gPersonagem.atributos.pontos.gastos.disponiveis = 0;
  gPersonagem.atributos.pontos.gastos.length = 0;
  for (var atributo in tabelas_atributos) {
    gPersonagem.atributos[atributo].bonus.Limpa();
  }
  for (var i = 0; i < gPersonagem.pericias.lista.length; ++i) {
    gPersonagem.pericias.lista[i].bonus.Limpa();
  }
  for (var chave_classe in gPersonagem.feiticos) {
    gPersonagem.feiticos[chave_classe].em_uso = false;
    gPersonagem.feiticos[chave_classe].nivel_maximo = 0;
    for (var i = 0; i <= 9; ++i) {
      gPersonagem.feiticos[chave_classe].conhecidos[i].length = 0;
      gPersonagem.feiticos[chave_classe].slots[i].feiticos.length = 0;
      gPersonagem.feiticos[chave_classe].slots[i].feitico_dominio = null;
    }
  }
  gPersonagem.estilos_luta.length = 0;
  for (var tipo_salvacao in gPersonagem.salvacoes) {
    if (tipo_salvacao in { fortitude: '', reflexo: '', vontade: '' }) {
      gPersonagem.salvacoes[tipo_salvacao].Limpa();
    } else {
      delete gPersonagem.salvacoes[tipo_salvacao];
    }
  }
  for (var tipo_item in tabelas_itens) {
    gPersonagem[tipo_item].length = 0;
  }
  gPersonagem.especiais = {};
  gPersonagem.imunidades.length = 0;
  gPersonagem.resistencia_magia.length = 0;
  PersonagemLimpaPericias();
  PersonagemLimpaTalentos();
}

function PersonagemLimpaPericias() {
  for (var chave_pericia in gPersonagem.pericias.lista) {
    var pericia_personagem = gPersonagem.pericias.lista[chave_pericia];
    pericia_personagem.bonus.Limpa();
  }
}

function PersonagemLimpaTalentos() {
  for (var chave_talento in gPersonagem.talentos) {
    gPersonagem.talentos[chave_talento].length = 0;
  }
}

// Qualquer inicializacao do personagem eh feita aqui.
function IniciaPersonagem() {
  // entradas padroes para armas, armaduras e escudos.
  gPersonagem.armas.push(ConverteArma({
    chave: 'desarmado',
    nome_gerado: 'desarmado',
    texto_nome: Traduz('desarmado'),
    obra_prima: false,
    bonus: 0
  }));
}

// Encontra uma arma do personagem pelo nome gerado.
// @return a arma do personagem.
function ArmaPersonagem(nome_gerado) {
  for (var i = 0; i < gPersonagem.armas.length; ++i) {
    var arma = gPersonagem.armas[i];
    if (arma.nome_gerado == nome_gerado) {
      return arma;
    }
  }
  return null;
}

// @return true se alguma das classes do personagem fornece a proficiencia com armas por tipo.
// @param tipo_arma 'simples' ou 'comuns'.
function PersonagemProficienteTipoArma(tipo_arma) {
  var entrada_talento = 'usar_armas_' + tipo_arma;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var chave_classe = gPersonagem.classes[i].classe;
    var tabela_classe = tabelas_classes[chave_classe];
    var talentos_classe = tabela_classe.talentos || [];
    for (var j = 0; j < talentos_classe.length; ++j) {
      if (talentos_classe[j] == entrada_talento) {
        return true;
      }
    }
  }
  // Armas comuns eh por arma, mas armas simples abrange a categoria.
  if (tipo_arma == 'simples' && PersonagemPossuiTalento('usar_armas_simples')) {
    return true;
  }
  return false;
}

// Algumas armas sao identicas para proposito de especializacao, foco etc.
function _NormalizaNomeArma(chave_arma) {
  if (chave_arma.indexOf('arco_longo') == 0) {
    return 'arco_longo';
  } else if (chave_arma.indexOf('arco_curto') == 0) {
    return 'arco_curto';
  }
  return chave_arma;
}

// @return true se o personagem for proficiente com uma arma.
function PersonagemProficienteComArma(nome_arma) {
  // Verifica lista de armas.
  return gPersonagem.proficiencia_armas[_NormalizaNomeArma(nome_arma)] != null;
}

// @return o valor do foco do personagem com a arma (0, 1, 2).
// @param nome_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemFocoComArma(chave_arma) {
  return gPersonagem.foco_armas[_NormalizaNomeArma(chave_arma)];
}

// @return o valor da especialização do personagem com a arma (0, 2, 4).
// @param chave_arma chave da arma.
// @param maior indica se o foco eh maior.
function PersonagemEspecializacaoComArma(chave_arma) {
  return gPersonagem.especializacao_armas[_NormalizaNomeArma(chave_arma)];
}

// @return true se o personagem possuir a habilidade passada.
// @param chave da tabela de habilidades especiais (tabelas_especiais).
function PersonagemPossuiHabilidadeEspecial(chave) {
  for (var especial in gPersonagem.especiais) {
    if (especial == chave) {
      return true;
    }
  }
  return false;
}

// @param nome_talento nome do talento na tabela ou chave na tabela.
// @param complemento alguns talentos precisam de um complemento. Por exemplo,
//        conhecimento (complemento), usar_arma_comum (complemento).
// @return true se o personagem tiver o talento passado.
function PersonagemPossuiTalento(nome_talento, complemento) {
  for (var chave_classe in gPersonagem.talentos) {
    for (var i = 0; i < gPersonagem.talentos[chave_classe].length; ++i) {
      if (_TalentoIgual(gPersonagem.talentos[chave_classe][i],
                        nome_talento, complemento)) {
        return true;
      }
    }
  }
  return false;
}

// Retorna true se o personagem possuir o item magico passado.
function PersonagemPossuiItem(tipo_item, chave_item) {
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    if (gPersonagem[tipo_item][i].chave == chave_item) {
      return true;
    }
  }
  return false;
}

function PersonagemUsandoItem(tipo_item, chave_item) {
  for (var i = 0; i < gPersonagem[tipo_item].length; ++i) {
    var item = gPersonagem[tipo_item][i];
    if (item.chave == chave_item && item.em_uso) {
      return true;
    }
  }
  return false;
}

function _TalentoIgual(talento_personagem, nome_talento, complemento) {
  var chave_talento = talento_personagem.chave;
  if (tabelas_talentos[chave_talento] == null) {
    return false;
  }
  if (nome_talento == chave_talento ||
      nome_talento == tabelas_talentos[chave_talento].nome) {
    // Talento nao tem complemento, nome igual.
    if (tabelas_talentos[chave_talento].complemento == null) {
      return true;
    }
    // Talento tem complemento, mas personagem nao.
    if ((talento_personagem.complemento == null || talento_personagem.complemento == '') ||
        (complemento == null || complemento == '')) {
      return false;
    }
    // Complemento igual.
    if (talento_personagem.complemento == complemento) {
      return true;
    }
    // Complemento de arma eh mais complexo.
    if (tabelas_talentos[chave_talento].complemento == 'arma') {
      var chave_complemento = _NormalizaNomeArma(tabelas_armas_invertida[complemento]);
      var chave_complemento_personagem = _NormalizaNomeArma(tabelas_armas_invertida[talento_personagem.complemento]);
      return chave_complemento == chave_complemento_personagem;
    }
  }
  return false;
}

// @return true se o personagem possuir uma das classes passadas.
// @param classes array de classe.
function PersonagemPossuiUmaDasClasses(classes) {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    for (var j = 0; j < classes.length; ++j) {
      if (classes[j] == gPersonagem.classes[i].classe) {
        return true;
      }
    }
  }
  return false;
}

// @return o nivel total do personagem.
function PersonagemNivel() {
  return gPersonagem.dados_vida.nivel_personagem;
}

// @return o nivel do personagem na classe passada, zero se nao possuir.
function PersonagemNivelClasse(classe) {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].nivel;
    }
  }
  return 0;
}

// @return true se o personagem tem algum nivel de mago (ou mago_*).
function PersonagemTemNivelMago() {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (gPersonagem.classes[i].classe.indexOf('mago') == 0) {
      return true;
    }
  }
  return false;
}

// @param classe se null, retorna o maior de todas as classes.
// @return o nivel de conjurador de uma classe de personagem.
function PersonagemNivelConjuradorClasse(classe) {
  var nivel_conjurador = 0;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (classe == null) {
      if (gPersonagem.classes[i].nivel_conjurador > nivel_conjurador) {
        nivel_conjurador = gPersonagem.classes[i].nivel_conjurador;
      }
    } else if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].nivel_conjurador;
    }
  }
  return nivel_conjurador;
}

// @param classe
// @return indice da linha de feitico a ser usado para a classe.
function PersonagemLinhaTabelaFeiticos(classe) {
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    if (gPersonagem.classes[i].classe == classe) {
      return gPersonagem.classes[i].linha_tabela_feiticos;
    }
  }
  // nao deveria chegar aqui.
  return 0;
}

// Verifica se o personagem atende aos requisitos do talento. Caso não atenda,
// alertará uma mensagem.
// @return descricao do erro caso a verificação falhe, null caso contrário.
function PersonagemVerificaPrerequisitosTalento(chave_talento, complemento) {
  var requisitos = tabelas_talentos[chave_talento].requisitos;
  var prefixo_erro = Traduz(tabelas_talentos[chave_talento].nome) + ' ' + Traduz('requer') + ' ';
  if (requisitos == null) {
    return null;
  }
  if (requisitos.bba) {
    if (gPersonagem.bba < requisitos.bba) {
      return (prefixo_erro + Traduz('BBA') + ' >= ' + requisitos.bba);
    }
  }
  for (var atributo in requisitos.atributos) {
    if (gPersonagem.atributos[atributo].bonus.Total() < requisitos.atributos[atributo]) {
      return (prefixo_erro + Traduz(tabelas_atributos[atributo]) + ' >= ' + requisitos.atributos[atributo]);
    }
  }
  for (var classe in requisitos.nivel) {
    if (classe == 'total') {
      if (gPersonagem.dados_vida.nivel_personagem < requisitos.nivel['total']) {
        return  (prefixo_erro + Traduz('nivel de personagem') + ' >= ' + requisitos.nivel['total']);
      }
    } else if (classe == 'conjurador') {
      if (PersonagemNivelConjuradorClasse(null) < requisitos.nivel['conjurador']) {
        return (prefixo_erro + Traduz('nivel de conjurador') + ' >= ' + requisitos.nivel[classe]);
      }
    } else {
      if (PersonagemNivelClasse(classe) < requisitos.nivel[classe]) {
        return (prefixo_erro + Traduz('nivel em ') + Traduz(tabelas_classes[classe].nome) + ' >= ' + requisitos.nivel[classe]);
      }
    }
  }
  for (var i = 0; requisitos.talentos && i < requisitos.talentos.length; ++i) {
    // Neste caso, o complemento ainda nao foi preenchido.
    if ('complemento' in tabelas_talentos[requisitos.talentos[i]] && complemento == null) continue;
    if (!PersonagemPossuiTalento(requisitos.talentos[i], complemento)) {
      return (prefixo_erro + Traduz('talento') + ' ' + Traduz(tabelas_talentos[requisitos.talentos[i]].nome) + ' ' +
             (complemento ? complemento : ''));
    }
  }
  if (requisitos.proficiencia_arma && complemento && complemento.length > 0) {
    var chave_arma = tabelas_armas_invertida[complemento];
    if (!PersonagemProficienteComArma(chave_arma)) {
      return (prefixo_erro + Traduz('proficiencia com ') + complemento);
    }
  }
  for (var pericia in requisitos.pericias) {
    if (!PersonagemTemPericia(pericia, requisitos.pericias[pericia])) {
      return (prefixo_erro + Traduz('pericia em ') + Traduz(tabelas_pericias[pericia].nome) + ', ' + requisitos.pericias[pericia] + ' ranks');
    }
  }
  return null;
}

// @TODO fazer a conversao de um tipo para outro.
// Adiciona moedas ao personagem. Valores podem ser negativos.
// O personagem nunca pode ficar com moedas negativas, neste caso
// a funcao nao fara nada.
// @param moedas um objeto contendo { ouro, platina, prata, cobre}
// @return true se foi possivel adicionar as moedas.
function PersonagemAdicionarMoedas(moedas) {
  // verifica fundos.
  for (var tipo_moeda in moedas) {
    if (gPersonagem.moedas[tipo_moeda] + moedas[tipo_moeda] < 0) {
      return false;
    }
  }

  for (var tipo_moeda in moedas) {
    gPersonagem.moedas[tipo_moeda] += moedas[tipo_moeda];
  }
  return true;
}

// @return a string de dados de vida do personagem.
function PersonagemStringDadosVida() {
  var primeiro = true;  // primeira classe nao eh sinalizada.
  var string_dados_vida = '';
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
      if (primeiro) {
        primeiro = false;
      } else {
        string_dados_vida += ' +';
      }
      string_dados_vida +=
        gPersonagem.classes[i].nivel + 'd' + tabelas_classes[gPersonagem.classes[i].classe].dados_vida;
  }
  if (gPersonagem.atributos.constituicao.modificador > 0) {
    string_dados_vida +=
      ' +' + (gPersonagem.atributos.constituicao.modificador * gPersonagem.dados_vida.nivel_personagem);
  }
  return string_dados_vida;
}

// @return o template do personagem ou null.
function PersonagemTemplate() {
  if (gPersonagem.template.length == 0) {
    return null;
  }
  if (!(gPersonagem.template in tabelas_template)) {
    return null;
  }
  return tabelas_template[gPersonagem.template];
}

// @tipo da classe: 'arcano' ou 'divino'.
// @return a classe com o maior nivel de conjurador para o tipo passado ou null se nao houver.
function PersonagemMaiorClasseConjurador(tipo) {
  var classes_por_tipo = {
    'arcano': { mago: true, feiticeiro: true, mago_necromante: true },
    'divino': { clerigo: true, druida: true },
  };
  var maior = null;
  for (var i = 0; i < gPersonagem.classes.length; ++i) {
    var classe_personagem = gPersonagem.classes[i];
    if (tipo != null && !(classe_personagem.classe in classes_por_tipo[tipo])) {
      continue;
    }
    // achou tipo certo.
    if (maior == null || classe_personagem.nivel_conjurador > maior.nivel_conjurador) {
      maior = classe_personagem;
    }
  }
  return maior;
}

function PersonagemTamanhoRaca() {
  return tabelas_raca[gPersonagem.raca].tamanho;
}

function PersonagemTamanhoEfetivo() {
  return gPersonagem.tamanho.categoria;
}
