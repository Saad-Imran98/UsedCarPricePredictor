/**
 * A car service holding car CRUD operation functions for requests to API.
 */

const axios = require('axios');

async function get_cars() {
    let cars = null;
    try {
        const response = await axios.get('/api/cars/')
        cars = await response.json();
    } catch (e) {
        console.log(e);
    }
    return cars;
}

async function post_car(car) {

    const request = axios.post('/api/cars/', car);
    let data = null;

    try {
        const response = await request;
        data = response.data;
    } catch (e) {
        console.log(e);
    }
    return data;
}

export {
    get_cars,
    post_car
}
