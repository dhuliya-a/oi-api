import { Request, Response, Router } from 'express';
import { ChatMessageModel, IChatMessage } from '../models/chatMessage.model.js';
import { EventModel, IEvent } from '../models/event.model.js';

export class ChatsController {

  private router: Router;

  constructor() {
    this.router = Router();
    this.initiateRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initiateRoutes(): void {
    this.router.get('/:eventId', this.getChatMessages);
  }

  private getChatMessages = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;

      const event: IEvent = await EventModel.findById(eventId).sort({ createdAt: 1 });;

      if (!event) {
        return res.status(404).json({ message: 'Event not found.' });
      }

      const messages : IChatMessage[] = await ChatMessageModel.find({eventId: eventId});
      res.status(200).json(messages);
    }
    catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to fetch messages.' });
    }
  };
}