function userInput(){
    $(".submit").click(function(event){
        event.preventDefault();
        $(".trail-results").empty()
        let startingPoint = $(".starting-point").val()
        console.log(startingPoint)
        cleaningAddress(startingPoint)
    })
}
userInput()

function cleaningAddress(startingPoint){
    let cleaned_location = startingPoint.split(" ").join(",")
    console.warn(cleaned_location)
    accessingCoordinates(cleaned_location)
}
    

function accessingCoordinates(cleaned_location){
    const mapquestKey = 'ZGADDfaBd92GKnmxjk6sAupluGqbaZgG'
    fetch('https://www.mapquestapi.com/geocoding/v1/address?key=' + mapquestKey + '&location=' + cleaned_location)
        .then(response =>{
            if (response.ok){
                return response.json()
            }
        })
        .then(mapquestResponse => cleanCoordinates(mapquestResponse))
        .catch(error => console.warn("Uh-Oh Something Went Wrong! Try Again later!"));
}

function cleanCoordinates(mapquestResponse){
    console.warn(mapquestResponse)
    let latitude = mapquestResponse.results[0].locations[0].latLng.lat
    let longitude = mapquestResponse.results[0].locations[0].latLng.lng
    console.log(latitude, longitude)
    accessingTrail(latitude, longitude)
    sunRiseSunSet(latitude, longitude)
    weatherNearYou(latitude, longitude)
}

function accessingTrail(latitude, longitude, ){
    const hikingKey = '200675990-157903a155210b46749a394996f4474f'
    let requestedNumber = $(".requested-number").val() === "" ? 10 : $(".requested-number").val() 
    let maxMiles = $(".max-miles").val() === ""? 15 : $(".max-miles").val()
    fetch('https://www.hikingproject.com/data/get-trails?lat=' + latitude + '&lon=' + longitude + '&maxResults=' + requestedNumber + '&maxDistance='+ maxMiles + '&key=' + hikingKey)
        .then(response =>{
            if (response.ok){
                return response.json()
            }
        })
        .then(hikingResponse => renderTrails(hikingResponse))
        .catch(error => console.warn("your trail cannot be found at this time"))
}
function renderTrails(hikingResponse){
    console.warn(hikingResponse)
    for (let i = 0; i < hikingResponse.trails.length; i++){
        $(".trail-results").append(
            `<section class="image-results">
                <div>
                <p class="trail-name">${hikingResponse.trails[i].name} (${hikingResponse.trails[i].location})</p><br>
                    <img src="${hikingResponse.trails[i].imgSqSmall}" alt="image not found :(">
                    <p>${hikingResponse.trails[i].summary}</p><br>
                    <p>${hikingResponse.trails[i].length} miles long
                    <ul>
                        <li>${hikingResponse.trails[i].ascent} ft ascent</li>
                        <li>${hikingResponse.trails[i].descent} ft decent</li>
                        <li>${hikingResponse.trails[i].high} ft above sea-level at its highest</li>
                        <li>${hikingResponse.trails[i].low} ft above sea-level at its lowest</li>
                        <li>${hikingResponse.trails[i].difficulty} difficulty</li>
                        <li>${hikingResponse.trails[i].stars}/5 stars based on ${hikingResponse.trails[i].starVotes} reviews</li>
                    </ul>
                </div>
            </section`
        )
    }
}
function sunRiseSunSet(latitude, longitude){
    const sunAPIKey = 'adf056764b2641d1a74b3b927c167240'
    fetch('https://api.ipgeolocation.io/astronomy?apiKey=' + sunAPIKey + '&lat=' + latitude + '&long=' + longitude )
        .then(response =>{
            if (response.ok){
            return response.json()
        }
    })
    .then(sunResponseJson => hereComesTheSun(sunResponseJson))
    .catch(error => "Guess you don't have the sun? Oh well!")
}
function hereComesTheSun(sunResponseJson){
    console.log(sunResponseJson)
    $(".trail-results").prepend(
        `<div>
            <p>The Sun will rise at ${sunResponseJson.sunrise} and set at ${sunResponseJson.sunset}
        </div>`
    )
}
function weatherNearYou(latitude, longitude){
    let openWeatherKey = 'b67adfa745a7fb5ba49a440a715c89f9'
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + openWeatherKey)
    .then(response => {
        if(response.ok){
            return response.json()
        }
    })
    .then(weatherResponse => renderTemperature(weatherResponse))
    .catch(error => alert("The sky is falling!"))
}
function convertToFarenheight(tempKelvin){
    let tempFar = Math.round((9 / 5) * (tempKelvin - 275) + 32)
    return tempFar
}
function convertToCelcius(tempKelvin){
    let tempCel = Math.round(tempKelvin - 273.15)
    return tempCel
}

function renderTemperature(weatherResponse){
    console.log(weatherResponse)
    let currentTempFar = convertToFarenheight(weatherResponse.main.temp)
    let feelsLikeTempFar = convertToFarenheight(weatherResponse.main.feels_like)
    let tempMinFar = convertToFarenheight(weatherResponse.main.temp_min)
    let tempMaxFar = convertToFarenheight(weatherResponse.main.temp_max)
    let currentTempCel = convertToCelcius(weatherResponse.main.temp)
    let feelsLikeTempCel = convertToCelcius(weatherResponse.main.feels_like)
    let tempMinCel = convertToCelcius(weatherResponse.main.temp_min)
    let tempMaxCel = convertToCelcius(weatherResponse.main.temp_max)
    $(".weather").replaceWith(
        `<section class="weather">
            <div class="forecast">
                <p>${weatherResponse.weather[0].description}</p>
                <p>${weatherResponse.main.humidity} % humidity</p>
                <img src="http://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}.png" alt="weather">
            </div>
            <div class="temp">
                <p>It's currently ${currentTempFar} °F/ ${currentTempCel} °C</p>
                <p>Feels like ${feelsLikeTempFar} °F / ${feelsLikeTempCel} °C</p>
                <p>High of ${tempMaxFar} °F / ${tempMaxCel} °C and a low of ${tempMinFar} °F/ ${tempMinCel} °C</p>
                <p>${weatherResponse.wind.speed} mph winds</p>
            </div>
        </section>`
    )
}
