import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"
import { SimpleSlug } from "./quartz/util/path"
import { byAlphabetical } from "./quartz/components/PageList"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    // Component.PageTitle(),
    Component.Navbar(),
  ],
  footer: Component.Footer({
    columns: [
    {
      title: "Resources",
      links: [
        { title: "Ideaverse", link: "https://start.linkingyourthinking.com/ideaverse-for-obsidian" },
        { title: "Obsidian Flight School", link: "https://www.linkingyourthinking.com/obsidian-flight-school" },
        { title: "How to Work a Book", link: "https://www.linkingyourthinking.com/how-to-work-a-book" },
        { title: "LYT Workshop", link: "https://www.linkingyourthinking.com/workshop" },
        { title: "Writing Original Works", link: "https://www.linkingyourthinking.com/wow-workshop" },
      ]
    },
    {
      title: "Socials",
      links: [
        { title: "Youtube", link: "https://linkingyourthinking.com/youtube" },
        { title: "Podcast", link: "https://podcast.linkingyourthinking.com/" },
        { title: "Twitter", link: "https://twitter.com/the_LYT_way" },
      ]
    },
    {
      title: "Company",
      links: [
        { title: "Contact Us", link: "contact" },
        { title: "About LYT", link: "about" },
      ]
    }
  ]
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.Properties(),
    // Component.TagList(),
  ],
  afterBody: [
    Component.RelatedNotesContainer({
      title: "",
      path: "writings",
      showForIndex: true,
      showForNotes: true,
      limit: 5,
      field: "",
      linkToMore: "writings/" as SimpleSlug,
      cta: "See all"
    }),
  ],
  left: [
    Component.MobileOnly(Component.Spacer()),
    // Component.Darkmode(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "Recent Writing",
        showDates: true,
        limit: 4,
        filter: (f) =>
          f.slug!.startsWith("writings/") && f.slug! !== "writings/index" && !f.frontmatter?.noindex,
        linkToMore: "writings/" as SimpleSlug,
      }),
    ),
    // Component.DesktopOnly(
    //   Component.RecentNotes({
    //     title: "Related Writing",
    //     path: "maps",
    //     limit: 4,
    //     filter: (f) =>
    //       Boolean(f.slug!.startsWith("writings/") && f.slug! !== "writings/index"),
    //     linkToMore: "writings/" as SimpleSlug,
    //   }),
    // ),
  Component.DesktopOnly(
    Component.RecentNotes({
      title: "Recent Notes",
      showDates: true,
      limit: 2,
      filter: (f) => f.slug!.startsWith("notes/"),
      linkToMore: "notes/" as SimpleSlug,
    }),
  ),
  Component.DesktopOnly(
    Component.Search()
  ),
  ],
  right: [
    Component.AboutAuthor(),
    Component.DesktopOnly(
      Component.RecentNotes({
        title: "All Maps",
        path: "maps",
        limit: 5,
        filter: (f) =>
          Boolean(f.slug!.startsWith("maps/") && f.slug! !== "maps/index"),
        sort: byAlphabetical(),
      }),
    ),
    Component.DesktopOnly(
      Component.RelatedNotes({
        title: "Related Maps",
        path: "writings",
        showForNotes: true,
        limit: 4,
        field: "up",
        linkToMore: "maps/" as SimpleSlug,
        cta: "See all →"
      }),
    ),
    Component.DesktopOnly(
      Component.RelatedNotes({
        title: "Related Writing",
        path: "writings",
        showForNotes: true,
        limit: 4,
        field: "related",
        linkToMore: "writings/" as SimpleSlug,
        cta: "See all →"
      }),
    ),
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  afterBody: [],
  left: [
    Component.MobileOnly(Component.Spacer()),
    // Component.Darkmode(),
  ],
  right: [],
}
