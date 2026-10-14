# database/ — Esquema MySQL versionado (Sprints 1–4)

> Estado: **vazio de propósito**. Criado na Sprint 1. Nunca se edita a BD
> à mão em produção — só por migrações (RT09, RT15).

| Ficheiro/Pasta | Vai conter |
|---|---|
| `migracoes/001_esquema_inicial.sql` | 16 tabelas do núcleo (Release 1) |
| `migracoes/002_pagamentos.sql` | 6 tabelas do módulo de pagamentos (Release 2) |
| `seed.sql` | Dados de demonstração (§3.9: cursos, disciplinas, estudantes, contas) |
| `migrar.php` | Aplica as migrações por ordem |
