import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import { GroupModel } from '../models/group.model.js';
import { EventModel } from '../models/event.model.js';
import { ConnectionModel, StatusEnum } from '../models/connection.model.js';
export class UsersController {
    constructor() {
        // Create a new user
        this.createUser = async (req, res) => {
            try {
                const { emailId, password, userName, imageUrl, fullName } = req.body;
                const newUser = new UserModel({
                    emailId,
                    password,
                    userName,
                    imageUrl,
                    fullName,
                    createdAt: new Date()
                });
                const savedUser = await newUser.save();
                res.status(201).json(savedUser);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to create user.' });
            }
        };
        // Get a user by ID
        this.getUserById = async (req, res) => {
            try {
                const { emailId } = req.params;
                // const validUserId = new ObjectId(emailId);
                const user = await UserModel.findOne({ emailId: emailId });
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to fetch user.' });
            }
        };
        // Update a user
        this.updateUser = async (req, res) => {
            try {
                const { userId } = req.params;
                const { emailId, password, userName, imageUrl, fullName } = req.body;
                const updatedUser = await UserModel.findByIdAndUpdate(userId, {
                    emailId,
                    password,
                    userName,
                    imageUrl,
                    fullName
                }, { new: true });
                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                res.status(200).json(updatedUser);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to update user.' });
            }
        };
        // Delete a user
        this.deleteUser = async (req, res) => {
            try {
                const { userId } = req.params;
                const deletedUser = await UserModel.findByIdAndDelete(userId);
                if (!deletedUser) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                res.status(200).json({ message: 'User deleted successfully.' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to delete user.' });
            }
        };
        this.getUserGroups = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                const groups = await GroupModel.find({ "members.userId": userId });
                res.status(200).json(groups);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to get user groups.' });
            }
        };
        //TODO - Update to get list of sent, and list of received.
        this.getUserEvents = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                const sentEvents = await EventModel.find({ "creator": userId });
                const receivedEvents = await EventModel.find({
                    "invitees.userDetails.userId": userId,
                    "invitees.status": StatusEnum.PENDING
                });
                // { "invitees.userDetails.userId": userId, "invitees.status": StatusEnum.PENDING });
                const eventLists = {
                    sentEvents: sentEvents,
                    receivedEvents: receivedEvents
                };
                res.status(200).json(eventLists);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Unable to get user events' });
            }
        };
        this.getUserConnections = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                const pendingConnectionsList = await ConnectionModel.find({
                    $or: [{ user1: userId }, { user2: userId }],
                    status: StatusEnum.PENDING
                });
                // Extract the friend IDs from the connections
                const pendingIds = pendingConnectionsList.map((connection) => connection.user1.equals(userId) ? connection.user2 : connection.user1);
                // Fetch the friend objects from the UserModel
                //TODO - While creating the friend list, it should have details such as name, user name, image, id, etc.
                const pendingConnections = await UserModel.find({ _id: { $in: pendingIds } });
                // Fetch all connections where the given user is involved
                const acceptedConnectionsList = await ConnectionModel.find({
                    $or: [{ user1: userId }, { user2: userId }],
                    status: StatusEnum.ACCEPTED
                });
                // Extract the friend IDs from the connections
                const acceptedIds = acceptedConnectionsList.map((connection) => connection.user1.equals(userId) ? connection.user2 : connection.user1);
                // Fetch the friend objects from the UserModel
                //TODO - While creating the friend list, it should have details such as name, user name, image, id, etc.
                const acceptedConnections = await UserModel.find({ _id: { $in: acceptedIds } });
                const connectionLists = {
                    pendingConnectionsList: pendingConnections,
                    acceptedConnectionsList: acceptedConnections
                };
                res.status(200).json(connectionLists);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to get user connections.' });
            }
        };
        this.router = Router();
        this.initializeRoutes();
    }
    // Get the router instance
    getRouter() {
        return this.router;
    }
    initializeRoutes() {
        this.router.get('/:emailId', this.getUserById);
        this.router.post('/', this.createUser);
        this.router.put('/:userId', this.updateUser);
        this.router.delete('/:userId', this.deleteUser);
        this.router.get('/:userId/groups', this.getUserGroups);
        //List of events a user is a part of [IEvent]
        this.router.get('/:userId/events', this.getUserEvents);
        //Create an end point to get all the friends, [IUser] of a user
        this.router.get('/:userId/connections', this.getUserConnections);
        //Show unread events for a userId
        // this.router.get('/:userId/unread', this.getUserUnreadEvents);
    }
}
//# sourceMappingURL=users.controller.js.map