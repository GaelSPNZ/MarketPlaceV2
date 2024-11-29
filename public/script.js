// Vérifier si un utilisateur est connecté
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

// Charger tous les articles depuis LocalStorage
const allArticles = JSON.parse(localStorage.getItem('articles')) || [];

// Afficher ou masquer les sections selon l'état de connexion
if (!currentUser) {
  // Aucun utilisateur connecté : afficher un message générique
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('welcomeSection').style.display = 'none';
} else {
  // Utilisateur connecté : afficher son nom
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('welcomeSection').style.display = 'block';
  document.getElementById('userName').textContent = currentUser.name;
}

// Fonction pour afficher tous les articles
function displayArticles(articles) {
  const container = document.getElementById('articlesContainer');
  container.innerHTML = ''; // Vider le conteneur avant de réafficher
  articles.forEach((article, index) => {
    const isOwner = currentUser && article.ownerEmail === currentUser.email;
    displayArticle(article, index, isOwner);
  });
}

// Afficher les articles au chargement
displayArticles(allArticles);

// Fonction pour afficher un article
function displayArticle(article, index, showButtons) {
  const col = document.createElement('div');
  col.classList.add('col-md-4'); // 3 colonnes par ligne

  col.innerHTML = `
    <div class="card" style="width: 100%; margin-bottom: 20px;">
      <img src="${article.image}" class="card-img-top" alt="Image de l'article">
      <div class="card-body">
        <h5 class="card-title">${article.title}</h5>
        <p class="card-text">${article.description}</p>
        <p><strong>Catégorie :</strong> ${article.category}</p>
        <p><strong>Prix :</strong> ${article.price} €</p>
        <a href="#" class="btn btn-primary">Voir plus</a>
        ${showButtons ? `
          <button class="btn btn-danger mt-2" data-index="${index}">Supprimer</button>
          <button class="btn btn-warning mt-2" data-index="${index}">Modifier</button>
        ` : ''}
      </div>
    </div>
  `;

  document.getElementById('articlesContainer').appendChild(col);
}

// Gestion de la déconnexion
document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem('currentUser'); // Supprimer l'utilisateur connecté
  window.location.reload(); // Recharger la page
});

// Gestion de la connexion
document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  const email = document.getElementById('email').value.trim();
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Vérifier si l'email existe dans la liste des utilisateurs
  const user = users.find((u) => u.email === email);

  if (user) {
    // Sauvegarder l'utilisateur connecté dans LocalStorage
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Afficher le message de bienvenue
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('welcomeSection').style.display = 'block';
    document.getElementById('userName').textContent = user.name;

    // Rafraîchir la page pour recharger les articles
    window.location.reload();
  } else {
    alert("Utilisateur non trouvé. Vérifiez votre email.");
  }
});

// Gestion des filtres de tri
document.getElementById('sortBy').addEventListener('change', (event) => {
  const criteria = event.target.value;

  if (criteria === 'priceAsc') {
    allArticles.sort((a, b) => a.price - b.price); // Tri par prix croissant
  } else if (criteria === 'priceDesc') {
    allArticles.sort((a, b) => b.price - a.price); // Tri par prix décroissant
  } else if (criteria === 'category') {
    allArticles.sort((a, b) => a.category.localeCompare(b.category)); // Tri par catégorie
  }

  // Réafficher les articles triés
  displayArticles(allArticles);
});

// Gestion de la suppression des articles
document.getElementById('articlesContainer').addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON' && event.target.classList.contains('btn-danger')) {
    const index = event.target.getAttribute('data-index');

    // Supprimer l'article du tableau global
    allArticles.splice(index, 1);

    // Mettre à jour LocalStorage
    localStorage.setItem('articles', JSON.stringify(allArticles));

    // Rafraîchir les articles affichés
    displayArticles(allArticles);
  }
});

// Gestion de la modification des articles
document.getElementById('articlesContainer').addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON' && event.target.classList.contains('btn-warning')) {
    const index = event.target.getAttribute('data-index');
    const article = allArticles[index];

    // Afficher des invites pour modifier les informations
    const newTitle = prompt('Modifier le titre de l\'article', article.title);
    const newDescription = prompt('Modifier la description de l\'article', article.description);
    const newImage = prompt('Modifier l\'URL de l\'image', article.image);
    const newCategory = prompt('Modifier la catégorie', article.category);
    const newPrice = prompt('Modifier le prix', article.price);

    if (newTitle && newDescription && newImage && newCategory && newPrice) {
      allArticles[index] = {
        ...article,
        title: newTitle,
        description: newDescription,
        image: newImage,
        category: newCategory,
        price: parseFloat(newPrice),
      };

      // Mettre à jour LocalStorage
      localStorage.setItem('articles', JSON.stringify(allArticles));

      // Rafraîchir les articles affichés
      displayArticles(allArticles);
    } else {
      alert('Modification annulée : tous les champs sont obligatoires.');
    }
  }
});
