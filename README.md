# 🗺️ SimuRoute

**SimuRoute** est une application web moderne de calcul d'itinéraires intelligents qui va bien au-delà d'un simple GPS. Elle intègre des fonctionnalités avancées comme l'analyse météorologique, les recommandations musicales et la gestion de trajets favoris pour offrir une expérience de voyage personnalisée et optimisée.

## ✨ Fonctionnalités Principales

### 🚗 **Calcul d'Itinéraires Multi-Modes**
- 🚀 **Mode Rapide** : Itinéraires optimisés pour le temps (autoroutes privilégiées)
- 🌱 **Mode Économique** : Routes les plus courtes pour économiser le carburant
- 🌸 **Mode Confort** : Trajets agréables évitant les autoroutes stressantes

### 📊 **Analyse Complète des Coûts**
- 💰 **Coûts détaillés** : Carburant, péages, usure du véhicule
- ⛽ **Consommation réelle** avec ajustements météorologiques
- 🌿 **Impact environnemental** : Émissions CO₂ calculées
- 📈 **Indicateurs de performance** par mode de conduite

### 🌤️ **Intégration Météorologique**
- 🌡️ **Conditions en temps réel** via OpenWeatherMap API
- 🔧 **Ajustements automatiques** de la consommation selon :
  - Température (chauffage/climatisation)
  - Conditions météo (pluie, neige, brouillard)
  - Force du vent
- 👁️ **Visibilité et sécurité** pour une conduite adaptée

### 🎵 **Recommandations Musicales Intelligentes**
- 🎶 **Playlists adaptées** au style de conduite
- ⏱️ **Durée optimisée** selon la longueur du trajet
- 🌦️ **Ambiances météo** (musique de pluie, sons d'été)
- 🎯 **Suggestions personnalisées** par énergie et genre

### ⭐ **Gestion des Trajets Favoris**
- 💾 **Sauvegarde** des itinéraires fréquents
- 📊 **Statistiques d'usage** et historique
- 🏷️ **Noms personnalisés** pour vos trajets
- 🔄 **Accès rapide** via interface dédiée

## 🛠️ Technologies Utilisées

### **Frontend**
- ⚛️ **React 19.1.0** - Interface utilisateur moderne
- 🗺️ **React Leaflet 5.0.0** - Cartes interactives OpenStreetMap
- 🎨 **CSS3** - Styles responsive et animations
- 📡 **Axios** - Communication API

### **Backend**
- 🟢 **Node.js** - Serveur JavaScript
- 🚀 **Express 5.1.0** - Framework web rapide
- 🔌 **CORS** - Gestion des requêtes cross-origin
- 🌐 **Axios** - Requêtes vers APIs externes

### **APIs Externes**
- 🗺️ **OSRM** - Calcul d'itinéraires open source
- 🌍 **Nominatim** - Géocodage OpenStreetMap
- ☁️ **OpenWeatherMap** - Données météorologiques
- 📍 **GraphHopper** - Routage alternatif (configurable)

## 🚀 Installation et Démarrage

### **Prérequis**
- Node.js >= 16.0.0
- npm >= 7.0.0

### **1. Cloner le projet**
```bash
git clone https://github.com/votre-username/SimuRoute.git
cd SimuRoute
```

### **2. Installation Backend**
```bash
cd backend
npm install
```

### **3. Installation Frontend**
```bash
cd ../frontend
npm install
```

### **5. Démarrage des Services**

**Terminal 1 - Backend :**
```bash
cd backend
node index.js
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📱 Exemple d'Utilisation

### **Calcul d'Itinéraire**
1. 📍 Saisissez votre **origine** et **destination**
2. 🎯 Choisissez votre **mode de conduite** (Rapide/Éco/Confort)
3. 🖱️ Cliquez sur **"Calculer"**
4. 📊 Consultez les **résultats détaillés** :
   - Distance et temps de trajet
   - Coûts complets (carburant, péages, usure)
   - Conditions météorologiques
   - Recommandations musicales

### **Trajets Favoris**
1. ⭐ Cliquez sur le bouton **étoile** en haut à droite
2. 👀 Parcourez vos **trajets sauvegardés**
3. 🖱️ **Sélectionnez** un favori pour l'utiliser
4. ➕ **Ajoutez** de nouveaux favoris via l'API

### **Modes de Conduite**

| Mode | Description | Optimisation | Usage |
|------|-------------|--------------|-------|
| 🚀 **Rapide** | Temps minimal | Autoroutes (70%) | Déplacements urgents |
| 🌱 **Économique** | Distance courte | Routes mixtes (50%) | Économies carburant |
| 🌸 **Confort** | Conduite relaxante | Routes secondaires (20%) | Balades touristiques |

## 🎨 Captures d'Écran

### Interface Principale
- 🗺️ Carte interactive avec tracé d'itinéraire
- 📝 Formulaire de saisie intuitif
- 📊 Panneau de résultats détaillés

### Fonctionnalités Avancées
- 🌤️ Widget météo intégré
- 🎵 Recommandations musicales
- ⭐ Panel de trajets favoris


## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Auteurs

- Projet réalisé dans le cadre du module Hub à Epitech par SILVA DA COSTA Josselino
