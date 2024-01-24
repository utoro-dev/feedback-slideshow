const feedbackContainer = document.getElementById('feedback-container');
const url = 'https://script.google.com/macros/s/AKfycbxROrGjAXhzn5MGD_RP1JF_HmSXlLgStfJ6IRsBrPTge0fjrNsXSV0yOIVf3q-kuVDG/exec';

async function getFeedback() {
  const response = await fetch(url);
  return response.json();
}

function createCommentBox(comment, age, local, colorClass, displayTime) {
    const commentBox = document.createElement('div');
    commentBox.className = `comment-box ${colorClass}`;
    commentBox.setAttribute('data-display-time', displayTime);

        commentBox.innerHTML = `
            <div class="content">
                <p>${comment}</p>
                ${(age && local) ? `<div class="age-local">${age} - ${local}</div>` : ''}
            </div>
        `;
    return commentBox;
}

function createTweetBox(embedLink, colorClass, displayTime) {
    const tweetBox = document.createElement('div');
    tweetBox.className = `tweet-box ${colorClass}`;
    tweetBox.setAttribute('data-display-time', displayTime);

    tweetBox.innerHTML = embedLink;

    return tweetBox;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

let currentIndex = 0;
let boxes = [];

async function startSlideshow() {
    const feedbackData = await getFeedback();
    shuffleArray(feedbackData);
    feedbackData.forEach((data, index) => {
        const colorClass = `color${(index % 5) + 1}`;
        let box;
        if (data.is_tweet) {
            box = createTweetBox(data.embed_link, colorClass, data.displayTime);
        } else {
            box = createCommentBox(data.comment, data.age, data.local, colorClass, data.displayTime);
        }
        feedbackContainer.appendChild(box);
        boxes.push(box);
    });

    if (typeof twttr !== 'undefined' && twttr.widgets) {
        twttr.widgets.load();
    }
  
    updateSlideshow();
}

function updateSlideshow() {
    const totalBoxes = boxes.length;
    const boxWidth = feedbackContainer.querySelector('.comment-box').offsetWidth; // Get the width of a box

    boxes.forEach((box, index) => {
        const offset = (index - currentIndex) * (boxWidth + 20); // Calculate the offset for each box, 20 is the margin
        box.style.transform = `translateX(${offset}px) scale(${index === currentIndex ? 2 : 1})`; // Move and scale boxes
        box.style.opacity = index === currentIndex ? 1 : 0.5;
        box.style.zIndex = 1;
        box.classList.remove('main');
    });

    const mainBox = boxes[currentIndex];
    mainBox.classList.add('main');
    mainBox.style.zIndex = 10;

    const displayTime = parseInt(mainBox.getAttribute('data-display-time'));

    currentIndex = (currentIndex + 1) % totalBoxes;

    setTimeout(updateSlideshow, displayTime);
}

startSlideshow();

