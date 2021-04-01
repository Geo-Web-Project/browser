import React, {useState, useEffect} from 'react';

const GPS = () => {

    const initCoordinate = {lat: 0, lon: 0}
    const [coordinate, setCoordinate] = useState(initCoordinate);

    useEffect( ()=>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
            setCoordinate({lat: -1, lon: -1});
        }

    }, [] );

    const showPosition = (position) => {
        const {latitude, longitude} = position.coords;
        setCoordinate({lat: latitude, lon: longitude});
    }   

    return(
        <div>
            <span>{coordinate.lat}</span>
            <br/>
            <span>{coordinate.lon}</span>
        </div>
    );
    
}

export default GPS;