import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetCurrentUser = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    if (request.headers.authorization) {
      const decoded = jwt.decode(
        request.headers.authorization.split(' ')[1],
      ) as IAuthToken;

      return decoded.username;
    }

    return null;
  },
);

export interface IAuthToken {
  username: string;
}
