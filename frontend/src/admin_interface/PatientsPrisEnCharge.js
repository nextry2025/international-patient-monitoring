import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Navbar from './navbar';
import Sidebar from './sidebar';

const PatientsPrisEnCharge = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [soignes, setSoignes] = useState([]);


  const clinicsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatientsPrisEnCharge();
    fetchPatients()
  }, []);

  const fetchPatients = async () => {
    try {
      const soigne = await axios.get(`http://localhost:8080/getAllSoignes`)
      setSoignes(soigne.data)
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchPatientsPrisEnCharge = async () => {
    try {
      const response = await axios.get('http://localhost:8080/patientssoigne');
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const handleCliniqueClick = async (patientId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/patient/checkClinique/${patientId}`);
      if (response.data.cliniqueId) {
        Swal.fire({
          text: `Ce patient est déjà pris en charge dans la clinique ayant l'email '${response.data.cliniqueId}'`,
        });
      } else {
        navigate(`/affecter_clinique/${patientId}`);
      }
    } catch (error) {
      console.error('Error checking clinique:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter(patient => {
    // Assurez-vous que patient.nni est toujours une chaîne de caractères avant de filtrer
    const nni = patient.nni && typeof patient.nni === 'string' ? patient.nni.toLowerCase() : '';
    const nom = patient.nom && typeof patient.nom === 'string' ? patient.nom.toLowerCase() : '';
    const prenom = patient.prenom && typeof patient.prenom === 'string' ? patient.prenom.toLowerCase() : '';
    
    const searchLower = searchTerm.toLowerCase();
    return (
      nni.includes(searchLower) ||
      nom.includes(searchLower) ||
      prenom.includes(searchLower)
    );
  });

  const indexOfLastPatient = currentPage * clinicsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - clinicsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <div className="d-flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
          <Navbar toggleSidebar={toggleSidebar} />

          <h1>Patients Pris en Charge</h1>

          <div className="button-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Rechercher ..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="color-legend">
            <p><span className="color-swatch" style={{ backgroundColor: '#FFA500' }}></span> ADMIS PAR LA CLINIQUE</p>
            <p><span className="color-swatch" style={{ backgroundColor: '#4682B4' }}></span> REÇU PAR LA CLINIQUE</p>
            <p><span className="color-swatch" style={{ backgroundColor: '#90EE90' }}></span> PRIS EN CHARGE</p>
            <p><span className="color-swatch" style={{ backgroundColor: '#006400' }}></span> LIBÉRÉ AVEC RENDEZ-VOUS</p>
            <p><span className="color-swatch" style={{ backgroundColor: '#ff0be3' }}></span> LIBÉRÉ SANS RENDEZ-VOUS</p>
          </div>

          <table>
            <thead>
              <tr>
                <td colSpan={6}>
                  <div className="pagination-container">
                    <select
                      value={currentPage}
                      onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                      className="page-dropdown"
                    >
                      {Array.from({ length: Math.ceil(filteredPatients.length / clinicsPerPage) }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                          {index + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
              <tr>
                <th>NNI</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPatients.length === 0 ? (
                <tr>
                  <td colSpan="5">Aucun patient prise en charge pour le moment, veuillez réessayer plus tard.</td>
                </tr>
              ) : (
                currentPatients.map(patient => (
                  <tr key={patient.id} className={patient.statut}>
                    <td>{patient.nni}</td>
                    <td>{patient.nom}</td>
                    <td>{patient.prenom}</td>
                    <td>{patient.tel}</td>
                    <td>{patient.statut}</td>
                    <td>
                      <button onClick={() => handleCliniqueClick(patient.id)}>Clinique</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default PatientsPrisEnCharge;
