import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    pregnancies: '',
    glucose: '',
    bloodPressure: '',
    skinThickness: '',
    insulin: '',
    bmi: '',
    diabetesPedigree: '',
    age: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('https://diabetes-prediction-backend-6lls.onrender.com/predict', formData);
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // CSS styles
  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      textAlign: 'center',
      color: '#2c3e50',
      marginBottom: '30px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#34495e'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    button: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      width: '100%',
      marginTop: '10px'
    },
    result: {
      marginTop: '20px',
      padding: '15px',
      backgroundColor: prediction === 1 ? '#f8d7da' : '#d4edda',
      color: prediction === 1 ? '#721c24' : '#155724',
      borderRadius: '4px',
      textAlign: 'center',
      fontWeight: 'bold'
    },
    error: {
      color: '#dc3545',
      marginTop: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Diabetes Prediction</h1>
      
      <form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} style={styles.formGroup}>
            <label style={styles.label}>
              {key.charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').slice(1)}:
            </label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
        ))}
        
        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>
      </form>

      {error && <div style={styles.error}>{error}</div>}
      
      {prediction !== null && (
        <div style={styles.result}>
          Prediction: {prediction === 1 ? 'High Risk of Diabetes' : 'Low Risk of Diabetes'}
        </div>
      )}
    </div>
  );
}

export default App;
