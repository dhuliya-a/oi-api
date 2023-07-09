import { Request, Response, Router } from 'express';
import { GroupModel, IGroup } from '../models/group.model.js';
import { UserModel, IUser } from '../models/user.model.js';
import { ObjectId } from 'mongodb';
import { UserDetails, UserDetailsSchema } from '../util/userDetails.interface.js';

export class GroupsController {

  private router: Router;

  constructor() {
    this.router = Router();
    this.initiateRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initiateRoutes(): void {
    this.router.post('/', this.createGroup);
    this.router.get('/:groupId', this.getGroupById);
    // end point to add a friend to a group
    // this.router.post('/:groupId/add/:userId', this.addFriendToGroup);
    this.router.post('/:groupId/add', this.addFriendsToGroup);
    // end point to remove a friend from a group (a user can choose to exit too)
    this.router.post('/:groupId/remove/:userId', this.removeFriendFromGroup);
    // end point to update the details of a group
    this.router.put('/:groupId', this.updateGroupDetails);
    // end point to delete a group
    this.router.delete('/:groupId', this.deleteGroup);
  }

  private createGroup = async (req, res) => {
    try{
      const {creator, groupName, imageUrl, members, subject} = req.body;
      //Creator should by default be a member - client should send the creator Id in members list
      const newGroup : IGroup = new GroupModel({
        creator,
        groupName,
        imageUrl,
        members,
        subject,
        createdAt: new Date()
      });
  
      const savedGroup = await newGroup.save();
      res.status(201).json(savedGroup);
    }
    catch (error){
      console.log(error);
      res.status(500).json({ message: 'Failed to create group.' });
    }
  }

  private getGroupById = async (req, res) => {
    try{
      const {groupId} = req.params; 
      const group : IGroup = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
      }
      res.status(200).json(group);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch group.' });
    }
  }

  // private addFriendToGroup = async (req, res) => {
  //   try{
  //     const {groupId, userId} = req.params; 
  //     const group : IGroup = await GroupModel.findById(groupId);
  //     if (!group) {
  //       return res.status(404).json({ message: 'Group not found.' });
  //     }
  //     const user : IUser = await UserModel.findById(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found.' });
  //     }
  //     group.members.push({"userId":user._id,"userName":user.userName, "fullName":user.fullName,"imageUrl":user.imageUrl});
  //     group.save();
  //     res.status(200).json(group);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ message: 'Failed to add friend.' });
  //   }
  // }

  private addFriendsToGroup = async (req, res) => {
    try{
      const {groupId} = req.params;
      const {members} = req.body;
      const group : IGroup = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
      }
      const users : IUser[] = await UserModel.find({_id: {$in: members}});
      if (!users) {
        return res.status(404).json({ message: 'Users not found.' });
      }
      users.forEach(user => {
        group.members.push({"userId":user._id,"userName":user.userName, "fullName":user.fullName,"imageUrl":user.imageUrl});
      });
      group.save();
      res.status(200).json(group);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to add friends.' });
    }
  }

  private removeFriendFromGroup = async (req, res) => {
    try{
      const {groupId, userId} = req.params; 
      const group : IGroup = await GroupModel.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
      }
      const memberIds: String[] = group.members.map((member: UserDetails) => member.userId.toString());
      if(memberIds.includes(userId)){
        const currentMembers = group.members as [UserDetails];
        const updatedMembers = currentMembers.filter(userDetails => !userDetails.userId.equals(userId)) as [UserDetails];
        group.members = updatedMembers;
        group.save();
        res.status(200).json({message: 'User removed from group'});  
      }
      else{
        res.status(200).json({message: 'User not in group'});  
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to remove friend.' });
    }
  }

  // Update a user
  private updateGroupDetails = async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      const {creator, groupName, imageUrl, subject} = req.body;
  
      const updatedGroup : IGroup = await GroupModel.findByIdAndUpdate(
        groupId,
        {
          creator,
          groupName,
          imageUrl,
          subject
        },
        { new: true }
      );
  
      if (!updatedGroup) {
        return res.status(404).json({ message: 'Group not found.' });
      }
  
      res.status(200).json(updatedGroup);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to update Group.' });
    }
  };
  
  // Delete a Group
  private deleteGroup = async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
  
      const deletedGroup : IGroup = await GroupModel.findByIdAndDelete(groupId);
  
      if (!deletedGroup) {
        return res.status(404).json({ message: 'Group not found.' });
      }
  
      res.status(200).json({ message: 'Group deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to delete Group.' });
    }
  };
}