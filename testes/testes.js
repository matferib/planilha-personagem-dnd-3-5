// Arquivos de testes da planilha.

// Funcoes auxiliares.

// @param moedas{1,2} objeto contendo { platina, ouro, prata, cobre}
// @return true se as moedas forem iguais.
function _ComparaMoedas(moedas1, moedas2) {
  for (var tipo_moeda in moedas1) {
    if (moedas1[tipo_moeda] != moedas2[tipo_moeda]) {
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
  var body = document.getElementsByTagName('body')[0];

  LimpaGeral();
  personagem.armas = [ 
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

  LimpaGeral();
  personagem.moedas = { platina: 1, ouro: 2, prata: 3, cobre: 4 }; 
  TemplateTeste({
    nome: 'PersonagemAdicionarMoedas', 
    Testa: function() {
      this.resultado = false;
      var resultado_moedas = { platina: 1, ouro: 2, prata: 3, cobre: 4 };
      // Aqui a funcao PersonagemAdicionarMoedas tem que retornar true.
      if (!PersonagemAdicionarMoedas({ platina: 0, ouro: 0, prata: 0, cobre: 0 }) ||
          !_ComparaMoedas(resultado_moedas, personagem.moedas)) {
        this.detalhes = 'Valores nao deveriam ter mudado';
        this.resultado = false;
        return;
      }
      // Aqui a funcao PersonagemAdicionarMoedas tem que retornar false.
      if (PersonagemAdicionarMoedas({ platina: -1, ouro: -3, prata: 0, cobre: 0 }) ||
          !_ComparaMoedas(resultado_moedas, personagem.moedas)) {
        this.detalhes = 'Valores nao deveriam ter mudado, ouro ficaria negativo';
        this.resultado = false;
        return;
      }
      resultado_moedas = { platina: 0, ouro: 5, prata: 6, cobre: 7 };
      // Aqui a funcao PersonagemAdicionarMoedas tem que retornar true.
      if (!PersonagemAdicionarMoedas({ platina: -1, ouro: 3, prata: 3, cobre: 3 }) ||
          !_ComparaMoedas(resultado_moedas, personagem.moedas)) {
        this.detalhes = 'Adição errada';
        this.resultado = false;
        return;
      }
      this.resultado = true;
    }, 
  }, body);

  LimpaGeral();
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

  LimpaGeral();
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
}
