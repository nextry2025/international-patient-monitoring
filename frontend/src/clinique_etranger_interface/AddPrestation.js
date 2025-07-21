import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './addprestation.css';
import Navbar from './navbar';
import Sidebar from './sidebar';

const AddPrestation = () => {
  const [libelle, setLibelle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState('');

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
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    document.body.classList.add('AddPrestation');
    return () => {
      document.body.classList.remove('AddPrestation');
    };
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!libelle || !description || !selectedFile) {
        setError('Veuillez remplir tous les champs.');
        return;
      }

      const formData = new FormData();
      formData.append('files', selectedFile);

      const uploadResponse = await axios.post('http://localhost:8080/api/upload?type=Rapports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedFileUrl = uploadResponse.data.filePath;

      const prestationData = {
        libelle,
        description,
        userId: user.id,
        rapports: [
          {
            description,
            fichiersOrdonnance :[
            {
            fichier: uploadedFileUrl.toString(),
            }
          ]
          },
        ],
      };

      await axios.post(`http://localhost:8080/api/recevoir/addPrestationWithPatient?patientId=${patientId}&userId=${user.id}`, prestationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      navigate('/patients_clinique');
    } catch (error) {
      console.error('Error uploading file or adding prestation:', error);
      setError('Erreur lors de l\'ajout de la prestation.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} user={user} />
      <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} user={user} />
        <div className="container">
          <h2>Ajouter une Prestation</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Libellé du prestation:</label>
              <input
                type="text"
                value={libelle}
                onChange={(e) => setLibelle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description du rapport:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Fichier d'ordonnance:</label>
              <input type="file" onChange={handleFileChange} required />
            </div>
            <button type="submit" className='ajouter_prestation'>Ajouter Prestation et Rapport</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPrestation;
