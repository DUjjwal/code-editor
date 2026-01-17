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
