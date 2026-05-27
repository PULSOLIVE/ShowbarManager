# GitFlow — ShowbarManager

## Branches principais

main
Branch estável, usada para versões oficiais e produção.

develop
Branch principal de desenvolvimento.

## Fluxo recomendado

Todo desenvolvimento deve sair da branch develop.

## Criar nova feature

```powershell
git checkout develop
git pull
git checkout -b feature/nome-da-feature