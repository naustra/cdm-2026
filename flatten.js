const fs = require('fs');
const path = require('path');

function getDirectories(srcPath) {
  return fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
}

function processDir(dir) {
  // skip top level dirs like src/contexts, src/utils, src/screens if they only have 1 file but we want to keep them?
  // Actually, let's just process everything except 'assets', 'hooks', 'lib'
  const items = fs.readdirSync(dir);
  const files = items.filter(i => fs.statSync(path.join(dir, i)).isFile());
  const dirs = items.filter(i => fs.statSync(path.join(dir, i)).isDirectory());
  
  // Recurse first
  dirs.forEach(d => processDir(path.join(dir, d)));

  // Re-check after children might have been flattened
  const newItems = fs.readdirSync(dir);
  const newFiles = newItems.filter(i => fs.statSync(path.join(dir, i)).isFile());
  const newDirs = newItems.filter(i => fs.statSync(path.join(dir, i)).isDirectory());

  // Top level dirs to NOT flatten: screens, components, utils, contexts, lib, hooks
  const topLevels = ['src/screens', 'src/components', 'src/utils', 'src/contexts', 'src/lib', 'src/hooks', 'src/assets', 'src/assets/flags', 'src/assets/icons', 'src/assets/visuels'];
  if (topLevels.includes(dir)) return;

  if (newDirs.length === 0 && newFiles.length === 1) {
    const file = newFiles[0];
    const oldPath = path.join(dir, file);
    // If the file is named index.tsx, we probably want to rename it to DirName.tsx
    let newName = file;
    if (file === 'index.tsx' || file === 'index.js' || file === 'index.ts') {
      const ext = path.extname(file);
      newName = path.basename(dir) + ext;
    } else if (file === path.basename(dir) + path.extname(file)) {
      // name is already DirName.tsx
    }
    
    const newPath = path.join(path.dirname(dir), newName);
    console.log(`MOVING: ${oldPath} -> ${newPath}`);
    // we don't move yet, just print to verify
  }
}

processDir('src');
