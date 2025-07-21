import React, { useState } from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';

const WorldMap = ({ countryData }) => {
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleCountryClick = (event, countryCode) => {
        const value = countryData[countryCode] || 0;
        setSelectedCountry({ code: countryCode, value: value });
    };

    return (
        <div style={{ margin: 'auto', width: '500px', height: '300px', position: 'relative',marginLeft:'25%' }}>
            <VectorMap
                map={worldMill}
                containerStyle={{
                    width: '100%',
                    height: '100%'
                }}
                series={{
                    regions: [{
                        values: countryData,
                        scale: ['#E2AEFF', '#5E32CA'],
                        normalizeFunction: 'polynomial',
                        min: 0,
                        max: 100
                    }]
                }}
                regionStyle={{
                    initial: {
                        fill: '#e4e4e4'
                    },
                    hover: {
                        fill: '#a4e100',
                        stroke: 'black'
                    }
                }}
                onRegionClick={handleCountryClick}
            />
            {selectedCountry && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white',color:'black', padding: '10px', border: '1px solid #ccc' }}>
                    <h6>Le pays {selectedCountry.code} a {selectedCountry.value} patient(s)</h6>

                </div>
            )}
        </div>
    );
};

export default WorldMap;
