import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.Flex({
      components: [
        { Component: Component.Spacer() },
        {
          Component: Component.InlineSearch(),
          grow: true,
        },
        { Component: Component.Spacer() },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
  ],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/yourusername",
      Twitter: "https://twitter.com/yourusername",
      LinkedIn: "https://linkedin.com/in/yourusername",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.BackButton(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
    Component.ConditionalRender({
      component: Component.PaginatedBlogList({
        title: "",
        postsPerPage: 5,
        filter: (f) => f.slug?.startsWith("posts/") ?? false,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  left: [Component.ProfileHeader(), Component.MobileOnly(Component.Spacer()), Component.Explorer()],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.PaginatedBlogList({
      title: "",
      postsPerPage: 5,
      filter: (f) => f.slug?.startsWith("posts/") ?? false,
    }),
  ],
  left: [Component.ProfileHeader(), Component.MobileOnly(Component.Spacer()), Component.Explorer()],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}
