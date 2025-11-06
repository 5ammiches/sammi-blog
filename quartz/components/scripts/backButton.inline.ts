// Export to satisfy module requirements
export {}

function initializeBackButton() {
  const backButton = document.getElementById("back-button")
  if (!backButton) return

  // Remove any existing listeners to prevent duplicates
  const newButton = backButton.cloneNode(true) as HTMLElement
  if (backButton.parentNode) {
    backButton.parentNode.replaceChild(newButton, backButton)
  }

  newButton.addEventListener("click", (event) => {
    event.preventDefault()

    // Simple approach: just go to posts folder
    // This is more predictable than trying to navigate back
    const postsUrl = new URL("/posts/", window.location.origin)

    if ((window as any).spaNavigate) {
      ;(window as any).spaNavigate(postsUrl, false)
    } else {
      window.location.href = "/posts/"
    }
  })
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBackButton)
} else {
  initializeBackButton()
}

// Re-initialize on SPA navigation
document.addEventListener("nav", () => {
  setTimeout(initializeBackButton, 100)
})
