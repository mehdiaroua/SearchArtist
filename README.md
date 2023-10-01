# Node.js REST API Application

This Node.js application provides a REST API for searching and saving artist information to a CSV file.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

## Installation and setup to run application

1. Clone the repository to your local machine or download Zip
2. Install project dependencies in this project i used (express, axios, fs, csv-writer)
3. Start the application type this following command : npm start

   The server will start and be accessible at http://localhost:3000.

   To test use the following endpoint :
   http://localhost:3000/artist/search?name=<artist_name>

   Replace <artist_name> with the name of the artist you want to search for.
   For example:
   http://localhost:3000/artist/search?name=Adele

   
 
 
