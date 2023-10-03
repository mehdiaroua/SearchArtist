const express = require('express');
const axios = require('axios'); // Import Axios for HTTP requests
const fs = require('fs'); // Import the File System module for file operations
const { createObjectCsvWriter } = require('csv-writer'); // Import CSV writer

const app = express();
const port = 3000;

// Import Swagger dependencies for API documentation
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swagger'); // Import Swagger options

// Initialize Swagger
const specs = swaggerJsdoc(swaggerOptions); // Create Swagger specification
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)); // Serve Swagger documentation at '/api-docs'

/**
 * @swagger
 * /artist/search:
 *   get:
 *     summary: Search for artists.
 *     description: Retrieve artist information by name.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the artist to search for.
 *     responses:
 *       200:
 *         description: A list of artists matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/artist'
 */
app.get('/artist/search', async (req, res) => {
    try {
      const artistName = req.query.name; // Get the artist name from the query parameter
      
      // Check if an artist name was provided
      if (!artistName || artistName.trim() === '') {
        const randomArtists = getRandomArtists();
        writeToCSV(randomArtists, 'artists.csv');
        res.json(randomArtists);
        return;
      }
  
      const searchResult = await searchArtist(artistName);
  
      if (searchResult.results && searchResult.results.artistmatches) {
        const artists = searchResult.results.artistmatches.artist.map((artist) => {
          return {
            name: artist.name,
            mbid: artist.mbid,
            url: artist.url,
            image_small: artist.image[1]['#text'],
            image: artist.image[3]['#text'],
          };
        });
  
        if (artists.length === 0) {
          const randomArtists = getRandomArtists();
          writeToCSV(randomArtists, 'artists.csv');
          res.json(randomArtists);
        } else {
          writeToCSV(artists, 'artists.csv');
          res.json(artists);
        }
      } else {
        console.error('Invalid response structure from the artist search endpoint');
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Function to search for an artist by name
async function searchArtist(artistName) {
  const apiKey = '4245f0db2b1ec09b02e7cbfaa064716f'; // Last.fm API key
  const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName}&api_key=${apiKey}&format=json`);
  return response.data;
}

// Function to retrieve random artist names from a JSON source
function getRandomArtists() {
  try {
    const data = fs.readFileSync('randomArtists.json', 'utf8');
    const artistNames = JSON.parse(data);
    const randomIndex = Math.floor(Math.random() * artistNames.length);
    return [artistNames[randomIndex]];
  } catch (error) {
    console.error('Error reading randomArtists.json:', error);
    return ['FallbackArtistName'];
  }
}

// Function to write data to a CSV file
function writeToCSV(data, filename) {
  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      { id: 'name', title: 'Name' },
      { id: 'mbid', title: 'MBID' },
      { id: 'url', title: 'URL' },
      { id: 'image_small', title: 'Image Small' },
      { id: 'image', title: 'Image' },
    ],
    append: true,
  });

  // Create an array of CSV records
  const records = data.map((artist) => ({
    name: artist.name || artist,
    mbid: artist.mbid || '',
    url: artist.url || '',
    image_small: artist.image_small || '',
    image: artist.image || '',
  }));

  csvWriter.writeRecords(records)
    .then(() => console.log(`Data added to ${filename}`))
    .catch((error) => console.error('Error writing to CSV:', error));
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
