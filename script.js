const API_URL="YOUR_WEB_APP_URL";

let reportMap,map,marker;

let lat=0;
let lng=0;

function openMenu(){

let m=document.getElementById("menu");

m.style.width=(m.style.width==="250px")?"0":"250px";

}

function show(id){

document.querySelectorAll("section")
.forEach(s=>s.classList.remove("active"));

document.getElementById(id).classList.add("active");

openMenu();

if(id==="submit"){

setTimeout(()=>{
initReportMap();
reportMap.invalidateSize();
},400);

}

if(id==="mapPage"){

setTimeout(()=>{
initMap();
map.invalidateSize();
},400);

}

}

function initReportMap(){

if(reportMap) return;

reportMap=L.map("reportMap").setView([14.1,121],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(reportMap);

reportMap.on("click",e=>{

lat=e.latlng.lat;
lng=e.latlng.lng;

if(marker) reportMap.removeLayer(marker);

marker=L.marker([lat,lng]).addTo(reportMap);

document.getElementById("selectedLocation").innerText=
"Selected: "+lat.toFixed(5)+","+lng.toFixed(5);

});

}

function detectLocation(){

navigator.geolocation.getCurrentPosition(pos=>{

lat=pos.coords.latitude;
lng=pos.coords.longitude;

if(marker) reportMap.removeLayer(marker);

marker=L.marker([lat,lng]).addTo(reportMap);

reportMap.setView([lat,lng],16);

});

}

function generateTracking(){

let d=new Date();
let rand=Math.floor(Math.random()*1000);

return "RW-"+d.getFullYear()
+(d.getMonth()+1).toString().padStart(2,"0")
+d.getDate().toString().padStart(2,"0")
+"-"+rand;

}

async function submitReport(){

if(lat===0||lng===0){

alert("Select location first");

return;

}

let tracking=generateTracking();

let formData=new FormData();

formData.append("tracking",tracking);
formData.append("lastname",lastname.value);
formData.append("firstname",firstname.value);
formData.append("email",email.value);
formData.append("locationText",locationText.value);
formData.append("issue",issue.value);
formData.append("latitude",lat);
formData.append("longitude",lng);
formData.append("status","Pending");

await fetch(API_URL,{
method:"POST",
body:formData
});

trackInfo.innerHTML="Tracking Number:<br><b>"+tracking+"</b>";

popup.style.display="flex";

}

function initMap(){

if(map) return;

map=L.map("map").setView([14.1,121],10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

loadReports();

}

async function loadReports(){

let res=await fetch(API_URL);

let data=await res.json();

data.forEach(r=>{

let color="red";

if(r.status==="Fixed") color="green";
if(r.status==="Ongoing") color="orange";

let m=L.circleMarker([r.lat,r.lng],{
radius:8,
color:color
}).addTo(map);

m.bindPopup(
"<b>"+r.issue+"</b><br>"+
"Tracking:"+r.tracking+"<br>"+
"Status:"+r.status
);

});

}

async function searchTracking(){

let id=trackInput.value;

let res=await fetch(API_URL);

let data=await res.json();

let found=data.find(r=>r.tracking===id);

if(found){

trackResult.innerHTML=
"<b>Status:</b> "+found.status+
"<br><b>Issue:</b> "+found.issue;

}else{

trackResult.innerHTML="Tracking number not found";

}

}

function closePopup(){

popup.style.display="none";

show("home");

}
