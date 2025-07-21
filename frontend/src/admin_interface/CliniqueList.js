import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CliniqueList.css';
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
import vide from '../images/drapeaux/vide.png';
import DropdownWithFlags from './DropdownWithFlags'

const CliniqueList = () => {
  const [initialUsername, setInitialUsername] = useState('');
  const [cliniques, setCliniques] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(''); 
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('Nationale'); // Valeur par défaut
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [pays, setPays] = useState('');
  const [selectedClinique, setSelectedClinique] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const drapeaux = {
    MR: Mauritanie,
    FR: France,
    TN: Tunisie,
    MA: Maroc,
    DZ: Algerie,
    ES: Espagne,
    TR: Turquie,
    vide
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCountry]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const clinicsPerPage = 5;

  useEffect(() => {
    const fetchUser = async () => {
        const token = sessionStorage.getItem('token');
        if(!token){
          navigate('/')
        }
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

  useEffect(() => {
    fetchCliniques();
  }, []);

  const fetchCliniques = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cliniques/sortedByPatients');
      const cliniquesData = Array.isArray(response.data) ? response.data : [];
      setCliniques(cliniquesData);
    } catch (error) {
      console.error('Error fetching cliniques:', error);
    }
  };

  const deleteClinique = async (id) => {
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
          await axios.delete(`http://localhost:8080/api/cliniques/${id}`);
          setCliniques(cliniques.filter(clinique => clinique.id !== id));
          Swal.fire(
            'Supprimé !',
            'La clinique a été supprimée.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting clinique:', error);
          Swal.fire(
            'Erreur',
            'Une erreur est survenue lors de la suppression de la clinique.',
            'error'
          );
        }
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const filteredCliniques = cliniques.filter(clinique => {
    const searchLower = searchTerm.toLowerCase();
    const countryLower = selectedCountry.toLowerCase();
    return (
      (clinique.nom.toLowerCase().includes(searchLower) ||
        clinique.email.toLowerCase().includes(searchLower) ||
        clinique.pays.toLowerCase().includes(searchLower) ||
        clinique.type.toLowerCase().includes(searchLower)) &&
      (countryLower === '' || clinique.pays.toLowerCase().includes(countryLower))
    );
  });

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setNom('');
    setEmail('');
    setPays('');
    setType('Nationale'); // Réinitialiser le type à la valeur par défaut
    setSelectedClinique(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clinique = { nom, email, pays, type };
    try {
      if (selectedClinique) {
        await axios.put(`http://localhost:8080/api/cliniques/${selectedClinique}`, clinique);
        Swal.fire('Succès','Modifié avec succès !','success')
      } else {
        await axios.post('http://localhost:8080/api/cliniques', clinique);
        Swal.fire('Succès','Ajouté avec succès !','success')
      }

      setNom('');
      setEmail('');
      setPays('');
      setType('');
      setShowModal(false);
      handleClose();
      fetchCliniques();
    } catch (error) {
      console.error('Error saving clinique:', error);
    }
  };

  const handleEdit = (clinique) => {
    setSelectedClinique(clinique.id);
    setNom(clinique.nom);
    setEmail(clinique.email);
    setPays(clinique.pays);
    setType(clinique.type); 
    setShowModal(true);
  };

  const indexOfLastClinique = currentPage * clinicsPerPage;
  const indexOfFirstClinique = indexOfLastClinique - clinicsPerPage;
  const currentCliniques = filteredCliniques.slice(indexOfFirstClinique, indexOfLastClinique);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="table-container">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} user={user} />
        <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
          <Navbar toggleSidebar={toggleSidebar} user={user} />
          <h1>Liste des Cliniques</h1>
          <div className="button-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher ..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <DropdownWithFlags drapeaux={drapeaux} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />

          </div>
          <table>
            <thead>
              <tr>
                <button className="button" onClick={handleShow}><i className="fa-regular fa-plus"></i> </button>
                <td colSpan={5}>
                  <div className="pagination-container">
                    <select
                      value={currentPage}
                      onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                      className="page-dropdown"
                    >
                      {Array.from({ length: Math.ceil(filteredCliniques.length / clinicsPerPage) }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                    

                  </div>
                </td>
              </tr>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Pays</th>
                <th>Type</th>
                <th>Nb_Patients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentCliniques.map(clinique => (
                <tr key={clinique.id}>
                  <td>{clinique.nom}</td>
                  <td>{clinique.email}</td>
                  <td>
                    <img
                      src={drapeaux[clinique.pays] || vide}
                      alt={clinique.pays}
                      className="flag-icon"
                      style={{ width: '50px', height: '50px' }}

                    />
                  </td>
                  <td>{clinique.type}</td>
                  <td style={{ textAlign: 'center' }}>{clinique.patientCount}</td>
                  
                  <td>
                    <button onClick={() => handleEdit(clinique)}><i className="fa-regular fa-pen-to-square"></i></button>
                    <button onClick={() => deleteClinique(clinique.id)}><i className="fa-solid fa-trash"></i></button>
                    <Link to={`/patients/${clinique.id}`}>
                      <button><i className="fa-solid fa-list"></i></button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedClinique ? 'Modifier la Clinique' : 'Ajouter une Clinique'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nom">Nom</label>
              <input
                type="text"
                className="form-control"
                id="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="pays">Pays</label>
              <input
                type="text"
                className="form-control"
                id="pays"
                value={pays}
                onChange={(e) => setPays(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                className="form-control"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="Nationale">Nationale</option>
                <option value="Internationale">Internationale</option>
              </select>
            </div>
            <Button variant="secondary" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {selectedClinique ? 'Sauvegarder' : 'Ajouter'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CliniqueList;
