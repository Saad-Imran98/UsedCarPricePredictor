/**
 * A Data service holding car CRUD operation functions for requests to API.
 */


const axios = require('axios');

async function get_make_model_options(make) {
    let options = null;
    try {
        const response = await axios.get(`/api/make-options?make=${make}`)
        options = await response.data;
    } catch (e) {
        console.log(e);
    }
    return options;
}

async function get_options() {

    const request = axios.get('/api/options/');
    let options = null;

    try {
        const response = await request;
        options = response.data;
    } catch (e) {
        console.log(e);
    }
    return options;
}

export {
    get_make_model_options,
    get_options
}
