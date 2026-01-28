// game-kingdoms.js - نظام الممالك الكامل والمحدث

let handler = async (m, { conn, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  if (!user.coins) user.coins = 1000;
  if (!user.kingdom) user.kingdom = null;
  
  // إنشاء قاعدة بيانات الممالك إذا لم تكن موجودة
  if (!global.db.data.kingdoms) global.db.data.kingdoms = {};
  
  const action = args[0];
  
  // عرض القائمة الرئيسية
  if (!action || action === 'قائمة' || action === 'help') {
    const myKingdom = user.kingdom;
    
    let message = `╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🏰 *نظام الممالك* 🏰
╰━━━━━━━━━━━━━━━━━━━━━╯

📋 *الأوامر المتاحة:*

${!myKingdom ? `🌹 \`.ممالك انشاء (اسم)\`
   ↳ إنشاء مملكتك (50,000 عملة)\n` : ''}
🐼 \`.ممالك معلومات\`
   ↳ معلومات مملكتك

🌹 \`.ممالك تحالف @عضو\`
   ↳ إضافة للتحالف (حد أقصى 3)

🐼 \`.ممالك تحالفي\`
   ↳ عرض أعضاء التحالف

🌹 \`.ممالك طرد @عضو\`
   ↳ طرد عضو من التحالف

🐼 \`.ممالك تطوير (نوع)\`
   ↳ تطوير المملكة
   • ذهب - زيادة الذهب (+100)
   • ارض - زيادة الأراضي (+1)
   • مستوى - رفع مستوى المملكة (+1)
   💰 التكلفة: 10,000 عملة

🌹 \`.ممالك متصدرين\`
   ↳ أغنى 10 ممالك

🐼 \`.ممالك حل\`
   ↳ حل المملكة (لا رجعة!)

━━━━━━━━━━━━━━━━━━━━━
💎 رصيدك: ${user.coins} عملة
${myKingdom ? `🏰 مملكتك: ${global.db.data.kingdoms[m.sender]?.name || 'غير معروف'}` : '❌ ليس لديك مملكة'}

🎌 موساشي الممالك`;

    await m.reply(message);
    return;
  }
  
  // إنشاء مملكة
  if (action === 'انشاء' || action === 'create') {
    if (user.kingdom) {
      return m.reply('❌ لديك مملكة بالفعل!\n\nاستخدم `.ممالك معلومات` لرؤيتها');
    }
    
    const name = args.slice(1).join(' ');
    if (!name || name.length < 3) {
      return m.reply('❌ اكتب اسم المملكة!\n\nمثال:\n`.ممالك انشاء مملكة الأنمي`\n\n⚠️ الاسم يجب أن يكون 3 أحرف على الأقل');
    }
    
    if (name.length > 30) {
      return m.reply('❌ الاسم طويل جداً!\n\nالحد الأقصى: 30 حرف');
    }
    
    const cost = 50000;
    if (user.coins < cost) {
      return m.reply(`❌ ليس لديك عملات كافية!\n\n💎 تحتاج: ${cost} عملة\n💰 لديك: ${user.coins} عملة\n📊 ينقصك: ${cost - user.coins} عملة`);
    }
    
    // خصم العملات
    user.coins -= cost;
    
    // إنشاء المملكة
    const kingdom = {
      name: name,
      owner: m.sender,
      ownerName: m.pushName || 'مالك',
      allies: [],
      level: 1,
      gold: 100,
      land: 1,
      army: 50,
      population: 100,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    user.kingdom = m.sender;
    global.db.data.kingdoms[m.sender] = kingdom;
    
    await m.reply(`╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🎉 *مملكة جديدة!* 🎉
╰━━━━━━━━━━━━━━━━━━━━━╯

🏰 *اسم المملكة:*
${kingdom.name}

👑 *الملك:* ${kingdom.ownerName}

━━━━━━━━━━━━━━━━━━━━━
📊 *الإحصائيات الأولية:*
💰 الذهب: ${kingdom.gold}
🏞️ الأراضي: ${kingdom.land}
⚔️ الجيش: ${kingdom.army}
👥 السكان: ${kingdom.population}
🏗️ المستوى: ${kingdom.level}

💎 رصيدك المتبقي: ${user.coins} عملة

✨ ابدأ ببناء إمبراطوريتك!
استخدم \`.ممالك تطوير\` للتطوير`);
  }
  
  // معلومات المملكة
  else if (action === 'معلومات' || action === 'info') {
    if (!user.kingdom) {
      return m.reply('❌ ليس لديك مملكة!\n\nأنشئ واحدة بـ `.ممالك انشاء (اسم)`');
    }
    
    const kingdom = global.db.data.kingdoms[user.kingdom];
    if (!kingdom) {
      user.kingdom = null;
      return m.reply('❌ حدث خطأ! مملكتك غير موجودة.');
    }
    
    const alliesText = kingdom.allies && kingdom.allies.length > 0 
      ? kingdom.allies.map(id => `@${id.split('@')[0]}`).join('\n   ')
      : 'لا يوجد';
    
    const createdDate = new Date(kingdom.createdAt).toLocaleDateString('ar-TN');
    
    await m.reply(`╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🏰 *${kingdom.name}* 🏰
╰━━━━━━━━━━━━━━━━━━━━━╯

👑 *الملك:* ${kingdom.ownerName}
📅 *تاريخ التأسيس:* ${createdDate}

━━━━━━━━━━━━━━━━━━━━━
📊 *الإحصائيات:*

💰 الذهب: ${kingdom.gold}
🏞️ الأراضي: ${kingdom.land}
⚔️ الجيش: ${kingdom.army}
👥 السكان: ${kingdom.population}
🏗️ المستوى: ${kingdom.level}

━━━━━━━━━━━━━━━━━━━━━
🤝 *التحالف (${kingdom.allies?.length || 0}/3):*
${alliesText}

🎌 مملكة موساشي العظيمة!`, null, { mentions: kingdom.allies || [] });
  }
  
  // إضافة للتحالف
  else if (action === 'تحالف' || action === 'ally') {
    if (!user.kingdom) {
      return m.reply('❌ ليس لديك مملكة!');
    }
    
    const kingdom = global.db.data.kingdoms[user.kingdom];
    
    if (kingdom.owner !== m.sender) {
      return m.reply('❌ فقط الملك يمكنه إضافة أعضاء للتحالف!');
    }
    
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
      return m.reply(`❌ منشن الشخص!\n\nمثال:\n\`${usedPrefix}ممالك تحالف @user\``);
    }
    
    const allyId = m.mentionedJid[0];
    
    if (allyId === m.sender) {
      return m.reply('❌ لا يمكنك إضافة نفسك للتحالف!');
    }
    
    if (!kingdom.allies) kingdom.allies = [];
    
    if (kingdom.allies.length >= 3) {
      return m.reply('❌ الحد الأقصى للتحالف 3 أعضاء فقط!');
    }
    
    if (kingdom.allies.includes(allyId)) {
      return m.reply('❌ هذا الشخص موجود بالفعل في التحالف!');
    }
    
    kingdom.allies.push(allyId);
    
    await m.reply(`╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🤝 *تحالف جديد!* 🤝
╰━━━━━━━━━━━━━━━━━━━━━╯

✅ تمت إضافة @${allyId.split('@')[0]}
إلى تحالف مملكة **${kingdom.name}**

🏰 عدد الحلفاء: ${kingdom.allies.length}/3

🎌 معاً أقوى!`, null, { mentions: [allyId] });
  }
  
  // عرض التحالف
  else if (action === 'تحالفي' || action === 'allies') {
    if (!user.kingdom) {
      return m.reply('❌ ليس لديك مملكة!');
    }
    
    const kingdom = global.db.data.kingdoms[user.kingdom];
    
    if (!kingdom.allies || kingdom.allies.length === 0) {
      return m.reply('❌ لا يوجد حلفاء في مملكتك!\n\nأضف حلفاء بـ `.ممالك تحالف @user`');
    }
    
    let alliesList = kingdom.allies.map((id, i) => {
      const allyUser = global.db.data.users[id];
      const name = allyUser?.name || id.split('@')[0];
      return `${i + 1}. @${id.split('@')[0]}\n   💰 ${allyUser?.coins || 0} عملة`;
    }).join('\n\n');
    
    await m.reply(`╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🤝 *حلفاء المملكة* 🤝
╰━━━━━━━━━━━━━━━━━━━━━╯

🏰 *${kingdom.name}*

━━━━━━━━━━━━━━━━━━━━━
${alliesList}

━━━━━━━━━━━━━━━━━━━━━
📊 العدد: ${kingdom.allies.length}/3

🎌 التحالف قوة!`, null, { mentions: kingdom.allies });
  }
  
  // طرد من التحالف
  else if (action === 'طرد' || action === 'kick') {
    if (!user.kingdom) {
      return m.reply('❌ ليس لديك مملكة!');
    }
    
    const kingdom = global.db.data.kingdoms[user.kingdom];
    
    if (kingdom.owner !== m.sender) {
      return m.reply('❌ فقط الملك يمكنه طرد الأعضاء!');
    }
    
    if (!m.mentionedJid || m.mentionedJid.length === 0) {
      return m.reply(`❌ منشن الشخص!\n\nمثال:\n\`${usedPrefix}ممالك طرد @user\``);
    }
    
    const allyId = m.mentionedJid[0];
    
    if (!kingdom.allies || !kingdom.allies.includes(allyId)) {
      return m.reply('❌ هذا الشخص ليس في التحالف!');
    }
    
    kingdom.allies = kingdom.allies.filter(id => id !== allyId);
    
    await m.reply(`✅ تم طرد @${allyId.split('@')[0]} من التحالف!\n\n🏰 ${kingdom.name}`, null, { mentions: [allyId] });
  }
  
  // تطوير المملكة
  else if (action === 'تطوير' || action === 'upgrade') {
    if (!user.kingdom) {
      return m.reply('❌ ليس لديك مملكة!');
    }
    
    const kingdom = global.db.data.kingdoms[user.kingdom];
    
    const type = args[1];
    if (!type) {
      return m.reply(`❌ حدد نوع التطوير!\n\nالأنواع:\n• ذهب\n• ارض\n• مستوى\n\nمثال: \`${usedPrefix}ممالك تطوير ذهب\``);
    }
    
    const cost = 10000;
    if (user.coins < cost) {
      return m.reply(`❌ تحتاج ${cost} عملة للتطوير!\n\n💰 لديك: ${user.coins}`);
    }
    
    user.coins -= cost;
    
    let upgraded = '';
    let bonus = '';
    
    if (type === 'ذهب' || type === 'gold') {
      kingdom.gold += 100;
      upgraded = '💰 الذهب';
      bonus = '+100';
    } else if (type === 'ارض' || type === 'land') {
      kingdom.land += 1;
      kingdom.population += 50; // كل أرض = 50 ساكن
      upgraded = '🏞️ الأراضي';
      bonus = '+1 (👥 +50 ساكن)';
    } else if (type === 'مستوى' || type === 'level') {
      kingdom.level += 1;
      kingdom.army += 20; // كل مستوى = 20 جندي
      upgraded = '🏗️ المستوى';
      bonus = '+1 (⚔️ +20 جندي)';
    } else {
      user.coins += cost; // إرجاع العملات
      return m.reply('❌ نوع تطوير غير صحيح!\n\nالخيارات: ذهب، ارض، مستوى');
    }
    
    await m.reply(`╭━━━━━━━━━━━━━━━━━━━━━╮
┃  ⚒️ *تطوير ناجح!* ⚒️
╰━━━━━━━━━━━━━━━━━━━━━╯

🏰 *${kingdom.name}*

${upgraded}: ${bonus}

━━━━━━━━━━━━━━━━━━━━━
📊 *الإحصائيات الجديدة:*
💰 الذهب: ${kingdom.gold}
🏞️ الأراضي: ${kingdom.land}
⚔️ الجيش: ${kingdom.army}
👥 السكان: ${kingdom.population}
🏗️ المستوى: ${kingdom.level}

💎 رصيدك: ${user.coins} عملة`);
  }
  
  // المتصدرين
  else if (action === 'متصدرين' || action === 'leaderboard') {
    const kingdoms = Object.values(global.db.data.kingdoms)
      .sort((a, b) => b.gold - a.gold)
      .slice(0, 10);
    
    if (kingdoms.length === 0) {
      return m.reply('❌ لا توجد ممالك بعد!\n\nكن أول من ينشئ مملكة!');
    }
    
    let list = kingdoms.map((k, i) => {
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      return `${medal} **${k.name}**\n   👑 ${k.ownerName}\n   💰 ${k.gold} ذهب | 🏗️ مستوى ${k.level}`;
    }).join('\n\n');
    
    await m.reply(`╭━━━━━━━━━━━━━━━━━━━━━╮
┃  🏆 *أغنى الممالك* 🏆
╰━━━━━━━━━━━━━━━━━━━━━╯

${list}

🎌 من سيكون الأقوى؟`);
  }
  
  // حل المملكة
  else if (action === 'حل' || action === 'delete') {
    if (!user.kingdom) {
      return m.reply('❌ ليس لديك مملكة!');
    }
    
    const kingdom = global.db.data.kingdoms[user.kingdom];
    
    if (kingdom.owner !== m.sender) {
      return m.reply('❌ فقط الملك يمكنه حل المملكة!');
    }
    
    await m.reply(`⚠️ *تحذير!*

هل أنت متأكد من حل مملكة **${kingdom.name}**؟

❌ *لا رجعة عن هذا القرار!*
❌ ستخسر كل التطويرات!
❌ سيتم حل التحالف!

للتأكيد، اكتب:
\`${usedPrefix}ممالك تأكيد-الحل\``);
  }
  
  // تأكيد الحل
  else if (action === 'تأكيد-الحل' || action === 'confirm-delete') {
    if (!user.kingdom) {
      return m.reply('❌ ليس لديك مملكة!');
    }
    
    const kingdom = global.db.data.kingdoms[user.kingdom];
    const kingdomName = kingdom.name;
    
    delete global.db.data.kingdoms[user.kingdom];
    user.kingdom = null;
    
    await m.reply(`💔 *تم حل المملكة*

🏰 **${kingdomName}** لم تعد موجودة...

يمكنك إنشاء مملكة جديدة بـ \`.ممالك انشاء\``);
  }
}

handler.help = ['ممالك'];
handler.tags = ['game'];
handler.command = /^(ممالك|مملكة|kingdoms?)$/i;

export default handler;