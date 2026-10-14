# public/ — Única raiz web do sistema real (Sprints 1–4)

> Estado: **vazio de propósito**. É a única pasta exposta pelo Apache (ADR-9):
> todo o PHP e SQL vivem fora daqui, em `app/` e `database/`.

| Pasta/Ficheiro | Vai conter |
|---|---|
| `index.php` | Front controller do CodeIgniter 4 (único ponto de entrada) |
| `css/` · `js/` · `img/` | Evolução de `prototipo-sprint0/css|js|img` |
