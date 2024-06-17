import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { FullSlug, MainPaths, TransformOptions } from "../util/path"
import { cleanedValue } from "../util/frontmatterLinks"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { ComponentIds } from "./types"
import { displayRelativeDate } from "./scripts/util"
import { CircleArrowUp } from "lucide-preact"
import { classNames } from "../util/lang"

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showAuthor: boolean
  showSeparator: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: true,
  showAuthor: true,
  showSeparator: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, allFiles, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    const renderAuthor = () => {
      if (options.showAuthor) {
        const author = fileData.frontmatter?.author
        const authorText = author ? `by ${author}` : null
        return (
          <span>{authorText}</span>
        )
      }
    }

    const renderReadingTime = () => {
      if (!text || !fileData.slug?.startsWith(`${MainPaths.WRITINGS}/`)) {
        return <div></div>;
      }

      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        return <span>{displayedTime}</span>
      }
    }

    const renderUpLinks = () => {
      const transformOpts: TransformOptions = {
        strategy: "shortest",
        allSlugs: allFiles.map((fp) => fp.slug as FullSlug),
      }

      function createLinkedElement(fileData: any, opts: any, value: string) {
        // if there is an alias in the link like [[alias|link]] then we need to remove the alias
        const {
          href,
          splitValue
        } = cleanedValue(value, fileData, transformOpts)
      
        return (
          <a href={href} class="internal no-background">
            {splitValue}
          </a>
        )
      }

      const value = fileData.frontmatter?.["up"] ?? []
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
            if (Number(index) > 0) {
              linkedElements.push(" ")
            }
            linkedElements.push(createLinkedElement(fileData, transformOpts, entry))
          } else {
            linkedElements.push(entry)
          }
        }
      }

      if (linkedElements.length > 0) {
        return (
          <>
            {linkedElements &&
              <div className="content-meta-element horizontal">
                <CircleArrowUp size={16} />
                {linkedElements}
              </div>}
          </>
        )
      } else {
        return <div></div>
      }
      
    }

    const renderDates = () => {
      if (fileData.dates && fileData.slug?.startsWith(`${MainPaths.WRITINGS}/`)) {
        const createdDate = displayRelativeDate(getDate(cfg, fileData)!)
        return (
          <span>emerged {createdDate}</span>
        )
      } else {
        return <div></div>
      }
    };

    return (
      <div className={classNames(displayClass, "content-meta-container")}>
        <div className="content-meta-row">
          {renderAuthor()}
          {renderReadingTime()}
        </div>
        <hr className="content-meta-divider"/>
        <div className="content-meta-row">
          {renderUpLinks()}
          {renderDates()}
        </div>
      </div>
      
    )
  }

  ContentMetadata.id = ComponentIds.ContentMeta
  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
