# Générateur de certificat de déplacement

## Développer

### Installer le projet

```console
git clone https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020.git
cd attestation-deplacement-derogatoire-q4-2020
npm i
npm start
```

## Générer et tester le code de production

### Tester le code de production en local

#### Générer le code de production pour tester que le build fonctionne en entier

```console
npm run build:dev
```

#### Tester le code de production en local

```console
npx serve dist
```

Et visiter http://localhost:5000

Le code à déployer sera le contenu du dossier `dist`

## Crédits

Ce projet a été réalisé à partir d'un fork du dépôt [deplacement-covid-19](https://github.com/nesk/deplacement-covid-19) lui-même réalisé à partir d'un fork du dépôt [covid-19-certificate](https://github.com/nesk/covid-19-certificate) de [Johann Pardanaud](https://github.com/nesk). Le générateur d'attestation pour le [couvre-feu](https://github.com/LAB-MI/attestation-couvre-feu-covid-19) est postérieur à [deplacement-covid-19](https://github.com/nesk/deplacement-covid-19) et antérieur au dépôt actuel, il ne doit plus être utilisé.

Ce générateur est par ailleurs utilisable [en ligne](https://media.interieur.gouv.fr/deplacement-covid-19).

Les modèles d'attestation sont disponibles [ICI](https://www.gouvernement.fr/info-coronavirus/ressources-a-partager) et [LA](https://www.interieur.gouv.fr/Actualites/L-actu-du-Ministere/Attestations-de-deplacement).

Les projets open source suivants ont été utilisés pour le développement de ce
service :

- [PDF-LIB](https://pdf-lib.js.org/)
- [qrcode](https://github.com/soldair/node-qrcode)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/license)
