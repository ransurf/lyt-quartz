import { ComponentType, JSX } from "preact"
import { StaticResources } from "../util/resources"
import { QuartzPluginData } from "../plugins/vfile"
import { GlobalConfiguration } from "../cfg"
import { Node } from "hast"
import { BuildCtx } from "../util/ctx"

export type QuartzComponentProps = {
  ctx: BuildCtx
  externalResources: StaticResources
  fileData: QuartzPluginData
  cfg: GlobalConfiguration
  children: (QuartzComponent | JSX.Element)[]
  tree: Node
  allFiles: QuartzPluginData[]
  displayClass?: "mobile-only" | "desktop-only"
} & JSX.IntrinsicAttributes & {
    [key: string]: any
  }

export type QuartzComponent = ComponentType<QuartzComponentProps> & {
  id?: string
  css?: string
  beforeDOMLoaded?: string
  afterDOMLoaded?: string
}

export type QuartzComponentConstructor<Options extends object | undefined = undefined> = (
  opts: Options,
) => QuartzComponent


export enum ComponentIds {
  AboutAuthor = "ABOUT_AUTHOR",
  Backlinks = "BACKLINKS",
  Breadcrumbs = "BREAD_CRUMBS",
  ContentMeta = "CONTENT_META",
  Graph = "GRAPH",
  Properties = "PROPERTIES",
  RecentNotes = "RECENT_NOTES",
  RelatedNotes = "RELATED_NOTES",
  RelatedNotesContainer = "RELATED_NOTES_CONTAINER",
  TableOfContents = "TABLE_OF_CONTENTS",
}