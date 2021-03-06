#!/bin/bash

CALCDEPS="${CLOSURELIB:=../closure-library}/closure/bin/calcdeps.py"

rm -f tudo.js tudo.temp.js

#${CALCDEPS} -i adiciona.js -i atualiza.js -i bonus.js -i carrega.js -i converte.js -i dom.js -i entradas.js -i eventos.js -i geracao.js -i personagem.js -i tabelas.js -i util.js -i tabelas_habilidades.js -i tabelas_geracao.js -i tabelas_feiticos.js -i dependencias.js -i estado.js -i entradas.js -i dom_planilha.js -p "${CLOSURELIB}"  -o script > tudo.temp.js
cat adiciona.js atualiza.js bonus.js carrega.js converte.js dom.js entradas.js eventos.js geracao.js personagem.js tabelas.js util.js tabelas_habilidades.js tabelas_geracao.js tabelas_feiticos.js dependencias.js estado.js entradas.js dom_planilha.js > tudo.js

# Here we change goog.writeScriptTag_ function so that it does not call doc.write
# since it gives us trouble in packed apps.

#sed -e 's/doc.write/var not_used = parseInt/g' tudo.temp.js > tudo.js && rm tudo.temp.js
