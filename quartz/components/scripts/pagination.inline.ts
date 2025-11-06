document.addEventListener("nav", () => {
  initializePagination()
})

// Export to satisfy module requirements
export {}

function initializePagination() {
  function getCurrentPage(): number {
    const urlParams = new URLSearchParams(window.location.search)
    const page = parseInt(urlParams.get("page") || "1", 10)
    return isNaN(page) || page < 1 ? 1 : page
  }

  function updatePaginationContent() {
    const container = document.querySelector(".paginated-blog-list")
    if (!container) return

    // Get the posts data from a data attribute we'll set
    const postsDataElement = container.querySelector("[data-posts]")
    if (!postsDataElement) return

    try {
      const allPosts = JSON.parse(postsDataElement.getAttribute("data-posts") || "[]")
      const postsPerPage = parseInt(postsDataElement.getAttribute("data-posts-per-page") || "5", 10)

      const currentPage = getCurrentPage()
      const totalPosts = allPosts.length
      const totalPages = Math.ceil(totalPosts / postsPerPage)
      const startIndex = (currentPage - 1) * postsPerPage
      const endIndex = startIndex + postsPerPage
      const currentPosts = allPosts.slice(startIndex, endIndex)

      // Update the posts display
      const postsContainer = container.querySelector(".blog-posts")
      if (postsContainer) {
        postsContainer.innerHTML = currentPosts
          .map(
            (post: any) => `
          <article class="blog-post">
            <div class="post-content">
              <h3 class="post-title">
                <a href="${post.url}" class="internal">${post.title}</a>
              </h3>
              <div class="post-meta">
                ${post.date ? `<time class="post-date">${post.date}</time>` : ""}
              </div>
              ${post.description ? `<p class="post-description">${post.description}</p>` : ""}
              ${
                post.tags && post.tags.length > 0
                  ? `
                <div class="post-tags">
                  ${post.tags.map((tag: any) => `<a class="tag-link" href="/tags/${tag}">#${tag}</a>`).join("")}
                </div>
              `
                  : ""
              }
            </div>
          </article>
        `,
          )
          .join("")
      }

      // Update pagination controls
      updatePaginationControls(currentPage, totalPages)
    } catch (e) {
      console.error("Failed to parse posts data:", e)
    }
  }

  function updatePaginationControls(currentPage: number, totalPages: number) {
    const pagination = document.querySelector(".pagination") as HTMLElement
    if (!pagination || totalPages <= 1) {
      if (pagination) pagination.style.display = "none"
      return
    }

    pagination.style.display = "flex"

    const basePath = window.location.pathname

    const generatePageNumbers = (current: number, total: number): (number | string)[] => {
      const pages: (number | string)[] = []
      const maxVisible = 5

      if (total <= maxVisible) {
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        if (current > 3) pages.push("...")

        const start = Math.max(2, current - 1)
        const end = Math.min(total - 1, current + 1)

        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== total) pages.push(i)
        }

        if (current < total - 2) pages.push("...")
        if (total > 1) pages.push(total)
      }

      return pages
    }

    const pageNumbers = generatePageNumbers(currentPage, totalPages)

    const paginationContent = pagination.querySelector(".pagination-content")
    if (paginationContent) {
      paginationContent.innerHTML = `
        <a class="pagination-btn pagination-prev ${currentPage === 1 ? "disabled" : ""}"
           href="${currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : "#"}">
          <span class="pagination-icon">‹</span>
          <span class="pagination-text">Previous</span>
        </a>
        ${pageNumbers
          .map((pageNum, index) => {
            if (pageNum === "...") {
              return `<span class="pagination-ellipsis" key="ellipsis-${index}"><span>⋯</span></span>`
            }
            return `
            <a class="pagination-btn pagination-number ${pageNum === currentPage ? "active" : ""}"
               href="${pageNum === 1 ? basePath : `${basePath}?page=${pageNum}`}">
              ${pageNum}
            </a>
          `
          })
          .join("")}
        <a class="pagination-btn pagination-next ${currentPage === totalPages ? "disabled" : ""}"
           href="${currentPage < totalPages ? `${basePath}?page=${currentPage + 1}` : "#"}">
          <span class="pagination-text">Next</span>
          <span class="pagination-icon">›</span>
        </a>
      `
    }
  }

  // Handle pagination clicks
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement
    const paginationBtn = target.closest(".pagination-btn")

    if (!paginationBtn || paginationBtn.classList.contains("disabled")) {
      return
    }

    const href = paginationBtn.getAttribute("href")
    if (!href || href === "#") {
      event.preventDefault()
      return
    }

    // Prevent default and handle navigation
    event.preventDefault()

    // Update URL and trigger content update
    const url = new URL(href, window.location.origin)
    history.pushState({}, "", url)
    updatePaginationContent()
  })

  // Listen for browser navigation (back/forward buttons)
  window.addEventListener("popstate", () => {
    updatePaginationContent()
  })

  // Listen for SPA navigation events
  document.addEventListener("nav", () => {
    setTimeout(updatePaginationContent, 50)
  })

  // Initialize on page load
  updatePaginationContent()
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePagination)
} else {
  initializePagination()
}
