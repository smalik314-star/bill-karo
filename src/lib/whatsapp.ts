import { Invoice, Quotation, InvoicePayment, Client, BusinessProfile } from '../types';
import toast from 'react-hot-toast';


/**
 * Sanitizes phone numbers to include 91 country prefix if missing
 */
function sanitizePhoneNumber(phone: string = ''): string {
  const clean = phone.replace(/\D/g, '');
  if (!clean) return '';
  if (clean.length === 10) {
    return `91${clean}`;
  }
  return clean;
}

/**
 * Shares a GST-compliant tax invoice details via WhatsApp Link
 */
export function shareInvoice(
  invoice: Invoice,
  businessName: string,
  client?: Client,
  profile?: BusinessProfile
): string {
  if (!invoice) {
    toast.error('इनवॉइस डेटा अनुपलब्ध है!');
    return '';
  }

  // Fallbacks for missing optional arguments
  const clientName = client?.name || 'ग्राहक (Valued Customer)';
  const clientPhone = sanitizePhoneNumber(client?.phone || '');
  const bizName = businessName || profile?.businessName || 'BillKaro Merchant';

  // Calculate items lines safely
  const itemLinesStr = (invoice.items || []).map((it, idx) => 
    `🔹 ${idx + 1}. *${it.name}* (Qty: ${it.quantity} ${it.unit}) ${it.hsn ? `[HSN ${it.hsn}]` : ''} - ₹${((it.rate ?? 0) * (it.quantity ?? 0)).toLocaleString('en-IN')}`
  ).join('\n');

  // Compute values
  const subtotal = (invoice.items || []).reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const discount = invoice.discount || 0;
  
  // Estimate GST
  let totalGst = 0;
  if (invoice.isGstApplied) {
    totalGst = (invoice.items || []).reduce((sum, item) => {
      const itemPrice = item.rate * item.quantity;
      return sum + (itemPrice * (item.gstPercent || 0) / 100);
    }, 0);
  }
  const grandTotal = invoice.totalAmount || (subtotal + totalGst - discount);
  const outstanding = Math.max(0, grandTotal - (invoice.paidAmount || 0));

  const whatsappMessage = 
`*कर एवं पक्का बिल (Tax Invoice)* 📄
*${bizName}*

नमस्ते, *${clientName}*! 👋
आपके पक्के बिल का विवरण नीचे दिया गया है:

📋 *इनवॉइस संख्या:* ${invoice.invoiceNumber}
📅 *दिनांक (Date):* ${invoice.date || ''}
⌛ *अंतिम भुगतान तिथि:* ${invoice.dueDate || ''}

-----------------------------------
*सामग्री / कार्य विवरण (Items):*
${itemLinesStr || 'कोई आइटम नहीं'}

*वित्तीय विवरणी (Financial Summary):*
🔸 उप-योग (Subtotal): ₹${(subtotal ?? 0).toLocaleString('en-IN')}
${invoice.isGstApplied ? `🔸 जीएसटी टैक्स (GST): ₹${(totalGst ?? 0).toLocaleString('en-IN')}` : ''}
🔸 छूट (Discount): ₹${(discount ?? 0).toLocaleString('en-IN')}
🌟 *कुल देय राशि (Grand Total): ₹${(grandTotal ?? 0).toLocaleString('en-IN')}*

💸 *कुल प्राप्त जमा (Paid amount):* ₹${(invoice.paidAmount ?? 0).toLocaleString('en-IN')}
⚠️ *बकाया शेष मूल्य (Due Balance):* *₹{(outstanding ?? 0).toLocaleString('en-IN')}*

-----------------------------------
${profile?.bankName ? `🏦 *बैंक विवरण भुगतान के लिए (Bank Ledger):*
🔹 बैंक का नाम: ${profile.bankName}
🔹 खाता नंबर: ${profile.accountNumber}
🔹 IFSC कोड: ${profile.ifscCode}
🔹 UPI आईडी: ${profile.upiId || ''}
` : '_आप हमारे UPI आईडी पर सीधे PhonePe / GooglePay से भुगतान कर सकते हैं।_'}

*धन्यवाद, आपके व्यवसाय के लिए!* 🙏
💼 _${bizName}_
${profile?.phone ? `📞 संपर्क दूरभाष: ${profile.phone}` : ''}`;

  const encodedText = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${clientPhone}&text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
  }
  return whatsappUrl;
}

/**
 * Shares a quotation details via WhatsApp
 */
export function shareQuotation(
  quotation: Quotation,
  client?: Client,
  profile?: BusinessProfile
): string {
  if (!quotation) {
    toast.error('कोटेशन डेटा अनुपलब्ध है!');
    return '';
  }

  const clientName = client?.name || 'ग्राहक (Valued Customer)';
  const clientPhone = sanitizePhoneNumber(client?.phone || '');
  const bizName = profile?.businessName || 'BillKaro Merchant';

  const itemLinesStr = (quotation.items || []).map((it, idx) => 
    `🔸 ${idx + 1}. *${it.name}* (Qty: ${it.quantity} ${it.unit}) - ₹${((it.rate ?? 0) * (it.quantity ?? 0)).toLocaleString('en-IN')}`
  ).join('\n');

  const subtotal = (quotation.items || []).reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const discount = quotation.discount || 0;
  const grandTotal = subtotal - discount;

  const whatsappMessage = 
`*अनुमान पत्र / कोटेशन (Business Quotation)* 📋
*${bizName}*

नमस्ते, *${clientName}*! 👋
आपके काम/प्रोजेक्ट के लिए अनुमानित मूल्य सूची (Quotation) तैयार है:

📋 *कोटेशन संख्या:* ${quotation.quoteNumber}
📅 *दिनांक (Date):* ${quotation.date || ''}
⌛ *वैधता (Validity):* ${quotation.validityDays || 30} दिन

-----------------------------------
*प्रस्तावित सामग्री / कार्य (Proposed Items):*
${itemLinesStr || 'कोई आइटम नहीं'}

*वित्तीय सारांश (Financial Summary):*
🔹 कुल मूल्य (Total): ₹${(subtotal ?? 0).toLocaleString('en-IN')}
🔹 विशेष छूट (Discount): ₹{(discount ?? 0).toLocaleString('en-IN')}
🌟 *अनुमानित कुल लागत (Estimated Cost): ₹{(grandTotal ?? 0).toLocaleString('en-IN')}*

-----------------------------------
*नियम एवं शर्तें (Terms):*
- कार्य प्रारंभ करने के लिए एडवांस आवश्यक है।
- कोटेशन ${quotation.validityDays || 30} दिन की अवधि के लिए ही वैध है।

*हम आपके साथ काम करने के लिए उत्सुक हैं!* ✨
💼 _${bizName}_
${profile?.phone ? `📞 संपर्क फोन: ${profile.phone}` : ''}`;

  const encodedText = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${clientPhone}&text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
  }
  return whatsappUrl;
}

/**
 * Shares a receipt payment details via WhatsApp
 */
export function shareReceipt(
  payment: InvoicePayment,
  invoice?: Invoice,
  client?: Client,
  profile?: BusinessProfile
): string {
  if (!payment) {
    toast.error('पेमेंट रसीद डेटा अनुपलब्ध है!');
    return '';
  }

  const clientName = client?.name || 'ग्राहक (Valued Customer)';
  const clientPhone = sanitizePhoneNumber(client?.phone || '');
  const bizName = profile?.businessName || 'BillKaro Merchant';
  const invNum = invoice?.invoiceNumber || 'INV-Reference';

  const whatsappMessage = 
`*भुगतान पावती रसीद (Payment Receipt)* 🧾
*${bizName}*

नमस्ते, *${clientName}*! 👋
हमें आपके द्वारा भेजा गया भुगतान सफलतापूर्वक प्राप्त हो गया है। विवरण नीचे दिया गया है:

🧾 *रसीद संख्या (Receipt No):* ${payment.receiptNumber}
📅 *जमा दिनांक (Payment Date):* ${payment.date}
💳 *भुगतान का माध्यम (Mode):* ${payment.mode}
📄 *इनवॉइस संदर्भ (Invoice Ref):* ${invNum}

💰 *प्राप्त जमा राशि (Amount Received):* *₹{(payment.amount ?? 0).toLocaleString('en-IN')}*
${payment.notes ? `📝 *टिप्पणी (Notes):* ${payment.notes}` : ''}

आपके सहयोग हेतु कोटि-कोटि धन्यवाद! हम आपके समृद्ध भविष्य की कामना करते हैं।

💼 _${bizName}_
${profile?.phone ? `📞 संपर्क फोन: ${profile.phone}` : ''}`;

  const encodedText = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${clientPhone}&text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
  }
  return whatsappUrl;
}

/**
 * Shares the Digital Visiting Card
 * In web-based environments, if a user passes a file/image Blob, 
 * we attempt to use the browser navigator.share API which transmits the file natively on WhatsApp/Android Share.
 * Otherwise, we gracefully send a beautiful styled business card text link as fallback.
 */
export async function shareBusinessCard(
  imageBlob: Blob | string,
  profile?: BusinessProfile
): Promise<boolean> {
  const bizName = profile?.businessName || 'नया व्यवसाय (Our Business)';
  const bizPhone = profile?.phone || '';
  const bizAddress = profile?.address || '';

  const fallbackText = 
`*डिजिटल विजिटिंग कार्ड (Digital Business Card)* 💳
*${bizName}*

नमस्ते! हमारे व्यापार से जुड़ने के लिए धन्यवाद। यहाँ हमारे व्यावसायिक संपर्क विवरण दिए गए हैं:

👤 *संचालक/मालिक:* ${profile?.ownerName || 'व्यापारी'}
📞 *मोबाइल नंबर:* ${bizPhone}
📍 *व्यवसाय का पता:* ${bizAddress}
💬 *सेवाएं:* हम उत्तम सेवा एवं सर्वोत्तम गुणवत्ता प्रदान करने के लिए प्रतिबद्ध हैं।

_कृपया हमारा नंबर अपने मोबाइल में सेव करें ताकि हम भविष्य में भी आपको उत्तम सेवाएं दे सकें।_ 🙏`;

  if (typeof window !== 'undefined' && navigator.share && imageBlob instanceof Blob) {
    try {
      const file = new File([imageBlob], 'business_card.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: bizName,
          text: fallbackText
        });
        toast.success('विजिटिंग कार्ड सफलतापूर्वक शेयर किया गया!');
        return true;
      }
    } catch (e) {
      console.warn('Navigator native file share rejected, carrying on with fallback messaging...', e);
    }
  }

  // Open standard WhatsApp message with details since image could not be shared directly via URL query params
  const clientPhone = sanitizePhoneNumber(bizPhone);
  const encodedText = encodeURIComponent(fallbackText);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;

  if (typeof window !== 'undefined') {
    window.open(whatsappUrl, '_blank');
    toast.success('डिजिटल विजिटिंग कार्ड विवरण व्हाट्सएप द्वारा शेयर लिंक के साथ खोला गया!');
  }
  return true;
}
