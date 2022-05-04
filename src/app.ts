import bodyParser from 'body-parser';
import express from 'express';

import {getAllUsersPreference} from './controllers/user';

const app = express();
const port = 3000;

app.use(bodyParser.json({limit: '500mb'}));
app.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '500mb',
    extended: true,
  }),
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users/preference', getAllUsersPreference);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
