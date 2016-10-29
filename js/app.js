var subreddit = document.getElementById('subreddit');
var interval = document.getElementById('interval');
var newLinks = document.getElementById('new-links');
var submitBtn = document.getElementById('submit-button');
var clearBtn = document.getElementById('clear-button');
var BGPage = chrome.extension.getBackgroundPage();

if (BGPage.newPosts.length !== 0){
  BGPage.newPosts.forEach(function(item, index){
      var newItem = document.createElement('a');
      var link = document.createTextNode(item[1]);
      newItem.appendChild(link);
      newItem.title = item[1];
      newItem.href = `https://www.reddit.com${item[0]}`;
      newItem.addEventListener('click', function(){
          chrome.tabs.create({ url: newItem.href });
      });
      newLinks.appendChild(newItem);
  });
  clearBtn.style.display = 'inline-block';
}
if (BGPage.localStorage['subreddit'] !== undefined){
  subreddit.value = BGPage.localStorage.getItem('subreddit');
}
if (BGPage.localStorage['interval'] !== undefined){
  interval.value = BGPage.localStorage.getItem('interval');
}
if (BGPage.localStorage['submitBtn'] !== undefined && BGPage.intervalID !== undefined){
  submitBtn.innerHTML = BGPage.localStorage.getItem('submitBtn');
}

submitBtn.addEventListener('click', function(){
  BGPage.apiCall();
});

clearBtn.addEventListener('click', function(){
  BGPage.clearOnClick();
});
