import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const UserProfile_etranger = () => {
    const { id } = useParams();
    const [user, setUser] = useState('');
    const [newNom, setNewNom] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
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
                setUser(user)
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            setNewNom(user.nom);
        }
    }, [user]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setSelectedFile(reader.result);
            };
        }
    };



    const handleUpdate = () => {
        if (selectedFile || newNom !== user.nom) {
            if (selectedFile){
                const updatedUser = { ...user, imageData: selectedFile, nom: newNom };
                axios.put(`http://localhost:8080/api/utilisateurs/${id}`, updatedUser)
                .then(response => {
                    setUser(updatedUser);
                    Swal.fire('Mise à jour réussie !', 'Le profil a été mis à jour. Veuillez vous reconnecter pour voir les nouvelles modifications.', 'success');
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour du profil:', error);
                    Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du profil', 'error');
                });
            }
            else{
                const updatedUser = { ...user, imageData: user.imageData, nom: newNom };
                axios.put(`http://localhost:8080/api/utilisateurs/${id}`, updatedUser)
                .then(response => {
                    setUser(updatedUser);
                    Swal.fire('Mise à jour réussie !', 'Le profil a été mis à jour. Veuillez vous reconnecter pour voir les nouvelles modifications.', 'success');
                })
                .catch(error => {
                    console.error('Erreur lors de la mise à jour du profil:', error);
                    Swal.fire('Erreur', 'Une erreur est survenue lors de la mise à jour du profil', 'error');
                });
            }
            
            
        } else {
            Swal.fire('Aucune modification', 'Aucune modification détectée', 'info');
        }
    };



    return (
        <div className="table-container">
            <div className="d-flex">
                <Sidebar isOpen={isSidebarOpen} />
                <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                    <Navbar toggleSidebar={toggleSidebar} />
                    {user && (
                        <div className="vh-100" style={{ backgroundColor: '#eee' }}>
                            <div className="container py-5 h-100">
                                <div className="justify-content-center align-items-center h-100">
                                    <div md="12" xl="4" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ borderRadius: '15px', backgroundColor: '#9de2ff', padding: '10px', width: '50%' }}>
                                            <div className="text-center">
                                                <div className="mt-3 mb-4" style={{ position: 'relative' }}>
                                                {selectedFile ? (
                                                        <img
                                                            src={selectedFile}
                                                            alt="Converted"
                                                            style={{ height: '150px', width: '150px', borderRadius: '50px' }}
                                                        />
                                                    ) : (
                                                        <img
                                                            src={user.imageData}
                                                            alt="Converted"
                                                            style={{ height: '150px', width: '150px', borderRadius: '50px' }}
                                                        />
                                                    )}
                                                    
                                                    <input type="file" accept="image/*" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                                                    <label htmlFor="fileInput" style={{
                                                        position: 'absolute',
                                                        bottom: '-3px',
                                                        right: '146px',
                                                        backgroundColor: 'white',
                                                        borderRadius: '50%',
                                                        padding: '10px',
                                                        cursor: 'pointer',
                                                        color: '#007bff'
                                                    }}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </label>
                                                </div>

                                                <input
                                                    type="text"
                                                    value={newNom}
                                                    onChange={(e) => {
                                                        const trimmedValue = e.target.value.trim(); // Trim whitespace from input
                                                        if (trimmedValue !== '') {
                                                            setNewNom(trimmedValue); // Update state only if input is not empty
                                                        }
                                                    }}
                                                    
                                                />
                                                <div>
                                                    <div className="text-muted mb-4">
                                                        @{user.role} <span className="mx-2">|</span>{user.email}
                                                    </div>
                                                    <button onClick={handleUpdate}>
                                                        Modifier
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile_etranger;
