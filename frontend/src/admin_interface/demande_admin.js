import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './demande_admin.css';
import Navbar from './navbar';
import Sidebar from './sidebar';
import entete_demande from './entete_demande.png';
import QRCode from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Swal from 'sweetalert2';

const DemandeList_Nvalid = () => {
    const [demandes, setDemandes] = useState([]);
    const [demandesValidees, setDemandesValidees] = useState([]);
    const [selectedDemande, setSelectedDemande] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState('');
    const [checkedState, setCheckedState] = useState({});
    const [commentaire, setCommentaire] = useState('');
    const [actes, setActes] = useState([]);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [actionType, setActionType] = useState('');
    const [confirmationText, setConfirmationText] = useState('');
    const [acteDemande, setActeDemande] = useState([]);
    const [acte, setActe] = useState([]);
    const [actesAcceptes, setActesAcceptes] = useState([]);
    const [actesDemandes, setActesDemandes] = useState([]);
    const [decision, setDecision] = useState('');

    const navigate = useNavigate();


    const ajouter_actes_acceptes = (acteId) => {
        const updatedCheckedState = {
            ...checkedState,
            [acteId]: !checkedState[acteId]
        };
        setCheckedState(updatedCheckedState);

        if (!checkedState[acteId]) {
            setActesAcceptes([...actesAcceptes, actes.find(acte => acte.id === acteId).actes.libelle]);
        } else {
            setActesAcceptes(actesAcceptes.filter(libelle => libelle !== actes.find(acte => acte.id === acteId).actes.libelle));
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

    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/demande/validees/national');
                setDemandes(response.data);
                const response_valide_admin = await axios.get('http://localhost:8080/api/demande/validees/admin');
                setDemandesValidees(response_valide_admin.data)
            } catch (error) {
                console.error('Error fetching the demandes:', error);
            }
        };

        fetchDemandes();
    }, []);

    const fetchActesByDemande = async (demandeId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/actes_demandes/demande/${demandeId}/actes`);
            const actes = response.data;
    
            const actesAcceptes = actes.filter(acte => acte.statut === 'ACCEPTE');
            const actesDemandes = actes.filter(acte => acte.statut !== 'ACCEPTE');
    
            setActesAcceptes(actesAcceptes);
            setActesDemandes(actesDemandes);
        } catch (error) {
            console.error('Error fetching the actes:', error);
        }
    };
    

    const voirDemande = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/demande/getDemandeById/${id}`);
            setSelectedDemande(response.data);
            await fetchActesByDemande(id);
            setShowModal(true);
        } catch (error) {
            console.error('Error viewing the demande:', error);
        }
    };

    const closePopup = () => {
        setShowModal(false);
        setSelectedDemande(null);
    };

    const handleCheckboxChange = (acteId) => {
        const updatedCheckedState = {
            ...checkedState,
            [acteId]: !checkedState[acteId]
        };
        setCheckedState(updatedCheckedState);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleEnvoyerMessageRefuse = async () => {
        try {
            const cliniqueResponse = await axios.get(`http://localhost:8080/api/cliniques/${selectedDemande.id}/getCliniqueByDemandeId`);
            const utilisateurResponse = await axios.get(`http://localhost:8080/api/utilisateurs/email/${cliniqueResponse.data.email}`);
            await envoyerMessage(user.id, utilisateurResponse.data.id, selectedDemande.id, `Votre demande dont l'id est ${selectedDemande.id} a été refusée`);
            closePopup();
        } catch (error) {
            console.error('Error sending refuse message:', error);
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
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const validerDemande = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/demande/${id}/valide_admin`,{commentaire:commentaire});
            setDemandes(demandes.filter(demande => demande.id !== id));
            const cliniqueResponse = await axios.get(`http://localhost:8080/api/cliniques/${id}/getCliniqueByDemandeId`);
            const utilisateurResponse = await axios.get(`http://localhost:8080/api/utilisateurs/email/${cliniqueResponse.data.email}`);
            const actesAcceptesLibelles = acteDemande.map(acteId => {
                const s = acte.find(a => a.id == acteId);
                return s ? s.libelle : '';
            }).filter(libelle => libelle !== '');
            const actesDemandesData = acteDemande.map(acte => ({
                demande: { id: selectedDemande.id },
                actes: { id: acte },
                statut : "ACCEPTE"
            }));
            await axios.post(`http://localhost:8080/api/actes_demandes`, actesDemandesData);
            await envoyerMessage(user.id, utilisateurResponse.data.id, id, `CNAM a validé votre demande et a accepté les actes suivants: ${actesAcceptesLibelles.join(", ")}. Commentaire : ${commentaire}`);
            closePopup();
        } catch (error) {
            console.error('Error validating demande:', error);
        }
    };

    const handleEnvoyerMessageComplement = async () => {
        try {
            await axios.put(`http://localhost:8080/api/demande/${selectedDemande.id}/demande_accomplement`);
            const cliniqueResponse = await axios.get(`http://localhost:8080/api/cliniques/${selectedDemande.id}/getCliniqueByDemandeId`);
            const utilisateurResponse = await axios.get(`http://localhost:8080/api/utilisateurs/email/${cliniqueResponse.data.email}`);
            const actesAcceptesLibelles = acteDemande.map(acteId => {
                const s = acte.find(a => a.id == acteId);
                return s ? s.libelle : '';
            }).filter(libelle => libelle !== '');
            await envoyerMessage(user.id, utilisateurResponse.data.id, selectedDemande.id, `CNAM vous envoie un demande d'accomplement et a accepté les actes suivants : ${actesAcceptesLibelles.join(", ")}. , vous donne le Commentaire : "${commentaire}"`);
            closePopup();
        } catch (error) {
            console.error('Error sending complement message:', error);
        }
    };

    const handlePrint = async () => {
        const printContent = document.getElementById('printable-content');

        try {
            const canvas = await html2canvas(printContent);
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 250);
            pdf.save('demande.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };

    const handleAction = (type) => {
        setActionType(type);
        setConfirmationModal(true);
    };

    const handleConfirmAction = () => {
        if (confirmationText.toLowerCase() === 'ok') {
            switch (actionType) {
                case 'refuse':
                    handleEnvoyerMessageRefuse();
                    break;
                case 'complement':
                    handleEnvoyerMessageComplement();
                    break;
                case 'valide':
                    validerDemande(selectedDemande.id);
                    break;
                default:
                    break;
            }
            setConfirmationText('');
            setConfirmationModal(false);
        } else {
            Swal.fire(
                'Erreur',
                'Une erreur est survenue lors de la confirmation.',
                'error'
              );
            setConfirmationText('');
            setConfirmationModal(false);
            return false;
        }
    };

    const handleValidate = () => {
        switch (decision) {
            case 'refuse':
                handleAction('refuse');
                break;
            case 'complement':
                handleAction('complement');
                break;
            case 'valide':
                handleAction('valide');
                break;
            default:
                Swal.fire(
                    'Erreur',
                    'Veuillez sélectionner une décision avant de valider.',
                    'error'
                );
                break;
        }
    };

    const qrText = selectedDemande ? `
        Id : ${selectedDemande.id}
        Nom Prénom: ${selectedDemande.nomPrenom}
        INAM: ${selectedDemande.inam}
        Téléphone: ${selectedDemande.tel}
    ` : '';




    const fetchActe = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/actes');
          setActe(response.data);
        } catch (error) {
          console.error('Error fetching actes:', error);
        }
      };
      useEffect(() => {
        fetchActe();
      }, []);
      const getAvailableActe = (index) => {
        return acte.filter(acte => !acteDemande.includes(acte.id) || acteDemande[index] === acte.id);
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
        const isAlreadyValidated = demandesValidees.some(d => d.id === selectedDemande?.id);
       

    return (
        <div className="table-container">
            <div className="d-flex">
                <Sidebar isOpen={isSidebarOpen} user={user} />
                <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                    <Navbar toggleSidebar={toggleSidebar} user={user} />
                    <div>
                        <h1>Demandes</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom Prénom</th>
                                    <th>INAM</th>
                                    <th>Résumé</th>
                                    <th>Téléphone</th>
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
                                            <button onClick={() => voirDemande(demande.id)}>
                                                <i className="fa-solid fa-eye"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {selectedDemande && (
                            <Modal show={showModal} onHide={closePopup} dialogClassName="modal-dialog-custom">
                                <Modal.Header closeButton>
                                    <Modal.Title>Demande</Modal.Title>
                                </Modal.Header>
                                <Modal.Body id="printable-content">
                                    <img className='entete_demande' src={entete_demande} alt="Entete Demande"/>
                                    <p className="texte-rouge">DEMANDE D'ACCORD PRÉALABLE</p>
                                    <div className="ligne"></div>
                                    <br />
                                    <span className="t s1_1">Identité du Patient / Prestataire de soins </span>
                                    <div className="cadre">
                                        <h6>Nom Prénom: {selectedDemande.nomPrenom}</h6>
                                        <h6>INAM: {selectedDemande.inam}</h6>
                                    </div>
                                    <span>Demande du Médecin traitant / Résumé </span>
                                    <span className='spnan_tel'>Téléphone : <input type="text" size="8" value={selectedDemande.tel} readOnly /> </span>
                                    <div className="cadre">
                                        <textarea className='textarea' value={selectedDemande.resume} readOnly />
                                    </div>
                                    <span>Pièces Jointes:</span>
                                    <div className="cadre">
                                        <ul>
                                            {selectedDemande.piecesJointes.map((piece, index) => (
                                                <li key={index}>
                                                    Pièce {index + 1} : <a href={piece} target="_blank" rel="noopener noreferrer">{piece.split('/').pop()}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <span>Actes Demandés :</span>
                                    <div className="cadre">
                                        <table>
                                            <tbody>
                                                {actesDemandes.map(acte => (
                                                    <tr key={acte.id}>
                                                        <td>{acte.actes.libelle}</td>
                                                        {/* <td>
                                                            <input
                                                                type='checkbox'
                                                                checked={checkedState[acte.id]}
                                                                onChange={() => handleCheckboxChange(acte.id)}
                                                            />
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <span>Actes acceptés :</span>
                                    <div className="cadre">
                                    {isAlreadyValidated ? (
                                        <>
                                          <table>
                                            <tbody>
                                                {actesAcceptes.map(acte => (
                                                    <tr key={acte.id}>
                                                        <td>{acte.actes.libelle}</td>
                                                        {/* <td>
                                                            <input
                                                                type='checkbox'
                                                                checked={checkedState[acte.id]}
                                                                onChange={() => handleCheckboxChange(acte.id)}
                                                            />
                                                        </td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                      </>
                                    ):(
                                        <>
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
                                        {getAvailableActe(index).map((acte) => (
                                            <option key={acte.id} value={acte.id}>
                                            {acte.libelle}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    ))}  
                                        </>
                                    )}
                                    </div>
                                    <span className="t s1_1">Décision du Comité Médical de la CNAM : </span>
                                    {isAlreadyValidated ? (
                                        <>
                                    <div className="form-check form-check-inline" style={{ marginLeft: '10px' }}>
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="decision"
                                            checked 
                                        />
                                        <label className="form-check-label" htmlFor="valide">La demande est validée.                                        </label>
                                    </div>
                                        </>
                                    ) : (
                                        <>
                                        <div className="form-check form-check-inline" style={{ marginLeft: '10px' }}>
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="decision" 
                                            id="refuse" 
                                            value="refuse" 
                                            checked={decision === 'refuse'} 
                                            onChange={(e) => setDecision(e.target.value)} 
                                        />
                                        <label className="form-check-label" htmlFor="refuse">Refuser</label>
                                    </div>
                                    <div className="form-check form-check-inline" style={{ marginLeft: '10px' }}>
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="decision" 
                                            id="complement" 
                                            value="complement" 
                                            checked={decision === 'complement'} 
                                            onChange={(e) => setDecision(e.target.value)} 
                                        />
                                        <label className="form-check-label" htmlFor="complement">Demande de complément</label>
                                    </div>
                                    <div className="form-check form-check-inline" style={{ marginLeft: '10px' }}>
                                        <input 
                                            className="form-check-input" 
                                            type="radio" 
                                            name="decision" 
                                            id="valide" 
                                            value="valide" 
                                            checked={decision === 'valide'} 
                                            onChange={(e) => setDecision(e.target.value)} 
                                        />
                                        <label className="form-check-label" htmlFor="valide">Valider</label>
                                    </div>
                                        </>
                                    )}
                                    <div className="ligne_2"></div>
                                    <div className="mb-3">
                                        <label htmlFor="commentaires" className="libelle_demande">Commentaires:</label>
                                        <div className="cadre">
                                        {demandesValidees.find(d => d.id === selectedDemande?.id) ? (
                                            <textarea
                                                className="form-control"
                                                id="commentaires"
                                                value={selectedDemande.commentaire}
                                            />
                                        ) : (
                                            <textarea
                                                className="form-control"
                                                id="commentaires"
                                                value={commentaire}
                                                onChange={(e) => setCommentaire(e.target.value)}
                                            />
                                )}
                                            
                                        </div>
                                    </div>
                                    <div className="qr-code-container">
                                        <QRCode value={qrText}/>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                {demandesValidees.find(d => d.id === selectedDemande?.id) ? (
                                <Button variant="primary" onClick={handlePrint}>Imprimer</Button>
                                ) : (
                                <Button variant="success" onClick={handleValidate}>Valider</Button>
                                )}

                                </Modal.Footer>
                            </Modal>
                        )}
                    </div>
                </div>
            </div>
            <Modal show={confirmationModal} onHide={() => setConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Êtes-vous sûr de vouloir {actionType} cette demande ? Veuillez taper "ok" pour confirmer.</p>
                    <input
                        type="text"
                        className="form-control"
                        value={confirmationText}
                        onChange={(e) => setConfirmationText(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setConfirmationModal(false)}>
                        Annuler
                    </Button>
                    <Button variant="primary" onClick={handleConfirmAction}>
                        Confirmer
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DemandeList_Nvalid;