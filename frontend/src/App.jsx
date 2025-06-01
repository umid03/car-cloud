import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './styles/App.css';

function App() {
  const [cars, setCars] = useState([]);
  const [newCar, setNewCar] = useState({
    CarName: '',
    fueltype: '',
    carbody: '',
    enginesize: '',
    horsepower: '',
    curbweight: '',
    price: ''
  });
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const carsPerPage = 10;

  // Fetch cars data
  const fetchCars = () => {
    setIsLoading(true);
    axios
      .get('http://51.20.108.48:5000/api/cars')
      .then(response => {
        setCars(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
        alert('Failed to fetch cars: ' + (error.response?.data?.error || error.message));
      });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setNewCar({ ...newCar, [e.target.name]: e.target.value });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Add new car
  const handleAddCar = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ma'lumotlarni tekshirish
    const requiredFields = ['CarName', 'fueltype', 'carbody', 'enginesize', 'horsepower', 'curbweight'];
    const missingFields = requiredFields.filter(field => !newCar[field] || newCar[field].trim() === '');

    if (missingFields.length > 0) {
      setIsLoading(false);
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    axios
      .post('http://51.20.108.48:5000/api/cars', newCar)
      .then(response => {
        fetchCars(); // Ma'lumotlarni qayta yuklash
        setNewCar({
          CarName: '',
          fueltype: '',
          carbody: '',
          enginesize: '',
          horsepower: '',
          curbweight: '',
          price: ''
        });
        setPredictedPrice(null); // Narxni bashorat qilish natijasini tozalash
        setCurrentPage(1);
        setIsLoading(false);

        setAddSuccess(true);
        setTimeout(() => setAddSuccess(false), 3000);
      })
      .catch(error => {
        console.error('Error adding car:', error);
        setIsLoading(false);
        alert('Failed to add car: ' + (error.response?.data?.error || error.message));
      });
  };

  // Predict car price
  const handlePredictPrice = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ma'lumotlarni tekshirish
    const requiredFields = ['fueltype', 'carbody', 'enginesize', 'horsepower', 'curbweight'];
    const missingFields = requiredFields.filter(field => !newCar[field] || newCar[field].trim() === '');

    if (missingFields.length > 0) {
      setIsLoading(false);
      alert(`Please fill in the following fields to predict price: ${missingFields.join(', ')}`);
      return;
    }

    axios
      .post('http://51.20.108.48:5000/api/predict', newCar)
      .then(response => {
        setPredictedPrice(response.data.predicted_price);
        setNewCar({ ...newCar, price: response.data.predicted_price.toString() });
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error predicting price:', error);
        setIsLoading(false);
        const errorMessage = error.response?.data?.error || 'An error occurred while predicting the price';
        alert(errorMessage);
      });
  };

  // Qidiruv logikasi
  const filteredCars = cars.filter(car =>
    Object.values(car).some(value =>
      value &&
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Prepare chart data
  const chartData = currentCars.map(car => ({
    name: car.CarName,
    price: Number(car.price) || 0,
    horsepower: Number(car.horsepower) || 0,
    enginesize: Number(car.enginesize) || 0
  }));

  return (
    <div className="app-container">
      <header>
        <h1>Car Price Prediction</h1>
      </header>

      {/* Form Section */}
      <section className="form-section">
        <form onSubmit={handleAddCar} className="car-form">
          <input
            name="CarName"
            value={newCar.CarName}
            onChange={handleChange}
            placeholder="Car Name"
            required
          />
          <select
            name="fueltype"
            value={newCar.fueltype}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Fuel Type</option>
            <option value="gas">Gas</option>
            <option value="diesel">Diesel</option>
          </select>
          <select
            name="carbody"
            value={newCar.carbody}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select Car Body</option>
            <option value="sedan">Sedan</option>
            <option value="hatchback">Hatchback</option>
            <option value="wagon">Wagon</option>
            <option value="convertible">Convertible</option>
            <option value="hardtop">Hardtop</option>
          </select>
          <input
            name="enginesize"
            value={newCar.enginesize}
            onChange={handleChange}
            placeholder="Engine Size"
            type="number"
            min="0"
            step="0.1"
            required
          />
          <input
            name="horsepower"
            value={newCar.horsepower}
            onChange={handleChange}
            placeholder="Horsepower"
            type="number"
            min="0"
            required
          />
          <input
            name="curbweight"
            value={newCar.curbweight}
            onChange={handleChange}
            placeholder="Curb Weight"
            type="number"
            min="0"
            required
          />
          <input
            name="price"
            value={newCar.price}
            onChange={handleChange}
            placeholder="Price ($)"
            type="number"
            min="0"
            step="0.01"
          />
          <div className="form-buttons">
            <button type="submit" className="btn-add" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Car'}
            </button>
            <button
              type="button"
              onClick={handlePredictPrice}
              className="btn-predict"
              disabled={isLoading}
            >
              {isLoading ? 'Predicting...' : 'Predict Price'}
            </button>
          </div>
        </form>

        {addSuccess && (
          <div className="success-message">
            Car added successfully!
          </div>
        )}

        {predictedPrice !== null && (
          <div className="prediction">
            Predicted Price: <span>${predictedPrice.toFixed(2)}</span>
          </div>
        )}
      </section>

      {/* Chart Section */}
      <section className="chart-section">
        <h2>Price vs Horsepower vs Engine Size</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="name"
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 33, 51, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
              }}
              labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '5px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ paddingTop: 20 }} iconType="circle" />
            <Bar dataKey="price" fill="#3498db" name="Price ($)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="horsepower" fill="#2ecc71" name="Horsepower (hp)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="enginesize" fill="#f39c12" name="Engine Size (L)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Table Section */}
      <section className="table-section">
        <h2>Car Database</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search cars (e.g., name, fuel type, body type...)"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {isLoading && <div className="loading">Loading data...</div>}

        {filteredCars.length === 0 && !isLoading && (
          <div className="no-results">No cars found matching your search.</div>
        )}

        <div className="table-container">
          <table className="car-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Car Name</th>
                <th>Fuel Type</th>
                <th>Body Type</th>
                <th>Engine Size</th>
                <th>Horsepower</th>
                <th>Curb Weight</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {currentCars.map((car, index) => (
                <tr key={car.car_ID} className={index === 0 && currentPage === 1 ? 'new-car' : ''}>
                  <td>{car.car_ID}</td>
                  <td>{car.CarName}</td>
                  <td>{car.fueltype}</td>
                  <td>{car.carbody}</td>
                  <td>{car.enginesize}</td>
                  <td>{car.horsepower}</td>
                  <td>{car.curbweight}</td>
                  <td>${car.price ? Number(car.price).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || isLoading}
            className="btn-page"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages || 1}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || isLoading || totalPages === 0}
            className="btn-page"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;