# Node.js REST API Application

This Node.js application provides a REST API for searching and saving artist information to a CSV file.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

## Installation and setup to run application
1. Clone the repository to your local machine or download Zip
2. Install project dependencies: npm install
3. Start the application by running the following command: npm start

## API Documentation

You can access the API documentation using Swagger UI. Open your web browser and navigate to the following URL:

http://localhost:3000/api-docs

**Using the API**

To search for an artist, use the following endpoint:

- **Endpoint:** `/artist/search`
- **Method:** GET
- **Parameters:**
  - `name` (required): The name of the artist to search for.

**Example API Request**

To search for the artist "Adele," you can use the following URL:

http://localhost:3000/artist/search?name=Adele

**Dependencies**

This project uses the following dependencies:

- Express: Web application framework for Node.js.
- Axios: HTTP client for making API requests.
- fs: Node.js File System module for file operations.
- csv-writer: Library for writing data to CSV files.

For detailed API documentation, refer to the Swagger UI provided in the API Documentation section.
