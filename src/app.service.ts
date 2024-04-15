import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Queue } from 'bull';
import { randomUUID } from 'crypto';
import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
  ) {}

  async createUser(email: string) {
    try {
      await admin.auth().createUser({
        email,
      });

      const uid = randomUUID();

      await this.notificationsQueue.add(
        'email',
        { email, uid },
        { delay: 10000 },
      );

      return { email, uid };
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
