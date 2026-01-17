// ================================
// Tree → WebContainer FS Converter
// ================================

type Node = {
  id: number
  name: string
  type: "FILE" | "FOLDER"
  content?: string
  parentId: number | null
  items?: Node[]
}



/**
 * Output:
 * {
 *   219: "public/index.html",
 *   218: "package.json"
 * }
 */
export function buildWebContainerIdPathMapWithoutRoot(tree: Node) {
  const idPathMap: Record<number, string> = {}

  function dfs(
    node: Node,
    currentPath: string,
    isRoot: boolean
  ) {
    // skip root folder name
    const path = isRoot
      ? ""
      : currentPath
        ? `${currentPath}/${node.name}`
        : node.name

    if (!isRoot) {
      idPathMap[node.id] = path
    }

    node.items?.forEach(child =>
      dfs(child, path, false)
    )
  }

  dfs(tree, "", true)

  return idPathMap
}


type WebContainerFS = {
  [name: string]: {
    file?: {
      contents: string
    }
    directory?: WebContainerFS
  }
}

/**
 * Converts a file/folder tree into WebContainer filesystem format
 */
function convertToWebContainerFS(node: Node): {
  file?: { contents: string }
  directory?: WebContainerFS
} {
  // ---------- FILE ----------
  if (node.type === "FILE") {
    return {
      file: {
        contents: node.content ?? ""
      }
    }
  }

  // ---------- FOLDER ----------
  const directory: WebContainerFS = {}

  if (node.items && node.items.length > 0) {
    for (const child of node.items) {
      directory[child.name] = convertToWebContainerFS(child)
    }
  }

  return {
    directory
  }
}

/**
 * Converts full project tree
 */
export function buildWebContainerFiles(rootNode: Node): {
  file?: { contents: string }
  directory?: WebContainerFS
} {
  return convertToWebContainerFS(rootNode)
  
}
