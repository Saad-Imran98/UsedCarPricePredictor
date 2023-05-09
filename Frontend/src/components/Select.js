import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import useCar, {isNotNull} from "../context/CarContext";
import {getPredictedPrice} from "../services/PredictionService";

const formatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
});

/**
 * Select option component for any given option name and option value string.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function SelectCarOption(props) {
    const [optionValue, setoptionValue] = React.useState('');
    const {optionName, options} = props
    const {car, setCar} = useCar();

    const handleChange = (event) => {
        let tempCar = car;
        tempCar[optionName] = event.target.value;
        setoptionValue(event.target.value);
        setCar(tempCar);
        if (isNotNull(car)) {
            getPredictedPrice(car).then((price) => {
                let tempCar = car;
                tempCar.price = formatter.format(price);
                setTimeout(() => {
                    console.log("Set new price: ", tempCar.price);
                    setCar(tempCar);
                }, 300)
            });
        }
        console.log(car[optionName]);
    };

    return (
        <FormControl sx={{m: 1, minWidth: 50}}>
            <InputLabel id={"select-" + optionName + "-id"}>{optionName}</InputLabel>
            <Select
                labelId={optionName}
                id={optionName}
                value={optionValue}
                label={optionName}
                onChange={handleChange}
                required={true}
            >
                {options.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}

            </Select>
        </FormControl>

    );
}
