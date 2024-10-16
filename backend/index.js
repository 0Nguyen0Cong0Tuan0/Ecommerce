// The general / traditional way of importing sth in node
const express = require('express'); // type: commonJS (in package.json)
// or
// import express from 'express'; // type: module (in package.json)

const connectDB = require('./db/connectDB');

const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/product.route');
const categoryRoutes = require('./routes/category.route');
const subCategoryRoutes = require('./routes/subcategory.route');

const cookieParser = require('cookie-parser'); // to exact information (token,...) from the require.cookie 

const dotenv = require('dotenv');

const cors = require('cors');

const path = require('path');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000

// const __dirname = path.resolve();

// Enable CORS for all routes and origins
// app.use(cors());

// port 5173 is not the react application 
// credentials is true that we can send the cookies and the request -> that use to handle the authentication and accept requests from the frontend - the react application
app.use(cors({
    origin: [process.env.ADMIN_URL, process.env.CLIENT_URL],
    credentials: true,
}));

app.use(express.json()); // allows us to parse incoming requests with JSON payloads (req.body)
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); // allows us to parse incoming cookies

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategory', subCategoryRoutes);


// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, '/frontend/dist')));

//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
//     })
// }

app.listen(PORT, async () => {
    try {
        await connectDB();  // Ensure DB connection before starting server
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to connect to the database', error);
        process.exit(1); // Exit the process if DB connection fails
    }
});
