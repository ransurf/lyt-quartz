import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/backlinks.scss"
import { resolveRelative, simplifySlug } from "../util/path"
import { i18n } from "../i18n"
import { classNames } from "../util/lang"
import { GlobalConfiguration } from "../cfg"

interface Options {
  // for blogs, render at the bottom of the page
  renderAtBottom: boolean
}

const defaultOptions = {
  renderAtBottom: false,
}

export default ((userOpts?: Partial<Options>) => {
  const Backlinks: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
    cfg,
  }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }
    if (
      fileData.slug &&
      // bottom render is for blogs
      ((opts.renderAtBottom && !fileData.slug.startsWith("blog")) ||
      // side render is for everything else
        (!opts.renderAtBottom && fileData.slug.startsWith("blog")))
    )
      return null
    const slug = simplifySlug(fileData.slug!)
    const backlinkFiles = allFiles.filter((file) => file.links?.includes(slug))
    return (
      <div class={classNames(displayClass, "backlinks")}>
        <h3 className="component-title">{i18n(cfg.locale).components.backlinks.title}</h3>
        <ul class="overflow">
          {backlinkFiles.length > 0 ? (
            backlinkFiles.map((f) => (
              <li>
                <a href={resolveRelative(fileData.slug!, f.slug!)} class="internal">
                  {f.frontmatter?.title}
                </a>
              </li>
            ))
          ) : (
            <li>{i18n(cfg.locale).components.backlinks.noBacklinksFound}</li>
          )}
        </ul>
      </div>
    )
  }

  Backlinks.css = style

  return Backlinks
}) satisfies QuartzComponentConstructor
