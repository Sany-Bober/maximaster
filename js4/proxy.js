process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3002;

const API_URL = 'http://exercise.develop.maximaster.ru/service/products/';
const AUTH = 'Basic ' + Buffer.from('cli:12344321').toString('base64');
const CPU_AUTH = 'Basic ' + Buffer.from('cli:12344321').toString('base64');

app.get('/products', async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': AUTH
            }
        });
        const data = await response.json();
        res.set('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(500).json({ error: 'Ошибка прокси-сервера', details: error.message });
    }
});

app.get('/cpu', async (req, res) => {
    try {
        const response = await fetch('https://exercise.develop.maximaster.ru/service/cpu/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Authorization': CPU_AUTH
            }
        });
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            res.set('Access-Control-Allow-Origin', '*');
            res.json(data);
        } catch (e) {
            res.set('Access-Control-Allow-Origin', '*');
            res.status(500).json({ error: 'Ошибка прокси-сервера', details: 'Ответ не JSON', raw: text });
        }
    } catch (error) {
        res.set('Access-Control-Allow-Origin', '*');
        res.status(500).json({ error: 'Ошибка прокси-сервера', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Прокси-сервер запущен: http://localhost:${PORT}`);
});
