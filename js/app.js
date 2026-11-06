/**
 * To-Do List Life Dashboard - Consolidated JavaScript
 */

// Storage Module
const storage = (() => {
  function save(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.error('[Storage]', e); }
  }
  function load(key) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
    catch (e) { console.error('[Storage]', e); return null; }
  }
  function remove(key) { localStorage.removeItem(key); }
  return { save, load, remove };
})();

// Greeting Module
const greeting = (() => {
  function getTimeDisplay() {
    const d = new Date();
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
  }
  function getDateDisplay() {
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const d = new Date();
    return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }
  function getGreeting() {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return 'Good morning';
    if (h >= 12 && h < 17) return 'Good afternoon';
    if (h >= 17 && h < 21) return 'Good evening';
    return 'Good night';
  }
  function validateName(name) { return typeof name === 'string' && name.trim().length > 0; }
  function setName(name) { if (validateName(name)) { storage.save('greeting_name', name.trim()); return true; } return false; }
  function getName() { return storage.load('greeting_name'); }
  function getUserName() { const n = getName(); return n ? n : 'User'; }
  function updateGreetingDisplay() {
    const g = document.querySelector('#greeting');
    const t = document.querySelector('#time-display');
    const d = document.querySelector('#date-display');
    if (g) g.textContent = getGreeting() + ', ' + getUserName() + '!';
    if (t) t.textContent = getTimeDisplay();
    if (d) d.textContent = getDateDisplay();
  }
  return { getTimeDisplay, getDateDisplay, getGreeting, validateName, setName, getName, getUserName, updateGreetingDisplay };
})();

// Timer Module
const timer = (() => {
  let duration = 1500, timeRemaining = 1500, isRunning = false, timerId = null;
  function formatTime(s) { return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); }
  function updateDisplay(el) { if (isRunning) el.textContent = formatTime(timeRemaining); else if (timeRemaining > 0) el.textContent = 'Paused'; else el.textContent = formatTime(0); }
  function playSound() {
    try { const ctx = new (window.AudioContext || window.webkitAudioContext)(); const osc = ctx.createOscillator(), gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 880; osc.start(); gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2); osc.stop(ctx.currentTime + 0.2); } catch(e) {}
  }
  function complete(el) { if (timerId) clearInterval(timerId); timerId = null; isRunning = false; timeRemaining = 0; playSound(); if (el) { el.classList.add('timer-completed','animate-pulse'); el.style.color = 'var(--success-color)'; } storage.save('timer_settings', { duration, timeRemaining, isRunning }); }
  function start() { if (isRunning) return; timerId = setInterval(() => { if (timeRemaining > 0) { timeRemaining--; storage.save('timer_settings', { duration, timeRemaining, isRunning }); } else { complete(); } }, 1000); isRunning = true; storage.save('timer_settings', { duration, timeRemaining, isRunning }); }
  function stop(el) { if (!isRunning) return; clearInterval(timerId); timerId = null; isRunning = false; storage.save('timer_settings', { duration, timeRemaining, isRunning }); }
  function reset(el) { if (timerId) clearInterval(timerId); timerId = null; isRunning = false; timeRemaining = duration; storage.save('timer_settings', { duration, timeRemaining, isRunning }); }
  function setDuration(m) { if ([5,10,15,20,25].includes(m)) { duration = m * 60; if (!isRunning) timeRemaining = duration; storage.save('timer_settings', { duration, timeRemaining, isRunning }); } }
  function loadSettings() { const s = storage.load('timer_settings'); if (s) { duration = s.duration; timeRemaining = s.timeRemaining; isRunning = s.isRunning || false; } }
  function initUI(startBtn, stopBtn, resetBtn, durationSel, displayEl) { startBtn.addEventListener('click', start); stopBtn.addEventListener('click', () => { stop(displayEl); }); resetBtn.addEventListener('click', () => { reset(displayEl); }); if (durationSel) durationSel.addEventListener('change', (e) => { setDuration(parseInt(e.target.value, 10)); }); if (timerId) clearInterval(timerId); timerId = setInterval(() => { if (isRunning) updateDisplay(displayEl); }, 1000); }
  return { start, stop, reset, formatTime, setDuration, loadSettings, updateDisplay, initUI, complete };
})();

// Todo Module
const todo = (() => {
  let tasks = [];
  function loadTasks() { const s = storage.load('todo_tasks'); tasks = s || []; return tasks; }
  function addTask(text) { if (!text || text.trim() === '') return null; const t = text.trim(); if (tasks.some(task => task.text.toLowerCase() === t.toLowerCase())) return null; const task = { id: crypto.randomUUID(), text: t, completed: false, createdAt: Date.now() }; tasks.push(task); storage.save('todo_tasks', tasks); return task; }
  function toggleTask(id) { const task = tasks.find(t => t.id === id); if (!task) return false; task.completed = !task.completed; storage.save('todo_tasks', tasks); return true; }
  function editTask(id, newText) { if (!newText || newText.trim() === '') return false; const t = newText.trim(); const idx = tasks.findIndex(task => task.id === id); if (idx === -1) return false; if (tasks.some((task,i) => i !== idx && task.text.toLowerCase() === t.toLowerCase())) return false; tasks[idx].text = t; storage.save('todo_tasks', tasks); return true; }
  function deleteTask(id) { const idx = tasks.findIndex(task => task.id === id); if (idx === -1) return false; tasks.splice(idx, 1); storage.save('todo_tasks', tasks); return true; }
  function getTasks() { return tasks; }
  return { loadTasks, addTask, toggleTask, editTask, deleteTask, getTasks };
})();

// Quicklinks Module
const quicklinks = (() => {
  let links = [];
  function loadLinks() { const s = storage.load('quick_links'); links = s || []; return links; }
  function addLink(url, label) { if (!url || !label || url.trim() === '' || label.trim() === '') return null; if (!url.includes('http://') && !url.includes('https://')) return null; const link = { id: crypto.randomUUID(), url: url.trim(), label: label.trim() }; links.push(link); storage.save('quick_links', links); return link; }
  function deleteLink(id) { const idx = links.findIndex(link => link.id === id); if (idx === -1) return false; links.splice(idx, 1); storage.save('quick_links', links); return true; }
  function getLinks() { return links; }
  function render(container) { container.innerHTML = ''; if (links.length === 0) { container.innerHTML = '<p>No quick links added yet</p>'; return; } links.forEach(link => { const div = document.createElement('div'); div.className = 'link-item'; div.innerHTML = '<a href="' + link.url + '" target="_blank">' + link.label + '</a><button class="delete-btn">X</button>'; container.appendChild(div); }); }
  return { loadLinks, addLink, deleteLink, getLinks, render };
})();

// Theme Module
const theme = (() => {
  function apply(themeName) { document.documentElement.setAttribute('data-theme', themeName); }
  function load() { const t = storage.load('current_theme') || 'light'; apply(t); return t; }
  function toggle() { const current = document.documentElement.getAttribute('data-theme') || 'light'; const newT = current === 'light' ? 'dark' : 'light'; apply(newT); storage.save('current_theme', newT); }
  function set(themeName) { if (themeName === 'light' || themeName === 'dark') { apply(themeName); storage.save('current_theme', themeName); } }
  return { load, toggle, set };
})();

// Main Application
function init() {
  console.log('[App] Initializing...');
  theme.load();
  timer.loadSettings();
  todo.loadTasks();
  quicklinks.loadLinks();
  greeting.updateGreetingDisplay();
  const startBtn = document.querySelector('#start-btn');
  const stopBtn = document.querySelector('#stop-btn');
  const resetBtn = document.querySelector('#reset-btn');
  const durationSel = document.querySelector('#duration-selector');
  const timerDisplay = document.querySelector('#timer-display');
  if (startBtn && stopBtn && resetBtn && timerDisplay) { timer.initUI(startBtn, stopBtn, resetBtn, durationSel, timerDisplay); }
  const themeToggle = document.querySelector('#theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', theme.toggle);
  const nameSettingsBtn = document.querySelector('#name-settings-btn');
  const nameSettingsModal = document.querySelector('#name-settings-modal');
  const closeModalBtn = document.querySelector('.close-btn');
  const saveNameBtn = document.querySelector('#save-name-btn');
  const newNameInput = document.querySelector('#new-name-input');
  if (nameSettingsBtn && nameSettingsModal) {
    nameSettingsBtn.addEventListener('click', () => { newNameInput.value = greeting.getName() || ''; nameSettingsModal.style.display = 'block'; });
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => { nameSettingsModal.style.display = 'none'; });
    if (saveNameBtn) saveNameBtn.addEventListener('click', () => { if (greeting.validateName(newNameInput.value)) { greeting.setName(newNameInput.value); greeting.updateGreetingDisplay(); nameSettingsModal.style.display = 'none'; } });
    nameSettingsModal.addEventListener('click', (e) => { if (e.target === nameSettingsModal) nameSettingsModal.style.display = 'none'; });
  }
  console.log('[App] Dashboard initialized');
}

window.init = init;
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
