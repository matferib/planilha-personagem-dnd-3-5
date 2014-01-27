// Funcoes relacionadas ao estado do Desfazer e Refazer.

function Estado() {
  this.estado_corrente = null;
  this.estado_anterior = null;
};

// Salva o estado e passa o corrente para o anterior.
Estado.prototype.Salva = function(estado) {
  this.estado_anterior = this.estado_corrente;
  this.estado_corrente = estado;
}

// Retorna o estado anterior ao corrente.
Estado.prototype.Restaura = function() {
  return this.estado_anterior;
}

var gEstado = new Estado();
