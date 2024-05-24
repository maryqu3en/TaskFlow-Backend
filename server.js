const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const taskRouter = require('./routes/task.route');
const authRouter = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const connectDB = () => mongoose.connect(process.env.MONGODB_URI);

app.get('/', (req, res) => {
  res.send("Hello World!");
});

app.use(taskRouter);
app.use(authRouter);

connectDB()
.then(() => {
    console.log("connected to database");
    app.listen(PORT, () => {
        console.log(`server running in http://localhost:${PORT}`);
    });
})
  .catch((err) => console.log(err));