import { Router } from 'express';
import { UserModel } from '../models/user.model.js';
import { GroupModel } from '../models/group.model.js';
import { EventModel } from '../models/event.model.js';
import { ConnectionModel, StatusEnum } from '../models/connection.model.js';
import { ObjectId } from 'mongodb';
export class UsersController {
    constructor() {
        // Create a new user
        this.createUser = async (req, res) => {
            try {
                const { emailId, password, username, imageUrl } = req.body;
                const newUser = new UserModel({
                    emailId,
                    password,
                    username,
                    imageUrl,
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
                const { userId } = req.params;
                const validUserId = new ObjectId(userId);
                const user = await UserModel.findById(validUserId);
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
                const { emailId, password, username, imageUrl, unreadEvents } = req.body;
                const updatedUser = await UserModel.findByIdAndUpdate(userId, {
                    emailId,
                    password,
                    username,
                    imageUrl
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
                const groups = await GroupModel.find({ members: userId });
                res.status(200).json(groups);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to get user groups.' });
            }
        };
        this.getUserEvents = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                const events = await EventModel.find({ "invitees.userId": userId });
                res.status(200).json(events);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Unable to get user events' });
            }
        };
        this.getUserFriends = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                // Fetch all connections where the given user is involved
                const connections = await ConnectionModel.find({
                    $or: [{ user1: userId }, { user2: userId }],
                    status: StatusEnum.ACCEPTED
                });
                // Extract the friend IDs from the connections
                const friendIds = connections.map((connection) => connection.user1.equals(userId) ? connection.user2 : connection.user1);
                // Fetch the friend objects from the UserModel
                const friendList = await UserModel.find({ _id: { $in: friendIds } });
                res.status(200).json(friendList);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to get user connections.' });
            }
        };
        this.getUserUnreadEvents = async (req, res) => {
            try {
                // res.status(200).json(events);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Unable to get unread events for user' });
            }
        };
        this.getUserPendingEventInvites = async (req, res) => {
            try {
                const { userId } = req.params;
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Unable to get pending event invites for user' });
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
        this.router.get('/:userId', this.getUserById);
        this.router.post('/', this.createUser);
        this.router.put('/:userId', this.updateUser);
        this.router.delete('/:userId', this.deleteUser);
        this.router.get('/:userId/groups', this.getUserGroups);
        //List of events a user is a part of [IEvent]
        this.router.get('/:userId/events', this.getUserEvents);
        //Create an end point to get all the friends, [IUser] of a user
        this.router.get('/:userId/friends', this.getUserFriends);
        //Show unread events for a userId
        this.router.get('/:userId/unread', this.getUserUnreadEvents);
        //Show unread events for a userId
        // this.router.get('/:userId/invites', this.getUserPendingEventInvites);
    }
}
//# sourceMappingURL=users.controller.js.map