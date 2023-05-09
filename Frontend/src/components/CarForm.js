import React, {useEffect, useState} from "react";
import {FormGroup, Grid} from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MakeModelSelect from "./SelectCarMakeOption";
import useCar from "../context/CarContext";
import Button from '@mui/material/Button';
import {getPredictedPrice} from "../services/PredictionService";
import PriceView from "./PriceView";
import {get_options} from "../services/DataService";
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import FormHelperText from '@mui/material/FormHelperText';

const formatter = new Intl.NumberFormat('en-UK', {
    style: 'currency',
    currency: 'GBP',
});

const yearOptions = []
for (let i = 2023; i > 1970; i--) {
    yearOptions.push(i)
}


/**
 * Returns car form component for selecting a car.
 * @returns {JSX.Element}
 * @constructor
 */
export default function CarForm() {

    const {car, setCar} = useCar();
    const [showPrice, setPrice] = useState(false);
    const [loading, setLoading] = useState(false); // new loading state
    const [transmissionOptions, setTransmissionOptions] = useState(['Automatic', 'Manual', 'Hybrid']);
    const [engineSizeOptions, setEngineSizeOptions] = useState([1.0, 2.0, 3.0]);
    const [fuelTypeOptions, setFuelTypeOptions] = useState(['Petrol', 'Diesel', 'Hybrid', 'Electric']);
    const [algorithm, setAlgorithm] = useState("XGBOOST")
    const [disableEngineSize, setDisableEngineSize] = useState(false);

    useEffect(() => {
        get_options().then((options) => {
            setTransmissionOptions(options['transmission']);
            setEngineSizeOptions(options['engineSize']);
            setFuelTypeOptions(options['fuelType'])
        }).catch((e) => {
            console.log(e)
        });
    }, [])

    function submitForm(e) {
        e.preventDefault();
        console.log(car.mileage);
        if (car.mileage < 0) {
            console.log("Bleeeehh");
            return false;
        } else {
            getPredictedPrice(car, algorithm).then((price) => {
                let tempCar = car;
                tempCar.price = formatter.format(price);
                setCar(tempCar);
                setPrice(true);
            });
        }
    }

    function handleMileageChange(e) {
        let tempCar = car;
        tempCar.mileage = parseInt(e.target.value);
        if (tempCar.mileage >= 0) {
            refreshPrice(tempCar);
        }
    }

    function onYearChange(e) {
        let tempCar = car;
        tempCar.year = parseInt(e.target.value);
        refreshPrice(tempCar)
    }

    function onTransmissionChange(e) {
        let tempCar = car;
        tempCar.transmission = e.target.value;
        refreshPrice(tempCar)
    }

    function onEngineSizeChange(e) {
        let tempCar = car;
        tempCar.engineSize = e.target.value;
        refreshPrice(tempCar)
    }

    function onFuelTypeChange(e) {
        let tempCar = car;
        tempCar.fuelType = e.target.value;
        if (tempCar.fuelType === "Electric") {
            console.log("ELECTRIC!")
            setDisableEngineSize(true);
            tempCar.engineSize = 0;
        } else {
            setDisableEngineSize(false);
        }
        refreshPrice(tempCar)
    }

    function onAlgorithmChange(e) {
        console.log(e.target.value);
        setAlgorithm(e.target.value);
        console.log(algorithm);
        refreshPrice(car)
    }

    function refreshPrice(tempCar) {
        setCar(tempCar);
        if (showPrice && tempCar.mileage) {
            setLoading(true); // set loading state to true when mileage changes
            getPredictedPrice(car, algorithm).then((price) => {
                let tempCar = car;
                tempCar.price = formatter.format(price);
                setTimeout(() => {
                    // set loading state to false when price is fetched
                    setCar(tempCar);
                    setPrice(true);
                    setLoading(false);
                }, 300)
            });
        }
    }

    // useEffect hook to watch for changes in car.mileage and set loading state
    useEffect(() => {
        if (loading) {
            setPrice(false);
        }
    }, [car.mileage, loading])

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

    const algorithmOptions = [
        "XGBOOST",
        "RANDOM_FOREST",
        "ELASTIC_NET",
        "RIDGE_REGRESSION",
        "LINEAR_REGRESSION",
        "K_NEAREST_NEIGHBOR",
    ]

    return (
        <>
            <Typography variant="h5" gutterBottom style={{textAlign: "center"}}>
                Enter Car Details
            </Typography>
            {loading &&
                <Alert icon={false} severity="success" style={{display: "flex", justifyContent: "center"}}>
                    <CircularProgress size={110}/>
                </Alert>
            }
            <PriceView show={showPrice}/>
            <form onSubmit={submitForm}>
                <FormGroup onSubmit={submitForm}>
                    <FormControl variant="standard" fullWidth sx={{minWidth: 30, marginTop: 1}}>
                        <Select
                            labelId="algorithm"
                            id="algorithm"
                            defaultValue="XGBOOST"
                            label="Regression Algorithm"
                            onChange={onAlgorithmChange}
                            required={true}
                            MenuProps={MenuProps}
                        >
                            {algorithmOptions.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}

                        </Select>
                        <FormHelperText>Ordered by descending model accuracy</FormHelperText>
                    </FormControl>
                    <MakeModelSelect disabled={showPrice}/>
                    <FormControl fullWidth sx={{minWidth: 30, marginTop: 1}}>
                        <InputLabel id={"select-year-id"}>year</InputLabel>
                        <Select
                            labelId="year"
                            id="year"
                            defaultValue=""
                            label="year"
                            onChange={onYearChange}
                            required={true}
                            MenuProps={MenuProps}
                        >
                            {yearOptions.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}

                        </Select>
                    </FormControl>
                    <Grid container spacing={1}>
                        <Grid item xs={6} style={{textAlign: "center"}}>
                            <FormControl fullWidth sx={{minWidth: 50, marginTop: 1}}>
                                <InputLabel id={"select-year-id"}>Fuel Type</InputLabel>
                                <Select
                                    labelId="fuelType"
                                    id="fuelType"
                                    defaultValue=""
                                    label="fuelType"
                                    onChange={onFuelTypeChange}
                                    required={true}
                                    MenuProps={MenuProps}
                                >
                                    {fuelTypeOptions.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: "center"}}>
                            <FormControl fullWidth sx={{minWidth: 50, marginTop: 1}}>
                                <InputLabel id={"select-year-id"}>Transmission</InputLabel>
                                <Select
                                    labelId="transmission"
                                    id="transmission"
                                    defaultValue=""
                                    label="transmission"
                                    onChange={onTransmissionChange}
                                    required={true}
                                    MenuProps={MenuProps}
                                >
                                    {transmissionOptions.map(item => <MenuItem key={item}
                                                                               value={item}>{item}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6} style={{textAlign: "center"}}>
                            <FormControl fullWidth sx={{minWidth: 50, marginTop: 1}}>
                                <TextField
                                    id="outlined-number"
                                    label="Mileage"
                                    type="number"
                                    default="0"
                                    InputProps={{inputProps: {min: 0, max: 1000000}}}
                                    required={true}
                                    onChange={handleMileageChange}
                                />
                            </FormControl>
                        </Grid>
                        {!disableEngineSize &&
                            <Grid item xs={6} style={{textAlign: "center"}}>
                                <FormControl fullWidth sx={{minWidth: 50, marginTop: 1}}>
                                    <InputLabel id={"select-year-id"}>Engine Size</InputLabel>
                                    <Select
                                        labelId="engineSize"
                                        id="engineSize"
                                        defaultValue=""
                                        label="engineSize"
                                        onChange={onEngineSizeChange}
                                        required={true}
                                        MenuProps={MenuProps}
                                        disabled={disableEngineSize}
                                    >
                                        {engineSizeOptions.map(item => <MenuItem key={item}
                                                                                 value={item}>{item}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Grid>
                        }

                    </Grid>
                    <FormControl sx={{minWidth: 50, marginTop: 1}}>
                        <Button type="submit">SUBMIT</Button>
                    </FormControl>
                </FormGroup>
            </form>
            <form>
                <FormGroup>
                    <FormControl variant="standard" fullWidth sx={{minWidth: 30, marginTop: 1}}>
                        <Button type="submit">CLEAR</Button>
                    </FormControl>
                </FormGroup>
            </form>
        </>)
}
