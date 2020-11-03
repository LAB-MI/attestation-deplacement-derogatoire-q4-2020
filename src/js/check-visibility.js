// on visibility change reload page to refresh date
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    window.location.reload()
  }
})
