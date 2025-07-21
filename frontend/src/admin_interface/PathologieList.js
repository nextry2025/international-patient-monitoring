import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const PathologieList = () => {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
  const [pathologies, setPathologies] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate(); 
  const [user, setUser] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pathologiesPerPage = 5;

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
            fetchPathologies();
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    fetchUser();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pathologie = { type };

    try {
      if (editId) {
        await axios.post(`http://localhost:8080/api/patho/updatePathologie/${editId}`, pathologie);
        Swal.fire('Succès', 'La pathologie a été mise à jour.', 'success');
      } else {
        await axios.post('http://localhost:8080/api/patho/addPathologie', pathologie);
        Swal.fire('Succès', 'La pathologie a été ajoutée.', 'success');
      }
      setShowModal(false);
      fetchPathologies();
    } catch (error) {
      console.error('Error saving pathologie:', error);
      Swal.fire('Erreur', 'Une erreur est survenue lors de l\'enregistrement de la pathologie.', 'error');
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

  const fetchPathologieById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/patho/getPathologieById/${id}`);
      const pathologie = response.data;
      setType(pathologie.type);
      setEditId(id);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching pathologie:', error);
    }
  };

  const deletePathologie = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Voulez-vous vraiment supprimer cette pathologie ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/patho/deletePathologie/${id}`);
          if (pathologies) {
            setPathologies(pathologies.filter(pathologie => pathologie.id !== id));
          } else {
            console.warn("Pathologies est null ou undefined");
          }
          
          Swal.fire('Supprimé !', 'La pathologie a été supprimée.', 'success');
        } catch (error) {
          console.error('Error deleting pathologie:', error);
          Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression de la pathologie.', 'error');
        }
      }
    });
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleShow = () => {
    setEditId(null);
    setType('');
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPathologies = (pathologies || []).filter(pathologie => 
    pathologie.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const indexOfLastPathologie = currentPage * pathologiesPerPage;
  const indexOfFirstPathologie = indexOfLastPathologie - pathologiesPerPage;
  const currentPathologies = filteredPathologies.slice(indexOfFirstPathologie, indexOfLastPathologie);

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} />
        <h1>Liste des Pathologies</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher ..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <table>
          <thead>
            <tr>
              <button className="button" onClick={handleShow}><i className="fa-regular fa-plus"></i></button>
              <td colSpan={3}>
                <div className="pagination-container">
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    className="page-dropdown"
                  >
                    {Array.from({ length: Math.ceil(filteredPathologies.length / pathologiesPerPage) }, (_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </td>
            </tr>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPathologies.length > 0 ? (
              currentPathologies.map(pathologie => (
                <tr key={pathologie.id}>
                  <td>{pathologie.id}</td>
                  <td>{pathologie.type}</td>
                  <td>
                    <button onClick={() => fetchPathologieById(pathologie.id)}><i className="fa-regular fa-pen-to-square"></i></button>
                    <button onClick={() => deletePathologie(pathologie.id)}><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">Aucune pathologie trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Mettre à jour la pathologie' : 'Ajouter une pathologie'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
            <button type="submit">{editId ? 'Mettre à jour la pathologie' : 'Ajouter une pathologie'}</button>
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

export default PathologieList;
