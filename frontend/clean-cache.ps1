# Script para limpar cache do webpack/react-scripts
Write-Host "Limpando cache do webpack..." -ForegroundColor Yellow

# Parar qualquer processo do node que possa estar rodando
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Remover cache do webpack
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache"
    Write-Host "Cache do webpack removido" -ForegroundColor Green
} else {
    Write-Host "Nenhum cache encontrado" -ForegroundColor Gray
}

# Remover cache do build
if (Test-Path ".cache") {
    Remove-Item -Recurse -Force ".cache"
    Write-Host "Cache de build removido" -ForegroundColor Green
}

# Remover pasta build se existir
if (Test-Path "build") {
    Remove-Item -Recurse -Force "build"
    Write-Host "Pasta build removida" -ForegroundColor Green
}

# Remover cache do npm também
if (Test-Path "$env:APPDATA\npm-cache") {
    Write-Host "Cache do npm encontrado (não removido por segurança)" -ForegroundColor Gray
}

Write-Host "`nCache limpo com sucesso! Agora execute: npm start" -ForegroundColor Green
Write-Host "NOTA: Certifique-se de que o arquivo index.tsx existe em src/" -ForegroundColor Yellow

