import { transformLink, TransformOptions } from "./path";
import { QuartzPluginData } from "../plugins/vfile"
import { FullSlug } from "./path"

//Direct path to the link
export const cleanedValue = (value: string, fileData: QuartzPluginData, transformOpts: TransformOptions) => {

  let cleanedValue;
  if (value.includes("|")) {
    cleanedValue = value.split("|")[1]
  } else {
    cleanedValue = value
  }
  cleanedValue = cleanedValue.replace(/['"\[\]]+/g, "")

  let href = transformLink(fileData.slug!, cleanedValue, transformOpts)

  // split cleanedValue to last part of the path
  let splitValue = cleanedValue.split("/")[cleanedValue.split("/").length - 1]
  return {
    href,
    splitValue
  }
};