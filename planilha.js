goog.require('goog.dom');

// Remove a classe mais recente do personagem.
function RemoveClasse() {
	var div_classes = goog.dom.getElement("classes");
	if (div_classes.childNodes.length == 1) return;
	div_classes.removeChild(div_classes.lastChild);
}

// Sempre que uma mudanca ocorrer, esta funcao sera responsavel por atualizar
// os dados da planilha.
function AtualizaGeral() {
	LeEntradas();
	ConverteEntradasParaPersonagem();
	AtualizaTamanho();
	AtualizaModificadoresAtributos();
	AtualizaAtaque();
	AtualizaDefesa();
	AtualizaSalvacoes();
}

// Passa os valoes da entrada para o personagem.
function ConverteEntradasParaPersonagem() {
	personagem.nome = entradas.nome;
	personagem.raca = entradas.raca;
	personagem.alinhamento = entradas.alinhamento;
	for (var classe in personagem.classes) {
		personagem.classes[classe] = 0;
	}
	for (var i = 0; i < entradas.classes.length; ++i) {
		personagem.classes[entradas.classes[i].classe] += entradas.classes[i].nivel;
	}
	for (var atributo in personagem.atributos) {
		personagem.atributos[atributo].valor = entradas[atributo];
	}
	personagem.armadura = entradas.armadura;
}

// Atualiza o tamanho em funcao da raca.
function AtualizaTamanho() {
	// Busca o modificador de tamanho da raca.
	personagem.tamanho.categoria =
	 	tabelas_raca[personagem.raca].tamanho;
	personagem.tamanho.modificador_ataque_defesa =
		tabelas_tamanho[personagem.tamanho.categoria].ataque_defesa;
	ImprimeSinalizado(
			personagem.tamanho.modificador_ataque_defesa,
			goog.dom.getElementsByClass(TAMANHO_MOD_ATAQUE_DEFESA));
	goog.dom.getElement(TAMANHO).innerText =
	 		tabelas_tamanho[personagem.tamanho.categoria].nome;
}

// Atualiza todos os modificadores dos atributos bases (for, des, con, int, sab, car),
// a raca, class etc.
function AtualizaModificadoresAtributos() {
	// busca a raca e seus modificadores.
	var modificadores_raca = tabelas_raca[personagem.raca].atributos;

	// Busca cada elemento das estatisticas e atualiza modificadores.
	for (var habilidade in personagem.atributos) {
		// modificador racial.
		if (modificadores_raca[habilidade]) {
			var modificador_racial = modificadores_raca[habilidade];
			personagem.atributos[habilidade].valor += modificador_racial;
			// Escreve o modificador racial.
			ImprimeSinalizado(
					modificador_racial,
					goog.dom.getElement(habilidade + MOD_RACIAL));
		} 
		else {
			ImprimeNaoSinalizado('', goog.dom.getElement(habilidade + MOD_RACIAL));
		}

		// Escreve o valor total.
		ImprimeNaoSinalizado(
				personagem.atributos[habilidade].valor, 
				goog.dom.getElement(habilidade + VALOR_TOTAL));

		// modificador da habilidade.
		personagem.atributos[habilidade].modificador = 
			Math.floor((personagem.atributos[habilidade].valor - 10) / 2);
		// Escreve o modificador.
		ImprimeSinalizado(
				personagem.atributos[habilidade].modificador,
				goog.dom.getElementsByClass(habilidade + MOD_TOTAL));
	}
}

// Atualiza os diversos tipos de ataques lendo a classe e os modificadores relevantes. 
function AtualizaAtaque() {
	var bba = 0;
	for (var classe in personagem.classes) {
		bba += tabelas_bba[classe](personagem.classes[classe]);
	}
	ImprimeSinalizado(bba, goog.dom.getElementsByClass("bba"));
	ImprimeSinalizado(
			bba + personagem.atributos.forca.modificador + 
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElement(BBA_CORPO_A_CORPO));
	ImprimeSinalizado(
			bba + personagem.atributos.destreza.modificador +
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElement(BBA_DISTANCIA));
}

// Atualiza os varios tipos de defesa lendo tamanho, armadura e modificadores relevantes.
function AtualizaDefesa() {
	ImprimeSinalizado(tabelas_armaduras[personagem.armadura].bonus,
			              goog.dom.getElementsByClass(AC_ARMADURA));
	// AC normal.
	ImprimeNaoSinalizado(
			10 + personagem.atributos.destreza.modificador +
		      tabelas_armaduras[personagem.armadura].bonus +
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElementsByClass(CA_NORMAL));
	// AC surpreso.
	ImprimeNaoSinalizado(
			10 + personagem.tamanho.modificador_ataque_defesa + 
		      tabelas_armaduras[personagem.armadura].bonus,
			goog.dom.getElementsByClass(CA_SURPRESO));
	// AC toque.
	ImprimeNaoSinalizado(
			10 + personagem.atributos.destreza.modificador + 
					personagem.tamanho.modificador_ataque_defesa, 
			goog.dom.getElementsByClass(CA_TOQUE));
}

// Atualiza as salvacoes, calculando o bonus base de acordo com a classe e
// modificando pelo atributo relevante.
function AtualizaSalvacoes() {
	var habilidades_salvacoes = {
		fortitude: 'constituicao',
		reflexo: 'destreza',
		vontade: 'sabedoria'
	};
	for (var tipo_salvacao in habilidades_salvacoes) {
		var valor_base = 0;
		for (var classe in personagem.classes) {
			valor_base += 
				tabelas_salvacao[classe][tipo_salvacao](personagem.classes[classe]);
		}
		var habilidade_modificadora = habilidades_salvacoes[tipo_salvacao];
		var modificador_atributo = 
			personagem.atributos[habilidade_modificadora].modificador;
		personagem.salvacoes[tipo_salvacao] = valor_base + modificador_atributo;
		ImprimeNaoSinalizado(
				valor_base,
				goog.dom.getElement(tipo_salvacao + VALOR_BASE));
		ImprimeSinalizado(
				personagem.salvacoes[tipo_salvacao],
				goog.dom.getElement(tipo_salvacao + MOD_TOTAL));
	}
}
