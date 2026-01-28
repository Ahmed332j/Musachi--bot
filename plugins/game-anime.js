// game-anime.js - نظام معلومات الأنمي
const axios = require('axios');

module.exports = {
  command: /^(انمي|أنمي|anime)$/i,
  handler: async (msgData) => {
    const { conn, m, args, sender, usedPrefix } = msgData;
    const action = args[0];
    
    try {
      const animeFacts = ["غوجو يمتلك قوة اللانهاية", "إيتاتشي كان يحمي كونوها", "لوفي استخدم الجير 5 ضد كايدو"];
      
      if (!action) {
        return conn.sendMessage(sender, { text: `🎭 *أوامر الأنمي*\n\n.انمي معلومة\n.انمي اقتباس\n.انمي بحث (اسم)` }, { quoted: m });
      }
      
      if (action === 'معلومة' || action === 'fact') {
        const fact = animeFacts[Math.floor(Math.random() * animeFacts.length)];
        await conn.sendMessage(sender, { text: `🧠 *معلومة:* ${fact}` }, { quoted: m });
      } else if (action === 'بحث' || action === 'search') {
        const animeName = args.slice(1).join(' ');
        if (!animeName) return m.reply('اكتب اسم الأنمي!');
        const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(animeName)}&limit=1`);
        const anime = res.data.data[0];
        if (!anime) return m.reply('لم أجد الأنمي!');
        await conn.sendMessage(sender, { text: `🎬 *${anime.title}*\n⭐ التقييم: ${anime.score}` }, { quoted: m });
      }
    } catch (e) { m.reply('❌ خطأ!'); }
  }
};
