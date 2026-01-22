import fs from 'fs-extra';

export async function updateBarrelExport(filePath: string, exportStatement: string) {
  let content = '';
  
  if (fs.existsSync(filePath)) {
    content = await fs.readFile(filePath, 'utf-8');
  } else {
    content = '// Auto-generated barrel export\n// This file is managed by Lunar Kit CLI\n\n';
  }

  // Check if export already exists
  if (!content.includes(exportStatement)) {
    content += exportStatement + '\n';
    await fs.writeFile(filePath, content);
  }
}
