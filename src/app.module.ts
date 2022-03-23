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

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    ConfigModule,
    AuthModule,
    MembershipModule,
    StripeModule.forRoot(
      'sk_test_51JFYQESCG96xkedGA2PyBMZArAU7hgXzbus5PcrTfutmmune6oJZM5cpMw4gwS1P2qYof3oACEEYizE2kTLI2J7L00CYaS8Xzj',
      { apiVersion: '2020-08-27' },
    ),
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
