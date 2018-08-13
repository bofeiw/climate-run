var Game = function() {
    this.time = 0;
    this.sceneMoving = false;
};

Game.prototype.startCountingScore = function() {
    this.counter = setInterval(
        function() {
            this.time++;
            $('.result').html('POINTS: ' + this.time);
        }.bind(this),
        1000
    );
};

Game.prototype.collisionCheck = function() {
    setInterval(
        function() {
            var ostrich = $('.ostrich-moving');
            var smallEgg = $('.egg-small');
            var bigEgg = $('.egg-big');
            if (collide(ostrich, smallEgg) || collide(ostrich, bigEgg)) this.gameStop();
        }.bind(this),
        500
    );
};

Game.prototype.startMoving = function() {
    $('.ostrich-standing').addClass('hidden');
    $('.ostrich-moving').removeClass('hidden');
    $('.city-img').css('animation', 'Slide 3000s linear infinite');
    $('.egg-small').css('display', 'block');
    this.sceneMoving = true;

    setTimeout(function() {
        $('.egg-big').css('display', 'block');
    }, 4000);
};

Game.prototype.gameStop = function() {
    this.sceneMoving = false;

    $('.ostrich-standing').removeClass('hidden');
    $('.ostrich-moving').addClass('hidden');
    $('.city-img').css('animation', 'none');
    // $('.egg-small').css('display', 'none');
    // $('.egg-big').css('display', 'none');
    setTimeout(function() {
        $('html, body').animate(
            {
                scrollTop: $('#game-over').offset().top
            },
            2000
        );
    }, 500);

    clearInterval(this.counter);

    $('.final-result').html('POINTS: ' + this.time);
    this.time = 0;
    $('.result').html('POINTS: ' + this.time);
};

Game.prototype.jumping = function() {
    $('.ostrich-moving').addClass('jump');

    setTimeout(function() {
        $('.ostrich-moving').removeClass('jump');
    }, 1000);
};

function collide(objOne, objTwo) {
    var bird = objOne;
    var obstacle = objTwo;

    var birdX = bird.offset().left;
    var birdW = bird.width() - 35;
    var birdY = bird.offset().top;
    var birdH = bird.height();

    var obstacleX = obstacle.offset().left;
    var obstacleW = obstacle.width();
    var obstacleY = obstacle.offset().top;
    var obstacleH = obstacle.height();

    if (
        birdY + birdH < obstacleY ||
        birdY > obstacleY + obstacleH ||
        birdX > obstacleX + obstacleW ||
        birdX + birdW < obstacleX
    ) {
        return false;
    } else {
        return true;
    }
}
