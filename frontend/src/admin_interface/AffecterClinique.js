import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import './AffecterClinique.css';

const AffecterClinique = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [cliniques, setCliniques] = useState([]);
  const [user, setUser] = useState('');
  const [selectedClinique, setSelectedClinique] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [pathologies, setPathologies] = useState([]);
  const [selectedPathologie, setSelectedPathologie] = useState('');
  const [rapportMedical, setRapportMedical] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCliniques();
    fetchPathologies();
  }, []);

  const fetchCliniques = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cliniques');
      const cliniquesInternationale = response.data.filter(clinique => clinique.type === 'Internationale');
      setCliniques(cliniquesInternationale);
    } catch (error) {
      console.error('Error fetching cliniques:', error);
    }
  };

  const fetchPathologies = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/patho/getAllPathologies');
      setPathologies(response.data);
    } catch (error) {
      console.error('Error fetching pathologies:', error);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const updatedFiles = [...rapportMedical, ...files];
    setRapportMedical(updatedFiles);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    rapportMedical.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:8080/api/upload?type=Demandes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.filePath;
    } catch (error) {
      console.error('Error uploading files:', error);
      return [];
    }
  };

  const envoyerMessage = async (senderId, receiverId, demande_admission, content) => {
    try {
      await axios.post('http://localhost:8080/api/messages/send', null, {
        params: {
          senderId,
          receiverId,
          demandeAdmissionId: demande_admission,
          content
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
        const token = sessionStorage.getItem('token');
        try {
            const response = await axios.get('http://127.0.0.1:8080/api/utilisateurs/info', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const user = response.data;
            setUser(user)
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    fetchUser();
}, []);

  const validateDates = () => {
    if (new Date(dateFin) < new Date(dateDebut)) {
      setErrorMessage('La date de fin ne peut pas être avant la date de début.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    const les_files = await handleUpload();
    if (les_files.length < 2) {
      console.error('Files upload failed');
      return;
    }

    const dataDemande = {
      resumerConseils: les_files[0],
      rapportMedical: les_files[1],
      patient: {
        id: patientId,
      },
      clinique: {
        id: selectedClinique,
      },
      pathologie: selectedPathologie,
      dateDebut: new Date(dateDebut),
      dateFin: new Date(dateFin),
      valide: false,
    };

    try {
      const demande_admission = await axios.post('http://localhost:8080/api/demandes_admission/addDemande', dataDemande, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const clinique_compte = await axios.get(`http://localhost:8080/api/cliniques/${selectedClinique}`)
      const utilisateurResponse = await axios.get(`http://localhost:8080/api/utilisateurs/email/${clinique_compte.data.email}`);
      await envoyerMessage(user.id, utilisateurResponse.data.id, demande_admission.data.id, `CNAM vous a envoyee une demande d'admission`);
      navigate('/patients');
    } catch (error) {
      console.error('Error saving demande:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="affclin">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
          <Navbar toggleSidebar={toggleSidebar} />

          <form onSubmit={handleSubmit}>
            <label>Clinique</label>
            <select
              value={selectedClinique}
              onChange={(e) => setSelectedClinique(e.target.value)}
              required
            >
              <option value="" disabled>Select Clinique</option>
              {cliniques.map((clinique) => (
                <option key={clinique.id} value={clinique.id}>
                  {clinique.email}
                </option>
              ))}
            </select>
            <label>Date Début</label>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              required
            />
            <label>Date Fin</label>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              required
            />
            {errorMessage && <p className="error">{errorMessage}</p>}
            <label>Pathologie</label>
            <select
              value={selectedPathologie}
              onChange={(e) => setSelectedPathologie(e.target.value)}
              required
            >
              <option value="" disabled>Select Pathologie</option>
              {pathologies.map((pathologie) => (
                <option key={pathologie.id} value={pathologie.type}>
                  {pathologie.type}
                </option>
              ))}
            </select>
            <label>Résumé Conseils (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            <label>Prise en charge (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              required
            />
            <button type="submit">Affecter Clinique</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AffecterClinique;