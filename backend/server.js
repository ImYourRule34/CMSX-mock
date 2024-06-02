require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const rolesRouter = require('./routes/roles');
const classesRouter = require('./routes/classes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the CMSX API');
});

// Use the routers
app.use('/api', usersRouter);
app.use('/api', rolesRouter);
app.use('/api', classesRouter);

if (process.env.NODE_ENV !== 'test') {
  // Start the server only if not in test environment
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;  // Export the app for testing
