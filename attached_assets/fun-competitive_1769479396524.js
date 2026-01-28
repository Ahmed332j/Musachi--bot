// fun-competitive.js - ألعاب تنافسية

const speedWords = ['سريع', 'ضوء', 'نار', 'ماء', 'سماء', 'أرض', 'قمر', 'شمس', 'نجم', 'بحر'];

const emojiPuzzles = [
  { emoji: '🍕🇮🇹', answer: 'بيتزا' },
  { emoji: '☕😴', answer: 'قهوة' },
  { emoji: '🎮👾', answer: 'ألعاب' },
  { emoji: '📱💬', answer: 'واتساب' },
  { emoji: '⚽🏆', answer: 'كرة قدم' },
  { emoji: '🎬🍿', answer: 'سينما' },
  { emoji: '📚✏️', answer: 'دراسة' },
  { emoji: '🌙⭐', answer: 'ليل' },
  { emoji: '☀️🌡️', answer: 'صيف' },
  { emoji: '❄️⛄', answer: 'شتاء' }
];

const scrambledWords = [
  { scrambled: 'رتاموك', answer: 'كومبيوتر' },
  { scrambled: 'نوفزيلت', answer: 'تلفزيون' },
  { scrambled: 'ساوتاب', answer: 'واتساب' },
  { scrambled: 'ريمكا', answer: 'كاميرا' },
  { scrambled: 'توينرنت', answer: 'إنترنت' },
  { scrambled: 'لومبيا', answer: 'موبايل' },
  { scrambled: 'شاشة', answer: 'شاشة' },
  { scrambled: 'برناجم', answer: 'برنامج' }
];

let handler = async (m, { conn, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  if (!user.coins) user.coins = 1000;
  if (!user.competitivePoints) user.competitivePoints = 0;
  
  const action = args[0];
  
  // تحدي السرعة
  if (action === 'سرعة' || action === 'speed') {
    const word = speedWords[Math.floor(Math.random() * speedWords.length)];
    
    if (!global.activeGames) global.activeGames = {};
    global.activeGames[m.chat] = {
      type: 'speed',
      answer: word,
      startTime: Date.now(),
      asker: m.sender
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  ⚡ *تحدي السرعة!* ⚡
╰━━━━━━━━━━━━━━━━━━╯

🎯 اكتب الكلمة التالية بأسرع وقت:

📝 *${word}*

⏱️ الوقت يبدأ الآن!
🏆 أول من يكتبها يفوز بـ 100 عملة!`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'speed') {
        delete global.activeGames[m.chat];
        m.reply('⏰ انتهى الوقت! لم يكتبها أحد في 30 ثانية.');
      }
    }, 30000);
  }
  
  // حرب الإيموجيز
  else if (action === 'ايموجي' || action === 'emoji') {
    const puzzle = emojiPuzzles[Math.floor(Math.random() * emojiPuzzles.length)];
    
    global.activeGames[m.chat] = {
      type: 'emoji',
      answer: puzzle.answer.toLowerCase(),
      startTime: Date.now(),
      asker: m.sender
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  😂🔥 *حرب الإيموجيز* 🔥😂
╰━━━━━━━━━━━━━━━━━━╯

🤔 شو معنى هالإيموجيز؟

${puzzle.emoji}

💡 خمّن المعنى!
💰 الجائزة: 80 عملة`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'emoji') {
        const answer = global.activeGames[m.chat].answer;
        delete global.activeGames[m.chat];
        m.reply(`⏰ انتهى الوقت!\n\n💡 الجواب: *${answer}*`);
      }
    }, 45000);
  }
  
  // ترتيب الكلمات
  else if (action === 'ترتيب' || action === 'unscramble') {
    const word = scrambledWords[Math.floor(Math.random() * scrambledWords.length)];
    
    global.activeGames[m.chat] = {
      type: 'unscramble',
      answer: word.answer.toLowerCase(),
      startTime: Date.now(),
      asker: m.sender
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🔤 *ترتيب الكلمات* 🔤
╰━━━━━━━━━━━━━━━━━━╯

📝 الكلمة المخربطة:
*${word.scrambled}*

🎯 رتّبها صح!
💰 الجائزة: 70 عملة`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'unscramble') {
        const answer = global.activeGames[m.chat].answer;
        delete global.activeGames[m.chat];
        m.reply(`⏰ انتهى الوقت!\n\n✅ الكلمة الصحيحة: *${answer}*`);
      }
    }, 40000);
  }
  
  // سؤال وجواب بنقاط
  else if (action === 'سؤال' || action === 'quiz') {
    const questions = [
      { q: 'كم عدد الكواكب في النظام الشمسي؟', a: '8' },
      { q: 'ما هي عاصمة فرنسا؟', a: 'باريس' },
      { q: 'من هو أسرع حيوان في العالم؟', a: 'الفهد' },
      { q: 'كم عدد قارات العالم؟', a: '7' },
      { q: 'ما هو أكبر محيط في العالم؟', a: 'الهادي' },
      { q: 'من هو مخترع المصباح الكهربائي؟', a: 'إديسون' },
      { q: 'كم عدد أيام السنة؟', a: '365' },
      { q: 'ما هي أكبر دولة في العالم؟', a: 'روسيا' }
    ];
    
    const question = questions[Math.floor(Math.random() * questions.length)];
    
    global.activeGames[m.chat] = {
      type: 'quiz',
      answer: question.a.toLowerCase(),
      startTime: Date.now(),
      asker: m.sender
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  ❓ *سؤال وجواب* ❓
╰━━━━━━━━━━━━━━━━━━╯

${question.q}

🎯 أجب بسرعة!
💰 الجائزة: 90 عملة
🏆 نقاط تنافسية: +5`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'quiz') {
        const answer = global.activeGames[m.chat].answer;
        delete global.activeGames[m.chat];
        m.reply(`⏰ انتهى الوقت!\n\n📚 الجواب: *${answer}*`);
      }
    }, 35000);
  }
  
  // عرض الليدر بورد
  else if (action === 'متصدرين' || action === 'leaderboard') {
    const allUsers = Object.entries(global.db.data.users)
      .filter(([_, user]) => user.competitivePoints > 0)
      .sort((a, b) => b[1].competitivePoints - a[1].competitivePoints)
      .slice(0, 10);
    
    if (allUsers.length === 0) {
      return m.reply('📊 لا يوجد متصدرين بعد!\n\nالعب وكن أول المتصدرين! 🏆');
    }
    
    let leaderboard = `╭━━━━━━━━━━━━━━━━━━╮
┃  🏆 *المتصدرين* 🏆
╰━━━━━━━━━━━━━━━━━━╯\n\n`;
    
    allUsers.forEach(([jid, user], i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      leaderboard += `${medal} @${jid.split('@')[0]}\n   📊 ${user.competitivePoints} نقطة\n\n`;
    });
    
    leaderboard += `━━━━━━━━━━━━━━━━━━\n📍 ترتيبك: #${allUsers.findIndex(([jid]) => jid === m.sender) + 1}\n🎯 نقاطك: ${user.competitivePoints}`;
    
    m.reply(leaderboard, null, { mentions: allUsers.map(([jid]) => jid) });
  }
  
  // القائمة
  else {
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🏆 *ألعاب تنافسية* 🏆
╰━━━━━━━━━━━━━━━━━━╯

📋 *الأوامر:*

\`${usedPrefix}تنافس سرعة\`
↳ ⚡ تحدي السرعة (100 عملة)

\`${usedPrefix}تنافس ايموجي\`
↳ 😂 حرب الإيموجيز (80 عملة)

\`${usedPrefix}تنافس ترتيب\`
↳ 🔤 ترتيب الكلمات (70 عملة)

\`${usedPrefix}تنافس سؤال\`
↳ ❓ سؤال وجواب (90 عملة + 5 نقاط)

\`${usedPrefix}تنافس متصدرين\`
↳ 🏆 عرض المتصدرين

━━━━━━━━━━━━━━━━━━
🎯 نقاطك: ${user.competitivePoints}
💰 رصيدك: ${user.coins} عملة`);
  }
}

// التحقق من الإجابات
export async function before(m) {
  if (!global.activeGames || !global.activeGames[m.chat]) return;
  
  const game = global.activeGames[m.chat];
  const userAnswer = m.text?.toLowerCase().trim();
  
  if (!userAnswer) return;
  
  let isCorrect = false;
  let reward = 0;
  let points = 0;
  
  if (game.type === 'speed' && userAnswer === game.answer) {
    isCorrect = true;
    reward = 100;
    points = 3;
  } else if (game.type === 'emoji' && userAnswer === game.answer) {
    isCorrect = true;
    reward = 80;
    points = 2;
  } else if (game.type === 'unscramble' && userAnswer === game.answer) {
    isCorrect = true;
    reward = 70;
    points = 2;
  } else if (game.type === 'quiz' && userAnswer === game.answer) {
    isCorrect = true;
    reward = 90;
    points = 5;
  }
  
  if (isCorrect) {
    let user = global.db.data.users[m.sender];
    user.coins += reward;
    user.competitivePoints = (user.competitivePoints || 0) + points;
    
    const timeTaken = ((Date.now() - game.startTime) / 1000).toFixed(2);
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎊 *فوز رائع!* 🎊
╰━━━━━━━━━━━━━━━━━━╯

👤 الفائز: @${m.sender.split('@')[0]}
⏱️ الوقت: ${timeTaken} ثانية
💰 الجائزة: +${reward} عملة
🏆 النقاط: +${points}

━━━━━━━━━━━━━━━━━━
🎯 نقاطك الكلية: ${user.competitivePoints}
💎 رصيدك: ${user.coins} عملة`, null, { mentions: [m.sender] });
    
    delete global.activeGames[m.chat];
    return true;
  }
}

handler.help = ['تنافس'];
handler.tags = ['game'];
handler.command = /^(تنافس|competitive)$/i;

export default handler;