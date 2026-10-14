# Academic-System-Manager

Sistema Web de Gestão Académica — **Universidade Rovuma** (Grupo 1).
Licenciatura em Informática (4.º ano) · Fundamentos de HTML5 · Assignment 2.

Autores: Hélio Azarias Banze e Isac Maulana Maulana · Entrega: 20 de outubro de 2026.

## Estrutura de diretórios

```
Academic-System-Manager/
├── README.md                  ← este ficheiro
└── prototipo-sprint0/         ★ Protótipo funcional (entrega 20 out)
    ├── index.html             ← página inicial (porta de entrada)
    ├── paginas/               ← restantes páginas
    │   ├── cursos.html        ← oferta de cursos (pública)
    │   ├── login.html         ← entrar + criar conta
    │   ├── inscricao.html     ← pré-inscrição / criar conta (RF06+RF26)
    │   ├── selecionar-disciplinas.html  ← escolher disciplinas (RF24)
    │   ├── guia.html          ← Guia de Pré-Inscrição → PDF (RF25)
    │   ├── disciplinas.html   ← consulta (exige sessão)
    │   ├── area-estudante.html
    │   ├── minhas-inscricoes.html
    │   ├── perfil.html
    │   ├── estudantes.html    ← maquete (só Secretaria/Admin)
    │   └── painel.html        ← maquete do dashboard
    ├── css/
    │   └── estilos.css        ← folha única: variáveis, Flexbox/Grid, responsivo
    ├── js/
    │   └── main.js            ← menu, login simulado, erros, guia (sem libs)
    └── img/                   ← imagens ≤ 100 KB
```

> Regra: `index.html` fica na raiz do protótipo (é a porta de entrada);
> todas as outras páginas vivem em `paginas/` e usam `../css` e `../js`.

## Como correr

```bash
cd prototipo-sprint0
python3 -m http.server 8000
```

Abrir: <http://localhost:8000> (também funciona abrindo o `index.html` direto).

## Contas de demonstração (protótipo: autenticação simulada)

| Perfil | Email | Senha |
|---|---|---|
| Administrador | admin@rovuma.ac.mz | Rovuma2026! |
| Secretaria | secretaria@rovuma.ac.mz | Rovuma2026! |
| Estudante | aida.macuacua@rovuma.ac.mz | Rovuma2026! |

## Sistema real (Sprints 1–4)

Depois do Assignment 2, o sistema completo (CodeIgniter 4 + MySQL) será
organizado em `app/` (Controllers, Models, Views, Filters), `public/`
(raiz web), `database/` (migrações + seed), `docs/` (evidências) e `tests/`.
