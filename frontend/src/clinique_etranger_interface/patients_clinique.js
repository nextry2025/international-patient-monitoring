// src/CliniqueDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientList from './PatientList_user';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useNavigate } from 'react-router-dom';



const CliniqueDashboard = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  

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
            const email = user ? user.email : null;
            if (!email) {
              navigate('/');
              return;
            }
            const cliniqueResponse = await axios.get(`http://127.0.0.1:8080/api/cliniques/findByEmail?email=${email}`);
        
            if (cliniqueResponse.data) {
              const cliniqueId = cliniqueResponse.data.id;
              
            } else {
              setError('Aucune clinique trouvée pour cet e-mail.');
            }

        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    fetchUser();
}, []);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} user={user} />
      <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} user={user} />
    <div>
      <h1>La Liste de vos patients</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="color-legend">
        <p><span className="color-swatch" style={{ backgroundColor: '#FFA500' }}></span> ADMIS PAR LA CLINIQUE</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#4682B4' }}></span> REÇU PAR LA CLINIQUE</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#90EE90' }}></span> PRIS EN CHARGE</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#006400' }}></span> LIBÉRÉ AVEC RENDEZ-VOUS</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#ff0be3' }}></span> LIBÉRÉ SANS RENDEZ-VOUS</p>
      </div>
      <PatientList/>
    </div>
    </div>
    </div>
  );
};

export default CliniqueDashboard;


