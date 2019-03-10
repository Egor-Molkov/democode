var i = 0, r = 0, str="", curPos=[0,0,0,0],
	WINMATTRIX = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0], NULLMATTRIX = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	curentMattrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], tempMattrix = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];

function newGame (i){
	if (i!=(-1)) {
		r=Math.floor(Math.random()*100/15);
		if ($.isNumeric(tempMattrix[r])) {
			curentMattrix[i]=tempMattrix[r];i--;tempMattrix.splice(r,1);newGame(i);}
		else {newGame (i)};
	};
};

function loadMattrix(curentMattrix,i,r) {
var n=r;
while (i!=0) {
	while (n!=0) {
		if (curentMattrix[(i-1)*r+n-1]!=0) {
			str = "<p>"+curentMattrix[(i-1)*r+n-1]+"</p>";
			$(".r"+i+".d"+n).removeClass("ins")}
		else {
			str = "";
			$(".r"+i+".d"+n).addClass("ins")};
		$(".r"+i+".d"+n).html(str);
		n--};
	i--;n=r};
};

function readMattrix (i,r) {
var n=r;
while (i!=0) {
	while (n!=0) {
		if ($(".r"+i+".d"+n)!="") {
			curentMattrix[(i-1)*r+n-1]=(+($(".r"+i+".d"+n).text()));}
		else {
			curentMattrix[(i-1)*r+n-1]=0;};
		n--};
	i--;n=r};
};


function runGame() {
tempMattrix=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
newGame(15);
if (curentMattrix.toString()==WINMATTRIX.toString()) {runGame()} 
else {loadMattrix(curentMattrix,4,4)};
};


function moveIns() {
readMattrix(4,4);
if (curentMattrix.toString()==NULLMATTRIX.toString()) {alert("Ничего нет.. двигать нельзя!")}
else if (curentMattrix.toString()==WINMATTRIX.toString()) {alert("Ура победа!")} 
else {
	str=$(this).attr("class");
	curPos[0]=str.charAt(6);
	curPos[1]=str.charAt(9);
	str=$("div.ins").attr("class");
	curPos[2]=str.charAt(6);
	curPos[3]=str.charAt(9);
	if ((curPos[0]-curPos[2])==0 && (curPos[1]-curPos[3])==0) {alert("Нетрож курсор!")}
	else if (Math.abs((curPos[0]-curPos[2]))>1 || (Math.abs(curPos[1]-curPos[3]))>1) 
		{alert("Что, правда? Так нельзя!")}
	else if (Math.abs((curPos[0]-curPos[2]))==1 && (Math.abs(curPos[1]-curPos[3]))==1) 
		{alert("Что, правда? Так нельзя!")}
	else {
		i=(curPos[2]-1)*4+(curPos[3]-1);
		r=(curPos[0]-1)*4+(curPos[1]-1);
		curentMattrix[i]=curentMattrix[r];
		curentMattrix[r]=0;
		loadMattrix(curentMattrix,4,4);}
};
};

$("div.headers").click(runGame);
$("div.item").click(moveIns);