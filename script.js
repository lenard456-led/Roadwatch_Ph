let map;
let marker;
let lat=0;
let lng=0;

map = L.map('map').setView([14.1,121],10);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

map.on("click",function(e){

lat=e.latlng.lat
lng=e.latlng.lng

if(marker) map.removeLayer(marker)

marker=L.marker([lat,lng]).addTo(map)

})

function detectLocation(){

navigator.geolocation.getCurrentPosition(

function(pos){

lat=pos.coords.latitude
lng=pos.coords.longitude

map.setView([lat,lng],16)

if(marker) map.removeLayer(marker)

marker=L.marker([lat,lng]).addTo(map)

}

)

}

function generateTracking(){

return "RW-"+Date.now()

}

async function submitReport(){

let data={

tracking:generateTracking(),

lastname:
document.getElementById("lastname").value,

firstname:
document.getElementById("firstname").value,

locationText:
document.getElementById("locationText").value,

issue:
document.getElementById("issue").value,

latitude:lat,
longitude:lng,

status:"Pending"

}

try{

let res=await fetch(
"https://script.google.com/macros/s/AKfycbw5VPaNHJM37bAm6xa37Wf8SEWfNrmvVdZqwy8kZ4_-AbI5z8EHtctjIRJOa3EnuPno/exec",
{
method:"POST",
body:JSON.stringify(data)
})

let json=await res.json()

alert("Submitted")

}catch(err){

alert("Failed to fetch")

}

}