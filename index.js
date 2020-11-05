const express = require("express");
const app = express();
const dotenv = require('dotenv');

dotenv.config();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;
// const cors = require("cors");

const pool = require("./db");
//Import Routes
const authRoute = require('./routes/auth');
const ownerRoute = require('./routes/owner');
const adminRoute = require('./routes/admin');
const carerRoute = require('./routes/carer');
const summaryRoute = require('./routes/summary');
const categoryRoute = require('./routes/category');
const petRoute = require('./routes/pet');
const creditCardRoute = require('./routes/creditcard');
const bidRoute = require('./routes/bid');

//middleware
// app.use(cors());
app.use(express.json()); //req.body

//Route Middlewares
app.use('/auth', authRoute);
app.use('/owners', ownerRoute);
app.use('/admins', adminRoute);
app.use('/carers', carerRoute);
app.use('/summary', summaryRoute);
app.use('/categories', categoryRoute);
app.use('/pets', petRoute);
app.use('/credit_cards', creditCardRoute);
app.use('/bids', bidRoute);

app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});