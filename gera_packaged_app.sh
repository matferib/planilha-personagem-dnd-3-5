#!/bin/bash

# Converte a planilha se necessario
grep 'tudo\.js' planilha.html | grep -q '!--' && ./converte_planilha.sh || echo 'Conversão desnecessária'
./geratudo.sh && zip planilha.zip planilha.html tudo.js planilha.css manifest.json icon16.png icon128.png background.js 
