
var newPosts = [];
var counter = newPosts.length;
var intervalID;
var currentLink = '';

function apiCall(){
  var views = chrome.extension.getViews({type: 'popup'})[0];
  var interval = parseInt(views.interval.value) * 1000;
  if (views.subreddit.value === '' || views.interval.value === '') {
    alert("Please complete both fields.")
    return null;
  }
  if (views.interval.value < 1 || views.interval.value > 3600) {
    alert("Please enter an interval value between 1 and 3600 seconds.")
    return null;
  }
  if (!intervalID){
    views.submitBtn.innerHTML = "Stop Tracking";
    localStorage.setItem('submitBtn', views.submitBtn.innerHTML);
    intervalID = setInterval(function(){ retrieveData(views) }, interval);
  } else {
    views.submitBtn.innerHTML = "Track";
    localStorage.setItem('submitBtn', views.submitBtn.innerHTML);
    localStorage.clear();
    clearInterval(intervalID);
    intervalID = null;
  }
  localStorage.setItem('subreddit', views.subreddit.value);
  localStorage.setItem('interval', views.interval.value);
}

function clearOnClick(){
  var views = chrome.extension.getViews({type: 'popup'})[0];
  newPosts = [];
  chrome.browserAction.setBadgeText({text: ''});
  views.newLinks.innerHTML = '';
  views.clearBtn.style.display = 'none';
}

function retrieveData(item){
  var views = chrome.extension.getViews({type: 'popup'})[0];
  var xhr = new XMLHttpRequest();
  xhr.open('GET', `http://www.reddit.com/r/${item.subreddit.value.trim()}/new.json?`);
  xhr.onload = function() {
    if (xhr.status === 200) {
      var data = JSON.parse(xhr.responseText);
      var title = data.data.children[0].data.title;
      var link = data.data.children[0].data.permalink;
      if (currentLink !== link){
        currentLink = link;
        newPosts.unshift([link, title]);
        counter = newPosts.length;
        chrome.browserAction.setBadgeText({text: `${counter}`});
        if (views){
          var newItem = document.createElement('a');
          var newLink = document.createTextNode(newPosts[0][1]);
          newItem.appendChild(newLink);
          newItem.title = newPosts[0][1];
          newItem.href = `https://www.reddit.com${newPosts[0][0]}`;
          newItem.addEventListener('click', function(){
            chrome.tabs.create({ url: newItem.href });
          });
          views.newLinks.insertBefore(newItem, views.newLinks.firstChild);
          views.clearBtn.style.display = 'inline-block';
        }
      }
    } else {
      console.log(xhr.status);
    }
  };
  xhr.send();
}
