import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (title) {
    return <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  font-family: "Canela Deck", serif;
  font-size: 3rem;
  font-weight: bold;
  margin: 1rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
