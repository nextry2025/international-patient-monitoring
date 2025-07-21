import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PrestationAdmin = ({ prestations }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!prestations || prestations.length === 0) {
    return (
      <table>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Actions</th>
          </tr>
        </thead>
      </table>
    );
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPrestations = prestations.filter(prestation =>
    prestation.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="search-container">
      <input
        type="text"
        placeholder="Rechercher par libellé..."
        value={searchTerm}
        onChange={handleSearchChange}
      /></div>
      <table>
        <thead>
          <tr>
            <th>Libellé</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrestations.map(prestation => (
            <tr key={prestation.id}>
              <td>{prestation.libelle}</td>
              <td>
                <Link to={`/edit-prestation/${prestation.id}`}>
                  <button className="button">
                  <i class="fa-solid fa-file fa-2xl"></i>
                  <i class="fa-solid fa-question fa-xl"></i>
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrestationAdmin;
