// renvoie un tableau composé des tuiles entourant la bombe cliquée à l’aide de la méthode jQuery .filter() appliquée sur le tableau des tuiles en jeu.
function bomb (tile)
{
	playBangSound();
	return [...tiles.filter(e => e.coords.top >= tile.coords.top - 1 && e.coords.top <= tile.coords.top + 1 && e.coords.left >= tile.coords.left - 1 && e.coords.left <= tile.coords.left + 1)];
}

function rainbow(tile)
{
	playDingSound();
	if (!rainbowMode)
	{
		rainbowMode = true;
		rainbowTile = tile;
		return [];
	}
	else
	{
		rainbowMode = false;
		return [rainbowTile, ...tiles.filter(e => e.type == tile.type)];
	}
}
 
//  analyse la direction de la fusée et renvoie dans un tableau l’ensemble des tuiles situées entre la fusée et le bord de l’aire de jeu correspondant à son orientation, de manière à ce qu’elles soient détruites.
// La fusée est alors déplacée par une animation pour atteindre ce bord et la tuile est supprimée lorsque cette animation est terminée
function rocket(tile)
{
	playRocketSound();
	let targets = [];
	let endX;
	let endY;
	switch (tile.specialTypeData)
	{
		case 0:
			targets = [...tiles.filter(e => e.coords.left == tile.coords.left && e.coords.top < tile.coords.top)];
			endY = -1 * tileSize;
			endX = tile.coords.left * tileSize
			break;
		case 90:
			targets = [...tiles.filter(e => e.coords.top == tile.coords.top && e.coords.left > tile.coords.left)];
			endY = tile.coords.top * tileSize;
			endX = 14 * tileSize;
			break;
		case 180:
			targets = [...tiles.filter(e => e.coords.left == tile.coords.left && e.coords.top > tile.coords.top)];
			endY = 10 * tileSize;
			endX = tile.coords.left * tileSize;
			break;
		case 270:
			targets = [...tiles.filter(e => e.coords.top == tile.coords.top && e.coords.left < tile.coords.left)];
			endY = tile.coords.top * tileSize;
			endX = -1 * tileSize;
			break;
	}
	rocketMode = true;
	tile
		.tile
		.animate 	(
						{
							left: endX,
							top: endY
						},
						{
							duration: 250,
							complete: () =>
							{
								updateBoard([tile]);
								tile.tile.remove();
							}
						}
					);
	return targets;
}

function time(tile)
{
	playTimeSound();
	timeMode = true;
	stopTimeBarAnimation();
	$('.timeBarValue').height(Math.min($('.timeBarValue').height() + 50, $('.timeBar').height()));
	animateTimeBar(leftDelay + 10);
	return [tile];
}