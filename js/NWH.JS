const gameArea = document.querySelector(".game-area")

// CARACTERS
// spiderman
const spiderMan = document.querySelector("#spider-man")
const smHead = document.querySelector(".sm-face")
const smBody = document.querySelector(".sm-body")
const smArms = document.querySelectorAll(".sm-arms")
const smLegs = document.querySelectorAll(".sm-legs")

// green goblin
const greenGoblin = document.querySelector("#green-goblin")

// sctavius
const drOctopus = document.querySelector("#dr-octopus")
const docFace = document.querySelector(".doc-face")
const docTentacleLeft = document.querySelector("#doc-ttL")
const docTentacleRight = document.querySelector("#doc-ttR")
const docPipe = document.querySelector(".doc-pipe")

// ANIMATIONS CLASSES FOR JUSM & SLIDE
const smDefArmsAnime = ["sm-def-r-arm", "sm-def-l-arm"] /* -- spderman Default Anime -- */
const smDefLegsAnime = ["sm-def-r-leg", "sm-def-l-leg"] /* -- spderman Default Anime -- */

const smJumpArmsAnime = ["no-anime", "no-anime"]      /* -- spderman Jump Anime -- */
const smJumpLegsAnime = ["sm-jump-r-leg", "sm-jump-l-leg"]      /* -- spderman Jump Anime -- */

const smSlideArmsAnime = ["sm-slide-r-arm", "sm-slide-l-arm"]   /* -- spderman Slide Anime -- */
const smSlideLegsAnime = ["sm-slide-r-leg", "sm-slide-l-leg"]   /* -- spderman Slide Anime -- */

// SCORES
let scoreCount = 0;
let score = document.querySelector(".scores")
score.innerHTML = "score:- " + scoreCount
let HighScore = document.querySelector(".high-scores")
let savedScores = localStorage.getItem("savedScores")

// BUTTONS
const play = document.querySelector(".play")

// intervals
let scoreCounterInterval
let detectingCollisonInterval

// Audios
const gameTheme = new Audio("music/gameTheme.mp3")
const gobyAudio = new Audio("music/gablinAudio.mp3")
const docAudio = new Audio("music/docAudio.m4a")
const killedByGobyAudio = new Audio("music/killByGoby.m4a")
const gameOverAudio = new Audio("music/gameover.m4a")
const concredeHitAudio = new Audio("music/punch.mp3")

// ----- EVENTS ---- //
// KeyDown
window.addEventListener("keydown", handleSpidey, true);


// FUNCTIONS
// start the Game
function startTheGame() {

    // Audio
    gameTheme.play()
    gobyAudio.play()
    gameTheme.loop = true

    // -- changing some classes
    play.classList.add("hide")
    greenGoblin.classList.remove("hide")
    greenGoblin.classList.add("goby-incoming")

    // -- intervals
    detectingCollisonInterval = setInterval(() => detectCollison(), 100);
    scoreCounterInterval = setInterval(() => countingScores(), 1000);
}


// handle spidey jump or slide
function handleSpidey(e) {
    if (e.code === "Space") smDodge("JUMP", "sm-jump", "sm-face-jump", smJumpArmsAnime, smJumpLegsAnime) // for sm-jump
    if (e.key === "s") smDodge("SLIDE", "sm-slide", "sm-face-slide", smSlideArmsAnime, smSlideLegsAnime) // for sm-slide
}


// spiderMan Dodge
const smDodge = (data, slideOrJumpAnime, headAnime, ArmsAnime, legsAnime) => {
    window.removeEventListener("keydown", handleSpidey, true);

    spiderMan.classList.replace("sm-def", slideOrJumpAnime)
    smHead.classList.replace("sm-face-def", headAnime)
    for (let i = 0; i < 2; i++) {
        smArms[i].classList.replace(smDefArmsAnime[i], ArmsAnime[i])
        smLegs[i].classList.replace(smDefLegsAnime[i], legsAnime[i])
    }

    // -- reset spiderMan-Anime
    resetSpidermanAnimes(data, slideOrJumpAnime, headAnime, ArmsAnime, legsAnime)
}


// Rest SpiderMan Anime
const resetSpidermanAnimes = (data, slideOrJumpAnime, headAnime, ArmsAnime, legsAnime) => {
    let resetTime = data === "JUMP" ? 750 : 690

    setTimeout(() => {
        spiderMan.classList.replace(slideOrJumpAnime, "sm-def")
        smHead.classList.replace(headAnime, "sm-face-def")

        for (let i = 0; i < 2; i++) {
            smArms[i].classList.replace(ArmsAnime[i], smDefArmsAnime[i])
            smLegs[i].classList.replace(legsAnime[i], smDefLegsAnime[i])
        }

        window.addEventListener("keydown", handleSpidey, true)
    }, resetTime);
}


// detect collison
function detectCollison() {
    const spiderManOffsets = spiderMan.getBoundingClientRect()
    const greenGoblinOffsets = greenGoblin.getBoundingClientRect()
    const docWeaponOffsets = docPipe.getBoundingClientRect()

    if (spiderManOffsets.left < greenGoblinOffsets.left + greenGoblinOffsets.width &&
        spiderManOffsets.left + spiderManOffsets.width - 100 > greenGoblinOffsets.left &&
        spiderManOffsets.top < greenGoblinOffsets.top + greenGoblinOffsets.height &&
        spiderManOffsets.top + spiderManOffsets.height > greenGoblinOffsets.top) {
        killedByGobyAudio.currentTime = 0.2
        killedByGobyAudio.play()
        resetTheGame()
    }

    else if (spiderManOffsets.left - 100 < docWeaponOffsets.left + docWeaponOffsets.width &&
        spiderManOffsets.left - 100 + spiderManOffsets.width > docWeaponOffsets.left &&
        spiderManOffsets.top + 50 < docWeaponOffsets.top + docWeaponOffsets.height &&
        spiderManOffsets.top + 50 + spiderManOffsets.height > docWeaponOffsets.top) {
        concredeHitAudio.play()
        resetTheGame()
    }
}

// count scores for a second
function countingScores() {
    scoreCount = scoreCount += 1
    score.innerHTML = "score:- " + scoreCount

    if (scoreCount > savedScores) {
        localStorage.setItem("savedScores", scoreCount)
        HighScore.innerHTML = "highscore:- " + localStorage.getItem("savedScores")
    }


    if (scoreCount > 12 && scoreCount < 14) {
        docAudio.play()
        drOctopus.classList.replace("oct-def", "oct-coming")
        docFace.classList.add("doc-face-anime")
        docTentacleLeft.classList.add("doc-ttL-anime")
        docTentacleRight.classList.add("doc-ttR-anime")
        docPipe.classList.add("pipe-anime")
    }

    else if (scoreCount > 30 && scoreCount < 32) {
        greenGoblin.classList.replace("goby-incoming", "goby-def")
        setTimeout(() => greenGoblin.classList.replace("goby-def", "goby-speedup"), 1000);
    }
}


// reset the game
function resetTheGame() {
    scoreCount = 0
    score.innerHTML = "score:- " + scoreCount
    HighScore.innerHTML = "highscore:- " + localStorage.getItem("savedScores")

    // -- audio
    gameOverAudio.play()
    gameTheme.pause()
    gobyAudio.pause()
    docAudio.pause()
    gameTheme.currentTime = 0
    gobyAudio.currentTime = 0
    docAudio.currentTime = 0

    // -- intervals
    clearInterval(scoreCounterInterval)
    clearInterval(detectingCollisonInterval)

    // -- reset other classes
    play.classList.remove("hide")
    gameArea.classList.add("hide")

    greenGoblin.classList.remove("goby-incoming")
    greenGoblin.classList.remove("goby-speedup")
    greenGoblin.classList.add("hide")

    drOctopus.classList.replace("oct-coming", "oct-def")
    docFace.classList.remove("doc-face-anime")
    docTentacleLeft.classList.remove("doc-ttL-anime")
    docTentacleRight.classList.remove("doc-ttR-anime")
    docPipe.classList.remove("pipe-anime")

    setTimeout(() => gameArea.classList.remove("hide"), 1000);
}

// SCORES
if (localStorage.getItem("savedScores"))
    HighScore.innerHTML = "highscore:- " + localStorage.getItem("savedScores")
else HighScore.innerHTML = "highscore:- " + 0