
// Загрузим вид
( async () => {
	
	let response = await fetch("page/view/company.html");
	
	if ( response.ok ) {

  		// Вставим вид
  		$("#company").html( `${ await response.text() }` );
  		
		let param = {  }

		action = "/company/list";
		
		getDataAsync( { url:action, auth:app.token, obj:param }, extractCompany ); 		

	} else {
	
		$( "body" ).html( `
			<div class="text-danger m-auto">
				<span class="fa fa-exclamation-triangle mr-2"></span>
				Ошибка 404, страница не найдена...
			</div>` );
			
  		console.log("Error: page not found");
  		
  	}
  	
})();


function extractCompany( response ) {

	if  ( response.status === 200 ) {
		
		let panel = `
			<div class="d-flex justify-content-end">
				<button class="btn edit"><span class="fa fa-pencil text-muted"></span></button>
				<button class="btn delete"><span class="fa fa-trash text-muted"></span></button>
			</div>
		`;
			
		let table = $('#tableCompany').DataTable( {
    			data: response.data,
    			columns: [
        			{ data: 'id' },
        			{ data: 'name' },
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
		
		$('#tableCompany').removeClass( "d-none" );
		
	} else {
	
		$( ".info" ).html( "Ошибка " + response.status + " - " + response.error );
		
	}

};

function editCompany( el, id, name ) {

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
			name: $("#name").val()
		};
		
		action = "/company/update";
		getDataAsync( { url:action, auth:app.token, obj:param }, ( response ) => {
			console.log("update - ", param.name );
			app.company();
		});
	});
	
};

function deleteCompany( el, id, name ) {

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
	
	$("#cansel").click( () => { $( el ).html( self ) });
	
	$("#save").click( () => { 
	
		let param = {
			id: parseInt( id ),
			name: name
		};
		
		action = "/company/delete";
		getDataAsync( { url:action, auth:app.token, obj:param }, ( response ) => {
			console.log("delete - ", name );
			app.company();
		});
	});
	
};

function newCompany( ) {

	let editor = `
		<td></td>
		<td>
			<input type="text" 
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
	
	$("#cansel").click( () => { $( "#tableCompany tfoot" ).html( self ) });
	
	$("#save").click( () => { 
	
		let param = {
			name: $("#name").val()		
		};
		
		action = "/company/create";
		getDataAsync( { url:action, auth:app.token, obj:param }, ( response ) => {
			console.log("save - ", param.name );
			app.company();
		});
	});
	
};