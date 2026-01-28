// game-balance.js
module.exports = {
  command: /^(عملاتي|رصيد|رصيدي|balance|coins|بروفايل|profile)$/i,
  handler: async (msgData) => {
    const { conn, m, sender } = msgData;
    if (!global.db.data.users[sender]) global.db.data.users[sender] = { coins: 500, level: 1 };
    let user = global.db.data.users[sender];
    
    let totalPower = (user.characters || []).reduce((sum, char) => sum + (char.power || 0), 0);

    let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  💎 *حسابك الشخصي* 💎
╰━━━━━━━━━━━━━━━━━━╯

👤 *المستخدم:* @${sender.split('@')[0]}

💰 *العملات:* ${user.coins || 0}
⭐ *المستوى:* ${user.level || 1}
⚔️ *القوة:* ${totalPower}
🎴 *الشخصيات:* ${(user.characters || []).length}

💡 *نصيحة:* استخدم \`.يومي\` لزيادة رصيدك!`;

    await conn.sendMessage(sender, { text: message, mentions: [sender] }, { quoted: m });
  }
};
