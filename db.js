const sql = require('mssql');

const config = {
  user: 'GustavDegn', // Brugernavnet du oprettede under konfigurationen
  password: 'Lhddsba1357911', // Dit password
  server: 'joe-main-server.database.windows.net', // Din serveradresse fra Azure
  database: 'joe-database', // Dit database-navn
  options: {
    encrypt: true, // Dette er påkrævet for Azure
  }
};

sql.connect(config).then(pool => {
  // Kør forespørgsler
  return pool.request().query('SELECT 1');
}).then(result => {
  console.log(result);
}).catch(err => {
  console.log(err);
});
