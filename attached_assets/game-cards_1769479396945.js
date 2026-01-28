// game-cards.js - نظام بطاقات الأنمي
const allCards = [
  // بطاقات عادية 🟢
  { id: 1, name: "ناروتو", rarity: "🟢 عادي", anime: "ناروتو", value: 10 },
  { id: 2, name: "ساكورا", rarity: "🟢 عادي", anime: "ناروتو", value: 10 },
  { id: 3, name: "تشوجي", rarity: "🟢 عادي", anime: "ناروتو", value: 10 },
  
  // بطاقات نادرة 🔵
  { id: 4, name: "ساسكي", rarity: "🔵 نادر", anime: "ناروتو", value: 25 },
  { id: 5, name: "لوفي", rarity: "🔵 نادر", anime: "ون بيس", value: 25 },
  { id: 6, name: "زورو", rarity: "🔵 نادر", anime: "ون بيس", value: 25 },
  { id: 7, name: "تانجيرو", rarity: "🔵 نادر", anime: "ديمون سلاير", value: 25 },
  
  // بطاقات ملحمية 🟣
  { id: 8, name: "إيتاتشي", rarity: "🟣 ملحمي", anime: "ناروتو", value: 50 },
  { id: 9, name: "مادارا", rarity: "🟣 ملحمي", anime: "ناروتو", value: 50 },
  { id: 10, name: "غوجو", rarity: "🟣 ملحمي", anime: "جوجوتسو كايسن", value: 50 },
  
  // بطاقات أسطورية 🟡
  { id: 11, name: "سونغ جين وو", rarity: "🟡 أسطوري", anime: "سولو ليفلينغ", value: 100 },
  { id: 12, name: "لوفي جير 5", rarity: "🟡 أسطوري", anime: "ون بيس", value: 100 },
  { id: 13, name: "سايتاما", rarity: "🟡 أسطوري", anime: "ون بانش مان", value: 100 }
];

function getRandomCard() {
  const rand = Math.random() * 100;
  let pool;
  
  if (rand < 2) {
    pool = allCards.filter(c => c.rarity.includes('أسطوري'));
  } else if (rand < 12) {
    pool = allCards.filter(c => c.rarity.includes('ملحمي'));
  } else if (rand < 35) {
    pool = allCards.filter(c => c.rarity.includes('نادر'));
  } else {
    pool = allCards.filter(c => c.rarity.includes('عادي'));
  }
  
  return pool[Math.floor(Math.random() * pool.length)];
}

let handler = async (msgData) => {
  const { conn, m, args, sender, usedPrefix } = msgData;
  let user = global.db.data.users[sender];
  
  if (!user.cards) user.cards = [];
  if (!user.coins) user.coins = 1000;
  
  const action = args[0];
  
  // سحب بطاقة
  if (action === 'سحب' || action === 'pull') {
    const cost = 50;
    
    if (user.coins < cost) {
      return conn.sendMessage(sender, { text: `❌ تحتاج ${cost} عملة لسحب بطاقة!\n\n💎 رصيدك: ${user.coins} عملة` }, { quoted: m });
    }
    
    user.coins -= cost;
    const card = getRandomCard();
    
    // التحقق من البطاقة المكررة
    const existing = user.cards.find(c => c.id === card.id);
    
    if (existing) {
      existing.count = (existing.count || 1) + 1;
      user.coins += 10; // مكافأة البطاقة المكررة
      
      await conn.sendMessage(sender, { text: `╭━━━━━━━━━━━━━━━━━━╮
┃  🎴 *بطاقة مكررة!* 🎴
╰━━━━━━━━━━━━━━━━━━╯

${card.rarity} **${card.name}**
🎬 الأنمي: ${card.anime}

💰 حصلت على: +10 عملة (مكرر)
💎 رصيدك: ${user.coins} عملة
📊 عدد النسخ: ×${existing.count}` }, { quoted: m });
    } else {
      user.cards.push({ ...card, count: 1 });
      
      await conn.sendMessage(sender, { text: `╭━━━━━━━━━━━━━━━━━━╮
┃  🎴 *بطاقة جديدة!* 🎴
╰━━━━━━━━━━━━━━━━━━╯

${card.rarity} **${card.name}**
🎬 الأنمي: ${card.anime}
💵 القيمة: ${card.value} عملة

╭━━━━━━━━━━━━━━━━━━╮
┃  📊 إحصائياتك
┃  🎴 مجموعتك: ${user.cards.length} بطاقة
┃  💎 رصيدك: ${user.coins} عملة
╰━━━━━━━━━━━━━━━━━━╯` }, { quoted: m });
    }
  }
  
  // عرض المجموعة
  else if (action === 'مجموعتي' || action === 'collection') {
    if (user.cards.length === 0) {
      return conn.sendMessage(sender, { text: `📭 *مجموعتك فارغة!*

استخدم \`.بطاقات سحب\` لسحب بطاقات!
💰 التكلفة: 50 عملة` }, { quoted: m });
    }
    
    let totalValue = 0;
    let cardList = user.cards.map((card, i) => {
      totalValue += card.value * (card.count || 1);
      return `${i + 1}. ${card.rarity} **${card.name}**${card.count > 1 ? ` (×${card.count})` : ''}\n   🎬 ${card.anime} | 💵 ${card.value}`;
    }).join('\n\n');
    
    await conn.sendMessage(sender, { text: `╭━━━━━━━━━━━━━━━━━━╮
┃  📚 *مجموعة بطاقاتك* 📚
╰━━━━━━━━━━━━━━━━━━╯

${cardList}

╭━━━━━━━━━━━━━━━━━━╮
┃  📊 الإحصائيات
┃  🎴 المجموع: ${user.cards.length} بطاقة
┃  💰 القيمة الكلية: ${totalValue} عملة
╰━━━━━━━━━━━━━━━━━━╯` }, { quoted: m });
  }
  
  // بيع بطاقة
  else if (action === 'بيع' || action === 'sell') {
    const cardId = parseInt(args[1]);
    
    if (!cardId) {
      return conn.sendMessage(sender, { text: `❌ استخدم: \`.بطاقات بيع (رقم)\`\n\nمثال: \`.بطاقات بيع 1\`` }, { quoted: m });
    }
    
    const cardIndex = user.cards.findIndex((c, i) => i + 1 === cardId);
    
    if (cardIndex === -1) {
      return conn.sendMessage(sender, { text: '❌ رقم البطاقة غير صحيح!' }, { quoted: m });
    }
    
    const card = user.cards[cardIndex];
    const sellValue = card.value;
    
    user.coins += sellValue;
    
    if (card.count > 1) {
      card.count--;
    } else {
      user.cards.splice(cardIndex, 1);
    }
    
    await conn.sendMessage(sender, { text: `✅ *تم بيع البطاقة!*

🎴 ${card.name}
💰 حصلت على: ${sellValue} عملة
💎 رصيدك الجديد: ${user.coins} عملة` }, { quoted: m });
  }
  
  // القائمة
  else {
    await conn.sendMessage(sender, { text: `╭━━━━━━━━━━━━━━━━━━╮
┃  🃏 *نظام البطاقات* 🃏
╰━━━━━━━━━━━━━━━━━━╯

📋 *الأوامر المتاحة:*

\`.بطاقات سحب\`
↳ سحب بطاقة عشوائية (50 عملة)

\`.بطاقات مجموعتي\`
↳ عرض مجموعة بطاقاتك

\`.بطاقات بيع (رقم)\`
↳ بيع بطاقة من مجموعتك

🎴 *نسب السحب:*
🟢 عادي: 65%
🔵 نادر: 23%
🟣 ملحمي: 10%
🟡 أسطوري: 2%` }, { quoted: m });
  }
}

handler.help = ['بطاقات', 'cards'];
handler.tags = ['game'];
handler.command = /^(بطاقات|cards|كروت)$/i;

module.exports = handler;
