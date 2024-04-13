import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async postMessage(message: any) {
    try {
      await this.notificationsQueue.add('email', message, { delay: 10000 });
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
