import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './patientlist_user.css'
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



const PatientList = () => {
  const [soignes, setSoignes] = useState([]);
  const [user, setUser] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedStatut, setSelectedStatut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cliniqueId, setCliniqueId] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // État pour gérer la visibilité du popup
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);


  const fetchUser = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
  }
    try {
        const response = await axios.get('http://127.0.0.1:8080/api/utilisateurs/info', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const user = response.data;
        setUser(user)
        const email = user ? user.email : null;
    const cliniqueResponse = await axios.get(`http://127.0.0.1:8080/api/cliniques/findByEmail?email=${email}`);
    const cliniqueId = cliniqueResponse.data.id;
    setCliniqueId(cliniqueId);
    const patientsResponse = await axios.get(`http://127.0.0.1:8080/api/cliniques/${cliniqueId}/patients`);
    setPatients(patientsResponse.data);
    } catch (error) {
        console.error('Failed to fetch user data', error);
    }
    
};

  useEffect(() => {
    

    fetchUser();
}, []);

  useEffect(() => {
    if (cliniqueId) {
      fetchSoignes();
    }
  }, [cliniqueId]);

  const fetchSoignes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getSoigneByIdClinique/${cliniqueId}`);
      setSoignes(response.data);
    } catch (error) {
      console.error('Error fetching soignes:', error);
      setError('Erreur lors de la récupération des informations sur les soins.');
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    const soigne = soignes.find(s => s.patient.id === patient.id);
    setSelectedStatut(soigne ? soigne.statut : '');
  };

  const handleUpdateStatut = async (patient) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/patient/${patient.id}/updateStatus/${selectedStatut}`);
      await fetchSoignes();
      fetchUser()
      closePopup(); 
    } catch (error) {
      console.error('Error updating statut:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      {patients.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>NNI</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Tel</th>
              <th>CNI</th>
              <th>Passport</th>
              <th>Dossier Medicale</th>
              <th>Statut</th>
              <th >Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className={patient.statut}>

                <td>{patient.nni}</td>
                <td>{patient.nom}</td>
                <td>{patient.prenom}</td>
                <td>{patient.tel}</td>
                <td>{patient.cni}</td>
                <td>{patient.passport}</td>
                <td>
                
              
                <Link to={`/prestation_de_patient_clinique/${patient.id}`}>
                  <button>Prestations</button>
                </Link>

              </td>
                
                <td>{patient.statut}</td>
                <td>
                  <button onClick={() => { handleSelectPatient(patient); openPopup(); }}>Modifier l'état</button>
                  {selectedPatient && selectedPatient.id === patient.id && showPopup && ( // Afficher le popup si showPopup est vrai
                    <div className="popup">
                      <select className="page-dropdown" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
                      <option hidden>Sélectionnez un statut</option>
                        <option value="ADMIS_PAR_LA_CLINIQUE">admis</option>
                        <option value="REÇU_PAR_LA_CLINIQUE">Reçu</option>
                        <option value="PRIS_EN_CHARGE">pris en charge</option>
                        <option value="LIBÉRÉ_AVEC_RENDEZ_VOUS">Libéré avec rendez-vous</option>
                        <option value="LIBÉRÉ_SANS_RENDEZ_VOUS">Libéré sans rendez-vous</option>
                      </select>
                      <button onClick={() => handleUpdateStatut(patient)} disabled={loading}>Valider</button>
                      <button onClick={closePopup}>Annuler</button>
                    </div>
                  )}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun patient trouvé pour cette clinique.</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PatientList;
