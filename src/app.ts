import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import {Request} from 'express';
import fs from 'fs';

import {
  getAllUsersPreference,
  addUser,
  addPreference,
  getUsers,
  deleteUsers,
} from './controllers/user';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
console.log(__dirname);
app.use('/public/js', express.static(__dirname + '/../views/js'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({limit: '500mb'}));
app.use(
  bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '500mb',
    extended: true,
  }),
);

const checkLocalHost = (req: Request) => {
  const req_protocol = 'https://';
  if (req.get('host') === `localhost:${port}`) {
    return req.protocol + '://' + req.get('host');
  } else {
    return req_protocol + req.get('host');
  }
};

//  Setup DB
if (!fs.existsSync('./db')) {
  fs.mkdirSync('./db');
}

app.get('/', (req, res) => {
  const domain = checkLocalHost(req);
  res.render('./index', {domain});
});

app.get('/api/users', getUsers);
app.post('/api/users/preference', getAllUsersPreference);
app.post('/api/user', addUser);
app.patch('/api/user/preference/:id', addPreference);
app.delete('/api/users', deleteUsers);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
