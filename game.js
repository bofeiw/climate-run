var Game = function() {
    this.time = 0;
    this.sceneMoving = false;
    this.canPlay = false;
    this.lives = 3;
    this.lastLostLife = 0;
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

Game.prototype.startMoving = function() {
    $('.ostrich-standing').addClass('hidden');
    $('.ostrich-moving').removeClass('hidden');
    $('.city-img').css('animation', 'Slide 3000s linear infinite');
    $('.egg-small').css('display', 'block');
    this.sceneMoving = true;

    this.audio = new Audio('./music.mp3');
    this.audio.play();
    this.audio.volume = 0.05;

    setTimeout(function() {
        $('.egg-big').css('display', 'block');
    }, 4000);

    setInterval(function() {
        $('.grass').css('display', 'block');
        setTimeout(function() {
            $('.grass').css('display', 'none');
        }, 6500);
    }, 12000);
};

Game.prototype.jumping = function() {
    if (!$('.ostrich-moving').hasClass('jump')) {
        $('.ostrich-moving').addClass('jump');

        setTimeout(function() {
            $('.ostrich-moving').removeClass('jump');
        }, 1000);
    }
};

Game.prototype.collisionCheck = function() {
    this.collideInterval = setInterval(
        function() {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastLostLife < 1000) {
                return;
            }

            var ostrich = $('.ostrich-moving');
            var smallEgg = $('.egg-small');
            var bigEgg = $('.egg-big');
            if (collide(ostrich, smallEgg) || collide(ostrich, bigEgg)) {
                this.lastLostLife = currentTime;
                this.lives--;
                $('.lives').html(this.lives);
                $('.ostrich-moving').addClass('lose-life');

                setTimeout(
                    function() {
                        $('.ostrich-moving').removeClass('lose-life');
                    }.bind(this),
                    1000
                );

                if (this.lives < 1) {
                    this.gameStop();
                }
            }
        }.bind(this),
        50
    );
};

Game.prototype.gameStop = function() {
    this.canPlay = false;
    this.sceneMoving = false;
    clearInterval(this.collideInterval);
    this.audio.pause();

    $('.ostrich-standing').removeClass('hidden');
    $('.ostrich-moving').addClass('hidden');
    $('.city-img').css('animation', 'none');
    $('.egg-small').css('display', 'none');
    $('.egg-big').css('display', 'none');

    setTimeout(function() {
        $('.game').css({
            transform: 'translateY(-100%)'
        });

        $('.game-over').css({
            transform: 'translateY(0)'
        });
    }, 500);

    clearInterval(this.counter);
    $('.final-result').html('POINTS: ' + this.time);

    setTimeout(
        function() {
            this.time = 0;
            $('.result').html('POINTS: ' + this.time);

            this.lives = 3;
            $('.lives').html(this.lives);
        }.bind(this),
        2000
    );
};

function collide(objOne, objTwo) {
    var bird = objOne;
    var obstacle = objTwo;

    var birdX = bird.offset().left;
    var birdW = bird.width() - 30;
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
