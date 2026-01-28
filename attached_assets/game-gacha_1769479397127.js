// game-gacha.js - نظام الجاتشا لسحب الشخصيات
// قائمة شخصيات الجاتشا
const GACHA_POOL = {
  common: [
    { name: "شينوبي مبتدئ", rarity: "🟢 عادي", power: 50 },
    { name: "ساحر متدرب", rarity: "🟢 عادي", power: 55 },
    { name: "مقاتل عادي", rarity: "🟢 عادي", power: 60 },
    { name: "محارب مبتدئ", rarity: "🟢 عادي", power: 52 },
    { name: "كشاف", rarity: "🟢 عادي", power: 48 }
  ],
  rare: [
    { name: "إيتاتشي", rarity: "🔵 نادر", power: 120 },
    { name: "تانجيرو", rarity: "🔵 نادر", power: 115 },
    { name: "ليفاي", rarity: "🔵 نادر", power: 130 },
    { name: "زينيتسو", rarity: "🔵 نادر", power: 110 },
    { name: "ميكاسا", rarity: "🔵 نادر", power: 125 }
  ],
  epic: [
    { name: "غوجو ساتورو", rarity: "🟣 ملحمي", power: 220 },
    { name: "إرين ييغر", rarity: "🟣 ملحمي", power: 210 },
    { name: "ناروتو سيج", rarity: "🟣 ملحمي", power: 205 },
    { name: "ساسكي رينيغان", rarity: "🟣 ملحمي", power: 215 }
  ],
  legendary: [
    { name: "سونغ جين وو", rarity: "🟡 أسطوري", power: 350 },
    { name: "لوفي جير 5", rarity: "🟡 أسطوري", power: 340 },
    { name: "مادارا أوتشيها", rarity: "🟡 أسطوري", power: 330 },
    { name: "سايتاما", rarity: "🟡 أسطوري", power: 400 }
  ]
};

// نسب السحب
function getRarity() {
  const rand = Math.random() * 100;
  if (rand < 2) return "legendary"; // 2%
  if (rand < 12) return "epic"; // 10%
  if (rand < 35) return "rare"; // 23%
  return "common"; // 65%
}

// اختيار شخصية عشوائية
function rollCharacter() {
  const rarity = getRarity();
  const pool = GACHA_POOL[rarity];
  return pool[Math.floor(Math.random() * pool.length)];
}

let handler = async (msgData) => {
  const { conn, m, sender, usedPrefix } = msgData;
  let user = global.db.data.users[sender];
  
  // إنشاء بيانات المستخدم إذا لم تكن موجودة
  if (!user.characters) user.characters = [];
  if (!user.coins) user.coins = 500;

  const cost = 100;

  // التحقق من العملات
  if (user.coins < cost) {
    return conn.sendMessage(sender, { text: `❌ ليس لديك عملات كافية للسحب!\n\n💰 تحتاج: ${cost} عملة\n💎 لديك: ${user.coins} عملة\n\n✨ استخدم \`${usedPrefix}يومي\` للحصول على عملات مجانية!` }, { quoted: m });
  }

  // خصم العملة
  user.coins -= cost;

  // سحب شخصية
  const character = rollCharacter();

  // إضافة الشخصية للمجموعة
  user.characters.push(character);

  // رياكشن السحب
  await conn.sendMessage(sender, { react: { text: '🎰', key: m.key } });

  // رسالة النتيجة
  let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  🎰 *نتيجة الجاتشا!* 🎰
╰━━━━━━━━━━━━━━━━━━╯

✨ *لقد حصلت على:*
${character.rarity} **${character.name}**

⚔️ القوة: ${character.power}
🎴 المجموعة: ${user.characters.length} شخصية

╭━━━━━━━━━━━━━━━━━━╮
┃  💰 عملاتك المتبقية: ${user.coins}
╰━━━━━━━━━━━━━━━━━━╯

💡 *نصائح:*
• استخدم \`.شخصياتي\` لرؤية مجموعتك
• اسحب أكثر للحصول على شخصيات أقوى!`;

  await conn.sendMessage(sender, { text: message }, { quoted: m });
}

handler.help = ['جاتشا', 'سحب'];
handler.tags = ['game'];
handler.command = /^(جاتشا|gacha|سحب|pull)$/i;

module.exports = handler;
