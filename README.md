# 🇫🇷 PDF Automation Tool - Triumph International

<div align="center">
  <img src="assets/images/triumph-international-logo-png-transparent.png" alt="Triumph International" width="200" style="margin-right: 20px;">
  <img src="assets/images/maroc modis.png" alt="Maroc Modis" width="200">
</div>

<div align="center">
  <h1>🚀 Application Web de Traitement PDF Automatique</h1>
  <p><strong>Détection intelligente et modification automatique des factures PDF</strong></p>
  <p>🏭 <strong>Triumph International</strong> & 🏭 <strong>Maroc Modis</strong></p>
</div>

---

## 📋 Table des Matières

- [✨ Fonctionnalités](#-fonctionnalités)
- [🎨 Interface Utilisateur](#-interface-utilisateur)
- [🔧 Technologies](#-technologies)
- [📁 Structure du Projet](#-structure-du-projet)
- [🚀 Installation](#-installation)
- [🎯 Utilisation](#-utilisation)
- [📊 Captures d'Écran](#-captures-décran)
- [🏢 Entreprises](#-entreprises)
- [📞 Contact](#-contact)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## ✨ Fonctionnalités

### 🎯 **Traitement PDF Intelligent**
- 🔍 **Détection automatique** de textes spécifiques dans les PDFs
- ✏️ **Message personnalisable** - Saisissez votre propre texte à ajouter
- 📐 **Placement précis** selon les coordonnées détectées
- 📦 **Traitement par lots** de plusieurs fichiers simultanément
- 📖 **Extraction de texte** avec PDF.js pour analyse intelligente

### 🎨 **Interface Moderne**
- 🗂️ **Navigation par onglets** avec transitions fluides
- 🛒 **Panier de téléchargement** indépendant et visible
- 📱 **Design responsive** adapté à tous les appareils
- 🇫🇷 **Thème français** (bleu, blanc, rouge) corporate

### 🛠️ **Fonctionnalités Avancées**
- 🎯 **Drag & Drop** intuitif pour l'upload de fichiers
- ✏️ **Message personnalisable** - Saisissez votre propre texte à ajouter
- ⏱️ **Barre de progression** en temps réel
- 🚨 **Gestion d'erreurs** robuste avec feedback utilisateur
- 🔄 **Téléchargement séquentiel** pour éviter les conflits

---

## 🎨 Interface Utilisateur

### 🏠 **Section Accueil**
<div align="center">
  <img src="assets/images/screenshot-home.png" alt="Accueil Triumph" width="100%">
  <p><em>Page d'accueil avec présentation Triumph International</em></p>
</div>

### 📤 **Section Traitement PDF**
<div align="center">
  <img src="assets/images/screenshot-upload.png" alt="Traitement PDF" width="100%">
  <p><em>Interface de traitement avec upload et progression</em></p>
</div>

### 🛒 **Panier de Téléchargement**
<div align="center">
  <img src="assets/images/screenshot-cart.png" alt="Panier" width="50%">
  <p><em>Panier indépendant avec fichiers traités</em></p>
</div>

---

## 🔧 Technologies

### 🎨 **Frontend**
- **HTML5** - Structure sémantique moderne
- **CSS3** - Animations et design responsive
- **JavaScript ES6+** - Logique applicative moderne
- **Font Awesome** - Icônes professionnelles

### 📚 **Bibliothèques**
- **PDF-lib** - Manipulation et modification des PDFs
- **PDF.js** - Extraction et analyse de texte
- **Modern CSS** - Grid et Flexbox pour le layout

### 🎯 **Fonctionnalités Techniques**
- **Traitement côté client** - Aucun serveur requis
- **API File moderne** - Gestion des uploads
- **Blob URLs** - Téléchargement sécurisé
- **Animations CSS** - Transitions fluides

---

## 📁 Structure du Projet

```
projet/
├── 📄 index.html                 # Interface principale
├── 🎨 style.css                  # Styles français
├── ⚡ script.js                  # Logique PDF
├── 📋 facture.py                 # Script original
├── 📚 LIENS_PYTHON_WEB.md       # Documentation technique
├── 📖 README.md                  # Ce fichier
├── 📦 assets/
│   └── 🖼️ images/               # Logos Triumph & Maroc Modis
│       ├── triumph-international-logo-png-transparent.png
│       └── maroc modis.png
└── 📋 requirements.txt           # Dépendances Python
```

---

## 🚀 Installation

### 📋 **Prérequis**
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- **Aucun serveur requis** - fonctionne entièrement côté client

### ⚡ **Utilisation Rapide**

1. **Clonez le repository**
```bash
git clone https://github.com/votre-nom-utilisateur/pdf-automation-triumph.git
cd pdf-automation-triumph
```

2. **Ouvrez l'application**
```bash
# Double-cliquez sur index.html ou ouvrez dans le navigateur
open index.html
```

3. **Utilisez l'application**
- Glissez-déposez vos PDFs
- Traitement automatique
- Téléchargement des résultats

---

## ✏️ Message Personnalisé

### 🎯 **Fonctionnalité de Personnalisation**

L'application vous permet de **saisir votre propre message** à ajouter aux PDFs au lieu d'utiliser le texte par défaut "(BIN : XXXXX)".

### 📝 **Comment utiliser**

1. **Sélectionnez vos fichiers PDF** (comme d'habitude)
2. **Zone de configuration** apparaît automatiquement
3. **Saisissez votre message** dans le champ dédié
4. **Laissez vide** pour utiliser le message par défaut
5. **Traitez les fichiers** - votre message personnalisé sera ajouté

### 🎨 **Exemples de Messages**

```text
Message par défaut : (BIN : XXXXX)
Vos messages :
- (APPROUVÉ : 2024-01-15)
- (TRAITÉ PAR : Service Comptabilité)
- (VALIDÉ : Direction Financière)
- (ARCHivé : DOC-2024-001)
```

### ⚙️ **Caractéristiques Techniques**

- **Longueur maximale** : 50 caractères
- **Position automatique** : Juste en dessous du texte détecté
- **Style identique** : Police, taille et couleur cohérentes
- **Sauvegarde automatique** : Message conservé pendant la session

---

## 🎯 Utilisation

### 📤 **Workflow Complet**

1. **🏠 Accueil** → Découvrez les fonctionnalités
2. **📤 Upload** → Glissez vos fichiers PDF
3. **✏️ Configuration** → Saisissez votre message personnalisé (optionnel)
4. **⚙️ Traitement** → Détection et modification automatiques
5. **🛒 Panier** → Téléchargement des fichiers modifiés
6. **📞 Contact** → Informations Triumph International

### 🎨 **Fonctionnalités Clés**

- 🔍 **Détection intelligente** des textes spécifiques
- ✏️ **Message personnalisable** - Saisissez votre propre texte
- 📐 **Placement automatique** selon vos préférences
- 🛒 **Panier de téléchargement** indépendant
- 📱 **Design responsive** pour mobile et desktop

---

## 📊 Captures d'Écran

### 🏠 **Accueil - Triumph International**
<div align="center">
  <img src="assets/images/screenshot-home.png" alt="Accueil" width="100%">
</div>

### 📤 **Traitement PDF - Interface Moderne**
<div align="center">
  <img src="assets/images/screenshot-upload.png" alt="Upload" width="100%">
</div>

### 🛒 **Panier - Téléchargements**
<div align="center">
  <img src="assets/images/screenshot-cart.png" alt="Panier" width="50%">
</div>

---

## 🏢 Entreprises

### 🏭 **Triumph International**
<div align="center">
  <img src="assets/images/triumph-international-logo-png-transparent.png" alt="Triumph" width="300">
</div>

**Leader mondial de la lingerie fine depuis 1886**

- 📅 **Fondation** : 1886 à Heubach, Allemagne
- 🌍 **Présence** : 120+ pays, 45 000+ points de vente
- 🏢 **Siège** : Munich, Allemagne
- ✨ **Innovation** : Technologies textiles de pointe
- 💚 **Engagement** : Durabilité et autonomisation des femmes

### 🏭 **Maroc Modis**
<div align="center">
  <img src="assets/images/maroc modis.png" alt="Maroc Modis" width="300">
</div>

**Partenaire stratégique pour l'Afrique du Nord**

- 📍 **Localisation** : Maroc, Afrique du Nord
- 🤝 **Partenariat** : Partenaire officiel Triumph International
- 📈 **Expertise** : Distribution et développement commercial
- 🌍 **Marché** : Développement nord-africain

---

## 📞 Contact

### 🏢 **Informations**

| Service | Contact | Description |
|---------|---------|-------------|
| 📞 **Support** | +33 1 42 86 15 00 | Support technique |
| 📧 **Email** | contact@triumph.com | Demandes générales |
| 🌐 **Site** | www.triumph.com | Site officiel |
| 📍 **Bureau** | 75008 Paris, France | Siège français |

### 📍 **Localisation**
<div align="center">
  <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.142103045!2d2.2945!3d48.8566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sTriumph%20International!5e0!3m2!1sfr!2sfr!4v1640000000000!5m2!1sfr!2sfr" width="600" height="300" style="border:0; border-radius: 10px;" allowfullscreen="" loading="lazy"></iframe>
</div>

### 📱 **Réseaux Sociaux**
<div align="center">
  <a href="https://www.instagram.com/triumph_lingerie" target="_blank">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram">
  </a>
  <a href="https://www.facebook.com/TriumphLingerie" target="_blank">
    <img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" alt="Facebook">
  </a>
  <a href="https://www.linkedin.com/company/triumph-international" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</div>

---

## 🤝 Contribution

### 🚀 **Comment Contribuer**

1. 🍴 **Fork** le projet
2. 🌿 **Créez** une branche (`git checkout -b feature/AmazingFeature`)
3. 💾 **Committez** (`git commit -m 'Add some AmazingFeature'`)
4. 📤 **Pushez** (`git push origin feature/AmazingFeature`)
5. 🔄 **Ouvrez** une Pull Request

---

## 📄 Licence

**MIT License** - Voir le fichier LICENSE pour plus de détails.

---

<div align="center">
  <p><strong>🇫🇷 Développé avec ❤️ par Triumph International & Maroc Modis</strong></p>
  <p>🚀 Automatisation documentaire pour un avenir plus efficace</p>
</div>
