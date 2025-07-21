import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Swal from 'sweetalert2';
import Mauritanie from '../images/drapeaux/Mauritania.png';
import France from '../images/drapeaux/France.jpg';
import Tunisie from '../images/drapeaux/Tunisie.jpg';
import Maroc from '../images/drapeaux/Marocco.png';
import Algerie from '../images/drapeaux/Algeria.png';
import Espagne from '../images/drapeaux/Spain.png';
import Turquie from '../images/drapeaux/Turkey.png';
import vide from '../images/drapeaux/vide.png'




const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nni, setNNI] = useState('');
  const [cni, setCni] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [passport, setPassport] = useState('');
  const [tel, setTel] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsCountries, setPatientsCountries] = useState({});
  const [cliniqueEmails, setCliniqueEmails] = useState({});
  const [cliniqueStatuses, setCliniqueStatuses] = useState({});


  const clinicsPerPage = 5;

  const drapeaux = {
    MR:Mauritanie,
    FR:France,
    TN:Tunisie,
    MA:Maroc,
    DZ:Algerie,
    ES:Espagne,
    TR:Turquie,
    vide
  };

  
  


  const [inDemande, setInDemande] = useState(null);
  const [cliniqueEmail, setCliniqueEmail] = useState('');
  const [demandeId, setDemandeId] = useState(null);


  useEffect(() => {
    fetchPatients();
  }, []);

  
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/patient/getAllPatients');
      setPatients(Array.isArray(response.data) ? response.data : []);
      const patientsData = Array.isArray(response.data) ? response.data : [];
      const countriesData = {};
      const emailsData = {};
      for (let patient of patientsData) {
        const country = await fetchCountry(patient.id);
        const email = await fetchCliniqueEmail(patient.id); // Récupération de l'email de la clinique
        countriesData[patient.id] = country;
        emailsData[patient.id] = email;
      }
      setPatientsCountries(countriesData);
      setCliniqueEmails(emailsData); // Mise à jour de l'état avec les emails des cliniques
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const fetchCliniqueEmail = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/patient/checkClinique/${patientId}`);
      return response.data.cliniqueId; // Assure-toi que la réponse contient le champ 'email'
    } catch (error) {
      console.error('Error fetching clinique email:', error);
      return '';
    }
  };

  const fetchCountry = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/getPatientCountryById/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient country:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patient = { nni, cni, nom, prenom, passport, tel };

    try {
      if (selectedPatient) {
        await axios.put(`http://localhost:8080/api/patient/updatePatient/${selectedPatient.id}`, patient);
        Swal.fire('Succès', 'Modifié avec succès !', 'success');
      } else {
        await axios.post('http://localhost:8080/api/patient/addPatient', patient);
        Swal.fire('Succès', 'Ajouté avec succès !', 'success');
      }
      fetchPatients();
      handleClose();
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setNNI(patient.nni);
    setCni(patient.cni);
    setNom(patient.nom);
    setPrenom(patient.prenom);
    setPassport(patient.passport);
    setTel(patient.tel);
    setShowModal(true);
  };

  const deletePatient = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Voulez-vous vraiment supprimer cette clinique ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/patient/deletePatient/${id}`);
          setPatients(patients.filter(patient => patient.id !== id));
          Swal.fire('Supprimé !', 'Le patient a été supprimé.', 'success');
        } catch (error) {
          console.error('Error deleting patient:', error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression du patient.', 'error');
        }
      }
    });
  };

  const handleShow = () => {
    setSelectedPatient(null);
    setNNI('');
    setCni('');
    setNom('');
    setPrenom('');
    setPassport('');
    setTel('');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // const handleCliniqueClick = async (patientId) => {
  //   try {
  //     const response = await axios.get(`http://localhost:8080/api/patient/checkClinique/${patientId}`);
  //     if (response.data.cliniqueId) {
  //       Swal.fire({
  //         text: `Ce patient est déjà pris en charge dans la clinique ayant l'email '${response.data.cliniqueId}'`,
  //       });
  //     } else {
  //       navigate(`/affecter_clinique/${patientId}`);
  //     }
  //   } catch (error) {
  //     console.error('Error checking clinique:', error);
  //   }
  // };


  const verifier_attente = async(patientId) => {
    try{
      const response = await axios.get(`http://localhost:8080/api/patient/checkDemande/${patientId}`);
      if(response.data.cliniqueEmail){
        return response.data.cliniqueId;
      }
      else{
        return "vide";
      }
    }
    catch (error) {
      console.error('Error checking clinique:', error);
    }
  }





  const handleCliniqueClick = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/patient/checkClinique/${patientId}`);
      if (response.data.cliniqueId) {
        Swal.fire({
          text: `Ce patient est déjà pris en charge dans la clinique ayant l'email '${response.data.cliniqueId}'`,
        });
      } else {
        const response = await axios.get(`http://localhost:8080/api/patient/checkDemande/${patientId}`);
        setInDemande(response.data.inDemande);
        if (response.data.inDemande) {
          setCliniqueEmail(response.data.cliniqueEmail);
          setDemandeId(response.data.demandeId); 
          Swal.fire({
            text: `Ce patient est en demande à la clinique ayant l'email '${response.data.cliniqueEmail}'`,
            showCancelButton: true,
            confirmButtonText: 'Ok',
            cancelButtonText: 'Supprimer la demande',
            cancelButtonColor: '#d33'
          }).then(async (result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              await deleteDemande(response.data.demandeId,patientId);
            }
          });
        } else {
          navigate(`/affecter_clinique/${patientId}`);
        }
      }
    } catch (error) {
      console.error('Error checking clinique:', error);
    }
  };
  const getpays = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/getPatientCountryById/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking clinique:', error);
    }
  };



  const deleteDemande = async (demandeId,patientId) => {
    try {
      await axios.delete(`http://localhost:8080/api/demandes_admission/delete/${demandeId}`);
      await axios.put(`http://localhost:8080/api/patient/${patientId}/updateStatus/${"PRET_POUR_TRANSFERT_A_ÉTRANGER"}`);
      Swal.fire('Supprimé!', 'La demande a été supprimée.', 'success');
      setInDemande(false);
    } catch (error) {
      Swal.fire('Erreur!', 'Une erreur s\'est produite lors de la suppression de la demande.', 'error');
    }
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatient = patients.filter(patient => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(patient).some(value =>
      value && value.toString().toLowerCase().includes(searchLower)
    );
  });

  const indexOfLastPatient = currentPage * clinicsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - clinicsPerPage;
  const currentCliniques = filteredPatient.slice(indexOfFirstPatient, indexOfLastPatient);

  return (
    <div>
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
          <Navbar toggleSidebar={toggleSidebar} />
          <h1>Liste des Patients</h1>

          <div className="button-container">
            <Link to="/patients-prise-en-charge">
              <button className="button">Patients Prises en Charge</button>
            </Link>
            <Link to="/patients-en-attente">
              <button className="button">Patients en Attente d'Admission</button>
            </Link>
          </div>



          <div className="button-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher ..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <button className="button" onClick={handleShow}><i className="fa-regular fa-plus"></i> </button>
                <td colSpan={8}>
                  <div className="pagination-container">
                    <select
                      value={currentPage}
                      onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                      className="page-dropdown"
                    >
                      {Array.from({ length: Math.ceil(filteredPatient.length / clinicsPerPage) }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
              <tr>
                <th>NNI</th>
                <th>CNI</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Passport</th>
                <th>Téléphone</th>
                <th>Pays d'accueil</th>
                <th>Email de la Clinique</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>Aucun patient disponible</td>
                </tr>
              ) : (
                currentCliniques.map(patient => (
                  <tr key={patient.id}>
                    <td>{patient.nni}</td>
                    <td>{patient.cni}</td>
                    <td>{patient.nom}</td>
                    <td>{patient.prenom}</td>
                    <td>{patient.passport}</td>
                    <td>{patient.tel}</td>
                    <td style={{ justifyContent: 'center', display: 'flex' }}>
                    {patientsCountries[patient.id] ? (
                      <img 
                        src={drapeaux[patientsCountries[patient.id]]} 
                        alt={patientsCountries[patient.id]} 
                        style={{ width: '50px', height: '50px' }} 
                      />
                    ) : patient.statut === "EN_ATTENTE_ADMISSION" ? (
                      <div class="loader"></div>
                      
                    ) : (
                      <img
                        src={drapeaux.vide}
                        alt="vide"
                        style={{ width: '50px', height: '50px' }}
                      />
                    )}
                  </td>
                  <td>
                    {cliniqueEmails[patient.id] ? cliniqueEmails[patient.id] : patient.statut =='EN_ATTENTE_ADMISSION'?'En attente d\'admission':'Non disponible'}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(patient)}><i className="fa-regular fa-pen-to-square"></i></button>
                    <button onClick={() => deletePatient(patient.id)}><i className="fa-solid fa-trash"></i></button>
                    <button onClick={() => handleCliniqueClick(patient.id)}>Clinique</button>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPatient ? 'Modifier Patient' : 'Ajouter Patient'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>NNI</label>
              <input
                type="text"
                placeholder="NNI"
                value={nni}
                onChange={(e) => setNNI(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>CNI</label>
              <input
                type="text"
                placeholder="CNI"
                value={cni}
                onChange={(e) => setCni(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                placeholder="Prénom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Passport</label>
              <input
                type="text"
                placeholder="Passport"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="text"
                placeholder="Téléphone"
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                required
              />
            </div>
            <button type="submit">{selectedPatient ? 'Modifier Patient' : 'Ajouter Patient'}</button>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatientList;
