import React from "react";
import Typography from '@mui/material/Typography';
import useCar from "../context/CarContext";
import Alert from '@mui/material/Alert';

/**
 * Returns price view for the current car context.
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function PriceView(props) {

    let showPrice = props.show;
    const {car, setCar} = useCar();

    if (showPrice) {
        return (
            <Alert icon={false} severity="success"
                   style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                <p style={{textAlign: "center"}}>your car is valued at...</p>
                <Typography variant="h3" gutterBottom style={{textAlign: "center"}}>
                    {car.price}
                </Typography>
            </Alert>
        )
    }

    return (<></>)

}
