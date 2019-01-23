![Logo](img/youemo-ban.png)
--------
**Youmeo** est une application réalisée dans le cadre du cours *Urbanisation et gouvernance des SI*.

L'équipe qui a réalisé ce projet est composée de **Thibaut Lafon, Hugo Desbiolles et Mélissa L'Hénoret**.

| **Connexion**       | **Inscription**     | **Recherche Video** | **Video**           | **Playlist**        | **Mon compte**      | 
| :-----------------: | :-----------------: | :-----------------: | :-----------------: | :-----------------: | :-----------------: | 
| cell 1              | cell 2              | cell 2              | cell 1              | cell 2              | cell 2              |


Le projet est composé de 4 silos et un pilote.

Le Front a été développé en [Angular](https://angular.io/) 6 et le Backend en [NodeJS](https://nodejs.org/en/)

## Prérequis
1. Installer [nodeJS](https://nodejs.org/en/) 11
2. Installer [MongoDB](https://www.mongodb.com/fr) 4

## Installation
Dans un Terminal:
1. Cloner le projet 
```
git clone https://github.com/HugoDesb/youmeo.git
```
2. Installer les dépendances
```bash
cd angular-youmetu
npm install
```
## Exécution
1. Ouvrir un terminal dans le dossier angular-youmetu et lancer la commande : 
```bash
ng serve
```
2. puis ouvrir le navigateur a l'adresse http://localhost:4200/

## Admin
Pour créer un premier compte admin:
1. créer un premier utilisateur dans *Inscription*
2. Dans la base de données MongoDB dans le répertoire:
   * youmeo
   * users
   * changer le champ *admin* par *true*


