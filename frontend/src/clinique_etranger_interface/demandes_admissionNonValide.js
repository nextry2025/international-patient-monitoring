import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const DemandesNonValidees = () => {
  const [demandes, setDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [cliniqueId, setCliniqueId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState('');
  const [popupInput, setPopupInput] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
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
            setUser(user);
            fetchCliniqueByEmail(user.email);  // Appelle fetchCliniqueByEmail après avoir défini l'utilisateur
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };
    fetchUser();
  }, []);

const fetchDemandesNonValidees = async () => {

  try {
    const cliniqueResponse = await axios.get(`http://127.0.0.1:8080/api/cliniques/findByEmail?email=${user.email}`);
    if (cliniqueResponse.data) {
      const cliniqueId = cliniqueResponse.data.id;
      const demandesResponse = await axios.get('http://localhost:8080/api/demandes_admission/nonValidees');
      console.log(demandesResponse.data);
      const filteredDemandes = demandesResponse.data.filter(demande => 
        demande.clinique && demande.clinique.id === cliniqueId
      );
      setDemandes(filteredDemandes);

    } else {
      setError('Aucune clinique trouvée pour cet e-mail.');
    }
  } catch (err) {
    console.error('Erreur lors de la récupération des demandes:', err);  // Ajoute ceci pour plus de détails dans la console
    setError(`Erreur lors de la récupération des demandes: ${err.message}`);
  }
  
};


useEffect(() => {
  if (user.email) {
    fetchDemandesNonValidees();
  }
}, [user.email]);


  const fetchCliniqueByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cliniques/findByEmail?email=${email}`);
      setCliniqueId(response.data);
    } catch (error) {
      console.error('Error fetching clinique:', error);
    }
  };

  const envoyerMessage = async (senderId, receiverId, demandeId, content) => {
    try {
        await axios.post('http://localhost:8080/api/messages/send', null, {
            params: {
                senderId,
                receiverId,
                demandeAdmissionId:demandeId,
                content
            }
        });
        console.log(`Message sent from ${senderId} to ${receiverId} regarding demande ${demandeId}: ${content}`);
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

  const rejeterDemande = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/demandes_admission/getDemandeAdmissionById/${id}`);
      const demande = response.data;
      await axios.put(`http://localhost:8080/api/patient/${demande.patient.id}/updateStatus/PRET_POUR_TRANSFERT_A_ÉTRANGER`
      );
      const tous_les_users = await axios.get(`http://localhost:8080/api/utilisateurs`);
      const admins = tous_les_users.data.filter(utilisateur => utilisateur.role === 'Admin');
      admins.forEach(async admin => {
        await envoyerMessage(user.id, admin.id, id, `votre demande d'admission a été rejetée.`);
      });
      fetchDemandesNonValidees();
    } catch (error) {
      console.error('Error rejecting demande:', error);
    }
  };

  

  const validerDemande = (id) => {
    setSelectedDemande(id);
    setShowPopup(true);
  };

  const confirmerValidation = async () => {
    if (popupInput.toLowerCase() === 'ok') {
      try {
        await axios.put(`http://localhost:8080/api/demandes_admission/valider/${selectedDemande}`);
        const tous_les_users = await axios.get(`http://localhost:8080/api/utilisateurs`);
        const admins = tous_les_users.data.filter(utilisateur => utilisateur.role === 'Admin');
        admins.forEach(async admin => {
          await envoyerMessage(user.id, admin.id, selectedDemande, `votre demande d'admission a été acceptée.`);
        });
        fetchDemandesNonValidees();
        setShowPopup(false);
        setPopupInput('');
      } catch (error) {
        console.error('Error validating demande:', error);
        Swal.fire(
                'Erreur',
                'Une erreur est survenue lors de la validation.',
                'error'
              );
      }
    } else {
      Swal.fire(
        'Erreur',
        'Une erreur est survenue lors de la confirmation.',
        'error'
      );
    }
  };

  const consulterDemande = (demande) => {
    setSelectedDemande(demande);
    setShowModal(true);
  };

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="demandes-non-validees">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <h1>Demandes d'Admission Non Validées</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Pathologie</th>
                <th>Date Début</th>
                <th>Date Fin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map(demande => (
                <tr key={demande.id}>
                  <td>{demande.patient ? demande.patient.cni : 'N/A'}</td>
                  <td>{demande.pathologie}</td>
                  <td>{formatDate(demande.dateDebut)}</td>
                  <td>{formatDate(demande.dateFin)}</td>
                  <td>
                    <button onClick={() => consulterDemande(demande)}><i className="fa-solid fa-eye fa-xl"></i></button>
                    <button onClick={() => validerDemande(demande.id)}><i className="fa-solid fa-circle-check fa-2xl" style={{color: "#12f33f"}}></i></button>
                    <button onClick={() => rejeterDemande(demande.id)}><i class="fa-solid fa-rotate-left fa-flip-horizontal fa-2xl" style={{color: "#ff0000"}}></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedDemande && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Détails de la Demande</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>nom du Patient:</strong> {selectedDemande.patient ? selectedDemande.patient.nom : 'N/A'}</p>
            <p><strong>cni du Patient:</strong> {selectedDemande.patient ? selectedDemande.patient.cni : 'N/A'}</p>
            <p><strong>Pathologie:</strong> {selectedDemande.pathologie}</p>
            <p><strong>Date Début:</strong> {formatDate(selectedDemande.dateDebut)}</p>
            <p><strong>Date Fin:</strong> {formatDate(selectedDemande.dateFin)}</p>
            <p><strong>Résumé Conseils:</strong> <a href={`${selectedDemande.resumerConseils}`} target="_blank" rel="noopener noreferrer">Télécharger le PDF</a></p>
            <p><strong>Rapport Médical:</strong> <a href={`${selectedDemande.rapportMedical}`} target="_blank" rel="noopener noreferrer">Télécharger le PDF</a></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Fermer</Button>
          </Modal.Footer>
        </Modal>
      )}

      <Modal show={showPopup} onHide={() => setShowPopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la Validation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="validationInput">
            <Form.Label>Écrivez "ok" pour confirmer la validation:</Form.Label>
            <Form.Control
              type="text"
              value={popupInput}
              onChange={(e) => setPopupInput(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPopup(false)}>Annuler</Button>
          <Button variant="primary" onClick={confirmerValidation}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DemandesNonValidees;
