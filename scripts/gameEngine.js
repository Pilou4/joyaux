// Le code de cette fonction parcourt la totalité des éléments contenus dans la variable tableau tiles et ajoute à chacun de ces éléments sa configuration de voisinage
// La manière de réaliser cette opération consiste à créer pour chaque tuile une propriété .neighbours de type JavaScript Object et de créer quatre propriétés à cet objet : left, top, right et bottom.
// L’affectation des tuiles voisines d’une tuile s’effectue grâce à des calculs mathématiques très simples.
// Nous savons que les tuiles possèdent toutes une propriété .coords qui se trouve être un objet JavaScript qui contient dans sa propriété .left le numéro de la colonne et dans sa propriété .top le numéro de la ligne.
// Grâce à ces informations, nous trouvons facilement les tuiles voisines d’une tuile en posant :La tuile de gauche est la tuile dont la ligne est la même que la tuile analysée et dont la colonne est la colonne de la tuile analysée moins 1.La tuile du dessus est la tuile dont la colonne est la même que la tuile analysée et dont la ligne est la ligne de la tuile analysée moins 1.La tuile de droite est la tuile dont la ligne est la même que la tuile analysée et dont la colonne est la colonne de la tuile analysée plus 1.La tuile du dessous est la tuile dont la colonne est la même que la tuile analysée et dont la ligne est la ligne de la tuile analysée plus 1.
// L’utilisation de la méthode JavaScript .find sur le tableau tiles permet d’obtenir facilement ces informations.
// Lorsqu’une tuile n’est pas trouvée, cette méthode renvoie la valeur undefined et c’est très bien pour ce que nous recherchons, certaines tuiles situées en périphérie de l’aire de jeu n’ayant pas de voisines sur quelques-uns de leurs côtés.
function organizeTiles()
{
	tiles.forEach((e) =>
        {
			e.neighbours.left = tiles.find(f => f.coords.left == e.coords.left - 1 && f.coords.top == e.coords.top);
			e.neighbours.top = tiles.find(f => f.coords.left == e.coords.left && f.coords.top == e.coords.top - 1);
			e.neighbours.right = tiles.find(f => f.coords.left == e.coords.left + 1 && f.coords.top == e.coords.top);
			e.neighbours.bottom = tiles.find(f => f.coords.left == e.coords.left && f.coords.top == e.coords.top + 1);
			if (destroyedCells[e.index])
			{
				tiles[e.index].tile.addClass('usedTile');
			}
			else
			{
				tiles[e.index].tile.removeClass('usedTile');
			}
		}
	);
}

// number : le numéro d’indice. C’est le seul paramètre vraiment obligatoire. Il correspond au numéro de la tuile (sa propriété .index) à partir de laquelle on désire extraire l’ensemble d’un bloc et sert de point de départ de l’analyse.
// way : (orientation) terme au choix parmi left, top, right, bottom, qui indique, lorsque l’on entre dans la fonction, l’origine de la recherche. Pour tenter une explication simple, c’est dire au système d’où l’on vient lorsque l’on recherche un voisin de voisin. Ce paramètre permet d’éviter les boucles sans fin.
// stack : le tableau accumulateur où se trouvent stockés les indices des tuiles du bloc au fur et à mesure de leur découverte.
// À l’appel de la fonction, le système recherche la tuile correspondant à l’indice qui lui est passé en paramètre.
// Cette tuile faisant obligatoirement partie du bloc que l’on cherche à retrouver, elle est incluse d’office dans le tableau des résultats.
// le code initialise la variable stack comme étant un tableau vide si celle-ci est undefined au moment de l’appel.
// Le code vérifie ensuite le voisinage de la tuile, dans toutes les directions.
// Pour chaque direction, elle vérifie qu’un voisin existe bien et, si oui, elle vérifie s’il est du même type que la tuile analysée.
// Si les types concordent, l’indice du voisin est stocké dans la variable stack et la fonction s’auto-appelle avec en paramètre le numéro d’indice du voisin, la direction où se situe le voisin par rapport à la tuile analysée et le tableau des indices des tuiles du bloc déjà trouvés.
// La détection du voisinage est assujettie à un contrôle de la direction. En effet, sans ce contrôle, nous l’avons déjà dit, nous tomberions dans une boucle sans fin.
// Imaginez par exemple l’analyse de la tuile portant l’indice numéro 8.Lorsqu’elle cherche sa voisine de droite, elle trouve la tuile portant l’indice numéro 9 et demande de retrouver les voisines de celle-ci.
// La fonction est à ce moment de nouveau appelée avec le numéro 9 comme tuile de départ, cherche ses voisines, et trouve à sa gauche la tuile numéro 8 et… s’exécute de nouveau avec la tuile numéro 8, cherche ses voisines, tombant du coup à sa droite sur la numéro 9… et ainsi de suite jusqu’à remplir la mémoire de l’ordinateur et faire tout planter.
// Pour nous garder de ce piège, il suffit de contrôler la tuile de droite seulement si la variable way ne nous dit pas que nous sommes à la gauche de celle-ci, et inversement.
// C’est la raison pour laquelle, dans le code de la fonction, cette variable est systématiquement testée pour toutes les directions.
// Un autre phénomène dont il faut se protéger se trouve dans le fait qu’un bloc peut contenir de nombreuses tuiles et que la découverte de l’une d’entre elles peut se faire par plusieurs chemins.
// Si nous prenons par exemple un groupe de quatre cellules, 1, 2, 14 et 15 par exemple, et qu’il s’agit de deux rangées de deux cellules superposées, la cellule 14 est alors à la fois la voisine de gauche de la cellule 15 et la voisine du dessous de la cellule 2. Inversement, la cellule 2 est en même temps la voisine du dessus de la cellule 15 et la voisine de droite de la cellule 1.
// C’est pour cette raison que le tableau stack est analysé lors des tests de voisinage afin de ne pas y ajouter une tuile déjà présente parce que déjà analysée par un autre chemin.
// Pour être sûr de bien éliminer tous les doublons pouvant persister et se trouver dans le résultat, ce dernier, avant d’être renvoyé sous forme de tableau, est transformé en objet JavaScript de type Set, qui se trouve être un type particulier de tableau, qui garantit l’absence de doublons en son sein.
// Cette technique est très fiable et beaucoup plus rapide qu’une analyse classique de recherche de doublons.
function findBlock(number, way, stack)
{
	const tile = tiles[number];
	let result = [tile];
	stack = stack == undefined ? [] : stack;
	if (way != 'right' && tile.neighbours.left && tile.neighbours.left.type == tile.type && !stack.find(e => e == tile.neighbours.left.index))
	{
		stack.push(tile.neighbours.left.index);
		result.push(tile.neighbours.left, ...findBlock(tile.neighbours.left.index, 'left', stack));
	}
	if (way != 'bottom' && tile.neighbours.top && tile.neighbours.top.type == tile.type && !stack.find(e => e == tile.neighbours.top.index))
	{
		stack.push(tile.neighbours.top.index);
		result.push(tile.neighbours.top, ...findBlock(tile.neighbours.top.index, 'top', stack));
	}
	if (way != 'left' && tile.neighbours.right && tile.neighbours.right.type == tile.type && !stack.find(e => e == tile.neighbours.right.index))
	{
		stack.push(tile.neighbours.right.index);
		result.push(tile.neighbours.right, ...findBlock(tile.neighbours.right.index, 'right', stack));
	}
	if (way != 'top' && tile.neighbours.bottom && tile.neighbours.bottom.type == tile.type && !stack.find(e => e == tile.neighbours.bottom.index))
	{
		stack.push(tile.neighbours.bottom.index);
		result.push(tile.neighbours.bottom, ...findBlock(tile.neighbours.bottom.index, 'bottom', stack));
	}
	return [...new Set(result)];
}

// tuiles bonus
function createNewTile(topPosition, line, column, index, chances)
{
	let newTile = {};
	let specialChances = chances == undefined ? bonusChances : chances;
	let theType = "";
	let draw = Object.keys(specialChances).sort((a, b) => specialChances[a] < specialChances[b] ? 1 : -1).map(e => {const result = Math.random(); return {bonus: e, value: result, special: result <= specialChances[e] / 1000};});
	if (!draw.some(e => e.special == true))
	{
		theType = "stone-" + parseInt(1 + (Math.random() * numberOfTypes));
		newTile.specialType = 'none';
		newTile.specialTypeData = 'none';
	}
	else
	{
		theType = draw.find(e => e.special).bonus;
		newTile.specialType = theType;
		newTile.specialTypeData = 'none';
		if (theType == 'rocket')
		{
			newTile.specialTypeData = [180, 270, 0, 90][parseInt(Math.random() * 4)];
		}
	}
	let tile = $('<img draggable="false" class="tile" data-id="' + line + '-' + column + '" data-index="' + index + '" src="images/' + theType + '.png">').css(
        {
			left: (column * tileSize) + 'px',
			top: topPosition + 'px',
			transform: newTile.specialTypeData == 'none' ? '' : 'rotate(' + (newTile.specialTypeData) + 'deg)'
		}
	);
	newTile.coords = {left: column, top: line};
	newTile.neighbours = {};
	newTile.type  = theType;
	newTile.tile = tile;
	newTile.index = index;
	return newTile;
}

function doCommand(e)
{
    let command = $(e.currentTarget).attr('data-cmd');
	if (window[command])
	{
		window[command](e);
	}
	else
	{
 		console.log("La commande " + command + " n'existe pas");
	}
}

function startGame()
{
	playRandomSong();
	playWooshSound();
	$('.mainPanelContainer').css('top', '105%');
	setTimeout(showLevelGoal, 1000);
}

function showLevelGoal()
{
	playWooshSound();
	$('.menuPanel, .bonusPanel, .gameOverPanel').addClass('cache');
	$('.levelPanel').removeClass('cache');
	$('.levelTitle').text('Niveau ' + gameLevel);
	levelTimeLimit = [95, 85, 70, 55][Math.min(3, parseInt(gameLevel / 15))];
	missionGoal = Math.min(79 + gameLevel, 117);
	maxTurn = [50, 45, 40, 35, 30, 25, 20, 15][Math.min(7, parseInt(gameLevel / 5))];
	numberOfTypes = 2 + (1 + parseInt(gameLevel / 15));
	$('.explainGoalLevel').text('Pour ce niveau vous disposez de ' + levelTimeLimit + ' secondes pour nettoyer au moins ' + missionGoal + ' cases en un maximum de ' + maxTurn + ' coups.' + (gameLevel % 15 == 0 ? " Un nouveau type de gemmes entre en jeu à partir de ce niveau !" : ""));
	$('.mainPanelContainer').css('top', '5%');
	setTimeout(e =>
        {
			playWooshSound();
			$('.mainPanelContainer').css('top', '105%');
			setTimeout(e =>
                {
					$('.mainPanel').addClass('cache');
					launchGame();
				},1000
			);
		},5000
	);
}

function updateGoal() 
{ 
    $('#goalLevel').text("Niveau " + gameLevel + ' - ' + Math.max(0,  missionGoal) + (missionGoal > 1 ? " cases restantes" : " case restante") +  " - " + (playedTurns == 0 ? "Aucun coup joué" : (playedTurns == 1 ? "Premier  coup joué" : playedTurns + " coups joués")) + ' - Vies : ' + numberOfPlay); 
    if (missionGoal <= 0 || playedTurns > maxTurn) 
    { 
        gameInPlay = false; 
        showLevelStatus(); 
    }
} 

function launchGame()
{
	gameInPlay = true;
	playedTurns = 0;
	$('.gameBoard, .infoZone').removeClass('cache');
	$('.timeBarValue').css(
		{
			height: '99.4%',
			background: 'springgreen'
		}
	);
	if (gameLevel >= 1)
	{
		destroyedCells = [];
		tiles = [];
		$('.tile').remove();
	}
	loadTiles();
	updateGoal();
	setTimeout(e => animateTimeBar(levelTimeLimit),3000);
}

function updateGoal()
{
	$('#goalLevel').text("Niveau " + gameLevel + ' - ' + Math.max(0, missionGoal) + (missionGoal > 1 ? " cases restantes" : " case restante") + " - " + (playedTurns == 0 ? "Aucun coup joué" : (playedTurns == 1 ? "Premier coup joué" : playedTurns + " coups joués")) + ' - Vies : ' + numberOfPlay);
	if (missionGoal <= 0 || playedTurns > maxTurn)
	{
		gameInPlay = false;
		showLevelStatus();
	}
}

function showLevelStatus()
{
	stopTimeBarAnimation();
	if (missionGoal <= 0)
	{
		playWooshSound();
		$('.timeBar').removeClass('blink').css('opacity', '1');
		$('.mainPanel, .bonusPanel').removeClass('cache');
		$('.menuPanel, .levelPanel, .gameOverPanel').addClass('cache');
		$('.bonusPanel .explainGame').text('Excellent ! Vous venez de terminer le niveau ' + gameLevel);
		$('.mainPanelContainer').css('top', '5%');
		playLevelUpSound();
		addBonusLevel();
		setTimeout(e =>	
            {
                gameLevel++;
				playWooshSound();
				$('.mainPanelContainer').css('top', '105%');
				setTimeout(e =>
                    {
						showLevelGoal();
					},1000
				);
			},4000
		);
	}
	else
	{
		playLevelFailSound();
		$('.timeBar').removeClass('blink').css('opacity', '1');
		if (--numberOfPlay > 0)
		{
			playWooshSound();
			$('.mainPanel, .bonusPanel').removeClass('cache');
			$('.menuPanel, .levelPanel, .gameOverPanel').addClass('cache');
			$('.bonusPanel .explainGame').text('Dommage ! ' + (playedTurns > maxTurn ? 'Le nombre maximal de coups a été joué' : 'Le temps imparti est écoulé') + ' et le contrat n\'est pas rempli. Il vous reste ' + numberOfPlay + ' tentative' + (numberOfPlay > 1 ? 's' : '') + ', courage !');
			$('.mainPanelContainer').css('top', '5%');
			setTimeout(e =>	
                {
					playWooshSound();
					$('.mainPanelContainer').css('top', '105%');
					setTimeout(e =>
                        {
							showLevelGoal();
						},1000
					);
				},5000
			);
		}
		else
		{
			stopMusic();
			gameInPlay = false;
			$('.mainPanel, .gameOverPanel').removeClass('cache');
			$('.menuPanel, .levelPanel, .bonusPanel').addClass('cache');
			$('.gameOverPanel .explainGame').text('Dommage ! ' + (playedTurns > maxTurn ? 'Le nombre maximal de coups a été joué' : 'Le temps imparti est écoulé') + ' et le contrat n\'est pas rempli. Vous avez manqué toutes vos tentatives, la partie est maintenant terminée.');
			$('.mainPanelContainer').css('top', '5%');
		}
	}
}


function goToMenu()
{
	playWooshSound();
	$('.gameBoard, .infoZone').addClass('cache');
	$('.mainPanelContainer').css('top', '105%');	
	setTimeout(e =>
        {
			$('.tile').remove();
			tiles = [];
			destroyedCells = [];
			addToScore(-playerScore);
			gameLevel = 1;
			numberOfPlay = 3;
			playedTurns = 0;
			numberOfTypes = 3;
			$('.timeBar').removeClass('blink');
			$('.mainPanel, .menuPanel').removeClass('cache');
			$('.levelPanel, .bonusPanel, .gameOverPanel').addClass('cache');
			$('.mainPanelContainer').css('top', '5%');
			playWooshSound();
		},1500
	);
}
