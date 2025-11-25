const express = require('express');
const app = express();
const PORT = 8083;
const menuApi = require('./api/menu');


// CORS(小程序用)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// API 路由
app.use('/api/menu', menuApi);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});