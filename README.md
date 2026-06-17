# Transport en Commun — Application Mobile

Application **React Native / Expo** en **TypeScript**, stylée avec **NativeWind**
(Tailwind CSS pour React Native) d'après le **design system UrbanFlow**, consommant
l'API REST `transport-api`. Réalisée d'après le cahier des charges « Application
Mobile de Transport en Commun ».

## Stack technique

| Domaine | Choix |
|---------|-------|
| Langage | TypeScript (strict) |
| Framework | React Native + Expo (SDK 55) |
| Styles | NativeWind 4 (Tailwind) — design system UrbanFlow, police **Outfit**, mode sombre |
| Navigation | React Navigation 7 (tabs + stacks, typée) |
| Formulaires | react-hook-form |
| Auth / stockage sécurisé | JWT + expo-secure-store |
| Géolocalisation | expo-location |
| Icônes | @expo/vector-icons (MaterialCommunityIcons) |

### Design system (design-system.json)

Les tokens sont mappés dans `tailwind.config.js` : couleur primaire **violet `#6912E2`**,
neutres Apple-style (`background`/`subtle`/`card`/`border`/`ink`), sémantiques
`success`/`warning`/`error`/`info`, rayons (`sm`→`xl`), et la police **Outfit**
(4 graisses chargées via `@expo-google-fonts/outfit`, classes `font-sans` /
`font-sans-medium` / `font-sans-semibold` / `font-sans-bold`). Le mode sombre
réutilise la même palette primaire sur des neutres sombres.

## Prérequis

- Node.js 18+
- L'API `transport-api` lancée (`npm run dev` dans `../transport-api`, port 3000)
- L'app **Expo Go SDK 55** (la version actuelle du store) sur votre téléphone,
  ou un simulateur iOS / émulateur Android

## Installation

```bash
cd transport-mobile
npm install --legacy-peer-deps
```

## Configuration de l'URL de l'API

Par défaut l'app pointe sur `http://localhost:3000` (`app.json` → `expo.extra.apiUrl`).

> ⚠️ Sur un **téléphone physique** avec Expo Go, `localhost` désigne le téléphone,
> pas votre ordinateur. Indiquez l'IP LAN de votre machine :

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:3000 npx expo start
```

(Trouvez votre IP avec `ipconfig getifaddr en0` sur macOS.)

## Lancement

```bash
npm start          # puis 'i' (iOS), 'a' (Android), ou scan du QR code
npm run ios
npm run android
```

## Comptes de test

| Email | Mot de passe |
|-------|--------------|
| alice@mail.com | password123 |
| bob@mail.com | secret456 |

## Couverture du cahier des charges

### 2.1 Planification de trajets — onglet **Trajets**
- 📍 « Partir de ma position » → arrêt le plus proche via `expo-location` + `GET /stops/nearest`
- Champs **départ** / **arrivée** alimentés depuis la liste des arrêts (`GET /stops?q=`)
- Bascule **Départ à / Arrivée à** + sélection de l'heure (`DateTimePicker`)
- Détail du trajet : étapes, durée, numéros de ligne, arrêts intermédiaires (`GET /journeys`)

### 2.2 Suivi des véhicules en temps réel — onglet **Temps réel**
- **Bouton dédié** « Actualiser » (rafraîchissement manuel, pas d'auto-refresh)
- Filtrage par **type** (métro, bus, tram, RER) et par **ligne** (`GET /vehicles?type=&lineId=`)
- Indicateur visuel d'état : 🟢 à l'heure · 🟠 retardé · 🔴 supprimé

### 2.3 Horaires dynamiques — fiche **Arrêt**
- Prochains passages toutes lignes confondues (`GET /stops/:id/departures`)
- Compteur **« dans X min »** mis à jour en continu (composant `Countdown`)
- Incidents remontés par les administrateurs (`GET /incidents?stopId=`)

### 2.4 Gestion du compte — onglet **Compte**
- Inscription email + mot de passe (`POST /auth/register`)
- Connexion → **JWT stocké via expo-secure-store** (`POST /auth/login`)
- Profil : modification des informations personnelles (`PUT /users/me`)
- Favoris (`/users/me/favorites`) + déconnexion

### 5. Sécurité
- JWT 7 jours (géré côté serveur), header `Authorization: Bearer <token>` sur les routes protégées
- Token en stockage sécurisé (Keychain / Keystore) via `expo-secure-store`, jamais en clair
- Restauration de session au démarrage + sign-out automatique si le token est invalide

### 6. UX / UI
- **Palette de couleurs par ligne** (couleur fournie par l'API, ex. jaune Ligne 1)
- **Icônes standardisées par type** de transport
- **Mode sombre** (suivi système ou forcé, persistant)
- **Indicateurs de statut colorés** 🟢 🟠 🔴

## Architecture

```
src/
├── api/          # client fetch + endpoints (1 fonction par route)
├── context/      # AuthContext (JWT) · ThemeContext (dark mode)
├── navigation/   # RootNavigator → AuthStack | MainTabs (+ stacks)
├── theme/        # métadonnées types de transport, statuts, couleurs
├── utils/        # helpers de temps (countdown, durée, horloge)
├── components/   # UI réutilisable (Button, Card, LineBadge, StatusBadge…)
└── screens/      # auth · journey · vehicles · stops · account
```
