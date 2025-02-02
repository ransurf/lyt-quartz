import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import path from "path"
import {
  FilePath,
  FullSlug,
  MainPaths,
  SimpleSlug,
  stripSlashes,
  joinSegments,
  pathToRoot,
  simplifySlug,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { FolderContent } from "../../components"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"

const handleQueryOverrides = (slug: SimpleSlug): SimpleSlug => {
  // if "blog" return "essays"
  if (slug === "blog") {
    return MainPaths.WRITINGS as SimpleSlug
  }
  return slug
};

export const FolderPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: FolderContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, afterBody, pageBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  const capitalizeFolder = (folder: string) => {
    return folder.charAt(0).toUpperCase() + folder.slice(1)
  }

  return {
    name: "FolderPage",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, ...beforeBody, ...afterBody, pageBody, ...left, ...right, Footer]
    },
    async getDependencyGraph(_ctx, content, _resources) {
      // Example graph:
      // nested/file.md --> nested/index.html
      // nested/file2.md ------^
      const graph = new DepGraph<FilePath>()

      content.map(([_tree, vfile]) => {
        const slug = vfile.data.slug
        const folderName = path.dirname(slug ?? "") as SimpleSlug
        if (slug && folderName !== "." && folderName !== "tags") {
          graph.addEdge(vfile.data.filePath!, joinSegments(folderName, "index.html") as FilePath)
        }
      })

      return graph
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration
      

      const folders: Set<SimpleSlug> = new Set(
        allFiles.flatMap((data) => {
          const slug = data.slug
          const folderName = path.dirname(slug ?? "") as SimpleSlug
          if (slug && folderName !== "." && folderName !== "tags") {
            const folderToSearch = handleQueryOverrides(folderName)
            return [folderToSearch]
          }
          return []
        }),
      )

      const folderDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...folders].map((folder) => [
          folder,
          defaultProcessedContent({
            slug: joinSegments(folder, "index") as FullSlug,
            frontmatter: {
              title: `${capitalizeFolder(folder)}`,
              tags: [],
            },
          }),
        ]),
      )

      for (const [tree, file] of content) {
        const slug = stripSlashes(simplifySlug(file.data.slug!)) as SimpleSlug
        if (folders.has(slug)) {
          folderDescriptions[slug] = [tree, file]
        }
      }

      for (const folder of folders) {
        const slug = joinSegments(folder, "index") as FullSlug
        const externalResources = pageResources(pathToRoot(slug), resources)
        const [tree, file] = folderDescriptions[folder]
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const content = renderPage(cfg, slug, componentData, opts, externalResources)
        const fp = await write({
          ctx,
          content,
          slug,
          ext: ".html",
        })

        fps.push(fp)
      }
      return fps
    },
  }
}

