document.getElementById('saveProfile').addEventListener('click', () => {
    // Récupérer les informations du formulaire
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const userImage = document.getElementById('userImage').files[0]; // Récupérer le fichier
  
    // Sauvegarder dans le LocalStorage
    localStorage.setItem('userName', userName);
    localStorage.setItem('userEmail', userEmail);
  
    if (userImage) {
      const reader = new FileReader();
      reader.onload = function(event) {
        localStorage.setItem('userImage', event.target.result); // Stocker l'image sous forme de Base64
        updateProfileDisplay();
      };
      reader.readAsDataURL(userImage);
    } else {
      updateProfileDisplay();
    }
  });
  
  function updateProfileDisplay() {
    // Charger les informations depuis le LocalStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userImage = localStorage.getItem('userImage');
  
    // Mettre à jour l'affichage
    document.getElementById('displayUserName').textContent = userName || '---';
    document.getElementById('displayUserEmail').textContent = userEmail || '---';
  
    const imageElement = document.getElementById('displayUserImage');
    if (userImage) {
      imageElement.src = userImage;
      imageElement.style.display = 'block';
    } else {
      imageElement.style.display = 'none';
    }
  }
  
  // Initialiser l'affichage au chargement de la page
  updateProfileDisplay();
  