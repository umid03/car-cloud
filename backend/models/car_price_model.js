const fs = require('fs');
const csv = require('csv-parser');
const { SimpleLinearRegression } = require('ml-regression'); // ml-regression kutubxonasidan

const DATA_PATH = './data/CarPrice_Assignment.csv';
let model = null;

async function loadData() {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(DATA_PATH)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

async function trainModel() {
  try {
    const data = await loadData();

    // Ma'lumotlarni tayyorlash (faqat enginesize va price uchun soddalashtirilgan misol)
    const X = data.map(row => Number(row.enginesize)); // Xususiyat: enginesize
    const y = data.map(row => Number(row.price));      // Maqsad: price

    // Modelni o‘qitish
    model = new SimpleLinearRegression(X, y);
    console.log('Model muvaffaqiyatli o‘qitildi');
  } catch (err) {
    console.error('Model o‘qitishda xato:', err);
    throw err; // Xatoni yuqoriga uzatamiz
  }
}

function predictPrice(carData) {
  if (!model) throw new Error('Model hali o‘qitilmagan!');
  const input = Number(carData.enginesize || 0); // Faqat enginesize ishlatilmoqda
  return model.predict(input);
}

module.exports = { trainModel, predictPrice };

// Ilova ishga tushganda modelni birinchi marta o‘qitish
trainModel().catch(err => console.error('Dastlabki model o‘qitishda xato:', err));