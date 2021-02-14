import { ContextType } from "../../type/ContextType";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<ContextType> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new Error("Not authenticated.");
  }

  return next();
};
