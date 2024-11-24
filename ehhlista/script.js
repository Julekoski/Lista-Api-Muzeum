const API_BASE = "https://collectionapi.metmuseum.org/public/collection/v1";

// Fetch random object IDs
async function fetchRandomIDs(count) {
  const response = await fetch(`${API_BASE}/objects`);
  const data = await response.json();
  const total = data.total;
  const randomIDs = Array.from({ length: count }, () => Math.floor(Math.random() * total));
  return randomIDs;
}

// Fetch details for an object
async function fetchObjectDetails(objectID) {
  const response = await fetch(`${API_BASE}/objects/${objectID}`);
  if (response.ok) {
    return response.json();
  }
  return null;
}

// Fill the main exhibit
async function fillMainExhibit(objectID) {
  const object = await fetchObjectDetails(objectID);
  if (object) {
    document.getElementById("main-title").textContent = object.title || "No Title Available";
    document.getElementById("main-description").textContent =
      object.creditLine || "Description not available.";
    document.getElementById("main-image").src = object.primaryImage || "https://via.placeholder.com/600x400";
    document.getElementById("main-tags").innerHTML = object.tags
      ? object.tags.map((tag) => `<span class="badge bg-secondary">${tag.term}</span>`).join("")
      : "No tags available.";
  }
}

// Fill gallery or similar items
async function fillSection(sectionID, objectIDs) {
  const section = document.getElementById(sectionID);
  const items = await Promise.all(objectIDs.map(fetchObjectDetails));
  items.forEach((item) => {
    if (item) {
      const col = document.createElement("div");
      col.className = "col-md-3 mb-3";
      col.innerHTML = `
        <div class="card">
          <img src="${item.primaryImage || "https://via.placeholder.com/400x300"}" class="card-img-top" alt="${item.title}">
          <div class="card-body">
            <h5 class="card-title">${item.title || "Untitled"}</h5>
            <p class="card-text">${item.artistDisplayName || "Unknown Artist"}</p>
          </div>
        </div>
      `;
      section.appendChild(col);
    }
  });
}

// Initialize the page
async function initializePage() {
  const randomIDs = await fetchRandomIDs(10);
  await fillMainExhibit(randomIDs[0]);
  await fillSection("gallery-items", randomIDs.slice(1, 5));
  await fillSection("similar-items-list", randomIDs.slice(5));
}

initializePage();
