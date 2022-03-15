import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Member = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { member } = ctx.switchToHttp().getRequest();
    return member ?? null;
  },
);