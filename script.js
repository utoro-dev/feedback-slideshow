const feedbackContainer = document.getElementById('feedback-container');
const url = 'https://script.google.com/macros/s/AKfycbxROrGjAXhzn5MGD_RP1JF_HmSXlLgStfJ6IRsBrPTge0fjrNsXSV0yOIVf3q-kuVDG/exec';

async function getFeedback() {
  const response = await fetch(url);
  return response.json();
}

function createCommentBox(comment, age, local, colorClass, displayTime) {
    const commentBox = document.createElement('div');
    commentBox.className = `comment-box ${colorClass}`;
    commentBox.setAttribute('data-display-time', displayTime); // Store displayTime as a data attribute
    commentBox.innerHTML = `
      <p>${comment}</p>
      ${(age && local) ? `<div class="age-local">${age} - ${local}</div>` : ''}
    `;
    return commentBox;
  }

function calculateDisplayTime(text) {
    const wordsPerMinute = 100;
    const words = text.split(/\s+/).length;
    return Math.max((words / wordsPerMinute) * 60 * 1000, 3000); // Minimum display time of 3 seconds
}

let currentIndex = 0;
let boxes = [];

async function startSlideshow() {
    const feedbackData = await getFeedback();
    feedbackData.forEach((data, index) => {
      const colorClass = `color${(index % 5) + 1}`; // Cycle through 5 colors
      // Pass the displayTime from the data to createCommentBox
      const box = createCommentBox(data.comment, data.age, data.local, colorClass, data.displayTime);
      feedbackContainer.appendChild(box);
      boxes.push(box);
    });
  
    updateSlideshow();
  }

function updateSlideshow() {
    boxes.forEach((box, index) => {
      box.classList.remove('main'); // Reset all boxes to non-main state
      box.style.transform = `translateX(${(index - currentIndex) * 100}%) scale(1)`; // Position side boxes
      box.style.opacity = 0.5;
    });
  
    const mainBox = boxes[currentIndex];
    mainBox.classList.add('main');
    mainBox.style.transform = 'translateX(0) scale(2)';
    mainBox.style.opacity = 1;
  
    // Retrieve displayTime from the data attribute of the mainBox
    const displayTime = parseInt(mainBox.getAttribute('data-display-time'));
  
    currentIndex = (currentIndex + 1) % boxes.length; // Move to the next index, loop back if at the end
  
    setTimeout(updateSlideshow, displayTime); // Update the slideshow after the display time of the current box
  }  
  
  

startSlideshow();

