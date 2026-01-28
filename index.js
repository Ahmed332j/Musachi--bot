const {
  default: makeWASocket,
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  Browsers
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const { handler } = require('./handler');
const { loadDatabase, saveDatabase } = require('./lib/database');

global.db = loadDatabase();

const store = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// دالة طلب رقم الهاتف
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

// دالة بدء البوت
async function startMusachiBot() {
  console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║        ⚔️  MUSACHI-BOT  ⚔️           ║
║     البوت الأسطوري للواتساب           ║
║                                       ║
║  المطور: Musachi                      ║
║  الإصدار: 2.0.0 (محسّن)              ║
║                                       ║
╚═══════════════════════════════════════╝
  `);

  const { state, saveCreds } = await useMultiFileAuthState('./sessions');
  const { version } = await fetchLatestBaileysVersion();

  // طلب رقم الهاتف إذا لم يكن متصل
  let phoneNumber = '21653305767';
  if (!fs.existsSync('./sessions/creds.json')) {
    console.log('\n🔐 لم يتم العثور على جلسة سابقة');
    console.log(`✅ تم استخدام الرقم التلقائي: +${phoneNumber}`);
    console.log('⏳ جاري الاتصال بالواتساب...\n');
  }

  const conn = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false, // تعطيل QR Code
    browser: Browsers.ubuntu('Chrome'), // تحديد المتصفح
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      return { conversation: 'MUSACHI-BOT' };
    },
    msgRetryCounterCache: new Map(),
    defaultQueryTimeoutMs: undefined,
    markOnlineOnConnect: true
  });


  // حفظ بيانات الاعتماد
  conn.ev.on('creds.update', saveCreds);

    // معالجة الاتصال
    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('⚠️  تم اكتشاف QR Code ولكن تم تعطيله لصالح Pairing Code');
        }

        if (connection === 'open') {
            console.log(`\n╔═══════════════════════════════════════╗`);
            console.log(`║                                       ║`);
            console.log(`║   ✅ MUSACHI-BOT متصل بنجاح! 🎉      ║`);
            console.log(`║                                       ║`);
            console.log(`║   📱 الرقم: +${conn.user?.id?.split(':')[0] || 'غير معروف'}              ║`);
            console.log(`║   👤 الاسم: ${conn.user?.name || 'غير معروف'}                    ║`);
            console.log(`║   ⚔️  البوت جاهز للعمل!              ║`);
            console.log(`║                                       ║`);
            console.log(`╚═══════════════════════════════════════╝\n`);
        }

        if (connection === 'close') {
            const reason = lastDisconnect?.error instanceof Boom
                ? lastDisconnect.error.output.statusCode
                : 'غير معروف';

            console.log(`\n⚠️  انقطع الاتصال! السبب: ${reason}`);

            if (reason === DisconnectReason.loggedOut) {
                console.log('❌ تم تسجيل الخروج. جاري تنظيف الجلسة لإعادة المحاولة...');
                fs.rmSync('./sessions', { recursive: true, force: true });
                fs.mkdirSync('./sessions');
                setTimeout(() => startMusachiBot(), 2000);
            } else {
                console.log('🔄 إعادة الاتصال خلال 5 ثوانٍ...\n');
                setTimeout(() => startMusachiBot(), 5000);
            }
        }

        // طلب Pairing Code عند بدء الاتصال
        if (!fs.existsSync('./sessions/creds.json') && !update.qr && connection !== 'open' && !update.isOnline) {
             // تجنب الطلبات المتكررة جداً
             if (global.requestingPairingCode) return;
             global.requestingPairingCode = true;

            setTimeout(async () => {
                console.log('\n📲 جاري طلب Pairing Code للرقم: ' + phoneNumber);
                try {
                    const code = await conn.requestPairingCode(phoneNumber);
                    console.log(`\n╔═══════════════════════════════════════╗`);
                    console.log(`║                                       ║`);
                    console.log(`║     🔑 كود الربط (Pairing Code)      ║`);
                    console.log(`║                                       ║`);
                    console.log(`║           ${code}                      ║`);
                    console.log(`║                                       ║`);
                    console.log(`╚═══════════════════════════════════════╝`);
                    console.log('\n📱 الآن افتح واتساب على هاتفك وأدخل الكود أعلاه ⬆️\n');
                } catch (err) {
                    console.error('❌ خطأ في طلب Pairing Code:', err.message);
                } finally {
                    global.requestingPairingCode = false;
                }
            }, 10000);
        }
    });

  // معالجة الرسائل الواردة
  conn.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const m = messages[0];
    if (!m.message) return;

    // تمرير الرسالة للـ handler
    try {
      await handler(conn, m, store);
    } catch (err) {
      console.error('❌ خطأ في معالجة الرسالة:', err);
    }
  });

  // معالجة تحديثات المجموعات
  conn.ev.on('group-participants.update', async (update) => {
    console.log('👥 تحديث أعضاء المجموعة:', update);
  });

  // حفظ قاعدة البيانات كل 30 ثانية
  setInterval(() => {
    saveDatabase(global.db);
  }, 30000);

  return conn;
}

// معالجة الإغلاق النظيف
process.on('SIGINT', () => {
  console.log('\n\n🛑 إيقاف البوت...');
  saveDatabase(global.db);
  console.log('💾 تم حفظ قاعدة البيانات');
  process.exit(0);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ خطأ غير معالج:', err);
});

// بدء البوت
startMusachiBot().catch((err) => {
  console.error('❌ فشل بدء البوت:', err);
  process.exit(1);
});