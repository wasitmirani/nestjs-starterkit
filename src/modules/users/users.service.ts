
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { paginate, PaginationResult } from 'src/common/pagination/pagination';

@Injectable()
export class UsersService {
  // constructor(private readonly usersRepository: UsersRepository) {
    constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number, params?: any): Promise<PaginationResult<User>> {
    // const qb = this.userRepo.createQueryBuilder('users').select(['users.id', 'users.uuid','users.name', 'users.email']);
    // if (params?.email) {
    //   qb.where('users.email = :email', { email: params.email });
    // }
    // return paginate(qb, { page, limit, baseUrl: '/users' });
    // .where('user.active = :active', { active: true })
    
    // Apply pagination
    return paginate(this.userRepo, { page, limit });

  }

}