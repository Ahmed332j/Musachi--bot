// owner-delowner.js
module.exports = {
  command: /^(delowner|حذف_مالك)$/i,
  ownerOnly: true,
  handler: async (msgData) => {
    const { conn, m, text, isOwner } = msgData;
    if (!isOwner) return;

    let who = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
    if (!who) return m.reply('⚠️ منشن الشخص!');

    let number = who.split('@')[0];
    if (number === '21653305767') return m.reply('⛔ لا يمكن حذف المالك الأساسي!');

    global.owner = global.owner.filter(o => (Array.isArray(o) ? o[0] : o) !== number);
    m.reply(`✅ تم حذف @${number} من المالكين`);
  }
};
