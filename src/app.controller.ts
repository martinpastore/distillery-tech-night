import { Controller, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/notify')
  notify(@Request() req) {
    return this.appService.notify(req.body);
  }
}
