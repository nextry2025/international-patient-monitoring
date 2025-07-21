import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Image from '../images/img-01.png';
import '../styles/css/main.css';
import '../styles/css/util.css';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8080/api/auth/login', { email, pwd: password });
      const token = response.data.token;
      sessionStorage.setItem("token", token);
      const response_user = await axios.get('http://127.0.0.1:8080/api/utilisateurs/info', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
      const user = response_user.data;

      if (user.role === 'Admin') {
        navigate('/statistiques');
      } else if (user.role === 'Clinique_etranger') {
        navigate('/patients_clinique');
      }else if (user.role === 'Clinique_national') {
        navigate('/demandeList');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error('Error submitting the form', error);
      setError('Email ou mot de passe incorrect');

    }
  };

  return (
    <div className="limiter">
      <div className="container-login100">
        <div className="wrap-login100">
          <div className="login100-pic js-tilt" data-tilt="">
            <img src={Image} alt="IMG" />
          </div>
          <form className="login100-form validate-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
            <div className="wrap-input100 validate-input" data-validate="Valid email is required: ex@abc.xyz">
              <input
                className="input100"
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="focus-input100" />
              <span className="symbol-input100">
                <i className="fa fa-envelope" aria-hidden="true" />
              </span>
            </div>
            <div className="wrap-input100 validate-input" data-validate="Password is required">
              <input
                className="input100"
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="focus-input100" />
              <span className="symbol-input100">
                <i className="fa fa-lock" aria-hidden="true" />
              </span>
            </div>
            <div className="container-login100-form-btn">
              <button className="login100-form-btn">Login</button>
            </div>
            <div className="text-center p-t-136">
              <a className="txt2" href="/RegistrationForm">
                Registre si vous n'avez pas un compte
                <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" />
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
