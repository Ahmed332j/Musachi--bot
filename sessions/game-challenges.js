// game-challenge.js - نظام التحديات اليومية
const dailyChallenges = [
  { id: 1, task: "استخدم 5 أوامر مختلفة", reward: 100, type: 'commands', target: 5 },
  { id: 2, task: "اسحب من الجاتشا 3 مرات", reward: 150, type: 'gacha', target: 3 },
  { id: 3, task: "اسحب بطاقتين", reward: 120, type: 'cards', target: 2 },
  { id: 4, task: "قاتل الزعيم اليومي", reward: 200, type: 'boss', target: 1 },
  { id: 5, task: "احصل على المكافأة اليومية", reward: 80, type: 'daily', target: 1 },
  { id: 6, name: "ارفع مستواك", reward: 250, type: 'levelup', target: 1 },
  { id: 7, task: "اجمع 500 عملة", reward: 150, type: 'coins', target: 500 }
];

function getTodayChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return dailyChallenges[dayOfYear % dailyChallenges.length];
}

let handler = async (m, { conn, args, usedPrefix }) => {
  let user = global.db.data.users[m.sender];
  
  if (!user.challenges) user.challenges = {};
  if (!user.challengesCompleted) user.challengesCompleted = 0;
  if (!user.coins) user.coins = 1000;
  
  const today = new Date().toLocaleDateString('ar-TN');
  const action = args[0];
  
  // إنشاء تحدي اليوم
  if (!user.challenges[today]) {
    user.challenges[today] = {
      challenge: getTodayChallenge(),
      progress: 0,
      completed: false,
      claimed: false
    };
  }
  
  const todayChallenge = user.challenges[today];
  const challenge = todayChallenge.challenge;
  
  // عرض التحدي
  if (!action || action === 'عرض' || action === 'show') {
    const progressPercent = Math.min((todayChallenge.progress / challenge.target * 100), 100).toFixed(1);
    const progressBar = '▓'.repeat(Math.floor(progressPercent / 10)) + '░'.repeat(10 - Math.floor(progressPercent / 10));
    
    let status;
    if (todayChallenge.claimed) {
      status = '✅ *مكتمل ومُطالب به*';
    } else if (todayChallenge.completed) {
      status = '🎁 *جاهز للمطالبة!*';
    } else {
      status = '⏳ *قيد التقدم*';
    }
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎯 *تحدي اليوم* 🎯
╰━━━━━━━━━━━━━━━━━━╯

📝 *المهمة:* ${challenge.task}
💰 *المكافأة:* ${challenge.reward} عملة

╭━━━━━━━━━━━━━━━━━━╮
┃  📊 التقدم
┃  ${progressBar}
┃  ${todayChallenge.progress}/${challenge.target} (${progressPercent}%)
╰━━━━━━━━━━━━━━━━━━╯

📌 *الحالة:* ${status}

${todayChallenge.completed && !todayChallenge.claimed ? `\n🎁 استخدم \`${usedPrefix}تحدي مطالبة\` للحصول على المكافأة!` : ''}

╭━━━━━━━━━━━━━━━━━━╮
┃  🏆 إنجازاتك
┃  ✅ التحديات المكتملة: ${user.challengesCompleted}
╰━━━━━━━━━━━━━━━━━━╯`);
  }
  
  // المطالبة بالمكافأة
  else if (action === 'مطالبة' || action === 'claim' || action === 'اكتمل') {
    if (todayChallenge.claimed) {
      return m.reply('✅ لقد طالبت بمكافأة هذا التحدي بالفعل!');
    }
    
    if (!todayChallenge.completed) {
      return m.reply(`❌ لم تكمل التحدي بعد!

التقدم: ${todayChallenge.progress}/${challenge.target}
ينقصك: ${challenge.target - todayChallenge.progress}`);
    }
    
    user.coins += challenge.reward;
    user.challengesCompleted++;
    todayChallenge.claimed = true;
    
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎊 *تحدي مكتمل!* 🎊
╰━━━━━━━━━━━━━━━━━━╯

🏆 *المهمة:* ${challenge.task}

💰 *حصلت على:* ${challenge.reward} عملة
💎 *رصيدك الجديد:* ${user.coins} عملة

╭━━━━━━━━━━━━━━━━━━╮
┃  📊 إحصائياتك
┃  ✅ التحديات المكتملة: ${user.challengesCompleted}
╰━━━━━━━━━━━━━━━━━━╯

✨ عد غداً لتحدي جديد!`);
  }
  
  // القائمة
  else {
    m.reply(`╭━━━━━━━━━━━━━━━━━━╮
┃  🎯 *نظام التحديات* 🎯
╰━━━━━━━━━━━━━━━━━━╯

📋 *الأوامر:*

\`${usedPrefix}تحدي\`
↳ عرض تحدي اليوم

\`${usedPrefix}تحدي مطالبة\`
↳ المطالبة بالمكافأة

💡 *ملاحظة:*
• تحدي جديد كل يوم
• أكمل المهمة للحصول على المكافأة
• التحديات تتغير تلقائياً

🏆 التحديات المكتملة: ${user.challengesCompleted}`);
  }
}

handler.help = ['تحدي', 'challenge'];
handler.tags = ['game'];
handler.command = /^(تحدي|تحديات|challenge)$/i;

module.exports = handler;