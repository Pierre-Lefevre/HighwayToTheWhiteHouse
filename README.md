# HighwayToTheWhiteHouse

## Installation de Solr

- Téléchargez la version 6.6.0 de Solr à cette adresse : http://archive.apache.org/dist/lucene/solr/6.6.0/
- Dézippez le fichier et copiez le dossier "solr-6.6.0" à la racine du projet
- Pour démarrer Solr, lancez  : `start_solr.bat`**
- Pour créer la collection, lancez : `create_collection.bat`**
- Solr est visible à l'adresse : http://localhost:8983/solr

## Lancement du serveur Node.js

- Lancez : `cd app`*
- Pour installer les dépendances, lancez : `npm install`
- Pour démarrer le serveur Node.js, lancez : `npm run start`
- L'application est visible à l'adresse : http://localhost:8080/

## Divers

- Pour scraper tout le site et alimenter directement Solr, lancez : `scrap.bat`**
- Pour arrêter Solr, lancez : `stop_solr.bat`**

** commandes à exécuter depuis la racine du projet
