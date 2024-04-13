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

  async notify(message: any) {
    try {
      await this.notificationsQueue.add('email', message, { delay: 10000 });

      const uid = randomUUID();

      const event = {
        ...message,
        date: new Date().getTime(),
        name: 'NotificationSent',
        uid,
      };

      await admin.firestore().collection('events').doc(uid).set(event);

      return event;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException(err);
    }
  }
}
