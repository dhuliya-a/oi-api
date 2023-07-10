import { Request, Response, Router } from 'express';
import { EventModel, IEvent, UserInviteStatus } from '../models/event.model.js'; 
import { UserModel, IUser } from '../models/user.model.js'; 
import { ObjectId } from 'mongodb';
import { StatusEnum } from '../models/connection.model.js';

export class EventsController {
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
    //Owner will be default be part of the invitees
    //Endpoint to save event details
    this.router.post('/', this.saveEvent);
    //To update event details
    this.router.get('/:eventId', this.getEventDetails);
    //Delete an event
    this.router.delete('/:eventId', this.deleteEvent);
    //Update event details
    this.router.put('/:eventId', this.updateEventDetails);
    //Add a user, or list of users to an event - req body will have the list of users
    this.router.post('/:eventId/add', this.addUsersToEvent);
    //TODO - add one for adding a user to an event
    // this.router.post('/:eventId/add/user', this.addUsersToEvent);
    //Remove a user from an event (user can choose to exit too)
    this.router.post('/:eventId/remove/:userId', this.removeUserFromEvent);
    //Remove a user from an event (user can choose to exit too)
    this.router.post('/:eventId/accept/:userId', this.acceptEvent);
    //Remove a user from an event (user can choose to exit too)
    this.router.post('/:eventId/reject/:userId', this.rejectEvent);  
    //Updates a user's visited status to true
    // this.router.post('/:eventId/visited/:userId', this.eventInviteVisited);  
  }

   private saveEvent = async (req: Request, res: Response) => {
    try {
      const { eventName, creator, location, eventTime, imageUrl, invitees, subject } = req.body;
      //TODO - Build invitees list, for each invitee need user details from db. From front-end
      const newEvent: IEvent = new EventModel({
        eventName,
        creator,
        createdAt: new Date(),
        location,
        eventTime,
        imageUrl,
        invitees,
        subject
      });
  
      const savedEvent = await newEvent.save();
      res.status(201).json(savedEvent);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to create event.' });
    }
  };

  private getEventDetails = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
  
      const event : IEvent = await EventModel.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch event.' });
    }
  };
  
  // Update a user
  private updateEventDetails = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const { eventName, location, eventTime, imageUrl, subject  } = req.body;
  
      const updatedEvent : IEvent = await EventModel.findByIdAndUpdate(
        eventId,
        {
          eventName, 
          location, 
          eventTime,
          imageUrl,
          subject
        },
        { new: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found.' });
      }
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to update event.' });
    }
  };
  
  private deleteEvent = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
  
      const deletedEvent : IEvent = await EventModel.findByIdAndDelete(eventId);
  
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found.' });
      }
  
      res.status(200).json({ message: 'Event deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to delete event.' });
    }
  };
 
  private addUsersToEvent = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const {invitees} = req.body;

      const event : IEvent = await EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
      invitees.forEach(user => {
        event.invitees.push(
          {
            "userDetails":{"userId":user.userId,"userName":user.userName, "imageUrl":user.imageUrl, "fullName":user.fullName },
            "status":StatusEnum.PENDING});
      });
      event.save();
      res.status(200).json(event);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to add users to event.' });
    }
  };

  private removeUserFromEvent = async (req, res) => {
    try{
      const {eventId, userId} = req.params; 
      const user : IUser = await UserModel.findById(userId);
      const event : IEvent = await EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
      if (!user) {
       return res.status(404).json({ message: 'User not found.' });
      }
      const inviteesId = event.invitees.map((invite)=>invite.userDetails.userId);
      const validUserId = new ObjectId(userId);
      if (inviteesId.some((inviteeId) => inviteeId.equals(validUserId))) {
        const currentinvitees = event.invitees as [UserInviteStatus];
        const updatedinvitees = currentinvitees.filter((userStatus) => !userStatus.userDetails.userId.equals(userId)) as [UserInviteStatus];
        event.invitees = updatedinvitees;
        event.save();
        res.status(200).json({message: 'User removed from event'});  
      }
      else{
        res.status(200).json({message: 'User not in event'});  
      }
    }
    catch(error){
      console.log(error);
      res.status(500).json({ message: 'Failed to remove user.' });
    }
  }

  private acceptEvent = async (req, res) => {
    try{
      const {eventId, userId} = req.params; 
      const user : IUser = await UserModel.findById(userId);
      const event : IEvent = await EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
      if (!user) {
       return res.status(404).json({ message: 'User not found.' });
      }
      const invitee = event.invitees.find((invitee) => invitee.userDetails.userId.equals(userId));
      if(invitee){
        invitee.status = StatusEnum.ACCEPTED;
        // Save the updated event
        await event.save();
        res.status(200).json({message: 'User accepted from event'});  
      }
      else{
        res.status(200).json({message: 'User not in event'});  
      }
    }
    catch(error){
      console.log(error);
      res.status(500).json({ message: 'Failed to remove user.' });
    }
  }

  private rejectEvent = async (req, res) => {
    try{
      const {eventId, userId} = req.params; 
      const user : IUser = await UserModel.findById(userId);
      const event : IEvent = await EventModel.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }
      if (!user) {
       return res.status(404).json({ message: 'User not found.' });
      }
      const invitee = event.invitees.find((invitee) => invitee.userDetails.userId.equals(userId));
      if(invitee){
        invitee.status = StatusEnum.REJECTED;
        // Save the updated event
        await event.save();
        res.status(200).json({message: 'User rejected event invite'});  
      }
      else{
        res.status(200).json({message: 'User not in event'});  
      }
    }
    catch(error){
      console.log(error);
      res.status(500).json({ message: 'Failed to remove user.' });
    }
  }

  // private eventInviteVisited = async (req, res) => {
  //   try{
  //     const {eventId, userId} = req.params; 
  //     const user : IUser = await UserModel.findById(userId);
  //     const event : IEvent = await EventModel.findById(eventId);
  //     if (!event) {
  //       return res.status(404).json({ message: 'Event not found.' });
  //     }
  //     if (!user) {
  //      return res.status(404).json({ message: 'User not found.' });
  //     }
  //     const invitee = event.invitees.find((invitee) => invitee.userId.equals(userId));
  //     if(invitee){
  //       invitee.visited = true;
  //       // Save the updated event
  //       await event.save();
  //       res.status(200).json({message: 'User visited event invite'});  
  //     }
  //     else{
  //       res.status(200).json({message: 'User not in event'});  
  //     }
  //   }
  //   catch(error){
  //     console.log(error);
  //     res.status(500).json({ message: 'Failed to remove user.' });
  //   }
  // }
}