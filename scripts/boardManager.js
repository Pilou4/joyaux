// Aire de jeu correspond à un tableau de données, une grille dans laquelle sont placés les éléments.
// À chaque intersection entre une ligne et une colonne, nous avons une cellule dans laquelle une pierre doit figurer.
// La fonction exécute une boucle for() représentant les lignes à dessiner puis, à chaque itération de ligne, une seconde boucle est exécutée, représentant cette fois les colonnes.
// À chaque itération de cette deuxième boucle, un élément HTML de type <img> est inséré dans le DOM, plus précisément en tant qu’enfant de l’élément HTML <div></div> contenant la classe CSS .tileZone.
// Le type de la pierre insérée est déterminé aléatoirement.
// Afin de pouvoir accéder plus directement à n’importe quelle tuile du jeu, nous avons pris soin d’associer deux attributs HTML permettant de les retrouver : data-id, qui contient l’adresse de la tuile sous la forme "xx-yy" où "xx" est le numéro de la ligne et "yy" le numéro de la colonne de la tuile, et data-index, qui contient son indice depuis le coin supérieur gauche.
function loadTiles() 
{
    const speed = 25; 
    let delay = 0; 
    const tileSize = 60; 
    for (let line = 0; line < 9; line++) 
    { 
        for (let column = 0; column < 13; column++) 
        { 
        ( 
      (line, column) => { 
                        let count = 0;
                        let theType = parseInt(1 + (Math.random() * 7));
                        delay = (9 - line) * 3 + column;
                        const tile = $('<img draggable="false" class="tile" data-id="' + line + '-' + column + '" data-index="' + (count++) + '" src="images/stone-' + theType + '.png">')
                              .css ( 
                                     { 
                                       left: (column * tileSize) + 'px', 
                                       top: '-500px',
                                     } 
                                   ); 
                        $('.tileZone').append(tile);
                        animateTile(tile, delay++, speed, (line * tileSize));  
                  } 
           ) (line, column); 
      } 
    } 
}

// Animation faisant tombé les tuiles par le haut de l'écran.
// Cette fonction reçoit quatre paramètres en entrée : un élément HTML sur lequel l’animation doit être appliquée, un délai d’attente à respecter avant d’exécuter l’animation, une durée à respecter pour réaliser la totalité de l’animation et la position d’arrivée de l’élément animé une fois l’animation terminée
// La fonction utilise la méthode jQuery .animate() sur l’élément du DOM qui lui est passé en paramètre après avoir appliqué le délai demandé.
// Elle indique les valeurs de propriété à atteindre et paramètre la durée d’exécution de l’animation en fonction des valeurs reçues.
function animateTile(tile, delayOffset, speed, targetPosition) 
{
    $(tile).delay(speed * delayOffset).animate(
        { 
            top: targetPosition + 'px', 
        }, 
        speed * 10 
    ) 
} 