document.getElementById('articleForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const imageInput = document.getElementById('image');
  const imageFile = imageInput.files[0];
  const category = document.getElementById('category').value;
  const price = parseFloat(document.getElementById('price').value);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  if (!currentUser) {
    alert("Vous devez être connecté pour créer un article.");
    window.location.href = "index.html";
  }

  if (!imageFile) {
    alert('Veuillez sélectionner une image.');
    return;
  }

  // Étape 1 : Télécharger l'image sur le serveur
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement de l\'image.');
    }

    const data = await response.json();
    const imageUrl = data.imageUrl; // URL de l'image renvoyée par le serveur

    // Étape 2 : Sauvegarder les données de l'article dans localStorage
    const articles = JSON.parse(localStorage.getItem('articles')) || [];
    const newArticle = {
      title,
      description,
      image: imageUrl,
      category,
      price,
      ownerEmail: currentUser.email, // Associer l'email du propriétaire
    };
    articles.push(newArticle);
    localStorage.setItem('articles', JSON.stringify(articles));

    alert('Article créé avec succès !');
    document.getElementById('articleForm').reset(); // Réinitialiser le formulaire
  } catch (error) {
    console.error(error);
    alert('Une erreur est survenue lors de la création de l\'article.');
  }
});
