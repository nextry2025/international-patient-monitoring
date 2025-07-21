import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './css/bootstrap.min.css';
import './css/style.css';
import image from './images/undraw_remotely_2j6y.svg';
import EmailVerificationForm from './EmailVerificationForm';
import { Navigate } from 'react-router-dom';

const RegistrationForm = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleVerification = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/utilisateurs/verifyInfo', {
        nom,
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage("Erreur lors de la vérification des informations.");
      }
      setIsError(true);
      return false;
    }
  };

  const handleSendVerificationCode = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/utilisateurs/sendVerificationCode', null, {
        params: { email }
      });
      setMessage(response.data);
      setIsError(false);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage('Erreur lors de l\'envoi du code de vérification.');
      }
      setIsError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      setIsError(true);
      return;
    }

    const isVerified = await handleVerification();
    if (isVerified) {
      await handleSendVerificationCode();
      setShowModal(true);
    }
  };

  const handleClose = () => setShowModal(false);

  return (
    <div className="registre_content">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <img src={image} alt="Image" className="img-fluid" />
          </div>
          <div className="col-md-6 registre_contents">
            <div className="row justify-registre_content-center">
              <div className="col-md-8">
                <form className='form' onSubmit={handleSubmit}>
                  {message && (
                    <p className={isError ? "messageError" : "messageSuccess"}>
                      {message}
                    </p>
                  )}
                  <div className="wrap-input100 validate-input" data-validate="Password is required">
                    <span className="focus-input100" />
                    <span className="symbol-input101">
                      <i className="fa-solid fa-circle-user fa-xl"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="nom"
                      placeholder="Nom"
                      value={nom}
                      onChange={(e) => setNom(e.target.value)}
                      required
                    />
                  </div>
                  <div className="wrap-input100 validate-input" data-validate="Password is required">
                    <span className="focus-input100" />
                    <span className="symbol-input101">
                      <i className="fa fa-envelope" aria-hidden="true" />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="wrap-input100 validate-input" data-validate="Password is required">
                    <span className="focus-input100" />
                    <span className="symbol-input101">
                      <i className="fa fa-lock" aria-hidden="true" />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="wrap-input100 validate-input" data-validate="Password is required">
                    <span className="focus-input100" />
                    <span className="symbol-input101">
                      <i className="fa fa-lock" aria-hidden="true" />
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirmer le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <input
                    type="submit"
                    value="S'inscrire"
                    className="btn btn-block btn-primary"
                  />
                </form>
                <div>
                  <a className="txt1" href="/">
                    Se connecter si vous avez déjà un compte
                    <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for email verification */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Vérification de l'email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EmailVerificationForm nom={nom} email={email} password={password} onClose={handleClose} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RegistrationForm;
