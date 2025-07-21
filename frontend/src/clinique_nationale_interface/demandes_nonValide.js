import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './navbar';
import Sidebar from './sidebar';

const DemandeList_Nvalid = () => {
    const [demandes, setDemandes] = useState([]);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState('');
    const [cliniqueId, setCliniqueId] = useState('');
    const navigate = useNavigate();
    const [actes, setActes] = useState([]);

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
                fetchCliniqueByEmail(user.email)
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/demande/nonValidees/national');
                setDemandes(response.data);
            } catch (error) {
                console.error('Error fetching the demandes:', error);
            }
        };

        const fetchActes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/actes_demandes/demande/1/actes`);
                setActes(response.data);
            } catch (error) {
                console.error('Error fetching the actes:', error);
            }
        };

        fetchDemandes();
        fetchActes();
    }, []);

    const fetchActesByDemande = async (demandeId) => {
        try {
            
            const response = await axios.get(`http://localhost:8080/api/actes_demandes/demande/${demandeId}/actes`);
            setActes(response.data);
        } catch (error) {
            console.error('Error fetching the actes:', error);
        }
    };

    const envoyerMessage = async (senderId, receiverId, demandeId, content) => {
        try {
            await axios.post('http://localhost:8080/api/messages/send', null, {
                params: {
                    senderId,
                    receiverId,
                    demandeId,
                    content
                }
            });
            console.log(`Message sent from ${senderId} to ${receiverId} regarding demande ${demandeId}: ${content}`);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const validerDemande = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/demande/${id}/valide_national`);
            setDemandes(demandes.filter(demande => demande.id !== id));
            const tous_les_users = await axios.get(`http://localhost:8080/api/utilisateurs`);
            const admins = tous_les_users.data.filter(utilisateur => utilisateur.role === 'Admin');
            admins.forEach(async admin => {
                await envoyerMessage(user.id, admin.id, id, `La clinique dont l'email est ${user.email} vous a envoyé une demande.`);
            });
        } catch (error) {
            console.error('Error validation du demande:', error);
        }
    };

    const voirDemande = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/demande/getDemandeById/${id}`);
            setSelectedDemande(response.data);
            const actesResponse = await axios.get(`http://localhost:8080/api/actes_demandes/demande/${id}/actes`);
            await fetchActesByDemande(id);
            setActes(actesResponse.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error voir la demande:', error);
        }
    };

    const closePopup = () => {
        setShowModal(false);
        setSelectedDemande(null);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="d-flex">
            <Sidebar isOpen={isSidebarOpen} />
            <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                <Navbar toggleSidebar={toggleSidebar} />
                <div>
                    <h1>Demandes Non Validées</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom Prenom</th>
                                <th>INAM</th>
                                <th>Résumé</th>
                                <th>Tel</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {demandes.map(demande => (
                                <tr key={demande.id}>
                                    <td>{demande.nomPrenom}</td>
                                    <td>{demande.inam}</td>
                                    <td>{demande.resume}</td>
                                    <td>{demande.tel}</td>
                                    <td>
                                        <button onClick={() => validerDemande(demande.id)}>Valider</button>
                                        <button onClick={() => voirDemande(demande.id)}>
                                            <i className="fa-solid fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {selectedDemande && (
                        <Modal show={showModal} onHide={closePopup}>
                            <Modal.Header closeButton>
                                <Modal.Title>Demande</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6>Nom Prenom: {selectedDemande.nomPrenom} </h6>
                                <h6>INAM: {selectedDemande.inam}</h6>
                                <h6>Résumé: {selectedDemande.resume}</h6>
                                <h6>Téléphone: {selectedDemande.tel}</h6>
                                <h6>Pièces Jointes:</h6>
                                <ul>
                                    {selectedDemande.piecesJointes.map((piece, index) => (
                                        <li key={index}>
                                            Pièce {index + 1} : <a href={piece} target="_blank" rel="noopener noreferrer">{piece.split('/').pop()}</a>
                                        </li>
                                    ))}
                                </ul>
                                <h6>Actes de Demande:</h6>
                                <ul>
                                    {actes.map(acte => (
                                        <li key={acte.id}>{acte.actes.libelle}</li>
                                    ))}
                                </ul>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closePopup}>
                                    Fermer
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemandeList_Nvalid;
