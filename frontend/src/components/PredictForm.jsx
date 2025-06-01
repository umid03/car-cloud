import React, { useState } from 'react';
import axios from 'axios';

function PredictForm() {
  const [formData, setFormData] = useState({ /* 25 ta xususiyat */ });
  const [predictedPrice, setPredictedPrice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/predict', formData)
      .then(response => setPredictedPrice(response.data.predicted_price))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>{/* Inputlar */}</form>
      {predictedPrice && <p>Predicted Price: ${predictedPrice}</p>}
    </div>
  );
}

export default PredictForm;