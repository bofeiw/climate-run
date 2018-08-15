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
    $('.grass-small').css('display', 'block');
    this.sceneMoving = true;

    this.audio = new Audio('./sound/music.mp3');
    this.audio.play();
    this.audio.volume = 0.05;
    this.audio.loop = true;

    setTimeout(function() {
        $('.grass-big').css('display', 'block');
    }, 4000);

    this.eggInterval = setInterval(function() {
        $('.egg').css('display', 'block');
        setTimeout(function() {
            $('.egg').css('display', 'none');
        }, 6500);
    }, 14000);
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
            var smallGrass = $('.grass-small');
            var bigGrass = $('.grass-big');
            var eggBonus = $('.egg');

            if (collide(ostrich, eggBonus)) {
                this.lastLostLife = currentTime;
                this.lives++;
                $('.lives').html(this.lives);
                $('.egg').css('display', 'none');

                this.bonus = new Audio('./sound/bonus.mp3');
                this.bonus.play();
                this.bonus.volume = 0.5;
            } else if (collide(ostrich, smallGrass) || collide(ostrich, bigGrass)) {
                this.lastLostLife = currentTime;
                this.lives--;
                $('.lives').html(this.lives);
                $('.ostrich-moving').addClass('lose-life');

                this.failure = new Audio('./sound/life-lost.mp3');
                this.failure.play();
                this.failure.volume = 0.1;

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
    $('.grass-small').css('display', 'none');
    $('.grass-big').css('display', 'none');
    $('.egg').css('display', 'none');
    clearInterval(this.eggInterval);

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
    var birdH = bird.height() - 5;

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
