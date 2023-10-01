const express = require('express');
const axios = require('axios'); // for http requests
const fs = require('fs'); //filesystem
const { createObjectCsvWriter } = require('csv-writer');//to write data to a csv file

const app = express();
const port = 3000;

app.get('/artist/search', async (req, res) => {
    try {
      const artistName = req.query.name;
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
async function searchArtist(artistName) {
  const apiKey = '4245f0db2b1ec09b02e7cbfaa064716f'; // Last.fm api key
  const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${artistName}&api_key=${apiKey}&format=json`);
  return response.data;
}
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
