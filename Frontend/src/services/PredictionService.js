/**
 * A Prediction service holding car CRUD operation functions for requests to API.
 */


const axios = require('axios');
import {post_car} from "./CarService";

function getId(url) {
    let matches = url.match(/\/api\/cars\/(\d+)\//);
    if (matches != null && matches.length > 0) {
        return parseInt(matches[1]);
    } else {
        return null;
    }
}

async function getPredictedPrice(car, ML_MODEL) {
    const postResponse = await post_car(car);
    const carId = getId(postResponse["url"]);
    const postPredictionResponse = await axios.post('/api/predict/', {car: carId, algorithm: ML_MODEL});
    return postPredictionResponse.data["predicted_price"];
}

export {
    getPredictedPrice
}
