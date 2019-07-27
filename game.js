const speed = 30;

id = 0;
let co2idPrefix = "co2";

var Game = function () {
    this.time = 0;
    this.sceneMoving = false;
    this.canPlay = false;
    this.lives = 3;
    this.lastLostLife = 0;
};

Game.prototype.startCountingScore = function () {
    this.counter = setInterval(
        function () {
            this.time++;
            $('.result').html('POINTS: ' + this.time);
            if (Math.random() > 0.7) {
                addObstacles(this.time);
            }
        }.bind(this),
        1000
    );
};

Game.prototype.startMoving = function () {
    $('.ostrich-standing').addClass('hidden');
    $('.ostrich-moving').removeClass('hidden');
    // $('.city-img').css('animation', 'Slide 2500s linear infinite');
    $('.grass-small').css('display', 'block');
    this.sceneMoving = true;

    this.audio = new Audio('./sound/music.mp3');
    this.audio.play();
    this.audio.volume = 0.14;
    this.audio.loop = true;

    setTimeout(function () {
        $('.grass-big').css('display', 'block');
    }, 4000);

    this.eggInterval = setInterval(function () {
        $('.egg').css('display', 'block');
        setTimeout(function () {
            $('.egg').css('display', 'none');
        }, 6500);
    }, 14000);
};

Game.prototype.jumping = function () {
    if (!$('.ostrich-moving').hasClass('jump')) {
        $('.ostrich-moving').addClass('jump');

        setTimeout(function () {
            $('.ostrich-moving').removeClass('jump');
        }, 1000);
    }
};

Game.prototype.moveLeft = function () {
    const ostrich = $('.ostrich-moving');
    const position = ostrich.position();
    const x = position.left;
    const nextX = x - speed;
    ostrich.css({left: nextX});
};

Game.prototype.moveRight = function () {
    const ostrich = $('.ostrich-moving');
    const position = ostrich.position();
    const x = position.left;
    const nextX = x + speed;
    ostrich.css({left: nextX});
};

Game.prototype.collisionCheck = function () {
    this.collideInterval = setInterval(
        function () {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastLostLife < 1000) {
                return;
            }

            var ostrich = $('.ostrich-moving');
            var smallGrass = $('.grass-small');
            var bigGrass = $('.grass-big');
            var thinGrass = $('.grass-thin');
            var bigGrassSecond = $('.grass-big-second');
            var eggBonus = $('.egg');
            var doubleGrass = $('.grass-double');

            if (collide(ostrich, eggBonus)) {
                this.lastLostLife = currentTime;
                this.lives++;
                $('.lives').html(this.lives);
                $('.egg').css('display', 'none');

                this.bonus = new Audio('./sound/bonus.mp3');
                this.bonus.play();
                this.bonus.volume = 0.6;
            } else if (
                1 == 0
                // collide(ostrich, smallGrass) ||
                // collide(ostrich, bigGrass) ||
                // collide(ostrich, bigGrassSecond) ||
                // collide(ostrich, thinGrass) ||
                // !collide(ostrich, doubleGrass)
            ) {
                this.lastLostLife = currentTime;
                this.lives--;
                $('.lives').html(this.lives);
                $('.ostrich-moving').addClass('lose-life');

                this.failure = new Audio('./sound/life-lost.mp3');
                this.failure.play();
                this.failure.volume = 0.2;

                setTimeout(
                    function () {
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

Game.prototype.gameStop = function () {
    this.canPlay = false;
    this.sceneMoving = false;
    clearInterval(this.collideInterval);
    this.audio.pause();

    $('.ostrich-down').removeClass('hidden');
    $('.ostrich-moving').addClass('hidden');
    $('.city-img').css('animation', 'none');
    $('.grass-small').css('display', 'none');
    $('.grass-big').css('display', 'none');
    $('.grass-big-second').css('display', 'none');
    $('.grass-thin').css('display', 'none');
    $('.grass-double').css('display', 'none');
    $('.egg').css('display', 'none');
    clearInterval(this.eggInterval);

    setTimeout(function () {
        $('.game').css({
            transform: 'translateY(-100%)'
        });

        $('.game-over').css({
            transform: 'translateY(0)'
        });
    }, 2500);

    clearInterval(this.counter);
    $('.final-result').html('POINTS: ' + this.time);

    setTimeout(
        function () {
            this.time = 0;
            $('.result').html('POINTS: ' + this.time);

            this.lives = 3;
            $('.lives').html(this.lives);

            $('.ostrich-down').addClass('hidden');
            $('.ostrich-standing').removeClass('hidden');
        }.bind(this),
        3000
    );
};

function collide(objOne, objTwo) {
    var bird = objOne;
    var obstacle = objTwo;

    var birdX = bird.offset().left;
    var birdW = bird.width() - 28;
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

function createTree(x) {
    const tree = $(`<img alt="tree" src="img/tree.png" class="tree">`);
    tree.css({left: x});
    return tree;
}

function plantTree() {
    // console.log("pantTree");
    const ostrich = $('.ostrich-moving');
    const deserts = $('.desert');
    for (let i = 0; i < deserts.length; ++i) {
        const desert = deserts[i];
        // console.log(desert.id);
        const desertTrue = $(`#${desert.id}`);
        if (collide(ostrich, desertTrue)) {
            desertTrue.remove();
            $('#game').append(createTree(ostrich.position().left));
            return;
        }
    }
}

function createDessert(x) {
    const desert = $(`<img alt="desert" src="img/desert.png" class="desert" id=${++id}>`);
    desert.css({left: x});
    return desert;
}

function createCO2(x) {
    const co2 = $(`<img alt="co2" src="img/co2.png" class="co2" id="co2idPrefix" + "${id}">`);
    co2.css({left: x + 50});
    return co2;
}


function addObstacles(time) {
    const limitRight = $(window).width();
    const x = Math.random() * limitRight;
    const desert = createDessert(x);
    $('#game').append(desert);
    if(time % 2 == 0){
        const co2 = createCO2(x);
        $('#game').append(co2);
    }
}
