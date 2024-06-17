import { render } from "preact-render-to-string"
import { QuartzComponent, QuartzComponentProps } from "./types"
import HeaderConstructor from "./Header"
import BodyConstructor from "./Body"
import { JSResourceToScriptElement, StaticResources } from "../util/resources"
import { clone, FullSlug, MainPaths, RelativeURL, joinSegments, normalizeHastElement } from "../util/path"
import { visit } from "unist-util-visit"
import { Root, Element, ElementContent } from "hast"
import { GlobalConfiguration } from "../cfg"
import { i18n } from "../i18n"
import { ComponentIds } from "./types"

interface RenderComponents {
  head: QuartzComponent
  header: QuartzComponent[]
  beforeBody: QuartzComponent[]
  pageBody: QuartzComponent
  afterBody: QuartzComponent[]
  left: QuartzComponent[]
  right: QuartzComponent[]
  footer: QuartzComponent
}

const checkIsPathButNotIndex = (slug: FullSlug, path: string) => slug.startsWith(`${path}/`) && slug.split("/")?.[1] !== "index"

const headerRegex = new RegExp(/h[1-6]/)
export function pageResources(
  baseDir: FullSlug | RelativeURL,
  staticResources: StaticResources,
): StaticResources {
  const contentIndexPath = joinSegments(baseDir, "static/contentIndex.json")
  const contentIndexScript = `const fetchData = fetch("${contentIndexPath}").then(data => data.json())`

  return {
    css: [joinSegments(baseDir, "index.css"), ...staticResources.css],
    js: [
      {
        src: joinSegments(baseDir, "prescript.js"),
        loadTime: "beforeDOMReady",
        contentType: "external",
      },
      {
        loadTime: "beforeDOMReady",
        contentType: "inline",
        spaPreserve: true,
        script: contentIndexScript,
      },
      ...staticResources.js,
      {
        src: joinSegments(baseDir, "postscript.js"),
        loadTime: "afterDOMReady",
        moduleType: "module",
        contentType: "external",
      },
    ],
  }
}

export function renderPage(
  cfg: GlobalConfiguration,
  slug: FullSlug,
  componentData: QuartzComponentProps,
  components: RenderComponents,
  pageResources: StaticResources,
): string {
  // make a deep copy of the tree so we don't remove the transclusion references
  // for the file cached in contentMap in build.ts
  const root = clone(componentData.tree) as Root

  // process transcludes in componentData
  visit(root, "element", (node, _index, _parent) => {
    if (node.tagName === "blockquote") {
      const classNames = (node.properties?.className ?? []) as string[]
      if (classNames.includes("transclude")) {
        const inner = node.children[0] as Element
        const transcludeTarget = inner.properties["data-slug"] as FullSlug
        const page = componentData.allFiles.find((f) => f.slug === transcludeTarget)
        if (!page) {
          return
        }

        let blockRef = node.properties.dataBlock as string | undefined
        if (blockRef?.startsWith("#^")) {
          // block transclude
          blockRef = blockRef.slice("#^".length)
          let blockNode = page.blocks?.[blockRef]
          if (blockNode) {
            if (blockNode.tagName === "li") {
              blockNode = {
                type: "element",
                tagName: "ul",
                properties: {},
                children: [blockNode],
              }
            }

            node.children = [
              normalizeHastElement(blockNode, slug, transcludeTarget),
              {
                type: "element",
                tagName: "a",
                properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
                children: [
                  { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
                ],
              },
            ]
          }
        } else if (blockRef?.startsWith("#") && page.htmlAst) {
          // header transclude
          blockRef = blockRef.slice(1)
          let startIdx = undefined
          let startDepth = undefined
          let endIdx = undefined
          for (const [i, el] of page.htmlAst.children.entries()) {
            // skip non-headers
            if (!(el.type === "element" && el.tagName.match(headerRegex))) continue
            const depth = Number(el.tagName.substring(1))

            // lookin for our blockref
            if (startIdx === undefined || startDepth === undefined) {
              // skip until we find the blockref that matches
              if (el.properties?.id === blockRef) {
                startIdx = i
                startDepth = depth
              }
            } else if (depth <= startDepth) {
              // looking for new header that is same level or higher
              endIdx = i
              break
            }
          }

          if (startIdx === undefined) {
            return
          }

          node.children = [
            ...(page.htmlAst.children.slice(startIdx, endIdx) as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        } else if (page.htmlAst) {
          // page transclude
          node.children = [
            {
              type: "element",
              tagName: "h1",
              properties: {},
              children: [
                {
                  type: "text",
                  value:
                    page.frontmatter?.title ??
                    i18n(cfg.locale).components.transcludes.transcludeOf({
                      targetSlug: page.slug!,
                    }),
                },
              ],
            },
            ...(page.htmlAst.children as ElementContent[]).map((child) =>
              normalizeHastElement(child as Element, slug, transcludeTarget),
            ),
            {
              type: "element",
              tagName: "a",
              properties: { href: inner.properties?.href, class: ["internal", "transclude-src"] },
              children: [
                { type: "text", value: i18n(cfg.locale).components.transcludes.linkToOriginal },
              ],
            },
          ]
        }
      }
    }
  })

  // set componentData.tree to the edited html that has transclusions rendered
  componentData.tree = root

  const {
    head: Head,
    header,
    beforeBody,
    afterBody,
    pageBody: Content,
    left,
    right,
    footer: Footer,
  } = components
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  const LeftComponent = (
    <div class="left sidebar">
      {left.map((BodyComponent) => conditionalFilterLeftComponent(BodyComponent))}
    </div>
  )

  const RightComponent = (
    <div class="right sidebar">
      {right.map((BodyComponent) => conditionalFilterRightComponent(BodyComponent))}
    </div>
  )

  function conditionalFilterLeftComponent(BodyComponent: QuartzComponent) {
    if (BodyComponent.id === ComponentIds.TableOfContents) {
      return !checkIsPathButNotIndex(slug, MainPaths.WRITINGS) ? <BodyComponent {...componentData} /> : null
    }
    
    return <BodyComponent {...componentData} />
  }

  function conditionalFilterRightComponent(BodyComponent: QuartzComponent) {
  if (BodyComponent.id === ComponentIds.Graph) {
    return !checkIsPathButNotIndex(slug, MainPaths.WRITINGS) ? <BodyComponent {...componentData} /> : null
  } else if (BodyComponent.id === ComponentIds.Backlinks) {
      return !checkIsPathButNotIndex(slug, MainPaths.WRITINGS) ? <BodyComponent {...componentData} /> : null
  }
    return <BodyComponent {...componentData} />
  }

  function conditionalFilterBodyComponent(BodyComponent: QuartzComponent) {
    // if (BodyComponent.id === ComponentIds.ContentMeta) {
    //   return checkIsPathButNotIndex(slug, MainPaths.WRITINGS) && slug.split("/")?.[1] !== "index" ? <BodyComponent {...componentData} /> : null
    // }
    
    //After body
    if (BodyComponent.id === ComponentIds.AboutAuthor) {
      return checkIsPathButNotIndex(slug, MainPaths.WRITINGS) ? <BodyComponent {...componentData} /> : null
    } else if (BodyComponent.id === ComponentIds.Backlinks) {
      return checkIsPathButNotIndex(slug, MainPaths.WRITINGS) ? <BodyComponent {...componentData} /> : null
    } else if (BodyComponent.id === ComponentIds.Properties) {
      return !checkIsPathButNotIndex(slug, MainPaths.WRITINGS) ? <BodyComponent {...componentData} /> : null
    }
    return <BodyComponent {...componentData} />
  }

  const lang = componentData.fileData.frontmatter?.lang ?? cfg.locale?.split("-")[0] ?? "en"
  const filteredAfterBodyComponents = afterBody?.map((BodyComponent) => conditionalFilterBodyComponent(BodyComponent)).filter(elem => !!elem)
  const doc = (
    <html lang={lang}>
      <Head {...componentData} />
      <body data-slug={slug}>
        <Header {...componentData}>
          {header.map((HeaderComponent) => (
            <HeaderComponent {...componentData} />
          ))}
        </Header>
        <div id="quartz-root" class="page">
          <div class="page-header">
              <div class="popover-hint">
                {beforeBody.map((BodyComponent) => conditionalFilterBodyComponent(BodyComponent))}
              </div>
            </div>
          <Body {...componentData}>
            {LeftComponent}
            <div class="center">
              <Content {...componentData} />
              <div class="page-after">
                <div class="popover-hint">
                  <hr/>
                  {filteredAfterBodyComponents}
                </div>
              </div>
            </div>
            {RightComponent}
          </Body>
        </div>
        <Footer {...componentData} />
      </body>
      {pageResources.js
        .filter((resource) => resource.loadTime === "afterDOMReady")
        .map((res) => JSResourceToScriptElement(res))}
    </html>
  )

  return "<!DOCTYPE html>\n" + render(doc)
}
