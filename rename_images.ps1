# 파일명 앞 번호 제거 스크립트
$folderPath = "M:\샌달\조식이미지DB"
Set-Location $folderPath
Get-ChildItem -File | Where-Object { $_.Name -match '^\d+\s' } | ForEach-Object {
    $newName = $_.Name -replace '^\d+\s', ''
    if (-not (Test-Path $newName)) {
        Rename-Item $_.FullName -NewName $newName
        Write-Output "RENAMED: $($_.Name) -> $newName"
    } else {
        Write-Output "SKIP (already exists): $($_.Name)"
    }
}
Write-Output "Done!"
