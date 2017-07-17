'use strict';

$(document).ready(function () {

  Game();

  function Game() {

    function play(sound) {
      createjs.Sound.play(sound);
    };

    const CANVAS = {
      width: $('#mobile-canvas').width(),
      height: $('#mobile-canvas').height()
    };

    let queue = new createjs.LoadQueue();

    const FILENAMES = [
    // Bitmaps
    '04B_30__.TTF', 'logo-dinopianito.png', 'd1.png', 'd2.png', 'd3.png', 'd4.png', 'c1.png', 'd.png', 'e.png', 'f.png', 'g.png', 'a.png', 'b.png', 'c2.png', 'loading.png', 'back-dino.png',
    // Sounds
    'score.mp3', 'voz-dinopianito.mp3', 'kick.mp3', 'snare.mp3', 'hhc.mp3', 'hho.mp3', 'c.mp3', 'd.mp3', 'e.mp3', 'f.mp3', 'g.mp3', 'a.mp3', 'b.mp3'];

    let loader = new Array();

    function sortFiles(filename) {
      var imgRegExp = new RegExp(/png/g);
      var soundRegExp = new RegExp(/mp3/g);
      var fontRegExp = new RegExp(/TTF/g);

      var isImage = imgRegExp.test(filename);
      var isSound = soundRegExp.test(filename);
      var isFont = fontRegExp.test(filename);

      if (isImage) {
        let filepath = 'assets/img/' + filename;
        return filepath;
      } else if (isSound) {
        let filepath = 'assets/sounds/' + filename;
        return filepath;
      } else if (isFont) {
        let filepath = 'assets/fonts/' + filename;
        return filepath;
      }
    }

    let loadedFiles = new Array();

    for (let value in FILENAMES) {
      loadedFiles.push(sortFiles(FILENAMES[value]));
    }

    queue.loadManifest(loadedFiles);

    let stage = new createjs.Stage("mobile-canvas");
    createjs.Touch.enable(stage);
    createjs.Ticker.addEventListener("tick",handleTick);
    function handleTick()
    {
      stage.update();
    }

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
        $('#mobile-canvas').css({ 'background': 'black' });
      }
      stage.update();
    });
    queue.on('complete', intro, this);

    function intro() {

      let assets = {
        eiko: new createjs.Bitmap('assets/img/eiko.png'),
        logo: new createjs.Bitmap('assets/img/intro.png')
      };

      for (let each in assets) {
        assets[each].x = assets[each].y = 0;
        assets[each].alpha = 0;
      }

      fadeInOut(assets.eiko, 2, stage);
      setTimeout(function()
      {
        fadeInOut(assets.logo, 3, stage);
        setTimeout(function()
        {
          start();
        }, 1000 * 5)
      }, 1000 * 4)
    }

    function start() {
      console.log('Game started')
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

      $('#mobile-canvas').css({
        'background': 'url("assets/img/back-dino.png")',
        'background-size': 'cover'
      });

      stage.addChild(assets.startMessage);

      assets.startMessage.addEventListener('mousedown', function (event) {
        stage.removeChild(assets.startMessage);
        showLevel(level);
        $('body').off();
        $('#mobile-canvas').css({ 'background': 'none' });
      });
    };

    function inGame(level, speed) {

      let pianoOverlays = {
        o_c: new createjs.Graphics().beginFill("white").drawRect(0,CANVAS.height - 100, 61, 135),
        o_d: new createjs.Graphics().beginFill("white").drawRect(61,CANVAS.height - 100, 61, 135),
        o_e: new createjs.Graphics().beginFill("white").drawRect(61 * 2,CANVAS.height - 100, 61, 135),
        o_f: new createjs.Graphics().beginFill("white").drawRect(61 * 3,CANVAS.height - 100, 61, 135),
        o_g: new createjs.Graphics().beginFill("white").drawRect(61 * 4,CANVAS.height - 100, 61, 135),
        o_a: new createjs.Graphics().beginFill("white").drawRect(61 * 5,CANVAS.height - 100, 61, 135),
        o_b: new createjs.Graphics().beginFill("white").drawRect(61 * 6,CANVAS.height - 100, 61, 135),
        o_C: new createjs.Graphics().beginFill("white").drawRect(61 * 7,CANVAS.height - 100, 61, 135),
        o_d1: new createjs.Graphics().beginFill("white").drawRect(CANVAS.width - 172, CANVAS.height - 96, 103, 56),
        o_d2: new createjs.Graphics().beginFill("white").drawRect(CANVAS.width - 172, CANVAS.height - 30, 103, 56),
        o_d3: new createjs.Graphics().beginFill("white").drawRect(CANVAS.width - 59, CANVAS.height - 96, 103, 56),
        o_d4: new createjs.Graphics().beginFill("white").drawRect(CANVAS.width - 59, CANVAS.height - 30, 103, 56)
      }

      let pianoOShapes =
      {
      o_cShape: new createjs.Shape(pianoOverlays.o_c),
      o_dShape: new createjs.Shape(pianoOverlays.o_d),
      o_eShape: new createjs.Shape(pianoOverlays.o_e),
      o_fShape: new createjs.Shape(pianoOverlays.o_f),
      o_gShape: new createjs.Shape(pianoOverlays.o_g),
      o_aShape: new createjs.Shape(pianoOverlays.o_a),
      o_bShape: new createjs.Shape(pianoOverlays.o_b),
      o_CShape: new createjs.Shape(pianoOverlays.o_C),
      o_d1Shape: new createjs.Shape(pianoOverlays.o_d1),
      o_d2Shape: new createjs.Shape(pianoOverlays.o_d2),
      o_d3Shape: new createjs.Shape(pianoOverlays.o_d3),
      o_d4Shape: new createjs.Shape(pianoOverlays.o_d4),
      }

      for (let each in pianoOShapes)
      {
        pianoOShapes[each].alpha = 0.1;
      }

      let inGameAssets = {
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
        pianito_c1: new createjs.Bitmap('assets/img/c1.png'),
        pianito_d: new createjs.Bitmap('assets/img/d.png'),
        pianito_e: new createjs.Bitmap('assets/img/e.png'),
        pianito_f: new createjs.Bitmap('assets/img/f.png'),
        pianito_g: new createjs.Bitmap('assets/img/g.png'),
        pianito_a: new createjs.Bitmap('assets/img/a.png'),
        pianito_b: new createjs.Bitmap('assets/img/b.png'),
        pianito_c2: new createjs.Bitmap('assets/img/c2.png')
      };

      for (let each in pianito) {
        pianito[each].x = pianito[each].y = 0;
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

      inGameAssets.segundero.x = CANVAS.width - 100;
      inGameAssets.segundero.y = 30;

      stage.addChild(inGameAssets.segundero);

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

      frutiSprite.x = randomIntFromInterval(600, 800);
      frutiSprite.y = 100;
      frutiSprite.framerate = 1000 / 24;
      frutiSprite.scaleX = frutiSprite.scaleY = 0.7;

      dinoSprite.x = CANVAS.width / 5;
      dinoSprite.y = CANVAS.height / 2 - 20;
      dinoSprite.framerate = 100;
      dinoSprite.scaleX = dinoSprite.scaleY = 1.5;

      stage.addChild(frutiSprite);
      stage.addChild(dinoSprite);

      loadBackCSS();

      let backScroll = 0;

      let currentNote = pianito.pianitoDefault;

      function draw(note) {
        currentNote = note;
      };

      let pianitoUpdate = setInterval(function () {
        stage.addChild(currentNote);
        for (let each in pianoOShapes)
        {
          stage.addChild(pianoOShapes[each])
        }
        currentNote = pianito.pianitoDefault;
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
        $('#mobile-canvas').css({
          'background-position': -backScroll * 5 + 'px 270px'
        });
        frutiSprite.x -= speed;
        if (frutiSprite.x == -30) {
          frutiSprite.x = CANVAS.width;
        }
      }, 1000 / 24);

      let text = new createjs.Text(0, "20px Orbitron", "yellow");
      text.shadow = new createjs.Shadow("yellow", 0, 0, 30);
      text.y = 30;
      text.x = CANVAS.width / 2;
      text.textBaseline = 'middle';
      text.textAlign = 'center';
      text.scaleX = 1.5;
      text.scaleY = 1.5;
      stage.addChild(text);

      function updateCounter(add) {
        text.text += add;
        score = text.text;
      };

      setTimeout(function () {
        stage.removeAllChildren();
        stage.update();
        createjs.Sound.stop();
        $('#mobile-canvas').css({ 'background': 'none' });
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

      function jump()
      {
        let jump = setInterval(function () {
          if (dinoSprite.y == dinoPosition) {
            jumpState = "up";
          } else if (dinoSprite.y < 65) {
            jumpState = "down";
          }

          if (jumpState == "up") {
            dinoSprite.y -= 10;
          } else if (jumpState == "down") {
            dinoSprite.y += 5;
          }

          if (dinoSprite.y < 70) {
            if (frutiSprite.x < dinoSprite.x + 20 && frutiSprite.x > dinoSprite.x - 20) {
              stage.removeChild(frutiSprite);
              frutiSprite.x = randomIntFromInterval(CANVAS.width + 10, CANVAS.width + 30);
              stage.addChild(frutiSprite);
              play('score');
              updateCounter(100);
            }
          }

          if (dinoSprite.y == dinoPosition && jumpState == 'down') {
            clearInterval(jump);
          }

          if (frutiSprite.x < 0) {
            frutiSprite.x = randomIntFromInterval(CANVAS.width + 10, CANVAS.width + 30);
          }
        }, 10);
      }

      pianoOShapes.o_cShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('DO');
        draw(pianito.pianito_c1);
      })
      pianoOShapes.o_dShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('RE');
        draw(pianito.pianito_d);
      })
      pianoOShapes.o_eShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('MI');
        draw(pianito.pianito_e);
      })
      pianoOShapes.o_fShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('FA');
        draw(pianito.pianito_f);
      })
      pianoOShapes.o_gShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('SOL');
        draw(pianito.pianito_g);
      })
      pianoOShapes.o_aShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('LA');
        draw(pianito.pianito_a);
      })
      pianoOShapes.o_bShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('SI');
        draw(pianito.pianito_b);
      })
      pianoOShapes.o_CShape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('DOM');
        draw(pianito.pianito_c2);
      })
      pianoOShapes.o_d1Shape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('kick');
        draw(pianito.pianito_d1);
      })
      pianoOShapes.o_d3Shape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('snare');
        draw(pianito.pianito_d2);
      })
      pianoOShapes.o_d2Shape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('hi-hat');
        draw(pianito.pianito_d3);
      })
      pianoOShapes.o_d4Shape.addEventListener('mousedown',function(event)
      {
        updateCounter(1)
        jump();
        play('hi-hat-o');
        draw(pianito.pianito_d4);
      })




      $(document).keydown(function (event) {

        ;

        let keyPressed = event.which;

        // EATING FRUIT

        if (keyPressed === 85 || keyPressed === 73 || keyPressed === 73 || keyPressed === 79 || keyPressed === 80 || keyPressed === 65 || keyPressed === 83 || keyPressed === 68 || keyPressed === 70 || keyPressed === 71 || keyPressed === 72 || keyPressed === 74) {
          if (dinoSprite.y == dinoPosition) {
            jump();
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
      $('#mobile-canvas').css({
        'background': 'url("assets/img/back-dino.png")',
        'background-size': 'cover',
        'background-position': '0px -271px'
      });
    };
  } // Game() closing

  // Outside functions

  function jump()
  {

  }

  function fadeInOut(asset, duration, stage)
  {
    stage.addChild(asset)
      stage.addChild(asset)
      createjs.Tween.get(asset).to({alpha: 1}, 1000);
      setTimeout(function()
      {
        createjs.Tween.get(asset).to({alpha: 0}, 1000);
      }, 1000 * duration)
  }

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