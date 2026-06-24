/**
 * SISTEMA DE GESTÃO DE DEMANDAS OPERACIONAIS
 * Frontend Core Engine - JavaScript
 */
const API_URL = "https://script.google.com/macros/s/AKfycbyvkLTbsyQ-2d3_Zz4WWmcoHJqHoQ-YRVXhnA4rZg4B3nMrGnv8dZuQ4JhBmVMoqDjM/exec";

// ESTADO CENTRAL DA APLICAÇÃO (SPA)
const AppState = {
  user: null,
  demandas: [],
  usuarios: [],
  statusAAlterar: null,
  idDemandaAAlterar: null
};

// DISPARADOR INICIAL
document.addEventListener("DOMContentLoaded", () => {
  verificarSessaoSalva();
  configurarEventosNavegacao();
  configurarFormularios();
  configurarModais();
});

// GERENCIAMENTO DE SESSÃO LOCAL
function verificarSessaoSalva() {
  const session = localStorage.getItem("gdo_user_session");
  if (session) {
    AppState.user = JSON.parse(session);
    entrarNoSistema();
  }
}

function entrarNoSistema() {
  document.getElementById("screen-login").classList.add("hidden");
  document.getElementById("main-layout").classList.remove("hidden");
  document.getElementById("user-display-name").innerText = AppState.user.nome;
  document.getElementById("user-display-perfil").innerText = AppState.user.perfil;
  
  // Bloqueia ou exibe abas administrativas conforme perfil
  if (AppState.user.perfil !== "Administrador") {
    document.querySelectorAll(".adm-only").forEach(el => el.classList.add("hidden"));
  } else {
    document.querySelectorAll(".adm-only").forEach(el => el.classList.remove("hidden"));
  }
  carregarDadosPainel();
}

// NAVEGAÇÃO ENTRE ABAS (SPA)
function configurarEventosNavegacao() {
  document.querySelectorAll(".menu-item").forEach(item => {
    item.addEventListener("click", (e) => {
      if (item.id === "btn-logout") return;
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
    localStorage.removeItem("gdo_user_session");
    AppState.user = null;
    location.reload();
  });
}

// COMUNICAÇÃO COM O GOOGLE APPS SCRIPT
async function chamarBackend(action, payload = {}) {
  try {
    const authEmail = AppState.user ? AppState.user.email : "";
    const corpo = JSON.stringify({
      action,
      payload: { ...payload, authEmail }
    });

    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: corpo
    });

    const resJson = await response.json();
    if (!resJson.success) throw new Error(resJson.error);
    return resJson.data;
  } catch (error) {
    alert("Erro na Operação: " + error.message);
    throw error;
  }
}

// SUBMISSÕES DE FORMULÁRIOS
function configurarFormularios() {
  // Login
  document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = await chamarBackend("login", {
      email: document.getElementById("login-email").value,
      senha: document.getElementById("login-senha").value
    });
    if (user) {
      AppState.user = user;
      localStorage.setItem("gdo_user_session", JSON.stringify(user));
      entrarNoSistema();
    }
  });

  // Salvar Demanda
  document.getElementById("form-demanda").addEventListener("submit", async (e) => {
    e.preventDefault();
    await chamarBackend("salvarDemanda", {
      demanda: {
        id: document.getElementById("demanda-id").value,
        titulo: document.getElementById("demanda-titulo-input").value,
        categoria: document.getElementById("demanda-categoria").value,
        prioridade: document.getElementById("demanda-prioridade").value,
        responsavelPrincipal: document.getElementById("demanda-responsavel").value,
        prazo: document.getElementById("demanda-prazo").value,
        responsaveisAdicionais: document.getElementById("demanda-adicionais").value,
        descricao: document.getElementById("demanda-descricao").value
      }
    });
    fecharModais();
    carregarDadosPainel();
  });

  // Salvar Usuário
  document.getElementById("form-usuario").addEventListener("submit", async (e) => {
    e.preventDefault();
    await chamarBackend("gerenciarUsuario", {
      usuario: {
        id: document.getElementById("user-id").value,
        nome: document.getElementById("user-nome").value,
        email: document.getElementById("user-email").value,
        senha: document.getElementById("user-senha").value,
        perfil: document.getElementById("user-perfil").value,
        status: document.getElementById("user-status").value
      }
    });
    fecharModais();
    carregarUsuarios();
  });

  // Confirmar Transição de Status com Observação
  document.getElementById("btn-status-confirmar").addEventListener("click", async () => {
    await chamarBackend("atualizarStatus", {
      id: AppState.idDemandaAAlterar,
      novoStatus: AppState.statusAAlterar,
      observacao: document.getElementById("status-obs-text").value
    });
    fecharModais();
    carregarDadosPainel();
  });

  document.getElementById("btn-recovery").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Contate o gestor de TI ou o administrador do sistema para reset manual de senha na Planilha Base.");
  });
}

// RENDERIZAÇÃO DO DASHBOARD E INDICADORES
async function carregarDadosPainel() {
  const dados = await chamarBackend("buscarDados");
  AppState.demandas = dados.demandas;
  processarIndicadoresEDashboard();
  renderizarQuadroKanban();
}

function processarIndicadoresEDashboard() {
  const ds = AppState.demandas;
  const hojeStr = new Date().toISOString().split('T')[0];
  
  let abertas = 0, andamento = 0, concluidas = 0, atrasadas = 0, hoje = 0, semana = 0;
  let produtividade = {};
  let proximosPrazos = [];

  ds.forEach(d => {
    const status = d["Status"];
    const prazoStr = d["Prazo"] ? new Date(d["Prazo"]).toISOString().split('T')[0] : "";
    const resp = d["Responsável Principal"];

    if (!produtividade[resp]) produtividade[resp] = { todo: 0, doing: 0, done: 0 };

    if (status === "A Fazer") {
      abertas++;
      produtividade[resp].todo++;
      if (prazoStr && prazoStr < hojeStr) atrasadas++;
    } else if (status === "Em Andamento") {
      andamento++;
      produtividade[resp].doing++;
      if (prazoStr && prazoStr < hojeStr) atrasadas++;
    } else if (status === "Concluído") {
      concluidas++;
      produtividade[resp].done++;
      const dtConc = d["Data Conclusão"] ? new Date(d["Data Conclusão"]).toISOString().split('T')[0] : "";
      if (dtConc === hojeStr) hoje++;
      
      const diffDays = Math.ceil(Math.abs(new Date(hojeStr) - new Date(dtConc)) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) semana++;
    }

    if (status !== "Concluído" && prazoStr) {
      proximosPrazos.push({ titulo: d["Título"], prazo: prazoStr, atrasado: prazoStr < hojeStr });
    }
  });

  // Injeta nos cards
  document.getElementById("m-abertas").innerText = abertas;
  document.getElementById("m-andamento").innerText = andamento;
  document.getElementById("m-concluidas").innerText = concluidas;
  document.getElementById("m-atrasadas").innerText = atrasadas;
  document.getElementById("m-hoje").innerText = hoje;
  document.getElementById("m-semana").innerText = semana;

  // Renderiza tabela produtividade
  const tbodyProd = document.querySelector("#table-produtividade tbody");
  tbodyProd.innerHTML = "";
  Object.keys(produtividade).forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${user}</strong></td>
      <td><span class="badge-perfil" style="background:#4A90E2">${produtividade[user].todo}</span></td>
      <td><span class="badge-perfil" style="background:#DF7F24">${produtividade[user].doing}</span></td>
      <td><span class="badge-perfil" style="background:#2ECC71">${produtividade[user].done}</span></td>
    `;
    tbodyProd.appendChild(tr);
  });

  // Renderiza prazos urgentes
  const listaPrazosDiv = document.getElementById("lista-prazos");
  listaPrazosDiv.innerHTML = "";
  proximosPrazos
    .slice(0, 5)
    .sort((a,b) => new Date(a.prazo) - new Date(b.prazo))
    .forEach(p => {
      const div = document.createElement("div");
      div.className = `prazo-item ${p.atrasado ? 'atrasado' : ''}`;
      div.innerHTML = `<span>${p.titulo}</span> <strong ${p.atrasado ? 'style="color:#E74C3C"' : ''}>${formatarDataBr(p.prazo)}</strong>`;
      listaPrazosDiv.appendChild(div);
    });
}

// RENDERIZAÇÃO DO QUADRO KANBAN
function renderizarQuadroKanban() {
  const colTodo = document.getElementById("col-todo");
  const colDoing = document.getElementById("col-doing");
  const colDone = document.getElementById("col-done");
  
  colTodo.innerHTML = ""; colDoing.innerHTML = ""; colDone.innerHTML = "";
  let cTodo = 0, cDoing = 0, cDone = 0;

  AppState.demandas.forEach(d => {
    const card = document.createElement("div");
    card.className = "card-demanda";
    card.innerHTML = `
      <div class="card-meta">
        <span>${d["ID"]}</span>
        <span class="badge-prioridade ${d["Prioridade"]}">${d["Prioridade"]}</span>
      </div>
      <h4>${d["Título"]}</h4>
      <p style="font-size:12px; color:#666">${d["Categoria"]}</p>
      <div class="card-meta" style="margin-top:5px;">
        <span><i class="fa-solid fa-user"></i> ${d["Responsável Principal"].split('@')[0]}</span>
        <span><i class="fa-solid fa-calendar"></i> ${formatarDataBr(d["Prazo"])}</span>
      </div>
      <div class="card-actions" id="actions-${d["ID"]}"></div>
    `;

    const actionsDiv = card.querySelector(`#actions-${d["ID"]}`);
    const status = d["Status"];

    if (status === "A Fazer") {
      cTodo++;
      actionsDiv.innerHTML = `<button class="btn-primary btn-card-xs" onclick="solicitarMudancaStatus('${d["ID"]}', 'Em Andamento')">Iniciar Atividade</button>`;
      if(AppState.user.perfil === "Administrador") {
        card.style.borderLeft = "3px solid #4A90E2";
        card.addEventListener("click", (e) => { if(e.target.tagName !== 'BUTTON') abrirEdicaoDemanda(d); });
      }
      colTodo.appendChild(card);
    }
    else if (status === "Em Andamento") {
      cDoing++;
      actionsDiv.innerHTML = `<button class="btn-primary btn-card-xs" style="background:#2ECC71" onclick="solicitarMudancaStatus('${d["ID"]}', 'Concluído')">Finalizar</button>`;
      if(AppState.user.perfil === "Administrador") {
        card.style.borderLeft = "3px solid #DF7F24";
        card.addEventListener("click", (e) => { if(e.target.tagName !== 'BUTTON') abrirEdicaoDemanda(d); });
      }
      colDoing.appendChild(card);
    }
    else if (status === "Concluído") {
      cDone++;
      card.style.borderLeft = "3px solid #2ECC71";
      card.style.opacity = "0.8";
      if(AppState.user.perfil === "Administrador") {
        actionsDiv.innerHTML = `<button class="btn-secondary btn-card-xs" onclick="solicitarMudancaStatus('${d["ID"]}', 'Em Andamento')">Reabrir</button>`;
        card.addEventListener("click", (e) => { if(e.target.tagName !== 'BUTTON') abrirEdicaoDemanda(d); });
      }
      colDone.appendChild(card);
    }
  });

  document.getElementById("count-todo").innerText = cTodo;
  document.getElementById("count-doing").innerText = cDoing;
  document.getElementById("count-done").innerText = cDone;
}

// SOLICITAÇÃO DE MUDANÇA DE STATUS (ABRE MODAL DE JUSTIFICATIVA)
window.solicitarMudancaStatus = function(id, novoStatus) {
  AppState.idDemandaAAlterar = id;
  AppState.statusAAlterar = novoStatus;
  document.getElementById("status-obs-text").value = "";
  abrirModal("modal-status-obs");
};

// EDIÇÃO DE DEMANDA (ADMINISTRADOR)
function abrirEdicaoDemanda(d) {
  document.getElementById("modal-demanda-titulo").innerText = "Editar Demanda " + d["ID"];
  document.getElementById("demanda-id").value = d["ID"];
  document.getElementById("demanda-titulo-input").value = d["Título"];
  document.getElementById("demanda-categoria").value = d["Categoria"];
  document.getElementById("demanda-prioridade").value = d["Prioridade"];
  document.getElementById("demanda-responsavel").value = d["Responsável Principal"];
  document.getElementById("demanda-prazo").value = d["Prazo"] ? new Date(d["Prazo"]).toISOString().split('T')[0] : "";
  document.getElementById("demanda-adicionais").value = d["Responsáveis Adicionais"];
  document.getElementById("demanda-descricao").value = d["Descrição"];
  document.getElementById("demanda-observacoes-fixas").value = d["Observações"] || "Nenhuma observação técnica registrada.";
  abrirModal("modal-demanda");
}

// CONTROLE DE USUÁRIOS/OPERADORES
async function carregarUsuarios() {
  const users = await chamarBackend("listarUsuarios");
  AppState.usuarios = users;
  const tbody = document.querySelector("#table-users tbody");
  tbody.innerHTML = "";
  
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.ID}</td>
      <td><strong>${u.Nome}</strong></td>
      <td>${u.Email}</td>
      <td>${u.Perfil}</td>
      <td><span class="badge-perfil" style="background:${u.Status === 'Ativo' ? '#2ECC71' : '#E74C3C'}">${u.Status}</span></td>
      <td><button class="btn-secondary btn-card-xs" onclick="abrirEdicaoUsuario('${u.ID}')"><i class="fa-solid fa-pen"></i> Editar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

window.abrirEdicaoUsuario = function(id) {
  const u = AppState.usuarios.find(user => user.ID === id);
  if (!u) return;
  document.getElementById("modal-user-titulo").innerText = "Editar Operador";
  document.getElementById("user-id").value = u.ID;
  document.getElementById("user-nome").value = u.Nome;
  document.getElementById("user-email").value = u.Email;
  document.getElementById("user-senha").value = u.Senha;
  document.getElementById("user-perfil").value = u.Perfil;
  document.getElementById("user-status").value = u.Status;
  abrirModal("modal-usuario");
};

// MANIPULAÇÃO DE MODAIS
function configurarModais() {
  document.getElementById("btn-nova-demanda").addEventListener("click", () => {
    document.getElementById("form-demanda").reset();
    document.getElementById("demanda-id").value = "";
    document.getElementById("modal-demanda-titulo").innerText = "Adicionar Demanda";
    document.getElementById("demanda-observacoes-fixas").value = "";
    abrirModal("modal-demanda");
  });

  document.getElementById("btn-novo-usuario").addEventListener("click", () => {
    document.getElementById("form-usuario").reset();
    document.getElementById("user-id").value = "";
    document.getElementById("modal-user-titulo").innerText = "Novo Usuário";
    abrirModal("modal-usuario");
  });

  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", fecharModais);
  });
}

function abrirModal(id) { document.getElementById(id).classList.remove("hidden"); }
function fecharModais() { document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden")); }

// AUXILIAR: FORMATADOR DE DATA BR (UTC)
function formatarDataBr(dataStr) {
  if (!dataStr) return "-";
  const date = new Date(dataStr);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}
