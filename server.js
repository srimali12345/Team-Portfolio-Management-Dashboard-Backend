const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

app.get('/api', (req, res) => {
    res.json({ message: 'welcome to the portfolio API' })
});

app.post('/api', (req, res) => {
    const { username, password } = req.body

    if (username === 'admin' && password === 'admin123') {
        res.json({
            accesstoken: 'fake-token-123',
            roles: ['admin'],
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }



});
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});