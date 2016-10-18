var newPosts = '';
var counter = 0;
var intervalID;

function apiCall(){
  var views = chrome.extension.getViews({type: 'popup'})[0];
  var subreddit = views.subreddit.value;
  var interval = parseInt(views.interval.value) * 1000;
  if (subreddit === '' || interval === null) {
    return null;
  }
  if (interval < 1 || interval > 3600000) {
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

function retrieveData(item){
  $.getJSON(
     `http://www.reddit.com/r/${item.subreddit.value}/new.json?`, function (data){
        var title = data.data.children[0].data.title;
        var link = data.data.children[0].data.permalink;
        if (newPosts !== link){
          newPosts = link;
          counter += 1;
          chrome.browserAction.setBadgeText({text: `${counter}`});
          item.counterDiv.innerHTML = `<h3>New posts: ${counter}</h3>`;
          var newItem = item.document.createElement('div');
          newItem.className += 'new';
          newItem.innerHTML = `<a href="https://www.reddit.com${link}">${title}</a><img class="trash" src="./img/delete-icon.png">`
          item.newLinks.appendChild(newItem);
          item.clearBtn.style.display = 'inline-block';
          localStorage.setItem('newPosts', newPosts);
          localStorage.setItem('counterDiv', item.counterDiv.innerHTML);
          localStorage.setItem('newLinks', item.newLinks.innerHTML);
          localStorage.setItem('clearBtn', item.clearBtn.style.display);
     }
  });
}
