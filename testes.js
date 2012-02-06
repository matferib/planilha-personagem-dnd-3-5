// Arquivos de testes da planilha.

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
}
