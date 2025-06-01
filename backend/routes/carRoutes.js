const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const fsExtra = require('fs-extra');
const axios = require('axios');
const { trainModel, predictPrice } = require('../models/car_price_model');

const router = express.Router();
const DATA_PATH = './data/CarPrice_Assignment.csv';

// CSV faylini o‘qish uchun yordamchi funksiya
const readCSV = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

// CSV faylga yozish uchun yordamchi funksiya
const writeCSV = async (data) => {
  if (!data || data.length === 0) {
    throw new Error('No data to write to CSV');
  }

  const headers = [
    'car_ID',
    'CarName',
    'fueltype',
    'carbody',
    'enginesize',
    'horsepower',
    'curbweight',
    'price'
  ];

  const csvRows = data.map(row => {
    return headers.map(header => {
      let value = row[header] || '';
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });

  const csvContent = `${headers.join(',')}\n${csvRows.join('\n')}`;
  try {
    await fsExtra.writeFile(DATA_PATH, csvContent, 'utf8');
    console.log('CSV file successfully updated Ascync updated');
  } catch (err) {
    console.error('Error writing to CSV:', err.message);
    throw err;
  }
};

// Barcha mashinalarni olish
router.get('/cars', async (req, res) => {
  try {
    const cars = await readCSV();
    res.json(cars);
  } catch (err) {
    console.error('Error reading CSV:', err.message);
    res.status(500).json({ error: 'Failed to fetch cars', details: err.message });
  }
});

// Yangi mashina qo‘shish
router.post('/cars', async (req, res) => {
  let newCar = req.body;

  // Ma'lumotlarni tekshirish (validation)
  const requiredFields = ['CarName', 'fueltype', 'carbody', 'enginesize', 'horsepower', 'curbweight'];
  const missingFields = requiredFields.filter(field => !newCar[field] || newCar[field].trim() === '');

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: `The following fields are required: ${missingFields.join(', ')}` 
    });
  }

  try {
    // Agar narx kiritilmagan bo‘lsa, avtomatik hisoblash
    if (!newCar.price) {
      try {
        const predictResponse = await axios.post('http://localhost:5000/api/predict', newCar, { timeout: 5000 });
        newCar.price = predictResponse.data.predicted_price;
      } catch (predictErr) {
        console.error('Error predicting price:', predictErr.message);
        return res.status(500).json({ error: 'Failed to predict price', details: predictErr.message });
      }
    }

    // Datasetni o‘qish
    let results;
    try {
      results = await readCSV();
    } catch (err) {
      console.error('Error reading CSV during POST:', err.message);
      return res.status(500).json({ error: 'Failed to read dataset', details: err.message });
    }

    // Yangi mashinani qo‘shish
    const newCarWithId = {
      car_ID: (results.length + 1).toString(),
      CarName: newCar.CarName ? newCar.CarName.toString() : '',
      fueltype: newCar.fueltype ? newCar.fueltype.toString() : '',
      carbody: newCar.carbody ? newCar.carbody.toString() : '',
      enginesize: newCar.enginesize ? newCar.enginesize.toString() : '',
      horsepower: newCar.horsepower ? newCar.horsepower.toString() : '',
      curbweight: newCar.curbweight ? newCar.curbweight.toString() : '',
      price: newCar.price ? newCar.price.toString() : ''
    };

    results.push(newCarWithId);

    // CSV faylga yozish
    try {
      await writeCSV(results);
    } catch (err) {
      console.error('Error writing CSV during POST:', err.message);
      return res.status(500).json({ error: 'Failed to save car to dataset', details: err.message });
    }

    // Modelni qayta o‘qitish
    try {
      await trainModel();
    } catch (trainErr) {
      console.error('Error retraining model:', trainErr.message);
    }

    res.status(201).json({ message: 'Car added successfully', newCar: newCarWithId });
  } catch (err) {
    console.error('Error adding car:', err.message);
    res.status(500).json({ error: 'Failed to add car', details: err.message });
  }
});

// Narxni bashorat qilish
router.post('/predict', (req, res) => {
  const carData = req.body;

  // Ma'lumotlarni tekshirish
  const requiredFields = ['fueltype', 'carbody', 'enginesize', 'horsepower', 'curbweight'];
  const missingFields = requiredFields.filter(field => !carData[field] || carData[field].trim() === '');

  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: `The following fields are required for prediction: ${missingFields.join(', ')}` 
    });
  }

  try {
    const predictedPrice = predictPrice(carData);
    res.json({ predicted_price: predictedPrice });
  } catch (err) {
    console.error('Error predicting price:', err.message);
    res.status(500).json({ error: 'Failed to predict price', details: err.message });
  }
});

module.exports = router;