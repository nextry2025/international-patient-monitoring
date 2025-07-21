import React, { useState, useEffect } from 'react';
import WorldMap from './worldMap'; // Ensure the file name is correctly imported
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import axios from 'axios';
import './statistiques.css';

const Statistiques = () => {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [countryData, setCountryData] = useState({});
    const [pendingAdmissionsCount, setPendingAdmissionsCount] = useState(0);
    const [soigneCount, setSoigneCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = sessionStorage.getItem('token');

            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response_user = await axios.get('http://127.0.0.1:8080/api/utilisateurs/info', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const storedUser = response_user.data;

                if (storedUser) {
                    setUser(storedUser);
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                navigate('/');
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        axios.get("http://localhost:8080/patients_per_country")
            .then(response => {
                const countryDataFromApi = response.data;
                const formattedCountryData = Object.keys(countryDataFromApi).reduce((acc, countryCode) => {
                    acc[countryCode] = countryDataFromApi[countryCode];
                    return acc;
                }, {});
                setCountryData(formattedCountryData);
            })
            .catch(error => {
                console.error('Error fetching country data:', error);
            });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/api/demandes_admission/countPendingAdmissions")
            .then(response => {
                setPendingAdmissionsCount(response.data);
            })
            .catch(error => {
                console.error('Error fetching pending admissions count:', error);
            });
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/soigne/count")
            .then(response => {
                setSoigneCount(response.data);
            })
            .catch(error => {
                console.error('Error fetching soigne count:', error);
            });
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const donnees = {
        MR: countryData["MR"] || 0,
        FR: countryData["FR"] || 0,
        TN: countryData["TN"] || 0,
        MA: countryData["MA"] || 0,
        DZ: countryData["DZ"] || 0,
        ES: countryData["ES"] || 0,
        TR: countryData["TR"] || 0
    };
    
    const countryNames = {
        MR: "Mauritanie",
        FR: "France",
        TN: "Tunisie",
        MA: "Maroc",
        DZ: "Algérie",
        ES: "Espagne",
        TR: "Turquie"
    };
    
    const maximum_pays_code = Object.keys(donnees).reduce((a, b) => donnees[a] > donnees[b] ? a : b);
    const maximum_pays = countryNames[maximum_pays_code];



    return (
        <div className="table-container">
            <div className="d-flex">
                <Sidebar isOpen={isSidebarOpen} user={user} />
                <div className={`content w-100 ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
                    <Navbar toggleSidebar={toggleSidebar} user={user} />
                    
                    <div className='div_kbire'>
                        <div className="col-sm-6 col-xl-3">
                            <div className="petite_div">
                                <i className="fa fa-solid fa-user text-primary icon_div"></i>
                                <div className="ms-3">
                                    <h6>Le total des patients Prise en charge {soigneCount}.</h6>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <div className="petite_div">
                                <i className="fa-solid fa-hospital-user text-primary icon_div"></i>
                                <div className="ms-3">
                                    <h6>Le total des patients en attente d'admission est {pendingAdmissionsCount}.</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    {Object.keys(countryData).length === 0 ? (
                        <div className="loader-container">
                            <h2>Pas de données encore dans la carte </h2>
                            <div className="loader"></div>
                        </div>
                    ) : (
                        <WorldMap countryData={donnees} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Statistiques;
