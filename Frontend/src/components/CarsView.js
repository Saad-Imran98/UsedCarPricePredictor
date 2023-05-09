import {get_cars} from "../services/CarService";
import React, {useEffect, useState} from "react";

let dummy_car = {
    make: "audi",
    model: " A21",
    year: 2017,
    price: 0,
    transmission: "Automatic",
    mileage: 36000,
    fuelType: "Diesel",
    engineSize: 3.0
}

/**
 * Car view for displaying a car detail.
 * @returns {JSX.Element}
 * @constructor
 */
function CarsView() {

    const [cars, setCars] = useState([dummy_car]);

    useEffect(() => {
        get_cars().then((fetched_cars) => {
            console.log(fetched_cars)
            setCars(fetched_cars)
        });

        // post_car(dummy_car).then((resp) => {
        //     console.log(resp)
        // });

    }, [])

    return (<div>{cars[0].model}</div>)

}

export default CarsView;
