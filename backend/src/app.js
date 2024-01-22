const express = require("express");

const { specs, swaggerUi } = require('../swagger/swagger');

const cors = require("cors");

require("dotenv").config({ path: '../.env' });

const apiRoutes = require('./routes/apiRoutes');

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(apiRoutes);

// Serve Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
