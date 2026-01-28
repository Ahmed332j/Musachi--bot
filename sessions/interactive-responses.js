// interactive-responses.js - CommonJS version
async function before(conn, m, { body, sender, senderJid, isOwner, autoReact }) {
  if (!body) return false;
  
  const text = body.toLowerCase().trim();
  
  // رد على "بوت"
  if (text === 'بوت' || text === 'bot' || text.includes('البوت')) {
    const responses = ['موجود! 🤖', 'شغال ✅', 'نعم؟ 💬', 'أنا هنا! 🎯', 'تحت أمرك 🌟'];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await conn.sendMessage(sender, { text: response }, { quoted: m });
    return true;
  }
  
  // رد على التحية
  if (text === 'السلام عليكم' || text === 'سلام' || text === 'هاي' || text === 'هلا') {
    const responses = ['وعليكم السلام ورحمة الله 🌹', 'أهلاً وسهلاً 🎉', 'مرحباً بك 👋', 'هلا والله 🌟'];
    const response = responses[Math.floor(Math.random() * responses.length)];
    await conn.sendMessage(sender, { text: response }, { quoted: m });
    return true;
  }

  return false;
}

module.exports = { before, handler: before };
