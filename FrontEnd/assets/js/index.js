// Les variables
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

// Variables pour mémoriser les données
let projects = [];
let categories = [];

// Fonction pour fetch les works
async function fetchWorks() {
  try {
    const res = await fetch("http://localhost:5678/api/works");
    projects = await res.json();
    return projects;
  } catch (err) {
    console.error("Request failed:", err);
  }
}

// Fonction pour fetch les catégories
async function fetchCategories() {
  try {
    const res = await fetch("http://localhost:5678/api/categories");
    categories = await res.json();
    return categories;
  } catch (err) {
    console.error("Request failed:", err.message);
  }
}

// Fonction pour initialiser le chargement de la page
async function initializePage() {
  await fetchWorks();
  await fetchCategories();
  showProjectGallery();
  renderCategoryButtons();
  applyCategoryFilters();
}

initializePage();

// Fonction pour afficher les projets dans le DOM
function showProjectGallery(filteredProjects = projects) {
  // Nettoyage de la galerie avant ajout de nouveaux éléments
  gallery.innerHTML = "";

  // Utilisation d'un DocumentFragment pour améliorer la performance
  const fragment = document.createDocumentFragment();

  // Créer les éléments de la galerie
  filteredProjects.forEach((project) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");

    img.src = project.imageUrl;
    img.alt = project.title;
    caption.textContent = project.title;

    figure.appendChild(img);
    figure.appendChild(caption);
    fragment.appendChild(figure);
  });

  gallery.appendChild(fragment);
}

// Fonction pour afficher les boutons de catégories dynamiquement
function renderCategoryButtons() {
  if (categories.length > 0) {
    const fragment = document.createDocumentFragment();

    // Bouton All
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.id = "all";
    fragment.appendChild(allButton);

    // Créations des boutons de catégories
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.id = category.id;
      fragment.appendChild(button);
    });

    filters.appendChild(fragment);
  }
}

// Fonction pour le trie
function applyCategoryFilters() {
  filters.addEventListener("click", (event) => {
    const selectedCategoryId = event.target.id;

    if (!selectedCategoryId) return;

    const filteredProjects = projects.filter(
      (project) =>
        selectedCategoryId === "all" || project.categoryId == selectedCategoryId
    );

    showProjectGallery(filteredProjects);

    const allButtons = document.querySelectorAll(".filters button");
    allButtons.forEach((btn) => btn.classList.remove("active"));
    event.target.classList.add("active");
  });

  const defaultButton = document.getElementById("all");
  if (defaultButton) {
    defaultButton.classList.add("active");
    showProjectGallery(); // Afficher tous les projets par défaut
  }
}

//Condition de l'utilisateur

document.addEventListener("DOMContentLoaded", () => {
  const loginLink = document.getElementById("login-link");

  if (window.sessionStorage.getItem("logged") === "true") {
    loginLink.textContent = "Logout";
    loginLink.href = "#";
    loginLink.addEventListener("click", () => {
      window.sessionStorage.setItem("logged", "false");
      location.reload();
    });
    displayAdminInterface();
  } else {
    console.log("L'utilisateur n'est pas connecté");
  }
});

function displayAdminInterface() {
  // Cache les boutons filtres
  const filterDiv = document.querySelector(".filters");
  if (filterDiv) {
    filterDiv.style.display = "none";
  }

  // Crée la nouvelle div d'édition
  const newDiv = document.createElement("div");
  const iconElement = document.createElement("i");
  const titleEditionMod = document.createElement("p");

  // Ajoute des classes
  newDiv.className = "editionMod";
  iconElement.className = "fa-regular fa-pen-to-square";
  titleEditionMod.textContent = "Mode édition";

  // Applique des styles directement
  newDiv.style.backgroundColor = "black";
  newDiv.style.padding = "20px"; // Ajoute du padding
  newDiv.style.display = "flex"; // Utilise flexbox pour le layout
  newDiv.style.alignItems = "center"; // Centre les éléments verticalement
  newDiv.style.justifyContent = "center"; // Centre les éléments horizontalement
  newDiv.style.top = "0"; // Positionne la div en haut
  newDiv.style.left = "0"; // Positionne la div à gauche
  newDiv.style.width = "100%"; // Définit la largeur à 100%
  newDiv.style.zIndex = "1000"; // Assure que la div est au-dessus des autres éléments (si nécessaire)

  iconElement.style.color = "white"; // Couleur de l'icône
  iconElement.style.marginRight = "8px"; // Espace entre l'icône et le texte

  titleEditionMod.style.fontSize = "18px"; // Taille de la police
  titleEditionMod.style.color = "white"; // Couleur du texte
  titleEditionMod.style.margin = "0"; // Enlève la marge par défaut

  newDiv.append(iconElement, titleEditionMod);

  // Ajoute la nouvelle div au début de body
  document.body.insertBefore(newDiv, document.body.firstChild);
}
