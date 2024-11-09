// script.js

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

document.documentElement.setAttribute('data-theme', currentTheme);

themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggleBtn.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
});

// Dynamic Project Loading
async function loadProjects() {
    const container = document.getElementById('projects-container') || document.getElementById('featured-projects-container');
    if (!container) return;

    try {
        const response = await fetch('./projects/');
        const text = await response.text();
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const links = Array.from(htmlDoc.querySelectorAll('a'))
                           .map(a => a.getAttribute('href'))
                           .filter(href => href.endsWith('.md'));

        for (const link of links) {
            const projectName = link.replace('.md', '');
            const projectResponse = await fetch(`./projects/${link}`);
            const projectMarkdown = await projectResponse.text();

            // Convert Markdown to HTML (simple conversion)
            const projectHTML = projectMarkdown
                .replace(/^# (.*$)/gim, '<h3>$1</h3>')
                .replace(/^\s*([-*+] .*)$/gm, '<p>$1</p>')
                .replace(/
$/gim, '<br />');

            // Create Project Card
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${projectName}</h3>
                <div class="project-description">${projectHTML}</div>
                <a href="projects/${link}" target="_blank">Read More</a>
            `;
            container.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);
