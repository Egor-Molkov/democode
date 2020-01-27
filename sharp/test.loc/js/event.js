$('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
		
	let value = $( this ).attr( "aria-controls" )
	app.pill = value;
	localforage.setItem( 'pill', value );
	
	app[value]();
		
});
	
$( "#logout" ).on("click", () => {
	
	localforage.clear();
	location.href = "/";
	location.reload();
	
});
	
$( "#content" ).on("click", () => {
	
	if ( $( "#menu" ).hasClass( "show" ) ) { $( "[aria-controls=menu]" ).click() };
	
});


$( "#company" ).delegate("table .edit", "click", ( e ) => {

	let el = $( e.target ).parents("tr");
	let id = el.find("td").first().html();
	let name = el.find("td").eq(1).html();
	
	editCompany( el, id, name );
	
});

$( "#company" ).delegate("table .delete", "click", ( e ) => {

	let el = $( e.target ).parents("tr");
	let id = el.find("td").first().html();
	let name = el.find("td").eq(1).html();
	
	deleteCompany( el, id, name );
	
});

$( "#company" ).delegate("table .new", "click", () => {
	
	newCompany();
	
});

$( "#product" ).delegate("table .edit", "click", ( e ) => {

	let el = $( e.target ).parents("tr");
	let id = el.find("td").first().html();
	let name = el.find("td").eq(1).html();
	let companyName = el.find("td").eq(2).html();
	
	editProduct( el, id, name, companyName );
	
});

$( "#product" ).delegate("table .delete", "click", ( e ) => {

	let el = $( e.target ).parents("tr");
	let id = el.find("td").first().html();
	let name = el.find("td").eq(1).html();
	let companyName = el.find("td").eq(2).html();
	
	deleteProduct( el, id, name, companyName );
	
});

$( "#product" ).delegate("table .new", "click", () => {
	
	newProduct();
	
});