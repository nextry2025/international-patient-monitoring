import React, { useState } from 'react';
import './PrestationForm.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

// Composant pour afficher les résultats dans chaque ordonnance
const OrdonnanceItem = ({ ordonnance, resultats, onAddResult }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="ordonnance-item">
      <div className="ordonnance-header" onClick={() => setIsOpen(!isOpen)}>
        <button className="toggle-button">{isOpen ? '[-]' : '[+]'}</button>
        <strong>Ordonnance :</strong>
        <a href={ordonnance.fichier} target="_blank" rel="noopener noreferrer" className="file-link">
          Voir le fichier
        </a>
        <button 
          onClick={() => onAddResult(ordonnance.id)} 
          style={{ cursor: 'pointer', marginLeft: '10px' }}
          title="Ajouter un résultat"
        >
            Ajouter un résultat
        </button>
      </div>
      {isOpen && resultats.length > 0 && (
        <div className="resultats-list">
          {resultats.map((resultat, index) => (
            <div key={index} className="resultat-item">
              <a href={resultat.fichier} target="_blank" rel="noopener noreferrer">
                Résultat
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant principal pour afficher l'arborescence des ordonnances et résultats
const TreeView = ({ rapports, ordonnancesMap, resultatsMap, onAddOrdonnance, onAddResult }) => {
  const [openRapports, setOpenRapports] = useState({});
  const [showAddOrdonnancePopup, setShowAddOrdonnancePopup] = useState(false);
  const [showAddResultPopup, setShowAddResultPopup] = useState(false);
  const [selectedOrdonnanceId, setSelectedOrdonnanceId] = useState(null);
  const [selectedRapportId, setSelectedRapportId] = useState(null);
  const [ordonnanceFile, setOrdonnanceFile] = useState(null);
  const [resultFile, setResultFile] = useState(null);

  const closePopup = () => {
    setShowAddOrdonnancePopup(false);
    setShowAddResultPopup(false);
    setSelectedOrdonnanceId(null);
    setSelectedRapportId(null);
    setOrdonnanceFile(null);
    setResultFile(null);
  };

  const handleResultFileChange = (event) => {
    setResultFile(event.target.files[0]);
  };

  const handleOrdonnanceFileChange = (event) => {
    setOrdonnanceFile(event.target.files[0]);
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    if (!resultFile || !selectedOrdonnanceId) {
      console.error('Aucun fichier résultat sélectionné ou ordonnance sélectionnée');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('files', resultFile);

      const uploadResponse = await axios.post('http://localhost:8080/api/upload?type=Rapports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fichierDeReponse = uploadResponse.data.filePath;

      const resultData = {
        fichier: fichierDeReponse.toString(),
      };
      await axios.post(`http://localhost:8080/api/fichiers-ordonnance/${selectedOrdonnanceId}/resultat`, resultData);

      Swal.fire('Succès', 'Résultat ajouté avec succès !', 'success');
      closePopup();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du résultat :', error);
    }
  };

  const handleAddOrdonnance = async (e) => {
    e.preventDefault();
    if (!ordonnanceFile || !selectedRapportId) {
      console.error('Aucun fichier ordonnance sélectionné ou rapport sélectionné');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('files', ordonnanceFile);

      const uploadResponse = await axios.post('http://localhost:8080/api/upload?type=Rapports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fichierDeOrdonnance = uploadResponse.data.filePath;

      const ordonnanceData = {
        fichier: fichierDeOrdonnance.toString(),
      };
      await axios.post(`http://localhost:8080/api/rapport/addFichierOrdonnance/${selectedRapportId}`, ordonnanceData);

      Swal.fire('Succès', 'Ordonnance ajoutée avec succès !', 'success');
      closePopup();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'ordonnance :', error);
    }
  };

  const handleToggleRapport = (rapportId) => {
    setOpenRapports((prev) => ({
      ...prev,
      [rapportId]: !prev[rapportId],
    }));
  };

  const openAddOrdonnancePopup = (rapportId) => {
    setSelectedRapportId(rapportId);
    setShowAddOrdonnancePopup(true);
  };

  const closeAddOrdonnancePopup = () => {
    setShowAddOrdonnancePopup(false);
    setSelectedRapportId(null);
  };

  const openAddResultPopup = (ordonnanceId) => {
    setSelectedOrdonnanceId(ordonnanceId);
    setShowAddResultPopup(true);
  };

  const closeAddResultPopup = () => {
    setShowAddResultPopup(false);
    setSelectedOrdonnanceId(null);
  };

  return (
    <div className="tree-view">
      {showAddOrdonnancePopup && (
        <div className="popup">
          <div className="popup-content">
            <form onSubmit={handleAddOrdonnance}>
              <label>Ajouter une ordonnance (fichier PDF) :</label>
              <input type="file" accept="application/pdf" onChange={handleOrdonnanceFileChange} required />
              <button type="submit">Ajouter Ordonnance</button>
            </form>
            <button onClick={closeAddOrdonnancePopup}>Fermer</button>
          </div>
        </div>
      )}

      {showAddResultPopup && (
        <div className="popup">
          <div className="popup-content">
            <form onSubmit={handleAddResult}>
              <label>Ajouter un résultat (fichier PDF) :</label>
              <input type="file" accept="application/pdf" onChange={handleResultFileChange} required />
              <button type="submit">Ajouter résultat</button>
            </form>
            <button onClick={closePopup}>Fermer</button>
          </div>
        </div>
      )}

      {rapports.map((rapport) => (
        <div key={rapport.id} className="rapport-item">
          <button className="toggle-button" onClick={() => handleToggleRapport(rapport.id)}>
            {openRapports[rapport.id] ? '[-]' : '[+]'}
          </button>
          <strong>Description du Rapport : {rapport.description}</strong>
          <button
            onClick={() => openAddOrdonnancePopup(rapport.id)}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            title="Ajouter une ordonnance"
          >
            Ajouter un ordonnance
          </button>
          <div className="ordonnances-list">
            {openRapports[rapport.id] && ordonnancesMap[rapport.id]?.map((ordonnance) => (
              <OrdonnanceItem
                key={ordonnance.id}
                ordonnance={ordonnance}
                resultats={resultatsMap[ordonnance.id] || []}
                onAddResult={openAddResultPopup}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TreeView;
