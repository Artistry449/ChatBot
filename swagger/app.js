const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

const file = fs.readFileSync('./swagger.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

const PORT = process.env.PORT || 5000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});