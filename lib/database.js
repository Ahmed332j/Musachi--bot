const fs = require('fs');
const path = require('path');

const databasePath = './database.json';

const defaultData = {
  users: {},
  chats: {},
  stats: {
    totalUsers: 0,
    totalChats: 0,
    commandsUsed: 0
  },
  settings: {
    botName: 'Yuki-WaBot',
    prefix: '.',
    ownerNumbers: ['21653305767']
  }
};

function readDatabase() {
  try {
    if (!fs.existsSync(databasePath)) {
      fs.writeFileSync(databasePath, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    const data = fs.readFileSync(databasePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('خطأ في قراءة قاعدة البيانات:', error);
    return defaultData;
  }
}

function saveDatabase(data) {
  try {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('خطأ في حفظ قاعدة البيانات:', error);
    return false;
  }
}

function createUser(userId) {
  const db = readDatabase();
  
  if (!db.users[userId]) {
    db.users[userId] = {
      id: userId,
      name: userId.split('@')[0],
      
      coins: 1000,
      bank: 0,
      
      level: 1,
      xp: 0,
      power: 50,
      
      characters: [],
      cards: [],
      
      lastDaily: '',
      dailyStreak: 0,
      
      lastBoss: '',
      bossWins: 0,
      
      challenges: {},
      challengesCompleted: 0,
      
      kingdom: null,
      
      relationships: {
        marriage: null,
        friends: [],
        bestie: null,
        enemies: [],
        lover: null,
        twin: null,
        brother: null,
        sister: null
      },
      
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      commandsUsed: 0,
      
      banned: false,
      banReason: ''
    };
    
    db.stats.totalUsers++;
    saveDatabase(db);
  }
  
  return db.users[userId];
}

function getUser(userId) {
  const db = readDatabase();
  
  if (!db.users[userId]) {
    return createUser(userId);
  }
  
  db.users[userId].lastSeen = new Date().toISOString();
  saveDatabase(db);
  
  return db.users[userId];
}

function updateUser(userId, updates) {
  const db = readDatabase();
  
  if (!db.users[userId]) {
    createUser(userId);
  }
  
  db.users[userId] = {
    ...db.users[userId],
    ...updates
  };
  
  saveDatabase(db);
  return db.users[userId];
}

function deleteUser(userId) {
  const db = readDatabase();
  
  if (db.users[userId]) {
    delete db.users[userId];
    db.stats.totalUsers--;
    saveDatabase(db);
    return true;
  }
  
  return false;
}

function addCoins(userId, amount) {
  const user = getUser(userId);
  user.coins += amount;
  updateUser(userId, user);
  return user.coins;
}

function removeCoins(userId, amount) {
  const user = getUser(userId);
  
  if (user.coins < amount) {
    return false;
  }
  
  user.coins -= amount;
  updateUser(userId, user);
  return true;
}

function addXP(userId, amount) {
  const user = getUser(userId);
  user.xp += amount;
  
  const xpNeeded = user.level * 100;
  if (user.xp >= xpNeeded) {
    user.level++;
    user.xp -= xpNeeded;
    user.coins += user.level * 50;
  }
  
  updateUser(userId, user);
  return user;
}

function initGlobalDB() {
  if (!global.db) {
    global.db = {
      data: {
        users: {},
        chats: {},
        settings: {}
      }
    };
  }
  
  const db = readDatabase();
  global.db.data = db;
  
  setInterval(() => {
    saveDatabase(global.db.data);
  }, 30000);
}

function loadDatabase() {
  return readDatabase();
}

module.exports = {
  readDatabase,
  loadDatabase,
  saveDatabase,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  addCoins,
  removeCoins,
  addXP,
  initGlobalDB
};
