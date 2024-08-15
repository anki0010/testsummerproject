/*import { searchUsers } from "./src/middleware/search.middleware.js";

document.addEventListener('DOMContentLoaded', () => {
const userSearchForm = document.getElementById('user-search-form');
const searchStringInput = document.getElementById('search-string');
const searchResultsDiv = document.getElementById('search-results');

function displaySearchResults(response) {
  const users = response.data;
  searchResultsDiv.innerHTML = '';

  console.log('Response from server:', response);

  users.forEach(user => {
    const userElement = document.createElement('div');
    userElement.textContent = `${user.firstName} ${user.lastName} (${user.username})`;
    searchResultsDiv.appendChild(userElement);
  });

  // Show the search results dropdown
  searchResultsDiv.style.display = 'block';
}
document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
      searchResultsDiv.style.display = 'none';
    }
  });

userSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const searchString = searchStringInput.value;

  searchUsers(searchString)
    .then((users) => {
      displaySearchResults(users);
    })
    .catch((error) => {
      console.error('Error searching users:', error);
    });
});
});*/

import { searchUsers } from './src/middleware/search.middleware.js';

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = searchForm.querySelector('.search-bar-input textarea');
  
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchString = searchInput.value;
        if (searchString.trim() === '') return;
        try {
            const searchResults = await searchUsers(searchString);
            console.log("Search results:", searchResults);
            displaySearchResults(searchResults.data);
        } catch (error) {
            console.error("Error while searching for \"" + searchString + "\":", error);
        }
    });

  async function search(searchTerm) {
    try {
      const searchResults = await searchUsers(searchTerm);
  
      // Update the search results on the page
      console.log('Search results:', searchResults);
      console.log(`Search for "${searchTerm}" was successful.`);
      displaySearchResults(searchResults.data);
    } catch (error) {
      console.error(`Error while searching for "${searchTerm}":`, error);
    }
  }
  
  document.addEventListener('click', (event) => {
    const searchResults = document.querySelector('.search-results');
    const searchBarInput = document.querySelector('.search-bar-input');
  
    if (!searchBarInput.contains(event.target) && !searchResults.contains(event.target)) {
      searchResults.style.display = 'none';
    }
  });

  function displaySearchResults(results) {
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p>No results found</p>';
    } else {
        results.forEach(result => {
            const resultElement = document.createElement('p');
            resultElement.textContent = result.username;
            resultsContainer.appendChild(resultElement);
        });
    }

    resultsContainer.style.display = 'block';
    }
});
