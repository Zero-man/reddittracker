var BGPage = chrome.extension.getBackgroundPage();
var subreddit = document.getElementById('subreddit');
var interval = document.getElementById('interval');
var enableNotifications = document.getElementById('notifications');
var newLinks = document.getElementById('new-links');
var submitBtn = document.getElementById('submit-button');
var clearBtn = document.getElementById('clear-button');

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

if (BGPage.localStorage['submitBtn'] !== undefined && BGPage.intervalID !== undefined) {
    submitBtn.innerHTML = BGPage.localStorage.getItem('submitBtn');
}

if (BGPage.localStorage.getItem('notifications')) {
    enableNotifications.checked = JSON.parse(BGPage.localStorage.getItem('notifications')) 
} else {
    enableNotifications.checked = true;
    BGPage.setEnableNotifications(true);
}

submitBtn.addEventListener('click', function () {
    BGPage.validate(subreddit.value, interval.value)
        .then(fn => {
            fn(subreddit.value, interval.value, submitBtn);
        })
        .catch(err => {
            alert(err.message);
        });
});

clearBtn.addEventListener('click', function(){
    BGPage.clearOnClick(newLinks, clearBtn);
});

enableNotifications.addEventListener('click', function(){
    var enableNotifications = JSON.parse(BGPage.localStorage.getItem('notifications'));
    BGPage.setEnableNotifications(!enableNotifications);
});
