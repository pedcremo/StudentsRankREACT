#!/bin/bash
#A PARTIR DE LA LINIA 20 COMENÇA EL NOM DEL PRIMER ESTUDIANT QUAN EXTRAIEM TEXT AMB pdftotext i FEM NETEJA
ESTUDIANTS_INDEX=19
#ENS QUEDEM AMB NOM ARXIU SENSE EXTENSIO
PDFFILE=`echo "$1" | cut -d'.' -f1`
#ESBORREM CONTINGUT I DIRECTORI
rm -rf output
#CREEM CARPETA SI NO EXISTEIX
mkdir -p output
#EXTRAIEM TEXT EN PDFFILE.txt
pdftotext $PDFFILE.pdf
#VOLQUEM TOTES LES IMATGES TROBADES AL PDF EN CARPETA output
pdfimages -j $PDFFILE.pdf output/img
#EXTRAIEM TEXT DEL PDF I EL GUARDEM EN UN ARXIU DES DEL PRIMER NOM ALUMNE. FEM NETEJES I SUBSTITUCIONS VARIES
TEXT=`cat $PDFFILE.txt|sed -e ':a' -e 'N' -e '$!ba' -e 's/\n\n/:/g' -e 's/\n/ /g' | tr : '\n'|sed  "1,$ESTUDIANTS_INDEX d" > /tmp/rre.txt`
 
let i=1 #PUNTER A NOM ALUMNE EN /tmp/rre.txt

for d in output/*.jpg; do
 #PER CADA JPG DEL DIRECTORI EN EL AWK ACCEDIM A LA LINIA QUE COINCIDIRA AMB NOM ESTUDIANT. HEM FACILITAT CORRELACIO EN $TEXT
 NOM_ARXIU=$(awk -v "INDEX=$i" 'NR==INDEX' /tmp/rre.txt)
 #Si topem amb un alumne sense foto
 while [[ $NOM_ARXIU == Fotograf* ]]
 do
    #Avancem una linia cap davant
    ((++i))    
    #Creem una imatge transparent per a eixe alumne amb convert de imagemagick
    convert -size 64x64 xc:transparent "output/$(awk -v "INDEX=$i" 'NR==INDEX' /tmp/rre.txt).jpg"
    #Avancem una linia cap davant
    ((++i))
    NOM_ARXIU=$(awk -v "INDEX=$i" 'NR==INDEX' /tmp/rre.txt)
 done
      
 mv $d "output/$(awk -v "INDEX=$i" 'NR==INDEX' /tmp/rre.txt).jpg" 
 ((++i))

done
#ESBORREM TOT DINS OUTPUT MENYS ELS JPG
find output/ -type f ! -name '*.jpg' -delete
