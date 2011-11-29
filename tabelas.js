// Modificadores de habilidades por raca.
var tabelas_raca = {
  anao: { atributos: {constituicao: +2, carisma: -2}, tamanho: 'medio' },
  halfling: { atributos: { forca: -2, destreza: +2}, tamanho: 'pequeno' },
  humano: { atributos: {}, tamanho: 'medio' },
  elfo: { atributos: { destreza: +2, constituicao: -2 }, tamanho: 'medio' },
  gnomo: { atributos: { forca: -2, constituicao: +2 }, tamanho: 'pequeno' },
  meioelfo: { atributos: {}, tamanho: 'medio' },
  meioorc: { atributos: {forca: +2, inteligencia: -2, carisma: -2 }, tamanho: 'medio' }
};

// Bonus base de ataque.
function bba_forte(nivel) {
  if (nivel == 0) return 0;
  return nivel;
};
function bba_medio(nivel) {
  if (nivel == 0) return 0;
  var ret = (nivel - 1);
  var mod = Math.floor(nivel / 4);
  if (nivel % 4 == 0) { --mod; }
  return ret - mod;
}
function bba_fraco(nivel) {
  if (nivel == 0) return 0;
  return Math.floor(nivel / 2);
}
function bba_nulo() {
  return 0;
}

// Tabelas de dados de vida.
var tabelas_dados_vida = {
  barbaro: 12, 
  bardo: 6,
  clerigo: 8,
  druida: 8,
  guerreiro: 10,
  feiticeiro: 4,
  ladino: 6,
  mago: 4,
  monge: 8,
  paladino: 10,
  ranger: 8,
  // classes NPC
  adepto: 6,
  aristocrata: 8,
  plebeu: 4,
  expert: 6,
  combatente: 8,
};

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
  aristocrata: [ 'destreza', 'inteligencia', 'carisma', 'forca', 'constituicao', 'sabedoria' ], // Esse ta muito ruim...
  plebeu: [ 'forca', 'constituicao', 'sabedoria', 'destreza', 'inteligencia', 'carisma' ],
  expert: [ 'inteligencia', 'forca', 'destreza', 'constituicao', 'sabedoria', 'carisma' ], // esse aqui varia de acordo com as escolhas
  combatente: [  'forca', 'constituicao', 'destreza', 'sabedoria', 'inteligencia', 'carisma' ],
};

// Tabelas de BBA.
var tabelas_bba = {
  barbaro: bba_forte, 
  bardo: bba_medio,
  clerigo: bba_medio,
  druida: bba_medio,
  guerreiro: bba_forte,
  feiticeiro: bba_fraco,
  ladino: bba_medio,
  mago: bba_fraco,
  monge: bba_medio,
  paladino: bba_forte,
  ranger: bba_forte,
  // classes NPC
  adepto: bba_fraco,
  aristocrata: bba_medio,
  plebeu: bba_fraco,
  expert: bba_medio,
  combatente: bba_forte,
};

// Salvacoes
function salvacao_forte(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 2) + 2 : 0;
}
function salvacao_fraca(nivel) {
  return (nivel > 0) ? Math.floor(nivel / 3) : 0;
}
// Tabelas de salvacao.
var tabelas_salvacao = {
  barbaro: { 
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  bardo: { 
    fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_forte },
  clerigo: { 
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
  druida: { 
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_forte },
  feiticeiro: { 
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  guerreiro: { 
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  ladino: { 
    fortitude: salvacao_fraca, reflexo: salvacao_forte, vontade: salvacao_fraca },
  mago: { 
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  monge: { 
    fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_forte },
  paladino: { 
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  ranger: { 
    fortitude: salvacao_forte, reflexo: salvacao_forte, vontade: salvacao_fraca },
  // classes NPC
  adepto: { 
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  aristocrata: { 
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  plebeu: { 
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_fraca },
  expert: { 
    fortitude: salvacao_fraca, reflexo: salvacao_fraca, vontade: salvacao_forte },
  combatente: { 
    fortitude: salvacao_forte, reflexo: salvacao_fraca, vontade: salvacao_fraca },
};

// Tabelas de tamanho.
var tabelas_tamanho = {
  minusculo: { nome: 'Minúsculo', ataque_defesa: 8, },
  diminuto: { nome: 'Diminuto', ataque_defesa: 4, },
  miudo: { nome: 'Miúdo', ataque_defesa: 2, },
  pequeno: { nome: 'Pequeno', ataque_defesa: 1, }, 
  medio: { nome: 'Médio', ataque_defesa: 0, },
  grande: { nome: 'Grande', ataque_defesa: -1, },
  enorme: { nome: 'Enorme', ataque_defesa: -2, },
  imenso: { nome: 'Imenso', ataque_defesa: -4, },
  colossal: { nome: 'Colossal', ataque_defesa: -8, },
};

// Tabelas de armaduras.
var tabelas_armaduras = {
  nenhuma: { 
    nome: 'Nenhuma', bonus: 0, },
  acolchoada: { 
    nome: 'Acolchoada', bonus: 1, maximo_bonus_destreza: 8 },
  couro: { 
    nome: 'Couro', bonus: 2,  maximo_bonus_destreza: 6 },
  couro_batido: { 
    nome: 'Couro Batido', bonus: 3, maximo_bonus_destreza: 5 },
  camisao_cota_de_malha: { 
    nome: 'Camisão de Cota de Malha', bonus: 4, maximo_bonus_destreza: 4 },
  gibao_de_peles: { 
    nome: 'Gibão de Peles', bonus: 3, maximo_bonus_destreza: 4 },
  brunea: { 
    nome: 'Brunea', bonus: 4, maximo_bonus_destreza: 3 },
  cota_de_malha: { 
    nome: 'Cota de Malha', bonus: 5, maximo_bonus_destreza: 2 },
  peitoral_de_aco: { 
    nome: 'Peitoral de Aço', bonus: 5, maximo_bonus_destreza: 3 },
  cota_de_talas: { 
    nome: 'Cota de Talas', bonus: 6, maximo_bonus_destreza: 0 },
  loriga_segmentada: { 
    nome: 'Loriga Segmentada', bonus: 6, maximo_bonus_destreza: 1 },
  meia_armadura: { 
    nome: 'Meia Armadura', bonus: 7, maximo_bonus_destreza: 0 },
  armadura_de_batalha: { 
    nome: 'Armadura de Batalha', bonus: 8, maximo_bonus_destreza: 1 },
};

// Tabelas de escudos (TODO terminar).
var tabelas_escudos = {
  nenhum: { nome: "Nenhum", bonus: 0 },
  broquel: { nome: "Broquel", bonus: 1 },
  escudo_leve_de_madeira: { nome: "Escudo Leve de Madeira", bonus: 1 },
  escudo_leve_de_aco: { nome: "Escudo Leve de Aço", bonus: 1 },
  escudo_pesado_de_aco: { nome: "Escudo Pesado de Madeira", bonus: 2 },
  escudo_pesado_de_aco: { nome: "Escudo Pesado de Aço", bonus: 2 },
  escudo_de_corpo: { nome: "Escudo de Corpo", bonus: 4, maximo_bonus_destreza: 2 },
};

var tabelas_armas = {

// Unarmed Attacks
  
  
  desarmado: { preco: "0 PO", dano: { pequeno: "1d2", medio: "1d3"}, 
               categorias: { cac_leve: true },
               critico: "×2", peso: "0", tipo: "concussao", incremento_distancia: "0 quadrados" },
  manopla: { preco: "2 PO", dano: { pequeno: "1d2", medio: "1d3" }, 
             categorias: { cac_leve: true },
             critico: "×2", peso: "500g", tipo: "concussao", },

//Light Melee Weapons


  adaga: { preco: "2 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
           categorias: { cac_leve: true, arremesso: true } ,
           incremento_distancia: "2 quadrados", critico: "19-20/×2", peso: "0,5kg", tipo: "cortante/perfurante" },

  adaga_de_soco: { nome: "adaga de soco", preco: "2 PO", dano: { pequeno: "1d3", medio: "1d4"},
                  categorias: { cac_leve: true },
                  critico: "×3", peso: "0,5kg", tipo: "perfurante" },

  manopla_com_cravos: { nome: "manopla com cravos", preco: "5 PO", dano: { pequeno: "1d3", medio: "1d4"} ,
                        categorias: { cac_leve: true } ,
                        critico: "×2", peso: "0,5kg", tipo: "perfurante" },

  maca_leve: { nome: "maça leve", preco: "5 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
               categorias: { cac_leve: true } ,
               critico: "×2", peso: "2kg", tipo: "concussao" },

  foice_curta: { nome: "foice curta", preco: "6 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                  categorias: { cac_leve: true } ,
                  critico: "×2", peso: "1kg", tipo: "cortante" },
                  
// One-Handed Melee Weapons

  clava: { preco: "0 PO", dano: { pequeno: "1d4", medio: "1d6" }, critico: "×2", 
           categorias: { cac_leve: true, arremesso: true },
           incremento_distancia: "2 quadrados", peso: "1,5Kg", tipo: "concussao" },
             
  maca_pesada: { nome: "maça pesada", preco: "12 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                 categorias: { cac: true } ,
                 critico: "×2", peso: "4kg", tipo: "concussao" },                                                   
                    
  maca_estrela: { nome: "maça estrela", preco: "8 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                  categorias: { cac: true } ,
                  critico: "×2", peso: "3kg", tipo: "concussao/perfurante" },     
                  
  lanca_curta: { nome: "lança curta", preco: "1 PO", dano: { pequeno: "1d4", medio: "1d6"} ,
                 categorias: { cac: true, arremesso: true} ,
                 incremento_distancia: "4 quadrados", critico: "×2", peso: "1,5kg", tipo: "perfurante" },                                      
                                                                        
// Two-Handed Melee Weapons
    
    
  lanca_longa: { nome: "lança longa", preco: "5 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                 categorias: { cac: true } ,
                 critico: "×3", peso: "4,5kg", tipo: "perfurante" },         
    
  bordao: { nome: "bordão", preco: "0 PO", dano: { pequeno: "1d4/1d4", medio: "1d6/1d6"} ,
                  categorias: { cac: true } ,
                  critico: "×2", peso: "2kg", tipo: "concussao" },  
                  
  lanca: { nome: "lança", preco: "2 PO", dano: { pequeno: "1d6", medio: "1d8" }, critico: "×3", 
           categorias: { cac: true, arremesso: true },
           incremento_distancia: "4 quadrados", peso: "3kg", tipo: "perfurante" },
           
//Ranged Weapons


  besta_pesada: { nome: "besta pesada", preco: "50 PO", dano: { pequeno: "1d8", medio: "1d10" }, critico: "19-20/×2",
                  categorias: { distancia: true },
                  incremento_distancia: "24 quadrados", peso: "4kg", tipo: "perfurante" },          
           
  besta_leve: { nome: "besta leve", preco: "35 PO", dano: { pequeno: "1d6", medio: "1d8" }, critico: "19-20/×2",
                categorias: { distancia: true },
                incremento_distancia: "16 quadrados", peso: "2kg", tipo: "perfurante" },      

  dardo: { nome: "dardo", preco: "5 PP", dano: { pequeno: "1d3", medio: "1d4" }, critico: "×2",
           categorias: { arremesso: true },
           incremento_distancia: "4 quadrados", peso: "250g", tipo: "perfurante" },    

  azagaia: { preco: "1 PO", dano: { pequeno: "1d4", medio: "1d6" }, critico: "×2",
             categorias: { arremesso: true },
             incremento_distancia: "6 quadrados", peso: "1Kg", tipo: "perfurante" },  
           
  funda: { nome: "funda", preco: "0 PO", dano: { pequeno: "1d3", medio: "1d4" }, critico: "×2",
           categorias: { arremesso: true },
           incremento_distancia: "10 quadrados", peso: "0Kg", tipo: "concussao" },              
             
              


//Munição
//Bolts, crossbow (10)  1 gp  — — — — 1 lb. —
//Bullets, sling (10) 1 sp  — — — — 5 lb. —


 /*



// Martial Weapons Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons
Axe, throwing 8 gp  1d4 1d6 ×2  10 ft.  2 lb. Slashing
Hammer, light 1 gp  1d3 1d4 ×2  20 ft.  2 lb. Bludgeoning
Handaxe 6 gp  1d4 1d6 ×3  — 3 lb. Slashing
Kukri 8 gp  1d3 1d4 18-20/×2  — 2 lb. Slashing
Pick, light 4 gp  1d3 1d4 ×4  — 3 lb. Piercing
Sap 1 gp  1d43  1d63  ×2  — 2 lb. Bludgeoning
Shield, light special 1d2 1d3 ×2  — special Bludgeoning
Spiked armor  special 1d4 1d6 ×2  — special Piercing
Spiked shield, light  special 1d3 1d4 ×2  — special Piercing
Sword, short  10 gp 1d4 1d6 19-20/×2  — 2 lb. Piercing
// One-Handed Melee Weapons
Battleaxe 10 gp 1d6 1d8 ×3  — 6 lb. Slashing
Flail 8 gp  1d6 1d8 ×2  — 5 lb. Bludgeoning
*/
  espada_longa: { nome: "espada longa", preco: "15 PO", dano: { pequeno: "1d6", medio: "1d8"} ,
                  categorias: { cac: true },
                  critico: "19-20/×2", peso: "2kg", tipo: "cortante", },
  /*
Pick, heavy 8 gp  1d4 1d6 ×4  — 6 lb. Piercing
Rapier  20 gp 1d4 1d6 18-20/×2  — 2 lb. Piercing
Scimitar  15 gp 1d4 1d6 18-20/×2  — 4 lb. Slashing
Shield, heavy special 1d3 1d4 ×2  — special Bludgeoning
Spiked shield, heavy  special 1d4 1d6 ×2  — special Piercing
Trident 15 gp 1d6 1d8 ×2  10 ft.  4 lb. Piercing
Warhammer 12 gp 1d6 1d8 ×3  — 5 lb. Bludgeoning
// Two-Handed Melee Weapons
Falchion  75 gp 1d6 2d4 18-20/×2  — 8 lb. Slashing
Glaive4 8 gp  1d8 1d10  ×3  — 10 lb.  Slashing
Greataxe  20 gp 1d10  1d12  ×3  — 12 lb.  Slashing
Greatclub 5 gp  1d8 1d10  ×2  — 8 lb. Bludgeoning
Flail, heavy  15 gp 1d8 1d10  19-20/×2  — 10 lb.  Bludgeoning
Greatsword  50 gp 1d10  2d6 19-20/×2  — 8 lb. Slashing
Guisarme4 9 gp  1d6 2d4 ×3  — 12 lb.  Slashing
Halberd 10 gp 1d8 1d10  ×3  — 12 lb.  Piercing or slashing
Lance4  10 gp 1d6 1d8 ×3  — 10 lb.  Piercing
Ranseur4  10 gp 1d6 2d4 ×3  — 12 lb.  Piercing
Scythe  18 gp 1d6 2d4 ×4  — 10 lb.  Piercing or slashing
// Ranged Weapons
Longbow 75 gp 1d6 1d8 ×3  100 ft. 3 lb. Piercing
Arrows (20) 1 gp  — — — — 3 lb. —
Longbow, composite  100 gp  1d6 1d8 ×3  110 ft. 3 lb. Piercing
Arrows (20) 1 gp  — — — — 3 lb. —
Shortbow  30 gp 1d4 1d6 ×3  60 ft.  2 lb. Piercing
Arrows (20) 1 gp  — — — — 3 lb. —
Shortbow, composite 75 gp 1d4 1d6 ×3  70 ft.  2 lb. Piercing
Arrows (20) 1 gp  — — — — 3 lb. —
// Exotic Weapons  Cost  Dmg (S) Dmg (M) Critical  Range Increment Weight1 Type2
// Light Melee Weapons
Kama  2 gp  1d4 1d6 ×2  — 2 lb. Slashing
Nunchaku  2 gp  1d4 1d6 ×2  — 2 lb. Bludgeoning
Sai 1 gp  1d3 1d4 ×2  10 ft.  1 lb. Bludgeoning
Siangham  3 gp  1d4 1d6 ×2  — 1 lb. Piercing
// One-Handed Melee Weapons
Sword, bastard  35 gp 1d8 1d10  19-20/×2  — 6 lb. Slashing
Waraxe, dwarven 30 gp 1d8 1d10  ×3  — 8 lb. Slashing
Whip4 1 gp  1d23  1d33  ×2  — 2 lb. Slashing
// Two-Handed Melee Weapons
Axe, orc double5  60 gp 1d6/1d6 1d8/1d8 ×3  — 15 lb.  Slashing
Chain, spiked4  25 gp 1d6 2d4 ×2  — 10 lb.  Piercing
Flail, dire5  90 gp 1d6/1d6 1d8/1d8 ×2  — 10 lb.  Bludgeoning
Hammer, gnome hooked5 20 gp 1d6/1d4 1d8/1d6 ×3/×4 — 6 lb. Bludgeoning/Piercing
Sword, two-bladed5  100 gp  1d6/1d6 1d8/1d8 19-20/×2  — 10 lb.  Slashing
Urgrosh, dwarven5 50 gp 1d6/1d4 1d8/1d6 ×3  — 12 lb.  Slashing or piercing
// Ranged Weapons
Bolas 5 gp  1d33  1d43  ×2  10 ft.  2 lb. Bludgeoning
Crossbow, hand  100 gp  1d3 1d4 19-20/×2  30 ft.  2 lb. Piercing
Bolts (10)  1 gp  — — — — 1 lb. —
Crossbow, repeating heavy 400 gp  1d8 1d10  19-20/×2  120 ft. 12 lb.  Piercing
Bolts (5) 1 gp  — — — — 1 lb. —
Crossbow, repeating light 250 gp  1d6 1d8 19-20/×2  80 ft.  6 lb. Piercing
Bolts (5) 1 gp  — — — — 1 lb. —
Net 20 gp — — — 10 ft.  6 lb. —
Shuriken (5)  1 gp  1 1d2 ×2  10 ft.  ½ lb. Piercing
*/
};
