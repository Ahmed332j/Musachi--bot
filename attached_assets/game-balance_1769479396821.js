// game-balance.js - عرض رصيد العملات والإحصائيات
let handler = async (msgData) => {
  const { conn, m, sender } = msgData;
  let user = global.db.data.users[sender];
  
  // إنشاء البيانات الأساسية
  if (!user.coins) user.coins = 500;
  if (!user.level) user.level = 1;
  if (!user.characters) user.characters = [];
  if (!user.bossWins) user.bossWins = 0;
  if (!user.dailyStreak) user.dailyStreak = 0;

  // حساب مجموع قوة الشخصيات
  let totalPower = 0;
  if (user.characters.length > 0) {
    totalPower = user.characters.reduce((sum, char) => sum + char.power, 0);
  }

  let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  💎 *حسابك الشخصي* 💎
╰━━━━━━━━━━━━━━━━━━╯

👤 *المستخدم:* @${sender.split('@')[0]}

╭━━━━━━━━━━━━━━━━━━╮
┃  💰 *الاقتصاد*
┃  💎 العملات: ${user.coins}
┃  ⭐ المستوى: ${user.level}
╰━━━━━━━━━━━━━━━━━━╯

╭━━━━━━━━━━━━━━━━━━╮
┃  🎮 *الألعاب*
┃  🎴 الشخصيات: ${user.characters.length}
┃  ⚔️ مجموع القوة: ${totalPower}
┃  🏆 انتصارات الزعماء: ${user.bossWins}
┃  🔥 السلسلة اليومية: ${user.dailyStreak} يوم
╰━━━━━━━━━━━━━━━━━━╯

💡 *نصائح:*
• \`.يومي\` - احصل على عملات يومية
• \`.جاتشا\` - اسحب شخصيات جديدة
• \`.زعيم\` - قاتل زعيم اليوم`;

  await conn.sendMessage(sender, { text: message, mentions: [sender] }, { quoted: m });
}

handler.help = ['عملاتي', 'رصيد', 'بروفايل'];
handler.tags = ['game'];
handler.command = /^(عملاتي|رصيد|رصيدي|balance|coins|بروفايل|profile)$/i;

module.exports = handler;
