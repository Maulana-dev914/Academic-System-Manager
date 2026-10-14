// ============================================================================
// Protótipo Sprint 0 — interações simuladas (sem servidor).
// Tudo funciona sem JavaScript, exceto: login simulado, guardas de acesso,
// resumo de erros, seleção de disciplinas e impressão da guia.
//
// Caminhos: index.html está na raiz; as restantes páginas estão em paginas/.
// A variável BASE ajusta os regressos ao início conforme a pasta atual.
// ============================================================================
(function () {
  "use strict";

  var EM_PAGINAS = window.location.pathname.indexOf("/paginas/") !== -1;
  var BASE = EM_PAGINAS ? "../" : "";

  // ---------- 1. Menu móvel (hamburger) ----------
  var botaoMenu = document.getElementById("botao-menu");
  var barra = document.getElementById("barra-lateral");
  if (botaoMenu && barra) {
    botaoMenu.addEventListener("click", function () {
      var aberto = document.body.classList.toggle("menu-aberto");
      botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.body.classList.remove("menu-aberto");
        botaoMenu.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------- 2. Relógio Africa/Maputo (UTC+2) ----------
  var relogio = document.getElementById("relogio");
  if (relogio) {
    var atualizar = function () {
      var agora = new Date(Date.now() + (2 * 60 + new Date().getTimezoneOffset()) * 60000);
      var h = String(agora.getHours()).padStart(2, "0");
      var m = String(agora.getMinutes()).padStart(2, "0");
      relogio.textContent = h + ":" + m + " · GMT+2";
    };
    atualizar();
    setInterval(atualizar, 30000);
  }

  // ---------- 3. Contas de demonstração (seed §3.9) ----------
  var CONTAS = {
    "admin@rovuma.ac.mz": { nome: "Administrador", perfil: "admin", destino: "painel.html" },
    "secretaria@rovuma.ac.mz": { nome: "Secretaria Académica", perfil: "secretaria", destino: "painel.html" },
    "aida.macuacua@rovuma.ac.mz": { nome: "Aida Samuel Macuácua", perfil: "estudante", destino: "area-estudante.html" }
  };
  var SENHA_DEMO = "Rovuma2026!";

  function lerSessao() {
    try { return JSON.parse(sessionStorage.getItem("sessao")); }
    catch (e) { return null; }
  }
  function paginaAtual() {
    var partes = window.location.pathname.split("/");
    return partes[partes.length - 1] || "index.html";
  }

  // ---------- 4. Login simulado ----------
  var formLogin = document.getElementById("form-login");
  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email").value.trim().toLowerCase();
      var senha = document.getElementById("senha").value;
      var conta = CONTAS[email];
      var caixaErro = document.getElementById("erro-login");
      if (!conta || senha !== SENHA_DEMO) {
        caixaErro.hidden = false;
        caixaErro.focus();
        return;
      }
      sessionStorage.setItem("sessao", JSON.stringify({ email: email, nome: conta.nome, perfil: conta.perfil }));
      var destino = new URLSearchParams(window.location.search).get("redirect");
      window.location.href = destino || conta.destino;
    });
  }

  // ---------- 5. Sair (terminar sessão simulada) ----------
  document.querySelectorAll("[data-sair]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      sessionStorage.removeItem("sessao");
      sessionStorage.removeItem("selecao");
      sessionStorage.removeItem("preInscricao");
      window.location.href = BASE + "index.html";
    });
  });

  // ---------- 6. Guardas de acesso (simulam CT09/CT15/CT21) ----------
  // As páginas protegidas vivem em paginas/, tal como o login: o redirect
  // usa apenas o nome do ficheiro.
  var guarda = document.body.getAttribute("data-guarda");
  if (guarda) {
    var sessao = lerSessao();
    var permitidos = guarda.split(",");
    if (!sessao) {
      window.location.href = "login.html?redirect=" + encodeURIComponent(paginaAtual());
    } else if (permitidos.indexOf(sessao.perfil) === -1) {
      var main = document.querySelector("main");
      if (main) {
        main.innerHTML = '<section class="cartao" aria-labelledby="t403">' +
          "<h1 id='t403'>403 — Sem permissão (simulado)</h1>" +
          "<p>O perfil <strong>" + sessao.perfil + "</strong> não tem acesso a esta página. " +
          "No sistema real, esta tentativa ficaria registada na auditoria.</p>" +
          "<p><a class='btn btn-primario' href='" + BASE + "index.html'>Voltar ao início</a></p></section>";
      }
    }
  }

  // ---------- 7. Personalizar nome do utilizador ----------
  var sessaoAtual = lerSessao();
  if (sessaoAtual) {
    document.querySelectorAll("[data-nome-utilizador]").forEach(function (el) {
      el.textContent = sessaoAtual.nome;
    });
    document.querySelectorAll("[data-iniciais]").forEach(function (el) {
      var partes = sessaoAtual.nome.split(" ");
      el.textContent = (partes[0][0] + (partes.length > 1 ? partes[partes.length - 1][0] : "")).toUpperCase();
    });
  }

  // ---------- 8. Resumo de erros em português (RT06) ----------
  document.querySelectorAll("form[data-resumo]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      var resumo = document.getElementById("resumo-erros");
      if (!form.checkValidity()) {
        e.preventDefault();
        var invalidos = Array.prototype.slice.call(form.querySelectorAll(":invalid"));
        var lista = resumo ? resumo.querySelector("ul") : null;
        if (resumo && lista) {
          lista.innerHTML = "";
          invalidos.forEach(function (campo) {
            var rotulo = form.querySelector("label[for='" + campo.id + "']");
            var nome = rotulo ? rotulo.textContent.replace("*", "").trim() : campo.name;
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "#" + campo.id;
            a.textContent = nome + ": " + (campo.validationMessage || "valor inválido");
            li.appendChild(a);
            lista.appendChild(li);
            if (campo.closest(".campo")) campo.closest(".campo").classList.add("campo-erro");
          });
          resumo.hidden = false;
          resumo.focus();
        }
        if (invalidos[0]) invalidos[0].focus();
      } else if (resumo) {
        resumo.hidden = true;
      }
    });
    // Limpa o destaque ao corrigir
    form.addEventListener("input", function (e) {
      if (e.target.validity && e.target.validity.valid && e.target.closest(".campo")) {
        e.target.closest(".campo").classList.remove("campo-erro");
      }
    });
  });

  // ---------- 9. Pré-inscrição: cria conta simulada e avança ----------
  var formInscricao = document.getElementById("form-inscricao");
  if (formInscricao) {
    // Esconde a palavra-passe se já tem sessão (é só para "criar conta")
    var grupoSenha = document.getElementById("grupo-senha");
    if (grupoSenha && lerSessao()) {
      grupoSenha.hidden = true;
      grupoSenha.querySelectorAll("input").forEach(function (i) { i.required = false; });
    }
    formInscricao.addEventListener("submit", function (e) {
      if (!formInscricao.checkValidity()) return; // o resumo de erros trata
      e.preventDefault();
      var nome = document.getElementById("nome").value.trim();
      if (!lerSessao()) {
        sessionStorage.setItem("sessao", JSON.stringify({ nome: nome, perfil: "estudante" }));
      }
      sessionStorage.setItem("preInscricao", JSON.stringify({
        nome: nome,
        codigo: document.getElementById("codigo").value.trim(),
        curso: document.getElementById("curso").value,
        ano: document.getElementById("ano").value
      }));
      window.location.href = "selecionar-disciplinas.html";
    });
  }

  // ---------- 10. Seleção de disciplinas (RF24) ----------
  var formSelecao = document.getElementById("form-selecao");
  if (formSelecao) {
    var resumoSel = document.getElementById("resumo-selecao");
    var atualizarResumo = function () {
      var marcadas = formSelecao.querySelectorAll("input[name='disc']:checked");
      var creditos = 0;
      marcadas.forEach(function (c) { creditos += parseInt(c.getAttribute("data-creditos"), 10); });
      resumoSel.textContent = marcadas.length + " disciplina(s) · " + creditos + " crédito(s)";
    };
    formSelecao.addEventListener("change", atualizarResumo);
    atualizarResumo();
    formSelecao.addEventListener("submit", function (e) {
      var marcadas = formSelecao.querySelectorAll("input[name='disc']:checked");
      if (marcadas.length === 0) {
        e.preventDefault();
        var aviso = document.getElementById("erro-selecao");
        aviso.hidden = false;
        aviso.focus();
        return;
      }
      var lista = [];
      marcadas.forEach(function (c) {
        lista.push({ codigo: c.value, nome: c.getAttribute("data-nome"), creditos: c.getAttribute("data-creditos") });
      });
      sessionStorage.setItem("selecao", JSON.stringify(lista));
    });
  }

  // ---------- 11. Guia: preencher + imprimir ----------
  if (document.getElementById("guia-doc")) {
    try {
      var pre = JSON.parse(sessionStorage.getItem("preInscricao") || "null");
      var sel = JSON.parse(sessionStorage.getItem("selecao") || "null");
      if (pre && document.getElementById("guia-nome")) {
        document.getElementById("guia-nome").textContent = pre.nome;
        document.getElementById("guia-codigo").textContent = pre.codigo;
      }
      if (sel && document.getElementById("guia-disciplinas")) {
        var corpo = document.getElementById("guia-disciplinas");
        corpo.innerHTML = "";
        var total = 0;
        sel.forEach(function (d) {
          total += parseInt(d.creditos, 10);
          var tr = document.createElement("tr");
          tr.innerHTML = "<td>" + d.codigo + "</td><td>" + d.nome + "</td><td>" + d.creditos + "</td>";
          corpo.appendChild(tr);
        });
        document.getElementById("guia-total").textContent = sel.length + " · " + total + " créditos";
      }
    } catch (e) { /* mantém os dados de exemplo */ }
    var btnImprimir = document.getElementById("btn-imprimir");
    if (btnImprimir) btnImprimir.addEventListener("click", function () { window.print(); });
  }

  // ---------- 12. Cancelar inscrição (demonstra RN24 + diálogo) ----------
  document.querySelectorAll("[data-cancelar]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dialogo = document.getElementById("dialogo-cancelar");
      if (dialogo && dialogo.showModal) {
        dialogo.showModal();
        dialogo.querySelector("[data-confirmar]").onclick = function () {
          var linha = btn.closest("tr");
          var pill = linha.querySelector(".pill");
          pill.textContent = "Cancelada";
          pill.className = "pill pill-neutra";
          btn.disabled = true;
          btn.textContent = "Cancelada";
          dialogo.close();
          var ok = document.getElementById("aviso-cancelada");
          if (ok) { ok.hidden = false; ok.focus(); }
        };
      }
    });
  });

  // ---------- 13. Pesquisa do topo (decorativa no protótipo) ----------
  var pesquisa = document.getElementById("pesquisa-topo");
  if (pesquisa) pesquisa.addEventListener("submit", function (e) { e.preventDefault(); });

})();
