let map
let marker
let lat = 0
let lng = 0

const API_URL = "https://script.google.com/macros/s/AKfycbzIrGemDc0CNREzRkgUttSK77uYxxV1zl6hnVDxeo07QS_fQTHmDZJNa_WTzdkHk-p7/exec"



function toggleMenu(){

let menu = document.getElementById("menu")

if(menu.style.left === "0px"){
menu.style.left = "-220px"
}else{
menu.style.left = "0px"
}

}



function showPage(page){

document.querySelectorAll("section").forEach(sec=>{
sec.classList.remove("active")
})

document.getElementById(page).classList.add("active")

toggleMenu()

if(page === "submit"){
setTimeout(loadMap,300)
}

}



function loadMap(){

if(map) return

map = L.map('reportMap').setView([14.5995,120.9842],13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
maxZoom:19
}).addTo(map)

map.on("click",function(e){

lat = e.latlng.lat
lng = e.latlng.lng

if(marker) map.removeLayer(marker)

marker = L.marker([lat,lng]).addTo(map)

document.getElementById("selectedLocation").innerText =
"Selected: "+lat.toFixed(5)+" , "+lng.toFixed(5)

})

loadReports()

}



async function detectLocation(){

if(!navigator.geolocation){
alert("Geolocation not supported")
return
}

navigator.geolocation.getCurrentPosition(async function(pos){

lat = pos.coords.latitude
lng = pos.coords.longitude

map.setView([lat,lng],16)

if(marker) map.removeLayer(marker)

marker = L.marker([lat,lng]).addTo(map)

document.getElementById("selectedLocation").innerText =
"Selected: "+lat.toFixed(5)+" , "+lng.toFixed(5)

try{

let response = await fetch(
`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
)

let data = await response.json()

let road = data.address?.road || data.display_name

document.getElementById("locationText").value = road

}catch(error){

console.log(error)

}

})

}



document.addEventListener("DOMContentLoaded",()=>{

let photoInput = document.getElementById("photo")
let preview = document.getElementById("photoPreview")

photoInput.addEventListener("change",function(){

let file = this.files[0]

if(!file) return

let reader = new FileReader()

reader.onload=function(e){

preview.src = e.target.result
preview.style.display = "block"

}

reader.readAsDataURL(file)

})

})



function submitReport(){

if(lat === 0){
alert("Please select location")
return
}

let tracking = "RW" + Date.now()

let data = {

tracking:tracking,
lastname:document.getElementById("lastname").value,
firstname:document.getElementById("firstname").value,
mi:document.getElementById("mi").value,
email:document.getElementById("email").value,
phone:document.getElementById("phone").value,
location:document.getElementById("locationText").value,
issue:document.getElementById("issue").value,
lat:lat,
lng:lng,
photo:"none"

}

fetch(API_URL,{
method:"POST",
body:JSON.stringify(data)
})

.then(res=>res.text())
.then(res=>{
alert("Report Submitted!\nTracking Number: "+tracking)
})

}



async function loadReports(){

try{

let response = await fetch(API_URL)

let reports = await response.json()

reports.forEach(r=>{

if(!r.lat || !r.lng) return

L.marker([parseFloat(r.lat),parseFloat(r.lng)])
.addTo(map)
.bindPopup(
"<b>"+r.issue+"</b><br>"+r.location+"<br>Status: "+(r.status || "Pending")
)

})

}catch(err){

console.log("Error loading reports",err)

}

}
