import { Controller, Get,Query  } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    if(limit > 100) {
      return  ex
    }
    return this.userService.getUsers(Number(page), Number(limit));
  }
   @Get('data')
  getStaticUsersList() {
    // Temporary static users list for quick testing
    return [
      { id: 1, email: 'alice@example.com', name: 'Alice2' },
      { id: 2, email: 'bob@example.com', name: 'Bob' },
      { id: 3, email: 'carol@example.com', name: 'Carol' },
    ];
  }
}