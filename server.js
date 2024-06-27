const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { swaggerUi, specs } = require("./swagger");
const taskRouter = require('./routes/task.routes');
const authRouter = require('./routes/auth.routes');
const userRouter = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const connectDB = () => mongoose.connect(process.env.MONGODB_URI);

app.get('/', (req, res) => {
  res.send("Welcome to TaskFlow, a task manager API.");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', taskRouter);
app.use('/api', authRouter);
app.use('/api', userRouter);

connectDB()
.then(() => {
    console.log("connected to database");
    app.listen(PORT, () => {
        console.log(`server running in http://localhost:${PORT}`);
    });
})
  .catch((err) => console.log(err));