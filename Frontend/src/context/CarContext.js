/**
 * Context for a car in the application.
 */

import React, {createContext, useContext, useState} from 'react'

let initialState = {
    car: {
        make: null,
        model: null,
        year: null,
        price: null,
        mileage: null,
        fuelType: null,
        transmission: null,
        engineSize: null,
    },
    setCar: () => {
    }
}

export const CarContext = createContext(initialState)

export const CarProvider = props => {

    const [car, setCar] = useState({
        make: null,
        model: null,
        year: null,
        price: null,
        mileage: null,
        fuelType: null,
        transmission: null,
        engineSize: null,
    })

    return (
        <CarContext.Provider value={{car, setCar}}>
            {props.children}
        </CarContext.Provider>
    )

}

function useCar() {
    const context = useContext(CarContext);

    if (context === undefined) {
        throw new Error("useCar must be used within a CarProvider");
    }
    return context;
}

export function isNotNull(car) {
    return (car.make != null &&
        car.model != null &&
        car.year != null &&
        car.mileage != null &&
        car.fuelType != null &&
        car.transmission != null &&
        car.engineSize != null);
}

export default useCar;
