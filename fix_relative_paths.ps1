$files = @(
    "src/pages/student/StudentDashboard.jsx",
    "src/pages/student/SettingsModal.jsx",
    "src/pages/student/Profile.jsx",
    "src/pages/student/EditProfileModal.jsx",
    "src/pages/public/News.jsx",
    "src/pages/organizer/Venues.jsx",
    "src/pages/organizer/Speakers.jsx",
    "src/pages/organizer/MyEvents.jsx",
    "src/pages/organizer/EditEvent.jsx",
    "src/pages/organizer/CreateEvent.jsx",
    "src/pages/auth/Signup.jsx",
    "src/pages/auth/Login.jsx",
    "src/components/profile/CertificateUpload.jsx",
    "src/components/organizer/event-dashboard/InsightsPanel.jsx",
    "src/components/organizer/event-dashboard/DashboardStats.jsx",
    "src/components/forms/ClubProposalForm.jsx",
    "src/App.jsx"
)

$importStatement = 'import { API_BASE, API_URL } from "@/config/api";'

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # 1. Add import if missing
        if ($content -notmatch 'from "@/config/api"') {
            $content = "$importStatement`n$content"
            Write-Host "Added API import to $file"
        }
        
        # 2. Replace "/api/ with API_URL + "/
        # Note: We need to be careful not to double replace if someone already manually fixed it partially
        # Also handle template literals: `/api/` -> `${API_URL}/`
        
        # Replace simple strings: "/api/ -> API_URL + "/
        $content = $content -replace '"/api/', 'API_URL + "/'
        
        # Replace template literals: `/api/ -> `${API_URL}/
        $content = $content -replace '`/api/', '`${API_URL}/'
        
        Set-Content $file $content
        Write-Host "Fixed relative paths in $file"
    } else {
        Write-Warning "File not found: $file"
    }
}
