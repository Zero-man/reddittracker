var newPosts = [];
var counter = 0;
var subreddit = prompt('Please enter a subreddit to track: ');
var interval = prompt('Enter interval to check for new posts (in seconds): ') * 1000 || 10000;

apiCall() //initial api call
setInterval(apiCall, interval);
function apiCall(){
  $.getJSON(
         `http://www.reddit.com/r/${subreddit}/new.json?jsonp=?`, function (data){
           var title = data.data.children[0].data.title;
           var link = data.data.children[0].data.permalink;
           if (!newPosts.includes(link)){
             newPosts.push(link);
             counter += 1;
             $("#counter").html(`<h3>New posts: ${counter}</h3>`);
             $("#new-links").append(`<div class="new"><a href="https://www.reddit.com${link}">${title}</a></div>`);
           }
         });
}
