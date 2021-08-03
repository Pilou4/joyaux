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
	let count = 0;
	let tmpDelay = 0;
	for (let line = 0; line < 9; line++)
	{
		for (let column = 0; column < 13; column++)
		{ 
            ((line, column) => 
            {
				let newTile = createNewTile(-500, line, column, count++);
				delay = (9 - line) * 3 + column;
				$('.tileZone').append(newTile.tile);
				animateTile(newTile.tile, delay, speed, (line * tileSize));
				tiles.push(newTile);
				(function () 
                {
                    setTimeout(playShortDingSound, tmpDelay++ * 6);
                })();
			}
			)(line, column);
		}
	}
	organizeTiles();
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

// Cette fonction accepte en entrée une variable tableau censée contenir le groupe de tuiles d’un bloc à supprimer de l’aire de jeu.
// Son code parcourt l’ensemble des colonnes contenant au moins une tuile à supprimer et crée un tableau d’objets JavaScript nommé fallingTree et constitué d’objets ayant trois propriétés : .tile, qui contient l’indice de la tuile à déplacer, .column, qui contient le numéro de la colonne où se trouve la tuile, et .offset, qui contient le nombre de lignes que doit parcourir la tuile pour être positionnée à sa nouvelle place.
// Le tableau de ces tuiles à déplacer est ensuite parcouru et une animation de descente est provoquée pour chacune d’entre elles.
function updateBoard(theGroup, specialChances)
{
	let toReplace = [
        ...(new Set(theGroup.map(
            e => e.coords.left)
            )
        )].map(e =>
            {
                return {column : e, nb: theGroup.filter(f => f.coords.left == e).length};
			}
		);
    let fallingTree = tiles.filter(e => theGroup.some(f => f.coords.left == e.coords.left) && !e.destroyed).map(e => {return {tile: e.index, column: e.coords.left, offset: theGroup.filter(f => f.coords.left == e.coords.left && f.coords.top > e.coords.top).length}}).filter(e => e.offset > 0);
	let finalStuff = fallingTree;
	if (finalStuff.length == 0)
	{
		updateBoardData(finalStuff, toReplace, specialChances);
	}
    fallingTree.forEach((e, i, a) =>
        {
			let theTile = tiles[e.tile];
			let decY = $('.tileZone').offset().top;
			theTile.tile.animate(
                {
					top: (theTile.coords.top + e.offset) * 60
 				}, 
				{
					duration: 125, 
 					complete: f => 
                    {
                         if (i == a.length - 1)
						{
							updateBoardData(a, toReplace, specialChances);
						}
					}	
				}												 
			);
		}
	);
}

// Elle accepte en entrée une variable tableau contenant les indices des tuiles à mettre à jour.
// Le tableau est trié et parcouru et chaque élément se voit passé comme paramètre à l’exécution d’une autre nouvelle fonction, nommée refreshTile().
// Cette dernière a pour mission de procéder à la mise à jour des données de la tuile, à la fois celles stockées dans le DOM et une partie de celles stockées en mémoire.
// Une fois que l’ensemble des tuiles ont été rafraîchies, la fonction organizeTiles() est exécutée pour reconstruire correctement l’ensemble du tableau tiles, mettant ainsi à jour le nouveau voisinage des tuiles déplacées et celui de leurs nouvelles voisines.
function updateBoardData(movedTiles, toReplace, specialChances)
{
	let delayOffset = -6;
	let speed = 15;
	let tileSize = 60;
	movedTiles.sort((a, b) => a.tile > b.tile ? -1 : 1).forEach(e =>
        {
			let theTile = tiles[e.tile];
			refreshTile(theTile, e);
		}
	);
	toReplace.forEach(e =>
        {
			for (let t = e.nb; t > 0; t--)
			{
				let line = t - 1;
				let column = e.column;
				let newTile = createNewTile(-200, line, column, column + (line * 13), specialChances)
			 	$('.tileZone').append(newTile.tile);
				animateTile(newTile.tile, delayOffset, speed, line * tileSize);
				tiles[newTile.index] = newTile;
			}
		}
	);
	organizeTiles();
	updateGoal();
}


// mettre à jour les données de la tuile passée en paramètre en fonction du déplacement qu’elle a subi.
function refreshTile(theTile, theMovement)
{
	$('.tile[data-index="' + theTile.index + '"]').attr('data-index', theTile.index + (13 * theMovement.offset));
	$('.tile[data-id="' + theTile.coords.top + '-' + theTile.coords.left + '"]').attr('data-id', (theTile.coords.top + theMovement.offset) + '-' + theTile.coords.left);
	theTile.coords.top += theMovement.offset;
	theTile.index += (13 * theMovement.offset); 
	tiles[theTile.index] = theTile;
}

// La fonction animateTimeBar() procède à l’animation de la barre de temps en faisant varier sa hauteur jusqu’à la valeur 0.
// Une progression est calculée et la couleur de la barre change avec le temps, par paliers successifs, et se met à clignoter lorsque le délai est presque atteint.
function animateTimeBar(seconds)
{
	$('.timeBarValue').stop().animate(
		{
			height: 0
		},
		{
			duration: seconds * 1000,
			easing: 'linear',
			progress: function (animation, progression, timeLeft)
			{
				let prg = 100 - (($('.timeBarValue').height() / $('.timeBar').height()) * 100);
				leftDelay = seconds * (1 - progression);
				if (prg > 80)
				{
					$('.timeBarValue').css('background', 'tomato');
					$('.timeBar').addClass('blink');
				}
				else if (prg > 60)
				{
					$('.timeBarValue').css('background', 'violet');
					$('.timeBar').removeClass('blink');
				}
				else if (prg > 40)
				{
					$('.timeBarValue').css('background', 'yellow');
					$('.timeBar').removeClass('blink');
				}
				else if (prg > 20)
				{
					$('.timeBarValue').css('background', 'greenyellow');
					$('.timeBar').removeClass('blink');
				}
			},
			complete: function ()
            {
				$('.timeBar').removeClass('blink').css('opacity', '1');
				showLevelStatus();
			}
		}
	);
}

 
// stopper l’animation de la barre de temps à loisir,
function stopTimeBarAnimation()
{
	$('.timeBar').removeClass('blink');
	$('.timeBarValue').stop();
}