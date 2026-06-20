# 🎭 MemeHub — Générateur de Mèmes

> Mini-projet d'admission B.Eng.3/M.Eng.1 — SUPINFO

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql)
![MinIO](https://img.shields.io/badge/MinIO-S3-C72E49?logo=minio)

## 📌 Description

MemeHub est une application web full-stack permettant de créer, personnaliser et partager des mèmes. L'utilisateur peut télécharger une image, ajouter du texte personnalisable, déplacer le texte librement sur le canvas, et sauvegarder ses créations dans une galerie.

## 🚀 Fonctionnalités

- 📤 **Upload d'images** par clic ou drag & drop
- ✏️ **Éditeur Canvas** avec aperçu en temps réel
- 🖱️ **Texte déplaçable** à la souris librement sur l'image
- 🎨 **Personnalisation** : police, couleur, taille, ombre, contour
- 💾 **Sauvegarde** dans MinIO (stockage objet S3)
- 🖼️ **Galerie** des mèmes créés avec téléchargement et suppression
- 📥 **Téléchargement** local du mème en PNG

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Éditeur | HTML5 Canvas API |
| Backend | Node.js + Express |
| Stockage fichiers | MinIO (S3-compatible) |
| Base de données | PostgreSQL |
| Upload | Multer (memoryStorage) |

## 📐 Architecture

```
meme-generator/
├── backend/
│   ├── config/
│   │   ├── minio.js        # Connexion MinIO
│   │   └── database.js     # Connexion PostgreSQL
│   ├── controllers/
│   │   └── memeController.js
│   ├── middlewares/
│   │   └── upload.js       # Multer
│   ├── routes/
│   │   └── memeRoutes.js
│   └── server.js
└── frontend/
    └── src/
        ├── components/     # Navbar, Canvas, Controls, Gallery
        ├── hooks/          # useMemeEditor (logique Canvas)
        ├── pages/          # EditorPage, GalleryPage
        └── services/       # api.js (appels HTTP)
```

## ⚙️ Installation

### Prérequis
- Node.js v18+
- PostgreSQL
- MinIO (via Docker)

### 1. Cloner le projet
```bash
git clone https://github.com/idanass/meme-generator.git
cd meme-generator
```

### 2. Lancer MinIO
```bash
docker run -d --name minio -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  quay.io/minio/minio server /data --console-address ":9001"
```

### 3. Configurer le backend
```bash
cd backend
cp .env.example .env  # Remplir les variables
npm install
npm run dev
```

### 4. Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Accéder à l'application
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000/api
- MinIO Console : http://localhost:9001

## 📡 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Vérification serveur |
| GET | `/api/memes` | Liste tous les mèmes |
| POST | `/api/memes/upload` | Créer un mème |
| GET | `/api/memes/:id/download` | Télécharger un mème |
| DELETE | `/api/memes/:id` | Supprimer un mème |

## 👨‍💻 Auteur

**Anass Bouziane**  
[LinkedIn](https://linkedin.com/in/anass-bouziane-133657345) · [GitHub](https://github.com/idanass)