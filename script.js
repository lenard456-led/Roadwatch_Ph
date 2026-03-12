// Sidebar
function openMenu(){ let m=document.getElementById("menu"); m.style.width=(m.style.width=="250px")?"0":"250px"; }
function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  openMenu();
  if(id=="submit"){ setTimeout(initReportMap,300); setTimeout(()=>{ reportMap.invalidateSize(); },500); }
}

// Leaflet Map
let reportMap, marker, lat=0, lng=0;
function initReportMap(){
  if(reportMap) return;
  reportMap=L.map('reportMap').setView([14.1,121],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(reportMap);
  reportMap.on("click", e=>{
    lat=e.latlng.lat; lng=e.latlng.lng;
    if(marker) reportMap.removeLayer(marker);
    marker=L.marker([lat,lng]).addTo(reportMap);
    document.getElementById("selectedLocation").innerText="Selected Location: "+lat.toFixed(6)+", "+lng.toFixed(6);
  });
}

// Auto-detect location
function detectLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async (pos)=>{
      lat=pos.coords.latitude;
      lng=pos.coords.longitude;
      if(marker) reportMap.removeLayer(marker);
      marker=L.marker([lat,lng]).addTo(reportMap);
      reportMap.setView([lat,lng],16);
      document.getElementById("selectedLocation").innerText="Selected Location: "+lat.toFixed(6)+", "+lng.toFixed(6);
      try{
        let res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        let data=await res.json();
        if(data.address && data.address.road){ document.getElementById("locationText").value=data.address.road; }
        else if(data.display_name){ document.getElementById("locationText").value=data.display_name; }
      } catch(e){ console.log("Reverse geocoding failed", e);}
    });
  }
}

// Tracking Number
function generateTracking(){
  let d=new Date(); let rand=Math.floor(Math.random()*1000);
  return "RW-"+d.getFullYear()+(d.getMonth()+1)+d.getDate()+"-"+rand;
}

// Submit
async function submitReport() {

    if(lat==0 || lng==0){
        alert("Please pin your location");
        return;
    }

    let data = {
        tracking: generateTracking(),
        lastname: lastname.value,
        firstname: firstname.value,
        mi: mi.value,
        email: email.value,
        phone: phone.value,
        locationText: locationText.value,
        issue: issue.value,
        latitude: lat,
        longitude: lng,
        status: "Pending"
    };

    let response = await fetch(
    "https://script.google.com/macros/s/AKfycbywslM_-8Ohowuny4theFIQNNB0TjdhI0MANQSCLQGzy6X1fsmkDXXMz9FBjQfHIXdM/exec",
    {
        method:"POST",
        body:JSON.stringify(data)
    });

    let result = await response.json();

    if(result.result==="success"){
        trackInfo.innerHTML=result.tracking;
        popup.style.display="flex";
    }
}

function closePopup(){ popup.style.display="none"; show('home'); }

function newReport(){
  popup.style.display="none";
  document.querySelectorAll("#submit input,#submit textarea").forEach(e=>e.value="");
  lat=0; lng=0;
  if(marker) reportMap.removeLayer(marker);
  show('submit');
}

window.onload = () => { initReportMap(); };
