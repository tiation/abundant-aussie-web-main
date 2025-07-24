declare global {
  namespace Express {
    interface Request {
      user?: import('../models/User').IUser;
    }
    interface User extends import('../models/User').IUser {}
  }
}

export {};
