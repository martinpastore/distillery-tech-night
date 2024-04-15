import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as admin from 'firebase-admin';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('email')
  async email(job: Job) {
    try {
      const result = await admin
        .firestore()
        .collection('events')
        .doc(job.data.uid)
        .get();

      if (result.exists) return;

      const event = {
        email: job.data.email,
        date: new Date().getTime(),
        name: 'NotificationSent',
        uid: job.data.uid,
      };

      await admin.firestore().collection('events').doc(job.data.uid).set(event);

      return this.mailerService.sendMail({
        to: job.data.email,
        subject: 'Test Email',
        template: 'test',
      });
    } catch (err) {
      Logger.error(err);
    }
  }
}
