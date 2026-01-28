// fun-brain-games.js - ألعاب ذكاء

let handler = async (m, { conn, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  if (!user.coins) user.coins = 1000;
  if (!user.iqPoints) user.iqPoints = 0;
  
  const action = args[0];
  
  // رياضيات سريعة
  if (action === 'رياضيات' || action === 'math') {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    const operations = ['+', '-', '×'];
    const op = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    let question;
    
    if (op === '+') {
      answer = num1 + num2;
      question = `${num1} + ${num2}`;
    } else if (op === '-') {
      answer = num1 > num2 ? num1 - num2 : num2 - num1;
      question = num1 > num2 ? `${num1} - ${num2}` : `${num2} - ${num1}`;
    } else {
      answer = num1 * num2;
      question = `${num1} × ${num2}`;
    }
    
    if (!global.activeGames) global.activeGames = {};
    global.activeGames[m.chat] = {
      type: 'math',
      answer: answer.toString(),
      startTime: Date.now(),
      asker: m.sender
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
    ┃  🧮 *رياضيات سريعة* 🧮
    ╰━━━━━━━━━━━━━━━━━━╯
    
    ❓ كم يساوي:
    
    **${question} = ؟**
    
    ⏱️ بلا آلة حاسبة! 😏
    💰 الجائزة: 120 عملة
    🧠 نقاط ذكاء: +10`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'math') {
        const answer = global.activeGames[m.chat].answer;
        delete global.activeGames[m.chat];
        m.reply(`⏰ انتهى الوقت!\n\n✅ الجواب: **${answer}**`);
      }
    }, 30000);
  }
  
  // لعبة الذاكرة
  else if (action === 'ذاكرة' || action === 'memory') {
    const words = ['تفاح', 'كتاب', 'سيارة', 'شمس', 'قلم', 'باب', 'نافذة', 'هاتف'];
    const selectedWords = [];
    
    for (let i = 0; i < 5; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      if (!selectedWords.includes(randomWord)) {
        selectedWords.push(randomWord);
      } else {
        i--;
      }
    }
    
    global.activeGames[m.chat] = {
      type: 'memory',
      words: selectedWords,
      asker: m.sender,
      startTime: Date.now()
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
    ┃  🧠 *اختبار الذاكرة* 🧠
    ╰━━━━━━━━━━━━━━━━━━╯
    
    📝 احفظ هذه الكلمات:
    
    **${selectedWords.join(' • ')}**
    
    ⏱️ عندك دقيقة لحفظها!
    بعدها سأخفيها وأسألك...`);
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'memory') {
        m.reply(`❓ الآن اكتب الكلمات التي حفظتها!
        
        ✍️ اكتبها مفصولة بمسافات
        ⏱️ عندك 30 ثانية!
        
        مثال: كلمة1 كلمة2 كلمة3`);
        
        global.activeGames[m.chat].phase = 'answer';
        
        setTimeout(() => {
          if (global.activeGames[m.chat]?.type === 'memory') {
            delete global.activeGames[m.chat];
            m.reply('⏰ انتهى وقت الإجابة!');
          }
        }, 30000);
      }
    }, 60000);
  }
  
  // اختبار شخصية
  else if (action === 'شخصية' || action === 'personality') {
    const personalities = [
      { type: 'ناروتو', desc: 'متفائل، مثابر، لا تستسلم أبداً! 🔥' },
      { type: 'ساسكي', desc: 'هادئ، قوي، تحب أن تكون الأفضل 🗡️' },
      { type: 'لوفي', desc: 'مرح، مغامر، تحب الحرية! ⛵' },
      { type: 'غوجو', desc: 'واثق، قوي، مرح ومهيب! 😎' },
      { type: 'سونغ جين وو', desc: 'صامت، استراتيجي، تتطور باستمرار! 👤' },
      { type: 'إرين', desc: 'شجاع، مصمم، تدافع عن الحرية! ⚔️' },
      { type: 'ليفاي', desc: 'منضبط، قوي، قائد بالفطرة! 🎖️' },
      { type: 'تانجيرو', desc: 'طيب، مخلص، تحمي من تحب! 🌸' }
    ];
    
    const result = personalities[Math.floor(Math.random() * personalities.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
    ┃  🎭 *اختبار الشخصية* 🎭
    ╰━━━━━━━━━━━━━━━━━━╯
    
    🔮 لو كنت شخصية أنمي...
    
    أنت: **${result.type}!**
    
    📝 الوصف:
    ${result.desc}
    
    ✨ هل يناسبك؟ 😄`);
  }
  
  // سؤال بلا جواب
  else if (action === 'سؤال-مفتوح' || action === 'open') {
    const questions = [
      'لو كان عندك قوة خارقة ليوم واحد، شو بتسوي؟',
      'لو قدرت تسافر بالزمن، وين بتروح؟',
      'لو العالم ينتهي بكرة، شو آخر شي بتعمله؟',
      'لو قدرت تقابل أي شخص ميت، مين بتختار؟',
      'لو كنت بطل أنمي، شو بتكون قصتك؟',
      'لو قدرت تغير شي واحد في العالم، شو بيكون؟',
      'لو كان عندك مليون دولار، شو أول شي بتشتريه؟'
    ];
    
    const q = questions[Math.floor(Math.random() * questions.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
    ┃  💭 *سؤال مفتوح* 💭
    ╰━━━━━━━━━━━━━━━━━━╯
    
    ${q}
    
    🎤 شاركنا رأيك!
    💡 لا يوجد جواب خاطئ
    🏆 أحلى جواب يفوز بـ 150 عملة!
    
    ✍️ اكتب جوابك الآن...`);
  }
  
  // عد بدون غلط
  else if (action === 'عد' || action === 'count') {
    if (!global.groupCounting) global.groupCounting = {};
    
    global.groupCounting[m.chat] = {
      current: 0,
      lastUser: null,
      startTime: Date.now()
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
    ┃  🔢 *عد بدون غلط* 🔢
    ╰━━━━━━━━━━━━━━━━━━╯
    
    🎯 لعبة جماعية!
    
    📋 القواعد:
    • كل واحد يكتب رقم بالترتيب
    • ممنوع نفس الشخص يعد مرتين متتالية
    • أي غلط = نرجع للصفر! 😭
    
    🚀 ابدأوا من 1...
    
    💰 كل 10 أرقام = 50 عملة لآخر شخص!`);
  }
  
  // عرض نقاط الذكاء
  else if (action === 'ذكائي' || action === 'iq') {
    const allUsers = Object.entries(global.db.data.users)
      .filter(([_, user]) => user.iqPoints > 0)
      .sort((a, b) => b[1].iqPoints - a[1].iqPoints)
      .slice(0, 10);
    
    const myRank = allUsers.findIndex(([jid]) => jid === m.sender) + 1;
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
    ┃  🧠 *نقاط ذكائك* 🧠
    ╰━━━━━━━━━━━━━━━━━━╯
    
    👤 @${m.sender.split('@')[0]}
    
    🎯 نقاط الذكاء: **${user.iqPoints || 0}**
    📊 ترتيبك: **#${myRank || 'غير مصنف'}**
    
    💡 اكسب نقاط من:
    • رياضيات سريعة (+10)
    • اختبار الذاكرة (+15)
    • الأسئلة المفتوحة (+20)
    
    🏆 تصدر القائمة واثبت ذكائك!`, null, { mentions: [m.sender] });
  }
  
  // القائمة
  else {
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
    ┃  🧠 *ألعاب الذكاء* 🧠
    ╰━━━━━━━━━━━━━━━━━━╯
    
    📋 *الأوامر:*
    
    \`${usedPrefix}ذكاء رياضيات\`
    ↳ 🧮 حل سريع (+10 نقاط)
    
    \`${usedPrefix}ذكاء ذاكرة\`
    ↳ 🧠 احفظ الكلمات (+15 نقاط)
    
    \`${usedPrefix}ذكاء شخصية\`
    ↳ 🎭 اكتشف شخصيتك
    
    \`${usedPrefix}ذكاء سؤال-مفتوح\`
    ↳ 💭 سؤال فلسفي (+20 نقاط)
    
    \`${usedPrefix}ذكاء عد\`
    ↳ 🔢 لعبة جماعية
    
    \`${usedPrefix}ذكاء ذكائي\`
    ↳ 📊 نقاطك وترتيبك
    
    ━━━━━━━━━━━━━━━━━━
    🧠 نقاطك: ${user.iqPoints || 0}
    💰 رصيدك: ${user.coins} عملة`);
  }
}

// معالجة الإجابات
handler.before = async function (m) {
  // معالجة ألعاب الذكاء العادية
  if (global.activeGames && global.activeGames[m.chat]) {
    const game = global.activeGames[m.chat];
    const userAnswer = m.text?.toLowerCase().trim();
    
    if (!userAnswer) return;
    
    // رياضيات
    if (game.type === 'math' && userAnswer === game.answer) {
      let user = global.db.data.users[m.sender];
      user.coins += 120;
      user.iqPoints = (user.iqPoints || 0) + 10;
      
      m.reply(`╭━━━━━━━━━━━━━━━━━━╮
      ┃  🎉 *عبقري!* 🎉
      ╰━━━━━━━━━━━━━━━━━━╯
      
      ✅ الجواب صحيح!
      💰 +120 عملة
      🧠 +10 نقاط ذكاء
      
      📊 نقاط ذكائك: ${user.iqPoints}`);
      
      delete global.activeGames[m.chat];
      return true;
    }
    
    // اختبار الذاكرة
    if (game.type === 'memory' && game.phase === 'answer') {
      const userWords = userAnswer.split(' ').map(w => w.trim());
      const correctWords = game.words;
      let correctCount = 0;
      
      userWords.forEach(word => {
        if (correctWords.includes(word)) correctCount++;
      });
      
      const percentage = (correctCount / correctWords.length * 100).toFixed(0);
      
      let user = global.db.data.users[m.sender];
      
      if (correctCount === correctWords.length) {
        user.coins += 150;
        user.iqPoints = (user.iqPoints || 0) + 15;
        
        m.reply(`╭━━━━━━━━━━━━━━━━━━╮
        ┃  🎊 *ذاكرة خارقة!* 🎊
        ╰━━━━━━━━━━━━━━━━━━╯
        
        ✅ حفظت كل الكلمات!
        💰 +150 عملة
        🧠 +15 نقاط ذكاء
        
        🏆 أنت عبقري!`);
      } else if (correctCount >= 3) {
        const reward = 80;
        user.coins += reward;
        user.iqPoints = (user.iqPoints || 0) + 8;
        
        m.reply(`👍 جيد!\n\n✅ حفظت ${correctCount} من ${correctWords.length}\n📊 النسبة: ${percentage}%\n\n💰 +${reward} عملة\n🧠 +8 نقاط`);
      } else {
        m.reply(`😅 محاولة جيدة!\n\n✅ حفظت ${correctCount} من ${correctWords.length}\n\n💡 الكلمات كانت:\n${correctWords.join(' • ')}`);
      }
      
      delete global.activeGames[m.chat];
      return true;
    }
  }
  
  // معالجة لعبة العد
  if (global.groupCounting && global.groupCounting[m.chat]) {
    const counting = global.groupCounting[m.chat];
    const num = parseInt(m.text?.trim());
    
    if (!isNaN(num)) {
      if (m.sender === counting.lastUser) {
        m.reply('❌ ممنوع نفس الشخص يعد مرتين متتالية!');
        return true;
      }
      
      if (num === counting.current + 1) {
        counting.current = num;
        counting.lastUser = m.sender;
        
        // مكافأة كل 10 أرقام
        if (num % 10 === 0) {
          let user = global.db.data.users[m.sender];
          user.coins += 50;
          
          m.reply(`🎉 وصلنا للـ ${num}!\n\n💰 @${m.sender.split('@')[0]} حصل على 50 عملة!\n\n🔥 يلا كملوا...`, null, { mentions: [m.sender] });
        }
      } else {
        m.reply(`💥 خطأ! كان المفروض ${counting.current + 1}\n\n😭 نرجع للصفر!`);
        
        counting.current = 0;
        counting.lastUser = null;
      }
      
      return true;
    }
  }
}

handler.help = ['ذكاء'];
handler.tags = ['game'];
handler.command = /^(ذكاء|brain|iq)$/i;

module.exports = handler;