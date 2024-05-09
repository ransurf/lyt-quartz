import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default ((path: string = "", component?: QuartzComponent) => {
  if (component) {
    const Component = component
    const PathOnly: QuartzComponent = (props: QuartzComponentProps) => {
      const url = new URL(window.location.href);
      return url.pathname.startsWith(path) ? <Component {...props} /> : null;
    }

    PathOnly.displayName = component.displayName
    PathOnly.afterDOMLoaded = component?.afterDOMLoaded
    PathOnly.beforeDOMLoaded = component?.beforeDOMLoaded
    PathOnly.css = component?.css
    return PathOnly
  } else {
    return () => <></>
  }
}) satisfies QuartzComponentConstructor
