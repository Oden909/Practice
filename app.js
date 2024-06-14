const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const keywords = JSON.parse(fs.readFileSync('data.json', 'utf8'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.post('/get-urls', (req, res) => {
    const { keyword } = req.body;
    if (keywords[keyword]) {
        res.json(keywords[keyword]);
    } else {
        res.status(404).json({ error: 'Ключевое слово не найдено' });
    }
});
app.post('/download-content', async (req, res) => {
    const { url } = req.body;
    try {
        const response = await axios.get(url);
        res.json({ content: response.data });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении контента' });
    }
});
app.listen(PORT, () => {
    console.log(`Сервер запущен по адресу http://localhost:${PORT}`);
});
