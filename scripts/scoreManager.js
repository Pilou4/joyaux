let combos = [ 
    {limit: 15, text: 'Bravo', bonus: 1000, specialChances: {rainbow: 1, bomb: 50, time: 100, rocket: 30}}, 
    {limit: 20, text: 'Superbe', bonus: 2000, specialChances: {rainbow: 100, bomb: 100, time: 100, rocket: 50}}, 
    {limit: 25, text: 'Formidable', bonus: 3500, specialChances: {rainbow: 100, bomb: 100, time: 100, rocket: 50}}, 
    {limit: 30, text: 'Magnifique', bonus: 6000, specialChances: {rainbow: 120, bomb: 100, time: 120, rocket: 100}}, 
    {limit: 40, text: 'Extraordinaire', bonus: 10000, specialChances: {rainbow: 150, bomb: 120, time: 150, rocket: 120}}, 
    {limit: 50, text: 'Fantastique', bonus: 25000, specialChances: {rainbow: 150, bomb: 150, time: 150, rocket: 150}},
];

function addToScore(score)
{
	playerScore += score;
	$('#playerScore').text(('0000000000' + playerScore).substr(-10));
}

// Ce code vérifie et récupère, le cas échéant, si le nombre de tuiles contenues dans le bloc en cours de traitement correspond au nombre minimum d’un combo figurant dans la liste des combos.
// Lorsque c’est le cas, il affiche brièvement le texte du bonus à l’écran en guise d’encouragement et attribue les points accordés par le bonus.
// La variable combo est renvoyée à l’appelant de la fonction.

function checkForCombo(tileNumber)
{
	let combo = combos.filter(e => e.limit <= tileNumber).sort((a, b) => a.limit < b.limit ? 1 : -1)[0];
	if (combo)
	{
		addToScore(combo.bonus);
		$('#comboLabel').text(combo.text);
		$('#comboLabel').show();
		$('#comboLabel').css({transform: 'translate(20%) translateY(-278px) scale(1.4)', opacity: 1});
		setTimeout(function ()
            {
				$('#comboLabel').animate(
                    {
                        opacity: 0
                    },
                    {
                        duration: 500, 
                        complete: 	function () 
                        {
                            $('#comboLabel').hide().css(
                                {
                                    transform: 'translate(20%) translateY(-278px) scale(0)',
                                    opacity: 1
                                }
                            );
                        }
                    }
                );
	        },400
        );
	}
	return combo;
}

function addBonusLevel()
{
	let leftTurns = maxTurn - playedTurns;
	let turnBonus = leftTurns * 1000;
	let timeBonus = parseInt(leftDelay * 1000);
	$('#turnsLeft').remove();
	$('.bonusPanel').append('<label id="turnsLeft">Coups restants : ' + (leftTurns--) + '</label>');
	playBonusSound();
	$('.timeBarValue').delay(250).animate(
		{
			opacity: 1,
		},
		{
			duration: 1000,
  			progress: function (animation, progression, timeLeft)
  			{
  				if (leftTurns > 0)
  				{
  					$('#turnsLeft').text("Coups restants : " + leftTurns--);
  				}
  				addToScore(parseInt(turnBonus * progression));
  			},
  			complete: function ()
  			{
  				$('#turnsLeft').remove();
				setTimeout (playBonusSound, 500);
				$('.timeBarValue').delay(500).animate(
                    {
                        height: 0,
                    },
                    {
                        duration: 1000,
                        progress: function (animation, progression, timeLeft)
                        {
                            addToScore(parseInt(timeBonus * progression));
                        }
                    }
			    );
  			}
		}
	);
}