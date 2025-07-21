import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { Modal, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const PatientsEnAttente = () => {
    const [patientsEnAttente, setPatientsEnAttente] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [nni, setNNI] = useState('');
    const [cni, setCni] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [passport, setPassport] = useState('');
    const [tel, setTel] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        fetchPatientsEnAttente();
    }, []);

    const fetchPatientsEnAttente = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/demandes_admission/en-attente');
            setPatientsEnAttente(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des patients en attente:', error);
            setPatientsEnAttente([]);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
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
            fetchPatientsEnAttente();
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
            text: "Voulez-vous vraiment supprimer ce patient ?",
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
                    setPatientsEnAttente(patientsEnAttente.filter(patient => patient.id !== id));
                    Swal.fire('Supprimé !', 'Le patient a été supprimé.', 'success');
                } catch (error) {
                    console.error('Error deleting patient:', error);
                    Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression du patient.', 'error');
                }
            }
        });
    };

    const filteredPatients = patientsEnAttente.filter(patient =>
        patient.nni && typeof patient.nni === 'string' && patient.nni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.cni && typeof patient.cni === 'string' && patient.cni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.nom && typeof patient.nom === 'string' && patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.prenom && typeof patient.prenom === 'string' && patient.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="d-flex">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="container">
                    <h1>Patients en Attente d'Admission</h1>

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="color-legend">
                    <p><span className="color-swatch" style={{ backgroundColor: '#ffff06' }}></span> EN ATTENTE ADMISSION</p>
                    </div>

                  

                    <table>
                        <thead>
                            <tr>
                                <th>NNI</th>
                                <th>CNI</th>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Passport</th>
                                <th>Téléphone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="7">Aucun patient en attente d'admission pour le moment, veuillez réessayer plus tard.</td>
                                </tr>
                            ) : (
                                filteredPatients.map(patient => (
                                    <tr key={patient.id} className={patient.statut}>
                                        <td>{patient.nni}</td>
                                        <td>{patient.cni}</td>
                                        <td>{patient.nom}</td>
                                        <td>{patient.prenom}</td>
                                        <td>{patient.passport}</td>
                                        <td>{patient.tel}</td>
                                        <td>
                                            <button onClick={() => handleEdit(patient)}><i className="fa-regular fa-pen-to-square"></i></button>
                                            <button onClick={() => deletePatient(patient.id)}><i className="fa-solid fa-trash"></i></button>
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

export default PatientsEnAttente;
