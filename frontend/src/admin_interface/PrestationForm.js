import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PrestationForm.css';
import Swal from 'sweetalert2';
import { FaPlus } from 'react-icons/fa';
import TreeView from './TreeView';

const PrestationForm = () => {
  const [libelle, setLibelle] = useState('');
  const [description, setDescription] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [rapports, setRapports] = useState([]);
  const [ordonnancesMap, setOrdonnancesMap] = useState({});
  const [resultatsMap, setResultatsMap] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showAddResultPopup, setShowAddResultPopup] = useState(false);
  const [selectedOrdonnanceId, setSelectedOrdonnanceId] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPrestation();
      fetchOrdonnances(id);
      fetchResultats(id);
    }
  }, [id]);

  

  const fetchPrestation = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/prestation/getPrestationById/${id}`);
      const prestation = response.data;
      setLibelle(prestation.libelle);
      setRapports(prestation.rapports);

      const newOrdonnancesMap = {};
      const newResultatsOrdonnancesMap = {};
      for (const rapport of prestation.rapports) {
        const { ordonnances, resultatsOrdonnancesMap } = await fetchOrdonnances(rapport.id);
        newOrdonnancesMap[rapport.id] = ordonnances;
        Object.assign(newResultatsOrdonnancesMap, resultatsOrdonnancesMap);
      }
      setOrdonnancesMap(newOrdonnancesMap);
      setResultatsMap(newResultatsOrdonnancesMap);
    } catch (error) {
      console.error('Erreur lors de la récupération de la prestation :', error);
    }
  };

  const fetchOrdonnances = async (rapportId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/fichiers-ordonnance/rapport/${rapportId}`);
      const ordonnances = response.data;

      const newResultatsOrdonnancesMap = {};
      for (const ordonnance of ordonnances) {
        const resultats = await fetchResultats(ordonnance.id);
        newResultatsOrdonnancesMap[ordonnance.id] = resultats;
      }

      return { ordonnances, resultatsOrdonnancesMap: newResultatsOrdonnancesMap };
    } catch (error) {
      console.error('Erreur lors de la récupération des ordonnances :', error);
      return { ordonnances: [], resultatsOrdonnancesMap: {} };
    }
  };

  const fetchResultats = async (ordonnanceId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/resultats-ordonnance/fichierOrdonnance/${ordonnanceId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des résultats :', error);
      return [];
    }
  };

  const handleAddPrestation = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/prestation/addPrestation', { libelle });
      setLibelle(''); 
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la prestation :', error);
    }
  };

  const handleUpdatePrestation = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/prestation/updatePrestation/${id}`, { libelle });
      Swal.fire('Succès', 'Modifié avec succès !', 'success');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la prestation :', error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleResultFileChange = (event) => {
    setResultFile(event.target.files[0]);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setShowAddResultPopup(false);
  };

  const handleUploadAndAddRapport = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error('Aucun fichier sélectionné');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('files', selectedFile);

      const uploadResponse = await axios.post('http://localhost:8080/api/upload?type=Rapports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFileUrl = uploadResponse.data.filePath;

      const rapportData = {
        description,
        fichiersOrdonnance: [
          {
            fichier: uploadedFileUrl.toString(),
          },
        ],
      };

      if (id) {
        const response = await axios.post(`http://localhost:8080/api/prestation/addRapportToPrestation/${id}`, rapportData);
        setRapports(response.data.rapports);
        Swal.fire('Succès', 'Ajouté avec succès !', 'success');
      } else {
        const prestationData = {
          libelle: libelle,
          rapports: [rapportData],
        };
        await axios.post('http://localhost:8080/api/prestation/addPrestation', prestationData);
        Swal.fire('Succès', 'Ajouté avec succès !', 'success');
      }

      setSelectedFile(null); // Reset file input
      setDescription(''); // Reset description
      closePopup();
    } catch (error) {
      console.error('Erreur lors de l\'upload ou de l\'ajout du rapport :', error);
    }
  };

  const handleDeleteFile = async (rapportId) => {
    try {
      await axios.delete(`http://localhost:8080/api/rapport/deleteRapport/${rapportId}`);
      setRapports(rapports.filter(rapport => rapport.id !== rapportId));
      Swal.fire('Succès', 'Supprimé avec succès !', 'success');
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier :', error);
    }
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

      const fichier_de_reponse = uploadResponse.data.filePath;

      const resultData = {
        fichier: fichier_de_reponse.toString(),
      };
      await axios.post(`http://localhost:8080/api/fichiers-ordonnance/${selectedOrdonnanceId}/resultat`, resultData);

      setResultFile(null);
      closePopup();
      Swal.fire('Succès', 'Résultat ajouté avec succès !', 'success');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du résultat :', error);
    }
  };

  return (
    <div className="prestation-form">
      <div>
        <form onSubmit={id ? handleUpdatePrestation : handleAddPrestation}>
          <label>Libellé:</label>
          <input
            type="text"
            value={libelle}
            onChange={(e) => setLibelle(e.target.value)}
            required
          />
          {!showPopup && (
            <button type="submit">{id ? 'Mettre à jour la prestation' : 'Ajouter une prestation'}</button>
          )}
        </form>
        {!showPopup && (
          <button onClick={openPopup}>Ajouter un rapport</button>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <form onSubmit={handleUploadAndAddRapport}>
              <label>Description du rapport:</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <label>Fichier d'ordonnance:</label>
              <input type="file" accept=".pdf" onChange={handleFileChange} required />
              <button type="submit">Ajouter</button>
              <button onClick={closePopup}>Annuler</button>
            </form>
          </div>
        </div>
      )}

      {showAddResultPopup && (
        <div className="popup">
          <div className="popup-content">
            <form onSubmit={handleAddResult}>
              <label>Ajouter un résultat:</label>
              <input type="file" accept=".pdf" onChange={handleResultFileChange} required />
              <button type="submit">Ajouter</button>
              <button onClick={closePopup}>Annuler</button>
            </form>
          </div>
        </div>
      )}

      <div className="rapport-list">
      <TreeView rapports={rapports} ordonnancesMap={ordonnancesMap} resultatsMap={resultatsMap} />

      </div>
    </div>
  );
};

export default PrestationForm;
