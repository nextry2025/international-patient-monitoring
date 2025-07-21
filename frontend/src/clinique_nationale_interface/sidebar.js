import React, { useEffect,useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/css/sidebar.css'

function Sidebar({ isOpen }) {
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const location = useLocation();


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
    
    const handleLogout = () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            console.error('Token is missing');
            return;
        }
    
        axios.post('http://127.0.0.1:8080/api/utilisateurs/logout', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            sessionStorage.removeItem('token');
            navigate('/');
        })
        .catch(error => {
            console.error('Logout failed:', error.response?.data || error.message);
            console.error('Error details:', error.response?.data);
        });
        
    };

    const isActive = (path) => location.pathname === path;

    if (!user) {
        return null;
    }
    return (
        <div className={`sidebar pe-4 pb-3 ${isOpen ? '' : 'closed'}`}>
            <nav className="navbar bg-light navbar-light">
                <div className="d-flex align-items-center ms-4 mb-4">
                    <div className="position-relative">
                    <img className="rounded-circle" src={user.imageData} alt="" style={{ width: '80px', height: '80px' }} />

                        <div className="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                    </div>
                    <div className="ms-3">
                        <h6 className="mb-0">{user.nom}</h6>
                        <span>{user.role}</span>
                    </div>
                </div>
                <div className="navbar-nav w-100">

                    <Link to="/demandeList"><a href="#" className={`nav-item nav-link ${isActive('/demandeList') ? 'active' : ''}`}><i class="fa-solid fa-bed"></i>N. demande ACP</a></Link>
                    <Link to="/demandeList_non_valide"><a href="#" className={`nav-item nav-link ${isActive('/demandeList_non_valide') ? 'active' : ''}`}><i class="fa-solid fa-bed"></i>ACP encours</a></Link>
                    {/* <Link to="/PatientParCN"><a href="#" className={`nav-item nav-link ${isActive('/PatientParCN') ? 'active' : ''}`}><i class="fa-solid fa-bed"></i>patients</a></Link> */}
                    <Link to={`/profile_nationale/${user.id}`}>
                        <a href="#" className={`nav-item nav-link ${isActive(`/profile_nationale/${user.id}`) ? 'active' : ''}`}>
                            <i className="fa fa-user me-2"></i>Profile
                        </a>
                    </Link>
                    <button onClick={handleLogout}><a href="#" className="nav-item nav-link"><i className="fa fa-sign-out-alt me-2"></i>Logout</a></button>
                </div>
            </nav>
        </div>
    );
}

export default Sidebar;
