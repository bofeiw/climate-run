$(document).ready(function() {
    var game = new Game();

    $('html, body').animate(
        {
            scrollTop: 0
        },
        10
    );

    $('.btn-start').click(() => {
        setTimeout(function() {
            game.canPlay = true;
        }, 750);

        $('.start-screen').css({
            transform: 'translateY(-100%)'
        });

        $('.game').css({
            transform: 'translateY(0)'
        });
    });

    $('.btn-restart').click(() => {
        setTimeout(function() {
            game.canPlay = true;
        }, 750);

        $('.game').css({
            transform: 'translateY(0)'
        });

        $('.game-over').css({
            transform: 'translateY(100%)'
        });
    });

    $(window).on('keydown', function(evt) {
        if (game.canPlay) {
            switch (evt.which) {
                // 32 is the key code for space
                case 32:
                    evt.preventDefault();
                    if (game.sceneMoving) {
                        game.jumping();
                    } else {
                        game.startCountingScore();
                        game.startMoving();
                        game.collisionCheck();
                    }
                    break;
                
            }
        }
    });
});
