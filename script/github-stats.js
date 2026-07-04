async function loadGithubStats(username) {
  const container = document.getElementById("stats-custom");

  if (!container) {
    console.error("github-stats.js: #stats-custom не знайдено в DOM");
    return;
  }

  try {
    const profileRes = await fetch(`https://api.github.com/users/${username}`);

    if (profileRes.status === 403) {
      throw new Error("GitHub API rate limit exceeded. Try again later.");
    }
    if (!profileRes.ok)
      throw new Error(`GitHub API error (profile): ${profileRes.status}`);

    const profile = await profileRes.json();

    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
    );
    if (!reposRes.ok)
      throw new Error(`GitHub API error (repos): ${reposRes.status}`);
    const repos = await reposRes.json();

    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    const langCount = {};
    repos.forEach((r) => {
      if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });
    const topLangs = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const maxCount = topLangs.length ? topLangs[0][1] : 1;

    container.innerHTML = `
            <div class="stat-card">
                <span class="stat-number">${profile.public_repos}</span>
                <span class="stat-label">Repositories</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${totalStars}</span>
                <span class="stat-label">Total Stars</span>
            </div>
            <div class="stat-card">
                <span class="stat-number">${profile.followers}</span>
                <span class="stat-label">Followers</span>
            </div>
            <div class="stat-card lang-card">
                <span class="stat-label">Top Languages</span>
                <div class="lang-bars">
                    ${topLangs
                      .map(
                        ([lang, count]) => `
                        <div class="lang-bar">
                            <span>${lang}</span>
                            <div class="lang-bar-track">
                                <div class="lang-bar-fill" style="width: ${(count / maxCount) * 100}%"></div>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        `;
  } catch (err) {
    container.innerHTML = `<p class="projects-loading">${err.message}</p>`;
    console.error("github-stats.js error:", err);
  }
}

loadGithubStats("Max-Mend");
