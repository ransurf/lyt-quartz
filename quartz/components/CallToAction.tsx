import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FooterNewsletter } from "./FooterNewsletter";
import style from "./styles/callToAction.scss"

const actions: Record<string, any> = {
  cta1: {
    defaultTitle: "Title",
    defaultSubtitle: "Subtitle",
    defaultButton: "Get the Ultimate Primer",
    formId: "6589197"
  },
  cta2: {
    defaultTitle: "CTA2 Title",
    defaultSubtitle: "CTA2 Subtitle",
    defaultButton: "CTA 2 Button",
    formId: "6608546"
  }
};

const CallToAction: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const ctaTitle = fileData.frontmatter?.ctaTitle;
  const ctaSubtitle = fileData.frontmatter?.ctaSubtitle;
  const ctaButton = fileData.frontmatter?.ctaButton;
  const ctaType = fileData.frontmatter?.ctaType as string;
  const ctaFormId = fileData.frontmatter?.ctaFormId as string;

  if (ctaType) {
    //get the cta object
    const cta = actions[ctaType];
    const buttonText = ctaButton || cta.defaultButton
    return cta && (
      <div class={classNames(displayClass, "cta")}>
        <h1 className="cta-title">{ctaTitle || cta.defaultTitle}</h1>
        <p className="cta-subtitle CanelaText-Regular-Web">{ctaSubtitle || cta.defaultSubtitle}</p>
        {/* {cta.embed} */}
        <FooterNewsletter buttonText={ctaButton || buttonText as string} formId={ctaFormId || cta.formId as string}/>
      </div>
    )
  } else {
    return null
  }
}

CallToAction.css = style

export default (() => CallToAction) satisfies QuartzComponentConstructor
