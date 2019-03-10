;(function() {

	var	maps = JSON.parse (jsonString);			// глобальная переменная нашего скрипта из _cities.json
	var	cord=$(".maps").position();				// координаты относительно карты
	var	collection=[];							// коллекция url для картинок

	// добавим города на карту
	function showCities() {
		for (var i = 0; i < maps.contentCitie.length; i++) { 			// количество объектов городов
			var	x=cord.left+maps.contentCitie[i].citieCoords[0]-5,	// координата х минус радиус
					y=cord.top+maps.contentCitie[i].citieCoords[1]-5,	// координата y минус радиус
					cName=maps.contentCitie[i].citieName;			// имя города
					

			// опишим точки дивами с классом point и индексом, но не покажем
			var	strP="<div class=\"point "+i+"\" style=\"";
					strP+="display:none; ";
					strP+="left: "+x+"px;";
					strP+="top: "+y+"px;";
					strP+="\">";
					strP+="</div>";

			$(".maps").append(strP); 	// добавим к контенту

			// дивы с названиями городов не покажем
			var	strP="<div class=\"citiename n"+i+"\" style=\"";
					strP+="display:none; ";									
					strP+="left: "+(x-20)+"px;";
					strP+="top: "+(y-40)+"px;";
					strP+="\">"+cName;
					strP+="</div>";

			$(".maps").append(strP); 	// добавим к контенту
		};
	};

	// добавим зоны на карту
	function showZones() {
		for (var i = 0; i < maps.contentZone.length; i++) { 				// количество объектов зон
			var	strP="<area class=\""+i+"\"shape=\"poly\" coords=\"";		// опишем арены
					strP+=maps.contentZone[i].zoneCoords;
					strP+="\" nohref ";
					strP+="title=\""+maps.contentZone[i].zoneName+"\">";

			$("map").append(strP); 		// добавим к контенту
		};
	};

	// создадим коллекцию url для картинок
	function contentCollection(a) {
			var	a=this,
					x=cord.left+maps.contentZone[a].zoneCoords[0],
					y=cord.top+maps.contentZone[a].zoneCoords[1];

			if (maps.contentZone[a].ZoneMulti) {								// если мультизона
				for (var i = 0; i < maps.contentZone[a].zoneNameDir.length; i++) {	// сколько их
					for (var t = 1; t < (maps.contentZone[a].zoneMedia[i]+1); t++) {	// создадим коллекцию url
						if (maps.contentZone[a].zoneMedia[i] > 10) {
							collection.push("image/cities/"+maps.contentZone[a].zoneNameDir[i]+"/"+t+".png");
						}	else {
							collection.push("image/cities/"+maps.contentZone[a].zoneNameDir[i]+"/"+"0"+t+".png");
						};
				}}} else {
					for (var t = 1; t < (maps.contentZone[a].zoneMedia+1); t++) {	// создадим коллекцию url
						if (t >= 10) {
							collection.push("image/cities/"+maps.contentZone[a].zoneNameDir+"/"+t+".png");
						}	else {
							collection.push("image/cities/"+maps.contentZone[a].zoneNameDir+"/"+"0"+t+".png");
							};
				
						};
					}
			return collection;
			};
			
	// пара картинок
	function showMediaSlayer(a) {
			var	a=this,
					x=cord.left+maps.contentZone[a].zoneCoords[0],
					y=cord.top+maps.contentZone[a].zoneCoords[1];
					var c=0, z=99;
					
				while (collection.length!=0){
					
					for (var i = 1; 3 > i; i++){

						switch(i) {
							case 1: var xx=x-100,	yy=y-150
						break
							case 2: var xx=x+100,	yy=y-150
							};
				
					var	strP="<div class=\"media l"+((i-1)+c*2)+"\" style=\"";	// дивы для показа картинок
							strP+="display:none; z-index:",				// не покажем
							strP+=z+";",
							strP+="left: "+(xx)+"px;",
							strP+="top: "+(yy)+"px;",
							strP+="\">",
							strP+="</div>";
							
					var	strL="<img src=\"";								// картинки
							strL+=collection[0];						// 
							strL+="\" width=\"88\" height=\"88\">";
						
							$(".maps").append(strP);
							$(".l"+((i-1)+c*2)).append(strL);
							collection.shift();
							$(".l"+((i-1)+c*2)).delay(3600*c+500*i).fadeIn(500);
							$(".l"+((i-1)+c*2)).delay(3000*(c+1)).fadeOut(300);
					};
					c++;z--;
				};
			};
			
	function hideMedia() {
		$(".media").remove();	
	};
			
	
	

 
$(document).ready(function(){
	showCities();
	showZones();
	
	
	$(".point").fadeIn(1000);
	$(".point").mouseenter(function(){
		var attrPoint=$(this).attr("class"), i=".n"+attrPoint[6];
		$(i).fadeIn();
		});
	$(".point").mouseleave(function(){
		var attrPoint=$(this).attr("class"), i=".n"+attrPoint[6];
		$(i).fadeOut();
		});

	$("area").mouseenter(function(){
		var attrArea=$(this).attr("class");
			contentCollection.call(attrArea);
			showMediaSlayer.call(attrArea);
		});
	$("area").mouseleave(function(){
		collection=[];
		hideMedia();
		});

});

})();