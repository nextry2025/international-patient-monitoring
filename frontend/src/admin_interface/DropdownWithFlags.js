import React, { useState } from 'react';
import './DropdownWithFlags.css';

const DropdownWithFlags = ({ drapeaux, selectedCountry, setSelectedCountry }) => {
  const countries = [
    { code: 'MR', name: 'Mauritanie' },
    { code: 'FR', name: 'France' },
    { code: 'TN', name: 'Tunisie' },
    { code: 'MA', name: 'Maroc' },
    { code: 'DZ', name: 'Algérie' },
    { code: 'ES', name: 'Espagne' },
    { code: 'TR', name: 'Turquie' },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const handleCountryChange = (code) => {
    setSelectedCountry(code);
    setIsOpen(false);
  };

  const getSelectedCountryName = (code) => {
    const country = countries.find(country => country.code === code);
    return country ? country.name : 'Tous les pays';
  };

  return (
    <div className="dropdown">
      <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
        {selectedCountry ? (
          <>
            <img src={drapeaux[selectedCountry]} alt={getSelectedCountryName(selectedCountry)} className="flag-icon" />
            <span>{getSelectedCountryName(selectedCountry)}</span>
          </>
        ) : (
          'Tous les pays'
        )}
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <div className="dropdown-item" onClick={() => handleCountryChange('')}>
            Tous les pays
          </div>
          {countries.map((country) => (
            <div key={country.code} className="dropdown-item" onClick={() => handleCountryChange(country.code)}>
              <img src={drapeaux[country.code]} alt={country.name} className="flag-icon" />
              {country.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownWithFlags;
