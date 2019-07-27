const speed = 30;

id = 0;
let co2idPrefix = "co2";

var Game = function () {
    this.time = 0;
    this.sceneMoving = false;
    this.canPlay = false;
    this.lives = 30;
    this.lastLostLife = 0;
    this.audioStarted = false;
};

Game.prototype.addLives =function () {
    this.lives++;
    $('.lives').html(this.lives);
};
//var lives = 3;
var ostrich = document.getElementsByClassName('ostrich-moving')[0];
var x = 40;// set x to 40
var movement_speed = 1;
var pos = Math.trunc((Math.random()*100)%100);
var pos1 = Math.trunc((Math.random()*100)%100);
var pos2= Math.trunc((Math.random()*100)%100);
var pos3 = Math.trunc((Math.random()*100)%100);
var pos4 = Math.trunc((Math.random()*100)%100);

Game.prototype.startCountingScore = function () {
    this.counter = setInterval(
        function () {
            this.time++;
            $('.result').html('POINTS: ' + this.time);
            if (Math.random() > 0.5) {
                addObstacles(this.time, this);
            }
        }.bind(this),
        1000
    );
};

Game.prototype.startAudio = function () {
    if (! this.audioStarted) {
        this.audioStarted = true;
        this.audio = new Audio('./sound/music.mp3');
        this.audio.play();
        this.audio.volume = 0.14;
        this.audio.loop = true;
    }
};

Game.prototype.startMoving = function () {
    $('.ostrich-standing').addClass('hidden');
    $('.ostrich-moving').removeClass('hidden');

    $('.city-img').css('animation', 'none');
    $('.plastic').css('display', 'block');
    this.sceneMoving = true;

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

    if(x <= 0) {
        return;
    }

    const nextX = x - speed;
    ostrich.css({left: nextX});
    ostrich.addClass('flip-left');
};

Game.prototype.moveRight = function () {
    const ostrich = $('.ostrich-moving');
    const position = ostrich.position();

    const x = position.left;
    if(x >= window.innerWidth - 176) {
        return;
    }

    const nextX = x + speed;
    ostrich.css({left: nextX});
    ostrich.removeClass('flip-left');
};

Game.prototype.collisionCheck = function () {
    this.collideInterval = setInterval(
        function () {
            var currentTime = new Date().getTime();
            if (currentTime - this.lastLostLife < 1000) {
                return;
            }

            var ostrich = $('.ostrich-moving');
            var plastic = $('.plastic');
			var plastic1 = $('.plastic-1');
			var plastic2 = $('.plastic-2');
            var plastic3 = $('.plastic-3');
			var plastic4 = $('.plastic-4');

            var eggBonus = $('.egg');

			//console.log(lives);

            if (collide(ostrich, eggBonus)) {
                this.lastLostLife = currentTime;
                this.lives++;
                $('.lives').html(this.lives);
                $('.egg').css('display', 'none');

                this.bonus = new Audio('./sound/bonus.mp3');
                this.bonus.play();
                this.bonus.volume = 0.6;
            }
			if (collide(ostrich, plastic)) {
                this.lastLostLife = currentTime;
                $('.plastic').css('display', 'none')
                setTimeout(
                    function() {
                        $('.ostrich-moving').removeClass('lose-life');

                    }.bind(this),
                    500
                );

            }
			if (collide(ostrich, plastic1)) {
				this.lastLostLife = currentTime;
				$('.plastic-1').css('display', 'none')
                setTimeout(
                    function () {
                        $('.ostrich-moving').removeClass('lose-life');

                    }.bind(this),
                    500
                );
            }
			if (collide(ostrich, plastic2)) {
				this.lastLostLife = currentTime;
				$('.plastic-2').css('display', 'none')
                setTimeout(
                    function() {
                        $('.ostrich-moving').removeClass('lose-life');

                    }.bind(this),
                    500
                );
            }
			if (collide(ostrich, plastic3)) {
				this.lastLostLife = currentTime;
				$('.plastic-3').css('display', 'none')
                setTimeout(
                    function() {
                        $('.ostrich-moving').removeClass('lose-life');

                    }.bind(this),
                    500
                );
            }
			if (collide(ostrich, plastic4)) {
				this.lastLostLife = currentTime;
				$('.plastic-4').css('display', 'none')
                setTimeout(
                    function() {
                        $('.ostrich-moving').removeClass('lose-life');

                    }.bind(this),
                    500
                );
            }
			if (this.lives <= 0) {
				this.lastLostLife = currentTime;
				this.gameStop();

                // this.failure = new Audio('./sound/life-lost.mp3');
                // this.failure.play();
                // this.failure.volume = 0.2;

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
    $('.plastic').css('display', 'none');
    $('.plastic-1').css('display', 'none');
    $('.plastic-2').css('display', 'none');
    $('.plastic-3').css('display', 'none');
    $('.plastic-4').css('display', 'none');
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

            this.lives = 30;
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

function createTree(x, game) {
    const tree = $(`<img alt="tree" src="img/tree.png" class="tree">`);
    tree.css({left: x});
    game.addLives();
    return tree;
}

function plantTree(game) {
    // console.log("pantTree");
    const ostrich = $('.ostrich-moving');
    const deserts = $('.desert');
    for (let i = 0; i < deserts.length; ++i) {
        const desert = deserts[i];
        // console.log(desert.id);
        const desertTrue = $(`#${desert.id}`);
        if (collide(ostrich, desertTrue)) {
            desertTrue.remove();
            $('#game').append(createTree(ostrich.position().left, game));
            return;
        }
    }

    const co2 = $('.co2');
    for (let i = 0; i < co2.length; ++i) {
        const desert = co2[i];
        // console.log(desert.id);
        const desertTrue = $(`#${desert.id}`);
        if (collide(ostrich, desertTrue)) {
            desertTrue.remove();
            $('#game').append(createTree(ostrich.position().left, game));
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
    const co2 = $(`<img alt="co2" src="img/co2.png" class="co2" id=${++id}>`);
    co2.css({left: x + 50});
    return co2;
}

function addObstacles(time, game) {
    console.log(time);
    if (time%3 == 1) {

        setTimeout(function() {
			pos = Math.trunc((Math.random()*100)%100);

			$('.ostrich-moving').removeClass('lose-life');
			if($('.plastic').css('display')!=='none') {
				$('.ostrich-moving').addClass('lose-life');
				game.lives -= 10;
                $('.lives').html(game.lives);
			}
			$('.plastic').css('right', pos+"vw");
            $('.plastic').css('display', 'block');
        }, 5500);
    }
    if (time%3 == 2) {
        setTimeout(function() {
			pos2 = Math.trunc((Math.random()*100)%100);

			if($('.plastic-1').css('display')!=='none') {
				$('.ostrich-moving').addClass('lose-life');
				game.lives -= 10;
				$('.lives').html(game.lives);
			}

			$('.plastic-1').css('right', pos2+"vw");
            $('.plastic-1').css('display', 'block');
        }, 1700);
    }
    if (time%4 == 1) {
        setTimeout(function() {
			pos2 = Math.trunc((Math.random()*100)%100);
            if($('.plastic-2').css('display')!=='none') {
                $('.ostrich-moving').addClass('lose-life');
                game.lives -= 10;
                $('.lives').html(game.lives);
            }
			$('.plastic-2').css('right', pos1+"vw");
            $('.plastic-2').css('display', 'block');
        }, 1700);
    }
    if (time%4 == 2) {
        setTimeout(function() {
			pos4 = Math.trunc((Math.random()*100)%100);
            if($('.plastic-3').css('display')!=='none') {
                $('.ostrich-moving').addClass('lose-life');
                game.lives -= 10;
                $('.lives').html(game.lives);
            }
			$('.plastic-3').css('right', pos4+"vw");
            $('.plastic-3').css('display', 'block');
        }, 200);
    }
    if (time%4 == 0) {
        setTimeout(function() {
			pos3 = Math.trunc((Math.random()*100)%100);
            if($('.plastic-4').css('display')!=='none') {
                $('.ostrich-moving').addClass('lose-life');
                game.lives -= 10;
                $('.lives').html(game.lives);
            }
			$('.plastic-4').css('right', pos3+"vw");
            $('.plastic-4').css('display', 'block');
        }, 200);
	}
    const limitRight = $(window).width();
    const x = Math.random() * limitRight;
    const desert = createDessert(x);
    const co2 = createCO2(x);
    $('#game').append(desert);
    if(Math.random() > 0.7){
        const co2 = createCO2(x);
        $('#game').append(co2);
    }
}
