# SCM-IMS Backend Launcher Script
# 1. Detect Java Home
$jdkPath = ""
if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
    $jdkPath = $env:JAVA_HOME
} else {
    # Try Eclipse Adoptium (Temurin JDK)
    if (Test-Path "C:\Program Files\Eclipse Adoptium") {
        $jdks = Get-ChildItem -Path "C:\Program Files\Eclipse Adoptium" -Filter "jdk-*"
        if ($jdks.Count -gt 0) {
            $jdkPath = $jdks[0].FullName
        }
    }
    # Try standard C:\Program Files\Java
    if ($jdkPath -eq "" -and (Test-Path "C:\Program Files\Java")) {
        $jdks = Get-ChildItem -Path "C:\Program Files\Java" -Filter "jdk-*"
        if ($jdks.Count -gt 0) {
            $jdkPath = $jdks[0].FullName
        }
    }
}
if ($jdkPath -eq "") {
    Write-Error "No JDK installation found. Please install Java 17+ or set JAVA_HOME."
    Read-Host "Press Enter to exit..."
    exit
}
Write-Host "Using JDK path: $jdkPath"
$env:JAVA_HOME = $jdkPath

# 2. Path to Maven (locate logistics maven to save space, or download if missing)
$logisticsMvn = "c:\Users\randi\OneDrive\Desktop\MIS system int\LogesticAndShipmentModule\backend\.maven\apache-maven-3.9.6\bin\mvn.cmd"
$localMvn = Join-Path $PSScriptRoot ".maven\apache-maven-3.9.6\bin\mvn.cmd"

if (Test-Path $logisticsMvn) {
    $mvnPath = $logisticsMvn
    Write-Host "Reusing Logistics module portable Maven: $mvnPath"
} elseif (Test-Path $localMvn) {
    $mvnPath = $localMvn
    Write-Host "Using local portable Maven: $mvnPath"
} else {
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    Write-Host "Maven not found. Downloading portable Maven 3.9.6..." -ForegroundColor Green
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    
    $MavenVersion = "3.9.6"
    $MavenDir = Join-Path $PSScriptRoot ".maven"
    $MavenZip = Join-Path $PSScriptRoot "maven.zip"
    $Url = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
    
    # Create the Maven directory if it doesn't exist
    New-Item -ItemType Directory -Force -Path $MavenDir | Out-Null
    
    # Download zip file
    Invoke-WebRequest -Uri $Url -OutFile $MavenZip
    
    Write-Host "Extracting Maven..." -ForegroundColor Green
    Expand-Archive -Path $MavenZip -DestinationPath $MavenDir -Force
    
    # Clean up zip
    Remove-Item $MavenZip -Force
    $mvnPath = $localMvn
    Write-Host "Maven setup completed successfully!" -ForegroundColor Green
}

Write-Host "Starting Spring Boot backend..."
& $mvnPath spring-boot:run