import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/articleTitle.scss"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  const subtitle = fileData.frontmatter?.subtitle
  const isDisabled = fileData.frontmatter?.disableTitle
  if (title && !isDisabled) {
    return (
      <div>
        <h1 className={classNames(displayClass, "article-title")}>{title}</h1>
        {subtitle && <h2 className="article-subtitle">{subtitle}</h2>}
      </div>
    )
  } else {
    return null
  }
}

ArticleTitle.css = style

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
