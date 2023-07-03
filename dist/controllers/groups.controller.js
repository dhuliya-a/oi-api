import { Router } from 'express';
import { GroupModel } from '../models/group.model.js';
import { UserModel } from '../models/user.model.js';
export class GroupsController {
    constructor() {
        this.createGroup = async (req, res) => {
            try {
                const { creator, groupName, imageUrl, members } = req.body;
                //Creator should by default be a member - client should send the creator Id in members list
                const newGroup = new GroupModel({
                    creator,
                    groupName,
                    imageUrl,
                    members,
                    createdAt: new Date()
                });
                const savedGroup = await newGroup.save();
                res.status(201).json(savedGroup);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to create group.' });
            }
        };
        this.getGroupById = async (req, res) => {
            try {
                const { groupId } = req.params;
                const group = await GroupModel.findById(groupId);
                if (!group) {
                    return res.status(404).json({ message: 'Group not found.' });
                }
                res.status(200).json(group);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to fetch group.' });
            }
        };
        this.addFriendToGroup = async (req, res) => {
            try {
                const { groupId, userId } = req.params;
                const group = await GroupModel.findById(groupId);
                if (!group) {
                    return res.status(404).json({ message: 'Group not found.' });
                }
                const user = await UserModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found.' });
                }
                group.members.push(user._id);
                group.save();
                res.status(200).json(group);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to add friend.' });
            }
        };
        this.addFriendsToGroup = async (req, res) => {
            try {
                const { groupId } = req.params;
                const { members } = req.body;
                const group = await GroupModel.findById(groupId);
                if (!group) {
                    return res.status(404).json({ message: 'Group not found.' });
                }
                const users = await UserModel.find({ _id: { $in: members } });
                if (!users) {
                    return res.status(404).json({ message: 'Users not found.' });
                }
                users.forEach(user => {
                    group.members.push(user._id);
                });
                group.save();
                res.status(200).json(group);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to add friends.' });
            }
        };
        this.removeFriendFromGroup = async (req, res) => {
            try {
                const { groupId, userId } = req.params;
                const group = await GroupModel.findById(groupId);
                if (!group) {
                    return res.status(404).json({ message: 'Group not found.' });
                }
                if (group.members.includes(userId)) {
                    const currentMembers = group.members;
                    const updatedMembers = currentMembers.filter(objectId => !objectId.equals(userId));
                    group.members = updatedMembers;
                    group.save();
                    res.status(200).json({ message: 'User removed from group' });
                }
                else {
                    res.status(200).json({ message: 'User not in group' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to remove friend.' });
            }
        };
        // Update a user
        this.updateGroupDetails = async (req, res) => {
            try {
                const { groupId } = req.params;
                const { creator, groupName, imageUrl } = req.body;
                const updatedGroup = await GroupModel.findByIdAndUpdate(groupId, {
                    creator,
                    groupName,
                    imageUrl
                }, { new: true });
                if (!updatedGroup) {
                    return res.status(404).json({ message: 'Group not found.' });
                }
                res.status(200).json(updatedGroup);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to update Group.' });
            }
        };
        // Delete a Group
        this.deleteGroup = async (req, res) => {
            try {
                const { groupId } = req.params;
                const deletedGroup = await GroupModel.findByIdAndDelete(groupId);
                if (!deletedGroup) {
                    return res.status(404).json({ message: 'Group not found.' });
                }
                res.status(200).json({ message: 'Group deleted successfully.' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Failed to delete Group.' });
            }
        };
        this.router = Router();
        this.initiateRoutes();
    }
    getRouter() {
        return this.router;
    }
    initiateRoutes() {
        this.router.post('/', this.createGroup);
        this.router.get('/:groupId', this.getGroupById);
        // end point to add a friend to a group
        this.router.post('/:groupId/add/:userId', this.addFriendToGroup);
        this.router.post('/:groupId/add', this.addFriendsToGroup);
        // end point to remove a friend from a group (a user can choose to exit too)
        this.router.post('/:groupId/remove/:userId', this.removeFriendFromGroup);
        // end point to update the details of a group
        this.router.put('/:groupId', this.updateGroupDetails);
        // end point to delete a group
        this.router.delete('/:groupId', this.deleteGroup);
    }
}
//# sourceMappingURL=groups.controller.js.map