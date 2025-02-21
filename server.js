const express = require('express');
const https = require('https');

const app = express();
const port = 3000; // Define your port
const apiKey = 'AIzaSyDx7snwkXETQPLkM4l0YbxgDw95I1c4oIc'; // Replace with your actual API key
const searchEngineId = '26243693d437a4aed'; // Replace with your actual search engine ID

app.get('/api/check-rank', (req, res) => {
    const query = req.query.query;
    const website = req.query.website;

    // Validate parameters
    if (!query || !website) {
        return res.status(400).json({ error: 'Both query and website parameters are required' });
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`;

    https.get(url, (apiRes) => {
        let data = '';

        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        apiRes.on('end', () => {
            try {
                const result = JSON.parse(data);
                if (result.error) {
                    return res.status(500).json({ error: 'API Error', details: result.error });
                }

                // Find the ranking position
                const items = result.items || [];
                const ranking = items.findIndex(item => item.link.includes(website)) + 1;

                res.json({
                    query,
                    website,
                    ranking: ranking > 0 ? ranking : 'Not found in top results'
                });
            } catch (e) {
                res.status(500).json({ error: 'Failed to parse API response', details: e.message });
            }
        });
    }).on('error', (err) => {
        res.status(500).json({ error: 'API Request Failed', details: err.message });
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});