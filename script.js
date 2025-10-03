// 簡易公告管理（存在 localStorage，示範用途）
// 如果未修改，公告會保存在使用者瀏覽器（非伺服器）
// 以後可改成與後端 API 互動（例如 Firebase / Google Sheets API）

const ANN_KEY = 'class_announcements_v1';

function loadAnnouncements(){
  const raw = localStorage.getItem(ANN_KEY);
  return raw ? JSON.parse(raw) : [
    // 預設範例公告
    {id: Date.now()-100000, title:'開學日提醒', body:'9/1 上午 8:10 到教室集合，帶筆記本與學生證。', level:'important', time: new Date(Date.now()-100000).toISOString()},
    {id: Date.now()-50000, title:'班會', body:'9/3 午後 2:00 班會，主題：迎新與分工。', level:'normal', time: new Date(Date.now()-50000).toISOString()}
  ];
}

function saveAnnouncements(list){
  localStorage.setItem(ANN_KEY, JSON.stringify(list));
}

function renderAnnouncements(){
  const list = loadAnnouncements();
  const wrap = document.getElementById('announce-list');
  wrap.innerHTML = '';
  if(list.length === 0){
    wrap.innerHTML = '<p>目前沒有公告。</p>';
    return;
  }
  // 由最新到最舊
  list.sort((a,b)=> b.id - a.id);
  for(const a of list){
    const el = document.createElement('div');
    el.className = 'announce ' + (a.level === 'urgent' ? 'urgent' : (a.level === 'important' ? 'important' : ''));
    el.innerHTML = `
      <div class="time">${new Date(a.time).toLocaleString()}</div>
      <div class="title">${escapeHtml(a.title)}</div>
      <div class="body">${escapeHtml(a.body)}</div>
    `;
    wrap.appendChild(el);
  }
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(m){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderAnnouncements();

  const form = document.getElementById('announce-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const title = document.getElementById('announce-title').value.trim();
    const body = document.getElementById('announce-body').value.trim();
    const level = document.getElementById('announce-level').value;
    if(!title || !body) return alert('請填寫標題與內容');
    const list = loadAnnouncements();
    list.push({id: Date.now(), title, body, level, time: new Date().toISOString()});
    saveAnnouncements(list);
    renderAnnouncements();
    form.reset();
  });

  document.getElementById('clear-announces').addEventListener('click', ()=>{
    if(confirm('確定要清除所有公告？（這會清除瀏覽器本地的公告）')) {
      localStorage.removeItem(ANN_KEY);
      renderAnnouncements();
    }
  });
});
