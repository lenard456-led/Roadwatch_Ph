let map
let marker
let lat = 0
let lng = 0



function toggleMenu(){

let menu = document.getElementById("menu")

if(menu.style.left === "0px"){

menu.style.left = "-220px"

}else{

menu.style.left = "0px"

}

}



function showPage(id){

document.querySelectorAll("section").forEach(sec=>{

sec.classList.remove("active")

})

document.getElementById(id).classList.add("active")

toggleMenu()

if(id==="submit"){

setTimeout(initMap,300)

}

}



function initMap(){

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
"Selected Location: " + lat.toFixed(5) + ", " + lng.toFixed(5)

})

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
"Selected Location: " + lat.toFixed(5) + ", " + lng.toFixed(5)



try{

let res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)

let data = await res.json()

let road = data.address?.road || data.display_name

document.getElementById("locationText").value = road

}catch(err){

console.log(err)

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

reader.onload = function(e){

preview.src = e.target.result
preview.style.display = "block"

}

reader.readAsDataURL(file)

})

})



function submitReport(){

if(lat===0){

alert("Please select a location")

return

}

alert("Report submitted successfully!")

}
