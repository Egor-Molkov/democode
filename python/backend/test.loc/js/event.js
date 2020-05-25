// Перед запуском вкладки очистим ее, от предведущего значения
$( 'a[data-toggle="pill"]' ).on( 'hide.bs.tab', function (e) {
    let pill = $( this ).attr( "aria-controls" )
    $(`#${pill}`).html( `` );
});

// Запустим актуальную вкладку
$('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
    let pill = $( this ).attr( "aria-controls" )
    localforage.setItem( 'pill', pill );
    app[ pill ]();
});

// Logout
$( "#logout" ).on("click", () => {
    localforage.clear();
    location.href = "/";
    location.reload();
});

// Скроем меню, если открыто
$( "#content" ).on("click", () => {
    if ( $( "#menu" ).hasClass( "show" )) { $( "[aria-controls=menu]" ).click() };
});
