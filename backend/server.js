import express from 'express';
import cors from 'cors';
import findPath from './Pathfinder.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/clicked-markers', (req, res) => {
    const clickedMarkers = req.body;
    console.log('Received clickedMarkers:', clickedMarkers);
    const start = clickedMarkers[0];
    const end = clickedMarkers[1];
    const path = findPath(start.lat, start.lng, end.lat, end.lng);
    console.log(path.steps);
    res.json({ steps: path.steps });
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
