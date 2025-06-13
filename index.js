const weform=document.querySelector(".search");
const cityinput=document.querySelector(".cityinput");
const card=document.querySelector(".card");
const apikey="44c29fcb1a9118475609678fe3bdfd8f";
let map=L.map('map').setView([20, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
let marker;
weform.addEventListener("submit",async event=>{
    event.preventDefault();
    const city=cityinput.value;
    if (city){
        try{
            const wedata=await getdata(city);
            disweather(wedata);
        }
        catch(error){
            console.error(error);
            diserror(error);        
        }
    }
    else{
        diserror("Please enter city");
    }
});
async function getdata(city) {
    const apiurl=`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`
    const response=await fetch(apiurl);
    if (!response.ok){
        throw new Error("could not fetch data");
    }
    return await response.json();   
}
function disweather(data){
    const {name: city,
            main: {temp,humidity},
            weather:[{description,id}],coord}=data;
    card.textContent="";
    card.style.display="flex";
    const citydis=document.createElement("h1");
    const tempdis=document.createElement("p");
    const humdis=document.createElement("p");
    const descdis=document.createElement("p");
    const emoji=document.createElement("p");
    const tempC=(temp-273.15).toFixed(1);
    const tempF=((temp-273.15)*(9/5)+32).toFixed(1);
    citydis.textContent=city+"📍";
    tempdis.textContent=`Temperature: ${tempC}°C / ${tempF}°F`;
    humdis.textContent=`Humidity: ${humidity}%`;
    descdis.textContent=description;
    emoji.textContent=getemoji(id);
    citydis.classList.add("citydis");
    tempdis.classList.add("tempdis");
    humdis.classList.add("humdis");
    descdis.classList.add("descdis");
    emoji.classList.add("emoji")
    card.appendChild(citydis);
    card.appendChild(tempdis);
    card.appendChild(humdis);
    card.appendChild(descdis);
    card.appendChild(emoji);
    map.setView([coord.lat, coord.lon], 8);
    if(marker){
        map.removeLayer(marker);
    }
    marker=L.marker([coord.lat, coord.lon]).addTo(map)
        .bindPopup(`${city}`)
        .openPopup();
}
function getemoji(weatherId){
    switch(true){
        case (weatherId>=200 && weatherId<300):
            return "⛈️";
        case (weatherId>=300 && weatherId<400):
            return "🌨️";
        case (weatherId>=500 && weatherId<600):
            return "🌧️";
        case (weatherId>=600 && weatherId<700):
            return "❄️";
        case (weatherId>=700 && weatherId<800):
            return "🌫️";
        case (weatherId===800):
            return "☀️";
        case (weatherId>=801 && weatherId<810):
            return "☁️";
        default:
            return "❓🤔";
    }
}
function diserror(massage){
    const errordis=document.createElement("p");
    errordis.textContent=massage;
    errordis.classList.add("errordis");
    card.textContent="";
    card.style.display="flex";
    card.appendChild(errordis);
}