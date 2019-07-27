$(document).ready(function() {
    var game = new Game();
    game.startCountingScore();
    game.startMoving();
    game.collisionCheck();

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
        location.reload();
    });

    $(window).on('keydown', function(evt) {
        if (game.canPlay) {
            game.startAudio();
            switch (evt.which) {
                case 32:
                    // space
                    plantTree(game);
                    break;
                case 37:
                    // left
                    game.moveLeft();
                    break;
                case 39:
                    // right
                    game.moveRight();
                    break;
                default:
                    console.log('Unsupported key was pressed.');
            }
        }
    });
});
