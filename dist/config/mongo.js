import mongoose from 'mongoose';
const username = 'pachizar_mongodb';
const password = 'Instagram@01';
const clusterName = 'cluster0.tljbuxq.mongodb.net';
const connectionString = `mongodb+srv://${username}:${password}@${clusterName}/?retryWrites=true&w=majority`;
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    debug: true,
})
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
// Remove the duplicate event listener for 'open' here
export default db;
//# sourceMappingURL=mongo.js.map