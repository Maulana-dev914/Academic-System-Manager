# app/ — Código PHP do sistema real

> Estado: **vazio de propósito**. Preenchido nas Sprints 1–4 (a partir de 21 out),
> com CodeIgniter 4 + MySQL. O protótipo do Assignment 2 vive em
> `prototipo-sprint0/` e **não** depende desta pasta.

| Pasta | Vai conter |
|---|---|
| `Controllers/` (+ `Admin/`) | Recebem pedidos, verificam perfil, chamam Models (RF02, RF11–RF16, RF24–RF25) |
| `Models/` | Único lugar com SQL (PDO preparado, RT10) |
| `Views/{layout,home,estudante,admin}/` | HTML5 da equipa (evolução do protótipo) |
| `Filters/` | Sessão + RBAC no servidor (RT12) |
| `Libraries/` (+ `Pagamentos/`) | Auth + adaptador M-Pesa/e-Mola/Simulado (R2) |
| `Config/` | Rotas, BD, pagamentos (segredos só em `config.local.php`, fora do Git) |
