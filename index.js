$(document).ready(function() {
    var game = new Game();

    $('.btn-start').click(() => {
        $('html, body').animate(
            {
                scrollTop: $('#game').offset().top
            },
            700
        );
    });

    $('.btn-restart').click(() => {
        $('html, body').animate(
            {
                scrollTop: $('#game').offset().top
            },
            800
        );
    });

    $(window).on('keydown', function(evt) {
        switch (evt.which) {
            case 32:
                if (game.sceneMoving) {
                    game.jumping();
                } else {
                    game.startCountingScore();
                    game.startMoving();
                    game.collisionCheck();
                }
                break;
            default:
                console.log('Unsupported key was pressed.');
        }
    });
});
