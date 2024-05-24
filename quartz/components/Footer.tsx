import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  columns: {
    title: string
    links: {
      title: string
      link: string
    }[]
  }[]
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const columns = opts?.columns ?? []
    return (
      <footer className={`${displayClass ?? ""}`}>
        <div className="footer-container">
          {/* <a href={"/index.html"} class="brand">
            <img className="lyt-logo" src={`/static/lyt-navbar-logo.png`} alt={`LYT Home`} />
          </a> */}
          <div className="footer-columns">
            {columns.map((column, index) => (
              <ul className="footer-column" key={index}>
                <h3 className="component-title">{column.title}</h3>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.link}>{link.title}</a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div className="footer-credits">
            <p>
              {i18n(cfg.locale).components.footer.madeBy}{" "}
              <a href="https://notes.johnmavrick.com/">John Mavrick</a>{" "}
              {i18n(cfg.locale).components.footer.createdWith}{" "}
              <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a>
            </p>
            <p>© Linking Your Thinking {year}</p>
          </div>
        </div>
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
