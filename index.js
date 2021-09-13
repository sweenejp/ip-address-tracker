// === IP API === //
//  https://geo.ipify.org/api/v1?apiKey=at_buolCeBWmSm37OCUs5M7VfDn6RD38&ipAddress=

const ipAddressElement = document.getElementById("ip-address");
const locationElement = document.getElementById("location");
const timezoneElement = document.getElementById("timezone");
const ispElement = document.getElementById("isp");
let mymap = L.map("mapid");

function removeMap() {
  mymap.off();
  mymap.remove();
}

async function fetchipData() {
  let userInput = {
    value: document.getElementById("ip-domain-user-input").value,
    type: null,
  };
  console.log(userInput.value.match(/\d*\.\d*\.\d*\.\d*/));
  if (userInput.value.match(/\d*\.\d*\.\d*\.\d*/)) {
    userInput.type = "ipAddress";
  } else {
    userInput.type = "domain";
  }
  console.log(userInput);

  // if no user input => get default API value (user's current IP)
  const url = userInput.value
    ? `https://geo.ipify.org/api/v1?apiKey=at_buolCeBWmSm37OCUs5M7VfDn6RD38&${userInput.type}=${userInput.value}`
    : "https://geo.ipify.org/api/v1?apiKey=at_buolCeBWmSm37OCUs5M7VfDn6RD38";
  const res = await fetch(url);
  const data = await res.json();

  ipAddressElement.innerHTML = data.ip;
  locationElement.innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
  timezoneElement.innerHTML = data.location.timezone;
  ispElement.innerHTML = data.isp;

  // === Map API === //

  mymap = L.map("mapid").setView([data.location.lat, data.location.lng], 13);

  await L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3dlZW5lanAiLCJhIjoiY2t0aHB6d3k3MHU0MjMxbXZtMnBjdnRqZSJ9.CAZHA9NWRWytRhDCtDAHGw",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: "your.mapbox.access.token",
    }
  ).addTo(mymap);
}
