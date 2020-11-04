
# Générateur de cluster

fork LAB-MI/attestation-deplacement-derogatoire-q4-2020


## Informations

Ce patch permet de générer des attestations, sans perdre de temps à remplir ce satané formulaire.

Le qrcode contient l'heure de création du fichier, remplacée par l'heure de sortie - 5 minutes.

Les attestions générées sont donc prêtes à l'emploi et valables.


## Exemples :

*Bob va faire ses courses*

[attestation Bob](https://nicopowa.github.io/covid_rapide?lastname=Smith&firstname=Bob&birthday=01/01/1970&placeofbirth=Bob%27s%20hometown&address=1%20Bob%27s%20street&zipcode=75000&city=Bob%27s%20city&motif=achats&minutes=5)


*Alice va au travail car c'est plus ou moins la seule activité autorisée*

[attestation Alice](https://nicopowa.github.io/covid_rapide?lastname=Smith&firstname=Alice&birthday=01/01/1970&placeofbirth=Alice%27s%20hometown&address=1%20Alice%27s%20street&zipcode=75000&city=Alice%27s%20city&motif=travail&minutes=5)


## Mauvais exemples :

*Eve se promène avec une personne qui lui plaît depuis presque une heure
et souhaite prolonger cet instant de liberté de 45 minutes*

[attestation Eve](https://nicopowa.github.io/covid_rapide?lastname=Smith&firstname=Eve&birthday=01/01/1970&placeofbirth=Eve%27s%20hometown&address=1%20Eve%27s%20street&zipcode=75000&city=Eve%27s%20city&motif=sport_animaux&minutes=15)


*M. Dupont aperçoit des agents de police en pleine frénésie de contrôle et n'a pas son attestation.*

*Pas de panique ! Il clique sur le raccourci et l'attestation valable s'affiche instantanément à l'écran.*


## Fonctionnalités

fork de la version officielle + 

- automatisation
- antidatage
- petit décalage de texte très irritant
- dépendances non minifiées
- une icône tricolore
- pas trop testé, navigateurs récents


## Utilisation

- cliquer sur le lien ci-dessous
- remplir le formulaire une bonne fois pour toutes
- cliquer sur ok
- [iOs] revenir sur la page précédente
- ajouter un raccourci sur l'écran d'accueil

[c'est par ici](https://nicopowa.github.io/covid_rapide/patch/gen.html)


## Crédits

Voir repo officiel

https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020


## Responsabilité

Version o.0

Dimanche après-midi après une belle conversation Samedi nuit

Licence MIT

À vos risques et périls, respect des distances sociales, maintenir l'économie, etc...


## Reportage exclusif

Les courses de Bob

https://www.youtube.com/watch?v=ZD48f-rc59M