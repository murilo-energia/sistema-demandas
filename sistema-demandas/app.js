/**
 * SISTEMA DE GESTÃO DE DEMANDAS OPERACIONAIS
 * Frontend Core Engine + Estilização Injetada
 */
const API_URL = "https://script.google.com/macros/s/AKfycbyvkLTbsyQ-2d3_Zz4WWmcoHJqHoQ-YRVXhnA4rZg4B3nMrGnv8dZuQ4JhBmVMoqDjM/exec";

// Injeta o CSS automaticamente para evitar que você precise criar a pasta CSS
const cssCode = `
:root {
  --primary: #DF7F24; --primary-hover: #c46a1b; --dark: #252525; --light-bg: #F8F9FA; --white: #FFFFFF;
  --gray-border: #E0E0E0; --text-main: #333333; --text-muted: #666666; --status-todo: #4A90E2; --status-doing: #DF7F24; --status-done: #2ECC71; --danger: #E74C3C;
}
* { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
body { background-color: var(--light-bg); color: var(--text-main); height: 100vh; overflow: hidden; }
.hidden { display: none !important; } .btn-block { width: 100%; }
button { cursor: pointer; border: none; border-radius: 6px; padding: 10px 16px; font-weight: 600; transition: all 0.2s ease; font-size: 14px; }
.btn-primary { background-color: var(--primary); color: var(--white); } .btn-primary:hover { background-color: var(--primary-hover); }
.btn-secondary { background-color: var(--gray-border); color: var(--dark); } .btn-secondary:hover { background-color: #ccc; }
.login-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: radial-gradient(circle at top left, #3a3a3a 0%, #252525 100%); }
.login-box { background: var(--white); padding: 40px; border-radius: 12px; width: 100%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
.login-header { text-align: center; margin-bottom: 30px; } .logo-icon { font-size: 42px; color: var(--primary); margin-bottom: 12px; }
.login-header h2 { color: var(--dark); font-size: 24px; } .login-header p { color: var(--text-muted); font-size: 13px; margin-top: 4px; }
.form-group { margin-bottom: 20px; } .form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; color: var(--dark); }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 11px 14px; border: 1px solid var(--gray-border); border-radius: 6px; font-size: 14px; outline: none; }
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; } .login-footer { text-align: center; margin-top: 20px; } .login-footer a { color: var(--primary); text-decoration: none; font-size: 13px; }
.main-layout { display: flex; height: 100vh; width: 100vw; }
.sidebar { width: 260px; background-color: var(--dark); color: var(--white); display: flex; flex-direction: column; padding: 24px 16px; flex-shrink: 0; }
.sidebar-brand { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; color: var(--primary); margin-bottom: 30px; padding-left: 8px; }
.user-profile-info { background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-bottom: 25px; }
.user-profile-info p { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge-perfil { display: inline-block; font-size: 11px; background: var(--primary); color: var(--white); padding: 2px 8px; border-radius: 10px; margin-top: 4px; }
.sidebar-menu { display: flex; flex-direction: column; gap: 8px; flex-grow: 1; }
.menu-item { color: #B3B3B3; text-decoration: none; padding: 12px; border-radius: 6px; display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 500; transition: all 0.2s; }
.menu-item:hover, .menu-item.active { background-color: rgba(255,255,255,0.1); color: var(--white); }
.menu-item.active { border-left: 4px solid var(--primary); background-color: rgba(223, 127, 36, 0.1); }
.btn-logout { background: transparent; color: #E74C3C; text-align: left; padding: 12px; font-size: 14px; } .btn-logout:hover { background: rgba(231, 76, 60, 0.1); }
.content-area { flex-grow: 1; padding: 30px; overflow-y: auto; height: 100vh; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--gray-border); padding-bottom: 15px; }
.section-header h1 { font-size: 24px; color: var(--dark); }
.metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 20px; }
.card-metric { background: var(--white); padding: 20px; border-radius: 8px; display: flex; align-items: center; gap: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.metric-icon { width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 20px; }
.metric-icon.blue { background: rgba(74,144,226,0.1); color: var(--status-todo); }
.metric-icon.orange { background: rgba(223,127,36,0.1); color: var(--status-doing); }
.metric-icon.green { background: rgba(46,204,113,0.1); color: var(--status-done); }
.metric-icon.red { background: rgba(231,76,60,0.1); color: var(--danger); }
.card-metric.urgent { border-left: 4px solid var(--danger); }
.metric-data h3 { font-size: 26px; color: var(--dark); } .metric-data p { font-size: 13px; color: var(--text-muted); font-weight: 500; }
.sub-metrics { grid-template-columns: 1fr 1fr; }
.card-sub-metric { background: var(--white); padding: 12px; border-radius: 6px; text-align: center; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
.grid-2x1 { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 10px; }
.data-panel { background: var(--white); padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.data-panel h2 { font-size: 16px; margin-bottom: 15px; color: var(--dark); display: flex; align-items: center; gap: 10px; }
.table-responsive { width: 100%; overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
table th { background: #F1F3F5; padding: 12px; font-weight: 600; color: var(--dark); }
table td { padding: 12px; border-bottom: 1px solid var(--gray-border); }
.prazos-lista { display: flex; flex-direction: column; gap: 10px; }
.prazo-item { display: flex; justify-content: space-between; padding: 10px; background: var(--light-bg); border-radius: 6px; font-size: 13px; }
.prazo-item.atrasado { border-left: 3px solid var(--danger); }
.kanban-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; height: calc(100vh - 140px); align-items: stretch; }
.kanban-column { background: #F1F3F5; border-radius: 8px; display: flex; flex-direction: column; padding: 15px; }
.column-header { font-weight: 700; padding-bottom: 12px; margin-bottom: 15px; font-size: 15px; }
.border-todo { border-bottom: 3px solid var(--status-todo); color: var(--status-todo); }
.border-doing { border-bottom: 3px solid var(--status-doing); color: var(--status-doing); }
.border-done { border-bottom: 3px solid var(--status-done); color: var(--status-done); }
.kanban-cards { display: flex; flex-direction: column; gap: 12px; overflow-y: auto; flex-grow: 1; padding-right: 4px; }
.card-demanda { background: var(--white); padding: 15px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 8px; }
.card-demanda h4 { font-size: 14px; color: var(--dark); }
.card-meta { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); font-weight: 500; }
.badge-prioridade { padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.badge-prioridade.Alta { background: rgba(231,76,60,0.1); color: var(--danger); }
.badge-prioridade.Média { background: rgba(223,127,36,0.1); color: var(--primary); }
.badge-prioridade.Baixa { background: #E0E0E0; color: #555; }
.card-actions { display: flex; gap: 8px; margin-top: 5px; }
.btn-card-xs { padding: 5px 8px; font-size: 11px; border-radius: 4px; flex-grow: 1; text-align: center; }
.modal { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(2px); }
.modal-content { background: var(--white); border-radius: 10px; width: 90%; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); animation: slideDown 0.2s ease-out; }
.modal-small { max-width: 450px; }
.modal-header { padding: 20px; border-bottom: 1px solid var(--gray-border); display: flex; justify-content: space-between; align-items: center; }
.close-modal { background: transparent; font-size: 24px; color: var(--text-muted); padding: 0; }
.modal-body, form { padding: 20px; }
.modal-footer { padding: 15px 20px; border-top: 1px solid var(--gray-border); display: flex; justify-content: flex-end; gap: 10px; }
@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@media(max-width: 768px) {
  .main-layout { flex-direction: column; } .sidebar { width: 100vw; height: auto; padding: 15px; }
  .sidebar-brand { margin-bottom: 10px; } .user-profile-info { display: none; }
  .sidebar-menu { flex-direction: row; flex-wrap: wrap; gap: 4px; } .menu-item { padding: 8px; font-size: 12px; }
  .content-area { height: auto; overflow-y: visible; padding: 15px; } .grid-2x1 { grid-template-columns: 1fr; }
  .kanban-board { grid-template-columns: 1fr; height: auto; } .form-row { grid-template-columns: 1fr; gap: 0; }
}
`;
const styleEl = document.createElement('style'); styleEl.innerHTML = cssCode; document.head.appendChild(styleEl);

// ESTADO CENTRAL DA SPA
const AppState = { user: null, demandas: [], usuarios: [], statusAAlterar: null, idDemandaAAlterar: null };

document.addEventListener("DOMContentLoaded", () => {
  verificarSessaoSalva(); configurarEventosNavegacao(); configurarFormularios(); configurarModais();
  // Corrige os caminhos do HTML já que unificamos tudo na raiz
  document.querySelector("link[href='css/style.css']").remove();
});

function verificarSessaoSalva() {
  const session = localStorage.getItem("gdo_user_session");
  if (session) { AppState.user = JSON.parse(session); entrarNoSistema(); }
}

function entrarNoSistema() {
  document.getElementById("screen-login").classList.add("hidden");
  document.getElementById("main-layout").classList.remove("hidden");
  document.getElementById("user-display-name").innerText = AppState.user.nome;
  document.getElementById("user-display-perfil").innerText = AppState.user.perfil;
  
  if (AppState.user.perfil !== "Administrador") {
    document.querySelectorAll(".adm-only").forEach(el => el.classList.add("hidden"));
  } else {
    document.querySelectorAll(".adm-only").forEach(el => el.classList.remove("hidden"));
  }
  carregarDadosPainel();
}

function configurarEventosNavegacao() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      const target = item.getAttribute("data-target");
      document.querySelectorAll(".view-section").forEach(sec => sec.classList.add("hidden"));
      document.getElementById(target).classList.remove("hidden");
      if (target === "view-usuarios") carregarUsuarios();
    });
  });
  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("gdo_user_session"); AppState.user = null; location.reload();
  });
}

async function chamarBackend(action, payload = {}) {
  try {
    const authEmail = AppState.user ? AppState.user.email : "";
    const corpo = JSON.stringify({ action, payload: { ...payload, authEmail } });
    const response = await fetch(API_URL, {
      method: "POST", mode: "cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: corpo
    });
    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.error);
    return resJson.data;
  } catch (error) {
    alert("Erro na Operação: " + error.message); throw error;
  }
}

function configurarFormularios() {
  document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = await chamarBackend("login", { email: document.getElementById("login-email").value, senha: document.getElementById("login-senha").value });
    if (user) { AppState.user = user; localStorage.setItem("gdo_user_session", JSON.stringify(user)); entrarNoSistema(); }
  });

  document.getElementById("form-demanda").addEventListener("submit", async (e) => {
    e.preventDefault();
    await chamarBackend("salvarDemanda", { demanda: {
      id: document.getElementById("demanda-id").value, titulo: document.getElementById("demanda-titulo-input").value,
      categoria: document.getElementById("demanda-categoria").value, prioridade: document.getElementById("demanda-prioridade").value,
      responsavelPrincipal: document.getElementById("demanda-responsavel").value, prazo: document.getElementById("demanda-prazo").value,
      responsaveisAdicionais: document.getElementById("demanda-adicionais").value, descricao: document.getElementById("demanda-descricao").value
    }});
    fecharModais(); carregarDadosPainel();
  });

  document.getElementById("form-usuario").addEventListener("submit", async (e) => {
    e.preventDefault();
    await chamarBackend("gerenciarUsuario", { usuario: {
      id: document.getElementById("user-id").value, nome: document.getElementById("user-nome").value, email: document.getElementById("user-email").value,
      senha: document.getElementById("user-senha").value, perfil: document.getElementById("user-perfil").value, status: document.getElementById("user-status").value
    }});
    fecharModais(); carregarUsuarios();
  });

  document.getElementById("btn-status-confirmar").addEventListener("click", async () => {
    await chamarBackend("atualizarStatus", { id: AppState.idDemandaAAlterar, novoStatus: AppState.statusAAlterar, observacao: document.getElementById("status-obs-text").value });
    fecharModais(); carregarDadosPainel();
  });
  document.getElementById("btn-recovery").addEventListener("click", (e) => { e.preventDefault(); alert("Contate o gestor de TI ou o SESMT para reset manual na Planilha Base."); });
}

async function carregarDadosPainel() {
  const dados = await chamarBackend("buscarDados"); AppState.demandas = dados.demandas;
  processarIndicadoresEDashboard(); renderizarQuadroKanban();
}

function processarIndicadoresEDashboard() {
  const ds = AppState.demandas; const hojeStr = new Date().toISOString().split('T')[0];
  let abertas = 0, andamento = 0, concluidas = 0, atrasadas = 0, hoje = 0, semana = 0;
  let produtividade = {}; let proximosPrazos = [];

  ds.forEach(d => {
    const status = d["Status"]; const prazoStr = d["Prazo"] ? new Date(d["Prazo"]).toISOString().split('T')[0] : ""; const resp = d["Responsável Principal"];
    if (!produtividade[resp]) produtividade[resp] = { todo: 0, doing: 0, done: 0 };
    if (status === "A Fazer") { abertas++; produtividade[resp].todo++; if (prazoStr && prazoStr < hojeStr) atrasadas++; }
    else if (status === "Em Andamento") { andamento++; produtividade[resp].doing++; if (prazoStr && prazoStr < hojeStr) atrasadas++; }
    else if (status === "Concluído") { concluidas++; produtividade[resp].done++; const dtConc = d["Data Conclusão"] ? new Date(d["Data Conclusão"]).toISOString().split('T')[0] : ""; if (dtConc === hojeStr) hoje++; const diffDays = Math.ceil(Math.abs(new Date(hojeStr) - new Date(dtConc)) / (1000 * 60 * 60 * 24)); if (diffDays <= 7) semana++; }
    if (status !== "Concluído" && prazoStr) proximosPrazos.push({ titulo: d["Título"], prazo: prazoStr, atrasado: prazoStr < hojeStr });
  });

  document.getElementById("m-abertas").innerText = abertas; document.getElementById("m-andamento").innerText = andamento; document.getElementById("m-concluidas").innerText = concluidas; document.getElementById("m-atrasadas").innerText = atrasadas; document.getElementById("m-hoje").innerText = hoje; document.getElementById("m-semana").innerText = semana;
  const tbodyProd = document.querySelector("#table-produtividade tbody"); tbodyProd.innerHTML = "";
  Object.keys(produtividade).forEach(user => {
    const tr = document.createElement("tr"); tr.innerHTML = `<td><strong>${user}</strong></td><td><span class="badge-perfil" style="background:#4A90E2">${produtividade[user].todo}</span></td><td><span class="badge-perfil" style="background:#DF7F24">${produtividade[user].doing}</span></td><td><span class="badge-perfil" style="background:#2ECC71">${produtividade[user].done}</span></td>`; tbodyProd.appendChild(tr);
  });
  const listaPrazosDiv = document.getElementById("lista-prazos"); listaPrazosDiv.innerHTML = "";
  proximosPrazos.slice(0, 5).sort((a,b) => new Date(a.prazo) - new Date(b.prazo)).forEach(p => {
    const div = document.createElement("div"); div.className = `prazo-item \${p.atrasado ? 'atrasado' : ''}`; div.innerHTML = `<span>\${p.titulo}</span> <strong \${p.atrasado ? 'style="color:#E74C3C"' : ''}>\${formatarDataBr(p.prazo)}</strong>`; listaPrazosDiv.appendChild(div);
  });
}

function renderizarQuadroKanban() {
  const colTodo = document.getElementById("col-todo"); const colDoing = document.getElementById("col-doing"); const colDone = document.getElementById("col-done");
  colTodo.innerHTML = ""; colDoing.innerHTML = ""; colDone.innerHTML = ""; let cTodo = 0, cDoing = 0, cDone = 0;

  AppState.demandas.forEach(d => {
    const card = document.createElement("div"); card.className = "card-demanda";
    card.innerHTML = `<div class="card-meta"><span>\${d["ID"]}</span><span class="badge-prioridade \${d["Prioridade"]}">\${d["Prioridade"]}</span></div><h4>\${d["Título"]}</h4><p style="font-size:12px; color:#666">\${d["Categoria"]}</p><div class="card-meta" style="margin-top:5px;"><span><i class="fa-solid fa-user"></i> \${d["Responsável Principal"].split('@')[0]}</span><span><i class="fa-solid fa-calendar"></i> \${formatarDataBr(d["Prazo"])}</span></div><div class="card-actions" id="actions-\${d["ID"]}"></div>`;
    const actionsDiv = card.querySelector(`#actions-\${d["ID"]}`); const status = d["Status"];
    if (status === "A Fazer") { cTodo++; actionsDiv.innerHTML = `<button class="btn-primary btn-card-xs" onclick="solicitarMudancaStatus('\${d["ID"]}', 'Em Andamento')">Iniciar Atividade</button>`; if(AppState.user.perfil === "Administrador") { card.style.borderLeft = "3px solid #4A90E2"; card.addEventListener("click", (e) => { if(e.target.tagName !== 'BUTTON') abrirEdicaoDemanda(d); }); } colTodo.appendChild(card); }
    else if (status === "Em Andamento") { cDoing++; actionsDiv.innerHTML = `<button class="btn-primary btn-card-xs" style="background:#2ECC71" onclick="solicitarMudancaStatus('\${d["ID"]}', 'Concluído')">Finalizar</button>`; if(AppState.user.perfil === "Administrador") { card.style.borderLeft = "3px solid #DF7F24"; card.addEventListener("click", (e) => { if(e.target.tagName !== 'BUTTON') abrirEdicaoDemanda(d); }); } colDoing.appendChild(card); }
    else if (status === "Concluído") { cDone++; card.style.borderLeft = "3px solid #2ECC71"; card.style.opacity = "0.8"; if(AppState.user.perfil === "Administrador") { actionsDiv.innerHTML = `<button class="btn-secondary btn-card-xs" onclick="solicitarMudancaStatus('\${d["ID"]}', 'Em Andamento')">Reabrir</button>`; card.addEventListener("click", (e) => { if(e.target.tagName !== 'BUTTON') abrirEdicaoDemanda(d); }); } colDone.appendChild(card); }
  });
  document.getElementById("count-todo").innerText = cTodo; document.getElementById("count-doing").innerText = cDoing; document.getElementById("count-done").innerText = cDone;
}

function solicitarMudancaStatus(id, novoStatus) { AppState.idDemandaAAlterar = id; AppState.statusAAlterar = novoStatus; document.getElementById("status-obs-text").value = ""; abrirModal("modal-status-obs"); }
function abrirEdicaoDemanda(d) {
  document.getElementById("modal-demanda-titulo").innerText = "Editar Demanda " + d["ID"]; document.getElementById("demanda-id").value = d["ID"]; document.getElementById("demanda-titulo-input").value = d["Título"]; document.getElementById("demanda-categoria").value = d["Categoria"]; document.getElementById("demanda-prioridade").value = d["Prioridade"]; document.getElementById("demanda-responsavel").value = d["Responsável Principal"]; document.getElementById("demanda-prazo").value = d["Prazo"] ? new Date(d["Prazo"]).toISOString().split('T')[0] : ""; document.getElementById("demanda-adicionais").value = d["Responsáveis Adicionais"]; document.getElementById("demanda-descricao").value = d["Descrição"]; document.getElementById("demanda-observacoes-fixas").value = d["Observações"] || "Nenhuma observação registrada."; abrirModal("modal-demanda");
}

async function carregarUsuarios() {
  const users = await chamarBackend("listarUsuarios"); AppState.usuarios = users; const tbody = document.querySelector("#table-users tbody"); tbody.innerHTML = "";
  users.forEach(u => {
    const tr = document.createElement("tr"); tr.innerHTML = `<td>\${u.ID}</td><td><strong>\${u.Nome}</strong></td><td>\${u.Email}</td><td>\${u.Perfil}</td><td><span class="badge-perfil" style="background:\${u.Status === 'Ativo' ? '#2ECC71' : '#E74C3C'}">\${u.Status}</span></td><td><button class="btn-secondary btn-card-xs" onclick="abrirEdicaoUsuario('\${u.ID}')"><i class="fa-solid fa-pen"></i> Editar</button></td>`; tbody.appendChild(tr);
  });
}

window.abrirEdicaoUsuario = function(id) {
  const u = AppState.usuarios.find(user => user.ID === id); if (!u) return;
  document.getElementById("modal-user-titulo").innerText = "Editar Operador"; document.getElementById("user-id").value = u.ID; document.getElementById("user-nome").value = u.Nome; document.getElementById("user-email").value = u.Email; document.getElementById("user-senha").value = u.Senha; document.getElementById("user-perfil").value = u.Perfil; document.getElementById("user-status").value = u.Status; abrirModal("modal-usuario");
};

function configurarModais() {
  document.getElementById("btn-nova-demanda").addEventListener("click", () => { document.getElementById("form-demanda").reset(); document.getElementById("demanda-id").value = ""; document.getElementById("modal-demanda-titulo").innerText = "Adicionar Demanda"; document.getElementById("demanda-observacoes-fixas").value = ""; abrirModal("modal-demanda"); });
  document.getElementById("btn-novo-usuario").addEventListener("click", () => { document.getElementById("form-usuario").reset(); document.getElementById("user-id").value = ""; document.getElementById("modal-user-titulo").innerText = "Novo Usuário"; abrirModal("modal-usuario"); });
  document.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", fecharModais));
}
function abrirModal(id) { document.getElementById(id).classList.remove("hidden"); }
function fecharModais() { document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden")); }
function formatarDataBr(dataStr) { if (!dataStr) return "-"; const date = new Date(dataStr); if (isNaN(date.getTime())) return "-"; return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); }