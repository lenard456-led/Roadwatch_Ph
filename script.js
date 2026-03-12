let reportMap, marker, lat=0, lng=0;
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreview");
const API_URL = "YOUR_GOOGLE_SHEET_WEB_APP_URL"; // Replace with your Google Sheets Web App URL

// Sidebar
function openMenu(){ let m=document.getElementById("menu"); m.style.width=(m.style.width=="250px")?"0":"250px"; }
function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  openMenu();
  if(id=="submit"){ setTimeout(initReportMap,300); setTimeout(()=>{ reportMap.invalidateSize(); },500); }
}

// Map
function initReportMap(){
  if(reportMap) return;
  reportMap = L.map('reportMap').setView([14.1,121],10);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(reportMap);
  reportMap.on("click", e=>{
    lat=e.latlng.lat; lng=e.latlng.lng;
    if(marker) reportMap.removeLayer(marker);
    marker=L.marker([lat,lng]).addTo(reportMap);
    document.getElementById("selectedLocation").innerText="Selected Location: "+lat.toFixed(6)+", "+lng.toFixed(6);
  });
}

// Auto-detect
async function detectLocation(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(async pos=>{
      lat=pos.coords.latitude; lng=pos.coords.longitude;
      if(marker) reportMap.removeLayer(marker);
      marker=L.marker([lat,lng]).addTo(reportMap);
      reportMap.setView([lat,lng],16);
      document.getElementById("selectedLocation").innerText="Selected Location: "+lat.toFixed(6)+", "+lng.toFixed(6);

      try{
        let res=await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        let data=await res.json();
        const road = data.address?.road || data.address?.pedestrian || data.display_name || "";
        document.getElementById("locationText").value = road;
      }catch(err){ console.log(err); }
    }, err=>{alert("Location detection failed: "+err.message);});
  }else{alert("Geolocation not supported");}
}

// Photo preview
photoInput.addEventListener("change", function(){
  const file=this.files[0];
  if(file){ const reader=new FileReader(); reader.onload=function(e){ photoPreview.src=e.target.result; photoPreview.style.display="block"; } reader.readAsDataURL(file); }
  else{ photoPreview.src=""; photoPreview.style.display="none"; }
});

// Tracking
function generateTracking(){ let d=new Date(); let rand=Math.floor(Math.random()*1000); return "RW-"+d.getFullYear()+(d.getMonth()+1).toString().padStart(2,"0")+d.getDate().toString().padStart(2,"0")+"-"+d.getHours()+d.getMinutes()+d.getSeconds()+"-"+rand; }

// Submit report
async function submitReport(){
  if(lat===0||lng===0){ alert("Please select location"); return; }
  let tracking=generateTracking();
  let formData=new FormData();
  formData.append("tracking",tracking);
  formData.append("lastname",lastname.value);
  formData.append("firstname",firstname.value);
  formData.append("mi",mi.value);
  formData.append("email",email.value);
  formData.append("phone",phone.value);
  formData.append("locationText",locationText.value);
  formData.append("issue",issue.value);
  formData.append("latitude",lat);
  formData.append("longitude",lng);
  formData.append("status","Pending");
  if(photoInput.files[0]){
    const reader=new FileReader();
    reader.onload=async function(e){ formData.append("photoBase64",e.target.result); await sendReport(formData,tracking); }
    reader.readAsDataURL(photoInput.files[0]);
  } else { formData.append("photoBase64",""); await sendReport(formData,tracking); }
}

// Send to Google Sheet
async function sendReport(formData,tracking){
  try{
    await fetch(API_URL,{method:"POST",body:formData});
    document.getElementById("trackInfo").innerHTML="Tracking Number:<br><b>"+tracking+"</b>";
    document.getElementById("popup").style.display="flex";
  } catch(err){ alert("Submission failed: "+err.message); }
}

// Popup
function closePopup(){ document.getElementById("popup").style.display="none"; show('home'); }
function newReport(){
  document.getElementById("popup").style.display="none";
  document.querySelectorAll("#submit input,#submit textarea").forEach(e=>e.value="");
  document.getElementById("selectedLocation").innerText="No location selected";
  lat=0; lng=0; if(marker) reportMap.removeLayer(marker);
  photoPreview.src=""; photoPreview.style.display="none";
  show('submit');
}

// Initialize map
window.onload = ()=>{ initReportMap(); };
