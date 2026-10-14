# Academic-System-Manager

Sistema Web de Gestão Académica — **Universidade Rovuma** (Grupo 1).
Licenciatura em Informática (4.º ano) · Fundamentos de HTML5 · Assignment 2.

Autores: Hélio Azarias Banze e Isac Maulana Maulana · Entrega: 20 de outubro de 2026.

## Estrutura de diretórios

```
Academic-System-Manager/
├── README.md                  ← este ficheiro
├── .gitignore                 ← vendor/, segredos locais, logs
│
├── prototipo-sprint0/         ★ EM CONSTRUÇÃO — entrega 20 out (HTML+CSS+JS)
│   ├── index.html             ← página inicial (porta de entrada)
│   ├── paginas/               ← restantes páginas (cursos, login, …)
│   ├── css/estilos.css        ← folha única: variáveis, Flexbox/Grid, responsivo
│   ├── js/main.js             ← menu, login simulado, erros (sem bibliotecas)
│   └── img/                   ← imagens ≤ 100 KB
│
├── app/                       ○ SISTEMA REAL — Sprints 1–4 (CodeIgniter 4)
│   ├── Controllers/ (+Admin/) ○  ─┐
│   ├── Models/                ○   │  vazios de propósito:
│   ├── Views/                 ○   ├─ preenchidos a partir
│   ├── Filters/               ○   │  de 21 out (ver
│   ├── Libraries/             ○   │  app/README.md)
│   └── Config/                ○  ─┘
├── public/                    ○ raiz web do sistema real (ver public/README.md)
├── database/                  ○ migrações + seed MySQL (ver database/README.md)
├── docs/                      ○ relatório + evidências dos testes (CT01–CT33)
└── tests/                     ○ guiões de teste (Sprints 1–4)
```

Legenda: ★ em construção agora · ○ preparado para depois (cada pasta tem um README a explicar).

> Regra do protótipo: `index.html` fica na raiz de `prototipo-sprint0/`
> (é a porta de entrada); as outras páginas vivem em `paginas/` e usam
> `../css` e `../js`.

## Como correr o protótipo

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
