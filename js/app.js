
var subreddit = document.getElementById('subreddit');
var interval = document.getElementById('interval');
var counterDiv = document.getElementById('counter');
var newLinks = document.getElementById('new-links');
var submitBtn = document.getElementById('submit-button');
var clearBtn = document.getElementById('clear-button');
var intervalID;
var newPosts = [];
var counter = 0;

clearBtn.style.display = 'none';
submitBtn.addEventListener('click', function(event){
  if (subreddit.value === '' || interval.value === ''){
  return null;
  }
  if (submitBtn.innerHTML == "Track") {
    submitBtn.innerHTML = "Stop Tracking";
  } else {
    submitBtn.innerHTML = "Track";
  }
  if (!intervalID) {
    intervalID = setInterval(apiCall, interval.value * 1000);
  } else {
    clearInterval(intervalID);
    intervalId = null;
  }
});

clearBtn.addEventListener('click', function(){
  newPosts = [];
  counter = 0;
  newLinks.innerHTML = '';
  counterDiv.innerHTML = `<h3>New posts: ${counter}</h3>`;
  this.style.display = 'none';
});

newLinks.addEventListener('click', function(event){
  if (event.target.tagName.toLowerCase() === 'img'){
    event.target.parentNode.removeChild(event.target.previousElementSibling);
    event.target.parentNode.removeChild(event.target);
    counter -= 1;
    counterDiv.innerHTML = `<h3>New posts: ${counter}</h3>`;
  }
});

function apiCall(){
  $.getJSON(
         `http://www.reddit.com/r/${subreddit.value}/new.json?`, function (data){
           var title = data.data.children[0].data.title;
           var link = data.data.children[0].data.permalink;
           if (!newPosts.includes(link)){
             newPosts.push(link);
             counter += 1;
             counterDiv.innerHTML = `<h3>New posts: ${counter}</h3>`;
             var newItem = document.createElement('div');
             newItem.className += 'new';
             newItem.innerHTML = `<a href="https://www.reddit.com${link}">${title}</a><img class="trash" src="./img/delete-icon.png">`
             newLinks.appendChild(newItem);
             clearBtn.style.display = 'inline-block';
           }
         });

}
