const containerCursos = document.getElementById("container-cursos");
const filtroCategoria = document.getElementById("filtro-categoria");
const searchInput = document.getElementById("search");
const toggleThemeBtn = document.getElementById("toggle-theme");
const verInscricoesBtn = document.getElementById("ver-inscricoes");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modal-close");
const modalCancel = document.getElementById("modal-cancel");
const inscricaoForm = document.getElementById("inscricao-form");
const cursoIdInput = document.getElementById("curso-id");
const cursoNomeSpan = document.getElementById("curso-nome");

const modalInscritos = document.getElementById("modal-inscritos");
const modalInscritosClose = document.getElementById("modal-inscritos-close");
const listaInscritosDiv = document.getElementById("lista-inscritos");

const toast = document.getElementById("toast");

let cursos = [];
let inscritos = JSON.parse(localStorage.getItem("inscritos") || "[]");

// Tema
const savedTheme = localStorage.getItem("theme") || "dark";
if (savedTheme === "light") document.body.classList.add("light-theme");

fetch("cursos.json")
  .then((r) => r.json())
  .then((dados) => {
    cursos = dados;
    popularCategorias();
    renderizarCursos(cursos);
  })
  .catch((err) => console.error("Erro ao carregar cursos:", err));

function popularCategorias() {
  const categorias = Array.from(new Set(cursos.map((c) => c.categoria))).sort();
  // remove opções além do primeiro (Todos)
  filtroCategoria.innerHTML = "<option value=\"Todos\">Todos</option>";
  categorias.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filtroCategoria.appendChild(opt);
  });
}

function filtrarEBuscar() {
  const termo = (searchInput.value || "").toLowerCase().trim();
  const categoriaSelecionada = filtroCategoria.value;

  const filtrados = cursos.filter((curso) => {
    const porCategoria = categoriaSelecionada === "Todos" || curso.categoria === categoriaSelecionada;
    const porTitulo = curso.titulo.toLowerCase().includes(termo);
    return porCategoria && porTitulo;
  });

  renderizarCursos(filtrados);
}

searchInput.addEventListener("input", filtrarEBuscar);
filtroCategoria.addEventListener("change", filtrarEBuscar);

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  toggleThemeBtn.textContent = isLight ? "☀️" : "🌙";
});

verInscricoesBtn.addEventListener("click", () => {
  renderInscritosList();
  modalInscritos.classList.remove("hidden");
});

modalInscritosClose.addEventListener("click", () => {
  modalInscritos.classList.add("hidden");
});

function renderizarCursos(listaCursos) {
  containerCursos.innerHTML = "";

  listaCursos.forEach((curso) => {
    const card = document.createElement("article");
    card.className = "card";
    if (curso.vagasEsgotadas) card.classList.add("esgotado");

    const modulosHTML = (curso.modulos || []).map((m) => `<li>${m}</li>`).join("");

    const inscritosCount = inscritos.filter((i) => Number(i.cursoId) === Number(curso.id)).length;

    card.innerHTML = `
      ${curso.vagasEsgotadas ? `<div class="tag">Inscrições Encerradas</div>` : ""}
      <div class="card-header">
        <h2>${curso.titulo}</h2>
        <div class="categoria">${curso.categoria}</div>
      </div>
      <div class="instrutor">👨‍🏫 <strong>${curso.instrutor.nome}</strong> - ${curso.instrutor.experiencia}</div>

      <h3>Módulos:</h3>
      <ul>${modulosHTML}</ul>

      <div class="card-footer">
        ${curso.vagasEsgotadas ? '' : `<button class="btn inscrever" data-id="${curso.id}">Inscrever-se</button>`}
        <span class="inscritos-count">${inscritosCount} inscrito(s)</span>
      </div>
    `;

    containerCursos.appendChild(card);
  });

  // adicionar listeners aos botões de inscrever
  document.querySelectorAll(".inscrever").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.dataset.id);
      openModalParaCurso(id);
    });
  });
}

function openModalParaCurso(cursoId) {
  const curso = cursos.find((c) => Number(c.id) === Number(cursoId));
  if (!curso) return;
  cursoIdInput.value = curso.id;
  cursoNomeSpan.textContent = curso.titulo;
  document.getElementById("nome").value = "";
  document.getElementById("email").value = "";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("nome").focus();
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

modalClose.addEventListener("click", closeModal);
modalCancel.addEventListener("click", closeModal);

inscricaoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cursoId = cursoIdInput.value;
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  if (!nome || !email) {
    showToast("Preencha nome e email para se inscrever.");
    return;
  }

  const curso = cursos.find((c) => Number(c.id) === Number(cursoId));
  const inscricao = {
    id: Date.now(),
    cursoId: cursoId,
    cursoTitulo: curso ? curso.titulo : "-",
    nome,
    email,
    criadoEm: new Date().toISOString(),
  };

  inscritos.push(inscricao);
  localStorage.setItem("inscritos", JSON.stringify(inscritos));
  showToast("Inscrição recebida! 😄");
  closeModal();
  renderizarCursos(cursos);
});

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 3000);
}

function renderInscritosList() {
  if (!inscritos.length) {
    listaInscritosDiv.innerHTML = "<p>Nenhuma inscrição encontrada.</p>";
    return;
  }

  const itens = inscritos
    .slice()
    .reverse()
    .map(
      (i) => `<div class="inscrito-item"><strong>${i.nome}</strong> — ${i.email} <span class="curso-ref">(${i.cursoTitulo})</span></div>`
    )
    .join("");

  listaInscritosDiv.innerHTML = itens;
}

// fechar modais com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!modal.classList.contains("hidden")) closeModal();
    if (!modalInscritos.classList.contains("hidden")) modalInscritos.classList.add("hidden");
  }
});

// Inicializar ícone do botão de tema
toggleThemeBtn.textContent = document.body.classList.contains("light-theme") ? "☀️" : "🌙";