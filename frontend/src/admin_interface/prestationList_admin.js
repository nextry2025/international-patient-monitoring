import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useNavigate, Link } from 'react-router-dom';

const CliniqueDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

    const fetchPatients = async () => {
      try {
        const patientsResponse = await axios.get('http://localhost:8080/patientssoigne');
        setPatients(patientsResponse.data);
      } catch (err) {
        setError('Erreur lors de la récupération des patients.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
}, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter((patient) =>
    String(patient.nom).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(patient.prenom).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(patient.cni).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(patient.tel).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex">
      <Sidebar isOpen={isSidebarOpen} user={user} />
      <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Navbar toggleSidebar={toggleSidebar} user={user} />
        <div>
          <h1>La Liste des Prestations des patients</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {loading ? (
            <p>Chargement...</p>
          ) : (
            <div className="patient-list-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
              <table className="patient-list-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>CNI</th>
                    <th>Téléphone</th>
                    <th colSpan={2}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.nom}</td>
                      <td>{patient.prenom}</td>
                      <td>{patient.cni}</td>
                      <td>{patient.tel}</td>
                      <td>
                        <Link to={`/PrestationList_patient_admin/${patient.id}`}>
                          <button>Prestations</button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CliniqueDashboard;
