import express, {Request, Response} from 'express';
import cors from 'cors';
import { UsersController } from './controllers/users.controller.js';
import { ConnectionsController } from './controllers/connections.controller.js';
import { GroupsController } from './controllers/groups.controller.js';
import { EventsController } from './controllers/events.controller.js';
import { startSocketServer } from './sockets/chatsHandler.js';

import http from 'http';

import mongoose from 'mongoose';

const app = express();
const apiRouter = express.Router();

const usersController = new UsersController();
const connectionsController = new ConnectionsController();
const groupsController = new GroupsController();
const eventsController = new EventsController();

// Add middleware for JSON parsing and CORS
apiRouter.use(express.json());
apiRouter.use(cors());

// Mount the routers with the '/api' prefix
apiRouter.use('/users', usersController.getRouter());
apiRouter.use('/connections', connectionsController.getRouter());
apiRouter.use('/groups', groupsController.getRouter());
apiRouter.use('/events', eventsController.getRouter());

// Mount the apiRouter with the '/api' prefix
app.use('/api', apiRouter);

// REST API routes
app.get('/', (req, res) => {
  res.send('Server is up!');
});

const server = http.createServer(app);

// Create a Socket.IO server
startSocketServer(server);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(process.env.PORT);
  console.log(`Server running at http://localhost:${port}`);
});

const username = process.env.DB_USERNAME || 'pachizar_mongodb';
const password = process.env.DB_PASSWORD || 'Instagram@01';
const encodedPassword = encodeURIComponent(password);
const clusterName = process.env.DB_CLUSTER || 'cluster0.tljbuxq.mongodb.net';
const connectionString = `mongodb+srv://${username}:${encodedPassword}@${clusterName}/?retryWrites=true&w=majority`;

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

export { server };