// game-daily.js - نظام المكافأة اليومية
let handler = async (msgData) => {
  const { conn, m, sender } = msgData;
  let user = global.db.data.users[sender];
  
  // إنشاء البيانات الأساسية
  if (!user.coins) user.coins = 500;
  if (!user.lastDaily) user.lastDaily = 0;
  if (!user.dailyStreak) user.dailyStreak = 0;

  const today = new Date().toLocaleDateString('ar-TN');
  const lastClaim = user.lastDaily;

  // التحقق من أخذ المكافأة اليوم
  if (lastClaim === today) {
    return conn.sendMessage(sender, { text: `⏰ *لقد حصلت على مكافأتك اليومية بالفعل!*

╭━━━━━━━━━━━━━━━━━━╮
┃  عد غداً للمزيد من المكافآت
╰━━━━━━━━━━━━━━━━━━╯

💎 رصيدك الحالي: ${user.coins} عملة
🔥 سلسلتك: ${user.dailyStreak} يوم متتالي` }, { quoted: m });
  }

  // حساب السلسلة
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString('ar-TN');
  
  if (lastClaim === yesterdayStr) {
    user.dailyStreak += 1;
  } else {
    user.dailyStreak = 1; // إعادة تعيين السلسلة
  }

  // حساب المكافأة (تزداد مع السلسلة)
  const baseReward = 100;
  const streakBonus = Math.min(user.dailyStreak - 1, 20) * 50; // حد أقصى +1000
  const totalReward = baseReward + streakBonus;

  // إضافة المكافأة
  user.coins += totalReward;
  user.lastDaily = today;

  // رسالة المكافأة
  let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  🎉 *المكافأة اليومية* 🎉
╰━━━━━━━━━━━━━━━━━━╯

💰 *المكافأة الأساسية:* +${baseReward} عملة
🔥 *مكافأة السلسلة:* +${streakBonus} عملة
━━━━━━━━━━━━━━━━━━
✨ *المجموع:* +${totalReward} عملة

╭━━━━━━━━━━━━━━━━━━╮
┃  📊 *إحصائياتك*
┃  💎 الرصيد: ${user.coins} عملة
┃  🔥 السلسلة: ${user.dailyStreak} يوم متتالي
╰━━━━━━━━━━━━━━━━━━╯

💡 *نصيحة:* عد يومياً للحفاظ على سلسلتك وزيادة المكافآت!`;

  await conn.sendMessage(sender, { text: message }, { quoted: m });
}

handler.help = ['يومي', 'مكافأة'];
handler.tags = ['game'];
handler.command = /^(يومي|daily|مكافأة|مكافاة)$/i;

module.exports = handler;
