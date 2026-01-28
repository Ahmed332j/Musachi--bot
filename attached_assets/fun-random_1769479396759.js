// fun-random.js - ألعاب متنوعة ومجنونة

let handler = async (m, { conn, args, usedPrefix, participants }) => {
  let user = global.db.data.users[m.sender];
  if (!user.coins) user.coins = 1000;
  
  const action = args[0];
  
  // زر الحظ
  if (action === 'حظ' || action === 'luck') {
    const outcomes = [
      { type: 'جائزة', text: 'مبروك! 🎉', reward: 200, emoji: '💰' },
      { type: 'جائزة', text: 'فوز كبير! 🏆', reward: 500, emoji: '🎊' },
      { type: 'جائزة', text: 'محظوظ اليوم! ✨', reward: 300, emoji: '⭐' },
      { type: 'مصيبة', text: 'خسرت! 😭', loss: 100, emoji: '💸' },
      { type: 'مصيبة', text: 'حظ سيء! 😢', loss: 150, emoji: '📉' },
      { type: 'عادي', text: 'لا شيء! 😐', reward: 0, emoji: '🤷' },
      { type: 'مفاجأة', text: 'مفاجأة خاصة! 🎁', reward: 1000, emoji: '💎' }
    ];
    
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];
    
    let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  🎰 *زر الحظ* 🎰
╰━━━━━━━━━━━━━━━━━━╯

${result.emoji} ${result.text}\n\n`;
    
    if (result.reward) {
      user.coins += result.reward;
      message += `💰 +${result.reward} عملة`;
    } else if (result.loss) {
      user.coins -= result.loss;
      message += `💸 -${result.loss} عملة`;
    } else {
      message += `😐 لا ربح ولا خسارة`;
    }
    
    message += `\n\n💎 رصيدك: ${user.coins} عملة`;
    
    m.reply(message);
  }
  
  // نسبة الجنون
  else if (action === 'جنون' || action === 'crazy') {
    const percentage = Math.floor(Math.random() * 101);
    
    let status;
    if (percentage >= 90) status = '🤪 مجنون تماماً!';
    else if (percentage >= 70) status = '😜 جنون عالي!';
    else if (percentage >= 50) status = '😏 نصف مجنون';
    else if (percentage >= 30) status = '😊 عاقل نسبياً';
    else status = '😇 عاقل جداً';
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🤡 *نسبة الجنون* 🤡
╰━━━━━━━━━━━━━━━━━━╯

👤 @${m.sender.split('@')[0]}

🎭 نسبة الجنون: **${percentage}%**

${status}

${percentage > 80 ? '⚠️ خطر على المجتمع! 😂' : ''}`, null, { mentions: [m.sender] });
  }
  
  // مزاج القروب
  else if (action === 'مزاج' || action === 'mood') {
    if (!m.isGroup) return m.reply('❌ هذا الأمر للقروبات فقط!');
    
    const moods = [
      { mood: '😄 مبسوطين ومرحين', emoji: '🎉' },
      { mood: '😴 كسالى اليوم', emoji: '💤' },
      { mood: '🔥 طاقة عالية!', emoji: '⚡' },
      { mood: '😐 عاديين', emoji: '🤷' },
      { mood: '🤔 مفكرين', emoji: '💭' },
      { mood: '😂 ضحك وفرفشة', emoji: '🤣' },
      { mood: '🎮 جو ألعاب', emoji: '🕹️' },
      { mood: '📚 جو دراسة', emoji: '✍️' }
    ];
    
    const todayMood = moods[Math.floor(Math.random() * moods.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  ${todayMood.emoji} *مزاج القروب* ${todayMood.emoji}
╰━━━━━━━━━━━━━━━━━━╯

📊 بعد تحليل آخر الرسائل...

المزاج اليوم: **${todayMood.mood}**

💡 هل توافقون؟ 😄`);
  }
  
  // تنبؤ اليوم
  else if (action === 'تنبؤ' || action === 'fortune') {
    const fortunes = [
      '✨ يوم رائع ينتظرك!',
      '💰 حظ مالي جيد اليوم',
      '❤️ مفاجأة سعيدة قريباً',
      '⚠️ احذر من الطعام الحار!',
      '🎮 يوم مثالي للألعاب',
      '📱 رسالة مهمة ستصلك',
      '🌟 فرصة ذهبية اليوم',
      '😴 خذ قسط من الراحة',
      '🤝 ستقابل شخص مميز',
      '🎁 هدية غير متوقعة'
    ];
    
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const luckyNumber = Math.floor(Math.random() * 100) + 1;
    const luckyColor = ['أحمر', 'أزرق', 'أخضر', 'أصفر', 'بنفسجي'][Math.floor(Math.random() * 5)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🔮 *تنبؤ اليوم* 🔮
╰━━━━━━━━━━━━━━━━━━╯

👤 @${m.sender.split('@')[0]}

${fortune}

🎲 رقم الحظ: **${luckyNumber}**
🎨 لون الحظ: **${luckyColor}**

✨ بالتوفيق! 🍀`, null, { mentions: [m.sender] });
  }
  
  // وش صار لو
  else if (action === 'لو' || action === 'whatif') {
    const scenarios = [
      'وش صار لو الواتساب اختفى يوم؟',
      'وش صار لو تقدر تطير؟',
      'وش صار لو تقدر تقرأ الأفكار؟',
      'وش صار لو الحيوانات تتكلم؟',
      'وش صار لو الإنترنت توقف أسبوع؟',
      'وش صار لو تقدر ترجع بالزمن؟',
      'وش صار لو العالم بلا نقود؟',
      'وش صار لو النوم مش ضروري؟',
      'وش صار لو تقدر تتحول لحيوان؟',
      'وش صار لو الألعاب صارت حقيقة؟'
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🤔 *وش صار لو...* 🤔
╰━━━━━━━━━━━━━━━━━━╯

${scenario}

💭 شاركنا رأيك!
🎤 شو بتسوي؟

أحلى جواب يفوز بـ 100 عملة! 💰`);
  }
  
  // اسمك بالقروب
  else if (action === 'لقب' || action === 'nickname') {
    const nicknames = [
      'المهيب 👑',
      'الأسطورة 🔥',
      'الغامض 🌙',
      'المجنون 🤪',
      'العبقري 🧠',
      'الكسول 😴',
      'المرح 😂',
      'الصامت 🤐',
      'المزعج 📢',
      'الطيب 😇',
      'الشرير 😈',
      'النشيط ⚡',
      'الغريب 👽',
      'الملك 🦁',
      'الأمير 🤴'
    ];
    
    const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  👤 *لقبك الجديد* 👤
╰━━━━━━━━━━━━━━━━━━╯

@${m.sender.split('@')[0]}

من اليوم اسمك:
**${nickname}**

😂 يناسبك؟`, null, { mentions: [m.sender] });
  }
  
  // حظك اليوم
  else if (action === 'حظك' || action === 'daily-luck') {
    const percentage = Math.floor(Math.random() * 101);
    
    let analysis;
    if (percentage >= 90) analysis = '🌟 حظ رائع! اليوم يومك!';
    else if (percentage >= 70) analysis = '😊 حظ جيد جداً!';
    else if (percentage >= 50) analysis = '👍 حظ عادي';
    else if (percentage >= 30) analysis = '😐 حظ ضعيف';
    else analysis = '😢 حظ سيء، احذر!';
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🍀 *حظك اليوم* 🍀
╰━━━━━━━━━━━━━━━━━━╯

👤 @${m.sender.split('@')[0]}

🎲 نسبة الحظ: **${percentage}%**

${analysis}

💡 ${percentage > 50 ? 'جرب حظك في الألعاب! 🎮' : 'اليوم استرخي! 😌'}`, null, { mentions: [m.sender] });
  }
  
  // اختبار ردة الفعل
  else if (action === 'رد-فعل' || action === 'reaction') {
    const delay = Math.floor(Math.random() * 5000) + 2000; // 2-7 ثواني
    
    m.reply('🎯 استعد...\n\nسأرسل إشارة قريباً...');
    
    setTimeout(() => {
      if (!global.activeGames) global.activeGames = {};
      global.activeGames[m.chat] = {
        type: 'reaction',
        startTime: Date.now(),
        asker: m.sender
      };
      
      m.reply('⚡ **الآن! اكتب "الآن"**');
      
      setTimeout(() => {
        if (global.activeGames[m.chat]?.type === 'reaction') {
          delete global.activeGames[m.chat];
          m.reply('⏰ فات الأوان! لم يتفاعل أحد.');
        }
      }, 5000);
    }, delay);
  }
  
  // القائمة
  else {
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎪 *ألعاب متنوعة* 🎪
╰━━━━━━━━━━━━━━━━━━╯

📋 *الأوامر:*

\`${usedPrefix}مزيد حظ\`
↳ 🎰 زر الحظ (جائزة أو خسارة)

\`${usedPrefix}مزيد جنون\`
↳ 🤡 نسبة الجنون

\`${usedPrefix}مزيد مزاج\`
↳ 😄 مزاج القروب (قروبات فقط)

\`${usedPrefix}مزيد تنبؤ\`
↳ 🔮 تنبؤ اليوم

\`${usedPrefix}مزيد لو\`
↳ 🤔 وش صار لو...

\`${usedPrefix}مزيد لقب\`
↳ 👤 لقب عشوائي

\`${usedPrefix}مزيد حظك\`
↳ 🍀 حظك اليوم

\`${usedPrefix}مزيد رد-فعل\`
↳ ⚡ اختبار ردة الفعل

💡 *ألعاب مجنونة ومسلية!* 🎉`);
  }
}

// معالجة اختبار ردة الفعل
export async function before(m) {
  if (!global.activeGames || !global.activeGames[m.chat]) return;
  
  const game = global.activeGames[m.chat];
  
  if (game.type === 'reaction') {
    const userText = m.text?.toLowerCase().trim();
    
    if (userText === 'الآن' || userText === 'now') {
      const reactionTime = Date.now() - game.startTime;
      const timeInSeconds = (reactionTime / 1000).toFixed(3);
      
      let user = global.db.data.users[m.sender];
      const reward = Math.max(50, Math.floor(300 - (reactionTime / 10)));
      user.coins += reward;
      
      m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  ⚡ *رد فعل خارق!* ⚡
╰━━━━━━━━━━━━━━━━━━╯

👤 @${m.sender.split('@')[0]}
⏱️ الوقت: ${timeInSeconds} ثانية

💰 الجائزة: +${reward} عملة

${reactionTime < 500 ? '🏆 سرعة خارقة!' : reactionTime < 1000 ? '👍 سريع جداً!' : '😊 جيد!'}`, null, { mentions: [m.sender] });
      
      delete global.activeGames[m.chat];
      return true;
    }
  }
}

handler.help = ['مزيد'];
handler.tags = ['fun'];
handler.command = /^(مزيد|random-fun|متنوع)$/i;

export default handler;