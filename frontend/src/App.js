
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/css/bootstrap.min.css';
import './styles/css/style.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login/Login';
import UserProfile from './admin_interface/profile';
import UserProfile_nationale from './clinique_nationale_interface/profile_nationale';
import UserProfile_etranger from './clinique_etranger_interface/profile_etranger';
import CliniqueList from './admin_interface/CliniqueList';
import PathologieList from './admin_interface/PathologieList';
import PatientList from './admin_interface/PatientList';
import PrestationForm from './admin_interface/PrestationForm';
import PrestationListAdmin from './admin_interface/prestationList_admin';
import RegistrationForm from './Registration/RegistrationForm';
import CliniqueDashboard from './clinique_etranger_interface/patients_clinique';
import DemandeList from './clinique_nationale_interface/DemandeList';
import DemandeList_admin_Nvalid from './admin_interface/demande_admin';
import DemandeList_Nvalid from './clinique_nationale_interface/demandes_nonValide';
import DemandesNonValidees from './clinique_etranger_interface/demandes_admissionNonValide';
import PatientList_clinique from './admin_interface/PatientList_clinique'; 
import AffecterClinique from './admin_interface/AffecterClinique';
import Statistiques from './admin_interface/statistiques';
import PrestationList_user_patient from './clinique_etranger_interface/Prestation_user_patient';
import AddPrestation from './clinique_etranger_interface/AddPrestation';
import PatientParCN from './clinique_nationale_interface/patient_par_CN';
import PatientsPrisEnCharge from './admin_interface/PatientsPrisEnCharge';
import PatientsEnAttente from './admin_interface/PatientsEnAttente';
import  PrestationList_patient from './admin_interface/prestations_admin'
 


function App() {
  return (
    <BrowserRouter>
            <Routes>

                {/* tous ce qu'il faut savoir concernant le login et la registration (debut) */}
                <Route path="/" element={<Login />} />
                <Route path='/RegistrationForm' element={<RegistrationForm />} />
                {/* tous ce qu'il faut savoir concernant le login et la registration (fin) */}


                {/* tous ce qu'il faut savoir concernant l'interface d'admin (debut) */}
                <Route path="/statistiques" element={<Statistiques />} />
                <Route path="/cliniques" element={<CliniqueList />} />
                <Route path="/patients/:cliniqueId" element={<PatientList_clinique />} />
                <Route path='/patients' element={<PatientList />} />
                <Route path='/pathologies' element={<PathologieList />} />
                <Route path='/prestations_admin' element={<PrestationListAdmin />} />
                <Route path="/edit-prestation/:id" element={<PrestationForm />} />
                <Route path='/demandes' element={<DemandeList_admin_Nvalid/>} />
                <Route path="/affecter_clinique/:patientId" element={<AffecterClinique />} />
                <Route path="/profile/:id" element={<UserProfile />} />
                {/* tous ce qu'il faut savoir concernant l'interface d'admin (fin) */}



              {/* tous ce qu'il faut savoir concernant l'interface du clinique national (debut) */}
              <Route path='/demandeList' element={<DemandeList/>} />
              <Route path='/demandeList_non_valide' element={<DemandeList_Nvalid/>} />
              <Route path='/PatientParCN' element={<PatientParCN/>} />
              <Route path="/profile_nationale/:id" element={<UserProfile_nationale />} />
              {/* tous ce qu'il faut savoir concernant l'interface du clinique national (fin) */}



              {/* tous ce qu'il faut savoir concernant l'interface du clinique etranger (debut) */}
              <Route path='/patients_clinique' element={<CliniqueDashboard />} />
              <Route path='/demandes_admission_non_valide' element={<DemandesNonValidees/>} />
              <Route path="/profile_etranger/:id" element={<UserProfile_etranger />} />
              <Route path="/prestation_de_patient_clinique/:patientId" element={<PrestationList_user_patient />} />
              <Route path="/add-prestation/:patientId" element={<AddPrestation />} />

              {/* tous ce qu'il faut savoir concernant l'interface du clinique etranger (fin) */}
              <Route path="/patients-prise-en-charge" element={<PatientsPrisEnCharge />} />
              <Route path="/patients-en-attente" element={<PatientsEnAttente />} />
              <Route path="/PrestationList_patient_admin/:patientId" element={<PrestationList_patient />} />


            </Routes>
    
    </BrowserRouter>

   
  );
}

export default App;


