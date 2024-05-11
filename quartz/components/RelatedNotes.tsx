import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, SimpleSlug, resolveRelative, transformLink, TransformOptions } from '../util/path';
import { QuartzPluginData } from "../plugins/vfile"
import { byDateAndAlphabetical } from "./PageList"
import style from "./styles/relatedNotes.scss"
import { Date, getDate } from "./Date"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import { ComponentIds } from "./types"

interface Options {
  title?: string
  // must match the folder name to render
  path?: string
  limit: number
  showDates?: boolean
  linkToMore: SimpleSlug | false
  field: string
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

const defaultOptions = (cfg: GlobalConfiguration): Options => ({
  limit: 3,
  linkToMore: false,
  showDates: false,
  field: "related",
  sort: byDateAndAlphabetical(cfg),
})

export default ((userOpts?: Partial<Options>) => {
  const RelatedNotes: QuartzComponent = ({
    allFiles,
    fileData,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    // check if folder is found in the slug

    const transformOpts: TransformOptions = {
      strategy: "shortest",
      allSlugs: allFiles.map((fp) => fp.slug as FullSlug),
    }

    function createLinkedElement(fileData: any, opts: any, value: string) {
      let cleanedValue = value.replace(/['"\[\]]+/g, "")
      let href = transformLink(fileData.slug!, cleanedValue, opts)
    
      return (
        <a href={href} class="internal">
          {cleanedValue}
        </a>
      )
    }

    const shouldRender = userOpts?.path ? fileData.slug?.startsWith(userOpts.path) : true;
    if (!shouldRender) return null
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const value = fileData.frontmatter?.[opts.field] ?? []
    // const relatedNotes: any[] = [];
    var linkedElements: any[] = []
    var propertyType = Object.prototype.toString.call(value)
    if (propertyType === "[object String]" && (value as string).includes("[[")) {
      //Check if it's a string or string array
      linkedElements.push(createLinkedElement(fileData, opts, value as string))
    } else if (propertyType === "[object Array]") {
      for (const [index, arrayItem] of Object.entries(value ?? {})) {
        // Check if it's an array
        var entry = (value as Array<any>)[Number(index)]
        if (entry.includes("[[")) {
          if (Number(index) > 0) {
            linkedElements.push(", ")
          }
          linkedElements.push(createLinkedElement(fileData, transformOpts, entry))
        } else {
          linkedElements.push(entry)
        }
      }
    }

    return (
      <div class={classNames(displayClass, "related-notes")}>
        <h3>{opts.title ?? i18n(cfg.locale).components.relatedNotes.title}</h3>
        <ul class="related-ul">
        <li class="related-li">
                <div class="section">
                  <div class="desc">
                    {linkedElements}
                  </div>
                  {/* Show related categories of a writing */}
                  {/* <ul class="tags">
                    {topics.map((topic) => (
                      <li>
                        <a
                          class="internal link"
                          href={resolveRelative(fileData.slug!, `maps/${topic}` as FullSlug)}
                        >
                          {topic}
                        </a>
                      </li>
                    ))}
                  </ul> */}
                </div>
            </li>
        </ul>
        {opts.linkToMore && (
          <p>
            <a href={resolveRelative(fileData.slug!, opts.linkToMore)}>
              {i18n(cfg.locale).components.relatedNotes.seeAll}
            </a>
          </p>
        )}
      </div>
    )
  }

  RelatedNotes.id = ComponentIds.RelatedNotes
  RelatedNotes.css = style
  return RelatedNotes
}) satisfies QuartzComponentConstructor
