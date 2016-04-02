// Arquivos de testes da planilha.

// Funcoes auxiliares.

// @param moedas{1,2} objeto contendo { platina, ouro, prata, cobre}
// @return true se as moedas forem iguais.
function _ComparaMoedas(moedas1, moedas2) {
  for (var tipo_moeda in moedas1) {
    if (moedas1[tipo_moeda] == 0 && !(tipo_moeda in moedas2)) {
      continue;
    }
    if (moedas1[tipo_moeda] != moedas2[tipo_moeda]) {
      return false;
    }
  }
  // Comparação inversa, pois moedas2 pode ter algum campo não presente em moedas1.
  for (var tipo_moeda in moedas2) {
    if (moedas2[tipo_moeda] == 0 && !(tipo_moeda in moedas1)) {
      continue;
    }
    if (moedas2[tipo_moeda] != moedas1[tipo_moeda]) {
      return false;
    }
  }
  return true;
}

// @param salvacoes { chave: valor, ... }
// @return '' se o valor total das salvacoes do personagem for igual aos valores passados
// ou string_falha caso contrario.
function ComparaSalvacoes(salvacoes) {
  for (var tipo_salvacao in salvacoes) {
    if (gPersonagem.salvacoes[tipo_salvacao].Total() != salvacoes[tipo_salvacao]) {
      return 'Tipo: ' + tipo_salvacao + ', esperava ' + salvacoes[tipo_salvacao] + ' veio ' + gPersonagem.salvacoes[tipo_salvacao].Total();
    }
  }
  return '';
}

// Testes.

// Cria um novo template de testes a ser adicionado no dom.
// @param nome_teste o nome do teste.
// @param handler_teste deve possuir nome, a funcao 'Testa' para realizar o teste,
// e apos o teste deve obrigatoriamente possuir o campo 'resultado'. Opcionalmente
// deve possuir o campo 'detalhes' para detalhar o teste.
// @param dom onde o teste sera adicionado.
function TemplateTeste(handler_teste, dom) {
  // div do teste. Cria de cara para os testes poderem acessar.
  var div_teste = CriaDiv(handler_teste.nome, 'div_teste');
  dom.appendChild(div_teste);

  handler_teste.Testa();

  // Nome do teste.
  var span_nome = CriaSpan('Teste: ' + handler_teste.nome);

  // Resultado do teste.
  var div_resultado = CriaDiv();
  var span_resultado_texto = CriaSpan('Resultado: ');
  var span_resultado = CriaSpan(
      handler_teste.resultado ? 'OK' : 'FALHOU', null, handler_teste.resultado ? 'verde' : 'vermelho');
  div_resultado.appendChild(span_resultado_texto);
  div_resultado.appendChild(span_resultado);

  div_teste.appendChild(span_nome);
  div_teste.appendChild(CriaBr());
  div_teste.appendChild(div_resultado);

  if (handler_teste.detalhes != null) {
    var div_detalhes = CriaDiv();
    var span_detalhes = CriaSpan('Detalhes: ');
    var span_detalhes = CriaSpan(handler_teste.detalhes);
    div_detalhes.appendChild(span_detalhes);
    div_teste.appendChild(div_detalhes);
  }
}

function CarregaTestes() {
  CarregamentoInicial();
  var body = document.getElementsByTagName('body')[0];

  TemplateTeste({
    nome: 'TestaNormalizacao',
    Testa: function() {
      var s = StringNormalizada("Ćãóś");
      if (s != "caos") {
        this.resultado = false;
        this.detalhes = 'Esperava caos, recebi: ' + s;
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  gPersonagem.armas = [
      { entrada: { chave: 'desarmado', bonus: 0, obra_prima: false}, nome_gerado: 'Desarmado' },
      { entrada: { chave: 'espada_longa', bonus: 1, obra_prima: false }, nome_gerado: 'TesteArma' },
      { entrada: { chave: 'arco_curto', bonus: 0, obra_prima: false }, nome_gerado: 'Arco Curto' },
      { entrada: { chave: 'arco_longo', bonus: 0, obra_prima: false }, nome_gerado: 'Arco Longo' },
      { entrada: { chave: 'arco_curto_composto_1', bonus: 0, obra_prima: false }, nome_gerado: 'Arco Curto Composto (1)' },
      { entrada: { chave: 'arco_longo_composto_2', bonus: 0, obra_prima: false }, nome_gerado: 'Arco Longo Composto (2)' },
      { entrada: { chave: 'besta_leve', bonus: 0, obra_prima: false }, nome_gerado: 'Besta Leve' },
      { entrada: { chave: 'besta_pesada', bonus: 0, obra_prima: false }, nome_gerado: 'Besta Pesada' },
  ],
  TemplateTeste({
    nome: 'ArmaPersonagem',
    Testa: function() {
      var arma_personagem = ArmaPersonagem('TesteArma');
      this.resultado = false;
      if (arma_personagem == null) {
        this.detalhes = 'Arma personagem não encontrada';
      } else if (arma_personagem.entrada.chave != 'espada_longa') {
        this.detalhes = 'Chave espada diferente do esperado';
      } else if (arma_personagem.entrada.bonus != 1) {
        this.detalhes = 'Bonus arma diferente do esperado';
      } else if (arma_personagem.entrada.obra_prima) {
        this.detalhes = 'Obra prima diferente do esperado';
      } else {
        this.resultado = true;
      }
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'TestaEfeitoItems',
    Testa: function() {
      gPersonagem.aneis.push({chave: 'protecao_2', em_uso: true});
      _DependenciasEquipamentos();
      _DependenciasClasseArmadura();
      if (gPersonagem.ca.bonus.Total() != 2) {
        this.resultado = false;
        this.detalhes = 'Esperava 2 de bonus no AC por causa de anel de proteção +2';
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'TestaMonge',
    Testa: function() {
      gPersonagem.classes[0].classe = 'monge';
      gPersonagem.classes[0].nivel= 5;
      gPersonagem.atributos.forca.bonus.Adiciona('base', null, 10);
      gPersonagem.atributos.sabedoria.bonus.Adiciona('base', null, 13);
      gPersonagem.atributos.destreza.bonus.Adiciona('base', null, 15);
      _DependenciasAtributos();
      _DependenciasTalentos();
      _DependenciasBba();
      _DependenciasProficienciaArmas();
      _DependenciasArmas();
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'uma_arma', arma_primaria: 'Desarmado' }));
      _DependenciasClasseArmadura();
      _DependenciasEstilos();
      if (gPersonagem.ca.bonus.Total() != 4) {
        this.resultado = false;
        this.detalhes = 'Esperava 4 de bonus no AC (monge 5o, des 15, sab 13), recebi: ' + gPersonagem.ca.bonus.Total();
        return;
      }
      if (tabelas_monge_desarmado[PersonagemNivelClasse('monge')].dano[PersonagemTamanhoEfetivo()] != '1d8') {
        this.resultado = false;
        this.detalhes = 'Esperava dano de 1d8 para monge de 5o nivel';
        return;
      }
      var resumo = GeraResumoArmaEstilo(gPersonagem.armas[0], true, gPersonagem.estilos_luta[0]);
      if (resumo != 'cac_leve: +3, 1d8') {
        this.resultado = false;
        this.detalhes = 'Esperava resumo de arma de monge "cac_leve: 3, 1d8" recebi ' + resumo;
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'LePeso',
    Testa: function() {
      var peso = LePeso(' 500 g');
      if (peso != 0.5) {
        this.resultado = false;
        this.detalhes = 'Esperava 0.5 como resultado de 500g';
        return;
      }
      peso = LePeso('    0,5   KG');
      if (peso != 0.5) {
        this.resultado = false;
        this.detalhes = 'Esperava 0.5 como resultado de 0,5 KG';
        return;
      }

      peso = LePeso('    25,3   KG');
      if (peso != 25.3) {
        this.resultado = false;
        this.detalhes = 'Esperava 25,3 como resultado de 25,3 KG';
        return;
      }

      peso = LePeso('    25,3   ');
      if (peso != null) {
        this.resultado = false;
        this.detalhes = 'Esperava null para peso sem unidade.';
        return;
      }

      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'AjustaString',
    Testa: function() {
      var str = AjustaString(' \taaa bbb    ');
      if (str != 'aaa bbb') {
        this.resultado = false;
        this.detalhes = 'Esperava "aaa bbb" como resultado';
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'UtilSomaPrecos',
    Testa: function() {
      this.resultado = false;
      var preco1 = { platina: 2, ouro: 4 };
      var preco2 = { ouro: 5, prata: 0, cobre: 3 };
      var preco_esperado = { platina: 2, ouro: 9, prata: 0, cobre: 3 };
      var soma_esperada = _ComparaMoedas(SomaPrecos(preco1, preco2), preco_esperado);
      if (!soma_esperada) {
        this.detalhes = 'Esperava { platina: 2, ouro: 9, prata: 0, cobre: 3 }';
        this.resultado = false;
        return;
      }
      this.resultado = true;
    },
  }, body);


  PersonagemLimpaGeral();
  gPersonagem.moedas = { platina: 1, ouro: 2, prata: 3, cobre: 4 };
  TemplateTeste({
    nome: 'PersonagemAdicionarMoedas',
    Testa: function() {
      this.resultado = false;
      var resultado_moedas = { platina: 1, ouro: 2, prata: 3, cobre: 4 };
      // Aqui a funcao PersonagemAdicionarMoedas tem que retornar true.
      if (!PersonagemAdicionarMoedas({ platina: 0, ouro: 0, prata: 0, cobre: 0 }) ||
          !_ComparaMoedas(resultado_moedas, gPersonagem.moedas)) {
        this.detalhes = 'Valores nao deveriam ter mudado';
        this.resultado = false;
        return;
      }
      // Aqui a funcao PersonagemAdicionarMoedas tem que retornar false.
      if (PersonagemAdicionarMoedas({ platina: -1, ouro: -3, prata: 0, cobre: 0 }) ||
          !_ComparaMoedas(resultado_moedas, gPersonagem.moedas)) {
        this.detalhes = 'Valores nao deveriam ter mudado, ouro ficaria negativo';
        this.resultado = false;
        return;
      }
      resultado_moedas = { platina: 0, ouro: 5, prata: 6, cobre: 7 };
      // Aqui a funcao PersonagemAdicionarMoedas tem que retornar true.
      if (!PersonagemAdicionarMoedas({ platina: -1, ouro: 3, prata: 3, cobre: 3 }) ||
          !_ComparaMoedas(resultado_moedas, gPersonagem.moedas)) {
        this.detalhes = 'Adição errada';
        this.resultado = false;
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'UtilLePreco',
    Testa: function() {
      this.resultado = false;
      var preco_esperado = { platina: 0, ouro: 10, prata: 0, cobre: 0 };
      if (!_ComparaMoedas(preco_esperado, LePreco("10PO"))) {
        this.detalhes = 'Falha lendo preco 10PO';
        this.resultado = false;
        return;
      }
      preco_esperado = { platina: 0, ouro: 0, prata: 10, cobre: 0 };
      if (!_ComparaMoedas(preco_esperado, LePreco("10 PP"))) {
        this.detalhes = 'Falha lendo preco 10 PP';
        this.resultado = false;
        return;
      }
      preco_esperado = { platina: 5, ouro: 0, prata: 0, cobre: 0 };
      if (!_ComparaMoedas(preco_esperado, LePreco(" 5 Pl"))) {
        this.detalhes = 'Falha lendo preco 10 PP';
        this.resultado = false;
        return;
      }
      preco_esperado = { platina: 0, ouro: 0, prata: 0, cobre: 1 };
      if (!_ComparaMoedas(preco_esperado, LePreco(" 1 pC "))) {
        this.detalhes = 'Falha lendo preco 1 pC';
        this.resultado = false;
        return;
      }

      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'LeItem',
    Testa: function() {
      var item_esperado = {
        chave: 'queda_suave',
        em_uso: true
      };
      var dom = {
        childNodes: [
          { name: 'item',
            selectedIndex: 1,
            length: 2,
            options: [ {}, { value: 'queda_suave' } ] },
          { name: 'em_uso', checked: true },
        ],
      };
      var item_lido = LeItem(dom);
      this.resultado = item_lido.chave == item_esperado.chave &&
                       item_lido.em_uso == item_esperado.em_uso;
      if (!this.resultado) {
        this.detalhes = 'Item lido diferente do esperado.';
      }
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'PrecoArmaArmaduraEscudo',
    Testa: function() {
      var preco = PrecoArmaArmaduraEscudo(
          'escudo', tabelas_escudos, 'broquel', 'nenhum', false, 0, false);
      var esperado = { ouro: 15 };
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de broquel.';
        return;
      }

      // Obra prima + 150 para escudos.
      preco = PrecoArmaArmaduraEscudo(
          'escudo', tabelas_escudos, 'broquel', 'nenhum', true, 0, false);
      esperado.ouro = 165;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de broquel obra prima.';
        return;
      }

      // Adamante: + 2000 para escudos (incluindo preco da obra prima).
      preco = PrecoArmaArmaduraEscudo(
          'escudo', tabelas_escudos, 'broquel', 'adamante', true, 0, false);
      esperado.ouro = 2015;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de broquel de adamante.';
        return;
      }

      // Madeira Negra: 20 PO por kg + 300 de arma obra prima.
      preco = PrecoArmaArmaduraEscudo(
          'arma', tabelas_armas, 'bordao', 'madeira_negra', true, 0, false);
      esperado.ouro = 340;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de bordão de madeira negra.';
        return;
      }

      // Couro de dragao: custo da armadura + obra-prima.
      preco = PrecoArmaArmaduraEscudo(
          'armadura', tabelas_armaduras, 'camisao_cota_de_malha', 'couro_dragao', true, 0, false);
      esperado.ouro = 500;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de cota de malhas de couro de dragão.';
        return;
      }

      // Couro de dragao +1: custo da armadura + obra-prima + 1000.
      preco = PrecoArmaArmaduraEscudo(
          'armadura', tabelas_armaduras, 'camisao_cota_de_malha', 'couro_dragao', true, 1, false);
      esperado.ouro = 1500;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de cota de malhas de couro de dragão +1.';
        return;
      }

      // Magico + 1000 para escudos +1 + 150 obra prima.
      preco = PrecoArmaArmaduraEscudo(
          'escudo', tabelas_escudos, 'broquel', 'nenhum', true, 1, false);
      esperado.ouro = 1165;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de broquel +1.';
        return;
      }

      // Ferro frio: preco da arma normal x2.
      preco = PrecoArmaArmaduraEscudo(
          'arma', tabelas_armas, 'espada_longa', 'ferro_frio', false, 0, false);
      esperado.ouro = 30;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de espada longa de ferro frio.';
        return;
      }
      preco = PrecoArmaArmaduraEscudo(
          'arma', tabelas_armas, 'espada_longa', 'ferro_frio', true, 0, false);
      esperado.ouro = 330;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de espada longa de ferro frio.';
        return;
      }
      // Ferro frio: +2000 PO por bonus.
      preco = PrecoArmaArmaduraEscudo(
          'arma', tabelas_armas, 'espada_longa', 'ferro_frio', true, 1, false);
      esperado.ouro = 4330;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de espada longa de ferro frio.';
        return;
      }

      // Armadura de mitral.
      preco = PrecoArmaArmaduraEscudo(
          'armadura', tabelas_armaduras, 'peitoral_de_aco', 'mitral', true, 0, false);
      esperado.ouro = 4200;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de peitoral de aço de mitral.';
        return;
      }
      // Mitral pesada +2.
      preco = PrecoArmaArmaduraEscudo(
          'armadura', tabelas_armaduras, 'cota_de_talas', 'mitral', true, 2, false);
      esperado.ouro = 13200;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de cota de talas de mitral.';
        return;
      }

      // Adaga de prata.
      preco = PrecoArmaArmaduraEscudo(
          'arma', tabelas_armas, 'adaga', 'prata_alquimica', false, 0, false);
      esperado.ouro = 22;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de adaga de prata alquímica.';
        return;
      }
      // Espada longa de prata.
      preco = PrecoArmaArmaduraEscudo(
          'arma', tabelas_armas, 'espada_longa', 'prata_alquimica', false, 0, false);
      esperado.ouro = 105;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de espada longa de prata alquímica.';
        return;
      }
      // Espada larga de prata.
      preco = PrecoArmaArmaduraEscudo(
          'arma', tabelas_armas, 'espada_larga', 'prata_alquimica', false, 0, false);
      esperado.ouro = 230;
      this.resultado = _ComparaMoedas(preco, esperado);
      if (!this.resultado) {
        this.detalhes = 'Erro lendo preço de espada larga de prata alquímica.';
        return;
      }

    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Pericias',
    Testa: function() {
      gPersonagem.atributos.destreza.bonus.Adiciona('base', null, 12);
      _ConvertePericias();
      _DependenciasAtributos();
      _DependenciasItemOuFamiliar('manto_elfico', tabelas_itens['capas'].tabela['manto_elfico']);
      _DependenciasPericias();
      if (gPersonagem.pericias.lista.esconderse.bonus.Total() != 6) {
        this.resultado = false;
        this.detalhes = 'Esperava +5 de bonus de competencia em esconderse com manto elfico.';
        return;
      }
      this.resultado = true;
    }
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'RequisitosTalentos',
    Testa: function() {
      // teste simples.
      r = PersonagemVerificaPrerequisitosTalento('usar_armas_simples');
      if (r != null) {
        this.resultado = false;
        this.detalhes = 'Erro com verificação do talento "usar_armas_simples"' + r;
        return;
      }

      // Requisito de pericia.
      gPersonagem.classes[0].classe = 'guerreiro';
      gPersonagem.classes[0].nivel = 1;
      r =  PersonagemVerificaPrerequisitosTalento('combate_montado');
      if (r == null) {
        this.detalhes = 'Esperava erro no prerequisito de combate montado';
        this.resultado = false;
        return;
      }
      gPersonagem.pericias.lista['cavalgar'].pontos = 1;
      gPersonagem.pericias.lista['cavalgar'].graduacoes = 1;
      r =  PersonagemTemPericia('combate_montado', 2);
      if (r == true) {
        this.detalhes = 'Esperava que falhasse por ranks';
        this.resultado = false;
        return;
      }
      r =  PersonagemVerificaPrerequisitosTalento('combate_montado');
      if (r != null) {
        this.detalhes = 'Esperava que combate montado funcionasse com cavalgar';
        this.resultado = false;
        return;
      }

      // Requisito de nivel.
      r = PersonagemVerificaPrerequisitosTalento('lideranca');
      if (r == null) {
        this.resultado = false;
        this.detalhes = 'Talento "liderança" deveria requerer personagem de 6o nível';
        return;
      }
      gPersonagem.dados_vida.nivel_personagem = 6;
      r = PersonagemVerificaPrerequisitosTalento('lideranca');
      if (r != null) {
        this.resultado = false;
        this.detalhes = 'Talento "liderança" deveria funcionar para personagem de 6o nivel';
        return;
      }

      // Requisitos de nivel de conjurador.
      r = PersonagemVerificaPrerequisitosTalento('preparar_pocao');
      if (r == null) {
        this.resultado = false;
        this.detalhes = 'Talento "preparar poção" deveria requerer conjurador de 3o nível.';
        return;
      }
      // Paladino tem nivel = 1/2 nivel classe.
      gPersonagem.classes[0].classe = 'paladino';
      gPersonagem.classes[0].nivel= 6;
      _DependenciasNivelConjurador();
      r = PersonagemVerificaPrerequisitosTalento('preparar_pocao');
      if (r != null) {
        this.resultado = false;
        this.detalhes = 'Talento "preparar poção" deveria funcionar para paladino de 6o nível.';
        return;
      }

      // Requisito de atributo.
      r = PersonagemVerificaPrerequisitosTalento('magia_natural');
      if (r == null) {
        this.resultado = false;
        this.detalhes = 'Talento "magia_natural" deveria requerer sabedoria 13';
        return;
      }
      gPersonagem.atributos.sabedoria.bonus.Adiciona('base', null, 13);
      r = PersonagemVerificaPrerequisitosTalento('magia_natural');
      if (r != null) {
        this.resultado = false;
        this.detalhes = 'Talento "magia_natural" deveria funcionar para personagem com sabedoria 13';
        return;
      }

      // Requisito de outros talentos.
      r = PersonagemVerificaPrerequisitosTalento('magia_penetrante_maior');
      if (r == null) {
        this.resultado = false;
        this.detalhes = 'Talento "magia_penetrante_maior" deveria requerer magia_penetrante';
        return;
      }
      gPersonagem.talentos.gerais.push({ chave: 'magia_penetrante', });
      r = PersonagemVerificaPrerequisitosTalento('magia_penetrante_maior');
      if (r != null) {
        this.resultado = false;
        this.detalhes = 'Talento "magia_penetrante_maior" deveria funcionar com "magia_penetrante"';
        return;
      }
      this.resultado = true;
    },
  }, body);

  // AjustaFilhos.
  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'AjustaFilhos',
    Testa: function() {
      var dom_pai = CriaDiv();
      var c = 0;
      AjustaFilhos(dom_pai, 2, function(indice_filho) {
        dom_pai.appendChild(CriaDiv());
        c += indice_filho;
      });
      if (c != 1) {
        this.resultado = false;
        this.detalhes = 'Soma dos índices 0 e 1 deveria dar 1.';
        return;
      }
      if (dom_pai.childNodes.length != 2) {
        this.resultado = false;
        this.detalhes = 'Pai deveria ter 2 filhos.';
        return;
      }
      // Testa remoção.
      var chamou = false;
      AjustaFilhos(dom_pai, 1, function(indice_filho) { chamou = true; });
      if (chamou) {
        this.resultado = false;
        this.detalhes = 'Não deveria ter chamado função de adição para o div.';
      }
      if (dom_pai.childNodes.length != 1) {
        this.resultado = false;
        this.detalhes = 'Pai deveria ter 1 filho.';
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  for (var atributo in tabelas_atributos) {
    gPersonagem.atributos[atributo].bonus.Adiciona('base', null, 10);
  }
  _DependenciasAtributos();
  TemplateTeste({
    nome: 'DependenciasSalvacoes',
    Testa: function() {
      // Guerreiro 1 nivel default.
      gPersonagem.classes[0].classe = 'guerreiro';
      gPersonagem.classes[0].nivel = 1;
      _DependenciasSalvacoes();
      if (ComparaSalvacoes({ fortitude: 2, reflexo: 0, vontade: 0 }).length > 0) {
        this.resultado = false;
        this.detalhes = 'Guerreiro de primeiro nível deveria ter fortitude 2: ' + ComparaSalvacoes({ fortitude: 2, reflexo: 0, vontade: 0 });
        return;
      }
      // Ladino nivel 1.
      gPersonagem.classes[0].classe = 'ladino';
      _DependenciasSalvacoes();
      if (ComparaSalvacoes({ fortitude: 0, reflexo: 2, vontade: 0 }).length > 0) {
        this.resultado = false;
        this.detalhes = 'Ladino de primeiro nível deveria ter reflexo 2.';
        return;
      }
      // Clerigo nivel 1.
      gPersonagem.classes[0].classe = 'clerigo';
      gPersonagem.raca = 'halfling';
      _DependenciasSalvacoes();
      if (ComparaSalvacoes({ fortitude: 3, reflexo: 1, vontade: 3 }).length > 0) {
        this.resultado = false;
        this.detalhes = 'Clérigo halfling de primeiro nível deveria ser 3 1 3: ' + ComparaSalvacoes({ fortitude: 3, reflexo: 1, vontade: 3 });
        return;
      }
      this.resultado = true;

      // Fortitude maior.
      gPersonagem.talentos.gerais.push({ chave: 'fortitude_maior' });
      _DependenciasTalentos();
      _DependenciasSalvacoes();
      if (ComparaSalvacoes({ fortitude: 5, reflexo: 1, vontade: 3 }).length > 0) {
        this.resultado = false;
        this.detalhes = 'Clérigo halfling de primeiro nível com fortitude maior deveria ser 5 1 3: ' + ComparaSalvacoes({ fortitude: 5, reflexo: 1, vontade: 3 });
        return;
      }
      this.resultado = true;

      // Paladino nivel 2 com graca divina e 1 de bonus carisma.
      PersonagemLimpaGeral();
      gPersonagem.classes[0].classe = 'paladino';
      gPersonagem.classes[0].nivel = 2;
      gPersonagem.atributos.sabedoria.bonus.Adiciona('base', null, 10);
      gPersonagem.atributos.destreza.bonus.Adiciona('base', null, 10);
      gPersonagem.atributos.constituicao.bonus.Adiciona('base', null, 10);
      gPersonagem.atributos.carisma.bonus.Adiciona('base', null, 12);
      gPersonagem.raca = 'humano';
      _DependenciasAtributos();
      _DependenciasHabilidadesEspeciais();
      _DependenciasSalvacoes();
      if (ComparaSalvacoes({ fortitude: 4, reflexo: 1, vontade: 1 }).length > 0) {
        this.resultado = false;
        this.detalhes = 'Clérigo humano de segundo nível deveria ser 4 1 1.';
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Ferimentos',
    Testa: function() {
      gEntradas.ferimentos = 0;
      EntradasAdicionarFerimentos(3);
      if (gEntradas.ferimentos != 3) {
        this.resultado = false;
        this.detalhes = 'Esperava ferimentos positivo: 3';
        return;
      }
      _ConvertePontosVida();
      if (gPersonagem.pontos_vida.ferimentos != gEntradas.ferimentos) {
        this.resultado = false;
        this.detalhes = 'Esperava ferimentos personagem igual ao das entradas';
        return;
      }
      EntradasAdicionarFerimentos(-5);
      if (gEntradas.ferimentos != 0) {
        this.resultado = false;
        this.detalhes = 'Esperava zero ferimentos ';
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'AdicionaItens',
    Testa: function() {
      var div_pai = CriaDiv('pai');
      var div_filho = CriaDiv('filho');
      AdicionaItem('capas', div_filho, div_pai);
      // O div pai deve conter o filho.
      if (div_pai.firstChild != div_filho) {
        this.resultado = false;
        this.detalhes = 'Esperava div_filho como filho unico de div_pai';
        return false;
      }
      // Primeiro filho: input.
      var input = div_filho.firstChild;
      if (input.tagName != 'INPUT' || input.name != 'em_uso') {
        this.resultado = false;
        this.detalhes = 'Esperava input de uso como primeiro filho';
        return false;
      }
      // Segundo filho: select ordenado.
      var select = input.nextSibling;
      if (select.tagName != 'SELECT' || select.name != 'item') {
        this.resultado = false;
        this.detalhes = 'Esperava select de item como segundo filho';
        return false;
      }
      var options = select.options;
      // Como eh ordenado, primeiro item eh a capa saltimbanco.
      var capa_saltimbanco = tabelas_capas['capa_saltimbanco'];
      if (options[0].text != 'Capa do saltimbanco (10080 PO)' || options[0].value != 'capa_saltimbanco') {
        this.resultado = false;
        this.detalhes =
            'Esperava capa do saltimbanco como primeiro elemento do select ordenado. Encontrei: ' +
            'texto: "' + options[0].text + '", valor: "' + options[0].value + '"';
        return false;
      }
      var tunica_resistencia_magia = tabelas_capas['tunica_resistencia_magia'];
      if (options[options.length - 1].text != 'Túnica de resistência a magia (90000 PO)' ||
          options[options.length - 1].value != 'tunica_resistencia_magia') {
        this.resultado = false;
        this.detalhes = 'Esperava tunica_resistencia_magia como ultimo elemento do select ordenado.';
        return false;
      }

      // Outros filhos?

      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Template',
    Testa: function() {
      gPersonagem.template = 'lich',
      gPersonagem.classes[0].classe = 'mago';
      gPersonagem.classes[0].nivel = 1;
      _GeraPontosDeVida('elite');
      if (gPersonagem.pontos_vida.total_dados != 12) {
        this.detalhes = 'Esperava 12 pontos de vida na geracao de um lich de primeiro nivel, obtive: ' + gPersonagem.pontos_vida.total_dados;
        this.resultado = false;
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Nivel Conjurador',
    Testa: function() {
      gPersonagem.template = '',
      gPersonagem.classes[0].classe = 'mago';
      gPersonagem.classes[0].nivel = 1;
      _DependenciasNivelConjurador();
      if (PersonagemNivelConjuradorClasse('mago') != 1) {
        this.resultado = false;
        this.detalhes = 'Esperava mago nivel 1';
        return;
      }
      if (PersonagemLinhaTabelaFeiticos('mago') != 1) {
        this.resultado = false;
        this.detalhes = 'Esperava mago linha 1';
        return;
      }
      gPersonagem.classes.push({ classe: 'teurgista_mistico', nivel: 1});
      _DependenciasNivelConjurador();
      if (PersonagemNivelConjuradorClasse('mago') != 2) {
        this.resultado = false;
        this.detalhes = 'Esperava mago nivel 2';
        return;
      }
      if (PersonagemLinhaTabelaFeiticos('mago') != 2) {
        this.resultado = false;
        this.detalhes = 'Esperava mago linha 2';
        return;
      }

      PersonagemLimpaGeral();
      gPersonagem.classes[0].classe = 'paladino';
      gPersonagem.classes[0].nivel = 1;
      _DependenciasNivelConjurador();
      if (PersonagemNivelConjuradorClasse('paladino') != 0) {
        this.resultado = false;
        this.detalhes = 'Esperava paladino nivel 0';
        return;
      }
      gPersonagem.classes[0].nivel = 4;
      _DependenciasNivelConjurador();
      if (PersonagemNivelConjuradorClasse('paladino') != 2) {
        this.resultado = false;
        this.detalhes = 'Esperava paladino nivel 2';
        return;
      }
      if (PersonagemLinhaTabelaFeiticos('paladino') != 4) {
        this.resultado = false;
        this.detalhes = 'Esperava paladino linha 4';
        return;
      }

      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Multiplos ataques',
    Testa: function() {
      gPersonagem.template = '',
      gPersonagem.classes[0].classe = 'guerreiro';
      gPersonagem.classes[0].nivel = 6;
      gPersonagem.atributos.forca.bonus.Adiciona('base', null, 10);
      _DependenciasAtributos();
      _DependenciasTalentos();
      _DependenciasBba();
      _DependenciasProficienciaArmas();
      _DependenciasArmas();
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'uma_arma', arma_primaria: 'espada longa +1', arma_secundaria: 'desarmado' }));
      _DependenciasEstilos();
      var bonus_espada = gPersonagem.estilos_luta[0].arma_primaria.bonus_por_categoria.cac;
      if (bonus_espada.ataque.length != 2 || gPersonagem.numero_ataques != 2) {
        this.detalhes = 'Esperava dois ataques de guerreiro de 6 nivel.';
        this.resultado = false;
        return;
      }
      if (bonus_espada.ataque[0] != 7) {
        this.detalhes = 'Esperava +7 primeiro ataque.';
        this.resultado = false;
        return;
      }
      if (bonus_espada.ataque[1] != 2) {
        this.detalhes = 'Esperava +2 segundo ataque.';
        this.resultado = false;
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Braçadeiras de Arqueiro',
    Testa: function() {
      gPersonagem.template = '',
      gPersonagem.classes[0].classe = 'ladino';
      gPersonagem.classes[0].nivel = 1;
      gPersonagem.atributos.forca.bonus.Adiciona('base', null, 10);
      gPersonagem.atributos.destreza.bonus.Adiciona('base', null, 10);
      gPersonagem.bracaduras.push({ chave: 'arqueiro_maior', em_uso: true });
      _DependenciasAtributos();
      _DependenciasTalentos();
      _DependenciasBba();
      _DependenciasProficienciaArmas();
      _DependenciasArmas();
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'uma_arma', arma_primaria: 'arco curto', arma_secundaria: 'desarmado' }));
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'uma_arma', arma_primaria: 'arco longo', arma_secundaria: 'desarmado' }));
      _DependenciasEstilos();
      var bonus_arco_curto = gPersonagem.estilos_luta[0].arma_primaria.bonus_por_categoria.distancia;
      if (bonus_arco_curto.ataque.length != 1 || gPersonagem.numero_ataques != 1) {
        this.detalhes = 'Esperava 1 ataque de ladino primeiro nivel.';
        this.resultado = false;
        return;
      }
      // Com pericia, ganha 2.
      if (bonus_arco_curto.ataque[0] != 2) {
        this.detalhes = 'Esperava bonus de ataque 2 com arco curto e bracedeira arqueiro maior.';
        this.resultado = false;
        return;
      }
      if (bonus_arco_curto.dano != 1) {
        this.detalhes = 'Esperava bonus de dano 1 com arco curto e bracedeira arqueiro maior.';
        this.resultado = false;
        return;
      }

      var bonus_arco_longo = gPersonagem.estilos_luta[1].arma_primaria.bonus_por_categoria.distancia;
      if (bonus_arco_longo.ataque.length != 1 || gPersonagem.numero_ataques != 1) {
        this.detalhes = 'Esperava 1 ataque de ladino primeiro nivel.';
        this.resultado = false;
        return;
      }
      // Sem pericia, passa a ter.
      if (bonus_arco_longo.ataque[0] != 0) {
        this.detalhes = 'Esperava bonus de ataque 0 com arco longo e bracadeira arqueiro maior.';
        this.resultado = false;
        return;
      }
      if (bonus_arco_longo.dano != 0) {
        this.detalhes = 'Esperava bonus de dano 0 com arco longo e bracadeira arqueiro maior.';
        this.resultado = false;
        return;
      }

      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Arcos Compostos',
    Testa: function() {
      gPersonagem.template = '',
      gPersonagem.classes[0].classe = 'guerreiro';
      gPersonagem.classes[0].nivel = 6;
      gPersonagem.atributos.forca.bonus.Adiciona('base', null, 15);
      gPersonagem.atributos.destreza.bonus.Adiciona('base', null, 10);
      _DependenciasAtributos();
      _DependenciasTalentos();
      _DependenciasBba();
      _DependenciasProficienciaArmas();
      _DependenciasArmas();
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'uma_arma', arma_primaria: 'arco curto composto (1)', arma_secundaria: 'desarmado' }));
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'uma_arma', arma_primaria: 'arco longo composto (2)', arma_secundaria: 'desarmado' }));
      _DependenciasEstilos();
      var dano_arco_curto = gPersonagem.estilos_luta[0].arma_primaria.bonus_por_categoria.distancia.dano;
      if (dano_arco_curto != 1) {
        this.detalhes = 'Esperava 1 de bonus de dano arco composto (1).';
        this.resultado = false;
        return;
      }
      var dano_arco_longo = gPersonagem.estilos_luta[1].arma_primaria.bonus_por_categoria.distancia.dano;
      if (dano_arco_longo != 2) {
        this.detalhes = 'Esperava 2 de bonus de dano arco composto (2).';
        this.resultado = false;
        return;
      }
      gPersonagem.atributos.forca.bonus.Adiciona('base', null, 10);
      _DependenciasAtributos();
      _DependenciasTalentos();
      _DependenciasBba();
      _DependenciasProficienciaArmas();
      _DependenciasArmas();
      _DependenciasEstilos();
      var dano_arco_longo = gPersonagem.estilos_luta[1].arma_primaria.bonus_por_categoria.distancia.dano;
      if (dano_arco_longo != 0) {
        this.detalhes = 'Esperava 0 de bonus de dano do arco composto (2) sem forca.';
        this.resultado = false;
        return;
      }
      var bonus_arco_longo = gPersonagem.estilos_luta[1].arma_primaria.bonus_por_categoria.distancia.ataque[0];
      if (bonus_arco_longo != 4) {
        this.detalhes = 'Esperava 4 (6 -2) de bonus de ataque do arco composto (2) sem forca.';
        this.resultado = false;
        return;
      }
      this.resultado = true;
    },
  }, body);

  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Bestas',
    Testa: function() {
      gPersonagem.template = '',
      gPersonagem.classes[0].classe = 'guerreiro';
      gPersonagem.classes[0].nivel = 1;
      gPersonagem.atributos.forca.bonus.Adiciona('base', null, 8);
      gPersonagem.atributos.destreza.bonus.Adiciona('base', null, 12);
      _DependenciasAtributos();
      _DependenciasTalentos();
      _DependenciasBba();
      _DependenciasProficienciaArmas();
      _DependenciasArmas();
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'duas_maos', arma_primaria: 'besta leve', arma_secundaria: 'desarmado' }));
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'arma_escudo', arma_primaria: 'besta leve', arma_secundaria: 'desarmado' }));
      gPersonagem.estilos_luta.push(_ConverteEstilo({ nome: 'arma_escudo', arma_primaria: 'besta pesada', arma_secundaria: 'desarmado' }));
      _DependenciasEstilos();
      var dano_besta_leve = gPersonagem.estilos_luta[0].arma_primaria.bonus_por_categoria.distancia.dano;
      if (dano_besta_leve != 0) {
        this.detalhes = 'Esperava 0 de penalidade de forca para besta.';
        this.resultado = false;
        return;
      }
      var ataque_besta_leve = gPersonagem.estilos_luta[0].arma_primaria.bonus_por_categoria.distancia.ataque[0];
      if (ataque_besta_leve != 2) {
        this.detalhes = 'Esperava 2 de ataque para besta.';
        this.resultado = false;
        return;
      }
      var ataque_besta_leve_arma_escudo = gPersonagem.estilos_luta[1].arma_primaria.bonus_por_categoria.distancia.ataque[0];
      if (ataque_besta_leve_arma_escudo != 0) {
        this.detalhes = 'Esperava 0 de ataque para besta leve com escudo.';
        this.resultado = false;
        return;
      }
      var ataque_besta_pesada_arma_escudo = gPersonagem.estilos_luta[2].arma_primaria.bonus_por_categoria.distancia.ataque[0];
      if (ataque_besta_pesada_arma_escudo != -2) {
        this.detalhes = 'Esperava -2 de ataque para besta pesada com escudo.';
        this.resultado = false;
        return;
      }

      this.resultado = true;
    },
  }, body);


  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'Feiticos',
    Testa: function() {
      var dom_teste = Dom('Feiticos');
      var div_slots_0 = CriaDiv('div-feiticos-slots-feiticeiro-0', 'div-feiticos-slots-feiticeiro-0');
      dom_teste.appendChild(div_slots_0);
      _AtualizaSlotsFeiticosParaClassePorNivel(
          'feiticeiro',
          0,
          // slots
          { cd: 10, feiticos: [ { nivel_conhecido: 0, indice_conhecido: 0}, { nivel_conhecido: 0, indice_conhecido: 1, gasto: true } ] },
          // conhecidos
          { 0: [ { f0a: 'f0a'}, { f0b: 'f0b'} ]});
      if (Dom('div-feiticos-slots-feiticeiro-0').childNodes.length != 2) {
        this.resultado = false;
        this.detalhes = 'Esperava dois slots de feitico';
        return;
      }
      if (Dom('input-feiticos-slots-gastos-feiticeiro-0-0').checked || !Dom('input-feiticos-slots-gastos-feiticeiro-0-1').checked) {
        this.resultado = false;
        this.detalhes = 'Checkbox de gasto em estado inconsistente. Esperava 0 e 1';
        return;
      }
      // Limpa o dom de teste.
      RemoveFilhos(dom_teste);
      this.resultado = true;
    },
  }, body);

  /*
   * Esse teste so vai funcionar quando AtualizaGeral funcionar.
  PersonagemLimpaGeral();
  TemplateTeste({
    nome: 'ClickUsarItem',
    Testa: function() {
      var checkbox = { checked: true };
      ClickUsarItem('aneis', checkbox);
      gPersonagem['aneis'] = [
          { chave: 'protecao_1', em_uso: false},
          { chave: 'protecao_1', em_uso: false},
          { chave: 'protecao_1', em_uso: false}];
      if (!checkbox.checked) {
        this.resultado = false;
        this.detalhes = 'Esperava que o checkbox fosse marcado.';
        return;
      }
      gPersonagem['aneis'][0].em_uso = gPersonagem['aneis'][1].em_uso = true;
      ClickUsarItem('aneis', checkbox);
      if (!checkbox.checked) {
        this.resultado = false;
        this.detalhes = 'Esperava que o checkbox não fosse marcado.';
        return;
      }

      this.resultado = true;
    },
  }, body);
   */

  // Parte assincrona do armazem.
  PersonagemLimpaGeral();
  var nome_chave = 'nome de teste maluco que nunca devera ser usado';
  SalvaNoArmazem(nome_chave, 'valor de teste', function() {
    ListaDoArmazem(function(lista_nomes) {
      TemplateTeste({
        nome: 'Armazem',
        Testa: function() {
          this.resultado = false;
          for (var i = 0; i < lista_nomes.length; ++i) {
            if (lista_nomes[i] == nome_chave) {
              this.resultado = true;
              break;
            }
          }
          if (!this.resultado) {
            this.detalhes = 'Esperava encontrar "' + nome_chave + '" no armazém.';
          }
        },
      }, body);
      ExcluiDoArmazem(nome_chave, function() {});
    });
  });
}
