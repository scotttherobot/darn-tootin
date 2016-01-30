enchant()

window.onload = function() {

   function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
   }

   var didWin = 0;
   var didLose = 0;

   var width = 800;
   var height = 800;
   var bird, sarah;
   var hitCount = 0;

   var game = new Game(width, height);
   game.preload('res/bird.gif', 'res/sarah.png', 
    'res/sarah_mirrored.png', 'res/national_anthem.wav',
    'res/america.jpg', 'res/coors.png',
    'res/fart.wav', 'res/beer.wav', 'res/shot.wav',
    'res/splat.wav', 'res/goodbyenormajean.wav');
   
   // Space bar == shoot
   game.keybind(32, "shoot");
   
   game.fps = 30;
   game.scale = 1;
      
   // The starting health value
   var health = 1000;
   // The starting BAC
   var bac = 0.0;
   
   // Put a health label
   var healthLabel = new Label("Sarah's Health: " + health);
   healthLabel.font = "20px Comic Sans MS";
   game.rootScene.addChild(healthLabel);
   
   // BAC label
   var bacLabel = new Label("Sarah's BAC: " + bac);
   bacLabel.font = "20px Comic Sans MS";
   bacLabel.y = healthLabel.y + (healthLabel.height * 2) + 20;
   game.rootScene.addChild(bacLabel);

   var updateHealth = function() {
      if (!didWin && !didLose) {
         healthLabel.text = "Sarah's Health: " + health;
         bacLabel.text = "Sarah's BAC: " + bac;
      }
      if (health >= 1200) {
         win();
      }
   }
   
   var win = function() {
      if (didWin) {
         return;
      }
      didWin = 1;

      // Remove the bird and sarah
      game.rootScene.removeChild(sarah);
      game.rootScene.removeChild(bird);
      
      // Play our glorious anthem
      game.assets['res/national_anthem.wav'].play();

      for (var n = 0; n < 10; n++) {
         var flag = new Flag();
         flag.tl.delay(n + n).then(function() {
            var left = getRandomInt(-800, 800);
            var right = getRandomInt(-800, 800);
            this.tl.moveBy(left, right, 90)
             .moveBy(-left, -right, 90)
             .loop();
         });
      }
      
      // Set the winning text
      game.rootScene.removeChild(healthLabel);
      game.rootScene.addChild(healthLabel);
      healthLabel.text = "YOU WON";
      healthLabel.font = "90px Comic Sans MS";
      healthLabel.width = width;
      healthLabel.y = height / 2;

      //game.stop();
   }
   
   var lose = function() {
      if (didLose) {
         return;
      }
      didLose = 1;

      // Play the song
      game.assets['res/goodbyenormajean.wav'].play();

      // Remove the bird and sarah
      game.rootScene.removeChild(sarah);
      game.rootScene.removeChild(bird);

      // Set the winning text
      game.rootScene.removeChild(healthLabel);
      game.rootScene.addChild(healthLabel);
      healthLabel.text = "R.I.P. A STRAY BULLET HIT YOU";
      healthLabel.font = "50px Comic Sans MS";
      healthLabel.width = width;
      healthLabel.y = height / 2;
   }

   var Bullet = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         enchant.Sprite.call(this, 5, 5);
         this.backgroundColor = "black";
         game.rootScene.addChild(this);
      }
   });
   
   var Poop = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         enchant.Sprite.call(this, 5, 5);
         this.backgroundColor = "green";
         game.rootScene.addChild(this);
      }
   });
   
   var Flag = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         enchant.Sprite.call(this, 500, 300);
         this.image = game.assets['res/america.jpg'];
         this.x = getRandomInt(0, width);
         game.rootScene.addChild(this);
      }
   });

   var Beer = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         enchant.Sprite.call(this, 27, 100);
         this.image = game.assets['res/coors.png'];
         this.rotate(getRandomInt(0, 180));
         game.rootScene.addChild(this);
      }
   });

   // The bird
   var Bird = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         // Make this sprite 32x32
         enchant.Sprite.call(this, 100, 100);
         // Set the image
         this.image = game.assets['res/bird.gif'];
         game.rootScene.addChild(this);
         this.lastX = this.x;
         this.dumps = 0;
      },
      onenterframe: function() {
         // Drop a beer
         if (this.dumps >= 4) {
            var beer = new Beer();
            beer.x = this.x;
            beer.y = this.y + 100;
            beer.tl.moveBy(15, 800, 75);
            this.dumps = 0;
         }
         // Take a shit every 100 pixels
         if (Math.abs(this.lastX - this.x) > 200) {
            console.log("poop");
            var poop = new Poop();
            poop.x = this.x;
            poop.y = this.y + 100;
            poop.tl.moveBy(5, 800, 90);
            //game.assets['res/fart.wav'].play();
            this.lastX = this.x;
            this.dumps++;
         }
      }
   });
   
   var Sarah = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         enchant.Sprite.call(this, 170, 400);
         this.image = game.assets['res/sarah.png'];
         game.rootScene.addChild(this);
         this.facing = "right";
      },
      onenterframe: function() {
         var moveSpeed = 10;
         if (game.input.left && !game.input.right) {
            // Move left.
            this.x = this.x -= moveSpeed;
            this.image = game.assets['res/sarah_mirrored.png'];
            this.facing = "left";

            // If she's a DAB, rotate her
            var rotateSarah = (getRandomInt(-10, 10) * bac);
            this.rotate(rotateSarah);
         } 
         else if (game.input.right && !game.input.left) {
            // Move right.
            this.x = this.x += moveSpeed;
            this.image = game.assets['res/sarah.png'];
            this.facing = "right";

            // If she's a DAB, rotate her
            var rotateSarah = (getRandomInt(-10, 10) * bac);
            this.rotate(rotateSarah);
         }
         if (game.input.shoot) {
            // Shoot.
            console.log("Pew pew!");
            var bullet = new Bullet();
            bullet.rotate(45);
            if (this.facing == "right") {
               bullet.x = this.x + this.width + 5;
               bullet.y = this.y - 5;
               bullet.tl.moveBy(
                800 + (getRandomInt(-1, 1) *(bac * 6000)),
               -800 + (getRandomInt(-1, 1) *(bac * 6000)),
               90);
            } else {
               bullet.x = this.x - 5;
               bullet.y = this.y - 5;
               bullet.tl.moveBy(
               -800 + (getRandomInt(-1, 1) *(bac * 6000)),
               -800 + (getRandomInt(-1, 1) *(bac * 6000)),
               90);
            }
         }
      }
   });


   game.onload = function () {
      console.log("Game loaded.");
      
      // Put a bird
      bird = new Bird();
      bird.x = 0;
      bird.y = 10;
      bird.tl.moveBy(width - 100, 0, 90)
       .scaleTo(-1.5, 1.5, 10)
       .moveBy(-width + 100, 0, 90)
       .scaleTo(1, 1, 10)
       .loop();
       
      // Put a Sarah
      sarah = new Sarah();
      sarah.x = 10;
      sarah.y = height - 400;

      // Detect collisions
      game.rootScene.on('enterframe', function() {
         var birdHits = Bullet.intersect(Bird);
         for (var i = 0, len = birdHits.length; i < len; i++) {
            //console.log("hit!");
            game.rootScene.removeChild(birdHits[i][0]);
            health += 1;
            hitCount++;

            if (hitCount >= 50 && bac) {
               bac -= 0.016;
            }
         }
         
         var poopHits = Poop.intersect(Sarah);
         for (var i = 0, len = poopHits.length; i < len; i++) {
            //console.log("Sarah got shitted on!");
            game.rootScene.removeChild(poopHits[i][0]);
            game.assets['res/splat.wav'].play();
            health -= 5;
         }

         var beerHits = Beer.intersect(Sarah);
         for (var i = 0, len = beerHits.length; i < len; i++) {
            //console.log("Sarah got a beer on!");
            game.rootScene.removeChild(beerHits[i][0]);
            game.assets['res/beer.wav'].play();
            bac += 0.016;
         }

         var sarahHits = Bullet.intersect(Sarah);
         for (var i = 0, len = sarahHits.length; i < len; i++) {
            //console.log("hit!");
            game.rootScene.removeChild(sarahHits[i][0]);
            //health += 1;
            //game.stop();
            lose();
         }

         updateHealth();
      });
      
   }
   game.start();

}