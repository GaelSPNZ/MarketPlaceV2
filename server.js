const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const multer = require('multer');
const path = require('path');

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom unique pour chaque fichier
  },
});

const upload = multer({ storage });

// Spécifier à express d'utiliser le dossier "public" pour les fichiers statiques
app.use(express.static('public'));

// Importer les routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

//route d'importation d'image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier téléchargé' });
  }
  res.json({
    imageUrl: `/uploads/${req.file.filename}`, // Retourne l’URL relative de l’image
  });
});

// Exemple de route d'index (pour les tests)
app.get('/', (req, res) => {
  res.send('Serveur express opérationnel');
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le porte ${PORT}`);
});

