function openMenu(){
let m=document.getElementById("menu");
m.style.width=(m.style.width=="250px")?"0":"250px";
}

function show(id){
document.querySelectorAll("section")
.forEach(s=>s.classList.remove("active"));

document.getElementById(id)
.classList.add("active");

openMenu();

if(id=="submit"){
setTimeout(initReportMap,300);
setTimeout(()=>{
reportMap.invalidateSize();
},500);
}
}



let reportMap, marker, lat=0, lng=0;

function initReportMap(){

if(reportMap) return;

reportMap=L.map('reportMap')
.setView([14.1,121],10);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(reportMap);

reportMap.on("click", e=>{

lat=e.latlng.lat;
lng=e.latlng.lng;

if(marker) reportMap.removeLayer(marker);

marker=L.marker([lat,lng]).addTo(reportMap);

selectedLocation.innerText =
lat+", "+lng;

});

}



function detectLocation(){

navigator.geolocation.getCurrentPosition(

pos=>{

lat=pos.coords.latitude;
lng=pos.coords.longitude;

if(marker) reportMap.removeLayer(marker);

marker=L.marker([lat,lng]).addTo(reportMap);

reportMap.setView([lat,lng],15);

selectedLocation.innerText =
lat+", "+lng;

}

);

}



function generateTracking(){

return "RW-"+Date.now();

}



async function submitReport(){

if(lat==0){
alert("Pin location");
return;
}

let tracking=generateTracking();

let data={

tracking:tracking,
lastname:lastname.value,
firstname:firstname.value,
mi:mi.value,
email:email.value,
phone:phone.value,
locationText:locationText.value,
issue:issue.value,
latitude:lat,
longitude:lng,
status:"Pending"

};

try{

await fetch(
"https://script.google.com/macros/s/AKfycbywslM_-8Ohowuny4theFIQNNB0TjdhI0MANQSCLQGzy6X1fsmkDXXMz9FBjQfHIXdM/exec",
{
method:"POST",
headers:{
"Content-Type":"text/plain"
},
body:JSON.stringify(data)
}
);

trackInfo.innerHTML=
"Tracking:<br>"+tracking;

popup.style.display="flex";

}
catch(e){

alert("Failed submit");

}

}



function closePopup(){
popup.style.display="none";
show("home");
}

function newReport(){

popup.style.display="none";

document.querySelectorAll(
"#submit input,#submit textarea"
).forEach(e=>e.value="");

lat=0;
lng=0;

if(marker)
reportMap.removeLayer(marker);

show("submit");

}



window.onload=()=>{
initReportMap();
};
