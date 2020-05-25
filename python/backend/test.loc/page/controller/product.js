
// Загрузим вид
( async () => {
    let view = await fetch("page/view/product.html");
    app.view.product = await view.text();
    if ( view.ok ) {
        $( "#product" ).html( `${ app.view.product }` );
        let param = {}
        let action = "/company/list";
        await getDataAsync({ url:action, auth:true, obj:param }, extractCompanyVars ); 		
        param = {}
        action = "/product/list";
        await getDataAsync({ url:action, auth:true, obj:param }, extractProductList );
    } else {
        notFound();
    }
})();


async function extractCompanyVars( response ) {
    if  ( response.status == 200 ) {
        app.vars.company = response.data.items;
    } else {
        alert( response.status + ' ' + JSON.stringify( response.data ));
    }
}


async function extractProductList( response ) {
    if ( response.status == 200 ) {
        let panel = `
            <div class="d-flex justify-content-end">
                <button class="btn edit"><span class="fa fa-pencil text-muted"></span></button>
                <button class="btn delete"><span class="fa fa-trash text-muted"></span></button>
            </div>
        `;
        $('#tableProduct').DataTable({
                data: response.data.items,
                columns: [
                    { data: 'id' },
                    { data: 'name' },
                    { data: 'company' },
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
            let companyName = el.find("td").eq(2).html();
            updateProduct( el, id, name, companyName );
        });
        $( ".table" ).delegate(".delete", "click", ( e ) => {
            let el = $( e.target ).parents("tr");
            let id = el.find("td").first().html();
            let name = el.find("td").eq(1).html();
            let companyName = el.find("td").eq(2).html();
            deleteProduct( el, id, name, companyName );
        });
        $( ".table" ).delegate( ".new", "click", () => {
            createProduct();
        });
    } else {
        alert( response.status + ' ' + JSON.stringify( response.data ));
    }
};


async function updateProduct( el, id, name, companyName ) {
    let options = ``;
    app.vars.company.forEach( function( item ) {
        let selected = "";
        if ( companyName === item.name ) { selected = "selected" }
        options += `<option value="${ item.id }" ${ selected }>${ item.name }</option>`
    });
    let selected = `
        <select class="form-control" id="companyId">
            ${ options }
        </select>
    `;
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
        <td>${ selected }</td>
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
            name: $("#name").val(),
            companyid: parseInt( $( "#companyId" ).val() )
        };
        let action = "/product/update";
        getDataAsync({ url:action, auth:true, obj:param }, ( response ) => {
            if  ( response.status == 200 || response.status == 201 ) {
                console.log( "update - ", param.name );
                app.product();
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


async function deleteProduct( el, id, name, companyName ) {
    let options = ``;
    app.vars.company.forEach( function( item ) {
        let selected = "";
        if ( companyName === item.name ) { selected = "selected" }
        options += `<option value="${ item.id }" ${ selected }>${ item.name }</option>`
    });
    let selected = `
        <select class="form-control" id="companyId" disabled="">
            ${ options }
        </select>
    `;
    let editor = `
        <td>${ id }</td>
        <td>${ name }</td>
        <td>${ selected }</td>
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
            name: name,
            companyid: parseInt( $( "#companyId" ).val() )
        };
        let action = "/product/delete";
        getDataAsync({ url:action, auth:true, obj:param }, ( response ) => {
            if  ( response.status == 200 || response.status == 201 ) {
                console.log( "delete - ", name );
                app.product();
            } else {
                alert( response.status + ' ' + JSON.stringify( response.data ));
            }
        });
    });
};


async function createProduct() {
    let options = ``;
    app.vars.company.forEach( function( item ) {
        options += `<option value="${ item.id }">${ item.name }</option>`
    });
    let selected = `
        <select class="form-control" id="companyId">
            ${ options }
        </select>
    `;
    let editor = `
        <td></td>
        <td>
            <input  type="text" 
                    class="form-control" 
                    id="name" 
                    name="name"
                    placeholder="Имя продукта"
                    autofocus="" 
                    required="">
        </td>
        <td>
            ${ selected }
        </td>
        <td>
            <div class="d-flex justify-content-end">
                <button class="btn btn-success text-dark mr-3" id="save">Сохранить</button>
                <button class="btn btn-light" id="cansel">Отмена</button>
            </div>
        </td>
    `;
    let self = $( "#tableProduct tfoot" ).html();
    $( "#tableProduct tfoot" ).html( editor );
    $( "#cansel" ).click( () => { $( "#tableProduct tfoot" ).html( self ) });
    $( "#save" ).click( () => { 
        let param = {
            name: $("#name").val(),
            companyid: parseInt( $( "#companyId" ).val() )
        };
        action = "/product/update";
        getDataAsync({ url:action, auth:true, obj:param }, ( response ) => {
            if  ( response.status == 200 || response.status == 201 ) {
                console.log( "save - ", param.name );
                app.product();
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
