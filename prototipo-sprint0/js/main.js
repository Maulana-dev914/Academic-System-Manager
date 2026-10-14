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

  // ---------- 0. Armazenamento seguro (nunca rebenta sem sessão) ----------
  function guardar(chave, valor) {
    try { sessionStorage.setItem(chave, valor); } catch (e) { /* sem sessão: segue sem guardar */ }
  }
  function ler(chave) {
    try { return sessionStorage.getItem(chave); } catch (e) { return null; }
  }
  function apagar(chave) {
    try { sessionStorage.removeItem(chave); } catch (e) { /* nada a fazer */ }
  }

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
    // Fechar ao tocar fora da barra (telemóvel)
    document.addEventListener("click", function (e) {
      if (document.body.classList.contains("menu-aberto") &&
          !barra.contains(e.target) && e.target !== botaoMenu && !botaoMenu.contains(e.target)) {
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
    try { return JSON.parse(ler("sessao")); }
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
        if (caixaErro.focus) caixaErro.focus();
        return;
      }
      guardar("sessao", JSON.stringify({ email: email, nome: conta.nome, perfil: conta.perfil }));
      var destino = new URLSearchParams(window.location.search).get("redirect");
      window.location.href = destino || conta.destino;
    });
  }

  // ---------- 5. Sair (terminar sessão simulada) ----------
  document.querySelectorAll("[data-sair]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      apagar("sessao");
      apagar("selecao");
      apagar("preInscricao");
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
      var primeira = partes[0] ? partes[0][0] : "";
      var ultima = partes.length > 1 && partes[partes.length - 1] ? partes[partes.length - 1][0] : "";
      el.textContent = (primeira + ultima).toUpperCase();
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
            var rotulo = campo.id ? form.querySelector("label[for='" + campo.id + "']") : null;
            var nome = rotulo ? rotulo.textContent.replace("*", "").trim() : (campo.name || "campo");
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = campo.id ? "#" + campo.id : "#";
            a.textContent = nome + ": " + (campo.validationMessage || "valor inválido");
            li.appendChild(a);
            lista.appendChild(li);
            var bloco = campo.closest ? campo.closest(".campo") : null;
            if (bloco) bloco.classList.add("campo-erro");
          });
          resumo.hidden = false;
          if (resumo.focus) resumo.focus();
        }
        if (invalidos[0] && invalidos[0].focus) invalidos[0].focus();
      } else if (resumo) {
        resumo.hidden = true;
      }
    });
    // Limpa o destaque ao corrigir
    form.addEventListener("input", function (e) {
      var bloco = e.target.closest ? e.target.closest(".campo") : null;
      if (bloco && e.target.validity && e.target.validity.valid) {
        bloco.classList.remove("campo-erro");
      }
    });
  });

  // ---------- 9. Data de nascimento: intervalo calculado (RV05) ----------
  var nascimento = document.getElementById("nascimento");
  if (nascimento) {
    var hoje = new Date();
    var iso = function (d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    };
    var max = new Date(hoje.getFullYear() - 16, hoje.getMonth(), hoje.getDate());
    var min = new Date(hoje.getFullYear() - 80, hoje.getMonth(), hoje.getDate());
    nascimento.min = iso(min);
    nascimento.max = iso(max);
  }

  // ---------- 10. Confirmação de palavra-passe ----------
  var senha1 = document.getElementById("senha-nova");
  var senha2 = document.getElementById("senha-conf");
  if (senha1 && senha2) {
    var conferir = function () {
      senha2.setCustomValidity(senha2.value !== senha1.value ? "As palavras-passe não coincidem." : "");
    };
    senha1.addEventListener("input", conferir);
    senha2.addEventListener("input", conferir);
  }

  // ---------- 11. Pré-inscrição: cria conta simulada e avança ----------
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
        guardar("sessao", JSON.stringify({ nome: nome, perfil: "estudante" }));
      }
      guardar("preInscricao", JSON.stringify({
        nome: nome,
        codigo: document.getElementById("codigo").value.trim(),
        curso: document.getElementById("curso").value,
        ano: document.getElementById("ano").value
      }));
      window.location.href = "selecionar-disciplinas.html";
    });
  }

  // ---------- 12. Seleção de disciplinas (RF24) ----------
  // Preenche o contexto com a pré-inscrição, se existir
  var ctxCurso = document.getElementById("ctx-curso");
  if (ctxCurso) {
    try {
      var pre = JSON.parse(ler("preInscricao") || "null");
      if (pre) {
        if (pre.curso) ctxCurso.textContent = pre.curso;
        if (pre.ano) document.getElementById("ctx-ano").textContent = pre.ano + ".º ano";
        if (pre.nome) document.getElementById("ctx-nome").textContent = pre.nome;
      }
    } catch (e) { /* mantém os dados de exemplo */ }
  }
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
        if (aviso.focus) aviso.focus();
        return;
      }
      var lista = [];
      marcadas.forEach(function (c) {
        lista.push({ codigo: c.value, nome: c.getAttribute("data-nome"), creditos: c.getAttribute("data-creditos") });
      });
      guardar("selecao", JSON.stringify(lista));
    });
  }

  // ---------- 13. Guia: preencher + imprimir ----------
  if (document.getElementById("guia-doc")) {
    try {
      var preG = JSON.parse(ler("preInscricao") || "null");
      var sel = JSON.parse(ler("selecao") || "null");
      if (preG && document.getElementById("guia-nome")) {
        if (preG.nome) document.getElementById("guia-nome").textContent = preG.nome;
        if (preG.codigo) document.getElementById("guia-codigo").textContent = preG.codigo;
      }
      if (sel && sel.length && document.getElementById("guia-disciplinas")) {
        var corpo = document.getElementById("guia-disciplinas");
        corpo.innerHTML = "";
        var total = 0;
        sel.forEach(function (d) {
          total += parseInt(d.creditos, 10);
          var tr = document.createElement("tr");
          var td1 = document.createElement("td"); td1.textContent = d.codigo;
          var td2 = document.createElement("td"); td2.textContent = d.nome;
          var td3 = document.createElement("td"); td3.textContent = d.creditos;
          tr.appendChild(td1); tr.appendChild(td2); tr.appendChild(td3);
          corpo.appendChild(tr);
        });
        document.getElementById("guia-total").textContent = sel.length + " · " + total + " créditos";
      }
    } catch (e) { /* mantém os dados de exemplo */ }
    var btnImprimir = document.getElementById("btn-imprimir");
    if (btnImprimir) btnImprimir.addEventListener("click", function () { window.print(); });
  }

  // ---------- 14. Cancelar inscrição (demonstra RN24 + diálogo) ----------
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
          if (ok) { ok.hidden = false; if (ok.focus) ok.focus(); }
        };
      }
    });
  });

  // ---------- 15. Pesquisa do topo (decorativa no protótipo) ----------
  var pesquisa = document.getElementById("pesquisa-topo");
  if (pesquisa) pesquisa.addEventListener("submit", function (e) { e.preventDefault(); });

})();
