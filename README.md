# Clash of Friends
_Julien Biefer, Léo Cortès et Johanna Melly_   
_29 octobre 2018_

## Description du projet
Le but de notre réseau social est de mettre en relation des utilisateurs afin qu'ils puissent se souffleter dans diverses catégories.  
Un duel impliquerait deux utilisateurs qui se défieront dans une catégorie (ainsi qu'une sous-catégorie).

Les autres utilisateurs, observateurs de cette bataille, auront une période pour voter sur le contenu proposé par les deux duelistes et débattre via un système de commentaire, créé pour chaque dispute.

Un système d'amitié sera mis en place pour pouvoir filter le contenu présenté dans le fil d'actualité

Les catégories sont déterminées selon le type de document à fournir. Il existerait donc les catégories suivantes et éventuellement les sous-catégories :

* Texte  // _sous-catégories possibles basées sur le nombre de mots ou de chars_
* Photo (.jpg, .png,...) // _sous-catégories possibles : portrait, paysage, noir/blanc,..._
* GIF (.gif)
* .. Son ? Vidéo ?

Les thèmes des différentes luttes pourraient être déterminés par les utilisateurs ou proposés par l'application : humour, beauté, horreur, inspiration,...

Chaque utilisateur aurait un montant initial de point et ce dernier évoluerait selon les challenges gagnés ou perdus. Les points seraient

Un classement des utilisateurs pourra être établi sur tout le réseau social ou pour des catégories données.

Une page principale montrera les combats en cours ou passés.

Les utilisateurs auront une page de profile (« Mur ») où seront affiché leurs dernier combats ou les combats à venir, leur nombre de points, le nombre de joutes gagnées ou perdues, leur ratio victoire/défaite, nombre de relations,...

## Technologies utilisées

* Frontend : [React.js](https://reactjs.org)
* Backend : [Express.js](https://expressjs.com)
* Base de donnée : [MongoDB](https://www.mongodb.com)