// Todas as tabelas que forem referentes a geracao automatica de personagem.

// Tabelas de geracao de atributos.
var tabelas_geracao_atributos = {
  // Peguei do livro do mestre.
  barbaro: ['forca', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
  bardo: [ 'carisma', 'inteligencia', 'destreza', 'constituicao', 'forca', 'sabedoria' ],
  clerigo: [ 'sabedoria', 'constituicao', 'forca', 'carisma', 'inteligencia',  'destreza' ],
  druida: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
  guerreiro: [ 'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
  feiticeiro: [ 'carisma', 'destreza', 'constituicao', 'sabedoria', 'inteligencia', 'forca' ],
  ladino: [ 'destreza', 'inteligencia', 'constituicao', 'forca', 'sabedoria', 'carisma' ],
  mago: [ 'inteligencia', 'destreza', 'constituicao', 'sabedoria', 'forca', 'carisma' ],
  monge: [ 'sabedoria', 'forca', 'destreza', 'constituicao', 'inteligencia', 'carisma' ],
  paladino: [ 'carisma', 'forca', 'sabedoria', 'constituicao', 'inteligencia', 'destreza' ],
  ranger: [ 'destreza', 'forca', 'constituicao', 'sabedoria', 'inteligencia', 'carisma' ],
  // classes NPC: nao existe uma tabela para esses, coloquei o que achei mais adequado.
  adepto: [ 'sabedoria', 'destreza', 'constituicao', 'inteligencia', 'forca', 'carisma' ],
    // Esse ta muito ruim...
  aristocrata: [ 'destreza', 'inteligencia', 'forca', 'carisma', 'constituicao', 'sabedoria' ],
  plebeu: [ 'forca', 'constituicao', 'sabedoria', 'destreza', 'inteligencia', 'carisma' ],
    // esse aqui varia de acordo com as escolhas da area de expertise.
  expert: [ 'inteligencia', 'forca', 'destreza', 'constituicao', 'sabedoria', 'carisma' ],
  combatente: [  'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
};


