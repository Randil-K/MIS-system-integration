# Self-contained PowerShell script to run the Spring Boot backend
# This will download a portable version of Maven if it is not already present,
# then compile and launch the Spring Boot application on port 8080.

$MavenVersion = "3.9.6"
$MavenDir = "$PSScriptRoot\.maven"
$MavenZip = "$PSScriptRoot\maven.zip"
$MavenBin = "$MavenDir\apache-maven-$MavenVersion\bin\mvn.cmd"

# Check if Java is installed
try {
    $javaCheck = java -version 2>&1
    if ($javaCheck -like "*not recognized*") {
        Write-Error "Java 21 or higher is required but not found in your PATH. Please install Java and try again."
        exit 1
    }
} catch {
    Write-Error "Java 21 or higher is required but not found in your PATH. Please install Java and try again."
    exit 1
}

# Download and install Maven portably if not already present
if (!(Test-Path $MavenBin)) {
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    Write-Host "Maven not found. Downloading portable Maven $MavenVersion..." -ForegroundColor Green
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    
    $Url = "https://archive.apache.org/dist/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip"
    
    # Create the Maven directory if it doesn't exist
    New-Item -ItemType Directory -Force -Path $MavenDir | Out-Null
    
    # Download zip file
    Invoke-WebRequest -Uri $Url -OutFile $MavenZip
    
    Write-Host "Extracting Maven..." -ForegroundColor Green
    Expand-Archive -Path $MavenZip -DestinationPath $MavenDir -Force
    
    # Clean up zip
    Remove-Item $MavenZip -Force
    Write-Host "Maven setup completed successfully!" -ForegroundColor Green
}

Write-Host "--------------------------------------------------" -ForegroundColor Cyan
Write-Host "Starting Spring Boot Backend..." -ForegroundColor Green
Write-Host "H2 database will be available at http://localhost:8080/h2-console" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to terminate." -ForegroundColor Cyan
Write-Host "--------------------------------------------------" -ForegroundColor Cyan

# Run Maven Spring Boot target
& $MavenBin spring-boot:run
