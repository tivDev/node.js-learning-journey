const express = require('express');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api/users`);
});
