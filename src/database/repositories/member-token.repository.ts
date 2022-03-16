import { EntityRepository } from 'typeorm';
import { MemberTokens } from '../entities/members-token.entity';

import { BaseRepository } from './base.repository';

@EntityRepository(MemberTokens)
export class MembersTokenRepository extends BaseRepository<MemberTokens> {
  getTokensById(memberId: string) {
    return this.find({
      where: {
        members: memberId,
      },
    });
  }
}
