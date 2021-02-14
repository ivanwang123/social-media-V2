import { Request, Response } from "express";

export interface ContextType {
  req: Request & {
    session: {
      userId?: any;
    };
  };
  res: Response & {
    session: {
      userId?: any;
    };
  };
}
