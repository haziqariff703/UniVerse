$path = 'c:\Users\Muhammad Haziq\UniVerse\.agent\rules\antigravityreactrules.md'
$snippetPath = 'c:\Users\Muhammad Haziq\UniVerse\snippet.txt'
$snippet = Get-Content $snippetPath -Raw
$content = Get-Content $path -Raw
# Normalized replacement
$newContent = $content.Replace('</instructions>', $snippet + "`r`n</instructions>")
Set-Content -Path $path -Value $newContent -Encoding UTF8
Write-Host "Rules updated successfully."
