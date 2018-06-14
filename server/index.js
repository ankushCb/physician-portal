const express = require('express');
const compression = require('compression');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const app = express();

const port = argv.port || process.env.PORT || 8000;

app.use(compression());
app.use(express.static(path.join(process.cwd(), 'src/client')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(path.resolve(process.cwd(), 'src/client', 'index.html')));
});

app.listen(port, (error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  // eslint-disable-next-line no-console
  console.log(`Production server started using port: ${port}`);
});
