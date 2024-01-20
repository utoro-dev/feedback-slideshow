const feedbackContainer = document.getElementById('feedback-container');
const url = 'https://script.google.com/macros/s/AKfycbxROrGjAXhzn5MGD_RP1JF_HmSXlLgStfJ6IRsBrPTge0fjrNsXSV0yOIVf3q-kuVDG/exec';

async function getFeedback() {
  const response = await fetch(url);
  return response.json();
}

function createCommentBox(feedback, age, local, colorClass) {
  const commentBox = document.createElement('div');
  commentBox.className = `comment-box ${colorClass}`;
  commentBox.innerHTML = `
    <p>${feedback.feedback}</p>
    ${(age && local) ? `<div class="age-local">${age} - ${local}</div>` : ''}
  `;
  return commentBox;
}

function calculateDisplayTime(text) {
  const wordsPerMinute = 100;
  const words = text.split(/\s+/).length;
  return Math.max((words / wordsPerMinute) * 60 * 1000, 3000); // Minimum display time of 3 seconds
}

function updateDisplay(feedbacks) {
  feedbackContainer.innerHTML = '';

  // Get three unique feedbacks
  let indices = [];
  while (indices.length < 3) {
    let randomIndex = Math.floor(Math.random() * feedbacks.length);
    if (!indices.includes(randomIndex)) {
      indices.push(randomIndex);
    }
  }

  // Assign color classes based on index
  let colorClasses = ['color1', 'color2', 'color3', 'color4', 'color5'];
  
  // Create and display the feedback boxes
  indices.forEach((index, i) => {
    const feedback = feedbacks[index];
    const colorClass = colorClasses[i % colorClasses.length];
    const commentBox = createCommentBox(feedback, feedback.age, feedback.local, colorClass);
    if (i === 1) { // The main feedback
      commentBox.classList.add('main');
      feedbackContainer.prepend(commentBox);
      // Set display time for the main feedback
      setTimeout(() => updateDisplay(feedbacks), feedback.displayTime * 1000);
    } else {
      feedbackContainer.appendChild(commentBox);
    }
  });
}

getFeedback().then(feedbacks => {
  updateDisplay(feedbacks);
});
