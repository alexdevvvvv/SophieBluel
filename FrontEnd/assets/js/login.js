// URL de l'API
const apiEndpoint = "http://localhost:5678/api/users/login";

// Sélection des éléments du DOM
const emailField = document.querySelector("form #email");
const passwordField = document.querySelector("form #password");
const loginForm = document.querySelector("form");
const errorMsg = document.querySelector(".login p");

// Fonction pour envoyer une requête de connexion
async function authenticateUser(email, password) {
  try {
    // Envoi de la requête POST avec les informations de connexion
    const result = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Retourne les données de réponse ou un objet vide en cas d'échec
    return result.json();
  } catch (err) {
    // Affiche l'erreur dans la console en cas de problème avec la requête
    console.error("Erreur lors de la tentative de connexion:", err);
    return {};
  }
}

// Fonction pour afficher un message d'erreur
function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.toggle("error-message", Boolean(message));
}

// Fonction pour rediriger vers la page principale
function redirectToHome() {
  console.log("Utilisateur authentifié. Redirection vers la page principale.");
  window.sessionStorage.setItem("logged", "true");
  window.location.href = "./index.html";
}

// Gestionnaire d'événement pour le formulaire de connexion
async function handleLogin(event) {
  event.preventDefault();
  // Récupération des valeurs saisies dans les champs de formulaire
  const email = emailField.value;
  const password = passwordField.value;

  // Appel à la fonction d'authentification
  const response = await authenticateUser(email, password);

  // Vérification de la présence du token dans la réponse
  if (response.token) {
    // Stockage du token dans le sessionStorage et redirection vers la page principale
    window.sessionStorage.setItem("token", response.token);
    redirectToHome();
  } else {
    // Affichage du message d'erreur en cas d'échec d'authentification
    emailField.style.border = "2px solid red";
    passwordField.style.border = "2px solid red";
    showError("Email ou mot de passe incorrect.");
  }
}

// Ajout de l'écouteur d'événement pour la soumission du formulaire
loginForm.addEventListener("submit", handleLogin);
