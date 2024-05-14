// From https://github.com/DigitalGardeningCollective/front-porch
import navbarStyle from "./styles/navbar.scss"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

// @ts-ignore
import script from "./scripts/navbar.inline"
import * as Component from "../components"

export default (() => {
    function NavbarComponent(componentData: QuartzComponentProps) {        
        const { fileData, cfg } = componentData;
        const SearchComponent = Component.Search();
        // const RSSComponent = Component.RSS();
        const { slug } = fileData;

        let titles = null; 
        let navTitle = "LYT Ideaverse"
        titles = ["Blog", "Newsletter", "Resources", "Contact"]

        // if (slug) {
        //     if (slug.startsWith("garden")) {
        //         titles = ["Notes", "Essays", "MOCs", "Contributions"]
        //     } else if (slug.startsWith("now")) {
        //         titles = ["Garden", "Blogroll", "About"]
        //     } 
        //     else {
        //         titles = ["Garden", "Now", "About"]
        //     }
        // }
        
        return (
            <nav class="navbar">
                <div class="navbrand">
                    <h1><a href={slug?.startsWith("garden") ? "/garden" : "/index.html"} class="brand">{ navTitle }</a></h1>
                    <div class="burger" id="burger">
                        <span class="burger-open">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16">
                                <path fill="currentColor" d="M0 0h24v2H0zM0 7h24v2H0zM0 14h24v2H0z" />
                            </svg>
                        </span>
                        <span class="burger-close">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                <path fill="currentColor" d="M17.778.808l1.414 1.414L11.414 10l7.778 7.778-1.414 1.414L10 11.414l-7.778 7.778-1.414-1.414L8.586 10 .808 2.222 2.222.808 10 8.586 17.778.808z" />
                            </svg>
                        </span>
                    </div>
                </div>
                <ul class={`menu ${slug?.startsWith("garden") ? "garden" : "index"}`} id="menu">
                    {  
                        titles && titles.map((title: string) => {
                            return <li class="menu-item"><a href={`/${ 
                                slug?.startsWith("garden") ? "garden/" : "" }${title.toLocaleLowerCase()}`} class="menu-link">{title}</a></li>
                        })
                    }
                </ul>
                <ul class="action-menu">
                  <li class="action-menu-item"><a href="/now" class="action-menu-link">About</a></li>
                  <li class="action-menu-item">
                    <SearchComponent { ...componentData } />
                  </li>
                </ul>
            </nav>
        )
    }
    
    NavbarComponent.css = navbarStyle

    NavbarComponent.afterDOMLoaded = script

    return NavbarComponent
}) satisfies QuartzComponentConstructor


