# HighwayToTheWhiteHouse

## Installation d'Elasticsearch

- Téléchargez la dernière version d'Elasticsearch à cette adresse : https://www.elastic.co/fr/downloads/elasticsearch
- Dézippez l'archive et déplacer le dossier "elasticsearch-5.6.2" à la racine du C:
- Ajouter "C:\elasticsearch-5.6.2\bin" (ou équivalent) au Path
- Pour démarrer le serveur, lancez : `elasticsearch`
- Elasticsearch est visible à l'adresse : http://localhost:9200/

## Lancement du serveur Node.js

- Lancez : `cd app`**
- Pour installer les dépendances, lancez : `npm install`
- Pour démarrer le serveur Node.js, lancez : `npm run start`
- L'application est visible à l'adresse : http://localhost:8080/

## Divers

- Pour convertir un fichier JSON Scrapy en JSON Elasticsearch, lancez (dans un bash) : `./prepareFactsToImport.sh facts.json > import.json`**
- Pour recharger toutes les données d'Elasticsearch, lancez (dans un bash) : `./reloadFactsInElastic.sh`**

** commandes à exécuter depuis la racine du projet
