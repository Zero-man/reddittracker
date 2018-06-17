var currentListIDs;
var newPosts = [];
var counter = newPosts.length;
var intervalID;

function start (subreddit, interval, submitBtn) {
    submitBtn.innerHTML = "Stop Tracking";
    localStorage.setItem('submitBtn', submitBtn.innerHTML);

    if (localStorage.getItem('subreddit') !== subreddit) {
        currentListIDs = null;
    }

    localStorage.setItem('subreddit', subreddit);
    localStorage.setItem('interval', interval);

    intervalID = setInterval(function () { 
        retrieveData(subreddit, interval, submitBtn) 
    }, interval * 1000);
}

function stop (subreddit, interval, submitBtn) {
    submitBtn.innerHTML = "Track";
    localStorage.setItem('submitBtn', submitBtn.innerHTML);
    localStorage.clear();
    clearInterval(intervalID);
    intervalID = null;
}

function validate (subreddit, interval) {
    return new Promise((resolve, reject) => { 
        if (subreddit === '' || interval === '') {
            reject({
                error: true,
                message: "Please enter an interval value between 1 and 3600 seconds."
            });
        }
        if (interval < 1 || interval > 3600) {
            reject({
                error: true,
                message: "Please complete both fields."
            });
        }

        !intervalID ? resolve(start) : resolve(stop);
    });    
}

function clearOnClick (newLinks, clearBtn) {
    newPosts = [];
    chrome.browserAction.setBadgeText({text: ''});
    newLinks.innerHTML = '';
    clearBtn.style.display = 'none';
}

function retrieveData (subreddit, interval, submitBtn) {
    return fetch(`http://www.reddit.com/r/${subreddit.trim()}/new.json?limit=10`)
        .then(res => {
            return res.json();
        })
        .then(json => {
            if (!currentListIDs) {
                currentListIDs = json.data.children.map(e => e.data.id);
                return;
            }
            var addedItems = json.data.children.filter((e, i) => !currentListIDs.includes(e.data.id));
            if (addedItems.length) {
                renderNewItems(addedItems);
                var enableNotifications = JSON.parse(localStorage.getItem('notifications'));
                if (enableNotifications) {
                    chrome.notifications.create({ 
                        type: 'basic',
                        iconUrl: 'icon48.png', 
                        title: 'Subreddit Tracker',
                        message: 'New post(s) in your tracked subreddit!'
                    });
                }

                currentListIDs = json.data.children.map(e => e.data.id);
            }
        })
        .catch(err => {
            stop(subreddit, interval, submitBtn);
            alert('Sorry, that is not a valid subreddit name! Please check your input and try again.');
        });
}

function setEnableNotifications (setting) {
    localStorage.setItem('notifications', setting);
}

function renderNewItems (items) {
    var views = chrome.extension.getViews({type: 'popup'})[0];

    items.forEach(e => {
        var title = e.data.title,
            link = e.data.permalink;

        newPosts.unshift([link, title]);
        counter = newPosts.length;
        chrome.browserAction.setBadgeText({text: `${counter}`});

        //dumb error when popup not open. why am I even rendering from the BG page???
        if (views) {
            var newItem = document.createElement('a');
            var newLink = document.createTextNode(title);
            newItem.appendChild(newLink);
            newItem.title = title;
            newItem.href = `https://www.reddit.com${link}`;
            newItem.addEventListener('click', function(){
                chrome.tabs.create({ url: newItem.href });
            });
            views.newLinks.insertBefore(newItem, views.newLinks.firstChild);
            views.clearBtn.style.display = 'inline-block';
        }
    });
}
