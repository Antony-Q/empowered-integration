const express = require('express');
const app = express();

// Parse incoming x-www-form-urlencoded form data (required for Five9)
app.use(express.urlencoded({ extended: true }));

// (Optional) Also add this in case anything uses JSON later
app.use(express.json());

// Load environment variables
require('dotenv').config();

// Register your routes here (e.g.)
const webhookRoutes = require('./routes/webhook');
app.use('/webhook', webhookRoutes);

// Start your server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});