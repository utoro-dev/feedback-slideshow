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
        <div class="content">
         <p>${comment}</p>
            ${(age && local) ? `<div class="age-local">${age} - ${local}</div>` : ''}
        </div>
    `;
    return commentBox;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
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
    shuffleArray(feedbackData);
    feedbackData.forEach((data, index) => {
      const colorClass = `color${(index % 4) + 1}`; // Cycle through 4 colors
      // Pass the displayTime from the data to createCommentBox
      const box = createCommentBox(data.comment, data.age, data.local, colorClass, data.displayTime);
      feedbackContainer.appendChild(box);
      boxes.push(box);
    });
  
    updateSlideshow();
}

// function updateSlideshow() {
//     boxes.forEach((box, index) => {
//       box.classList.remove('main'); // Reset all boxes to non-main state
//       box.style.transform = `translateX(${(index - currentIndex) * 100}%) scale(1)`; // Position side boxes
//       box.style.opacity = 0.5;
//     });
  
//     const mainBox = boxes[currentIndex];
//     mainBox.classList.add('main');
//     mainBox.style.transform = 'translateX(0) scale(2)';
//     mainBox.style.opacity = 1;
  
//     // Retrieve displayTime from the data attribute of the mainBox
//     const displayTime = parseInt(mainBox.getAttribute('data-display-time'));
  
//     currentIndex = (currentIndex + 1) % boxes.length; // Move to the next index, loop back if at the end
  
//     setTimeout(updateSlideshow, displayTime); // Update the slideshow after the display time of the current box
// }  

// function updateSlideshow() {
//     // previosu とnextが重なる
//     boxes.forEach((box, index) => {
//       box.classList.remove('main'); // Reset all boxes to non-main state
//       if (index < currentIndex) {
//         // Position boxes to the left of the main box
//         box.style.transform = `translateX(-50%) scale(0.8)`; 
//       } else if (index > currentIndex) {
//         // Position boxes to the right of the main box
//         box.style.transform = `translateX(50%) scale(0.8)`;
//       } else {
//         // Main box in the center
//         box.style.transform = 'translateX(0) scale(1)';
//       }
//       box.style.opacity = (index === currentIndex) ? 1 : 0.5;
//     });
  
//     const mainBox = boxes[currentIndex];
//     mainBox.classList.add('main');
  
//     // Retrieve displayTime from the data attribute of the mainBox
//     const displayTime = parseInt(mainBox.getAttribute('data-display-time'));
  
//     currentIndex = (currentIndex + 1) % boxes.length; // Move to the next index, loop back if at the end
  
//     setTimeout(updateSlideshow, displayTime); // Update the slideshow after the display time of the current box
// }  


function updateSlideshow() {
    const totalBoxes = boxes.length;
    const boxWidth = feedbackContainer.querySelector('.comment-box').offsetWidth; // Get the width of a box

    boxes.forEach((box, index) => {
        const offset = (index - currentIndex) * (boxWidth + 20); // Calculate the offset for each box, 20 is the margin
        box.style.transform = `translateX(${offset}px) scale(${index === currentIndex ? 2 : 1})`; // Move and scale boxes
        box.style.opacity = index === currentIndex ? 1 : 0.5;
        box.style.zIndex = 1;
    });

    const mainBox = boxes[currentIndex];
    mainBox.classList.add('main');
    mainBox.style.zIndex = 10;

    const displayTime = parseInt(mainBox.getAttribute('data-display-time'));

    currentIndex = (currentIndex + 1) % totalBoxes;

    setTimeout(updateSlideshow, displayTime);
}

// function updateSlideshow() {
//     const boxWidth = feedbackContainer.querySelector('.comment-box').offsetWidth; // Width of a box
//     const containerWidth = feedbackContainer.offsetWidth; // Width of the container
//     const halfContainerWidth = containerWidth / 2;
//     const halfBoxWidth = boxWidth / 2;

//     boxes.forEach((box, index) => {
//         const positionFromCenter = (index - currentIndex) * (boxWidth + 20); // 20 is the margin
//         const leftPosition = halfContainerWidth - halfBoxWidth + positionFromCenter;
//         box.style.left = `${leftPosition}px`; // Position the box
//         box.style.transform = `scale(${index === currentIndex ? 2 : 1})`; // Scale the box
//         box.style.opacity = index === currentIndex ? 1 : 0.5;
//     });

//     const mainBox = boxes[currentIndex];
//     mainBox.classList.add('main');

//     const displayTime = parseInt(mainBox.getAttribute('data-display-time'));

//     currentIndex = (currentIndex + 1) % boxes.length;

//     setTimeout(updateSlideshow, displayTime);
// }

// function updateSlideshow() {
//     const boxWidth = feedbackContainer.querySelector('.comment-box').offsetWidth; // Width of a box
//     const halfBoxWidth = boxWidth / 2;
//     const spacing = 20; // Spacing between boxes

//     boxes.forEach((box, index) => {
//         const positionFromCurrent = (index - currentIndex) * (boxWidth + spacing); // Position relative to the current box
//         const containerCenter = feedbackContainer.offsetWidth / 2; // Center of the container
//         const leftPosition = containerCenter - halfBoxWidth + positionFromCurrent;

//         box.style.left = `${leftPosition}px`; // Set the left position
//         box.style.transform = `scale(${index === currentIndex ? 2 : 1})`; // Scale the box
//         box.style.opacity = index === currentIndex ? 1 : 0.5;
//     });

//     const mainBox = boxes[currentIndex];
//     mainBox.classList.add('main');
//     const displayTime = parseInt(mainBox.getAttribute('data-display-time'));

//     currentIndex = (currentIndex + 1) % boxes.length;
//     setTimeout(updateSlideshow, displayTime);
// }

// function updateSlideshow() {
//     const boxWidth = feedbackContainer.querySelector('.comment-box').offsetWidth; // Width of a box
//     const containerWidth = feedbackContainer.offsetWidth; // Width of the container
//     const halfContainerWidth = containerWidth / 2;
//     const halfBoxWidth = boxWidth / 2;

//     boxes.forEach((box, index) => {
//         const positionFromCenter = (index - currentIndex) * (boxWidth + 20); // 20 is the margin
//         const leftPosition = halfContainerWidth - halfBoxWidth + positionFromCenter;
//         box.style.left = `${leftPosition}px`; // Position the box
//         box.style.transform = `scale(${index === currentIndex ? 2 : 1})`; // Scale the box
//         box.style.opacity = index === currentIndex ? 1 : 0.5;
//     });

//     const mainBox = boxes[currentIndex];
//     mainBox.classList.add('main');

//     const displayTime = parseInt(mainBox.getAttribute('data-display-time'));

//     // Scroll adjustment
//     const mainBoxLeft = mainBox.offsetLeft;
//     const scrollToPosition = mainBoxLeft + halfBoxWidth - halfContainerWidth;
//     feedbackContainer.scrollLeft = scrollToPosition; // Adjust the scroll position

//     currentIndex = (currentIndex + 1) % boxes.length;

//     setTimeout(updateSlideshow, displayTime);
// }




startSlideshow();

