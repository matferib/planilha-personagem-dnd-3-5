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
// @return true se o valor total das salvacoes do personagem for igual aos valores passados.
function ComparaSalvacoes(salvacoes) {
  for (var tipo_salvacao in salvacoes) {
    if (gPersonagem.salvacoes[tipo_salvacao].Total() != salvacoes[tipo_salvacao]) {
      return false;
    }
  }
  return true;
}

// Testes.

// Cria um novo template de testes a ser adicionado no dom.
// @param nome_teste o nome do teste.
// @param handler_teste deve possuir nome, a funcao 'Testa' para realizar o teste, 
// e apos o teste deve obrigatoriamente possuir o campo 'resultado'. Opcionalmente
// deve possuir o campo 'detalhes' para detalhar o teste.
// @param dom onde o teste sera adicionado.
function TemplateTeste(handler_teste, dom) {
  handler_teste.Testa();

  // div do teste.
  var div_teste = CriaDiv(null, 'div_teste');

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

  dom.appendChild(div_teste);
} 

function CarregaTestes() {
  _CarregaTabelaArmasArmaduras();
  var body = document.getElementsByTagName('body')[0];

  PersonagemLimpaGeral();
  gPersonagem.armas = [ 
      { entrada: { chave: 'espada_longa', bonus: 1, obra_prima: false }, nome_gerado: 'TesteArma' } ];
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
      _DependenciasArmadurasEscudos();
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
    nome: 'RequisitosTalentos', 
    Testa: function() {
      // teste simples.
      r = PersonagemVerificaPrerequisitosTalento('usar_armas_simples');
      if (r != null) {
        this.resultado = false;
        this.detalhes = 'Erro com verificação do talento "usar_armas_simples"' + r;
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
      gPersonagem.atributos.sabedoria.valor = 13;
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
  TemplateTeste({
    nome: 'DependenciasSalvacoes', 
    Testa: function() {
      // Guerreiro 1 nivel default.
      gPersonagem.classes[0].classe = 'guerreiro';
      gPersonagem.classes[0].nivel = 1;
      _DependenciasSalvacoes();
      if (!ComparaSalvacoes({ fortitude: 2, reflexo: 0, vontade: 0 })) {
        this.resultado = false;
        this.detalhes = 'Guerreiro de primeiro nível deveria ter fortitude 2.';
        return;
      }
      // Ladino nivel 1.
      gPersonagem.classes[0].classe = 'ladino';
      _DependenciasSalvacoes();
      if (!ComparaSalvacoes({ fortitude: 0, reflexo: 2, vontade: 0 })) {
        this.resultado = false;
        this.detalhes = 'Ladino de primeiro nível deveria ter reflexo 2.';
        return;
      }
      // Clerigo nivel 1.
      gPersonagem.classes[0].classe = 'clerigo';
      gPersonagem.raca = 'halfling';
      _DependenciasSalvacoes();
      if (!ComparaSalvacoes({ fortitude: 3, reflexo: 1, vontade: 3 })) {
        this.resultado = false;
        this.detalhes = 'Clérigo halfling de primeiro nível deveria ser 3 1 3.';
        return;
      }
      this.resultado = true;

      // Fortitude maior.
      gPersonagem.talentos.gerais.push({ chave: 'fortitude_maior' });
      _DependenciasTalentos();
      _DependenciasSalvacoes();
      if (!ComparaSalvacoes({ fortitude: 5, reflexo: 1, vontade: 3 })) {
        this.resultado = false;
        this.detalhes = 'Clérigo halfling de primeiro nível com fortitude maior deveria ser 5 1 3.';
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
