// script.js

// Theme Toggle
// Get the theme toggle button element
const themeToggleBtn = document.getElementById('theme-toggle');

// Retrieve the current theme from local storage or set it based on the user's system preference
const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Set the data-theme attribute on the HTML element to the current theme
document.documentElement.setAttribute('data-theme', currentTheme);

// Update the theme toggle button text based on the current theme
themeToggleBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

// Add an event listener to the theme toggle button to switch themes when clicked
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        // Toggle the theme between 'dark' and 'light'
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        // Update the data-theme attribute on the HTML element
        document.documentElement.setAttribute('data-theme', theme);
        // Save the selected theme to local storage
        localStorage.setItem('theme', theme);
        // Update the theme toggle button text
        themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
}

// Dynamic Project Loading
async function loadProjects() {
    // Get the container element where projects will be loaded
    const container = document.getElementById('projects-container') || document.getElementById('featured-projects-container');
    if (!container) return; // If no container is found, exit the function

    try {
        // Fetch the list of projects from the 'projects' directory
        const response = await fetch('./projects/');
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();

        // Parse the response as HTML to extract links
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(text, 'text/html');
        const links = Array.from(htmlDoc.querySelectorAll('a'))
                           .map(a => a.getAttribute('href'))
                           .filter(href => href && href.endsWith('.md')); // Filter only Markdown files

        for (const link of links) {
            // Get the project name by removing the '.md' extension
            const projectName = link.replace('.md', '');
            // Fetch the Markdown content of the project
            const projectResponse = await fetch(`./projects/${link}`);
            if (!projectResponse.ok) throw new Error(`Failed to fetch ${link}`);
            const projectMarkdown = await projectResponse.text();

            // Convert Markdown to HTML (simple conversion)
            const projectHTML = projectMarkdown
                .replace(/^# (.*$)/gim, '<h3>$1</h3>') // Convert top-level headings to <h3>
                .replace(/^\s*([-*+] .*)$/gm, '<p>$1</p>') // Convert list items to <p>
                .replace(/\n/g, '<br />'); // Replace newlines with <br /> for line breaks

            // Create a project card element to display the project details
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <h3>${projectName}</h3>
                <div class="project-description">${projectHTML}</div>
                <a href="projects/${link}" target="_blank" rel="noopener noreferrer">Read More</a>
            `;
            // Append the project card to the container
            container.appendChild(card);
        }
    } catch (error) {
        // Log any errors that occur during the fetch or processing
        console.error('Error loading projects:', error);
    }
}

// Load projects when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadProjects);
