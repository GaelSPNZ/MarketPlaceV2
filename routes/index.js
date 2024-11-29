const express = require('express');
const router = express.Router();

// Route de test
router.get('/', (req, res) => {
  res.send('SALUUUT TOUT LE MONDE TEST 1 Bienvenue sur le site d’échange d’objets !');
});

module.exports = router;
