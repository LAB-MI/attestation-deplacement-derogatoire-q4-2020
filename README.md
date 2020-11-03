# Générateur de cluster
fork LAB-MI/attestation-deplacement-derogatoire-q4-2020

## Exemples :
*Bob va faire ses courses*
https://monserveur/covid_rapide/bob/achats

*Alice va au travail car c'est plus ou moins la seule activité autorisée*
https://monserveur/covid_rapide/alice/travail

## Informations
Ce patch permet de générer des attestations, sans perdre de temps à remplir ce satané formulaire.
Le qrcode contient l'heure de création du fichier, remplacée par l'heure de sortie - 5 minutes.
Les attestions générées sont donc prêtes à l'emploi et valables.

## Exemples ne respectant pas les règles :
*Eve se promène avec une personne qui lui plaît depuis presque une heure
et souhaite prolonger cet instant de liberté de 45 minutes*
https://monserveur/covid_rapide/eve/sport_animaux/15

*M. Dupont aperçoit des agents de police en pleine frénésie de contrôle et n'a pas son attestation.*
Pas de panique ! Il clique sur le raccourci et l'attestation valable s'affiche instantanément à l'écran.

## Installation
fork de la version officielle +
- antidatage
- petit décalage de texte très irritant
- dépendances non minifiées
- une icône tricolore
- pour gagner encore du temps on a zappé l'étape de compilation
- prêt à l'emploi
- copier le dossier dans un serveur web
- créer des profils dans le dossier patch/profiles (voir default.json)
- naviguer vers http(s)://monserveur/covid_rapide/{profil}/{motif}/{minutes}
- {motif} et {minutes} facultatifs
- valeurs par défaut : {motif} = "achats" && {minutes} = 10
- {motif} : travail  / achats  / sante / famille / handicap / sport_animaux / convocation / missions / enfants
- {minutes} : heure de sortie = heure du navigateur - {minutes} ;;; heure du qrcode = heure de sortie - 5
- debug && tests baclés, ok avec navigateur desktop récent, peut-être non fonctionnel sur iOs < 12, semble ok sur Android

## Responsabilité
Version o.0 MIT
Dimanche après-midi après une belle conversation Samedi nuit

À vos risques et périls, respect des distances sociales, maintenir l'économie, etc...

## Utilisation
URL TEST github pages
URL youtube raccourci iOs alice
URL youtube raccourci Android bob
