let musicalCredits =    [
    {
        song: 'dropsOfH2O',
        author: 'J. Lang',
        file: 'music/DropsOfH2O - djlang59.mp3',
        url: 'http://dig.ccmixter.org/files/djlang59/37792'
    },
    {
        song: 'departures',
        author: 'airtone',
        file: 'music/airtone_-_departures.mp3',
        url: 'http://dig.ccmixter.org/files/airtone/50496'
    },
    {
        song: 'summer',
        author: 'Benjamin Tissot',
        file: 'music/bensound-summer.mp3',
        url: 'https://www.bensound.com/royalty-free-music/track/summer-chill-relaxed-tropical'
    },
    {
        song: 'jazzyfrenchy',
        author: 'Benjamin Tissot',
        file: 'music/bensound-jazzyfrenchy.mp3',
        url: 'https://www.bensound.com/royalty-free-music/track/jazzy-frenchy'
    },
    {
        song: 'quarkXpress',
        author: 'airtone',
        file: 'music/airtone_-_quarkXpress.mp3',
        url: 'http://dig.ccmixter.org/files/airtone/57368'
    },
    {
        song: 'Playdate',
        author: 'The Great North Souns Society',
        file: 'music/Playdate.mp3',
        url: 'https://www.youtube.com/channel/UC4E3HatXP9GaegXWubwKf9A/featured'
    },
    {
        song: 'Fwends',
        author: 'Reed Mathis',
        file: 'music/Fwends.mp3',
        url: 'https://www.youtube.com/channel/UC2lHxFyHL96NPhdU9XyXnPQ'
    },
];

let musicVolume = 100;
let musicSlot;

let currentSong;

let soundVolume = 100;
let sndHoverSlot;
let sndCrashSlot;
let sndFailSlot;
let sndBangSlot;
let sndBonusSlot;
let sndTimeSlot;
let sndLevelUpSlot;
let sndWhooshSlot;
let sndLevelFailSlot;
let sndDingSlot;
let sndShortDingSlot;
let sndRocketSlot;

function initSounds()
{
    musicSlot = document.getElementById('musicSlot');
    $(musicSlot).on('ended', e => {setTimeout(playRandomSong, 1000);})
    sndHoverSlot = document.getElementById('soundHover');
    sndCrashSlot = document.getElementById('soundCrash');
    sndFailSlot = document.getElementById('soundFail');
    sndBangSlot = document.getElementById('soundBang');
    sndBonusSlot = document.getElementById('soundBonus');
    sndTimeSlot = document.getElementById('soundTime');
    sndLevelUpSlot = document.getElementById('soundLevelUp');
    sndWhooshSlot = document.getElementById('soundWhoosh');
    sndLevelFailSlot = document.getElementById('soundLevelFail');
    sndShortDingSlot = document.getElementById('soundShortDing');
    sndDingSlot = document.getElementById('soundDing');
    sndRocketSlot = document.getElementById('soundRocket');
    setSoundsVolume(soundVolume);
}

function playCrashSound()
{
    sndCrashSlot.currentTime = 0;
    sndCrashSlot.play();
}

function playHoverSound()
{
    sndHoverSlot.currentTime = 0;
    sndHoverSlot.play();
}

function playFailSound()
{
    sndFailSlot.currentTime = 0;
    sndFailSlot.play();
}

function playBangSound()
{
    sndBangSlot.currentTime = 0;
    sndBangSlot.play();
}

function playTimeSound()
{
    sndTimeSlot.currentTime = 0;
    sndTimeSlot.play();
}

function playBonusSound()
{
    sndBonusSlot.currentTime = 0;
    sndBonusSlot.play();
}

function playLevelUpSound()
{
    sndLevelUpSlot.currentTime = 0;
    sndLevelUpSlot.play();
}

function playWooshSound()
{
    sndWhooshSlot.currentTime = 0;
    sndWhooshSlot.play();
}

function playLevelFailSound()
{
    sndLevelFailSlot.currentTime = 0;
    sndLevelFailSlot.play();
}

function playShortDingSound()
{
    sndShortDingSlot.currentTime = 0;
    sndShortDingSlot.play();
}

function playDingSound()
{
    sndDingSlot.currentTime = 0;
    sndDingSlot.play();
}

function playRocketSound()
{
    sndRocketSlot.currentTime = 0;
    sndRocketSlot.play();
}

function playRandomSong()
{
    currentSong = musicalCredits[parseInt(Math.random() * musicalCredits.length)];
    musicSlot.volume = 0;
    musicSlot.src = currentSong.file;
    startMusic();
    $('.statusZone').html("<p>Music : " + currentSong.song + ' - ' + currentSong.author + ' - <a href="' + currentSong.url + '" target="_blank">Page web du morceau ou de l\'artiste</a>');
}

function startMusic()
{
    musicSlot.currentTime = 0;
    musicSlot.play();
    $(musicSlot).animate(
        {
            volume: parseFloat(musicVolume / 100),
        },250
    );
}

function stopMusic()
{
    $(musicSlot).animate(
        {
            volume: 0,
        },
        {
            duration: 250,
            complete: function ()
            {
                musicSlot.pause();
            }
        }
    );
}

function setMusicVolume()
{
    musicSlot.volume = parseFloat(musicVolume / 100);
}

function setSoundsVolume()
{
    sndWhooshSlot.volume = parseFloat(soundVolume / 100);
    sndCrashSlot.volume = parseFloat(soundVolume / 100);
    sndFailSlot.volume = parseFloat(soundVolume / 100);
    sndBangSlot.volume = parseFloat(soundVolume / 100);
    sndBonusSlot.volume = parseFloat(soundVolume / 100);
    sndTimeSlot.volume = parseFloat(soundVolume / 100);
    sndLevelUpSlot.volume = parseFloat(soundVolume / 100);
    sndLevelFailSlot.volume = parseFloat(soundVolume / 100);
    sndDingSlot.volume = parseFloat(soundVolume / 100);
    sndShortDingSlot.volume = parseFloat(soundVolume / 100);
    sndRocketSlot.volume = parseFloat(soundVolume / 100);
    sndHoverSlot.volume = parseFloat(soundVolume / 100);
}


function musicVolumeUp()
{
    musicVolume = Math.min(100, musicVolume + 10);
    $('.gameOptions label:first').text('Musique ' + musicVolume);
    setMusicVolume();
}

function musicVolumeDown()
{
    musicVolume = Math.max(0, musicVolume - 10);
    $('.gameOptions label:first').text('Musique ' + musicVolume);
    setMusicVolume();
}

function soundVolumeUp()
{
    soundVolume = Math.min(100, soundVolume + 10);
    $('.gameOptions label:last').text('Effets ' + soundVolume);
    setSoundsVolume();
}

function soundVolumeDown()
{
    soundVolume = Math.max(0, soundVolume - 10);
    $('.gameOptions label:last').text('Effets ' + soundVolume);
    setSoundsVolume();
}
