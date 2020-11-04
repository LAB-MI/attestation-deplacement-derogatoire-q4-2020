
# Générateur de cluster

fork LAB-MI/attestation-deplacement-derogatoire-q4-2020


## Informations

Ce patch permet de générer des attestations, sans perdre de temps à remplir ce satané formulaire.

Le qrcode contient l'heure de création du fichier, remplacée par l'heure de sortie - 5 minutes.

Les attestions générées sont donc prêtes à l'emploi et valables.


## Exemples :

*Bob va faire ses courses*

https://nicopowa.github.io/covid_rapide?name=bob&motif=achats


*Alice va au travail car c'est plus ou moins la seule activité autorisée*

https://nicopowa.github.io/covid_rapide?name=alice&motif=travail


## Mauvais exemples :

*Eve se promène avec une personne qui lui plaît depuis presque une heure
et souhaite prolonger cet instant de liberté de 45 minutes*

https://nicopowa.github.io/covid_rapide?name=eve&motif=sport_animaux&minutes=15


*M. Dupont aperçoit des agents de police en pleine frénésie de contrôle et n'a pas son attestation.*

*Pas de panique ! Il clique sur le raccourci et l'attestation valable s'affiche instantanément à l'écran.*


## Fonctionnalités

fork de la version officielle +

- antidatage
- petit décalage de texte très irritant
- dépendances non minifiées
- une icône tricolore
- pas trop testé, fonctionne avec navigateurs récents


## Installation

- pour gagner encore du temps on a zappé l'étape de build
- copier le dossier dans un serveur web
- créer des profils dans le dossier patch/profiles (voir default.json)


## Utilisation

- naviguer vers https://monserveur/covid_rapide?name={profil}&motif={motif}&minutes={minutes}

|Paramètre|Description|Défaut|Valeur|
|--|--|--|--|
|name|nom du profil|default|alice, bob, eve, ...
|motif|motif de sortie|achats|travail / achats / sante / famille / handicap / sport_animaux / convocation / missions / enfants|
|minutes|antidatage|10|entre 0 et beaucoup plus


## Raccourcis

Android
https://www.youtube.com/watch?v=CIsCf97-eiU


iOs
https://www.youtube.com/watch?v=te3kC5Y8lrc


## Hébergement

Facile !

- cliquer fork en haut à droite
- créer ou éditer des profils
- activer github pages (settings > options > github pages > source main > save)
- attendre quelques minutes
- naviguer vers https://moncompte.github.io/covid_rapide?...
- noter que les informations de profil sont publiques avec cette méthode


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