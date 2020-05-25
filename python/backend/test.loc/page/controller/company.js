
// Загрузим вид
( async () => {
    let view = await fetch( "page/view/company.html" );
    app.view.company = await view.text();
    if ( view.ok ) {
        let param = {}
        let action = "/company/list";
        getDataAsync({ url:action, auth:true, obj:param }, extractCompanyList );
    } else {
        notFound();
    }
})();


async function extractCompanyList( response ) {
    if  ( response.status == 200 ) {
        $( "#company" ).html( `${ app.view.company }` );
        let panel = `
            <div class="d-flex justify-content-end">
                <button class="btn edit"><span class="fa fa-pencil text-muted"></span></button>
                <button class="btn delete"><span class="fa fa-trash text-muted"></span></button>
            </div>
        `;
        let table = $( ".table" ).DataTable({
                data: response.data.items,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: null, defaultContent: panel }
                ],
                language: setLanguage,
                responsive: true
        });
        $( ".table" ).removeClass( "d-none" );
        $( ".table" ).delegate(".edit", "click", ( e ) => {
            let el = $( e.target ).parents("tr");
            let id = el.find("td").first().html();
            let name = el.find("td").eq(1).html();
            updateCompany( el, id, name );
        });
        $( ".table" ).delegate(".delete", "click", ( e ) => {
            let el = $( e.target ).parents("tr");
            let id = el.find("td").first().html();
            let name = el.find("td").eq(1).html();
            deleteCompany( el, id, name );
        });
        $( ".table" ).delegate(".new", "click", () => {
            createCompany();
        });
    } else {
        alert( response.status + ' ' + JSON.stringify( response.data ));
    }
};


async function updateCompany( el, id, name ) {
    let editor = `
        <td>${ id }</td>
        <td>
            <input  type="text" 
                    class="form-control" 
                    id="name" 
                    name="name"
                    autofocus="" 
                    required="">
        </td>
        <td>
            <div class="d-flex justify-content-end">
                <button class="btn btn-success text-dark mr-3" id="save">Сохранить</button>
                <button class="btn btn-light" id="cansel">Отмена</button>
            </div>
        </td>
    `;
    let self = $( el ).html();
    $( el ).html( editor );
    $( "#name" ).val( name );
    $( "#cansel" ).click( () => { $( el ).html( self ) });
    $( "#save" ).click( () => { 
        let param = {
            id: parseInt( id ), 
            name: $( "#name" ).val()
        };
		let action = "/company/update";
        getDataAsync({ url:action, auth:true, obj:param }, ( response ) => {
            if  ( response.status == 200 || response.status == 201 ) {
                console.log( "update - ", param.name );
                app.company();
            } else {
                if ( response.data.name ) {
                    alert( "name - " + response.data.name )
                } else {
                    alert( response.status + ' ' + JSON.stringify( response.data ));
                }
            }
        });
    });
};


async function deleteCompany( el, id, name ) {
    let editor = `
        <td>${ id }</td>
        <td>${ name }</td>
        <td>		
            <div class="d-flex justify-content-end">
                <button class="btn btn-danger text-dark mr-3" id="save">Удалить</button>
                <button class="btn btn-light" id="cansel">Отмена</button>
            </div>
        </td>
    `;
    let self = $( el ).html();
    $( el ).html( editor );
    $( "#cansel" ).click( () => { $( el ).html( self ) });
    $( "#save" ).click( () => { 
        let param = {
            id: parseInt( id ),
            name: name
        };
        let action = "/company/delete";
        getDataAsync({ url:action, auth:true, obj:param }, ( response ) => {
            if  ( response.status == 200 || response.status == 201  ) {
                console.log( "delete - ", name );
                app.company();
            } else {
                alert( response.status + ' ' + JSON.stringify( response.data ));
            }
        });
    });
};


async function createCompany() {
    let editor = `
        <td></td>
        <td>
            <input  type="text" 
                    class="form-control" 
                    id="name" 
                    name="name"
                    placeholder="Имя компании"
                    autofocus="" 
                    required="">
        </td>
        <td>
            <div class="d-flex justify-content-end">
                <button class="btn btn-success text-dark mr-3" id="save">Сохранить</button>
                <button class="btn btn-light" id="cansel">Отмена</button>
            </div>
        </td>
    `;
    let self = $( "#tableCompany tfoot" ).html();
    $( "#tableCompany tfoot" ).html( editor );
    $( "#cansel" ).click( () => { $( "#tableCompany tfoot" ).html( self ) });
    $( "#save" ).click( () => { 
        let param = {
            name: $("#name").val()		
        };
        let action = "/company/update";
        getDataAsync({ url:action, auth:true, obj:param }, ( response ) => {
            if  ( response.status == 200 || response.status == 201  ) {
                console.log("save - ", param.name );
                app.company();
            } else {
                if ( response.data.name ) {
                    alert( "name - " + response.data.name )
                } else {
                    alert( response.status + ' ' + JSON.stringify( response.data ));
                }
            }
        });
    });
};
