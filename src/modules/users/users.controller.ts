import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users-list')
  getStaticUsers() {
    // Temporary static users list for quick testing
    return [
      { id: 1, email: 'alice@example.com', name: 'Alice' },
      { id: 2, email: 'bob@example.com', name: 'Bob' },
      { id: 3, email: 'carol@example.com', name: 'Carol' },
    ];
  }
}