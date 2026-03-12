let reportMap
let marker
let lat = 0
let lng = 0


function openMenu(){

let m = document.getElementById("menu")

if(m.style.width=="250px")
m.style.width="0"
else
m.style.width="250px"

}


function showPage(id){

document
.querySelectorAll("section")
.forEach(s=>s.classList.remove("active"))

document
.getElementById(id)
.classList.add("active")

openMenu()

if(id=="submit"){

setTimeout(()=>{

initMap()

reportMap.invalidateSize()

},500)

}

}


function initMap(){

if(reportMap) return

reportMap =
L.map("reportMap")
.setView([14.1,121],10)

L.tileLayer(
"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
).addTo(reportMap)

reportMap.on("click",e=>{

lat=e.latlng.lat
lng=e.latlng.lng

if(marker)
reportMap.removeLayer(marker)

marker=
L.marker([lat,lng])
.addTo(reportMap)

document.getElementById(
"selectedLocation"
).innerText=
lat+", "+lng

})

}


function detectLocation(){

navigator.geolocation
.getCurrentPosition(pos=>{

lat = pos.coords.latitude
lng = pos.coords.longitude

if(marker)
reportMap.removeLayer(marker)

marker =
L.marker([lat,lng])
.addTo(reportMap)

reportMap.setView(
[lat,lng],15)

document.getElementById(
"selectedLocation"
).innerText =
lat+", "+lng

})

}


function generateTracking(){

let d=new Date()

return "RW-"+d.getTime()

}



async function submitReport(){

if(lat==0){

alert("Pin location")

return

}

let tracking =
generateTracking()

let data={

tracking:tracking,

lastname:
lastname.value,

firstname:
firstname.value,

mi:
mi.value,

email:
email.value,

phone:
phone.value,

locationText:
locationText.value,

issue:
issue.value,

latitude:lat,
longitude:lng,

status:"Pending"

}


try{

await fetch(
"https://script.google.com/macros/s/AKfycbw5VPaNHJM37bAm6xa37Wf8SEWfNrmvVdZqwy8kZ4_-AbI5z8EHtctjIRJOa3EnuPno/exec",
{
method:"POST",
headers:{
"Content-Type":
"text/plain"
},
body:
JSON.stringify(data)
}
)

trackInfo.innerHTML=
tracking

popup.style.display="flex"

}
catch(e){

alert("Failed")

}

}



function closePopup(){

popup.style.display="none"

showPage("home")

}


function newReport(){

popup.style.display="none"

showPage("submit")

}
