import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import fs from 'fs';
import path from 'path';

// Translation function to get keys from JSON files
function getTranslation(language: string, key: string): string {
  try {
    const filePath = path.join(process.cwd(), 'public', 'locales', language, 'common.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(fileContent);

    // Navigate through nested keys
    const keys = key.split('.');
    let value = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  } catch (error) {
    console.error(`Translation error for ${language}.${key}:`, error);
    return key;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { orderData, language } = await req.json();

    if (!orderData || !orderData.customer_email) {
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    const validLanguages = ['en', 'fr', 'nl'] as const;
    type Language = typeof validLanguages[number];
    const lang: Language = validLanguages.includes(language as Language) ? (language as Language) : 'en';

    const adminEmail = 'infos.east.west@gmail.com'; // Admin email to receive notifications

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.error('SMTP configuration is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Format the order date and time
    const orderDate = new Date(orderData.delivery_date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang === 'nl' ? 'nl-NL' : 'en-US');
    const orderTime = orderData.delivery_time;

    // Determine delivery type text
    const deliveryTypeText = orderData.delivery_type === 'pickup'
      ? getTranslation(lang, 'checkout.pickup.title')
      : getTranslation(lang, 'checkout.delivery.title');

    // Determine payment method text
    const paymentMethodText = orderData.payment_method === 'cash'
      ? getTranslation(lang, 'checkout.payment.cash')
      : getTranslation(lang, 'checkout.payment.online');

    // Build items list HTML
    let itemsHtml = '';
    if (orderData.items && orderData.items.length > 0) {
      itemsHtml = orderData.items.map((item: any) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.product_name}</strong>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            €${item.unit_price.toFixed(2)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <strong>€${item.total_price.toFixed(2)}</strong>
          </td>
        </tr>
      `).join('');
    }

    // Build delivery address HTML if applicable
    let deliveryAddressHtml = '';
    if (orderData.delivery_type === 'delivery' && orderData.delivery_address) {
      deliveryAddressHtml = `
        <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
          <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">
            ${getTranslation(lang, 'payment.success.deliveryAddress')}
          </h3>
          <p style="margin: 0; color: #6b7280; line-height: 1.6;">
            ${orderData.delivery_address.street}<br/>
            ${orderData.delivery_address.postal_code} ${orderData.delivery_address.city}<br/>
            ${orderData.delivery_address.country}
          </p>
        </div>
      `;
    }

    // Customer Email HTML
    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${getTranslation(lang, 'payment.success.orderConfirmed')}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #A8D5BA 0%, #8BC5A8 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                🎉 ${getTranslation(lang, 'payment.success.orderConfirmed')}
              </h1>
              <p style="margin: 10px 0 0 0; color: white; font-size: 16px;">
                ${getTranslation(lang, 'payment.success.subtitle')}
              </p>
            </div>

            <!-- Content -->
            <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Order Details -->
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; border-bottom: 2px solid #A8D5BA; padding-bottom: 10px;">
                  ${getTranslation(lang, 'payment.success.orderConfirmed')}
                </h2>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">${getTranslation(lang, 'payment.success.orderId')}:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right; font-family: monospace;">${orderData.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">${getTranslation(lang, 'payment.success.deliveryType')}:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${deliveryTypeText}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">${getTranslation(lang, 'checkout.paymentMethod')}:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${paymentMethodText}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">${getTranslation(lang, 'payment.success.deliveryDate')}:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">${getTranslation(lang, 'payment.success.deliveryTime')}:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${orderTime}</td>
                  </tr>
                </table>

                ${deliveryAddressHtml}
              </div>

              <!-- Order Items -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">
                  ${getTranslation(lang, 'payment.success.orderItems')}
                </h3>

                <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Item</th>
                      <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">${getTranslation(lang, 'payment.success.quantity')}</th>
                      <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Price</th>
                      <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #f9fafb;">
                      <td colspan="3" style="padding: 15px; text-align: right; font-weight: 600; color: #111827; border-top: 2px solid #e5e7eb;">
                        ${getTranslation(lang, 'payment.success.total')}:
                      </td>
                      <td style="padding: 15px; text-align: right; font-weight: bold; color: #A8D5BA; font-size: 18px; border-top: 2px solid #e5e7eb;">
                        €${orderData.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #A8D5BA;">
                <h3 style="margin: 0 0 10px 0; color: #065f46; font-size: 16px;">
                  ${getTranslation(lang, 'payment.success.nextSteps')}
                </h3>
                <p style="margin: 0; color: #065f46; line-height: 1.6;">
                  ${orderData.delivery_type === 'pickup'
                    ? getTranslation(lang, 'payment.success.pickupDescription')
                    : getTranslation(lang, 'payment.success.deliveryDescription')}
                </p>
              </div>

              <!-- Footer -->
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0 0 10px 0;">
                  ${getTranslation(lang, 'footer.tagline')}
                </p>
                <p style="margin: 0;">
                  <strong>East@West Restaurant</strong><br/>
                  ${getTranslation(lang, 'footer.address')}<br/>
                  ${getTranslation(lang, 'footer.phone')}
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Admin Email HTML (in English for consistency)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Order Received</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">
                🔔 New Order Received
              </h1>
              <p style="margin: 10px 0 0 0; color: white; font-size: 16px;">
                Order #${orderData.id.slice(0, 8)}
              </p>
            </div>

            <!-- Content -->
            <div style="background-color: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Customer Details -->
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">
                  Customer Information
                </h2>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Name:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${orderData.customer_name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Email:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${orderData.customer_email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Phone:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${orderData.customer_phone}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Delivery Type:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right; text-transform: capitalize;">${orderData.delivery_type}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Payment Method:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right; text-transform: capitalize;">
                      ${orderData.payment_method === 'cash' ? '💵 Cash on Pickup' : '💳 Online Payment'}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Date:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${orderDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Time:</td>
                    <td style="padding: 8px 0; color: #111827; text-align: right;">${orderTime}</td>
                  </tr>
                </table>

                ${orderData.delivery_type === 'delivery' && orderData.delivery_address ? `
                <div style="margin-top: 15px; padding: 15px; background-color: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">
                  <h3 style="margin: 0 0 10px 0; color: #991b1b; font-size: 16px;">Delivery Address</h3>
                  <p style="margin: 0; color: #7f1d1d; line-height: 1.6;">
                    ${orderData.delivery_address.street}<br/>
                    ${orderData.delivery_address.postal_code} ${orderData.delivery_address.city}<br/>
                    ${orderData.delivery_address.country}
                  </p>
                </div>
                ` : ''}

                ${orderData.additional_notes ? `
                <div style="margin-top: 15px; padding: 15px; background-color: #fffbeb; border-radius: 8px; border-left: 4px solid #f59e0b;">
                  <h3 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px;">Special Notes</h3>
                  <p style="margin: 0; color: #78350f; line-height: 1.6;">${orderData.additional_notes}</p>
                </div>
                ` : ''}
              </div>

              <!-- Order Items -->
              <div style="margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #111827; font-size: 18px;">
                  Order Items
                </h3>

                <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                  <thead>
                    <tr style="background-color: #f9fafb;">
                      <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Item</th>
                      <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Qty</th>
                      <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Price</th>
                      <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                  <tfoot>
                    <tr style="background-color: #f9fafb;">
                      <td colspan="3" style="padding: 15px; text-align: right; font-weight: 600; color: #111827; border-top: 2px solid #e5e7eb;">
                        Total:
                      </td>
                      <td style="padding: 15px; text-align: right; font-weight: bold; color: #ef4444; font-size: 18px; border-top: 2px solid #e5e7eb;">
                        €${orderData.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to customer
    const customerEmailResult = await sendEmail({
      // Uses default from address defined in email.ts
      to: orderData.customer_email,
      subject: `${getTranslation(lang, 'payment.success.orderConfirmed')} - Order #${orderData.id.slice(0, 8)}`,
      text: 'Order Confirmation',
      html: customerEmailHtml,
    });

    // Send email to admin
    const adminEmailResult = await sendEmail({
      // Uses default from address defined in email.ts
      to: adminEmail,
      subject: `New Order #${orderData.id.slice(0, 8)} - ${orderData.delivery_type.toUpperCase()} - ${orderData.payment_method.toUpperCase()}`,
      text: 'New Order',
      html: adminEmailHtml,
    });

    console.log('Order emails sent:', {
      customer: customerEmailResult,
      admin: adminEmailResult
    });

    return NextResponse.json({
      success: true,
      message: 'Order confirmation emails sent',
      data: {
        customerEmailSent: true,
        adminEmailSent: true
      }
    });

  } catch (error: any) {
    console.error('Order email error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send order confirmation email',
        details: error.message
      },
      { status: 500 }
    );
  }
}
