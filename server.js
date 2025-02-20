const express = require('express');
const https = require('https');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your actual API key and Search Engine ID
const apiKey = 'AIzaSyDx7snwkXETQPLkM4l0YbxgDw95I1c4oIc'; // Make sure to replace this with your actual API key
const searchEngineId = '26243693d437a4aed'; // Make sure to replace this with your actual Search Engine ID

app.get('/api/check-rank', (req, res) => {
    const query = req.query.query;

    // Validate the query parameter
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${searchEngineId}`;

    https.get(url, (apiRes) => {
        let data = '';

        // Collect data chunks
        apiRes.on('data', (chunk) => {
            data += chunk;
        });

        // On end of response, parse and send the data
        apiRes.on('end', () => {
            try {
                const jsonResponse = JSON.parse(data);
                res.json(jsonResponse);
            } catch (error) {
                res.status(500).json({ error: 'Failed to parse response' });
            }
        });
    }).on('error', (err) => {
        res.status(500).json({ error: err.message });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});