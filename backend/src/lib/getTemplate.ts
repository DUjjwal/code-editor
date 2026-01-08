import fs from "fs";
import path from "path";

export interface TemplateFile {
  filename: string;
  fileExtension: string;
  content: string;
}

export interface TemplateFolder {
  folderName: string;
  items: (TemplateFile | TemplateFolder)[];
}



export function parseTemplateFolder(folderPath: string): TemplateFolder {
  const items: (TemplateFile | TemplateFolder)[] = [];

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      // recurse into subfolder
      items.push(parseTemplateFolder(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      const nameWithoutExt = path.basename(entry.name, ext);

      const content = fs.readFileSync(fullPath, "utf-8");

      items.push({
        filename: nameWithoutExt,
        fileExtension: ext.replace(".", ""),
        content,
      });
    }
  }

  return {
    folderName: path.basename(folderPath),
    items,
  };
}
