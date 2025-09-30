# Nigerian Dataset Loader for Certificate Verification System
Write-Host "=================================================================" -ForegroundColor DarkCyan
Write-Host "         NIGERIAN UNIVERSITY CERTIFICATE DATASET LOADER" -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor DarkCyan
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host ""

$issuerUsername = "nigeria_issuer"
$issuerEmail = "registrar@nigeriauni.ng"
$issuerPassword = "NaijaCert2025!"

function Invoke-JsonPost {
    param(
        [string]$Uri,
        [object]$Body,
        [hashtable]$Headers = @{}
    )
    $json = $Body | ConvertTo-Json -Depth 6
    return Invoke-RestMethod -Method Post -Uri $Uri -Body $json -ContentType 'application/json' -Headers $Headers
}

# Step 1: Register issuer if needed
Write-Host "🔹 Ensuring issuer account exists ($issuerUsername)" -ForegroundColor Magenta
$registerPayload = [pscustomobject]@{
    username = $issuerUsername
    email    = $issuerEmail
    password = $issuerPassword
    role     = "issuer"
}
try {
    Invoke-JsonPost -Uri "http://localhost:8000/auth/register" -Body $registerPayload | Out-Null
    Write-Host "   ✅ Issuer registered" -ForegroundColor Green
} catch {
    $message = $_.Exception.Message
    if ($message -like "*409*") {
        Write-Host "   INFO: Issuer already registered (HTTP 409)" -ForegroundColor Yellow
    } else {
        throw
    }
}

# Step 2: Login to retrieve JWT token
Write-Host "🔹 Authenticating issuer" -ForegroundColor Magenta
$loginPayload = [pscustomobject]@{
    username = $issuerUsername
    password = $issuerPassword
}
$loginResponse = Invoke-JsonPost -Uri "http://localhost:8000/auth/login" -Body $loginPayload
$token = "Bearer " + $loginResponse.access_token
Write-Host "   ✅ Issuer authenticated. Token expires in $($loginResponse.expires_in) seconds" -ForegroundColor Green

# Step 3: Define Nigerian certificate dataset
Write-Host "🔹 Preparing Nigerian certificate test dataset" -ForegroundColor Magenta
$dataset = @(
    [ordered]@{student_name="Adeola Balogun"; institution="University of Lagos"; degree="B.Sc. Computer Science"; graduation_year=2022; cgpa=4.45; reg_number="UNILAG/CSC/2022/045"; honours="First Class"; state_of_origin="Lagos"},
    [ordered]@{student_name="Chinedu Okafor"; institution="University of Nigeria, Nsukka"; degree="B.Eng. Electrical Engineering"; graduation_year=2021; cgpa=4.17; reg_number="UNN/ENG/2021/132"; honours="Second Class Upper"; state_of_origin="Anambra"},
    [ordered]@{student_name="Fatima Musa"; institution="Ahmadu Bello University"; degree="LL.B. Law"; graduation_year=2020; cgpa=4.02; reg_number="ABU/LAW/2020/088"; honours="Second Class Upper"; state_of_origin="Kaduna"},
    [ordered]@{student_name="Ifeanyi Nwosu"; institution="University of Ibadan"; degree="MBBS Medicine"; graduation_year=2023; cgpa=4.72; reg_number="UI/MED/2023/064"; honours="Distinction"; state_of_origin="Imo"},
    [ordered]@{student_name="Kehinde Adeyemi"; institution="Obafemi Awolowo University"; degree="B.Arch Architecture"; graduation_year=2021; cgpa=4.09; reg_number="OAU/ARC/2021/057"; honours="Second Class Upper"; state_of_origin="Osun"},
    [ordered]@{student_name="Hauwa Balarabe"; institution="University of Maiduguri"; degree="B.Sc. Nursing Science"; graduation_year=2022; cgpa=4.35; reg_number="UNIMAID/NUR/2022/023"; honours="First Class"; state_of_origin="Borno"},
    [ordered]@{student_name="Timi Ojumah"; institution="Covenant University"; degree="B.Sc. Information Technology"; graduation_year=2024; cgpa=4.89; reg_number="CU/IT/2024/014"; honours="First Class"; state_of_origin="Delta"},
    [ordered]@{student_name="Zainab Aliyu"; institution="Bayero University Kano"; degree="B.Sc. Economics"; graduation_year=2022; cgpa=4.21; reg_number="BUK/ECO/2022/101"; honours="Second Class Upper"; state_of_origin="Kano"},
    [ordered]@{student_name="Emeka Eze"; institution="Federal University of Technology Minna"; degree="B.Eng. Civil Engineering"; graduation_year=2023; cgpa=4.33; reg_number="FUTMINNA/CE/2023/076"; honours="First Class"; state_of_origin="Enugu"},
    [ordered]@{student_name="Aisha Salihu"; institution="University of Ilorin"; degree="B.Sc. Mass Communication"; graduation_year=2021; cgpa=4.05; reg_number="UNILORIN/MASS/2021/119"; honours="Second Class Upper"; state_of_origin="Kwara"}
)
Write-Host "   ✅ Dataset contains $($dataset.Count) certificates" -ForegroundColor Green

# Step 4: Issue certificates and capture hashes
$results = @()
$headers = @{"Authorization"=$token}
Write-Host "🔹 Issuing certificates on blockchain-backed registry" -ForegroundColor Magenta
foreach ($entry in $dataset) {
    try {
        $response = Invoke-JsonPost -Uri "http://localhost:8000/issue" -Body $entry -Headers $headers
        $hash = $response.certificate.hash
        $verifyPayload = [pscustomobject]@{ hash = $hash }
        try {
            $verifyResponse = Invoke-JsonPost -Uri "http://localhost:8000/verify" -Body $verifyPayload -Headers $headers
            $verificationStatus = $verifyResponse.status
        } catch {
            $verificationStatus = "Error: $($_.Exception.Message)"
        }
        $results += [pscustomobject]@{
            Student       = $entry.student_name
            Institution   = $entry.institution
            Degree        = $entry.degree
            GradYear      = $entry.graduation_year
            CGPA          = $entry.cgpa
            Hash          = $hash
            Verification  = $verificationStatus
        }
        Write-Host "   ✅ Issued: $($entry.student_name) ($hash)" -ForegroundColor Green
    } catch {
        Write-Host "   ❌ Failed to issue for $($entry.student_name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 5: Retrieve full certificate list and map hashes
Write-Host "🔹 Retrieving certificates for hash validation" -ForegroundColor Magenta
try {
    $allCerts = Invoke-RestMethod -Method Get -Uri "http://localhost:8000/certificates" -Headers $headers
    $hashLookup = @{}
    foreach ($cert in $allCerts.certificates) {
        $hashLookup[$cert.hash] = $cert
    }
    foreach ($row in $results) {
        if ($hashLookup.ContainsKey($row.Hash)) {
            $row | Add-Member -NotePropertyName "Retrieved" -NotePropertyValue "Yes" -Force
        } else {
            $row | Add-Member -NotePropertyName "Retrieved" -NotePropertyValue "No" -Force
        }
    }
    Write-Host "   ✅ Retrieved $($allCerts.count) certificate records" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Failed to retrieve certificates: $($_.Exception.Message)" -ForegroundColor Red
}

# Step 6: Output dataset summary
Write-Host ""
Write-Host "==================== DATASET SUMMARY ====================" -ForegroundColor DarkCyan
$results | Format-Table -AutoSize
Write-Host "=========================================================" -ForegroundColor DarkCyan

Write-Host ""
Write-Host 'Dataset hashes can be used to populate testing tables or appendices.' -ForegroundColor Gray