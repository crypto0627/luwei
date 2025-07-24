import { Resend } from 'resend';

export class EmailService {
  private static instance: EmailService;
  private resend: Resend;

  private constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  public static getInstance(apiKey: string): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService(apiKey);
    }
    return EmailService.instance;
  }

  async sendOrderConfirmationEmail(
    to: string,
    userName: string,
    orderId: string,
    orderItems: Array<{
      meal: {
        name: string;
        price: number;
      };
      quantity: number;
    }>,
    totalAmount: number
  ) {
    try {
      const itemsHtml = orderItems
        .map(
          (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.meal.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">NT$ ${item.meal.price.toLocaleString()}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">NT$ ${(item.meal.price * item.quantity).toLocaleString()}</td>
        </tr>
      `
        )
        .join('');

      const emailHtml = `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>訂單確認 - 大竹小倆口滷味</title>
          <style>
            body {
              font-family: 'Microsoft JhengHei', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .container {
              background-color: white;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f59e0b;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #f59e0b, #d97706);
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .title {
              color: #1f2937;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              color: #6b7280;
              font-size: 16px;
              margin: 5px 0 0 0;
            }
            .order-info {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 25px;
            }
            .order-id {
              font-size: 18px;
              font-weight: bold;
              color: #92400e;
              margin-bottom: 10px;
            }
            .order-date {
              color: #6b7280;
              font-size: 14px;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              background-color: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .items-table th {
              background-color: #f59e0b;
              color: white;
              padding: 15px 12px;
              text-align: left;
              font-weight: bold;
            }
            .items-table th:last-child {
              text-align: right;
            }
            .total-row {
              background-color: #fef3c7;
              font-weight: bold;
            }
            .total-row td {
              padding: 15px 12px;
              border-top: 2px solid #f59e0b;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
            .contact-info {
              background-color: #f3f4f6;
              border-radius: 8px;
              padding: 15px;
              margin-top: 20px;
            }
            .contact-info h3 {
              color: #374151;
              margin: 0 0 10px 0;
              font-size: 16px;
            }
            .contact-info p {
              margin: 5px 0;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">滷</div>
              <h1 class="title">大竹小倆口滷味</h1>
              <p class="subtitle">訂單確認通知</p>
            </div>
            
            <p>親愛的 ${userName}，您好！</p>
            <p>感謝您的訂購！您的訂單已成功建立，以下是訂單詳細資訊：</p>
            
            <div class="order-info">
              <div class="order-id">訂單編號：${orderId}</div>
              <div class="order-date">訂單日期：${new Date().toLocaleDateString('zh-TW')}</div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>商品名稱</th>
                  <th style="text-align: center;">數量</th>
                  <th style="text-align: right;">單價</th>
                  <th style="text-align: right;">小計</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;">總計：</td>
                  <td style="text-align: right;">NT$ ${totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            
            <div class="contact-info">
              <h3>重要提醒</h3>
              <p>• 週一至週五下訂，隔週一即可取貨</p>
              <p>• 取貨時間：週一 18:00-20:00</p>
              <p>• 取貨地點：大竹小倆口滷味店面</p>
              <p>• 如有任何問題，請聯繫我們</p>
            </div>
            
            <div class="footer">
              <p>感謝您選擇大竹小倆口滷味！</p>
              <p>純手工無添加防腐劑，為您提供最優質的滷味</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await this.resend.emails.send({
        from: 'mail-service-manager@xincheng-brunch.com',
        to: [to],
        subject: `訂單確認 - 訂單編號：${orderId} | 大竹小倆口滷味`,
        html: emailHtml,
      });

      return result;
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      throw error;
    }
  }

  async sendOrderStatusUpdateEmail(
    to: string,
    userName: string,
    orderId: string,
    status: 'cancelled' | 'completed' | 'paid'
  ) {
    try {
      let subject = '';
      let title = '';
      let message = '';

      switch (status) {
        case 'cancelled':
          subject = `訂單已取消 - 訂單編號：${orderId} | 大竹小倆口滷味`;
          title = '訂單取消通知';
          message = '我們很遺憾地通知您，您的訂單已被取消。如果您認為這是個錯誤，或有任何疑問，請隨時與我們聯繫。';
          break;
        case 'completed':
          subject = `訂單已完成 - 訂單編號：${orderId} | 大竹小倆口滷味`;
          title = '訂單完成通知';
          message = '您的訂單已處理完成！感謝您的耐心等候，期待您享用美味的滷味。';
          break;
        case 'paid':
          subject = `訂單已付款 - 訂單編號：${orderId} | 大竹小倆口滷味`;
          title = '付款成功通知';
          message = '我們已收到您的款項。您的訂單狀態已更新為「已付款」，感謝您的購買！';
          break;
      }

      const emailHtml = `
        <!DOCTYPE html>
        <html lang="zh-TW">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} - 大竹小倆口滷味</title>
          <style>
            body {
              font-family: 'Microsoft JhengHei', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9fafb;
            }
            .container {
              background-color: white;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f59e0b;
            }
            .logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #f59e0b, #d97706);
              border-radius: 50%;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .title {
              color: #1f2937;
              font-size: 24px;
              font-weight: bold;
              margin: 0;
            }
            .subtitle {
              color: #6b7280;
              font-size: 16px;
              margin: 5px 0 0 0;
            }
            .order-info {
              background-color: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 25px;
            }
            .order-id {
              font-size: 18px;
              font-weight: bold;
              color: #92400e;
              margin-bottom: 10px;
            }
            .order-date {
              color: #6b7280;
              font-size: 14px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">滷</div>
              <h1 class="title">大竹小倆口滷味</h1>
              <p class="subtitle">${title}</p>
            </div>
            
            <p>親愛的 ${userName}，您好！</p>
            <p>${message}</p>
            
            <div class="order-info">
              <div class="order-id">訂單編號：${orderId}</div>
              <div class="order-date">更新日期：${new Date().toLocaleDateString('zh-TW')}</div>
            </div>
            
            <div class="footer">
              <p>感謝您選擇大竹小倆口滷味！</p>
              <p>如有任何問題，請隨時與我們聯繫。</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const result = await this.resend.emails.send({
        from: 'mail-service-manager@xincheng-brunch.com',
        to: [to],
        subject,
        html: emailHtml,
      });

      return result;
    } catch (error) {
      console.error(`Error sending order status update email for status ${status}:`, error);
      throw error;
    }
  }
} 