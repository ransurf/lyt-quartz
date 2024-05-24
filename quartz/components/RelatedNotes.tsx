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

// Rest of the code...

export interface RelatedNotesOptions {
  title?: string
  // must match the folder name to render
  path?: string
  showForIndex: boolean
  showForNotes: boolean
  limit: number
  showDates?: boolean
  linkToMore: SimpleSlug | false
  field: string
  sort: (f1: QuartzPluginData, f2: QuartzPluginData) => number
  cta: string
}

const defaultOptions = (cfg: GlobalConfiguration): RelatedNotesOptions => ({
  limit: 3,
  linkToMore: false,
  showForIndex: false,
  showForNotes: false,
  showDates: false,
  field: "related",
  sort: byDateAndAlphabetical(cfg),
  cta: i18n(cfg.locale).components.relatedNotes.seeAll
})

export default ((userOpts?: Partial<RelatedNotesOptions>) => {
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
      // if there is an alias in the link like [[alias|link]] then we need to remove the alias
      let cleanedValue;
      if (value.includes("|")) {
        cleanedValue = value.split("|")[1]
      } else {
        cleanedValue = value
      }
      cleanedValue = cleanedValue.replace(/['"\[\]]+/g, "")
      
      let href = transformLink(fileData.slug!, cleanedValue, opts)

      // split cleanedValue to last part of the path
      let splitValue = cleanedValue.split("/")[cleanedValue.split("/").length - 1]
    
      return (
        <h3>
          <a href={href} class="internal">
            {splitValue}
          </a>
        </h3>
      )
    }

    function shouldRender() {
      if (!userOpts?.path) return true;

      // get last part of slug
      const slugParts = fileData.slug?.split("/")[fileData.slug?.split("/").length - 1];

      const isIndexNote = slugParts && userOpts.path.includes(slugParts);

      if (userOpts.showForIndex && fileData.slug?.startsWith(userOpts.path) && isIndexNote) {
        return true
      }
      if (userOpts.showForNotes && fileData.slug?.startsWith(userOpts.path) && !isIndexNote) {
        return true
      }
      return false
    }

    function replacePlaceholders(cta: string) {
      return cta.replace("{{field}}", String(userOpts?.field))
      // for others
      // return str.replace(/{{(.*?)}}/g, (match, p1) => data[p1.trim()] || '');
    }

    if (!shouldRender()) return null
    const opts = { ...defaultOptions(cfg), ...userOpts }
    const value = fileData.frontmatter?.[opts.field] ?? []
    // const relatedNotes: any[] = [];
    var linkedElements: any[] = []
    var propertyType = Object.prototype.toString.call(value)
    if (propertyType === "[object String]" && (value as string).includes("[[")) {
      //Check if it's a string or string array
      linkedElements.push(createLinkedElement(fileData, transformOpts, value as string))
    } else if (propertyType === "[object Array]") {
      for (const [index, arrayItem] of Object.entries(value ?? {})) {
        // Check if it's an array
        var entry = (value as Array<any>)[Number(index)]
        if (entry.includes("[[")) {
          linkedElements.push(createLinkedElement(fileData, transformOpts, entry))
        } else {
          linkedElements.push(entry)
        }
      }
    }

    return (
      <div class={classNames(displayClass, "related-notes")}>
        <h3 className="component-title">{opts.title ?? i18n(cfg.locale).components.relatedNotes.title}</h3>
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
              {replacePlaceholders(opts.cta)}
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
