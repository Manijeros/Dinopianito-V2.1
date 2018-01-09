'use strict';

$(document).ready(function () {

  loadML();
  loadFB();
  Game();

  function Game() {

    function play(sound) {
      createjs.Sound.play(sound);
    };

    const CANVAS = {
      width: $('#first-canvas').width(),
      height: $('#first-canvas').height()
    };

    let queue = new createjs.LoadQueue();

    queue.loadManifest([
    // Bitmaps
    'assets/fonts/04B_30__.TTF', 'assets/img/logo-dinopianito.png', 'assets/img/d1.png', 'assets/img/d2.png', 'assets/img/d3.png', 'assets/img/d4.png', 'assets/img/c.png', 'assets/img/d.png', 'assets/img/e.png', 'assets/img/f.png', 'assets/img/g.png', 'assets/img/a.png', 'assets/img/b.png', 'assets/img/loading.png', 'assets/img/back-dino.png',
    // Sounds
    'assets/sounds/score.mp3', 'assets/sounds/voz-dinopianito.mp3', 'assets/sounds/kick.mp3', 'assets/sounds/snare.mp3', 'assets/sounds/hhc.mp3', 'assets/sounds/hho.mp3', 'assets/sounds/c.mp3', 'assets/sounds/d.mp3', 'assets/sounds/e.mp3', 'assets/sounds/f.mp3', 'assets/sounds/g.mp3', 'assets/sounds/a.mp3', 'assets/sounds/b.mp3']);

    let stage = new createjs.Stage("first-canvas");

    let score = 0;
    let level = 1;

    let progress = new createjs.Text(0, "20px Orbitron", "yellow");
    progress.y = 70;
    progress.x = CANVAS.width / 2;
    progress.textBaseline = 'middle';
    progress.textAlign = 'center';
    progress.scaleX = 2;
    progress.scaleY = 2;
    stage.addChild(progress);

    queue.load();
    queue.on('progress', function (event) {
      progress.text = event.loaded.toFixed(1) * 100 + '%';
      if (progress.text == '100%') {
        stage.removeChild(progress);
        $('#first-canvas').css({ 'background': 'black' });
      }
      stage.update();
    });
    queue.on('complete', intro, this);

    function intro() {

      let assets = {
        logo: new createjs.Bitmap('assets/img/intro.png')
      };

      // Create and play main theme

      for (let each in assets) {
        assets[each].setBounds(0, 0, 300, 120);
        let bounds = assets[each].getBounds();
        assets[each].x = CANVAS.width / 2;
        assets[each].y = CANVAS.height / 2;
        assets[each].scaleX = assets[each].scaleY = 2;
      }

      assets.logo.x = assets.logo.y = 0;
      assets.logo.scaleX = assets.logo.scaleY = 1;
      assets.logo.alpha = 0;

      stage.addChild(assets.logo);

      let updateStage = setInterval(function () {
        if (assets.logo.alpha < 1) {
          assets.logo.alpha += 0.1;
        } else if (assets.logo.alpha > 1) {
          assets.logo.alpha = 1;
          setTimeout(function () {
            let downAlpha = setInterval(function () {
              assets.logo.alpha -= 0.1;
            }, 1000 / 24);
          }, 1000);
        } else if (assets.logo.alpha < 0) {
          clearInterval(downAlpha);
          clearInterval(updateStage);
        }
        stage.update();
      }, 1000 / 24);

      setTimeout(function () {
        stage.removeChild(assets.logo);
        start();
      }, 2000);
    };
    function start() {
      let assets = {
        startMessage: new createjs.Bitmap('assets/img/start-message.png')
      };

      for (let each in assets) {
        assets[each].setBounds(0, 0, 300, 120);
        let bounds = assets[each].getBounds();
        assets[each].regX = bounds.width / 2;
        assets[each].regY = bounds.height / 2;
        assets[each].x = CANVAS.width / 2;
        assets[each].y = CANVAS.height / 2;
        assets[each].scaleX = assets[each].scaleY = 2;
      };

      $('#first-canvas').css({
        'background': 'url("assets/img/back-dino.png")',
        'background-size': 'cover'
      });

      stage.addChild(assets.startMessage);

      let start = setInterval(function () {
        stage.update();
      }, 100);

      $('body').keydown(function (event) {
        let key = event.which;
        stage.removeChild(assets.startMessage);
        stage.update();
        showLevel(level);
        $('body').off();
        $('#first-canvas').css({ 'background': 'none' });
      });
    };
    function inGame(level, speed) {

      let inGameAssets = {
        keyboardMessage: new createjs.Bitmap('assets/img/mensaje-teclado.png'),
        logo: new createjs.Bitmap('assets/img/logo-dinopianito.png'),
        segundero: new createjs.Text(45, '20px Orbitron', 'yellow')
      };

      let pianito = {
        pianitoDefault: new createjs.Bitmap('assets/img/default.png'),
        // Drumkit
        pianito_d1: new createjs.Bitmap('assets/img/d1.png'),
        pianito_d2: new createjs.Bitmap('assets/img/d2.png'),
        pianito_d3: new createjs.Bitmap('assets/img/d3.png'),
        pianito_d4: new createjs.Bitmap('assets/img/d4.png'),
        // Notes
        pianito_c: new createjs.Bitmap('assets/img/c.png'),
        pianito_d: new createjs.Bitmap('assets/img/d.png'),
        pianito_e: new createjs.Bitmap('assets/img/e.png'),
        pianito_f: new createjs.Bitmap('assets/img/f.png'),
        pianito_g: new createjs.Bitmap('assets/img/g.png'),
        pianito_a: new createjs.Bitmap('assets/img/a.png'),
        pianito_b: new createjs.Bitmap('assets/img/b.png')
      };

      for (let each in pianito) {
        pianito[each].setBounds(0, 0, 300, 120);
        let bounds = pianito[each].getBounds();
        pianito[each].regX = bounds.width / 2;
        pianito[each].regY = bounds.height / 2;
        pianito[each].x = CANVAS.width / 2;
        pianito[each].y = CANVAS.height / 2.5;
        pianito[each].scaleX = pianito[each].scaleY = 1.5;
      };

      for (let each in inGameAssets) {
        inGameAssets[each].setBounds(0, 0, 300, 120);
        let bounds = inGameAssets[each].getBounds();
        inGameAssets[each].regX = bounds.width / 2;
        inGameAssets[each].regY = bounds.height / 2;
        inGameAssets[each].x = CANVAS.width / 2;
        inGameAssets[each].y = CANVAS.height / 1.42;
        inGameAssets[each].scaleX = inGameAssets[each].scaleY = 1;
      };

      loadSounds();

      let seconds = 0;
      let remainingTime = 0;
      let secondCounter = setInterval(function () {
        ++seconds;
        inGameAssets.segundero.text = 45 - seconds;
        remainingTime = 45 - seconds;
        if (remainingTime <= 10 && remainingTime > 5) {
          inGameAssets.segundero.color = 'orange';
        } else if (remainingTime <= 5) {
          inGameAssets.segundero.color = 'red';
        }
      }, 1000);

      inGameAssets.segundero.x = CANVAS.width - 35;
      inGameAssets.segundero.y = CANVAS.height - 275;

      stage.addChild(inGameAssets.segundero);

      // Logo de dinopianito

      inGameAssets.logo.y = CANVAS.height / 3;
      inGameAssets.logo.x = CANVAS.width / 3 + 50;
      inGameAssets.logo.scaleX = inGameAssets.logo.scaleY = 1.3;

      var data = {
        images: ['assets/img/dinoSprite.png'],
        frames: { width: 128, height: 128, regY: 64, regX: 64 },
        animations: {
          run: {
            frames: [0, 0, 0, 0, 1, 1, 1, 1]
          }
        }
      };

      var dataF = {
        images: ['assets/img/frutita.png'],
        frames: { width: 128, height: 128, regY: 64, regX: 64 },
        animations: {
          float: {
            frames: [0, 1, 2, 3, 4, 5, 5, 5, 5, 4, 3, 2, 1, 0, 0, 0]
          }
        }
      };

      var spriteSheetF = new createjs.SpriteSheet(dataF);
      var frutiSprite = new createjs.Sprite(spriteSheetF, 'float');

      var spriteSheet = new createjs.SpriteSheet(data);
      var dinoSprite = new createjs.Sprite(spriteSheet, 'run');

      frutiSprite.x = randomIntFromInterval(600, 1200);
      frutiSprite.y = CANVAS.height / 1.5;
      frutiSprite.framerate = 1000 / 24;
      frutiSprite.scaleX = frutiSprite.scaleY = 0.7;

      dinoSprite.x = CANVAS.width / 4.5;
      dinoSprite.y = CANVAS.height / 2 + CANVAS.height / 4 + 10;
      dinoSprite.framerate = 100;
      dinoSprite.scaleX = dinoSprite.scaleY = 1.5;

      stage.addChild(inGameAssets.keyboardMessage);
      stage.addChild(frutiSprite);
      stage.addChild(dinoSprite);

      loadBackCSS();

      let backScroll = 0;

      setTimeout(function () {
        messageAnimation(2);
      }, 1000 * 5);

      function messageAnimation(totalTimeSeconds) {
        setTimeout(function () {
          let i = 0;
          setInterval(function () {
            inGameAssets.keyboardMessage.x -= i / 3;
            inGameAssets.keyboardMessage.alpha = 1 / (i / 10);
            ++i;
          }, totalTimeSeconds * 10);
        }, totalTimeSeconds * 1000);
      };

      let currentNote = pianito.pianitoDefault;

      function draw(note) {
        currentNote = note;
      };

      let pianitoUpdate = setInterval(function () {
        stage.addChild(currentNote);
        currentNote = pianito.pianitoDefault;
        stage.addChild(inGameAssets.logo);
      }, 1000 / 12);

      // Sound

      function playVoz(event) {
        if (event.id == 'voz-dinopianito') {
          play('voz-dinopianito');
        }
      };

      if (createjs.Sound.PLAY_SUCCEEDED) {
        play('voz-dinopianito');
      };

      createjs.Sound.addEventListener('fileload', playVoz);

      function loadSounds() {
        createjs.Sound.registerSound('assets/sounds/voz-dinopianito.mp3', 'voz-dinopianito');
        createjs.Sound.registerSound('assets/sounds/score.mp3', 'score');
        createjs.Sound.registerSound('assets/sounds/kick.mp3', 'kick');
        createjs.Sound.registerSound('assets/sounds/snare.mp3', 'snare');
        createjs.Sound.registerSound('assets/sounds/hhc.mp3', 'hi-hat');
        createjs.Sound.registerSound('assets/sounds/hho.mp3', 'hi-hat-o');

        createjs.Sound.registerSound('assets/sounds/c.mp3', 'DO');
        createjs.Sound.registerSound('assets/sounds/d.mp3', 'RE');
        createjs.Sound.registerSound('assets/sounds/e.mp3', 'MI');
        createjs.Sound.registerSound('assets/sounds/f.mp3', 'FA');
        createjs.Sound.registerSound('assets/sounds/g.mp3', 'SOL');
        createjs.Sound.registerSound('assets/sounds/a.mp3', 'LA');
        createjs.Sound.registerSound('assets/sounds/b.mp3', 'SI');
      };

      // Counter

      let scrollingBackground = setInterval(function () {
        backScroll += 1;
        $('#first-canvas').css({
          'background-position': -backScroll * 5
        });
        frutiSprite.x -= speed;
        if (frutiSprite.x == -30) {
          frutiSprite.x = CANVAS.width;
        }
      }, 1000 / 24);

      let text = new createjs.Text(0, "20px Orbitron", "yellow");
      text.shadow = new createjs.Shadow("yellow", 0, 0, 30);
      text.y = 70;
      text.x = CANVAS.width / 2;
      text.textBaseline = 'middle';
      text.textAlign = 'center';
      text.scaleX = 2;
      text.scaleY = 2;
      stage.addChild(text);

      function updateCounter(add) {
        text.text += add;
        score = text.text;
      };

      setTimeout(function () {
        stage.removeAllChildren();
        stage.update();
        createjs.Sound.stop();
        $('#first-canvas').css({ 'background': 'none' });
        clearInterval(pianitoUpdate);
        clearInterval(scrollingBackground);
        nextLevelScreen();
      }, 45 * 1000);

      // Key pressed

      function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };

      let dinoPosition = dinoSprite.y;
      let jumpState = "up";

      $(document).keydown(function (event) {

        updateCounter(1);

        let keyPressed = event.which;

        // EATING FRUIT

        if (keyPressed === 85 || keyPressed === 73 || keyPressed === 73 || keyPressed === 79 || keyPressed === 80 || keyPressed === 65 || keyPressed === 83 || keyPressed === 68 || keyPressed === 70 || keyPressed === 71 || keyPressed === 72 || keyPressed === 74) {
          if (dinoSprite.y == dinoPosition) {
            let jump = setInterval(function () {
              if (dinoSprite.y == dinoPosition) {
                jumpState = "up";
              } else if (dinoSprite.y < 230) {
                jumpState = "down";
              }

              if (jumpState == "up") {
                dinoSprite.y -= 10;
              } else if (jumpState == "down") {
                dinoSprite.y += 3;
              }

              if (dinoSprite.y < 230) {
                if (frutiSprite.x < dinoSprite.x + 20 && frutiSprite.x > dinoSprite.x - 20) {
                  stage.removeChild(frutiSprite);
                  frutiSprite.x = randomIntFromInterval(600, 1200);
                  stage.addChild(frutiSprite);
                  play('score');
                  updateCounter(100);
                }
              }

              if (dinoSprite.y == dinoPosition && jumpState == 'down') {
                clearInterval(jump);
              }

              if (frutiSprite.x < 0) {
                frutiSprite.x = randomIntFromInterval(600, 1200);
              }
            }, 10);
          }
        };

        switch (keyPressed) {
          case 85:
            play('kick');
            draw(pianito.pianito_d1);
            break;
          case 73:
            play('snare');
            draw(pianito.pianito_d2);
            break;
          case 79:
            play('hi-hat');
            draw(pianito.pianito_d3);
            break;
          case 80:
            play('hi-hat-o');
            draw(pianito.pianito_d4);
            break;
          case 65:
            play('DO');
            draw(pianito.pianito_c);
            break;
          case 83:
            play('RE');
            draw(pianito.pianito_d);
            break;
          case 68:
            play('MI');
            draw(pianito.pianito_e);
            break;
          case 70:
            play('FA');
            draw(pianito.pianito_f);
            break;
          case 71:
            play('SOL');
            draw(pianito.pianito_g);
            break;
          case 72:
            play('LA');
            draw(pianito.pianito_a);
            break;
          case 74:
            play('SI');
            draw(pianito.pianito_b);
            break;
        }
      });
    };

    function nextLevelScreen() {

      ++level;

      let levelUpdate = new createjs.Bitmap('assets/img/level-update.png');
      levelUpdate.x = levelUpdate.y = 0;
      stage.addChild(levelUpdate);

      let scoreUpdateLevel = new createjs.Text(score, "20px Orbitron", "hotpink");
      scoreUpdateLevel.y = CANVAS.height / 2 + 55;
      scoreUpdateLevel.x = CANVAS.width / 2 + 115;
      scoreUpdateLevel.textBaseline = 'middle';
      scoreUpdateLevel.textAlign = 'center';
      scoreUpdateLevel.scaleX = 2;
      scoreUpdateLevel.scaleY = 2;
      stage.addChild(scoreUpdateLevel);

      setTimeout(function () {
        stage.removeAllChildren();
        showLevel(level);
      }, 1000 * 5);
    };
    function showLevel(level) {
      var graphics = new createjs.Graphics().beginFill("black").drawRect(0, 0, 600, 400);
      var shape = new createjs.Shape(graphics);

      var levelText = new createjs.Text('NIVEL ' + level, '40px arcadeRound', 'yellow');
      levelText.x = CANVAS.width / 2;
      levelText.y = CANVAS.height / 2;
      levelText.textAlign = 'center';
      levelText.textBaseline = 'middle';
      levelText.scaleY = levelText.scaleX = 1.6;

      stage.addChild(shape);
      stage.addChild(levelText);

      setTimeout(function () {
        stage.removeAllChildren();
        inGame(level, level * 10 / 2);
      }, 1000 * 3);
    };
    function loadBackCSS() {
      $('#first-canvas').css({
        'background': 'url("assets/img/back-dino.png")',
        'background-size': 'cover'
      });
    };
  } // Game() closing

  // Outside functions

  function loadFB() {
    (function (d, s, id) {
      var js,
          fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
    window.fbAsyncInit = function () {
      FB.init({
        appId: '841267929357321',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.9'
      });
      FB.AppEvents.logPageView();
    };
  };
  function loadML() {
    (function () {
      function $MPC_load() {
        window.$MPC_loaded !== true && function () {
          var s = document.createElement("script");s.type = "text/javascript";s.async = true;s.src = document.location.protocol + "//secure.mlstatic.com/mptools/render.js";var x = document.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);window.$MPC_loaded = true;
        }();
      }window.$MPC_loaded !== true ? window.attachEvent ? window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false) : null;
    })();
  };
}); // Full closing