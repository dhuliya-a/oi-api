import express, {Request, Response} from 'express';
import { UsersController } from './controllers/users.controller.js';
import { ConnectionsController } from './controllers/connections.controller.js';
import { GroupsController } from './controllers/groups.controller.js';
import { EventsController } from './controllers/events.controller.js';
import http from 'http';
// import db from './config/mongo.js';
import mongoose from 'mongoose';

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

const username = 'pachizar_mongodb';
const password = 'Instagram@01';
const encodedUserName = encodeURIComponent(username);
const encodedPassword = encodeURIComponent(password);
const clusterName = 'cluster0.tljbuxq.mongodb.net';
const connectionString = `mongodb+srv://${username}:${encodedPassword}@${clusterName}/?retryWrites=true&w=majority`;

const usersController = new UsersController();
const connectionsController = new ConnectionsController();
const groupsController = new GroupsController();
const eventsController = new EventsController();

app.use(express.json());

app.use('/users', usersController.getRouter());
app.use('/connections', connectionsController.getRouter());
app.use('/groups', groupsController.getRouter());
app.use('/events', eventsController.getRouter());

app.listen(port, () => {
  console.log(process.env.PORT);
  console.log(`Server running at http://localhost:${port}`);
});

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as mongoose.ConnectOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
// Remove the duplicate event listener for 'open' here

export default server;