const express = require('express')
const cors = require('cors')

const userRoute = require('./src/user/route')
const productRoute = require('./src/product/route')
const plannerRoute = require('./src/planner/route')
const transactionRoute = require('./src/transaction/route')
const locationRoute = require('./src/location/route')
const orderRoute = require('./src/order/route')
const connectDb = require('./connectDb')

const devOrigin = 'http://localhost:5173'
const prodOrigin = [process.env.PROD_ORIGIN_1, process.env.PROD_ORIGIN_2];

const corsOptions = {
    origin: prodOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

const app = express()
require('dotenv').config()
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/planner', plannerRoute)
app.use('/api/v1/transaction', transactionRoute)
app.use('/api/v1/location', locationRoute)
app.use('/api/v1/order', orderRoute)

app.use((err, req, res, next) => {
    console.error(process.env.NODE_ENV==="development"?err.stack:" ")
    res.status(500).json({error: err.message})
})

connectDb()

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})