// From https://github.com/natashayasi/quartz/blob/d42e0bcab0b234498a5e746b38dd6f903486babc/quartz/components/Properties.tsx

import { FullSlug, _stripSlashes, TransformOptions, transformLink } from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/properties.scss"
import { JSX } from "preact/jsx-runtime"
import { ComponentIds } from "./types"

// const priorityPropertiesList = ["up", "related"]

function createLinkedElement(fileData: any, opts: any, value: string) {
  // if there is an alias in the link like [[alias|link]] then we need to remove the alias
  let cleanedValue
  if (value.includes("|")) {
    cleanedValue = value.split("|")[1]
  } else {
    cleanedValue = value
  }
  cleanedValue = cleanedValue.replace(/['"\[\]]+/g, "")

  let href = transformLink(fileData.slug!, cleanedValue, opts)

  // split cleanedValue to last part of the path
  let splitValue = cleanedValue.split("/")[cleanedValue.split("/").length - 1]

  return (
    <a href={href} class="internal no-background">
      {splitValue}
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
  const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1)

  return (
    <div class="properties-row">
      <span class="property-key">{capitalizedKey}:</span>{" "}
      <span class="property-value">{value}</span>
    </div>
  )
}

// function createPriorityPropertyElement(key: string, value: any) {
//   // const emoji = calculatePropertyEmoji(key);
//   return (
//     <div class="properties-row priority">
//       <span class="property-key">{key}:</span> <span class="property-value">{value}</span>
//     </div>
//   )
// }

export default (() => {
  function PropertiesWithWorkingLinks({
    fileData,
    allFiles,
  }: QuartzComponentProps): JSX.Element | null {
    const opts: TransformOptions = {
      strategy: "shortest",
      allSlugs: allFiles.map((fp) => fp.slug as FullSlug),
    }

    var propertiesElements = []
    // var priorityPropertiesElements = []

    if (Object.keys(fileData.frontmatter ?? {}).length > 0) {
      for (const [key, value] of Object.entries(fileData.frontmatter ?? {})) {
        const includedProperties = ["related"] // Add properties you want to ignore here

        if (!includedProperties.includes(key)) {
          // Ignore excluded properties
        } else if (!value || Object.keys(value).length === 0) {
          // Ignore empty properties
        } else {
          var linkedElements = []
          var propertyType = Object.prototype.toString.call(value)

          if (propertyType === "[object String]" && (value as string).includes("[[")) {
            //Check if it's a string or string array
            linkedElements.push(createLinkedElement(fileData, opts, value as string))
          } else if (propertyType === "[object Array]") {
            for (const [index, arrayItem] of Object.entries(value ?? {})) {
              // Check if it's an array
              var entry = (value as Array<any>)[Number(index)]
              if (entry.includes("[[")) {
                if (Number(index) > 0) {
                  linkedElements.push(", ")
                }
                linkedElements.push(createLinkedElement(fileData, opts, entry))
              } else {
                linkedElements.push(entry)
              }
            }
          } else if (propertyType === "[object String]") {
            linkedElements.push(value)
          }
          // if (priorityPropertiesList.includes(key)) {
          //   priorityPropertiesElements.push(createPriorityPropertyElement(key, linkedElements))
          // } else {
          propertiesElements.push(createPropertyElement(key, linkedElements))
          // }
        }
      }
      // sort
      // priorityPropertiesElements.sort((a, b) => {
      //   const indexA = priorityPropertiesList.indexOf(a.props.children[0].props.children)
      //   const indexB = priorityPropertiesList.indexOf(b.props.children[0].props.children)
      //   return indexA - indexB
      // })
    }

    return (
      <>
        {propertiesElements.length > 0 && (
          <div class="properties-container">
            {/* {priorityPropertiesElements && (
          <div class="properties-container priority">{priorityPropertiesElements}</div>
        )} */}
            {propertiesElements}
          </div>
        )}
      </>
    )
  }

  PropertiesWithWorkingLinks.css = style
  PropertiesWithWorkingLinks.id = ComponentIds.Properties
  return PropertiesWithWorkingLinks
}) satisfies QuartzComponentConstructor

/* Credit to both https://github.com/gamberoillecito for their author and nextnote from which I built this and to https://github.com/jackyzha0 both the creator and gracious question answerer*/
