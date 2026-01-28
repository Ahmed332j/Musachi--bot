let handler = async (m, { conn }) => {
    // التحقق من أن المستخدم هو مالك
    if (!global.owner.includes(m.sender.split('@')[0])) {
        return m.reply('⚠️ هذا الأمر متاح للمالكين فقط!');
    }

    let ownerList = global.owner.map((owner, index) => {
        let isPrimary = owner === '21653305767' ? '👑 المالك الأساسي' : '⭐ مالك';
        return `${index + 1}. ${isPrimary}\n   📱 +${owner}`;
    }).join('\n\n');

    let message = `╭━━━━━━━━━━━━━━━━━━╮
┃  👥 *قـائـمـة الـمـالـكـيـن*
╰━━━━━━━━━━━━━━━━━━╯

${ownerList}

╭━━━━━━━━━━━━━━━━━━╮
┃  📊 *الإحصائيات*
┃  • عدد المالكين: ${global.owner.length}
┃  • البوت: ${global.wm}
┃  • الإصدار: ${global.version}
╰━━━━━━━━━━━━━━━━━━╯`;

    m.reply(message);
}

handler.help = ['listowner'];
handler.tags = ['owner'];
handler.command = /^(listowner|قائمة_المالكين|owners)$/i;
handler.owner = true;

module.exports = handler;