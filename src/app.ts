import express from 'express';
import {getAllUsersPreference} from './controllers/user';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/users/preference', getAllUsersPreference);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
