import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoIosAddCircle } from "react-icons/io";
import './DemandeList.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Swal from 'sweetalert2';

const DemandeList = () => {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState('');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [nomPrenom, setNomPrenom] = useState('');
  const [inam, setInam] = useState('');
  const [resume, setResume] = useState('');
  const [acteDemande, setActeDemande] = useState(['']);
  const [tel, setTel] = useState('');
  const [piecesJointes, setPiecesJointes] = useState(['']);
  const [cliniqueId, setCliniqueId] = useState('');
  const [valide, setValide] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [actes, setActes] = useState([]);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const fetchActes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/actes');
      setActes(response.data);
    } catch (error) {
      console.error('Error fetching actes:', error);
    }
  };
  useEffect(() => {
    fetchActes();
  }, []);
  const getAvailableActes = (index) => {
    return actes.filter(acte => !acteDemande.includes(acte.id) || acteDemande[index] === acte.id);
  };
  
  

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const fetchCliniqueByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cliniques/findByEmail?email=${email}`);
      setCliniqueId(response.data);
    } catch (error) {
      console.error('Error fetching clinique:', error);
    }
  };

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
            setUser(user)
            fetchCliniqueByEmail(user.email);
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    fetchUser();
}, []);

  useEffect(() => {
    if (cliniqueId) {
      fetchDemandes();
    }
  }, [cliniqueId]);

  const fetchDemandes = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cliniques/${cliniqueId.id}/demandes`);
      setDemandes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching demandes:', error);
    }
  };

  const deleteDemande = async (id) => {
    Swal.fire({
        title: 'Êtes-vous sûr?',
        text: "Voulez-vous vraiment supprimer cette demande?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimez-la!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/api/demande/deleteDemande/${id}`);
                setDemandes((prevDemandes) => prevDemandes.filter(demande => demande.id !== id));
                Swal.fire(
                    'Supprimée!',
                    'La demande a été supprimée.',
                    'success'
                );
            } catch (error) {
                console.error('Error deleting demande:', error);
                Swal.fire(
                    'Erreur!',
                    'Une erreur est survenue lors de la suppression de la demande.',
                    'error'
                );
            }
        }
    });
};

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDemandes = demandes.filter(demande =>
  demande && (
    (demande.nomPrenom && demande.nomPrenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (String(demande.INAM) && String(demande.inam).toLowerCase().includes(searchTerm.toLowerCase())) ||
    (demande.resume && demande.resume.toLowerCase().includes(searchTerm.toLowerCase()))
  )
);

  


  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNomPrenom('');
    setInam('');
    setResume('');
    setActeDemande(['']);
    setTel('');
    setPiecesJointes(['']);
    setValide(false);
    setSelectedDemande(null);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    const les_files = await handleUpload();

    const demandeData = {
        nomPrenom,
        inam,
        resume,
        tel,
        piecesJointes: les_files,
        valide,
    };

    try {
        let demandeResponse;
        let demandeId;

        if (selectedDemande) {
            demandeResponse = await axios.put(`http://localhost:8080/api/demande/updateDemande/${selectedDemande.id}`, demandeData);
            demandeId = demandeResponse.data.id;
        } else {
            demandeResponse = await axios.post(`http://localhost:8080/api/cliniques/addDemandetToClinique/${cliniqueId.id}`, demandeData);
            demandeId = demandeResponse.data.id;
        }

        if (!demandeId) {
            throw new Error('La réponse de la demande ne contient pas d\'identifiant.');
        }

        const actesDemandesData = acteDemande.map(acte => ({
            demande: { id: demandeId },
            actes: { id: acte },
        }));

        if (selectedDemande) {
            await axios.delete(`http://localhost:8080/api/actes_demandes/demande/${selectedDemande.id}`);
        }

        await axios.post(`http://localhost:8080/api/actes_demandes`, actesDemandesData);

        setShowModal(false);
        fetchDemandes();
    } catch (error) {
        console.error('Error saving demande:', error.response ? error.response.data : error.message);
        Swal.fire(
            'Erreur!',
            `Une erreur est survenue lors de la sauvegarde de la demande : ${error.response ? error.response.data.message : error.message}`,
            'error'
        );
    }
};


  



  const handleEdit = async (demande) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/actes_demandes/demande/${demande.id}/actes`);
    const actesDemandes = response.data;

    const actesIds = actesDemandes.map(acteDemande => acteDemande.actes.id);

    setSelectedDemande(demande);
    setNomPrenom(demande.nomPrenom);
    setInam(demande.inam);
    setResume(demande.resume);
    setTel(demande.tel);
    setActeDemande(actesIds);
    setPiecesJointes(demande.piecesJointes);
    setValide(demande.valide);
    setShowModal(true);
  } catch (error) {
    console.error("Erreur lors de la récupération des actes de la demande:", error);
  }
};

  

const handleActeDemandeChange = (index, value) => {
  const updatedActeDemande = [...acteDemande];
  updatedActeDemande[index] = value;
  setActeDemande(updatedActeDemande);
};

  const handleAddActeDemande = () => {
    setActeDemande([...acteDemande, '']);
  };

  const handleRemoveActeDemande = (index) => {
    const updatedActeDemande = [...acteDemande];
    updatedActeDemande.splice(index, 1);
    setActeDemande(updatedActeDemande);
  };

  const handlePiecesJointesChange = (index, file) => {
    const updatedPiecesJointes = [...piecesJointes];
    updatedPiecesJointes[index] = file;
    setPiecesJointes(updatedPiecesJointes);
  };

  const handleAddPiecesJointes = () => {
    setPiecesJointes([...piecesJointes, '']);
  };

  const handleRemovePiecesJointes = (index) => {
    const updatedPiecesJointes = [...piecesJointes];
    updatedPiecesJointes.splice(index, 1);
    setPiecesJointes(updatedPiecesJointes);
  };

  const validateTel = (value) => /^\d{8}$/.test(value);

  return (
    <div className="table-container">
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} user={user} />
        <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} user={user} />
          <h1>Liste des Demandes</h1>
          <div className="button-container">
            <div className="search-container">
              <input
                className='Rechercher'
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
              <button className="button" onClick={handleShow}><IoIosAddCircle /></button>
              </tr>
              <tr>
                <th>Nom et Prénom</th>
                <th>INAM</th>
                <th>Résumé</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandes.map((demande) => (
                <tr key={demande.id}>
                  <td>{demande.nomPrenom}</td>
                  <td>{demande.inam}</td>
                  <td>{demande.resume}</td>
                  <td>
                    <button onClick={() => handleEdit(demande)}><i className="fa-regular fa-pen-to-square"></i></button>
                    <button onClick={() => deleteDemande(demande.id)}><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedDemande ? 'Modifier Demande' : 'Ajouter Demande'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
  <form onSubmit={handleSubmit} className='popup'>
    <label>Nom et Prénom</label>
    <input
      type="text"
      placeholder="Nom et Prénom"
      value={nomPrenom}
      onChange={(e) => setNomPrenom(e.target.value)}
      required
    />
        <label>INAM</label>

    <input
      type="text"
      placeholder="INAM"
      value={inam}
      onChange={(e) => setInam(e.target.value)}
      required
    />
        <label>Résumé</label>

    <textarea
      placeholder="Résumé"
      value={resume}
      onChange={(e) => setResume(e.target.value)}
      required
    />
    
    <button type="button" className='addbutton' onClick={handleAddActeDemande}>
      <i className="fa-solid fa-plus"></i>
    </button>
    {acteDemande.map((acteId, index) => (
  <div key={index}>
    {index !== 0 && (
      <button type="button" className='removebutton' onClick={() => handleRemoveActeDemande(index)}>
        <i className="fa-solid fa-square-minus"></i>
      </button>
    )}
    <select
      className="form-control"
      value={acteId}
      onChange={(e) => handleActeDemandeChange(index, e.target.value)}
      required
    >
      <option value="">Sélectionner un acte</option>
      {getAvailableActes(index).map((acte) => (
        <option key={acte.id} value={acte.id}>
          {acte.libelle}
        </option>
      ))}
    </select>
  </div>
))}

    <button type="button" className='addbutton' onClick={handleAddPiecesJointes}>
      <i className="fa-solid fa-plus"></i>
    </button>
    {piecesJointes.map((piece, index) => (
      <div key={index}>
        {index !== 0 && (
          <button type="button" className='removebutton' onClick={() => handleRemovePiecesJointes(index)}>
            <i className="fa-solid fa-square-minus"></i>
          </button>
        )}
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />
      </div>
    ))}
        <label>Tél</label>

    <input
      type="text"
      placeholder="Téléphone"
      value={tel}
      onChange={(e) => setTel(e.target.value)}
      required
    />
    <button type="submit">{selectedDemande ? 'Modifier Demande' : 'Ajouter Demande'}</button>
  </form>
</Modal.Body>

         
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default DemandeList;