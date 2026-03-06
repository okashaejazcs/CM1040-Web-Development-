/* ==========================================================================
   CM1040 Web Development Coursework - Main JavaScript File
   Project: Pakistan's Digital Leap (2006 - 2026)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* --- 1. UI INTERACTIONS --- */
    
    // Mobile Hamburger Menu Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger) {
        burger.addEventListener('click', () => {
            // Toggles the 'nav-active' class to show/hide the menu on mobile
            nav.classList.toggle('nav-active');
        });
    }

    // Floating "Back to Top" Button Logic
    const backToTopBtn = document.getElementById("backToTopBtn");
    
    if (backToTopBtn) {
        // Show the button when the user scrolls down 200px from the top
        window.onscroll = function() {
            if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
                backToTopBtn.style.display = "block";
            } else {
                backToTopBtn.style.display = "none";
            }
        };

        // Scroll smoothly to the top when clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

/* --- 2. FETCH & TEMPLATE ENGINE LOGIC --- */

/**
 * Fetches JSON data from the provided URL, validates it, and renders it.
 * This function is called at the bottom of era1.html, era2.html, and era3.html.
 * @param {string} jsonUrl - The path to the JSON file (e.g., 'data/era1-06-12.json')
 */
function loadTimelineData(jsonUrl) {
    // Note: The Fetch API requires the site to be run on a local web server (like VS Code Live Server)
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // STEP 1: Validate the data (Crucial coursework requirement)
            const validatedData = validateTimelineData(data);
            
            // STEP 2: Pass the safe, validated data to the template engine
            renderTimeline(validatedData);
        })
        .catch(error => {
            console.error("Error fetching or parsing JSON data:", error);
            const container = document.getElementById('timeline-container');
            if (container) {
                container.innerHTML = `<p style="color:red; text-align:center; padding: 20px;">
                    Failed to load timeline data. Please ensure you are viewing this via a local web server (like VS Code Live Server) and not just double-clicking the HTML file.
                </p>`;
            }
        });
}

/**
 * Validates the JSON data before it is passed to the template engine.
 * Ensures that every object has the required fields, preventing broken HTML renders.
 * @param {Array} dataArray - The raw array of objects fetched from JSON.
 * @returns {Array} - A clean array containing only valid objects.
 */
function validateTimelineData(dataArray) {
    const validData = [];
    
    dataArray.forEach((item, index) => {
        // Check if the necessary properties exist and are not empty strings
        if (item.year && item.title && item.description && item.image) {
            validData.push(item);
        } else {
            // Log a warning for developers if a JSON object is missing data
            console.warn(`Validation failed for timeline item at index ${index}. Missing required fields. Skipping item.`);
        }
    });
    
    return validData;
}

/**
 * Uses the HTML <template> tag to dynamically render the timeline cards.
 * @param {Array} data - The validated array of timeline objects.
 */
function renderTimeline(data) {
    const container = document.getElementById('timeline-container');
    const template = document.getElementById('timeline-template');

    // Safety check: Ensure the container and template exist on the current page
    if (!container || !template) return;

    data.forEach((item, index) => {
        // Clone the content inside the <template> tag
        const clone = template.content.cloneNode(true);

        // Populate the cloned HTML with our JSON data
        clone.querySelector('.timeline-title').textContent = `${item.year}: ${item.title}`;
        clone.querySelector('.timeline-desc').textContent = item.description;
        
        const imgElement = clone.querySelector('.timeline-image');
        imgElement.src = item.image;
        imgElement.alt = item.title; // Good for accessibility!

        // Add alternating 'left' and 'right' classes based on whether the index is even or odd
        const timelineItem = clone.querySelector('.timeline-item');
        if (index % 2 === 0) {
            timelineItem.classList.add('left');
        } else {
            timelineItem.classList.add('right');
        }

        // Inject the populated, cloned template into the DOM
        container.appendChild(clone);
    });
}