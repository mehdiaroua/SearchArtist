const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: 'Artist Search API',
        description: 'API to search for artists and retrieve their information.',
        version: '1.0.0',
      },
    },
    apis: ['./server.js'],
    components: {
      schemas: {
        artist: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            mbid: { type: 'string' },
            url: { type: 'string' },
            image_small: { type: 'string' },
            image: { type: 'string' },
          },
        },
      },
    },
  };
  
  module.exports = swaggerOptions;
  