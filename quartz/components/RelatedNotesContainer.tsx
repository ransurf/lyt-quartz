import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/relatedNotes.scss"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import { ComponentIds } from "./types"
import RelatedNotes, { RelatedNotesOptions } from "./RelatedNotes"
import { FullSlug, SimpleSlug, transformLink, TransformOptions } from "../util/path"

const defaultOptions = (cfg: GlobalConfiguration): RelatedNotesOptions => ({
  limit: 3,
  linkToMore: false,
  showForIndex: false,
  showForNotes: false,
  showDates: false,
  field: "related",
  sort: byDateAndAlphabetical(cfg),
  cta: i18n(cfg.locale).components.relatedNotes.seeAll,
})

export default ((userOpts?: Partial<RelatedNotesOptions>) => {
  const RelatedNotesContainer: QuartzComponent = (props: QuartzComponentProps) => {
    // check if folder is found in the slug

    const { fileData, allFiles, cfg, displayClass } = props
    const opts = { ...defaultOptions(cfg), ...userOpts }

    const transformOpts: TransformOptions = {
      strategy: "shortest",
      allSlugs: allFiles.map((fp) => fp.slug as FullSlug),
    }

    function createLinkedElement(fieldName: string) {
      //change userOpts field to fieldName and create
      let href = transformLink(fileData.slug!, fieldName, transformOpts)
      const elementOpts = {
        opts,
        field: fieldName,
        title: fieldName,
        linkToMore: `${href}` as SimpleSlug,
        cta: `Read more writings on ${fieldName} →`,
      }


      const RelatedNotesComponent = RelatedNotes(elementOpts)
      return <RelatedNotesComponent {...props} />
    }

    // function shouldRender() {
    //   if (!userOpts?.path) return true;

    //   if (showForIndex && fileData.slug?.startsWith(userOpts.path) && fileData.slug === "index") {
    //     return true
    //   }
    //   if (showForNotes && fileData.slug?.startsWith(userOpts.path) && fileData.slug !== "index") {
    //     return true
    //   }
    //   return false
    // }

    // if (!shouldRender()) return null
    const value = fileData.frontmatter?.["afterBodyFields"] ?? []
    var relatedNotesViews: any[] = []
    var propertyType = Object.prototype.toString.call(value)
    if (propertyType === "[object String]" && (value as string).includes("[[")) {
      //Check if it's a string or string array
      relatedNotesViews.push(createLinkedElement(value as string))
    } else if (propertyType === "[object Array]") {
      for (const [index, arrayItem] of Object.entries(value ?? {})) {
        // Check if it's an array
        var entry = (value as Array<any>)[Number(index)]
        relatedNotesViews.push(createLinkedElement(entry))
      }
    }

    return (
      <div class={classNames(displayClass, "related-notes-container")}>
        {relatedNotesViews.map((noteView, index) => (
          <div key={index}>{noteView}</div>
        ))}
      </div>
    )
  }

  RelatedNotesContainer.id = ComponentIds.RelatedNotesContainer
  RelatedNotesContainer.css = style
  return RelatedNotesContainer
}) satisfies QuartzComponentConstructor
