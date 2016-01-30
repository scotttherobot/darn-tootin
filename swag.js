enchant()

window.onload = function() {

   var width = 800;
   var height = 800;

   var game = new Game(width, height);
   game.preload('res/bird.gif');
   
   game.fps = 30;
   game.scale = 1;

   // The bird
   var Bird = enchant.Class.create(enchant.Sprite, {
      initialize: function() {
         // Make this sprite 32x32
         enchant.Sprite.call(this, 100, 100);
         // Set the image
         this.image = game.assets['res/bird.gif'];
         game.rootScene.addChild(this);
      }
   });


   game.onload = function () {
      console.log("Game loaded.");
      
      var bird = new Bird();
      bird.x = 0;
      bird.y = 0;
      bird.tl.moveBy(width - 100, 10, 90)
       .scaleTo(-1.5, 1.5, 10)
       .moveBy(-width + 100, 0, 90)
       .scaleTo(1, 1, 10)
       .loop();
   }
   game.start();

}