const express = require("express");

// create application/x-www-form-urlencoded parser
const timesheetRouter = require('./routes/timesheetRoutes');

const app = express();
// console.log(req.body)
app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads
app.use('/api/v1/ultrenostimesheets', timesheetRouter);

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => console.log("server running"));
