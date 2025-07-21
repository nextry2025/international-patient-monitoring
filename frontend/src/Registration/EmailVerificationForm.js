import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmailVerificationForm = ({ nom, email, password, onClose }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleVerification = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/utilisateurs', {
        nom,
        email,
        pwd: password,
      }, {
        params: {
          verificationCode: code
        }
      });
      setMessage(response.data);
      setIsError(false);
      navigate('/');
      onClose(); // Close the modal on success
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data);
      } else {
        setMessage('Erreur lors de la vérification du code.');
      }
      setIsError(true);
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (/^\d$/.test(value) || value === '') {
      const newVerificationCode = [...verificationCode];
      newVerificationCode[index] = value;
      setVerificationCode(newVerificationCode);

      if (e.keyCode === 8 && value === '' && index > 0) {
        inputRefs[index - 1].current.focus();
      }
      
      if (/^\d$/.test(value) && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="form-container">
        <div className="form-inner" style={styles.formInner}>
          <form onSubmit={handleVerification} className="signup">
            <div className="field" style={styles.field}>
              <p>Code de verification envoyé vers :</p>
              <h3>{email}</h3>
            </div><br />
            {message && <p style={isError ? styles.errorMessage : styles.successMessage}>{message}</p>}
            <div className="field" style={styles.codeInputContainer}>
              {verificationCode.map((value, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleChange(index, e)}
                  ref={inputRefs[index]}
                  required
                  style={styles.codeInput}
                />
              ))}
            </div>
            <div className="field btn" style={styles.submitButtonContainer}>
              <input type="submit" value="Verifier" style={styles.submitButton} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  formInner: {
    textAlign: 'center',
  },
  field: {
    marginBottom: '20px',
  },
  codeInputContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  codeInput: {
    width: '40px',
    height: '40px',
    fontSize: '24px',
    textAlign: 'center',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  submitButtonContainer: {
    marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
  },
  errorMessage: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
};

export default EmailVerificationForm;
