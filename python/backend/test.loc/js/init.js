var app = {
        version: "v.1.1 05.2020",
        api: "http://test.loc:5000/api/v1",
        view: {},
        vars: {},
        auth: () => { addScript( "page/controller/auth.js", "async" )},
        company: () => { addScript( "page/controller/company.js", "async" )},
        product: () => { addScript( "page/controller/product.js", "async" )},
    };
var setLanguage = {
        "zeroRecords": "По вашему запросу, ни чего нет...",
        "paginate": {
            "first": "первый",
            "last": "последний",
            "next": "Сюда &rarr;",
            "previous": "&larr; Туда"
        },
        "search":'<span class="fa fa-search text-muted"></span>'
    };
document.addEventListener("DOMContentLoaded", () => {
    //addFont( "css/font/fontawesome-webfont.woff2" )
    addLink( "css/bootstrap.min.css" );
    addLink( "css/tables.css" );
    addLink( "css/font-awesome.min.css", () => {
        addLink( "css/style.css" );
        addScript( "vendors/localforage.min.js", "async" );
        addScript( "js/tools.js", "async" );
        addScript( "vendors/jquery-3.1.1.min.js", "defer", () => {
            addScript( "js/event.js", "async" );
            addScript( "vendors/jquery.dataTables.min.js", "async" );
            addScript( "vendors/bootstrap.min.js", "defer", () => { main() });
        });
    });
});

// Петля, для запуска приложения в асинхронном режиме
function main() {
    AppStart();
};

// Запуск приложения
async function AppStart() {
    $("#preload").addClass("d-none");
    localforage.getItem( 'access_token' ).then(
        async ( token ) => {
            if ( token == null ) { 
                app.auth() 
            } else {
                // Проверим токен
                let action = "/auth/test";
                const response = await getDataAsync({ url:action, metod:"GET", auth:true })
                if ( response.status !== 200 ) {
                    alert( response.status + ' ' + JSON.stringify( response.data ));
                } else {
                    pillStart();
                };                
            }
        }
    );
};

// Запустим вкладку
async function pillStart() {
    $("#app").removeClass( "d-none" );
    $("#app").addClass( "d-flex" );
	
    let pill = await localforage.getItem( 'pill' );
    if ( !pill ) {
        pill = "company";
        localforage.setItem( 'pill', pill );
    }
    $( '#' + pill + '-tab' ).tab( 'show' );
};

// Страница не найдена
async function notFound() {
    $( "body" ).html( `
    <div class="text-danger m-auto">
        <span class="fa fa-exclamation-triangle mr-2"></span>
        Ошибка 404, страница не найдена...
    </div>` );
    console.log("Error: page not found");
};
