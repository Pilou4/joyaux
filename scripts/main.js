let tiles = [];
let numberOfTypes = 3;
const tileSize = 60;
let bonusChances = 	{
	rainbow: 1,
	bomb: 1,
	time: 1,
	rocket: 1
};
let rainbowMode = false;
let rainbowTile = {};
let rocketMode = false;
let timeMode = false;
let leftDelay = 0;
let destroyedCells = [];
let playerScore = 0;
let gameLevel = 1;
let levelTimeLimit;
let goalLevel;
let maxTurn;
let maxValue;
let playedTurns;
let missionGoal;
let gameInPlay = false;
let numberOfPlay = 3;

$(document).ready (init); 
 
function init()
{
	$(document).attr('unselectable', 'on').css('user-select', 'none').css('MozUserSelect', 'none').on('selectstart', false);
	$('.tileZone').on('mouseenter','.tile', playHoverSound).on('click', '.tile', clickOnTile);
	$('body').on ('click', '.gameLink', doCommand);
	initSounds();
}


// récupère l’indice de la tuile cliquée à l’aide de la méthode jQuery .attr(), en chargeant le contenu de l’attribut HTML data-index que nous avons pris soin de spécifier pour chacune des tuiles, au moment de leur création. Une variable nommée theBlock stocke le résultat de l’exécution de la fonction findBlock() avec l’indice ainsi récupéré.
// IF Ce code vérifie si le nombre de tuiles dans le bloc où figure la tuile cliquée contient plus de deux tuiles.
// Si c’est le cas, elle parcourt le tableau de ces tuiles, destinées à être détruites, et indique par la propriété .destroyed que chacune d’elles doit disparaître de l’aire de jeu.
// Elle déclenche dans la foulée une animation en utilisant les images de fumée que nous avons créées dans la section réalisant les graphismes à utiliser dans ce projet.
// Lorsque l’animation est terminée, l’image de fumée est supprimée de l’aire de jeu.
function clickOnTile (e)
{
	if (!gameInPlay)
	{
		return;
	}
    let theTile = tiles.find(f => f.index == $(e.currentTarget).attr('data-index'));
    let theBlock;
    if (theTile.specialType == 'none' || rainbowMode)
    {
        if (rainbowMode)
        {
            theBlock = rainbow(theTile);
        }
        else
        {
            theBlock = findBlock(theTile.index);
        }
    }
    else
    {
        theBlock = window[theTile.specialType](theTile);
    }
    const leftOffset = $('.tileZone').offset().left;
    const topOffset = $('.tileZone').offset().top;
    if (theBlock.length > 2 || rocketMode || timeMode)
    {
        timeMode = false;
        rocketMode = false;
        let combo;
        let specialChances;
        combo = checkForCombo(theBlock.length);
        if (combo)
        {
            specialChances = combo.specialChances;
        }
        playedTurns++;
        playCrashSound();
        theBlock.forEach((e, i, a) => 
            {
		       	addToScore(10 + (!destroyedCells[e.index] ? 25 : 0));
		       	$('.tileZone').append('<img class="explosion" src="images/smoke1.png" data-id="' + e.index + '">');
 				$('.explosion[data-id="' + e.index + '"]').css(
					{
						left: (e.tile.offset().left - leftOffset) + 'px',
						top: (e.tile.offset().top - topOffset) + 'px'
	  				}
				);
				$('.explosion[data-id="' + e.index + '"]').animate(
					{
						opacity: .5
					},
					{
						duration: 400,
						easing: 'linear',
						progress: function (animation, progression, timeLeft)
						{
							let index = +$(this).attr('src').substr(-5, 1);
							if ((timeLeft < 300 && index == 1) || (timeLeft < 200 && index == 2) || (timeLeft < 100 && index == 3) || (timeLeft < 100 && index == 4))
							{
								$(this).attr('src', 'images/smoke' + (index + 1) + '.png');
							}
						},
						complete: function ()
						{
							$('.tileZone').find(this).remove();
							delete this;
							if (i == a.length - 1)
							{
								updateBoard(theBlock, specialChances);
							}
						}
					}
				);
				if (!destroyedCells[e.index])
				{
					missionGoal--;
				}
				destroyedCells[e.index] = true;
				e.tile.remove();
			}
		);
    }
    else if (!rainbowMode)
    {
        playFailSound();
    }
}
