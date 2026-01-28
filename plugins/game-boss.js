// game-boss.js - نظام قتال الزعماء اليومي
const fs = require('fs');

// قائمة الزعماء اليومية
const BOSSES = {
  0: { name: "نينجا الظل", power: 200, reward: 150, emoji: "🥷" },
  1: { name: "ساحر الظلام", power: 180, reward: 140, emoji: "🧙‍♂️" },
  2: { name: "تنين النار", power: 220, reward: 160, emoji: "🐉" },
  3: { name: "الوحش القديم", power: 250, reward: 180, emoji: "👹" },
  4: { name: "ملك الوحوش", power: 280, reward: 200, emoji: "👑" },
  5: { name: "غوجو المزيف", power: 300, reward: 250, emoji: "👁️" },
  6: { name: "التنين الأسطوري", power: 350, reward: 300, emoji: "🐲" }
};

// حساب قوة اللاعب
function calculatePlayerPower(user) {
  let power = user.level * 10 || 50;
  
  // إضافة قوة من الشخصيات
  if (user.characters && user.characters.length > 0) {
    // أقوى 3 شخصيات
    const topChars = user.characters
      .sort((a, b) => b.power - a.power)
      .slice(0, 3);
    
    topChars.forEach(char => {
      power += char.power * 0.5; // 50% من قوة الشخصية
    });
  }
  
  return Math.floor(power);
}

let handler = async (m, { conn, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  
  // إنشاء البيانات الأساسية
  if (!user.coins) user.coins = 500;
  if (!user.level) user.level = 1;
  if (!user.lastBoss) user.lastBoss = '';
  if (!user.bossWins) user.bossWins = 0;

  const today = new Date().toLocaleDateString('ar-TN');
  const dayOfWeek = new Date().getDay();
  const boss = BOSSES[dayOfWeek];

  const action = args[0];

  // عرض معلومات الزعيم
  if (!action || action === 'عرض' || action === 'info') {
    let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  ${boss.emoji} *زعيم اليوم* ${boss.emoji}
╰━━━━━━━━━━━━━━━━━━╯

🎯 *الزعيم:* ${boss.name}
⚔️ *القوة:* ${boss.power}
💰 *المكافأة:* ${boss.reward} عملة

╭━━━━━━━━━━━━━━━━━━╮
┃  👤 *قوتك الحالية*
┃  💪 القوة: ${calculatePlayerPower(user)}
┃  ⭐ المستوى: ${user.level}
┃  🏆 الانتصارات: ${user.bossWins}
╰━━━━━━━━━━━━━━━━━━╯

${user.lastBoss === today ? '⏰ *لقد قاتلت الزعيم اليوم بالفعل!*\n\n' : ''}💡 استخدم \`${usedPrefix}زعيم قتال\` للمواجهة!`;

    return m.reply(message);
  }

  // قتال الزعيم
  if (action === 'قتال' || action === 'fight') {
    // التحقق من القتال اليومي
    if (user.lastBoss === today) {
      return m.reply(`⏰ *لقد قاتلت الزعيم اليوم بالفعل!*

عد غداً لمواجهة زعيم جديد!
🏆 انتصاراتك: ${user.bossWins}`);
    }

    const playerPower = calculatePlayerPower(user);
    const bossPower = boss.power;

    // حساب نتيجة المعركة (مع عنصر الحظ)
    const luck = Math.random() * 20 - 10; // من -10 إلى +10
    const finalPlayerPower = playerPower + luck;

    let result = `╭━━━━━━━━━━━━━━━━━━╮
┃  ⚔️ *معركة الزعيم* ⚔️
╰━━━━━━━━━━━━━━━━━━╯

${boss.emoji} **${boss.name}**
⚡ القوة: ${bossPower}

     VS

👤 **أنت**
⚡ القوة: ${Math.floor(finalPlayerPower)}

━━━━━━━━━━━━━━━━━━\n`;

    if (finalPlayerPower >= bossPower) {
      // فوز
      user.coins += boss.reward;
      user.bossWins += 1;
      user.lastBoss = today;

      result += `🎉 *فزت!* 🎉

💰 حصلت على: ${boss.reward} عملة
🏆 انتصارات جديدة: ${user.bossWins}
💎 رصيدك: ${user.coins} عملة

✨ عد غداً لمواجهة زعيم جديد!`;
    } else {
      // خسارة
      user.lastBoss = today;
      
      result += `💀 *خسرت!* 💀

😢 لم تحصل على مكافأة
💪 قوة الزعيم كانت أكبر

💡 *نصائح للفوز:*
• اسحب شخصيات أقوى من الجاتشا
• ارفع مستواك
• حاول مجدداً غداً!`;
    }

    m.reply(result);
  }
}

handler.help = ['زعيم', 'boss'];
handler.tags = ['game'];
handler.command = /^(زعيم|زعماء|boss)$/i;

module.exports = handler;