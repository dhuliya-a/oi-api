import { Request, Response, Router } from 'express';
import { UserModel, IUser } from '../models/user.model.js'; 
import { GroupModel } from '../models/group.model.js';
import { EventModel, IEvent } from '../models/event.model.js';
import { ConnectionModel, IConnection, StatusEnum } from '../models/connection.model.js';
import {ObjectId} from 'mongodb';

export class UsersController {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

   // Get the router instance
   public getRouter(): Router {
    return this.router;
  }

  private initializeRoutes(): void {
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
  }
  
  // Create a new user
  private createUser = async (req: Request, res: Response) => {
    try {
      const { emailId, password, username, imageUrl } = req.body;
  
      const newUser: IUser = new UserModel({
        emailId,
        password,
        username,
        imageUrl,
        createdAt: new Date()
      });
  
      const savedUser = await newUser.save();
  
      res.status(201).json(savedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to create user.' });
    }
  };
    
  // Get a user by ID
  private getUserById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const validUserId = new ObjectId(userId);
      const user : IUser = await UserModel.findById(validUserId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch user.' });
    }
  };
  
  // Update a user
  private updateUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { emailId, password, username, imageUrl, unreadEvents } = req.body;
  
      const updatedUser : IUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          emailId,
          password,
          username,
          imageUrl
        },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to update user.' });
    }
  };
  
  // Delete a user
  private deleteUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
  
      const deletedUser : IUser = await UserModel.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to delete user.' });
    }
  };

  private getUserGroups = async (req, res) => {
    try{
      const {userId} = req.params; 
      const user : IUser = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const groups = await GroupModel.find({ members: userId });
      res.status(200).json(groups);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to get user groups.' });
    }
  }

  
  private getUserEvents = async (req, res) => {
    try {
     const { userId} = req.params; 
     const user : IUser = await UserModel.findById(userId);     
     if (!user) {
       return res.status(404).json({ message: 'User not found.' });
     }
     const events : IEvent[] = await EventModel.find({ "invitees.userId": userId });
     res.status(200).json(events);
    }
    catch(error){
      console.log(error);
     res.status(500).json({message: 'Unable to get user events'});
    }
   }

   
  private getUserFriends = async (req, res) => {
    try{
      const {userId} = req.params;
      const user : IUser = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

    // Fetch all connections where the given user is involved
    const connections: IConnection[] = await ConnectionModel.find({
      $or: [{ user1: userId }, { user2: userId }],
      status: StatusEnum.ACCEPTED
    });

    // Extract the friend IDs from the connections
    const friendIds: ObjectId[] = connections.map((connection: IConnection) =>
      connection.user1.equals(userId) ? connection.user2 : connection.user1
    );

    // Fetch the friend objects from the UserModel
    const friendList: IUser[] = await UserModel.find({ _id: { $in: friendIds } });

    res.status(200).json(friendList);
    }
    catch (error){
      console.log(error);
      res.status(500).json({ message: 'Failed to get user connections.' });
    }
  }

  private getUserUnreadEvents = async (req, res) => {
    try {
      const { userId} = req.params; 
      const user : IUser = await UserModel.findById(userId);     
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      const events: IEvent[] = await EventModel.find({
        invitees: {
          $elemMatch: {
            userId: userId,
            visited: { $not: { $eq: true } }
          }
        }
      });
      res.status(200).json(events);
     }
     catch(error){
       console.log(error);
      res.status(500).json({message: 'Unable to get user events'});
     }
  }
}