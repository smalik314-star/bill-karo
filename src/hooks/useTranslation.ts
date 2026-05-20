import { useMemo } from 'react';
import useAppStore from '../store';

// Dictionary of purely-English to Hindi/Hinglish and purely-Hindi to English/Hinglish
const TRANSLATION_DICTIONARY: Record<string, Record<'Hindi' | 'English' | 'Hinglish', string>> = {
  // Authentication & Login/Signup general
  "नया खाता चाहिए?": {
    Hindi: "नया खाता चाहिए?",
    English: "Need a new account?",
    Hinglish: "नया खाता चाहिए? (Need account?)"
  },
  "पहले से ही खाता है?": {
    Hindi: "पहले से ही खाता है?",
    English: "Already have an account?",
    Hinglish: "पहले से ही खाता है? (Already have account?)"
  },
  "लॉगआउट सफल रहा!": {
    Hindi: "लॉगआउट सफल रहा!",
    English: "Logout successful!",
    Hinglish: "लॉगआउट सफल रहा (Logout successful)!"
  },
  "लॉगआउट में त्रुटि!": {
    Hindi: "लॉगआउट में त्रुटि!",
    English: "Logout error!",
    Hinglish: "लॉगआउट में त्रुटि (Logout error)!"
  },
  "लॉगआउट में त्रुटि हुई!": {
    Hindi: "लॉगआउट में त्रुटि हुई!",
    English: "Logout error occurred!",
    Hinglish: "लॉगआउट में त्रुटि हुई (Logout error)!"
  },
  
  // Dashboard Metrics & Messages
  "सारे बिल और भुगतान सुरक्षित क्लाउड डेटाबेस से सिंक हैं।": {
    Hindi: "सारे बिल और भुगतान सुरक्षित क्लाउड डेटाबेस से सिंक हैं।",
    English: "All bills and payments are synced with a secure cloud database.",
    Hinglish: "सारे बिल और भुगतान सुरक्षित क्लाउड (Cloud Database) से सिंक हैं।"
  },
  "लोकल बही खाता मोड सक्रिय है। इंटरनेट आने पर सुरक्षित हो जाएगा।": {
    Hindi: "लोकल बही खाता मोड सक्रिय है। इंटरनेट आने पर सुरक्षित हो जाएगा।",
    English: "Local offline ledger mode is active. It will sync once internet returns.",
    Hinglish: "लोकल बही खाता मोड (Local offline) सक्रिय है। इंटरनेट आने पर सुरक्षित हो जाएगा।"
  },
  "खता बुक प्रबंधन": {
    Hindi: "खता बुक प्रबंधन",
    English: "Ledger Book Management",
    Hinglish: "खता बुक प्रबंधन (Ledger Book)"
  },
  "कुल बकाया वसूली": {
    Hindi: "कुल बकाया वसूली",
    English: "Total Pending Receivable",
    Hinglish: "कुल बकाया वसूली (Total Receivables)"
  },
  "सभी एंट्रीज फोन के लोकल बही खाता स्टोरेज में सुरक्षित हैं।": {
    Hindi: "सभी एंट्रीज फोन के लोकल बही खाता स्टोरेज में सुरक्षित हैं।",
    English: "All entries are securely saved in your phone's offline storage.",
    Hinglish: "सभी एंट्रीज फोन के लोकल बही (Local Storage) में सुरक्षित हैं।"
  },
  "बही खाता लाइव क्लाउड डेटा से सिंक्रोनाइज्ड है।": {
    Hindi: "बही खाता लाइव क्लाउड डेटा से सिंक्रोनाइज्ड है।",
    English: "Your ledger is synchronized in real-time with the secure cloud database.",
    Hinglish: "बही खाता लाइव क्लाउड (Cloud Live) से सिंक्रोनाइज्ड है।"
  },

  // State text
  "सक्रिय सूची: ": {
    Hindi: "सक्रिय सूची: ",
    English: "Active List: ",
    Hinglish: "सक्रिय सूची (Active List): "
  },
  "ग्राहक खाते": {
    Hindi: "ग्राहक खाते",
    English: "Client Accounts",
    Hinglish: "ग्राहक खाते (Client Accounts)"
  },

  // Clients screen & Details
  "कोई ग्राहक नहीं मिला। कृपया ऊपर दिए गए सर्च या फ़िल्टर को बदलें।": {
    Hindi: "कोई ग्राहक नहीं मिला। कृपया ऊपर दिए गए सर्च या फ़िल्टर को बदलें।",
    English: "No clients found. Please adjust the search or filter above.",
    Hinglish: "कोई ग्राहक नहीं मिला (No clients found). कृपया सर्च या फ़िल्टर बदलें।"
  },
  "कोई बिलिंग नहीं (No Logs)": {
    Hindi: "कोई बिलिंग नहीं",
    English: "No Billing Logs",
    Hinglish: "कोई बिलिंग नहीं (No Logs)"
  },
  "सर्च की जाँच करें या एक नया ग्राहक खाता खोलने के लिए नीचे दिए गए प्लस (+) बटन पर टैप करें।": {
    Hindi: "सर्च की जाँच करें या एक नया ग्राहक खाता खोलने के लिए नीचे दिए गए प्लस (+) बटन पर टैप करें।",
    English: "Check your search or tap the plus (+) button below to create a new client account.",
    Hinglish: "सर्च बदलें या नया ग्राहक (New Client) खाता खोलने के लिए नीचे प्लस (+) बटन दबाएं।"
  },
  "उधार का हिसाब रखने और पक्का बिल प्रिंट करने के लिए \"नया जोड़ें\" बटन पर क्लिक करें।": {
    Hindi: "उधार का हिसाब रखने और पक्का बिल प्रिंट करने के लिए \"नया जोड़ें\" बटन पर क्लिक करें।",
    English: "Click \"Add New\" to keep track of outstanding dues and print invoices.",
    Hinglish: "उधार का हिसाब रखने और पक्का बिल (Invoice) प्रिंट करने के लिए \"नया जोड़ें\" बटन दबाएं।"
  },
  "उद्धरण या एस्टीमेट रसीद बनाने के लिए \"नया जोड़ें\" बटन पर क्लिक करें।": {
    Hindi: "उद्धरण या एस्टीमेट रसीद बनाने के लिए \"नया जोड़ें\" बटन पर क्लिक करें।",
    English: "Click \"Add New\" to create a quotation or project estimate receipt.",
    Hinglish: "Quotation या एस्टीमेट रसीद बनाने के लिए \"नया जोड़ें\" बटन पर क्लिक करें।"
  },

  // Invoices & Estimates
  "दिए गए मापदंडों के अनुसार कोई इनवॉइस नहीं मिला। कृपया फ़िल्टर बदलें या ऊपर बटन पर क्लिक करके नया पक्का बिल बनाएँ।": {
    Hindi: "दिए गए मापदंडों के अनुसार कोई इनवॉइस नहीं मिला। कृपया फ़िल्टर बदलें या ऊपर बटन पर क्लिक करके नया पक्का बिल बनाएँ।",
    English: "No invoices found matching your filters. Please change filters or click the button above to create a new invoice.",
    Hinglish: "कोई इनवॉइस नहीं मिला (No Invoices). कृपया फ़िल्टर बदलें या ऊपर बटन दबाकर नया पक्का बिल बनाएं।"
  },
  "ग्राहकों को नया कोटेशन जारी करें और सीधे पक्के बिल में बदलें।": {
    Hindi: "ग्राहकों को नया कोटेशन जारी करें और सीधे पक्के बिल में बदलें।",
    English: "Issue a new quotation to clients and easily convert it to a formal GST invoice with one tap.",
    Hinglish: "ग्राहकों को नया कोटेशन (Quotation) जारी करें और सीधे पक्के बिल (Invoice) में बदलें।"
  },
  "सर्च फ़िल्टर बदलें या नया एस्टीमेट जारी करने के लिए ऊपर \"+ नया एस्टीमेट बनाएँ\" पर क्लिक करें।": {
    Hindi: "सर्च फ़िल्टर बदलें या नया एस्टीमेट जारी करने के लिए ऊपर \"+ नया एस्टीमेट बनाएँ\" पर क्लिक करें।",
    English: "Adjust your search filters or click the \"+ Create New Estimate\" button above to issue a new quotation.",
    Hinglish: "सर्च फ़िल्टर बदलें या नया एस्टीमेट (New Estimate) जारी करने के लिए ऊपर बटन पर क्लिक करें।"
  },
  "साल (₹1499)": {
    Hindi: "साल (₹1499)",
    English: "Yearly (₹1499)",
    Hinglish: "साल (Yearly / ₹1499)"
  },
  "Free Trial active. Cards may have watermark. Limit: 5 Client maximum.": {
    Hindi: "फ्री ट्रायल सक्रिय है। विज़िटिंग कार्ड पर वॉटरमार्क रहेगा। सीमा: अधिकतम 5 ग्राहक।",
    English: "Free Trial active. Cards may have watermark. Limit: 5 Client maximum.",
    Hinglish: "Free Trial active. Cards may have watermark. Limit: 5 Client maximum."
  },
  "Upgrade Now": {
    Hindi: "अभी अपग्रेड करें",
    English: "Upgrade Now",
    Hinglish: "अभी अपग्रेड करें (Upgrade Now)"
  },

  // Labour Attendance Screen descriptions
  "सक्रिय कारीगरों का विवरण और उनकी दैनिक हाज़िरी डायरी।": {
    Hindi: "सक्रिय कारीगरों का विवरण और उनकी दैनिक हाज़िरी डायरी।",
    English: "Active worker directory and daily attendance diary planner.",
    Hinglish: "सक्रिय कारीगरों का विवरण (Workers Directory) और उनकी दैनिक हाज़िरी डायरी।"
  },
  "कारीगरों की सैलरी, चुकाई गई एडवांस रकम और पेंडिंग हिसाब।": {
    Hindi: "कारीगरों की सैलरी, चुकाई गई एडवांस रकम और पेंडिंग हिसाब।",
    English: "Track worker salaries, advance payouts, and outstanding pay balances.",
    Hinglish: "कारीगरों की सैलरी (Worker Salaries), चुकाई गई एडवांस रकम और पेंडिंग हिसाब।"
  },

  // Expenses & Recurring
  "नियमित मासिक/वार्षिक खर्चों का खाता": {
    Hindi: "नियमित मासिक/वार्षिक खर्चों का खाता",
    English: "Ledger for recurring monthly or yearly subscription expenses.",
    Hinglish: "नियमित मासिक/वार्षिक (Recurring) खर्चों का सुरक्षा खाता"
  },
  "नया दैनिक खर्च्चा बही में जोड़ लिया गया है!": {
    Hindi: "नया दैनिक खर्च्चा बही में जोड़ लिया गया है!",
    English: "New operational expense added to the ledger successfully!",
    Hinglish: "नया दैनिक खर्च्चा (Expense) बही में सफलतापूर्वक जोड़ लिया गया है!"
  }
};

/**
 * Clean up a translation string of any surrounding formatting like * or :
 */
const cleanup = (text: string): string => {
  return text.trim();
};

/**
 * Resolve brackets inside text helper
 */
const resolveSingleText = (part: string, lang: 'Hindi' | 'English'): string => {
  const cleanPart = part.trim();
  const bracketMatch = cleanPart.match(/^([^\(]+)\(([^)]+)\)(.*)$/);
  if (bracketMatch) {
    const leftPart = bracketMatch[1].trim();
    const insidePart = bracketMatch[2].trim();
    const rightPart = bracketMatch[3].trim();
    const leftHasHindi = /[\u0900-\u097F]/.test(leftPart);
    if (leftHasHindi) {
      if (lang === 'English') {
        return cleanup(insidePart + (rightPart ? ' ' + rightPart : ''));
      } else {
        return cleanup(leftPart + (rightPart ? ' ' + rightPart : ''));
      }
    }
  }
  return cleanPart;
};

/**
 * Universal translation function
 */
export const translateText = (text: string, lang: 'Hindi' | 'English' | 'Hinglish'): string => {
  if (!text) return '';
  if (typeof text !== 'string') return String(text);

  const cleanInput = text.trim();

  // 1. Direct dictionary check (first preference)
  if (TRANSLATION_DICTIONARY[cleanInput]) {
    return TRANSLATION_DICTIONARY[cleanInput][lang];
  }

  // 2. Hinglish mode - returns original string containing both languages (ceiling limit)
  if (lang === 'Hinglish') {
    return text;
  }

  const hasHindi = /[\u0900-\u097F]/.test(cleanInput);
  const hasEnglish = /[a-zA-Z]/.test(cleanInput);

  // 3. Bilingual pattern splitting
  if (hasHindi && hasEnglish) {
    // A. Slashes like "नाम / Name" or "नाम (Name) / पता (Address)"
    if (cleanInput.includes('/')) {
      const parts = cleanInput.split('/');
      const firstHasHindi = /[\u0900-\u097F]/.test(parts[0]);
      if (firstHasHindi && parts.length >= 2) {
        if (lang === 'English') {
          return resolveSingleText(parts.slice(1).join('/'), 'English');
        }
        if (lang === 'Hindi') {
          return resolveSingleText(parts[0], 'Hindi');
        }
      }
    }

    // B. Brackets like "डैशबोर्ड (Overview)" or "ग्राहक खाता (Clients)" or "यहाँ नया अकाउंट बनाएं (Register)"
    const resolvedSimple = resolveSingleText(cleanInput, lang === 'English' ? 'English' : 'Hindi');
    if (resolvedSimple !== cleanInput) {
      return resolvedSimple;
    }
  }

  // 4. Default return (fallback when no specific translations or patterns apply)
  return text;
};

export const useTranslation = () => {
  const profile = useAppStore((state) => state.profile);
  const language = (profile.language || 'Hinglish') as 'Hinglish' | 'Hindi' | 'English';

  const t = useMemo(() => {
    return (text: string): string => translateText(text, language);
  }, [language]);

  return {
    language,
    t
  };
};

export default useTranslation;
