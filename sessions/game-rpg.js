// game-rpg.js
module.exports = {
  command: /^(rpg|ار بي جي|اربيجي)$/i,
  handler: async (msgData) => {
    const { conn, m, args, sender, usedPrefix } = msgData;
    if (!global.db.data.users[sender]) global.db.data.users[sender] = { coins: 500, level: 1, xp: 0 };
    let user = global.db.data.users[sender];
    
    const action = args[0];
    const xpNeeded = (user.level || 1) * 100;

    if (action === 'رقي' || action === 'levelup') {
      if ((user.xp || 0) < xpNeeded) return m.reply(`❌ ينقصك ${xpNeeded - (user.xp || 0)} XP للارتقاء!`);
      user.level = (user.level || 1) + 1;
      user.xp -= xpNeeded;
      user.coins = (user.coins || 0) + (user.level * 50);
      return m.reply(`🎉 مبروك! ارتقيت للمستوى ${user.level}`);
    }

    let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  ⚔️ *نظام RPG* ⚔️
╰━━━━━━━━━━━━━━━━━━╯
⭐ المستوى: ${user.level}
✨ الخبرة: ${user.xp}/${xpNeeded}
💰 العملات: ${user.coins}

💡 استخدم \`${usedPrefix}rpg رقي\` عند اكتمال الخبرة!`;
    await conn.sendMessage(sender, { text: message }, { quoted: m });
  }
};
