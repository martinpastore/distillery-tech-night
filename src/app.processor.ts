import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('notifications')
export class NotificationsProcessor {
  constructor(private mailerService: MailerService) {}

  @Process('email')
  async email(job: Job) {
    return this.mailerService.sendMail({
      to: job.data.email,
      subject: 'Test Email',
      template: 'test',
    });
  }
}
