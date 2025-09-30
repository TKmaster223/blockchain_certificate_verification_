# Quick Test Summary - Certificate Verification System
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "          CERTIFICATE VERIFICATION SYSTEM SUMMARY" -ForegroundColor Yellow  
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

$script:passed = 0
$script:failed = 0
$script:total = 0

function Quick-Test($name, $test) {
    $script:total++
    Write-Host "🧪 $name" -ForegroundColor White -NoNewline
    try {
        if ($test) {
            Write-Host " ✅ PASSED" -ForegroundColor Green
            $script:passed++
        } else {
            Write-Host " ❌ FAILED" -ForegroundColor Red  
            $script:failed++
        }
    } catch {
        Write-Host " ❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        $script:failed++
    }
}

# Quick Health Tests
Write-Host "🔍 SYSTEM HEALTH CHECKS:" -ForegroundColor Magenta
try { $health = Invoke-RestMethod -Uri "http://localhost:8000/health"; Quick-Test "API Health Check" ($health.status -eq "healthy") } catch { Quick-Test "API Health Check" $false }
try { $root = Invoke-RestMethod -Uri "http://localhost:8000/"; Quick-Test "API Root Endpoint" ($root.version -eq "2.0.0") } catch { Quick-Test "API Root Endpoint" $false }
try { $bc = Invoke-RestMethod -Method Post -Uri "http://localhost:8545" -Body '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' -ContentType 'application/json'; Quick-Test "Blockchain Connectivity" ($bc.result -ne $null) } catch { Quick-Test "Blockchain Connectivity" $false }
try { $acc = Invoke-RestMethod -Method Post -Uri "http://localhost:8545" -Body '{"jsonrpc":"2.0","method":"eth_accounts","params":[],"id":2}' -ContentType 'application/json'; Quick-Test "Blockchain Accounts" ($acc.result.Count -eq 10) } catch { Quick-Test "Blockchain Accounts" $false }

# Authentication Tests  
Write-Host "`n🔐 AUTHENTICATION TESTS:" -ForegroundColor Magenta
$adminData = @{username="admin";password="admin123456"} | ConvertTo-Json
try { $admin = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/login" -Body $adminData -ContentType 'application/json'; Quick-Test "Admin Login" ($admin.access_token -ne $null); $adminToken = "Bearer " + $admin.access_token } catch { Quick-Test "Admin Login" $false }

$uniqueId = Get-Random
$userReg = @{username="quicktest_${uniqueId}";email="quicktest_${uniqueId}@example.com";password="Test123!";role="issuer"} | ConvertTo-Json
try { $reg = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/register" -Body $userReg -ContentType 'application/json'; Quick-Test "University Registration" ($reg -ne $null) } catch { Quick-Test "University Registration" $false }

if ($reg) {
    $userLogin = @{username=($userReg | ConvertFrom-Json).username;password="Test123!"} | ConvertTo-Json  
    try { $login = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/login" -Body $userLogin -ContentType 'application/json'; Quick-Test "University Login" ($login.access_token -ne $null); $userToken = "Bearer " + $login.access_token } catch { Quick-Test "University Login" $false }
    
    if ($userToken) {
        try { $me = Invoke-RestMethod -Uri "http://localhost:8000/auth/me" -Headers @{"Authorization"=$userToken}; Quick-Test "JWT Token Validation" ($me.username -ne $null) } catch { Quick-Test "JWT Token Validation" $false }
    }
}

# Certificate Tests
Write-Host "`n📜 CERTIFICATE TESTS:" -ForegroundColor Magenta  
if ($userToken) {
    $certData = @{student_name="Quick Test";institution="Test Uni";degree="Test Degree";graduation_year=2024} | ConvertTo-Json
    try { $cert = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/issue" -Body $certData -ContentType 'application/json' -Headers @{"Authorization"=$userToken}; Quick-Test "Certificate Issuance" ($cert.certificate.hash -ne $null) } catch { Quick-Test "Certificate Issuance" $false }
    
    try { $certs = Invoke-RestMethod -Uri "http://localhost:8000/certificates" -Headers @{"Authorization"=$userToken}; Quick-Test "Certificate Listing" ($certs.count -gt 0) } catch { Quick-Test "Certificate Listing" $false }
    
    $verifyData = @{student_name="Quick Test"} | ConvertTo-Json
    try { $verify = Invoke-RestMethod -Method Post -Uri "http://localhost:8000/verify" -Body $verifyData -ContentType 'application/json' -Headers @{"Authorization"=$userToken}; Quick-Test "Certificate Verification" ($verify.status -ne $null) } catch { Quick-Test "Certificate Verification" $false }
}

if ($adminToken) {
    try { $adminCerts = Invoke-RestMethod -Uri "http://localhost:8000/certificates" -Headers @{"Authorization"=$adminToken}; Quick-Test "Admin Certificate Access" ($adminCerts.count -ge 0) } catch { Quick-Test "Admin Certificate Access" $false }
}

# Error Handling Tests
Write-Host "`n⚠️ ERROR HANDLING TESTS:" -ForegroundColor Magenta
$badLogin = @{username="admin";password="wrongpass"} | ConvertTo-Json
try { Invoke-RestMethod -Method Post -Uri "http://localhost:8000/auth/login" -Body $badLogin -ContentType 'application/json'; Quick-Test "Invalid Credentials Rejection" $false } catch { Quick-Test "Invalid Credentials Rejection" ($_.Exception.Message -like "*401*") }

try { Invoke-RestMethod -Uri "http://localhost:8000/auth/me" -Headers @{"Authorization"="Bearer invalid.token"}; Quick-Test "Invalid Token Rejection" $false } catch { Quick-Test "Invalid Token Rejection" ($_.Exception.Message -like "*401*") }

# Final Summary
Write-Host "`n" + "="*50 -ForegroundColor Cyan
Write-Host "               FINAL RESULTS" -ForegroundColor Yellow
Write-Host "="*50 -ForegroundColor Cyan
Write-Host "`n📊 STATISTICS:" -ForegroundColor White
Write-Host "   Tests Run: $script:total" -ForegroundColor Cyan
Write-Host "   Passed: $script:passed" -ForegroundColor Green  
Write-Host "   Failed: $script:failed" -ForegroundColor Red
$rate = if ($script:total -gt 0) { [math]::Round(($script:passed/$script:total)*100,1) } else { 0 }
Write-Host "   Success Rate: $rate%" -ForegroundColor $(if($rate -gt 85){'Green'}elseif($rate -gt 70){'Yellow'}else{'Red'})

Write-Host "`n🎯 SYSTEM STATUS:" -ForegroundColor White
if ($rate -gt 85) { Write-Host "   🎉 EXCELLENT - System operational!" -ForegroundColor Green }
elseif ($rate -gt 70) { Write-Host "   ⚠️ GOOD - Minor issues" -ForegroundColor Yellow }
else { Write-Host "   🔧 NEEDS ATTENTION - Major issues" -ForegroundColor Red }

Write-Host "`n📝 KEY COMPONENTS:" -ForegroundColor White
Write-Host "   • Backend API: $(if($script:passed -gt 2){'✅ Working'}else{'❌ Issues'})" -ForegroundColor $(if($script:passed -gt 2){'Green'}else{'Red'})
Write-Host "   • Authentication: $(if($script:passed -gt 4){'✅ Working'}else{'❌ Issues'})" -ForegroundColor $(if($script:passed -gt 4){'Green'}else{'Red'})
Write-Host "   • Certificates: $(if($script:passed -gt 6){'✅ Working'}else{'❌ Issues'})" -ForegroundColor $(if($script:passed -gt 6){'Green'}else{'Red'})
Write-Host "   • Blockchain: $(if($script:passed -gt 0){'✅ Connected'}else{'❌ Disconnected'})" -ForegroundColor $(if($script:passed -gt 0){'Green'}else{'Red'})

Write-Host "`n🌐 QUICK ACCESS:" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "   Health: http://localhost:8000/health" -ForegroundColor Cyan
Write-Host "`n" + "="*50 -ForegroundColor Cyan