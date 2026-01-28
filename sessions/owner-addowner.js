// owner-addowner.js
module.exports = {
  command: /^(addowner|اضافة_مالك|اضفت_مالك)$/i,
  ownerOnly: true,
  handler: async (msgData) => {
    const { conn, m, text, sender, isOwner } = msgData;
    if (!isOwner) return; // تم التحقق في handler.js

    let who = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);
    if (!who) return m.reply('⚠️ منشن الشخص أو اكتب رقمه!');

    let number = who.split('@')[0];
    if (!global.owner) global.owner = [['21653305767', 'Musachi', true]];
    
    if (global.owner.some(o => (Array.isArray(o) ? o[0] : o) === number)) {
      return m.reply('⚠️ هذا الشخص مالك بالفعل!');
    }

    global.owner.push([number, 'New Owner', true]);
    m.reply(`✅ تم إضافة @${number} كمالك جديد`, null, { mentions: [who] });
  }
};
