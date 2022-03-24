import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './api/auth/auth.module';
import typeormConfig from './database/config/typeorm.config';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles/roles.guard';
import { AppController } from './app.controller';
import { MembershipModule } from './api/membership/membership.module';
import { StripeModule } from './stripe/stripe.module';
import { STRIPE } from './stripe/stripe-constants';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    ConfigModule,
    AuthModule,
    MembershipModule,
    StripeModule.forRoot(STRIPE.SECRET_KEY, { apiVersion: '2020-08-27' }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
