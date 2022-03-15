import { EntityRepository, FindOneOptions } from 'typeorm';

import { BaseRepository } from './base.repository';
import { Members } from '../entities/members.entity';

@EntityRepository(Members)
export class MembersRepository extends BaseRepository<Members> {
  findByEmail(username: string, options?: FindOneOptions<Members>) {
    return this.findOne(
      {
        username,
      },
      options,
    );
  }
}
