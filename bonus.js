// A classe de bonus util para calcular o bonus total.
// Bonus nao cumulativos de tipos diferentes se acumulam. Exemplo: alquimico e
// armadura. Para dois bonus iguais não cumulativos, o mais forte prevalece.
// Bonus cumulativos de tipos iguais e subtipos diferentes se acumulam. Por exemplo:
// bonus de circusntancias de diferentes tipos.

// Construtor, chamar com new Bonus.
function Bonus() {
  this.por_chave = {};
  this.por_chave.alquimico = { cumulativo: false, por_origem: {}, };
  this.por_chave.armadura = { cumulativo: false, por_origem: {}, };
  this.por_chave.armadura_melhoria = { cumulativo: false, por_origem: {}, };
  this.por_chave.armadura_natural = { cumulativo: false, por_origem: {}, };
  this.por_chave.atributo = { cumulativo: true, por_origem: {}, };
  this.por_chave.circunstancia = { cumulativo: true, por_origem: {}, };
  this.por_chave.competencia = { cumulativo: false, por_origem: {}, };
  this.por_chave.deflexao = { cumulativo: false, por_origem: {}, };
  this.por_chave.escudo = { cumulativo: false, por_origem: {}, };
  this.por_chave.escudo_melhoria = { cumulativo: false, por_origem: {}, };
  this.por_chave.esquiva = { cumulativo: true, por_origem: {}, };
  this.por_chave.inerente = { cumulativo: false, por_origem: {}, };
  this.por_chave.intuicao = { cumulativo: false, por_origem: {}, };
  this.por_chave.melhoria = { cumulativo: false, por_origem: {}, };
  this.por_chave.moral = { cumulativo: false, por_origem: {}, };
  this.por_chave.profano = { cumulativo: false, por_origem: {}, };
  this.por_chave.racial = { cumulativo: false, por_origem: {}, };
  this.por_chave.resistencia = { cumulativo: false, por_origem: {}, };
  this.por_chave.sagrado = { cumulativo: false, por_origem: {}, };
  this.por_chave.sinergia = { cumulativo: false, por_origem: {}, };
  this.por_chave.sorte = { cumulativo: false, por_origem: {}, };
  this.por_chave.talento = { cumulativo: true, por_origem: {}, };
  this.por_chave.tamanho = { cumulativo: false, por_origem: {}, };
}

// Limpa os bonus.
Bonus.prototype.Limpa = function(excluir) {
  for (var chave_bonus in this.por_chave) {
    this.por_chave[chave_bonus].por_origem = {};
  }
}

// @param excluir array com os tipos de bonus a serem excluidos.
// @return o valor total do bonus.
Bonus.prototype.Total = function(excluir) {
  var total = 0;
  for (var chave_bonus in this.por_chave) {
    var nao_usar_bonus = false;
    for (var i = 0; excluir && i < excluir.length; ++i) {
      if (excluir[i] == chave_bonus) {
        nao_usar_bonus = true;
      }
    }
    if (nao_usar_bonus) {
      continue;
    }
    var total_chave = 0;
    var bonus = this.por_chave[chave_bonus];
    for (var subchave in bonus.por_origem) {
      if (bonus.cumulativo) {
        total_chave += bonus.por_origem[subchave];
      } else {
        if (bonus.por_origem[subchave] > total_chave) {
          total_chave = bonus.por_origem[subchave];
        }
      }
    }
    total += total_chave;
  }
  return total;
}

// Adiciona um dado tipo de bonus ao personagem.
// @param chave o tipo de bonus.
// @param subschave do bonus.
Bonus.prototype.Adiciona = function(chave_bonus, subchave, valor) {
  var bonus = this.por_chave[chave_bonus];
  if (bonus == null) {
    alert('Tipo de bonus invalido: ' + chave_bonus);
    return;
  }
  bonus.por_origem[subchave] = valor;
}

// Le um determinado tipo de bonus.
Bonus.prototype.Le = function(chave_bonus, subchave) {
  var bonus = this.por_chave[chave_bonus];
  if (bonus == null) {
    alert('Tipo de bonus invalido: ' + chave_bonus);
    return;
  }
  return bonus.por_origem[subchave];
}
