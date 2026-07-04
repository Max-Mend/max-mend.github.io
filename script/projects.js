async function loadProjects(username) {
  const grid = document.getElementById("projects-grid");

  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=stars&direction=desc&per_page=6`,
    );
    if (!res.ok) throw new Error("GitHub API error");

    const repos = await res.json();
    const filtered = repos.filter((r) => !r.fork);

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="projects-loading">No repositories found</p>`;
      return;
    }

    grid.innerHTML = filtered
      .map(
        (repo) => `
            <a class="project-card" href="${repo.html_url}" target="_blank" rel="noopener">
                <h3>${repo.name}</h3>
                <p>${repo.description || "No description"}</p>
                <div class="project-meta">
                    ${repo.language ? `<span>${repo.language}</span>` : ""}
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                </div>
            </a>
        `,
      )
      .join("");
  } catch (err) {
    grid.innerHTML = `<p class="projects-loading">Failed to load repositories</p>`;
    console.error(err);
  }
}

loadProjects("Max-Mend");
