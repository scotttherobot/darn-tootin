enchant()

window.onload = function() {

   function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
   }

   var didWin = 0;

   var width = 800;
   var height = 800;
   var bird, sarah;

   var game = new Game(width, height);
   game.preload('res/bird.gif', 'res/sarah.png', 
    'res/sarah_mirrored.png', 'res/national_anthem.wav',
    'res/america.jpg');
   
   game.keybind(32, "shoot");
   
   game.fps = 30;
   game.scale = 1;
      
   // The starting health value
   var health = 1000;
   
   // Put a health label
   var healthLabel = new Label("Health: " + health);
   healthLabel.font = "20px Comic Sans MS";
   game.rootScene.addChild(healthLabel);
   
   var updateHealth = function() {
      if (!didWin) {
         healthLabel.text = "Health: " + health;
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

   // The bird
   var Bird = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         // Make this sprite 32x32
         enchant.Sprite.call(this, 100, 100);
         // Set the image
         this.image = game.assets['res/bird.gif'];
         game.rootScene.addChild(this);
         this.lastX = this.x;
      },
      onenterframe: function() {
         // Take a shit every 100 pixels
         if (Math.abs(this.lastX - this.x) > 200) {
            console.log("poop");
            var poop = new Poop();
            poop.x = this.x;
            poop.y = this.y + 200;
            poop.tl.moveBy(0, 800, 90);
            this.lastX = this.x;
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
         } 
         else if (game.input.right && !game.input.left) {
            // Move right.
            this.x = this.x += moveSpeed;
            this.image = game.assets['res/sarah.png'];
            this.facing = "right";
         }
         else if (game.input.shoot) {
            // Shoot.
            console.log("Pew pew!");
            var bullet = new Bullet();
            bullet.rotate(45);
            if (this.facing == "right") {
               bullet.x = this.x + this.width;
               bullet.y = this.y;
               bullet.tl.moveBy(800, -800, 90);
            } else {
               bullet.x = this.x;
               bullet.y = this.y;
               bullet.tl.moveBy(-800, -800, 90);
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
            health += 1;
         }
         
         var poopHits = Poop.intersect(Sarah);
         for (var i = 0, len = poopHits.length; i < len; i++) {
            //console.log("Sarah got shitted on!");
            health -= 5;
         }
         
         updateHealth();
      });
      
   }
   game.start();

}