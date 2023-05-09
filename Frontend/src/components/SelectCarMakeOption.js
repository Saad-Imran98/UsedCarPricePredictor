import React, {useEffect, useState} from 'react'
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl';
import useCar from "../context/CarContext";
import {get_make_model_options, get_options} from "../services/DataService";

/**
 * Component for make and model select doublet as they are closely coupled.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function MakeModelSelect(props) {

    const [makes, setMakes] = useState(["audi", "mercedes", "ford"]);
    const [models, setModels] = useState([(<MenuItem value=""><em>Make Required</em></MenuItem>)]);
    const {car, setCar} = useCar();
    const disabled = props.disabled;

    useEffect(() => {
        get_options().then((options) => {
            setMakes(options['make']);
        }).catch((e) => {
            console.log(e)
        });
    }, [])

    function handleMakeSelect(e) {
        get_make_model_options(e.target.value).then((data) => {
            setModels(data.options);
        });
        let tempCar = car
        tempCar.make = e.target.value
        setCar(tempCar)
    }

    function handleModelSelect(e) {
        let tempCar = car
        tempCar.model = e.target.value
        setCar(tempCar)
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    return (
        <>
            <FormControl sx={{minWidth: 50, marginTop: 1}}>
                <InputLabel>Make</InputLabel>
                <Select
                    disabled={disabled}
                    defaultValue=""
                    required={true}
                    labelId="car-make-option-label-id"
                    id="car-make-option-id"
                    label="Make"
                    MenuProps={MenuProps}
                    onChange={handleMakeSelect}>
                    {makes.map(value => <MenuItem value={value} key={value}>{value}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl sx={{minWidth: 50, marginTop: 1}}>
                <InputLabel>Car Model</InputLabel>
                <Select
                    disabled={disabled}
                    labelId="car-model-option-label-id"
                    id="car-model-option-id"
                    defaultValue=""
                    label="Model"
                    required={true}
                    MenuProps={MenuProps}
                    onChange={handleModelSelect}>
                    {models.map((value, _) => (
                        <MenuItem value={value} key={value}>{value}</MenuItem>
                    ))
                    }
                </Select>
            </FormControl>
        </>
    )
}
