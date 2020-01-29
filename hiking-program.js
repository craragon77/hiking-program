function testing(){
    $(".submit").click(function(event){
        event.preventDefault();
        let startingPoint = $(".starting-point").val()
        let requestedNumber = $(".requested-number").val() === "" ? 10 : $(".requested-number").val() 
        console.log(startingPoint)
        console.log(requestedNumber)
        cleaningAddress(startingPoint)
    })
}
testing()

function cleaningAddress(startingPoint){
    let cleaned_location = startingPoint.split(" ").join(",")
    console.warn(cleaned_location)
    accessingCoordinates(cleaned_location)
}
    

function accessingCoordinates(cleaned_location){
    let mapquestKey = 'ZGADDfaBd92GKnmxjk6sAupluGqbaZgG'
    fetch('http://www.mapquestapi.com/geocoding/v1/address?key=' + mapquestKey + '&location=' + cleaned_location)
        .then(response =>{
            if (response.ok){
                return response.json()
            }
        })
        .then(mapquestResponse => clearnCoordinates(mapquestResponse))
        .catch(error => console.warn("Uh-Oh Something Went Wrong! Try Again later!"));
}

function clearnCoordinates(mapquestResponse){
    console.warn(mapquestResponse)
    let latitude = mapquestResponse.results.locations[0].latLng.lat
    let long = mapquestResponse.results.locations[0].latLng.lng
    console.log(latitude, long)
}