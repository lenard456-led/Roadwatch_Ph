const API_URL="YOUR_WEB_APP_URL";

let reportMap, map, marker;
let lat=0,lng=0;

// SIDEBAR
function openMenu(){
  let m=document.getElementById("menu");
  m.style.width=(m.style.width==="250px")?"0":"250px";
}

function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  openMenu();
  if(id==="submit"){setTimeout(()=>{initReportMap(); reportMap.invalidateSize();},400);}
  if(id==="mapPage"){setTimeout(()=>{initMap(); map.invalidateSize();},400);}
  if(id==="dashboard"){setTimeout(()=>{loadDashboard();},300);}
}

// REPORT MAP
function initReportMap(){
  if(reportMap) return;
  reportMap=L.map("reportMap").setView([14.1,121],10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(reportMap);
  reportMap.on("click", e=>{
    lat=e.latlng.lat; lng=e.latlng.lng;
    if(marker) reportMap.removeLayer(marker);
    marker=L.marker([lat,lng]).addTo(reportMap);
    document.getElementById("selectedLocation").innerText="Selected: "+lat.toFixed(5)+", "+lng.toFixed(5);
  });
}

// AUTO DETECT LOCATION
function detectLocation(){
  if(!navigator.geolocation){alert("Geolocation not supported"); return;}
  navigator.geolocation.getCurrentPosition(pos=>{
    lat=pos.coords.latitude; lng=pos.coords.longitude;
    if(marker) reportMap.removeLayer(marker);
    marker=L.marker([lat,lng]).addTo(reportMap);
    reportMap.setView([lat,lng],16);
    document.getElementById("selectedLocation").innerText="Selected: "+lat.toFixed(5)+", "+lng.toFixed(5);
  });
}

// GENERATE TRACKING
function generateTracking(){
  let d=new Date();
  let rand=Math.floor(Math.random()*1000);
  return "RW-"+d.getFullYear()+(d.getMonth()+1).toString().padStart(2,"0")+d.getDate().toString().padStart(2,"0")+"-"+rand;
}

// SUBMIT REPORT
async function submitReport(){
  if(lat===0||lng===0){alert("Please select location"); return;}
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
  await fetch(API_URL,{method:"POST",body:formData});
  trackInfo.innerHTML="Tracking Number:<br><b>"+tracking+"</b>";
  popup.style.display="flex";
}

// NEW REPORT
function newReport(){
  popup.style.display="none";
  show('submit');
  lat=0; lng=0;
  marker && reportMap.removeLayer(marker);
  document.querySelectorAll("#submit input,#submit textarea").forEach(e=>e.value="");
  document.getElementById("selectedLocation").innerText="No location selected";
}

// CLOSE POPUP
function closePopup(){popup.style.display="none"; show('home');}

// MAP PAGE
function initMap(){
  if(map) return;
  map=L.map("map").setView([14.1,121],10);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(map);
  loadReports();
}

// LOAD REPORTS TO MAP
async function loadReports(){
  let res=await fetch(API_URL);
  let data=await res.json();
  data.forEach(r=>{
    let color="red";
    if(r.status==="Fixed") color="green";
    if(r.status==="Ongoing") color="orange";
    let m=L.circleMarker([r.lat,r.lng],{radius:8,color:color}).addTo(map);
    m.bindPopup("<b>"+r.issue+"</b><br>Tracking:"+r.tracking+"<br>Status:"+r.status);
  });
}

// TRACKING SEARCH
async function searchTracking(){
  let id=trackInput.value;
  let res=await fetch(API_URL);
  let data=await res.json();
  let found=data.find(r=>r.tracking===id);
  trackResult.innerHTML = found ? "<b>Status:</b> "+found.status+"<br><b>Issue:</b> "+found.issue : "Tracking number not found";
}

// DASHBOARD
async function loadDashboard(){
  let res=await fetch(API_URL);
  let data=await res.json();
  totalReports.innerText=data.length;
  fixedReports.innerText=data.filter(r=>r.status==="Fixed").length;
  ongoingReports.innerText=data.filter(r=>r.status==="Ongoing").length;
  pendingReports.innerText=data.filter(r=>r.status==="Pending").length;
}

// INITIALIZE MAP ON PAGE LOAD
window.onload=()=>{initReportMap();}

// Photo Preview
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");

photoInput.addEventListener("change", function() {
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      photoPreview.src = e.target.result;
      photoPreview.style.display = "block";
    }
    reader.readAsDataURL(file);
  } else {
    photoPreview.src = "";
    photoPreview.style.display = "none";
  }
});

// Submit Report
async function submitReport(){
  if(lat===0||lng===0){alert("Please select location"); return;}
  let tracking = generateTracking();
  let formData = new FormData();
  formData.append("tracking", tracking);
  formData.append("lastname", lastname.value);
  formData.append("firstname", firstname.value);
  formData.append("mi", mi.value);
  formData.append("email", email.value);
  formData.append("phone", phone.value);
  formData.append("locationText", locationText.value);
  formData.append("issue", issue.value);
  formData.append("latitude", lat);
  formData.append("longitude", lng);
  formData.append("status", "Pending");

  if(photoInput.files[0]){
    const reader = new FileReader();
    reader.onload = async function(e){
      formData.append("photoBase64", e.target.result);
      await sendReport(formData, tracking);
    }
    reader.readAsDataURL(photoInput.files[0]);
  } else {
    formData.append("photoBase64", "");
    await sendReport(formData, tracking);
  }
}

// Send Report to Google Web App
async function sendReport(formData, tracking){
  try{
    await fetch(API_URL, {method:"POST", body: formData});
    trackInfo.innerHTML = "Tracking Number:<br><b>" + tracking + "</b>";
    popup.style.display = "flex";
  } catch(err){
    alert("Submission failed: " + err.message);
  }
}
