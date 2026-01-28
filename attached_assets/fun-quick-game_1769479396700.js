// fun-quick-games.js - ألعاب خفيفة وسريعة

const trueFalseQuestions = [
  { q: "الشمس تشرق من الغرب", a: false },
  { q: "القطط تكره الماء", a: true },
  { q: "ناروتو أصبح هوكاجي", a: true },
  { q: "الأرض مسطحة", a: false },
  { q: "البطريق طائر", a: false },
  { q: "الماء يغلي عند 100 درجة", a: true },
  { q: "لوفي أكل فاكهة الشيطان", a: true },
  { q: "النمل ينام", a: false },
  { q: "الفيل يخاف من الفأر", a: true },
  { q: "غوجو ساتورو أقوى شخصية في جوجوتسو كايسن", a: true }
];

const whoAmI = [
  { hints: ["أكل فاكهة الشيطان", "قبعة قش", "ملك القراصنة"], answer: "لوفي" },
  { hints: ["عيون زرقاء", "تقنية اللانهاية", "أقوى الساحرين"], answer: "غوجو" },
  { hints: ["قتل عشيرته", "شارينغان", "أخ ساسكي"], answer: "إيتاتشي" },
  { hints: ["صلع", "ضربة واحدة", "بطل بالهواية"], answer: "سايتاما" },
  { hints: ["نينجا", "هوكاجي", "راسينغان"], answer: "ناروتو" },
  { hints: ["صياد", "لاعب من رتبة S", "جيش الظل"], answer: "سونغ جين وو" }
];

const riddles = [
  { q: "ما هو الشيء الذي له رأس ولا له عين؟", a: "دبوس" },
  { q: "ما هو الشيء الذي يمشي بلا رجلين ويبكي بلا عينين؟", a: "السحاب" },
  { q: "ما هو الشيء الذي كلما زاد نقص؟", a: "العمر" },
  { q: "أنا في السماء، وإن وقعت في الماء مت. من أنا؟", a: "النار" },
  { q: "له عين ولا يرى؟", a: "الإبرة" }
];

const completePhrase = [
  { q: "اللي اختشوا...", a: "ماتوا" },
  { q: "الطيور على أشكالها...", a: "تقع" },
  { q: "إذا كان الكلام من فضة...", a: "فالسكوت من ذهب" },
  { q: "العين بصيرة...", a: "واليد قصيرة" },
  { q: "من جدّ...", a: "وجد" }
];

let handler = async (m, { conn, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  if (!user.coins) user.coins = 1000;
  if (!user.gameStats) user.gameStats = { wins: 0, losses: 0 };
  
  const action = args[0];
  
  // صح ولا غلط
  if (action === 'صح-غلط' || action === 'true-false') {
    const question = trueFalseQuestions[Math.floor(Math.random() * trueFalseQuestions.length)];
    
    // حفظ السؤال الحالي
    if (!global.activeGames) global.activeGames = {};
    global.activeGames[m.chat] = {
      type: 'truefalse',
      answer: question.a,
      asker: m.sender,
      time: Date.now()
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🤔 *صح ولا غلط؟* 🤔
╰━━━━━━━━━━━━━━━━━━╯

${question.q}

رد بـ: *صح* أو *غلط*
⏱️ عندك 30 ثانية!

💰 الجائزة: 50 عملة`);
    
    // حذف السؤال بعد 30 ثانية
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'truefalse') {
        delete global.activeGames[m.chat];
        m.reply('⏰ انتهى الوقت! لم يجب أحد.');
      }
    }, 30000);
  }
  
  // مين أنا؟
  else if (action === 'مين-انا' || action === 'whoami') {
    const character = whoAmI[Math.floor(Math.random() * whoAmI.length)];
    
    global.activeGames[m.chat] = {
      type: 'whoami',
      answer: character.answer.toLowerCase(),
      hints: character.hints,
      currentHint: 0,
      asker: m.sender,
      time: Date.now()
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🕵️ *مين أنا؟* 🕵️
╰━━━━━━━━━━━━━━━━━━╯

💡 التلميح الأول:
"${character.hints[0]}"

خمّن الشخصية! 🎯
💰 الجائزة: 100 عملة

اكتب \`${usedPrefix}العاب-سريعة تلميح\` لتلميح إضافي (-20 عملة)`);
  }
  
  // تلميح إضافي
  else if (action === 'تلميح' || action === 'hint') {
    const game = global.activeGames?.[m.chat];
    
    if (!game || game.type !== 'whoami') {
      return m.reply('❌ لا يوجد لعبة "مين أنا" نشطة!');
    }
    
    if (game.currentHint >= game.hints.length - 1) {
      return m.reply('❌ لا توجد تلميحات إضافية!');
    }
    
    game.currentHint++;
    
    m.reply(`💡 *تلميح ${game.currentHint + 1}:*
"${game.hints[game.currentHint]}"

🎯 استمر في التخمين!`);
  }
  
  // لغز اليوم
  else if (action === 'لغز' || action === 'riddle') {
    const riddle = riddles[Math.floor(Math.random() * riddles.length)];
    
    global.activeGames[m.chat] = {
      type: 'riddle',
      answer: riddle.a.toLowerCase(),
      asker: m.sender,
      time: Date.now()
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🧩 *لغز اليوم* 🧩
╰━━━━━━━━━━━━━━━━━━╯

${riddle.q}

🤔 ما الحل؟
⏱️ عندك دقيقة!
💰 الجائزة: 80 عملة`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'riddle') {
        const answer = global.activeGames[m.chat].answer;
        delete global.activeGames[m.chat];
        m.reply(`⏰ انتهى الوقت!\n\n💡 الجواب كان: *${answer}*`);
      }
    }, 60000);
  }
  
  // كمل الجملة
  else if (action === 'كمل' || action === 'complete') {
    const phrase = completePhrase[Math.floor(Math.random() * completePhrase.length)];
    
    global.activeGames[m.chat] = {
      type: 'complete',
      answer: phrase.a.toLowerCase(),
      asker: m.sender,
      time: Date.now()
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  📝 *كمل الجملة* 📝
╰━━━━━━━━━━━━━━━━━━╯

${phrase.q}

✍️ أكمل المثل!
💰 الجائزة: 60 عملة`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'complete') {
        const answer = global.activeGames[m.chat].answer;
        delete global.activeGames[m.chat];
        m.reply(`⏰ انتهى الوقت!\n\n📝 الجواب: *${answer}*`);
      }
    }, 45000);
  }
  
  // القائمة
  else {
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎮 *ألعاب سريعة* 🎮
╰━━━━━━━━━━━━━━━━━━╯

📋 *الأوامر:*

\`${usedPrefix}العاب-سريعة صح-غلط\`
↳ 🤔 صح ولا غلط؟ (50 عملة)

\`${usedPrefix}العاب-سريعة مين-انا\`
↳ 🕵️ خمّن الشخصية (100 عملة)

\`${usedPrefix}العاب-سريعة لغز\`
↳ 🧩 حل اللغز (80 عملة)

\`${usedPrefix}العاب-سريعة كمل\`
↳ 📝 كمل المثل (60 عملة)

💡 *طريقة اللعب:*
• البوت يطرح السؤال
• أول من يجيب صح يفوز
• اجمع النقاط واتصدر!

🏆 انتصاراتك: ${user.gameStats.wins || 0}`);
  }
}

// التحقق من الإجابات في الرسائل العادية
export async function before(m) {
  if (!global.activeGames || !global.activeGames[m.chat]) return;
  
  const game = global.activeGames[m.chat];
  const userAnswer = m.text?.toLowerCase().trim();
  
  if (!userAnswer) return;
  
  let isCorrect = false;
  let reward = 0;
  
  // صح ولا غلط
  if (game.type === 'truefalse') {
    const correctAnswer = game.answer ? 'صح' : 'غلط';
    if (userAnswer === 'صح' || userAnswer === 'غلط' || userAnswer === 'true' || userAnswer === 'false') {
      const userBool = (userAnswer === 'صح' || userAnswer === 'true');
      isCorrect = userBool === game.answer;
      reward = 50;
    }
  }
  
  // مين أنا
  else if (game.type === 'whoami') {
    if (userAnswer === game.answer) {
      isCorrect = true;
      reward = 100 - (game.currentHint * 20);
    }
  }
  
  // اللغز
  else if (game.type === 'riddle') {
    if (userAnswer.includes(game.answer) || game.answer.includes(userAnswer)) {
      isCorrect = true;
      reward = 80;
    }
  }
  
  // كمل الجملة
  else if (game.type === 'complete') {
    if (userAnswer.includes(game.answer) || game.answer.includes(userAnswer)) {
      isCorrect = true;
      reward = 60;
    }
  }
  
  if (isCorrect) {
    let user = global.db.data.users[m.sender];
    user.coins += reward;
    if (!user.gameStats) user.gameStats = { wins: 0, losses: 0 };
    user.gameStats.wins++;
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎉 *إجابة صحيحة!* 🎉
╰━━━━━━━━━━━━━━━━━━╯

👤 الفائز: @${m.sender.split('@')[0]}
💰 الجائزة: +${reward} عملة
🏆 انتصاراتك: ${user.gameStats.wins}

💎 رصيدك الجديد: ${user.coins} عملة`, null, { mentions: [m.sender] });
    
    delete global.activeGames[m.chat];
    return true;
  }
}

handler.help = ['العاب-سريعة'];
handler.tags = ['game'];
handler.command = /^(العاب-سريعة|العاب_سريعة|quick-games)$/i;

export default handler;