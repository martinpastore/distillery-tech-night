import { Controller, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/user/create')
  createUser(@Request() req) {
    return this.appService.createUser(req.body.email);
  }
}
