import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.PageTitle(),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/jackyzha0/quartz",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.Properties(),
    Component.TagList(),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    // Component.Darkmode(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Writing",
        limit: 4,
        filter: (f) =>
          f.slug!.startsWith("writings/") && f.slug! !== "writings/index" && !f.frontmatter?.noindex,
        linkToMore: "writings/" as SimpleSlug,
      }),
    ),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Related Writing",
        path: "maps",
        limit: 4,
        filter: (f) =>
          Boolean(f.slug!.startsWith("writings/") && f.slug! !== "writings/index" && f.frontmatter?.tags?.includes("thinking")),
        linkToMore: "writings/" as SimpleSlug,
      }),
    ),
  Component.DesktopOnly(
    Component.RecentNotes({
      title: "Recent Ideas",
      limit: 2,
      filter: (f) => f.slug!.startsWith("ideas/"),
      linkToMore: "ideas/" as SimpleSlug,
    }),
  ),
  Component.DesktopOnly(
    Component.Search()
  ),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    // Component.Darkmode(),
    // if in tag can see related writings on the side
    Component.RecentNotes({
      title: "Related Writing",
      path: "maps",
      limit: 4,
      filter: (f) =>
        Boolean(f.slug!.startsWith("writings/") && f.slug! !== "writings/index" && f.frontmatter?.categories?.includes("thinking")),
      linkToMore: "writings/" as SimpleSlug,
    }),
  ],
  right: [],
}
