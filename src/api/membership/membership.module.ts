import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
// import { MembersTokenRepository } from 'src/database/repositories/member-token.repository';
import { MembersRepository } from 'src/database/repositories/member.repository';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembersRepository]),
  ],
  controllers: [MembershipController],
  providers: [MembershipService],
  exports: [MembershipService],
})
export class MembershipModule {}
