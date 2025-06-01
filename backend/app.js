const express = require('express');
const cors = require('cors');
const carRoutes = require('./routes/carRoutes');

const app = express();

app.use(cors()); // React bilan aloqa uchun
app.use(express.json()); // JSON so‘rovlarni qabul qilish uchun

// Marshrutlarni ulash
app.use('/api', carRoutes);

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server ${PORT}-portda BARCHA IP manzillarda ishlayapti`);
});