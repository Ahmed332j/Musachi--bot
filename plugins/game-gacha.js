// game-gacha.js - نظام الجاتشا
module.exports = async (msgData) => {
  const { conn, m, sender, prefix } = msgData;
  if (!global.db.data.users) global.db.data.users = {};
  if (!global.db.data.users[sender]) global.db.data.users[sender] = {};
  
  let user = global.db.data.users[sender];
  if (!user.characters) user.characters = [];
  if (!user.coins) user.coins = 500;

  const cost = 100;
  if (user.coins < cost) {
    return conn.sendMessage(sender, { text: `❌ لا تملك عملات كافية (${cost})` }, { quoted: m });
  }

  user.coins -= cost;
  const character = { name: "مقاتل عشوائي", rarity: "🟢 عادي", power: 50 };
  user.characters.push(character);

  await conn.sendMessage(sender, { react: { text: '🎰', key: m.key } });
  await conn.sendMessage(sender, { text: `🎰 حصلت على: ${character.name}\n💰 المتبقي: ${user.coins}` }, { quoted: m });
};

module.exports.command = /^(جاتشا|gacha|سحب|pull)$/i;
