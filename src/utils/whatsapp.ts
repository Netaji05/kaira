import { CartItem, CustomerDetails, Product } from '../types';

export const WHATSAPP_NUMBER = '917058859619'; // 7058859619 with India country code

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppOrderLink(
  items: CartItem[],
  customer: CustomerDetails,
  totalAmount: number,
  discountAmount: number = 0,
  couponCode: string = ''
): string {
  const itemListText = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.product.name}* (x${item.quantity}) - ${formatPrice(item.product.price * item.quantity)}`
    )
    .join('\n');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 999 ? 'FREE 🎉' : formatPrice(60);

  let message = `✨ *NEW ORDER REQUEST - KAIRA JEWELLERY* ✨\n`;
  message += `🌐 _kairajewelry.in_\n\n`;
  message += `🛍️ *ITEMS ORDERED:*\n${itemListText}\n\n`;
  message += `💰 *ORDER SUMMARY:*\n`;
  message += `Subtotal: ${formatPrice(subtotal)}\n`;
  if (discountAmount > 0) {
    message += `Discount: -${formatPrice(discountAmount)} ${couponCode ? `(${couponCode})` : ''}\n`;
  }
  message += `Shipping: ${shippingFee}\n`;
  message += `*TOTAL PAYABLE: ${formatPrice(totalAmount)}*\n\n`;

  message += `👤 *SHIPMENT ADDRESS DETAILS:*\n`;
  message += `Name: ${customer.name || 'Not provided'}\n`;
  message += `Phone: ${customer.phone || 'Not provided'}\n`;
  if (customer.email) message += `Email: ${customer.email}\n`;
  message += `Address: ${customer.address || 'Not provided'}\n`;
  if (customer.landmark) message += `Landmark: ${customer.landmark}\n`;
  message += `City/State: ${customer.city || ''}${customer.state ? `, ${customer.state}` : ''} - ${customer.pincode || ''}\n`;
  if (customer.addressType) message += `Address Type: ${customer.addressType.toUpperCase()}\n`;

  if (customer.giftNote || items.some(i => i.giftNote)) {
    const note = customer.giftNote || items.find(i => i.giftNote)?.giftNote;
    message += `\n💌 *GIFT NOTE:* "${note}"\n`;
  }

  message += `\nPlease share UPI QR code / Bank details for payment confirmation. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateQuickWhatsAppProductLink(product: Product, giftNote?: string): string {
  let message = `Hi KAIRA Jewellery! ✨\nI would like to order: *${product.name}* (${formatPrice(product.price)})\n\n`;
  message += `Claim: 18k Gold Plated | Anti-Tarnish | Waterproof\n`;
  if (giftNote) {
    message += `Gift Note: "${giftNote}"\n`;
  }
  message += `Please confirm availability and sharing UPI details. Thanks!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppWishlistShareLink(products: Product[]): string {
  const productList = products
    .map((p, idx) => `${idx + 1}. *${p.name}* - ${formatPrice(p.price)}`)
    .join('\n');

  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const productIds = products.map((p) => p.id).join(',');
  const baseUrl = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'https://kairajewelry.in';
  const shareUrl = `${baseUrl}?wishlist=${encodeURIComponent(productIds)}`;

  let message = `💖 *MY KAIRA JEWELLERY WISHLIST* 💖\n`;
  message += `Check out my favorite 18k anti-tarnish gold pieces from KAIRA:\n\n`;
  message += `${productList}\n\n`;
  message += `✨ *Total Wishlist Value: ${formatPrice(totalPrice)}*\n\n`;
  message += `🔗 View my saved items:\n${shareUrl}\n\n`;
  message += `_KAIRA Jewellery - Premium 18k Gold Plated, Waterproof & Anti-Tarnish_`;

  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

