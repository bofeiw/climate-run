// on button click scroll between sections of the page

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
