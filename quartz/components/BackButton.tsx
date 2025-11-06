import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/backButton.scss"
// @ts-ignore
import script from "./scripts/backButton.inline"

export default (() => {
  const BackButton: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    // Only show back button on post pages (not on index or folder pages)
    const isPostPage = fileData.slug?.startsWith("posts/") ?? false

    if (!isPostPage) {
      return null
    }

    return (
      <div class="back-button-container">
        <button class="back-button" id="back-button">
          <span class="back-icon">←</span>
          <span class="back-text">Back</span>
        </button>
      </div>
    )
  }

  BackButton.css = style
  BackButton.afterDOMLoaded = script
  return BackButton
}) satisfies QuartzComponentConstructor
