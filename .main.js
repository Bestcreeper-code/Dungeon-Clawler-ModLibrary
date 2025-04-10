const owner = 'Bestcreeper-code';
const repo = 'Dungeon-Clawler-ModLibrary';
let currentFolder = ''; // Current subpath in repo
const supportedFileExtensions = ['.png','.dll','.txt']; 
async function loadFolders(folderPath = '') {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`);
    const contents = await res.json();

    const folderGrid = document.getElementById('folder-grid');
    folderGrid.innerHTML = '';

    // Show "Back" button if not in root
    if (folderPath) {
      const backDiv = document.createElement('div');
      backDiv.className = 'folder';
      backDiv.textContent = '⬅ Back';
      backDiv.onclick = () => {
        const parent = folderPath.split('/').slice(0, -1).join('/');
        currentFolder = parent;
        loadFolders(parent);
      };
      folderGrid.appendChild(backDiv);
    }

    for (const item of contents) {
      if (item.name.startsWith('.')) {
        continue;
      }
      if (item.type === 'dir') {
        const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name;
        const iconUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${fullPath}/icon.png`;

        const folderDiv = document.createElement('div');
        folderDiv.className = 'folder';
        folderDiv.onclick = () => {
          currentFolder = fullPath;
          loadFolders(fullPath);
        };

        const img = document.createElement('img');
        img.src = iconUrl;
        img.alt = item.name;
        img.onerror = () => img.remove();

        const label = document.createElement('div');
        label.textContent = item.name;

        folderDiv.appendChild(img);
        folderDiv.appendChild(label);
        folderGrid.appendChild(folderDiv);
      }

      

      if (item.type === 'file') {
        const fileDiv = document.createElement('div');
        if (supportedFileExtensions.some(ext => item.name.endsWith(ext))) {
          const fileextension = item.name.split('.').pop().toLowerCase();
          fileDiv.className = fileextension;
        } else {
          fileDiv.className = 'file';
        }
        fileDiv.textContent = item.name;
        fileDiv.addEventListener('click', () => {
            window.location.href = `https://github.com/${owner}/${repo}/tree/main/${currentFolder}/${item.name}`;
        });
        folderGrid.appendChild(fileDiv);
      }
    }
  } catch (err) {
    console.error('Error loading folder:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadFolders();
});
