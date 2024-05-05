// From https://github.com/natashayasi/quartz/blob/d42e0bcab0b234498a5e746b38dd6f903486babc/quartz/components/Properties.tsx

import { FullSlug, _stripSlashes, TransformOptions, transformLink } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/properties.scss"
import { JSX } from "preact/jsx-runtime"

function createLinkedElement(fileData: any, opts: any, value: string) {
  let cleanedValue = value.replace(/['"\[\]]+/g, "")
  let href = transformLink(fileData.slug!, cleanedValue, opts)

  return (
    <a href={href} class="internal">
      {cleanedValue}
    </a>
  )
}

function calculatePropertyEmoji(key: string) {
  // if up, do up emoji, if related, do link emoji
  if (key.includes("up")) {
    return "🔼"
  } else if (key.includes("related")) {
    return "🔗"
  } else {
    return ""
  }
}

function createPropertyElement(key: string, value: any) {
  // const emoji = calculatePropertyEmoji(key);
  return (
    <div class="properties-row">
      <span class="property-key">{key}:</span> <span class="property-value">{value}</span>
    </div>
  )
}

export default (() => {
  function PropertiesWithWorkingLinks({ fileData, allFiles }: QuartzComponentProps): JSX.Element | null {
    const opts: TransformOptions = {
      strategy: "shortest",
      allSlugs: allFiles.map((fp) => fp.slug as FullSlug),
    }

    var propertiesElements = []

    if (Object.keys(fileData.frontmatter ?? {}).length > 0) {
      for (const [key, value] of Object.entries(fileData.frontmatter ?? {})) {
        const excludedProperties = ["draft", "title", "tags", "publishDate"]; // Add properties you want to ignore here

        if (excludedProperties.includes(key)) {
          // Ignore excluded properties
        }
        else {
          if (!value) return null;
          var linkedElements = []
          var propertyType = Object.prototype.toString.call(value)

          if ((propertyType === "[object String]" && (value as string).includes("[["))) {
            //Check if it's a string or string array
            linkedElements.push(createLinkedElement(fileData, opts, (value as string)))
          } else if (propertyType === "[object Array]") {
            for (const [index, arrayItem] of Object.entries(value ?? {})) {
              // Check if it's an array
              var entry = (value as Array<any>)[Number(index)];
              if (entry.includes("[[")) {
                if (Number(index) > 0) {
                  linkedElements.push(", ")
                }
                linkedElements.push(createLinkedElement(fileData, opts, entry))
              } else {
                linkedElements.push(entry)
              }
            }
          }

          propertiesElements.push(createPropertyElement(key, linkedElements))
        }
      }
    }

    return (
      <div class="properties-container">
        {propertiesElements}
      </div>
    )
  }

  PropertiesWithWorkingLinks.css = style
  return PropertiesWithWorkingLinks
}) satisfies QuartzComponentConstructor

/* Credit to both https://github.com/gamberoillecito for their author and nextnote from which I built this and to https://github.com/jackyzha0 both the creator and gracious question answerer*/
