import FlexSearch, { DefaultDocumentSearchResults } from "flexsearch"
import { ContentDetails } from "../../plugins/emitters/contentIndex"
import { removeAllChildren } from "./util"
import { FullSlug, resolveRelative } from "../../util/path"

interface Item {
  id: number
  slug: FullSlug
  title: string
  content: string
  tags: string[]
  [key: string]: any
}

type SearchType = "basic" | "tags"
let searchType: SearchType = "basic"
let currentSearchTerm: string = ""
const encoder = (str: string) => {
  return str
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

let index = new FlexSearch.Document<Item>({
  encode: encoder,
  document: {
    id: "id",
    tag: "tags",
    index: [
      {
        field: "title",
        tokenize: "forward",
      },
      {
        field: "content",
        tokenize: "forward",
      },
      {
        field: "tags",
        tokenize: "forward",
      },
    ],
  },
})

const contextWindowWords = 30
const numSearchResults = 6
const numTagResults = 5

const tokenizeTerm = (term: string) => {
  const tokens = term.split(/\s+/).filter((t) => t.trim() !== "")
  const tokenLen = tokens.length
  if (tokenLen > 1) {
    for (let i = 1; i < tokenLen; i++) {
      tokens.push(tokens.slice(0, i + 1).join(" "))
    }
  }
  return tokens.sort((a, b) => b.length - a.length)
}

function highlight(searchTerm: string, text: string, trim?: boolean) {
  const tokenizedTerms = tokenizeTerm(searchTerm)
  let tokenizedText = text.split(/\s+/).filter((t) => t !== "")

  let startIndex = 0
  let endIndex = tokenizedText.length - 1
  if (trim) {
    const includesCheck = (tok: string) =>
      tokenizedTerms.some((term) => tok.toLowerCase().startsWith(term.toLowerCase()))
    const occurrencesIndices = tokenizedText.map(includesCheck)

    let bestSum = 0
    let bestIndex = 0
    for (let i = 0; i < Math.max(tokenizedText.length - contextWindowWords, 0); i++) {
      const window = occurrencesIndices.slice(i, i + contextWindowWords)
      const windowSum = window.reduce((total, cur) => total + (cur ? 1 : 0), 0)
      if (windowSum >= bestSum) {
        bestSum = windowSum
        bestIndex = i
      }
    }

    startIndex = Math.max(bestIndex - contextWindowWords, 0)
    endIndex = Math.min(startIndex + 2 * contextWindowWords, tokenizedText.length - 1)
    tokenizedText = tokenizedText.slice(startIndex, endIndex)
  }

  const slice = tokenizedText
    .map((tok) => {
      for (const searchTok of tokenizedTerms) {
        if (tok.toLowerCase().includes(searchTok.toLowerCase())) {
          const regex = new RegExp(searchTok.toLowerCase(), "gi")
          return tok.replace(regex, `<span class="highlight">$&</span>`)
        }
      }
      return tok
    })
    .join(" ")

  return `${startIndex === 0 ? "" : "..."}${slice}${
    endIndex === tokenizedText.length - 1 ? "" : "..."
  }`
}

async function setupInlineSearch(
  searchElement: Element,
  currentSlug: FullSlug,
  data: ContentIndex,
) {
  const searchBar = searchElement.querySelector(".inline-search-bar") as HTMLInputElement
  if (!searchBar) return

  const searchResults = searchElement.querySelector(".inline-search-results") as HTMLElement
  if (!searchResults) return

  const searchLayout = searchElement.querySelector(".search-layout") as HTMLElement
  if (!searchLayout) return

  const resultsContainer = document.createElement("div")
  resultsContainer.className = "results-container"
  searchLayout.appendChild(resultsContainer)

  const idDataMap = Object.keys(data) as FullSlug[]

  const formatForDisplay = (term: string, id: number) => {
    const slug = idDataMap[id]
    return {
      id,
      slug,
      title: searchType === "tags" ? data[slug].title : highlight(term, data[slug].title ?? ""),
      content: highlight(term, data[slug].content ?? "", true),
      tags: highlightTags(term.substring(1), data[slug].tags),
    }
  }

  function highlightTags(term: string, tags: string[]) {
    if (!tags || searchType !== "tags") {
      return []
    }
    return tags
      .map((tag) => {
        if (tag.toLowerCase().includes(term.toLowerCase())) {
          return `<li><p class="match-tag">#${tag}</p></li>`
        } else {
          return `<li><p>#${tag}</p></li>`
        }
      })
      .slice(0, numTagResults)
  }

  function resolveUrl(slug: FullSlug): URL {
    return new URL(resolveRelative(currentSlug, slug), location.toString())
  }

  const resultToHTML = ({ slug, title, content, tags }: Item) => {
    const htmlTags = tags.length > 0 ? `<ul class="tags">${tags.join("")}</ul>` : ``
    const itemTile = document.createElement("a")
    itemTile.classList.add("result-card")
    itemTile.id = slug
    itemTile.href = resolveUrl(slug).toString()
    itemTile.innerHTML = `
      <h3>${title}</h3>
      ${htmlTags}
      <p>${content}</p>
    `

    const handler = (event: MouseEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      searchBar.value = ""
      searchResults.style.display = "none"
      searchResults.classList.remove("show")
    }

    itemTile.addEventListener("click", handler)
    window.addCleanup(() => itemTile.removeEventListener("click", handler))

    return itemTile
  }

  async function displayResults(finalResults: Item[]) {
    removeAllChildren(resultsContainer)
    if (finalResults.length === 0) {
      resultsContainer.innerHTML = `<div class="result-card no-match">
          <h3>No results.</h3>
          <p>Try another search term?</p>
      </div>`
    } else {
      resultsContainer.append(...finalResults.map(resultToHTML))
    }
  }

  async function onInput(e: Event) {
    if (!searchLayout || !index) return
    currentSearchTerm = (e.target as HTMLInputElement).value.trim()

    if (currentSearchTerm === "") {
      searchResults.style.display = "none"
      searchResults.classList.remove("show")
      searchLayout.classList.remove("display-results")
      return
    }

    searchResults.style.display = "block"
    searchResults.classList.add("show")
    searchLayout.classList.add("display-results")

    searchType = currentSearchTerm.startsWith("#") ? "tags" : "basic"

    let searchResults_: DefaultDocumentSearchResults<Item>
    if (searchType === "tags") {
      currentSearchTerm = currentSearchTerm.substring(1).trim()
      searchResults_ = await index.searchAsync({
        query: currentSearchTerm,
        limit: numSearchResults,
        index: ["tags"],
      })
    } else {
      searchResults_ = await index.searchAsync({
        query: currentSearchTerm,
        limit: numSearchResults,
        index: ["title", "content"],
      })
    }

    const getByField = (field: string): number[] => {
      const results = searchResults_.filter((x) => x.field === field)
      return results.length === 0 ? [] : ([...results[0].result] as number[])
    }

    const allIds: Set<number> = new Set([
      ...getByField("title"),
      ...getByField("content"),
      ...getByField("tags"),
    ])
    const finalResults = [...allIds].map((id) => formatForDisplay(currentSearchTerm, id))
    await displayResults(finalResults)
  }

  function onFocus() {
    if (currentSearchTerm && currentSearchTerm.trim() !== "") {
      searchResults.style.display = "block"
      searchResults.classList.add("show")
    }
  }

  function onBlur() {
    // Delay hiding to allow clicking on results
    setTimeout(() => {
      if (!searchElement.contains(document.activeElement)) {
        searchResults.style.display = "none"
        searchResults.classList.remove("show")
      }
    }, 150)
  }

  searchBar.addEventListener("input", onInput)
  searchBar.addEventListener("focus", onFocus)
  searchBar.addEventListener("blur", onBlur)

  window.addCleanup(() => {
    searchBar.removeEventListener("input", onInput)
    searchBar.removeEventListener("focus", onFocus)
    searchBar.removeEventListener("blur", onBlur)
  })

  await fillDocument(data)
}

let indexPopulated = false
async function fillDocument(data: ContentIndex) {
  if (indexPopulated) return
  let id = 0
  const promises: Array<Promise<unknown>> = []
  for (const [slug, fileData] of Object.entries<ContentDetails>(data)) {
    promises.push(
      index.addAsync(id++, {
        id,
        slug: slug as FullSlug,
        title: fileData.title,
        content: fileData.content,
        tags: fileData.tags,
      }),
    )
  }
  await Promise.all(promises)
  indexPopulated = true
}

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const currentSlug = e.detail.url
  const data = await fetchData
  const searchElements = document.getElementsByClassName("inline-search")
  for (const element of searchElements) {
    await setupInlineSearch(element, currentSlug, data)
  }
})
