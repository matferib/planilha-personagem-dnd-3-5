#!/bin/bash
# Alterna planilha.html entre versao compilada e nao compilada.

sed planilha.html -e 's/<script type/<\!--scriptian type/' -e 's/<\/script>/<\/scriptian-->/' -e 's/\!\-\-script type/script type/' -e 's/script\-\-/script/' -e 's/scriptian/script/g' > planilha.html.temp && \

mv planilha.html.temp planilha.html
