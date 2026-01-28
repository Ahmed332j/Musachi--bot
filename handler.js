// handler.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// تحميل الإعدادات
require('./settings');

const plugins = {};
const pluginsPath = path.join(__dirname, 'plugins');

const arabicNormalize = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه');
};

function loadPlugins() {
  const files = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));
  for (const file of files) {
    try {
      const filePath = path.join(pluginsPath, file);
      delete require.cache[require.resolve(filePath)];
      const plugin = require(filePath);
      plugins[file] = plugin;
    } catch (e) {
      console.log(chalk.red(`❌ خطأ في تحميل ${file}: ${e.message}`));
    }
  }
}

loadPlugins();

async function handler(conn, m) {
  try {
    if (!m.message) return;
    const sender = m.key.remoteJid;
    if (sender === 'status@broadcast') return;

    // الحصول على رقم المرسل وتجريده من الرموز
    const senderNumber = (m.key.participant || sender).split('@')[0].replace(/[^0-9]/g, '');
    
    // المالك الأساسي
    const primaryOwner = '21653305767';
    
    // التحقق من المالك (الرقم الأساسي أو المضافين في settings.js)
    let isOwner = senderNumber === primaryOwner;
    if (!isOwner && global.owner) {
      isOwner = global.owner.some(o => {
        const num = Array.isArray(o) ? o[0] : o;
        return num.toString().replace(/[^0-9]/g, '') === senderNumber;
      });
    }

    const messageType = Object.keys(m.message)[0];
    let body = '';
    if (messageType === 'conversation') body = m.message.conversation;
    else if (messageType === 'extendedTextMessage') body = m.message.extendedTextMessage.text;
    else if (m.message[messageType]?.caption) body = m.message[messageType].caption;

    if (!body) return;

    const autoReact = async (emoji) => {
      try { await conn.sendMessage(sender, { react: { text: emoji, key: m.key } }); } catch (e) {}
    };

    const prefix = global.prefix || '.';
    
    // تنفيذ "before" للردود التفاعلية
    for (const name in plugins) {
      if (plugins[name].before && typeof plugins[name].before === 'function') {
        try {
          const handled = await plugins[name].before(conn, m, { body, sender, senderJid: senderNumber, isOwner, autoReact });
          if (handled) return;
        } catch (e) { console.error(`Error in before (${name}):`, e); }
      }
    }

    if (!body.startsWith(prefix)) return;

    const args = body.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const cmdNorm = arabicNormalize(command);

    console.log(chalk.cyan(`[Command] ${command} | من: ${senderNumber} | مالك: ${isOwner}`));

    let found = false;
    for (const name in plugins) {
      const p = plugins[name];
      if (!p || !p.command) continue;

      let match = false;
      const patterns = Array.isArray(p.command) ? p.command : [p.command];
      
      for (let pattern of patterns) {
        if (pattern instanceof RegExp) {
          if (pattern.test(command) || pattern.test(cmdNorm)) { match = true; break; }
        } else {
          if (cmdNorm === arabicNormalize(pattern)) { match = true; break; }
        }
      }

      if (match) {
        // التحقق من صلاحيات المالك
        if ((p.ownerOnly || p.owner) && !isOwner) {
          await conn.sendMessage(sender, { text: '⚠️ هذا الأمر متاح للمالك فقط!' }, { quoted: m });
          return;
        }

        found = true;
        try {
          const msgData = { 
            conn, m, args, command, sender, 
            senderJid: senderNumber, isOwner, body, 
            prefix, autoReact, text: args.join(' '),
            usedPrefix: prefix
          };
          
          if (!global.db.data) {
            if (global.loadDatabase) await global.loadDatabase();
          }
          
          // تشغيل المعالج المناسب
          if (typeof p === 'function') await p(msgData);
          else if (p.handler) await p.handler(msgData);
          else if (p.run) await p.run(msgData);
          else if (p.execute) await p.execute(msgData);
          return;
        } catch (e) {
          console.error(`Error in plugin ${name}:`, e);
          await autoReact('❌');
          return;
        }
      }
    }

    if (!found) await autoReact('❓');
  } catch (e) { console.error('Handler Error:', e); }
}

module.exports = { handler, plugins };
