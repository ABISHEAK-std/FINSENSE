// Clear FinSense AI Credentials Script
// Run this in your browser's developer console to clear all stored credentials

console.log('🧹 Clearing FinSense AI credentials...');

// Clear all localStorage items related to authentication
const keysToRemove = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && (
    key.includes('finsense') || 
    key.includes('icp') || 
    key.includes('auth') ||
    key.includes('identity') ||
    key.includes('principal')
  )) {
    keysToRemove.push(key);
  }
}

// Remove all identified keys
keysToRemove.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Removed: ${key}`);
});

// Also clear sessionStorage
const sessionKeysToRemove = [];
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  if (key && (
    key.includes('finsense') || 
    key.includes('icp') || 
    key.includes('auth') ||
    key.includes('identity') ||
    key.includes('principal')
  )) {
    sessionKeysToRemove.push(key);
  }
}

sessionKeysToRemove.forEach(key => {
  sessionStorage.removeItem(key);
  console.log(`✅ Removed from session: ${key}`);
});

console.log('🎉 All credentials cleared! Please refresh the page.');
console.log(`📊 Removed ${keysToRemove.length} localStorage items and ${sessionKeysToRemove.length} sessionStorage items`);

// Optional: Reload the page
if (confirm('Reload the page now?')) {
  window.location.reload();
}
