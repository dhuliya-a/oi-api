import { Request, Response, Router } from 'express';
import { ConnectionModel, IConnection, StatusEnum } from '../models/connection.model.js';

export class ConnectionsController {

  private router: Router;

  constructor() {
    this.router = Router();
    this.initiateRoutes();
  }

  public getRouter() {
    return this.router;
  }

  private initiateRoutes(): void {
    this.router.get('/:connId', this.getConnectionRequestById);
    this.router.post('/', this.createConnectionRequest);
    //TODO - Create one end point to accept/deny a connectionRequest
    this.router.put('/:connId', this.updateConnectionRequestStatus);
    //Create one end point to remove a connection
    this.router.delete('/:connId', this.deleteConnectionRequest);
  }

  private getConnectionRequestById = async (req: Request, res: Response) => {
    try {
      const { connId } = req.params;

      const connectionRequest: IConnection = await ConnectionModel.findById(connId);

      if (!connectionRequest) {
        return res.status(404).json({ message: 'Connection not found.' });
      }

      res.status(200).json(connectionRequest);
    }
    catch (error) {
      res.status(500).json({ message: 'Failed to fetch connection details.' });
    }
  };

  private createConnectionRequest = async (req, res) => {
    try{
      const {user1, user2} = req.body;
      const newConnection = new ConnectionModel({
        user1,
        user2,
        createdAt: new Date()
      });
      const savedConnection = await newConnection.save();
      res.status(201).json(savedConnection);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to create new connection request.' });
    }
  }

  private updateConnectionRequestStatus = async (req, res) => {
    try{
      const {connId} = req.params;
      const {status} = req.body;
      const connectionRequest: IConnection = await ConnectionModel.findById(connId);

      if (!connectionRequest) {
        return res.status(404).json({ message: 'Connection not found.' });
      }
      connectionRequest.status = status;
      connectionRequest.save();
      res.status(200).json(connectionRequest);
    }
    catch(error){
      console.log(error);
      res.status(500).json({ message: 'Failed to update connection request.' });
    }
  }
  
  private deleteConnectionRequest = async (req,res) =>{
    try{
      const {connId} = req.params;
      const deletedConnection : IConnection = await ConnectionModel.findByIdAndDelete(connId);
  
      if (!deletedConnection) {
        return res.status(404).json({ message: 'Connection not found.' });
      }
  
      res.status(200).json({ message: 'Connection deleted successfully.' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Failed to delete connection.' });
    }  
  }
}