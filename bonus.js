// A classe de bonus util para calcular o bonus total.
// Bonus nao cumulativos de tipos diferentes se acumulam. Exemplo: alquimico e
// armadura. Para dois bonus iguais não cumulativos, o mais forte prevalece.
// Bonus cumulativos de tipos iguais e subtipos diferentes se acumulam. Por exemplo:
// bonus de circusntancias de diferentes tipos.

// Construtor, chamar com new Bonus.
function Bonus() {
  this.por_chave = {};
  this.por_chave.alquimico = { nome: 'Alquímico', cumulativo: false, por_origem: {}, };
  this.por_chave.armadura = { nome: 'Armadura', cumulativo: false, por_origem: {}, };
  this.por_chave.armadura_melhoria = { nome: 'Armadura (melhoria)', cumulativo: false, por_origem: {}, };
  this.por_chave.armadura_natural = { nome: 'Amadura Natural', cumulativo: false, por_origem: {}, };
  this.por_chave.atributo = { nome: 'Atributo', cumulativo: true, por_origem: {}, };
  this.por_chave.base = { nome: 'Base', cumulativo: false, por_origem: {}, };
  this.por_chave.circunstancia = { nome: 'Circusntância', cumulativo: true, por_origem: {}, };
  this.por_chave.classe = { nome: 'Classe', cumulativo: true, por_origem: {}, };
  this.por_chave.competencia = { nome: 'Competência', cumulativo: false, por_origem: {}, };
  this.por_chave.deflexao = { nome: 'Deflexão', cumulativo: false, por_origem: {}, };
  this.por_chave.escudo = { nome: 'Escudo', cumulativo: false, por_origem: {}, };
  this.por_chave.escudo_melhoria = { nome: 'Escudo (melhoria)', cumulativo: false, por_origem: {}, };
  this.por_chave.esquiva = { nome: 'Esquiva', cumulativo: true, por_origem: {}, };
  this.por_chave.inerente = { nome: 'Inerente', cumulativo: false, por_origem: {}, };
  this.por_chave.intuicao = { nome: 'Intuição', cumulativo: false, por_origem: {}, };
  this.por_chave.melhoria = { nome: 'Melhoria', cumulativo: false, por_origem: {}, };
  this.por_chave.moral = { nome: 'Moral', cumulativo: false, por_origem: {}, };
  // cumulativo para poder ter valores negativos.
  this.por_chave.niveis_negativos = { nome: 'Níveis Negativos', cumulativo: true, por_origem: {}, };
  // Bonus de atributos ganhados a cada 4 niveis.
  this.por_chave.nivel = { nome: 'Nível', cumulativo: true, por_origem: {}, };
  this.por_chave.profano = { nome: 'Profano', cumulativo: false, por_origem: {}, };
  // cumulativo para aceitar valores negativos.
  this.por_chave.racial = { nome: 'Racial', cumulativo: true, por_origem: {}, };
  this.por_chave.template = { nome: 'Template', cumulativo: true, por_origem: {}, };
  this.por_chave.resistencia = { nome: 'Resistência', cumulativo: false, por_origem: {}, };
  this.por_chave.sagrado = { nome: 'Sagrado', cumulativo: false, por_origem: {}, };
  this.por_chave.sinergia = { nome: 'Sinergia', cumulativo: false, por_origem: {}, };
  this.por_chave.sorte = { nome: 'Sorte', cumulativo: false, por_origem: {}, };
  this.por_chave.talento = { nome: 'Talento', cumulativo: true, por_origem: {}, };
  this.por_chave.tamanho = { nome: 'Tamanho', cumulativo: false, por_origem: {}, };
}

// Limpa os bonus.
Bonus.prototype.Limpa = function(excluir) {
  for (var chave_bonus in this.por_chave) {
    this.por_chave[chave_bonus].por_origem = {};
  }
}

// @return um objeto de bonus com os mesmos valores da instância.
Bonus.prototype.Clona = function() {
  var b = new Bonus();
  for (var chave_bonus in this.por_chave) {
    for (var origem in this.por_chave[chave_bonus].por_origem) {
      b.por_chave[chave_bonus].por_origem[origem] =
        this.por_chave[chave_bonus].por_origem[origem];
    }
  }
  return b;
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
    total += this.TotalChave(chave_bonus);
  }
  return total;
}

// Adiciona um dado tipo de bonus ao personagem.
// @param chave o tipo de bonus.
// @param subschave do bonus. Pode ser null, neste caso '-' será usado.
Bonus.prototype.Adiciona = function(chave_bonus, subchave, valor) {
  var bonus = this.por_chave[chave_bonus];
  if (bonus == null) {
    Mensagem(Traduz('Tipo de bonus invalido') + ': ' + chave_bonus);
    return;
  }
  if (subchave == null) {
    subchave = '-';
  }
  bonus.por_origem[subchave] = valor;
}

// Le um determinado tipo de bonus.
// @param chave o tipo de bonus.
// @param subschave do bonus. Pode ser null, neste caso '-' será usado.
// @return o valor do bonus para a subchave ou 0 se não existir.
Bonus.prototype.Le = function(chave_bonus, subchave) {
  var bonus = this.por_chave[chave_bonus];
  if (bonus == null) {
    Mensagem(Traduz('Tipo de bonus invalido') + ': ' + chave_bonus);
    return;
  }
  if (subchave == null) {
    subchave = '-';
  }
  return bonus.por_origem[subchave] ? bonus.por_origem[subchave] : 0;
}

// @return o total para uma chave.
Bonus.prototype.TotalChave = function(chave_bonus) {
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
  return total_chave;
}

// Exporta os bonus diferentes de zero.
// Util para ser usado com a funcao Titulo.
// @param opt excluir array com os tipos de bonus a excluir (nao serao exportados).
// @return um array onde cada entrada eh um mapa nome: valor.
Bonus.prototype.Exporta = function(excluir) {
  var array_retorno = [];
  for (var chave_bonus in this.por_chave) {
    var bonus = this.por_chave[chave_bonus];
    var nao_usar_bonus = false;
    for (var i = 0; excluir && i < excluir.length; ++i) {
      if (excluir[i] == chave_bonus) {
        nao_usar_bonus = true;
      }
    }
    if (nao_usar_bonus) {
      continue;
    }

    var total_chave = this.TotalChave(chave_bonus);
    if (total_chave != 0) {
      var entrada_chave = {};
      entrada_chave[Traduz(bonus.nome)] = total_chave;
      array_retorno.push(entrada_chave);
    }
  }
  return array_retorno;
}
