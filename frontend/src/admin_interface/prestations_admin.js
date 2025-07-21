import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';
import Sidebar from './sidebar';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


const PrestationListPatientAdmin = () => {
  const [prestations, setPrestations] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { patientId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [user,setUser] = useState('')
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
    const fetchPrestations = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/recevoir/prestationsByPatient/${patientId}`);
        setPrestations(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération des prestations.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrestations();
  }, [patientId]);




  const deletePrestation = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Voulez-vous vraiment supprimer cette prestation?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimez-la!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/prestation/deletePrestation/${id}`);
          setPrestations((prevPrestations) => prevPrestations.filter(prestation => prestation.id !== id));
          Swal.fire(
            'Supprimée!',
            'La prestation a été supprimée.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting prestation:', error);
          Swal.fire(
            'Erreur!',
            'Une erreur est survenue lors de la suppression de la prestation.',
            'error'
          );
        }
      }
    });
  };



  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPrestations = prestations.filter((prestation) =>
    String(prestation.nom).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(prestation.date).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="d-flex">
    <Sidebar isOpen={isSidebarOpen} user={user} />
  <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
    <Navbar toggleSidebar={toggleSidebar} user={user} />
 
  <div>
    <h2>Prestations du Patient</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <table>
      <thead>
        <tr>
          <th>Libellé</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {prestations.map((prestation) => (
          <tr key={prestation.id}>
            <td>{prestation.libelle}</td>
            <td>
            <Link to={`/edit-prestation/${prestation.id}`}><i className="fa-regular fa-pen-to-square"></i></Link>
            <button onClick={() => deletePrestation(prestation.id)}><i className="fa-solid fa-trash"></i></button>
          </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
</div>


  );
};

export default PrestationListPatientAdmin;
