import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';


const PatientList = () => {
  const { cliniqueId } = useParams();
  const [patients, setPatients] = useState([]);
  const [soignes, setSoignes] = useState([]);


  const sessionString = sessionStorage.getItem('user');
  const user = JSON.parse(sessionString); 

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

  useEffect(() => {
    fetchPatients();
  }, [cliniqueId]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/cliniques/${cliniqueId}/patients`);
      const soigne = await axios.get(`http://localhost:8080/getSoigneByIdClinique/${cliniqueId}`)
      setSoignes(soigne.data)
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  
  

  return (
    <div>
       <div className="d-flex">
       <Sidebar isOpen={isSidebarOpen} user={user} />
            <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                <Navbar toggleSidebar={toggleSidebar} user={user} />
      <h1>Liste des Patients de la Clinique</h1>
      <div className="color-legend">
        <p><span className="color-swatch" style={{ backgroundColor: '#FFA500' }}></span> ADMIS PAR LA CLINIQUE</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#4682B4' }}></span> REÇU PAR LA CLINIQUE</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#90EE90' }}></span> PRIS EN CHARGE</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#006400' }}></span> LIBÉRÉ AVEC RENDEZ-VOUS</p>
        <p><span className="color-swatch" style={{ backgroundColor: '#ff0be3' }}></span> LIBÉRÉ SANS RENDEZ-VOUS</p>
      </div>
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
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className={patient.statut}>
                <td>{patient.nni}</td>
                <td>{patient.nom}</td>
                <td>{patient.prenom}</td>
                <td>{patient.tel}</td>
                <td>{patient.cni}</td>
                <td>{patient.passport}</td>
                <td>{patient.statut}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun patient trouvé pour cette clinique.</p>
      )}
    </div>
    </div>
        </div>
  );
};

export default PatientList;
