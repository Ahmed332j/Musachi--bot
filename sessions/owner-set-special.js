// owner-set-special.js - نظام تحديد الأشخاص المخصصين
const fs = require('fs');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // التحقق من صلاحيات المالك
  if (!global.owner.includes(m.sender.split('@')[0])) {
    // التحقق من صلاحيات المالك المخصصة
    if (!global.db.data.users[m.sender]?.ownerPermission) {
      return m.reply('⛔ هذا الأمر للمالك فقط!');
    }
  }
  
  const type = command.replace('.هذا-', '').toLowerCase();
  
  // التحقق من المنشن
  if (!m.mentionedJid || m.mentionedJid.length === 0) {
    return m.reply(`❌ منشن الشخص!\n\nمثال:\n\`${usedPrefix}هذا-${type} @user\``);
  }
  
  const userId = m.mentionedJid[0].split('@')[0];
  
  // تهيئة global.specialUsers إذا لم يكن موجوداً
  if (!global.specialUsers) {
    global.specialUsers = {
      yunaUser: '',
      sasukeUser: '',
      subaruUser: ''
    };
  }
  
  // تحديد النوع
  if (type === 'يونا' || type === 'yuna') {
    global.specialUsers.yunaUser = userId;
    
    // حفظ في settings.js
    try {
      let settingsContent = fs.readFileSync('./settings.js', 'utf-8');
      const regex = /yunaUser:\s*['"](.*?)['"]/;
      settingsContent = settingsContent.replace(regex, `yunaUser: '${userId}'`);
      fs.writeFileSync('./settings.js', settingsContent, 'utf-8');
      
      await m.reply(`✅ *تم التحديد بنجاح!*\n\n@${userId} الآن هي **يونا** 🌸\n\nعندما تكتب "بيبي" سيرد البوت "مامي" 💕`, null, { mentions: [m.mentionedJid[0]] });
    } catch (error) {
      await m.reply('⚠️ تم التحديد مؤقتاً، لكن فشل الحفظ الدائم.\nأعد تشغيل البوت لحفظ التغييرات.');
    }
  }
  
  else if (type === 'ساسكي' || type === 'sasuke') {
    global.specialUsers.sasukeUser = userId;
    
    try {
      let settingsContent = fs.readFileSync('./settings.js', 'utf-8');
      const regex = /sasukeUser:\s*['"](.*?)['"]/;
      settingsContent = settingsContent.replace(regex, `sasukeUser: '${userId}'`);
      fs.writeFileSync('./settings.js', settingsContent, 'utf-8');
      
      await m.reply(`✅ *تم التحديد بنجاح!*\n\n@${userId} الآن هو **ساسكي** 😎\n\nعندما يكتب "ساسكي" سيرد البوت "عمك" 🔥`, null, { mentions: [m.mentionedJid[0]] });
    } catch (error) {
      await m.reply('⚠️ تم التحديد مؤقتاً، لكن فشل الحفظ الدائم.');
    }
  }
  
  else if (type === 'سوبارو' || type === 'subaru') {
    global.specialUsers.subaruUser = userId;
    
    try {
      let settingsContent = fs.readFileSync('./settings.js', 'utf-8');
      
      // إضافة subaruUser إذا لم يكن موجوداً
      if (!settingsContent.includes('subaruUser')) {
        const insertPos = settingsContent.indexOf('yunaUser:');
        if (insertPos !== -1) {
          const lineEnd = settingsContent.indexOf('\n', insertPos);
          settingsContent = settingsContent.slice(0, lineEnd + 1) + 
                          `  subaruUser: '${userId}'\n` + 
                          settingsContent.slice(lineEnd + 1);
        }
      } else {
        const regex = /subaruUser:\s*['"](.*?)['"]/;
        settingsContent = settingsContent.replace(regex, `subaruUser: '${userId}'`);
      }
      
      fs.writeFileSync('./settings.js', settingsContent, 'utf-8');
      
      await m.reply(`✅ *تم التحديد بنجاح!*\n\n@${userId} الآن هو **سوبارو** 💪\n\nعندما يكتب "سوبارو" سيرد البوت "BOSS" 😈`, null, { mentions: [m.mentionedJid[0]] });
    } catch (error) {
      await m.reply('⚠️ تم التحديد مؤقتاً، لكن فشل الحفظ الدائم.');
    }
  }
  
  else {
    return m.reply('❌ نوع غير صحيح!\n\nالأنواع المتاحة:\n• يونا\n• ساسكي\n• سوبارو');
  }
}

handler.help = ['هذا-يونا', 'هذا-ساسكي', 'هذا-سوبارو'];
handler.tags = ['owner'];
handler.command = /^(هذا-يونا|هذا-ساسكي|هذا-سوبارو)$/i;
handler.owner = true;

module.exports = handler;