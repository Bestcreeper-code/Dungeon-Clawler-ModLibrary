const owner = 'Bestcreeper-code';
const repo = 'Dungeon-Clawler-ModLibrary';

async function loadContents(path = '') {
  const folderPath = path; 
  try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
      if (!res.ok) {
          throw new Error(`Failed to fetch contents: ${res.statusText}`);
      }
      const contents = await res.json();
      const container = document.getElementById('folder-grid');
      container.innerHTML = ''; 
      for (const item of contents) {
        if (item.name === 'icon.png') {continue; } 
        if (item.type === 'dir') {
          const fullPath = folderPath ? `${folderPath}/${item.name}` : item.name;
          const iconUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${fullPath}/icon.png`;
  
          const folderDiv = document.createElement('div');
          folderDiv.className = 'folder';
          folderDiv.onclick = () => {
            loadContents(fullPath);
          };
  
          const img = document.createElement('img');
          img.src = iconUrl;
          img.alt = item.name;
          img.onerror = () => img.remove();
  
          const label = document.createElement('div');
          label.textContent = item.name;
  
          folderDiv.appendChild(img);
          folderDiv.appendChild(label);
          container.appendChild(folderDiv);
        }
      }
  } catch (err) {
      console.error('Failed to load contents:', err);
      const container = document.getElementById('folder-grid');
      container.innerHTML = `<p style="color: red;">Error loading contents. Please try again later.</p>`;
  }
}

document.addEventListener('DOMContentLoaded', () => loadContents());