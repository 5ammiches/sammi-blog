import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/simplePageTitle.scss"

const SimplePageTitle: QuartzComponent = ({
  fileData,
  cfg,
  displayClass,
}: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)

  return (
    <h1 class={classNames(displayClass, "simple-page-title")}>
      <a href={baseDir}>{title}</a>
    </h1>
  )
}

SimplePageTitle.css = style
export default (() => SimplePageTitle) satisfies QuartzComponentConstructor
