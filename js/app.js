
$(function() {

  var div = $('<div></div>');
  var board = $('#board');

  var cols = 40;
  var rows = 40;
  var pixels = [];

  for (var i=0; i<rows*cols; i++) {
    pixels[i] = div.clone();
    board.append(pixels[i]);
  }

  function getPixelAt(pixel) {
    var index = (pixel.y * rows) + pixel.x;
    return $(pixels[index]);
  }

  var snake = [];
  var snakeLength = 1;
  var headPixel = {x: snakeLength-1, y: 0};

  for (var i=0; i<snakeLength; i++) {
    var pos = {x: i+10, y: 20};
    snake.push(pos);
    getPixelAt(pos).addClass('alive');
  }

  function logSnake() {
    var str = '';
    for (var i=0; i<snake.length; i++) {
      str += '(' + snake[i].x + ',' + snake[i].y + ')';
    }
    console.log(str);
  }

  var directions = {
    l: {x: -1,  y: 1}, // left
    r: {x:  1,  y:  1}, // right
    u: {x:  0,  y: -1}, // up
    d: {x:  0,  y:  1}  // down
    // l: {x: -1,  y:  0}, // left
    // u: {x:  0,  y: -1}, // up
    // r: {x:  1,  y:  0}, // right
    // d: {x:  0,  y:  1}  // down
  };

  var currentDirection = 'r';

  function createHead() {
    var headCoords = addCoordinates(snake[snake.length-1], directions[currentDirection]);
    if (goingOutOfBounds(headCoords)) {
      headCoords = getOppositePixel(headCoords);
    }
    return headCoords;
  }

  function addCoordinates(a, b) {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  }

  $(document).on('keydown', function(event) {
    var code = event.keyCode;
    if (code == 37 && currentDirection != 'r') {
      currentDirection = 'l';
    }
    else if (code == 38 && currentDirection != 'd') {
      currentDirection = 'u';
    }
    else if (code == 39 && currentDirection != 'l') {
      currentDirection = 'r';
    }
    else if (code == 40 && currentDirection != 'u') {
      currentDirection = 'd';
    }
    return false;
  });

  var foodCoordinate = randomFoodCoordinate();
  var foodDiv = getPixelAt(foodCoordinate).toggleClass('food');

  var isOutOfBounds = false;

  function goingOutOfBounds(a) {
    var aX = (a.x - (cols/2));
    var aY = (a.y - (rows/2));

    var distance = Math.sqrt(aX*aX + aY*aY);

    if (distance > (cols/2)) {
      if (!isOutOfBounds) {
        // isOutOfBounds = true;
        return true;
      }
    }
    else {
      // isOutOfBounds = false;
    }
    return false;

    //
    // if ((a.y == rows - snake.length && currentDirection == 'u')
    //  || (a.y == rows + snake.length && currentDirection == 'd')) {
    //   return true;
    // }
    // return false;
  }

  function checkCollision(a, list) {
    for (var i=0; i<list.length; i++) {
      if (a.x == list[i].x && a.y == list[i].y) {
        return true;
      }
    }
    return false;
  }

  function randomCoordinate() {
    return {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols)
    };
  }


  function randomFoodCoordinate() {
    var theta, r, cX, xY;
    theta = Math.random() * 2 * Math.PI;
    r = Math.random() * (cols/2 - 4);
    cX = Math.round(r * Math.cos(theta)) + cols/2;
    cY = Math.round(r * Math.sin(theta)) + rows/2;
    return {x: cX, y: cY};
  }


  function score (){
    checkCollision
  }

  function getOppositePixel(pixel) {
   var cX = pixel.x - cols/2;
   var cY = pixel.y - cols/2;
   var r = cols/2;

   var theta = Math.atan2(cY, cX) + Math.PI;
   var x = Math.min(Math.round(r * Math.cos(theta)) + cols/2,
   rows-1);
   var y = Math.min(Math.round(r * Math.sin(theta)) + rows/2,
   cols-1);

   return {x: x, y: y};
 }

  setInterval(function() {
    var head = createHead();

    // if (head.x === -snake.length) {
    // }

    // if (goingOutOfBounds(head)) {
      // $('#message').text("fishy bsns!").show().fadeOut(5000);
    // }

    if (checkCollision(head, snake)) {
      alert('you died');
    }
    if (checkCollision(head, [foodCoordinate])) {
      foodDiv.removeClass('food');

      do {
        foodCoordinate = randomFoodCoordinate();
      }
      while (checkCollision(foodCoordinate, snake));

      foodDiv = getPixelAt(foodCoordinate).toggleClass('food');
    }
    else {
      getPixelAt(snake.shift()).toggleClass('alive');
    }
    snake.push(head);
    getPixelAt(head).toggleClass('alive');

  }, 100);

});
