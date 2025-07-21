import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';

const PatientParCN = () => {
  const [patients, setPatients] = useState([]);
  const [user, setUser] = useState('');
  const [cliniqueId, setCliniqueId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchCliniqueByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cliniques/findByEmail?email=${email}`);
      setCliniqueId(response.data.id);  // Assurez-vous de définir la propriété correcte de l'objet clinique
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
    if (cliniqueId) {
      fetchPatients();
    }
  }, [cliniqueId]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cliniques/${cliniqueId}/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} user={user} />
      <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} user={user} />
        <h1>Liste des Patients de la Clinique</h1>
        {patients.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>NNI</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Tel</th>
                <th>CNI</th>
                <th>Passport</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.nni}</td>
                  <td>{patient.nom}</td>
                  <td>{patient.prenom}</td>
                  <td>{patient.tel}</td>
                  <td>{patient.cni}</td>
                  <td>{patient.passport}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Aucun patient trouvé pour cette clinique.</p>
        )}
      </div>
    </div>
  );
};

export default PatientParCN;
