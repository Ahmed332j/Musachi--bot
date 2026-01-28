// game-mycharacters.js - عرض مجموعة الشخصيات

let handler = async (m, { conn }) => {
  let user = global.db.data.users[m.sender];
  
  // التحقق من وجود شخصيات
  if (!user.characters || user.characters.length === 0) {
    return m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  📭 *مجموعتك فارغة!*
╰━━━━━━━━━━━━━━━━━━╯

💡 استخدم \`.جاتشا\` لسحب شخصيات جديدة!
💰 التكلفة: 100 عملة للسحب`);
  }

  // حساب الإحصائيات
  let common = 0, rare = 0, epic = 0, legendary = 0;
  let totalPower = 0;

  user.characters.forEach(char => {
    totalPower += char.power;
    if (char.rarity.includes('عادي')) common++;
    else if (char.rarity.includes('نادر')) rare++;
    else if (char.rarity.includes('ملحمي')) epic++;
    else if (char.rarity.includes('أسطوري')) legendary++;
  });

  const avgPower = Math.floor(totalPower / user.characters.length);

  // ترتيب الشخصيات حسب القوة
  user.characters.sort((a, b) => b.power - a.power);

  // عرض أقوى 10 شخصيات
  let charList = user.characters.slice(0, 10).map((char, i) => {
    return `${i + 1}. ${char.rarity} **${char.name}**\n   ⚔️ القوة: ${char.power}`;
  }).join('\n\n');

  let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  📚 *مجموعة شخصياتك* 📚
╰━━━━━━━━━━━━━━━━━━╯

${charList}

${user.characters.length > 10 ? `\n... و ${user.characters.length - 10} شخصية أخرى\n` : ''}
╭━━━━━━━━━━━━━━━━━━╮
┃  📊 *الإحصائيات*
┃  🎴 المجموع: ${user.characters.length} شخصية
┃  ⚡ متوسط القوة: ${avgPower}
┃  💪 أقوى قوة: ${user.characters[0].power}
╰━━━━━━━━━━━━━━━━━━╯

📈 *التوزيع حسب الندرة:*
🟢 عادي: ${common} | 🔵 نادر: ${rare}
🟣 ملحمي: ${epic} | 🟡 أسطوري: ${legendary}

💡 استمر في السحب لتقوية مجموعتك!`;

  m.reply(message);
}

handler.help = ['شخصياتي', 'مجموعتي'];
handler.tags = ['game'];
handler.command = /^(شخصياتي|مجموعتي|mycharacters|characters)$/i;

module.exports = handler;