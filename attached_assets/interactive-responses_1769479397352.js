// interactive-responses.js - نظام الردود التفاعلية الذكي المحدث

// نظام الردود التفاعلية
export async function before(m) {
  if (!m.text) return;
  
  const text = m.text.toLowerCase().trim();
  const sender = m.sender;
  const isOwner = global.owner.includes(sender.split('@')[0]);
  
  // التحقق من صلاحيات المالك المخصصة
  const hasOwnerPermission = () => {
    if (!global.db.data.users[sender]) return false;
    return global.db.data.users[sender].ownerPermission === true || isOwner;
  };
  
  // ردود تلقائية للجميع
  
  // رد على "استغفر الله" عند قول كلمات معينة
  if (text.includes('انا شرير') || text.includes('أنا شرير') || 
      text.includes('شرير') || text.includes('سيء')) {
    await m.reply('استغفر الله العظيم 🤲');
    return true;
  }
  
  // رد على المالك ومن لديه صلاحيات المالك
  if (isOwner || hasOwnerPermission()) {
    if (text === 'ياعبد' || text === 'يا عبد' || text === 'عبد') {
      const responses = [
        'نعم يا سيدي 🙇',
        'في خدمتك سيدي 👑',
        'تحت أمرك يا مولاي 🎩',
        'أمرك يا سيدي ✨'
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      await m.reply(response);
      return true;
    }
  }
  
  // رد على "بوت"
  if (text === 'بوت' || text === 'bot' || text.includes('البوت')) {
    const responses = [
      'موجود! 🤖',
      'شغال ✅',
      'نعم؟ 💬',
      'أنا هنا! 🎯',
      'تحت أمرك 🌟'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // ردود مخصصة محدثة
  
  // يونا تقول "بيبي" → "مامي"
  if ((text === 'بيبي' || text === 'baby') && 
      global.specialUsers?.yunaUser && 
      sender === global.specialUsers.yunaUser + '@s.whatsapp.net') {
    const responses = [
      'مامي 💕',
      'نعم بيبي؟ 🥰',
      'مامي في الخدمة 💗',
      'حبيبتي بيبي 💖'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // ساسكي → "عمك"
  if ((text === 'ساسكي' || text === 'sasuke') && 
      global.specialUsers?.sasukeUser && 
      sender === global.specialUsers.sasukeUser + '@s.whatsapp.net') {
    const responses = [
      'عمك 😎',
      'عمو هنا 🔥',
      'نداء عمك 👊'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // سوبارو → "BOSS"
  if ((text === 'سوبارو' || text === 'subaru') && 
      global.specialUsers?.subaruUser && 
      sender === global.specialUsers.subaruUser + '@s.whatsapp.net') {
    const responses = [
      'BOSS 😈',
      'نعم BOSS! 💪',
      'BOSS في المكان 🔥'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // ردود عامة أخرى
  
  // رد على التحية
  if (text === 'السلام عليكم' || text === 'سلام' || text === 'هاي' || text === 'هلا') {
    const responses = [
      'وعليكم السلام ورحمة الله 🌹',
      'أهلاً وسهلاً 🎉',
      'مرحباً بك 👋',
      'هلا والله 🌟'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // رد على "صباح الخير"
  if (text.includes('صباح') && text.includes('خير')) {
    await m.reply('صباح النور والسرور 🌅');
    return true;
  }
  
  // رد على "مساء الخير"
  if (text.includes('مساء') && text.includes('خير')) {
    await m.reply('مساء الورد والفل 🌙');
    return true;
  }
  
  // رد على "شكراً"
  if (text === 'شكرا' || text === 'شكراً' || text === 'thanks' || text === 'شكرآ') {
    const responses = [
      'العفو 🌹',
      'لا شكر على واجب 💫',
      'تحت أمرك دائماً ✨',
      'على الرحب والسعة 🎀'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // رد على "كيف حالك"
  if (text.includes('كيف حالك') || text.includes('كيفك') || text.includes('شلونك')) {
    const responses = [
      'الحمدلله، وأنت كيف حالك؟ 😊',
      'بخير والحمدلله 🌟',
      'تمام التمام! وأنت؟ ✨',
      'ممتاز! شكراً لسؤالك 💕'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // رد على "احبك"
  if (text === 'احبك' || text === 'أحبك' || text === 'بحبك' || text === 'i love you') {
    const responses = [
      'وأنا أحبك في الله 💕',
      'الله يخليك 🥰',
      'أنت الأفضل 💖',
      'وأنا كمان 😊'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await m.reply(response);
    return true;
  }
  
  // رد على "تصبح على خير"
  if (text.includes('تصبح') && text.includes('خير')) {
    await m.reply('وأنت من أهل الخير، تصبح على ألف خير 🌙✨');
    return true;
  }
  
  return false;
}

// تصدير للاستخدام في ملفات أخرى
export default {
  before
};