import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/inlineSearch.scss"
// @ts-ignore
import script from "./scripts/inlineSearch.inline"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

export interface InlineSearchOptions {
  enablePreview: boolean
}

const defaultOptions: InlineSearchOptions = {
  enablePreview: true,
}

export default ((userOpts?: Partial<InlineSearchOptions>) => {
  const InlineSearch: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const opts = { ...defaultOptions, ...userOpts }
    const searchPlaceholder = i18n(cfg.locale).components.search.searchBarPlaceholder
    return (
      <div class={classNames(displayClass, "inline-search")}>
        <div class="search-input-container">
          <svg
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 19.9 19.7"
            class="search-icon"
          >
            <title>Search</title>
            <g class="search-path" fill="none">
              <path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4" />
              <circle cx="8" cy="8" r="7" />
            </g>
          </svg>
          <input
            autocomplete="off"
            class="inline-search-bar"
            name="search"
            type="text"
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
          />
        </div>
        <div class="inline-search-results" style="display: none;">
          <div class="search-layout" data-preview={opts.enablePreview}></div>
        </div>
      </div>
    )
  }

  InlineSearch.afterDOMLoaded = script
  InlineSearch.css = style

  return InlineSearch
}) satisfies QuartzComponentConstructor
