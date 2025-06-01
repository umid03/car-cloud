import React, { useState } from 'react';
import axios from 'axios';

function CarForm({ onAdd }) {
  const [formData, setFormData] = useState({
    symboling: '', CarName: '', fueltype: '', aspiration: '', doornumber: '', carbody: '',
    drivewheel: '', enginelocation: '', wheelbase: '', carlength: '', carwidth: '', carheight: '',
    curbweight: '', enginetype: '', cylindernumber: '', enginesize: '', fuelsystem: '',
    boreratio: '', stroke: '', compressionratio: '', horsepower: '', peakrpm: '',
    citympg: '', highwaympg: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://51.20.108.48:5000/api/cars', formData)
      .then(() => {
        onAdd();
        setFormData({ ...formData }); // Formani tozalash
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="symboling" value={formData.symboling} onChange={handleChange} placeholder="Symboling" />
      <input name="CarName" value={formData.CarName} onChange={handleChange} placeholder="Car Name" />
      <input name="fueltype" value={formData.fueltype} onChange={handleChange} placeholder="Fuel Type" />
      {/* Boshqa 23 ta input qo‘shiladi */}
      <button type="submit">Add Car</button>
    </form>
  );
}

export default CarForm;