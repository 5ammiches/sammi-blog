import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/paginatedBlogList.scss"
// @ts-ignore
import script from "./scripts/pagination.inline"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"

interface Options {
  title?: string
  postsPerPage: number
  showTags: boolean
  filter: (f: QuartzPluginData) => boolean
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  postsPerPage: 5,
  showTags: true,
  filter: () => true,
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const PaginatedBlogList: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const allPosts = allFiles.filter(opts.filter).sort(opts.sort)

    // Get current page from URL parameters
    const getCurrentPage = (): number => {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search)
        const page = parseInt(urlParams.get("page") || "1", 10)
        return isNaN(page) || page < 1 ? 1 : page
      }
      return 1
    }

    const currentPage = getCurrentPage()
    const totalPosts = allPosts.length
    const totalPages = Math.ceil(totalPosts / opts.postsPerPage)
    const startIndex = (currentPage - 1) * opts.postsPerPage
    const endIndex = startIndex + opts.postsPerPage
    const currentPosts = allPosts.slice(startIndex, endIndex)

    const generatePageNumbers = (): (number | string)[] => {
      const pages: (number | string)[] = []
      const maxVisible = 5

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        if (currentPage > 5) pages.push("...")

        const start = Math.max(2, currentPage - 1)
        const end = Math.min(totalPages - 1, currentPage + 1)

        for (let i = start; i <= end; i++) {
          if (i !== 1 && i !== totalPages) pages.push(i)
        }

        if (currentPage < totalPages - 2) pages.push("...")
        if (totalPages > 1) pages.push(totalPages)
      }

      return pages
    }

    const pageNumbers = generatePageNumbers()

    // Prepare posts data for client-side pagination
    const postsData = allPosts.map((page) => ({
      title: page.frontmatter?.title ?? "Untitled",
      url: resolveRelative(fileData.slug!, page.slug!),
      description: page.frontmatter?.description ?? "",
      tags: page.frontmatter?.tags ?? [],
      date: page.dates ? getDate(cfg, page)?.toString() : null,
    }))

    return (
      <div class={`${displayClass || ""} paginated-blog-list`}>
        <div
          data-posts={JSON.stringify(postsData)}
          data-posts-per-page={opts.postsPerPage.toString()}
          style="display: none;"
        />
        {opts.title && <h2>{opts.title}</h2>}

        <div class="blog-posts">
          {currentPosts.map((page) => {
            const title = page.frontmatter?.title ?? "Untitled"
            const tags = page.frontmatter?.tags ?? []
            const description = page.frontmatter?.description ?? ""

            return (
              <article class="blog-post">
                <div class="post-content">
                  <h3 class="post-title">
                    <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                      {title}
                    </a>
                  </h3>

                  <div class="post-meta">
                    {page.dates && (
                      <time class="post-date">
                        <Date date={getDate(cfg, page)!} locale={cfg.locale} />
                      </time>
                    )}
                  </div>

                  {description && <p class="post-description">{description}</p>}

                  {opts.showTags && tags.length > 0 && (
                    <div class="post-tags">
                      {tags.map((tag) => (
                        <a
                          class="tag-link"
                          href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                        >
                          #{tag}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {totalPages > 1 && (
          <nav class="pagination" role="navigation" aria-label="pagination">
            <div class="pagination-content">
              <a
                class={`pagination-btn pagination-prev ${currentPage === 1 ? "disabled" : ""}`}
                href={currentPage > 1 ? `?page=${currentPage - 1}` : "#"}
              >
                <span class="pagination-icon">‹</span>
                <span class="pagination-text">Previous</span>
              </a>

              {pageNumbers.map((pageNum, index) => {
                if (pageNum === "...") {
                  return (
                    <span class="pagination-ellipsis" key={`ellipsis-${index}`}>
                      <span>⋯</span>
                    </span>
                  )
                }

                return (
                  <a
                    key={pageNum}
                    class={`pagination-btn pagination-number ${pageNum === currentPage ? "active" : ""}`}
                    href={pageNum === 1 ? "/" : `?page=${pageNum}`}
                  >
                    {pageNum}
                  </a>
                )
              })}

              <a
                class={`pagination-btn pagination-next ${currentPage === totalPages ? "disabled" : ""}`}
                href={currentPage < totalPages ? `?page=${currentPage + 1}` : "#"}
              >
                <span class="pagination-text">Next</span>
                <span class="pagination-icon">›</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    )
  }

  PaginatedBlogList.css = style
  PaginatedBlogList.afterDOMLoaded = script
  return PaginatedBlogList
}) satisfies QuartzComponentConstructor
