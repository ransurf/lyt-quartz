import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const actions: Record<string, any> = {
  cta1: {
    defaultTitle: "Title",
    defaultSubtitle: "Subtitle",
    embed: <script async data-uid="439e8b14a6" src="https://wondrous-designer-8526.ck.page/439e8b14a6/index.js"></script>
  }
};

const CallToAction: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const footerTitle = fileData.frontmatter?.footerTitle;
  const footerSubtitle = fileData.frontmatter?.footerSubtitle;
  const ctaType = fileData.frontmatter?.ctaType as string;

  if (ctaType) {
    //get the cta object
    const cta = actions[ctaType];
    return cta && (
      <div class={classNames(displayClass, "cta")}>
        <h3>{footerTitle || cta.defaultTitle}</h3>
        <p>{footerSubtitle || cta.defaultSubtitle}</p>
        {cta.embed}
      </div>
    )
  } else {
    return null
  }
}

export default (() => CallToAction) satisfies QuartzComponentConstructor
