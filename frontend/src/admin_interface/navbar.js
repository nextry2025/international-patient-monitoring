import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';


function Navbar({ toggleSidebar }) {
    const [username, setUsername] = useState('');
    const [user,setUser] = useState('')
    const [messages, setMessages] = useState([]);
    const [showMessages, setShowMessages] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messageIcon, setMessageIcon] = useState('fa-envelope');
    const [showModal, setShowModal] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const navigate = useNavigate()


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
                if (user && user.nom) {
                    setUsername(user.nom);
                    fetchUnreadMessagesCount(user.id);
                }
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user && user.id) {
            fetchUnreadMessagesCount(user.id);
        }
    }, [user]);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5]);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${hours}:${formattedMinutes}`;
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/messages/forUser/${userId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchUnreadMessagesCount = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/messages/nonlu/${userId}`);
            setUnreadCount(response.data);
        } catch (error) {
            console.error('Error fetching unread messages count:', error);
        }
    };


        const markAllMessagesAsRead = async (userId) => {
            try {
                await axios.post(`http://localhost:8080/api/messages/markermessagescommelu/${userId}`);
            } catch (error) {
                console.error('Error marking all messages as read:', error);
            }
        };



        
    const handleBellClick = async () => {
        if (user && user.id) {
            await fetchMessages(user.id);
            setShowMessages(!showMessages);
            await markAllMessagesAsRead(user.id);
            setUnreadCount(0);
            setMessageIcon(showMessages ? 'fa-envelope' : 'fa-envelope-open');

        }

        
        
    };
    const handleViewDemande = async (demandeId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/demandes_admission/getDemandeAdmissionById/${demandeId}`);
            setSelectedDemande(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching the demande:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDemande(null);
    };

    return (
        <nav className="navbar navbar-expand bg-light navbar-light sticky-top px-4 py-0">
            <a href="#" className="navbar-brand d-flex d-lg-none me-4">
                <h2 className="text-primary mb-0"><i className="fa fa-hashtag"></i></h2>
            </a>
            <a href="#" className="sidebar-toggler flex-shrink-0" onClick={toggleSidebar}>
                <i className="fa fa-bars"></i>
            </a>

            <div className="navbar-nav align-items-center ms-auto">
                <div className="nav-item dropdown me-4">
                    <a href="#" className="nav-link position-relative" onClick={handleBellClick}>
                    <i className={`fa ${messageIcon} me-lg-2`}>
                    {unreadCount > 0 && (
                            <span className="position-absolute top-10 start-10 translate-middle badge rounded-pill bg-danger">
                                {unreadCount}
                            </span>
                        )}
                    </i>
                    <span className="d-none d-lg-inline-flex">Messages</span>
                    </a>
                    {showMessages && messages.length > 0 && (
                        <div className="dropdown-menu dropdown-menu-end bg-light border-0 rounded-0 rounded-bottom m-0 show" style={{ width: '250px', maxHeight: '300px', overflowY: 'auto' }}>
                            {messages.slice().reverse().map((message, index) => (
                                <a key={index} href="#" className="dropdown-item" style={{ backgroundColor:'#3CB371'}}>
                                    <div className="d-flex align-items-start justify-content-between">
                                        <div>
                                            <img className="rounded-circle me-2" src={message.expediteur.imageData} alt="" style={{ width: '30px', height: '30px' }} />
                                            <span className="fw-bold">{message.expediteur.nom}</span>
                                        </div>
                                        <small>
                                        {new Date(message.horodatage.split('.')[0].replace(' ', 'T')).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                        
                                    </div>
                                    <div className="text-center mt-2" style={{ whiteSpace: 'pre-wrap' }}>
                                        <h6 className="fw-bold">{message.contenu}</h6>
                                    </div>
                                    {message.expediteur.role === "Clinique_etranger" && (
                                        <button className="btn btn-link" onClick={() => handleViewDemande(message.demandesAdmission.id)}>Voir détails de la demande</button>
                                    )}
                        
                                    <hr></hr>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
                <div className="nav-item dropdown ms-4">
                    <img className="rounded-circle me-lg-2" src={user.imageData} alt="" style={{ width: '40px', height: '40px' }} />
                    <span className="d-none d-lg-inline-flex">{username}</span>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Détails de la Demande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDemande ? (
                        <div>
                            <p>patient : {selectedDemande.patient.nom}</p>
                            <p>pathologie: {selectedDemande.pathologie}</p>
                            <p>dateDebut: {selectedDemande.dateDebut}</p>
                            <p>dateFin: {selectedDemande.dateFin}</p>
                        </div>
                    ) : (
                        <div>Loading...</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fermer
                    </Button>
                </Modal.Footer>
            </Modal>
        </nav>
    );
}

export default Navbar;
