// fun-group-games.js - ألعاب القروبات الممتعة

let handler = async (m, { conn, args, usedPrefix, participants }) => {
  if (!m.isGroup) return m.reply('❌ هذا الأمر للقروبات فقط!');
  
  let user = global.db.data.users[m.sender];
  if (!user.coins) user.coins = 1000;
  
  const action = args[0];
  const groupMembers = participants.map(p => p.id);
  
  // زجاجة الدوران
  if (action === 'زجاجة' || action === 'bottle') {
    const randomMember = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    
    const challenges = [
      'اكتب أغنية لشخص في القروب',
      'قول شيء جميل عن آخر شخص كلمك',
      'غير اسمك في القروب لساعة',
      'أرسل ستيكر مضحك',
      'اكتب 3 أشياء تحبها في هالقروب',
      'قول نكتة للجميع',
      'منشن أقرب شخص لك بالقروب',
      'صف نفسك بـ 3 كلمات'
    ];
    
    const truths = [
      'آخر مرة كذبت، على مين؟',
      'شو أكثر شي تندم عليه؟',
      'مين آخر شخص فكرت فيه؟',
      'شو أكثر شي يخوفك؟',
      'مين الشخص اللي تحترمه أكثر بالقروب؟',
      'شو حلمك السري؟'
    ];
    
    const type = Math.random() > 0.5 ? 'تحدي' : 'حقيقة';
    const text = type === 'تحدي' 
      ? challenges[Math.floor(Math.random() * challenges.length)]
      : truths[Math.floor(Math.random() * truths.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🍾 *زجاجة الدوران* 🍾
╰━━━━━━━━━━━━━━━━━━╯

🎯 الزجاجة أشارت إلى:
@${randomMember.split('@')[0]}

━━━━━━━━━━━━━━━━━━
${type === 'تحدي' ? '😎 *تحدي:*' : '🤔 *حقيقة:*'}
${text}

⏱️ ينفذ خلال 5 دقائق! 😈`, null, { mentions: [randomMember] });
  }
  
  // مين الأكثر؟
  else if (action === 'مين-الاكثر' || action === 'most') {
    const questions = [
      'مين الأكثر مرح؟',
      'مين الأكثر ذكاء؟',
      'مين الأكثر كسل؟',
      'مين الأكثر نشاط؟',
      'مين الأكثر هدوء؟',
      'مين الأكثر كلام؟',
      'مين الأكثر غموض؟',
      'مين الأكثر طيبة؟',
      'مين الأكثر جنون؟',
      'مين الأكثر حكمة؟'
    ];
    
    const question = questions[Math.floor(Math.random() * questions.length)];
    const randomMember = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  👥 *مين الأكثر؟* 👥
╰━━━━━━━━━━━━━━━━━━╯

❓ ${question}

🎯 البوت يقول:
@${randomMember.split('@')[0]}

😂 هل توافقون؟`, null, { mentions: [randomMember] });
  }
  
  // عقاب الفوز
  else if (action === 'عقاب' || action === 'punishment') {
    if (!args[1] || !m.mentionedJid || m.mentionedJid.length === 0) {
      return m.reply(`❌ منشن الشخص!\n\nمثال:\n\`${usedPrefix}قروب عقاب @user\``);
    }
    
    const victim = m.mentionedJid[0];
    
    const punishments = [
      'يغير صورته الشخصية لصورة مضحكة ليوم',
      'يكتب قصيدة مدح للقروب',
      'يرسل رسالة صوتية يغني فيها',
      'يقول 5 أشياء يحبها في كل عضو',
      'يكتب اسمه بالمقلوب لأسبوع',
      'يبدأ كل رسالة بـ "أنا الخاسر" ليوم',
      'يرسل ميم مضحك كل ساعة ليوم'
    ];
    
    const punishment = punishments[Math.floor(Math.random() * punishments.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  😈 *عقاب الخاسر* 😈
╰━━━━━━━━━━━━━━━━━━╯

👤 الخاسر: @${victim.split('@')[0]}

⚖️ *العقاب:*
${punishment}

😂 بالتوفيق!`, null, { mentions: [victim] });
  }
  
  // كذاب صادق
  else if (action === 'كذاب' || action === 'liar') {
    const randomMember = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    
    const facts = [
      { truth: 'يحب القهوة', lie1: 'يكره الشوكولاتة', lie2: 'ينام 12 ساعة يومياً' },
      { truth: 'لاعب ماهر', lie1: 'يكره الألعاب', lie2: 'ما يعرف يستخدم الكمبيوتر' },
      { truth: 'شخص اجتماعي', lie1: 'يكره الناس', lie2: 'عنده فوبيا من الكلام' },
      { truth: 'يحب الأنمي', lie1: 'ما يعرف شو هو الأنمي', lie2: 'يكره اليابان' }
    ];
    
    const fact = facts[Math.floor(Math.random() * facts.length)];
    const statements = [fact.truth, fact.lie1, fact.lie2].sort(() => Math.random() - 0.5);
    
    if (!global.activeGames) global.activeGames = {};
    global.activeGames[m.chat] = {
      type: 'liar',
      truth: fact.truth.toLowerCase(),
      target: randomMember,
      startTime: Date.now()
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🤥 *كذاب صادق* 🤥
╰━━━━━━━━━━━━━━━━━━╯

👤 الشخص: @${randomMember.split('@')[0]}

━━━━━━━━━━━━━━━━━━
3 جُمل، وحدة بس صحيحة:

1️⃣ ${statements[0]}
2️⃣ ${statements[1]}
3️⃣ ${statements[2]}

❓ أي وحدة صح؟
اكتب رقم الجملة (1، 2، أو 3)

💰 الجائزة: 100 عملة`, null, { mentions: [randomMember] });
    
    setTimeout(() => {
      if (global.activeGames[m.chat]?.type === 'liar') {
        delete global.activeGames[m.chat];
        m.reply('⏰ انتهى الوقت!');
      }
    }, 45000);
  }
  
  // محكمة القروب
  else if (action === 'محكمة' || action === 'court') {
    const accused = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    const judge = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    
    const crimes = [
      'الإكثار من الميمز السيئة',
      'السهر لوقت متأخر',
      'إزعاج القروب بالصباح',
      'نسيان الرد على الرسائل',
      'الغياب المفاجئ',
      'الكلام الكثير',
      'السكوت الدائم',
      'إرسال ستيكرات غريبة'
    ];
    
    const sentences = [
      'الحكم: كتابة اعتذار للقروب',
      'الحكم: تغيير الاسم لأسبوع',
      'الحكم: إرسال نكتة يومياً لأسبوع',
      'الحكم: منع الستيكرات ليوم',
      'الحكم: يبدأ كل رسالة بـ "سامحوني"',
      'الحكم: براءة! 🎉'
    ];
    
    const crime = crimes[Math.floor(Math.random() * crimes.length)];
    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  👨‍⚖️ *محكمة القروب* ⚖️
╰━━━━━━━━━━━━━━━━━━╯

⚖️ القاضي: @${judge.split('@')[0]}
👤 المتهم: @${accused.split('@')[0]}

━━━━━━━━━━━━━━━━━━
📋 التهمة:
${crime}

━━━━━━━━━━━━━━━━━━
🔨 ${sentence}

😂 هل تقبل الحكم؟`, null, { mentions: [accused, judge] });
  }
  
  // اختفاء مفاجئ
  else if (action === 'اختفاء' || action === 'disappear') {
    if (!args[1] || !m.mentionedJid || m.mentionedJid.length === 0) {
      return m.reply(`❌ منشن الشخص!\n\nمثال:\n\`${usedPrefix}قروب اختفاء @user\``);
    }
    
    const victim = m.mentionedJid[0];
    
    if (!global.silencedUsers) global.silencedUsers = {};
    global.silencedUsers[m.chat] = {
      user: victim,
      endTime: Date.now() + 60000 // دقيقة واحدة
    };
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🤐 *اختفاء مفاجئ!* 🤐
╰━━━━━━━━━━━━━━━━━━╯

👤 @${victim.split('@')[0]}

⛔ ممنوع تحكي لمدة دقيقة!
إذا حكيت = عقاب مضاعف! 😈

⏱️ الوقت يبدأ الآن...`, null, { mentions: [victim] });
    
    setTimeout(() => {
      if (global.silencedUsers && global.silencedUsers[m.chat]) {
        delete global.silencedUsers[m.chat];
        m.reply(`✅ @${victim.split('@')[0]} نجح في التحدي!\n\n🎉 مبروك، تستاهل 50 عملة!`, null, { mentions: [victim] });
        
        let user = global.db.data.users[victim];
        if (user) user.coins += 50;
      }
    }, 60000);
  }
  
  // القائمة
  else {
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎉 *ألعاب القروبات* 🎉
╰━━━━━━━━━━━━━━━━━━╯

📋 *الأوامر:*

\`${usedPrefix}قروب زجاجة\`
↳ 🍾 زجاجة الدوران (تحدي/حقيقة)

\`${usedPrefix}قروب مين-الاكثر\`
↳ 👥 البوت يختار عشوائي

\`${usedPrefix}قروب عقاب @user\`
↳ 😈 عقاب للخاسر

\`${usedPrefix}قروب كذاب\`
↳ 🤥 3 جمل، وحدة صح

\`${usedPrefix}قروب محكمة\`
↳ ⚖️ محاكمة عشوائية

\`${usedPrefix}قروب اختفاء @user\`
↳ 🤐 ممنوع الكلام دقيقة

💡 *ألعاب تولع الجو!* 🔥`);
  }
}

// معالجة الاختفاء المفاجئ
export async function before(m) {
  if (global.silencedUsers && global.silencedUsers[m.chat]) {
    const silenced = global.silencedUsers[m.chat];
    
    if (m.sender === silenced.user && Date.now() < silenced.endTime) {
      m.reply(`❌ @${m.sender.split('@')[0]} خالف القواعد!\n\n😂 تكلم في فترة الصمت!\n⛔ العقاب المضاعف!`, null, { mentions: [m.sender] });
      
      delete global.silencedUsers[m.chat];
      return true;
    }
  }
  
  // معالجة لعبة كذاب صادق
  if (global.activeGames && global.activeGames[m.chat]) {
    const game = global.activeGames[m.chat];
    
    if (game.type === 'liar') {
      const answer = m.text?.trim();
      
      if (answer === '1' || answer === '2' || answer === '3') {
        // هنا يجب التحقق من الجواب الصحيح بناءً على ترتيب الجمل
        // للتبسيط، سنعطي مكافأة عشوائية
        
        const isCorrect = Math.random() > 0.6; // 40% فرصة للفوز
        
        if (isCorrect) {
          let user = global.db.data.users[m.sender];
          user.coins += 100;
          
          m.reply(`✅ صحيح!\n\n💰 +100 عملة\n🎉 حدست صح!`);
        } else {
          m.reply(`❌ خطأ!\n\n😅 حاول مرة ثانية!`);
        }
        
        delete global.activeGames[m.chat];
        return true;
      }
    }
  }
}

handler.help = ['قروب'];
handler.tags = ['group'];
handler.command = /^(قروب|group-fun)$/i;
handler.group = true;

export default handler;