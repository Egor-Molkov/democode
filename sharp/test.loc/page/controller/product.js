
// Загрузим вид
( async () => {
	
	let response = await fetch("page/view/product.html");
	
	if ( response.ok ) {
	
  		// Вставим вид
  		$("#product").html( `${ await response.text() }` );
  		
		let param = {  }

		action = "/company/list";
		
		getDataAsync( { url:action, auth:app.token, obj:param }, varsCompany ); 		
  		
		param = {  }
		
		action = "/product/company/list";
		
		getDataAsync( { url:action, auth:app.token, obj:param }, extractProduct );
		
	} else {
	
		$( "body" ).html( `
			<div class="text-danger m-auto">
				<span class="fa fa-exclamation-triangle mr-2"></span>
				Ошибка 404, страница не найдена...
			</div>` );
			
  		console.log("Error: page not found");
  		
  	}
  	
})();

function varsCompany( response ) {

	if  ( response.status === 200 ) {
	
		app.vars.company = response.data;
	
	} else {
	
		$( ".info" ).html( "Ошибка " + response.status + " - " + response.error );
		
	}
	
}

function extractProduct( response ) {

	if  ( response.status === 200 ) {
		
		let panel = `
			<div class="d-flex justify-content-end">
				<button class="btn edit"><span class="fa fa-pencil text-muted"></span></button>
				<button class="btn delete"><span class="fa fa-trash text-muted"></span></button>
			</div>
		`;
		
		$('#tableProduct').DataTable( {
    			data: response.data,
    			columns: [
        			{ data: 'id' },
        			{ data: 'name' },
        			{ data: 'company' },
        			{ data: null,
				  defaultContent: panel }
    			],
    			language: {
                   	"zeroRecords": "По вашему запросу, ни чего нет...",
                   	"paginate": {
                    	"first": "первый",
                   		"last": "последний",
                   		"next": "Сюда &rarr;",
                    	"previous": "&larr; Туда"
                   	},
                   	"search":'<span class="fa fa-search text-muted"></span>'
                },
                responsive: true
		});

		$('#tableProduct').removeClass( "d-none" );
		
	} else {
	
		$( ".info" ).html( "Ошибка " + response.status + " - " + response.error );
		
	}

};

function editProduct( el, id, name, companyName ) {

	let options = ``;

	app.vars.company.forEach(function(item, index, array) {
	
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
			<input type="text" 
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
	
	$("#cansel").click( () => { $( el ).html( self ) });
	
	$("#save").click( () => { 
	
		let param = {
			id: parseInt( id ), 
			name: $("#name").val(),
			companyId: parseInt( $("#companyId").val() )
		};
		
		action = "/product/update";
		getDataAsync( { url:action, auth:app.token, obj:param }, ( response ) => {
			console.log("update - ", param.name );
			app.product();
		});
	});
	
};

function deleteProduct( el, id, name, companyName ) {

	let options = ``;
	
	app.vars.company.forEach(function(item, index, array) {
	
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
	
	$("#cansel").click( () => { $( el ).html( self ) });
	
	$("#save").click( () => { 
	
		let param = {
			id: parseInt( id ),
			name: name
		};
		
		action = "/product/delete";
		getDataAsync( { url:action, auth:app.token, obj:param }, ( response ) => {
			console.log("delete - ", name );
			app.product();
		});
	});
	
};

function newProduct( ) {

	let options = ``;
	
	app.vars.company.forEach(function(item, index, array) {
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
			<input type="text" 
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
	
	$("#cansel").click( () => { $( "#tableProduct tfoot" ).html( self ) });
	
	$("#save").click( () => { 
	
		let param = {
			name: $("#name").val(),
			companyId: parseInt( $("#companyId").val() )
		};
		
		action = "/product/create";
		getDataAsync( { url:action, auth:app.token, obj:param }, ( response ) => {
			console.log("save - ", param.name );
			app.product();
		});
	});
	
};