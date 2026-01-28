#!/bin/bash

# ═══════════════════════════════════════════════
# ⚔️ MUSACHI-BOT - سكريبت التشغيل السريع
# ═══════════════════════════════════════════════

echo "╔═══════════════════════════════════════╗"
echo "║                                       ║"
echo "║        ⚔️  MUSACHI-BOT  ⚔️           ║"
echo "║     سكريبت التشغيل التلقائي          ║"
echo "║                                       ║"
echo "╚═══════════════════════════════════════╝"
echo ""

# التحقق من Node.js
echo "🔍 التحقق من Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت!"
    echo "📥 يرجى تثبيت Node.js 20+ من: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo "⚠️  إصدار Node.js قديم: v$NODE_VERSION"
    echo "📥 يرجى تحديث Node.js إلى 20+ من: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) مثبت"
echo ""

# التحقق من npm
echo "🔍 التحقق من npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت!"
    exit 1
fi

echo "✅ npm $(npm --version) مثبت"
echo ""

# إنشاء المجلدات المطلوبة
echo "📂 إنشاء المجلدات..."
mkdir -p sessions
mkdir -p tmp
mkdir -p plugins
mkdir -p lib

echo "✅ تم إنشاء المجلدات"
echo ""

# التحقق من node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 تثبيت المكتبات..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ فشل تثبيت المكتبات!"
        echo "🔄 محاولة مع --legacy-peer-deps..."
        npm install --legacy-peer-deps
        
        if [ $? -ne 0 ]; then
            echo "❌ فشل التثبيت!"
            exit 1
        fi
    fi
    
    echo "✅ تم تثبيت المكتبات"
    echo ""
else
    echo "✅ المكتبات مثبتة مسبقاً"
    echo ""
fi

# التحقق من الملفات المطلوبة
echo "🔍 التحقق من الملفات..."
REQUIRED_FILES=("index.js" "handler.js" "settings.js" "package.json")
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo "❌ ملفات مفقودة:"
    printf '   - %s\n' "${MISSING_FILES[@]}"
    echo ""
    echo "📥 يرجى نسخ الملفات من Artifacts"
    exit 1
fi

echo "✅ جميع الملفات موجودة"
echo ""

# سؤال عن طريقة التشغيل
echo "🚀 اختر طريقة التشغيل:"
echo "   1) تشغيل عادي (npm start)"
echo "   2) تشغيل مستمر (PM2)"
echo "   3) تشغيل تطوير (nodemon)"
echo ""

read -p "اختر (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 تشغيل البوت..."
        echo ""
        npm start
        ;;
    2)
        # التحقق من PM2
        if ! command -v pm2 &> /dev/null; then
            echo ""
            echo "📥 تثبيت PM2..."
            npm install -g pm2
        fi
        
        echo ""
        echo "🚀 تشغيل البوت بـ PM2..."
        pm2 delete musachi-bot 2>/dev/null || true
        pm2 start index.js --name musachi-bot
        pm2 save
        
        echo ""
        echo "✅ البوت يعمل في الخلفية!"
        echo ""
        echo "📝 أوامر PM2 المفيدة:"
        echo "   pm2 logs musachi-bot     - عرض السجلات"
        echo "   pm2 restart musachi-bot  - إعادة التشغيل"
        echo "   pm2 stop musachi-bot     - إيقاف"
        echo "   pm2 delete musachi-bot   - حذف"
        echo ""
        
        pm2 logs musachi-bot
        ;;
    3)
        # التحقق من nodemon
        if ! npm list -g nodemon &> /dev/null; then
            echo ""
            echo "📥 تثبيت nodemon..."
            npm install -g nodemon
        fi
        
        echo ""
        echo "🚀 تشغيل البوت بوضع التطوير..."
        echo ""
        nodemon index.js
        ;;
    *)
        echo "❌ خيار غير صحيح!"
        exit 1
        ;;
esac