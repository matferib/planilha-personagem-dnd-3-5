// Este arquivo deve conter funções para criação de elementos Doms específicos para a planilha.
// Por exemplo: divs contendo feiticos, perícias etc.

// Retorna um Div de feitico conhecido.
function CriaDomFeiticoConhecido(chave_classe, nivel, indice) {
  var div_feitico = CriaDiv();
  div_feitico.appendChild(CriaInputTexto(
      '',
      'input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + indice, 
      'feiticos-conhecidos',
      AtualizaGeral));
  if (!tabelas_feiticos[chave_classe].precisa_conhece) {
    div_feitico.appendChild(CriaBotao('-', null, null, {
      chave_classe: chave_classe,
      nivel: nivel,
      indice: indice,
      handleEvent: function () {
        var indice_a_remover = 0;
        entradas.feiticos_conhecidos[this.chave_classe][this.nivel].splice(this.indice, 1);
        // Arruma todos os slots de nivel maior ou igual.
        var slots_classe = entradas.slots_feiticos[this.chave_classe];
        for (var nivel in slots_classe) {
          if (nivel < this.nivel) {
            continue;
          }
          slots_classe[nivel].forEach(function(slot, indice_slot) {
            if (slot.nivel == this.nivel && slot.indice >= this.indice && slot.indice > 0) {
              --slot.indice;
            }
          }.bind(this));
        }
        AtualizaGeralSemLerEntradas();
      }
    }));
  }
  div_feitico.appendChild(CriaBr());
  return div_feitico;
}
