// déclaration d'un tableau contenant les types de bonbons possibles
var candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];

// Initialisation d'un tableau vide qui représentera le plateau de jeu
var board = [];

// Définition du nombre de lignes et de colonnes sur le plateau de jeu
var rows = 9;
var columns = 9;

// Initialisation du score du joueur
var score = 0;

// variables pr stocker les références des tuiles pendant le glissement
var currTile;
var otherTile;

// Fonction appelée lorsque la fenêtre est complètement chargée
window.onload = function() {
    // lancement du jeu au chargement de la page
    startGame();

    // Exécution des fonctions toutes les 1/10e de seconde
    window.setInterval(function(){
        crushCandy();    // Écrasement des bonbons correspondants
        slideCandy();    // Déplacement des bonbons vers le bas après écrasement
        generateCandy(); // Génération de nouveaux bonbons en haut du plateau
    }, 100);
}

// Fonction pour choisir un bonbon aléatoire dans la liste
function randomCandy() {
    return candies[Math.floor(Math.random() * candies.length)]; // Retourne un bonbon aléatoire
}

// Fonction pour initialiser le jeu en créant le plateau de jeu et en plaçant des bonbons aléatoires
function startGame() {
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            // Création d'une tuile d'image avec un identifiant unique et un bonbon aléatoire
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = "./images/" + randomCandy() + ".png";

            // Ajout de fonctionnalités de glissement (drag-and-drop) à la tuile
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            // Ajout de la tuile au plateau de jeu dans le document HTML
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        // Ajout de la rangée au tableau représentant le plateau
        board.push(row);
    }

    console.log(board); // Affichage du plateau dans la console du navigateur
}

// Fonction appelée lorsqu'un bonbon est sélectionné pour être glissé (drag)
function dragStart() {
    // La variable currTile stocke la référence de la tuile actuellement en cours de glissement
    currTile = this;
}

// Fonction appelée lorsque la souris survole une tuile pendant le glissement
function dragOver(e) {
    e.preventDefault(); // Empêche le comportement par défaut du navigateur pour le glissement
}

// Fonction appelée lorsqu'une tuile est déplacée au-dessus d'une autre tuile
function dragEnter(e) {
    e.preventDefault(); // Empêche le comportement par défaut du navigateur pour le glissement
}

// Fonction appelée lorsque la souris quitte une tuile pendant le glissement
function dragLeave() {
    // Cette fonction peut rester vide, car le comportement de sortie n'est pas spécifié ici
}

// Fonction appelée lorsque le bonbon est lâché (drop) sur une autre tuile
function dragDrop() {
    // La variable otherTile stocke la référence de la tuile sur laquelle le bonbon est lâché
    otherTile = this;
}

// Fonction appelée après la fin du processus de glissement (drag)
function dragEnd() {
    // Vérification si les bonbons sont adjacents et échange des images s'ils le sont
    if (currTile.src.includes("blank") || otherTile.src.includes("blank")) {
        return; // Aucun échange si l'une des tuiles est une case vide
    }

    // Récupération des coordonnées des tuiles actuelle et cible
    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // Vérification des mouvements adjacents à l'aide des coordonnées
    let moveLeft = c2 == c-1 && r == r2;
    let moveRight = c2 == c+1 && r == r2;
    let moveUp = r2 == r-1 && c == c2;
    let moveDown = r2 == r+1 && c == c2;

    // Vérification si le mouvement est adjacent
    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    // Échange des images si le mouvement est adjacent
    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;
        currTile.src = otherImg;
        otherTile.src = currImg;

        // Vérification si l'échange est valide, sinon, les images sont à nouveau échangées
        let validMove = checkValid();
        if (!validMove) {
            let currImg = currTile.src;
            let otherImg = otherTile.src;
            currTile.src = otherImg;
            otherTile.src = currImg;    
        }
    }
}

// Fonction pour écraser les bonbons correspondants en groupes de trois
function crushCandy() {
    crushThree(); // Écrasement des groupes de trois bonbons
    document.getElementById("score").innerText = score; // Mise à jour de l'affichage du score
}

// Fonction pour écraser les groupes de trois bonbons alignés en ligne ou en colonne
function crushThree() {
    // Vérification des alignements en ligne
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            // Vérification si trois bonbons alignés sont identiques et non une case vide
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                // Remplacement des images par une case vide
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                // Ajout du score
                score += 30;
            }
        }
    }

    // Vérification des alignements en colonne
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            // Vérification si trois bonbons alignés sont identiques et non une case vide
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                // Remplacement des images par une case vide
                candy1.src = "./images/blank.png";
                candy2.src = "./images/blank.png";
                candy3.src = "./images/blank.png";
                // Ajout du score
                score += 30;
            }
        }
    }
}

// Fonction pour vérifier si des mouvements valides existent sur le plateau
function checkValid() {
    // Vérification des alignements en ligne
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            // Vérification si trois bonbons alignés sont identiques et non une case vide
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true; // Un mouvement valide a été trouvé
            }
        }
    }

    // Vérification des alignements en colonne
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            // Vérification si trois bonbons alignés sont identiques et non une case vide
            if (candy1.src == candy2.src && candy2.src == candy3.src && !candy1.src.includes("blank")) {
                return true; // Un mouvement valide a été trouvé
            }
        }
    }

    return false; // Aucun mouvement valide trouvé
}

// Fonction pour faire glisser les bonbons vers le bas après écrasement
function slideCandy() {
    for (let c = 0; c < columns; c++) {
        let ind = rows - 1;
        for (let r = columns-1; r >= 0; r--) {
            if (!board[r][c].src.includes("blank")) {
                board[ind][c].src = board[r][c].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            board[r][c].src = "./images/blank.png";
        }
    }
}

// Fonction pour générer de nouveaux bonbons en haut du plateau après écrasement
function generateCandy() {
    for (let c = 0; c < columns; c++) {
        if (board[0][c].src.includes("blank")) {
            board[0][c].src = "./images/" + randomCandy() + ".png";
        }
    }
}
