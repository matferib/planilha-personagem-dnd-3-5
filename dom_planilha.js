// Este arquivo deve conter funções para criação de elementos Doms específicos para a planilha.

// Retorna um Div de feitico conhecido.
function CriaDomFeiticoConhecido(chave_classe, nivel, indice) {
  var div_feitico = CriaDiv();
  div_feitico.appendChild(CriaInputTexto(
      '',
      'input-feiticos-conhecidos-' + chave_classe + '-' + nivel + '-' + indice,
      'feiticos-conhecidos',
      AtualizaGeral));
  if (!tabelas_feiticos[chave_classe].precisa_conhecer) {
    div_feitico.appendChild(CriaBotao('-', null, null, {
      chave_classe: chave_classe,
      nivel: nivel,
      indice: indice,
      handleEvent: function () {
        var indice_a_remover = 0;
        gEntradas.feiticos_conhecidos[this.chave_classe][this.nivel].splice(this.indice, 1);
        // Arruma todos os slots de nivel maior ou igual.
        var slots_classe = gEntradas.slots_feiticos[this.chave_classe];
        for (var nivel in slots_classe) {
          if (nivel < this.nivel) {
            continue;
          }
          // Ajusta slots.
          slots_classe[nivel].forEach(function(slot, indice_slot) {
            if (slot.nivel == this.nivel && slot.indice >= this.indice && slot.indice > 0) {
              --slot.indice;
            }
          }.bind(this));
          // Ajusta slot de dominio e especializados (se houver).
          ['slots_feiticos_dominio', 'slots_feiticos_especializados'].forEach(function(tipo_slot) {
            var slot_classe = gEntradas[tipo_slot][this.chave_classe];
            if (slot_classe != null) {
              var slot = slot_classe[this.nivel];
              if (slot != null &&
                  slot.nivel == this.nivel &&
                  slot.indice >= this.indice &&
                  slot.indice > 0) {
                --slot.indice;
              }
            }
          });
          // Ajusta o slot specializado, se houver.
        }
        AtualizaGeralSemLerEntradas();
      }
    }));
  }
  div_feitico.appendChild(CriaBr());
  return div_feitico;
}

// Cria o esqueleto de um nível de slots de feitiço.
function CriaDomSlotsNivel(chave_classe, nivel, slots) {
  var precisa_conhecer = tabelas_feiticos[chave_classe].precisa_conhecer;
  var div_nivel = CriaDiv();
  div_nivel.appendChild(
      CriaSpan('Nível ' + nivel + ' (CD ' + slots.cd + '):'));
  div_nivel.appendChild(CriaBr());
  // Este dom so deve ter os doms slots e mais nada.
  div_nivel.appendChild(CriaDiv('div-feiticos-slots-' + chave_classe + '-' + nivel));
  return div_nivel;
}

// Cria um slot de feitico, que pode conter o select ou não.
function CriaDomSlotFeitico(precisa_memorizar, chave_classe, nivel, indice, conhecidos, slots) {
  var dom_slot = precisa_memorizar ? CriaDiv() : CriaSpan();
  // Adiciona os inputs de indices.
  if (precisa_memorizar) {
    dom_slot.appendChild(CriaSpan(
        '',
        'span-feiticos-slots-' + chave_classe + '-' + nivel + '-' + indice,
        'span-feiticos-slots-' + chave_classe + '-' + nivel));
    var select = CriaSelect(
        'input-feiticos-slots-' + chave_classe + '-' + nivel + '-' + indice,
        'feiticos-slots-' + chave_classe + '-' + nivel + ' feiticos-slots',  // Duas classes.
        AtualizaGeral);
    //PopulaSelectComOptGroup(conhecidos, select);
    //var slot_feitico = slots.feiticos[indice];
    //SelecionaValor(
    //    slot_feitico.nivel_conhecido + '-' + slot_feitico.indice_conhecido,
    //    select);
    dom_slot.appendChild(select);
  }

  // Cria o input de gasto.
  dom_slot.appendChild(CriaInputCheckbox(
      //slots.feiticos[indice].gasto,
      false,
      'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-' + indice,
      'feiticos-slots-gastos',
      ClickGastarFeitico));

  return dom_slot;
}

// Cria o dom para um slot de feitico de dominio.
function CriaDomSlotFeiticoDominio(chave_classe, nivel, conhecidos, slots) {
  var div_slot = CriaDiv();
  div_slot.appendChild(CriaSpan('D:'));
  var select = CriaSelect(
      'input-feiticos-slots-' + chave_classe + '-' + nivel + '-dom',
      'feiticos-slots',
      AtualizaGeral);
  PopulaSelectComOptGroup(conhecidos, select);
  SelecionaValor(//slots.feitico_dominio.indice_conhecido, select);
      slots.feitico_dominio.nivel_conhecido + '-' + slots.feitico_dominio.indice_conhecido,
      select);
  div_slot.appendChild(select);
  div_slot.appendChild(CriaInputCheckbox(
      slots.feitico_dominio.gasto,
      'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-dom',
      'feiticos-slots-gastos',
      ClickGastarFeitico));
  div_slot.appendChild(CriaBr());
  return div_slot;
}

// Cria o dom para um slot de feitico de dominio.
function CriaDomSlotFeiticoEspecializado(chave_classe, nivel, conhecidos, slots) {
  var div_slot = CriaDiv();
  div_slot.appendChild(CriaSpan('E:'));
  var select = CriaSelect(
      'input-feiticos-slots-' + chave_classe + '-' + nivel + '-esp',
      'feiticos-slots',
      AtualizaGeral);
  PopulaSelectComOptGroup(conhecidos, select);
  SelecionaValor(
      slots.feitico_especializado.nivel_conhecido + '-' + slots.feitico_especializado.indice_conhecido,
      select);
  div_slot.appendChild(select);
  div_slot.appendChild(CriaInputCheckbox(
      slots.feitico_especializado.gasto,
      'input-feiticos-slots-gastos-' + chave_classe + '-' + nivel + '-esp',
      'feiticos-slots-gastos',
      ClickGastarFeitico));
  div_slot.appendChild(CriaBr());
  return div_slot;
}
