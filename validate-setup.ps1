# Quickstart Validation Script for Windows PowerShell
# This script validates the setup steps from quickstart.md

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Top 10 Programming Languages - Setup Validator" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0

# Function to check command exists
function Test-Command {
  param($Command)
  try {
    Get-Command $Command -ErrorAction Stop | Out-Null
    return $true
  }
  catch {
    return $false
  }
}

# Function to check port availability
function Test-Port {
  param($Port)
  $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -InformationLevel Quiet
  return -not $connection
}

Write-Host "1. PREREQUISITES CHECK" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
if (Test-Command "node") {
  $nodeVersion = node --version
  Write-Host " ✓ $nodeVersion" -ForegroundColor Green
  # Check if version >= 18
  $versionNum = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
  if ($versionNum -lt 18) {
    Write-Host "  ⚠ Warning: Node.js version should be 18.x or higher" -ForegroundColor Yellow
    $WarningCount++
  }
}
else {
  Write-Host " ✗ Not found" -ForegroundColor Red
  $ErrorCount++
}

# Check npm
Write-Host "Checking npm..." -NoNewline
if (Test-Command "npm") {
  $npmVersion = npm --version
  Write-Host " ✓ v$npmVersion" -ForegroundColor Green
}
else {
  Write-Host " ✗ Not found" -ForegroundColor Red
  $ErrorCount++
}

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -NoNewline
if (Test-Command "psql") {
  $psqlVersion = (psql --version) -replace 'psql \(PostgreSQL\) ([\d.]+).*', '$1'
  Write-Host " ✓ v$psqlVersion" -ForegroundColor Green
}
else {
  Write-Host " ✗ Not found (or not in PATH)" -ForegroundColor Red
  $ErrorCount++
}

# Check PHP
Write-Host "Checking PHP..." -NoNewline
if (Test-Command "php") {
  $phpVersion = (php --version | Select-Object -First 1) -replace 'PHP ([\d.]+).*', '$1'
  Write-Host " ✓ v$phpVersion" -ForegroundColor Green
}
else {
  Write-Host " ⚠ Not found (optional for PHP landing page)" -ForegroundColor Yellow
  $WarningCount++
}

# Check Git
Write-Host "Checking Git..." -NoNewline
if (Test-Command "git") {
  $gitVersion = (git --version) -replace 'git version ([\d.]+).*', '$1'
  Write-Host " ✓ v$gitVersion" -ForegroundColor Green
}
else {
  Write-Host " ✗ Not found" -ForegroundColor Red
  $ErrorCount++
}

Write-Host ""
Write-Host "2. PROJECT STRUCTURE CHECK" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow
Write-Host ""

$requiredDirs = @(
  "backend",
  "frontend",
  "php-web",
  "mobile-app",
  "docs",
  "specs"
)

foreach ($dir in $requiredDirs) {
  Write-Host "Checking $dir/..." -NoNewline
  if (Test-Path $dir) {
    Write-Host " ✓ Exists" -ForegroundColor Green
  }
  else {
    Write-Host " ✗ Missing" -ForegroundColor Red
    $ErrorCount++
  }
}

Write-Host ""
Write-Host "3. BACKEND VALIDATION" -ForegroundColor Yellow
Write-Host "=====================" -ForegroundColor Yellow
Write-Host ""

# Check backend files
Write-Host "Checking backend/package.json..." -NoNewline
if (Test-Path "backend/package.json") {
  Write-Host " ✓ Exists" -ForegroundColor Green
}
else {
  Write-Host " ✗ Missing" -ForegroundColor Red
  $ErrorCount++
}

Write-Host "Checking backend/.env.example..." -NoNewline
if (Test-Path "backend/.env.example") {
  Write-Host " ✓ Exists" -ForegroundColor Green
}
else {
  Write-Host " ✗ Missing" -ForegroundColor Red
  $ErrorCount++
}

Write-Host "Checking backend/.env..." -NoNewline
if (Test-Path "backend/.env") {
  Write-Host " ✓ Exists" -ForegroundColor Green
    
  # Check DATABASE_URL
  $envContent = Get-Content "backend/.env" -Raw
  if ($envContent -match "DATABASE_URL") {
    Write-Host "  DATABASE_URL found" -ForegroundColor DarkGreen
  }
  else {
    Write-Host "  ⚠ Warning: DATABASE_URL not configured" -ForegroundColor Yellow
    $WarningCount++
  }
    
  if ($envContent -match "JWT_SECRET") {
    Write-Host "  JWT_SECRET found" -ForegroundColor DarkGreen
  }
  else {
    Write-Host "  ⚠ Warning: JWT_SECRET not configured" -ForegroundColor Yellow
    $WarningCount++
  }
}
else {
  Write-Host " ⚠ Not found (copy from .env.example)" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host "Checking backend/node_modules..." -NoNewline
if (Test-Path "backend/node_modules") {
  Write-Host " ✓ Dependencies installed" -ForegroundColor Green
}
else {
  Write-Host " ⚠ Dependencies not installed (run: npm install)" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host "Checking Prisma schema..." -NoNewline
if (Test-Path "backend/prisma/schema.prisma") {
  Write-Host " ✓ Exists" -ForegroundColor Green
}
else {
  Write-Host " ✗ Missing" -ForegroundColor Red
  $ErrorCount++
}

Write-Host "Checking Prisma client..." -NoNewline
if (Test-Path "backend/node_modules/.prisma/client") {
  Write-Host " ✓ Generated" -ForegroundColor Green
}
else {
  Write-Host " ⚠ Not generated (run: npx prisma generate)" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host ""
Write-Host "4. FRONTEND VALIDATION" -ForegroundColor Yellow
Write-Host "======================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Checking frontend/package.json..." -NoNewline
if (Test-Path "frontend/package.json") {
  Write-Host " ✓ Exists" -ForegroundColor Green
}
else {
  Write-Host " ✗ Missing" -ForegroundColor Red
  $ErrorCount++
}

Write-Host "Checking frontend/.env.local..." -NoNewline
if (Test-Path "frontend/.env.local") {
  Write-Host " ✓ Exists" -ForegroundColor Green
    
  # Check NEXT_PUBLIC_API_URL
  $envContent = Get-Content "frontend/.env.local" -Raw
  if ($envContent -match "NEXT_PUBLIC_API_URL") {
    Write-Host "  NEXT_PUBLIC_API_URL found" -ForegroundColor DarkGreen
  }
  else {
    Write-Host "  ⚠ Warning: NEXT_PUBLIC_API_URL not configured" -ForegroundColor Yellow
    $WarningCount++
  }
}
else {
  Write-Host " ⚠ Not found (create with NEXT_PUBLIC_API_URL)" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host "Checking frontend/node_modules..." -NoNewline
if (Test-Path "frontend/node_modules") {
  Write-Host " ✓ Dependencies installed" -ForegroundColor Green
}
else {
  Write-Host " ⚠ Dependencies not installed (run: npm install)" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host "Checking Next.js config..." -NoNewline
if (Test-Path "frontend/next.config.js") {
  Write-Host " ✓ Exists" -ForegroundColor Green
}
else {
  Write-Host " ⚠ Missing next.config.js" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host ""
Write-Host "5. PHP LANDING PAGE VALIDATION" -ForegroundColor Yellow
Write-Host "===============================" -ForegroundColor Yellow
Write-Host ""

Write-Host "Checking php-web/public/index.php..." -NoNewline
if (Test-Path "php-web/public/index.php") {
  Write-Host " ✓ Exists" -ForegroundColor Green
}
else {
  Write-Host " ⚠ Missing" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host "Checking php-web/composer.json..." -NoNewline
if (Test-Path "php-web/composer.json") {
  Write-Host " ✓ Exists" -ForegroundColor Green
}
else {
  Write-Host " ⚠ Missing composer.json" -ForegroundColor Yellow
  $WarningCount++
}

Write-Host ""
Write-Host "6. DOCUMENTATION VALIDATION" -ForegroundColor Yellow
Write-Host "===========================" -ForegroundColor Yellow
Write-Host ""

$docFiles = @(
  "README.md",
  "docs/ARCHITECTURE.md",
  "docs/DEPLOYMENT.md",
  "docs/TROUBLESHOOTING.md",
  "docs/api-specification.yaml"
)

foreach ($doc in $docFiles) {
  Write-Host "Checking $doc..." -NoNewline
  if (Test-Path $doc) {
    Write-Host " ✓ Exists" -ForegroundColor Green
  }
  else {
    Write-Host " ⚠ Missing" -ForegroundColor Yellow
    $WarningCount++
  }
}

Write-Host ""
Write-Host "7. PORT AVAILABILITY CHECK" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow
Write-Host ""

$ports = @{
  "3001" = "Backend API"
  "3000" = "Frontend"
  "5432" = "PostgreSQL"
  "8000" = "PHP Landing"
}

foreach ($port in $ports.Keys) {
  Write-Host "Checking port $port ($($ports[$port]))..." -NoNewline
  if (Test-Port $port) {
    Write-Host " ✓ Available" -ForegroundColor Green
  }
  else {
    Write-Host " ⚠ In use" -ForegroundColor Yellow
    $WarningCount++
  }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
  Write-Host "All checks passed! You are ready to start development." -ForegroundColor Green
  Write-Host ""
  Write-Host "Next steps:" -ForegroundColor Cyan
  Write-Host "1. cd backend && npm install" -ForegroundColor White
  Write-Host "2. npx prisma generate && npx prisma migrate deploy" -ForegroundColor White
  Write-Host "3. npm run prisma:seed" -ForegroundColor White
  Write-Host "4. npm run dev (in backend/)" -ForegroundColor White
  Write-Host "5. cd ../frontend && npm install && npm run dev" -ForegroundColor White
}
elseif ($ErrorCount -eq 0) {
  Write-Host "Validation completed with $WarningCount warning(s)." -ForegroundColor Yellow
  Write-Host "  Review warnings above and fix if necessary." -ForegroundColor Yellow
}
else {
  Write-Host "Validation failed with $ErrorCount error(s) and $WarningCount warning(s)." -ForegroundColor Red
  Write-Host "  Please fix the errors above before proceeding." -ForegroundColor Red
}

Write-Host ""
Write-Host "For detailed setup instructions, see:" -ForegroundColor Cyan
Write-Host "  - specs/001-fullstack-web-mobile/quickstart.md" -ForegroundColor White
Write-Host "  - README.md" -ForegroundColor White
Write-Host "  - docs/DEPLOYMENT.md" -ForegroundColor White
Write-Host ""

exit $ErrorCount
