import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {

  transporter: Transporter

  constructor() {
    const email = process.env.EMAIL_ADDRESS; // 从环境变量中获取邮箱地址
    const password = process.env.EMAIL_PASSWORD; // 从环境变量中获取邮箱密码

    this.transporter = createTransport({
      host: "smtp.qq.com",
      port: 587,
      secure: false,
      auth: {
        user: '1994648006@qq.com',
        pass: 'luiyctclsojschha'
      },
    });
  }

  async sendMail({ to, subject, html }) {
    try {
      await this.transporter.sendMail({
        from: {
          name: '聊天室',
          address: '1994648006@qq.com'
        },
        to,
        subject,
        html
      });
    } catch (error) {
      console.error('邮件发送失败:', error);
      throw new Error('邮件发送失败');
    }
  }
}
