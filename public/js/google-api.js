let googleApiKey = "AIzaSyB6YDdaRNCGktlvWISrGBjv75lcHfR-l44"
let cityOne = "Seattle+WA"
let cityTwo = "phoenix+az"
let vehicleType = "flight"

let googleURL= "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + cityOne + "&destinations=" + cityTwo + "&mode=" + vehicleType + "&language=en-FR&key=" + googleApiKey;


console.log(googleURL)

driving
transit
