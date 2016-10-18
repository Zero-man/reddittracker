var subreddit = document.getElementById('subreddit');
var interval = document.getElementById('interval');
var newLinks = document.getElementById('new-links');
var submitBtn = document.getElementById('submit-button');
var clearBtn = document.getElementById('clear-button');
var BGPage = chrome.extension.getBackgroundPage();

clearBtn.style.display = 'none';

if (localStorage['subreddit'] !== undefined){
  subreddit.value = localStorage.getItem('subreddit');
}
if (localStorage['interval'] !== undefined){
  interval.value = localStorage.getItem('interval');
}
if (localStorage['submitBtn'] !== undefined){
  submitBtn.innerHTML = localStorage.getItem('submitBtn');
}
if (localStorage['newLinks'] !== undefined){
  newLinks.innerHTML = localStorage.getItem('newLinks');
}
if (localStorage['clearBtn'] !== undefined){
  clearBtn.style.display = localStorage.getItem('clearBtn');
}

submitBtn.addEventListener('click', function(event){
  BGPage.apiCall();
});

clearBtn.addEventListener('click', function(){
  BGPage.counter = 0;
  chrome.browserAction.setBadgeText({text: ''});
  newLinks.innerHTML = '';
  this.style.display = 'none';
  localStorage.setItem('newLinks', newLinks.innerHTML);
  localStorage.setItem('clearBtn', this.innerHTML);
});

newLinks.addEventListener('click', function(event){
  if (event.target.tagName.toLowerCase() === 'img'){
    event.target.parentNode.removeChild(event.target.previousElementSibling);
    event.target.parentNode.removeChild(event.target);
    localStorage.setItem('newLinks', newLinks.innerHTML);
    BGPage.counter -= 1;
    chrome.browserAction.setBadgeText({text: `${BGPage.counter}`});
    if (BGPage.counter === 0){
      chrome.browserAction.setBadgeText({text: ''});
      clearBtn.style.display = 'none';
    }
    localStorage.setItem('clearBtn', this.innerHTML);
  }
});
