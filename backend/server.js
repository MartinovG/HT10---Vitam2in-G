import express from 'express';
import cors from 'cors';
import findPath from './Pathfinder.js';

const app = express();

app.use(cors());
app.use(express.json());

let totalDistance = 0;
let clients = [];

app.post('/clicked-markers', (req, res) => {
    const clickedMarkers = req.body;
    console.log('Received clickedMarkers:', clickedMarkers);
    const start = clickedMarkers[0];
    const end = clickedMarkers[1];
    const path = findPath(start.lat, start.lng, end.lat, end.lng);
    totalDistance = path.totalDistance;
    res.json({ steps: path.steps });

    clients.forEach(client =>
        client.write(`data: ${JSON.stringify({ totalDistance })}\n\n`)
    );
});

app.get('/totalDistance', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ totalDistance })}\n\n`);

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});