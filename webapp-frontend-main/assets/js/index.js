import { getUserInfo } from './src/middleware/user.middleware.js';
import { sharePicture, deletePicture, updatePictureCaption } from './src/middleware/picture.middleware.js';
import { getToken } from './src/utils/index.js';
import { likePicture, commentPicture } from './src/middleware/like_comment_middleware.js';

document.addEventListener('DOMContentLoaded', async function() {
  console.log("DOM fully loaded and parsed.");
  
  const userId = 'userId'; // Placeholder, replace with actual user ID retrieval logic
  const token = getToken();
  const decodedToken = jwt_decode(token);
  let userInfo;

  try {
    userInfo = await getUserInfo(decodedToken.user.body.userId);
    console.log("User info:", userInfo);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return;
  }

  const postForm = document.getElementById('post-form');
  if (postForm) {
    postForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const description = document.getElementById('post-content').value;
      const imageFile = document.getElementById('post-image').files[0];

      if (!imageFile) {
        alert("Please select an image before submitting.");
        return;
      }

      const temporaryPost = addNewPost(userInfo.username, description, 'images/loading.gif', null, true);

      const postData = new FormData();
      postData.append('userId', userId);
      postData.append('description', description);
      postData.append('pictureImage', imageFile);

      try {
        const { imageUrl, pictureId } = await sharePicture(postData);
        temporaryPost.remove(); // Remove the temporary post
        addNewPost(userInfo.username, description, imageUrl, pictureId);
      } catch (error) {
        temporaryPost.remove();
        console.error("Error creating post:", error);
      }

      postForm.reset();
    });
  } else {
    console.error("Post form not found!");
  }

  // Delegate event listeners to the feeds container
  const feedsContainer = document.querySelector('.feeds');
  
  if (feedsContainer) {
    feedsContainer.addEventListener('click', function(event) {
      const postElement = event.target.closest('.feed');
      if (!postElement) return;

      const postId = postElement.getAttribute('data-id');

      if (event.target.classList.contains('fa-heart')) {
        toggleLike(postId);
      }

      if (event.target.classList.contains('fa-comment-dots')) {
        const commentInputWrapper = postElement.querySelector('.comment-input-wrapper');
        commentInputWrapper.style.display = commentInputWrapper.style.display === 'none' ? 'flex' : 'none';
      }

      if (event.target.classList.contains('postCommentBtn')) {
        submitComment(postId);
      }
    });
  } else {
    console.error("Feeds container not found!");
  }

  // Handle Add Image Button Click
  const addImageButton = document.getElementById("addImageButton");
  const postImageInput = document.getElementById('postImage');
  const uploadedFileName = document.getElementById('uploadedFileName');

  if (addImageButton && postImageInput && uploadedFileName) {
    addImageButton.addEventListener('click', () => {
      postImageInput.click();
    });

    postImageInput.addEventListener("change", () => {
      const selectedFile = postImageInput.files[0];
      uploadedFileName.textContent = selectedFile ? selectedFile.name : "";
    });
  } else {
    console.error("Add image button, image input, or file name label not found!");
  }

  // Add the search functionality here inside DOMContentLoaded
  document.getElementById('searchButton').addEventListener('click', function(event) {
    event.preventDefault();
    const searchTerm = document.querySelector('.search-bar textarea').value.toLowerCase();
    const posts = document.querySelectorAll('.feed');

    posts.forEach(post => {
      const postContent = post.querySelector('.caption p').innerText.toLowerCase();
      const postAuthor = post.querySelector('.user h3').innerText.toLowerCase();
      
      if (postContent.includes(searchTerm) || postAuthor.includes(searchTerm)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
  });

  // Comment editing and deleting functionality
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-comment')) {
      const commentId = event.target.dataset.id;
      editComment(commentId);
    } else if (event.target.classList.contains('delete-comment')) {
      const commentId = event.target.dataset.id;
      deleteComment(commentId);
    }
  });

});

// Function to delete a comment
window.deleteComment = function(commentId) {
  const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);

  if (confirm("Are you sure you want to delete this comment?")) {
    commentElement.remove();
    // Remove the comment on the backend as well (when backend is integrated)
  }
};

// Function to edit a comment
window.editComment = function(commentId) {
  const commentElement = document.querySelector(`.comment[data-id="${commentId}"] p`);
  const newCommentText = prompt("Edit your comment:", commentElement.innerText);

  if (newCommentText) {
    commentElement.innerText = newCommentText;
    // Update the comment on the backend as well (when backend is integrated)
  }
};

// Function to add a new post to the UI
function addNewPost(username, postDescription, imageUrl, pictureId, likesCount = 0, commentsCount = 0, temporary = false) {
  const newPost = document.createElement("div");
  newPost.classList.add("feed");
  newPost.setAttribute("data-id", pictureId); // Add data-id to post for later use

  newPost.innerHTML = `
    <div class="head">
      <div class="user">
        <div class="profile-photo">
          <img src="images/profile-1.png">
        </div>
        <div class="info">
          <h3>${username}</h3>
        </div>
      </div>
      <div class="wrapper">
        <input id="Edit${pictureId}" type="checkbox">
        <label for="Edit${pictureId}">
          <i class="fa-solid fa-ellipsis"></i>
        </label>
        <div class="dropdown">
          <a href="javascript:void(0)" onclick="editPost(this)" data-picture-id="${pictureId}">Edit Post</a>
          <a href="javascript:void(0)" onclick="deletePost(this)" data-picture-id="${pictureId}">Delete Post</a>
        </div>
      </div>
    </div>
    <div class="photo">
      <img src="${temporary ? 'images/loading.gif' : imageUrl}">
    </div>
    <div class="action-buttons">
      <div class="interaction-buttons">
        <span><i class="fa-solid fa-heart"></i> <span class="like-count">${likesCount}</span></span>
        <span><i class="fa-solid fa-comment-dots"></i> <span class="comment-count">${commentsCount}</span></span>
        <span><i class="fa-solid fa-share-nodes"></i></span>
      </div>
      <div class="bookmark">
        <span><i class="fa-solid fa-bookmark"></i></span>
      </div>
    </div>
    <div class="caption">
      <p><b>${username}</b> ${postDescription} <span class="harsh-tag">#afternoon</span></p>
    </div>
    <div class="comment-input-wrapper" style="display: none;">
      <textarea placeholder="Write a comment..." class="custom-input comment-input"></textarea>
      <button class="postCommentBtn">Post</button>
    </div>
  `;

  const feedsContainer = document.querySelector(".feeds");
  feedsContainer.appendChild(newPost);

  return newPost;
}
// Functions to handle editing and deleting posts
window.editPost = async function(element) {
  const pictureId = element.getAttribute('data-picture-id');
  const newCaption = prompt("Please enter the new caption for the post:");
  if (newCaption) {
    try {
      await updatePictureCaption(pictureId, newCaption);
      alert("Caption updated successfully!");
      const postElement = document.querySelector(`.feed[data-id="${pictureId}"] .caption p`);
      postElement.innerHTML = `<b>${postElement.querySelector('b').textContent}</b> ${newCaption}`;
    } catch (error) {
      console.error("Error updating caption:", error);
      alert("An error occurred while updating the caption. Please try again.");
    }
  }
};

window.deletePost = async function(element) {
  const pictureId = element.getAttribute('data-picture-id');
  const confirmDelete = confirm("Are you sure you want to delete this post?");
  if (confirmDelete) {
    try {
      await deletePicture(pictureId);
      alert("Post deleted successfully!");
      document.querySelector(`.feed[data-id="${pictureId}"]`).remove();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post. Please try again.");
    }
  }
};
