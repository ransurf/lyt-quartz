import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"
import { ComponentIds } from "./types"
import { displayRelativeDate } from "./scripts/util"

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

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []

      if (fileData.dates) {
        segments.push(displayRelativeDate(getDate(cfg, fileData)!))
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      if (options.showAuthor) {
        segments.push('by Nick Milo')
      }

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      return (
        <i show-comma={options.showSeparator} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </i>
      )
    } else {
      return null
    }
  }

  ContentMetadata.id = ComponentIds.ContentMeta
  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor
