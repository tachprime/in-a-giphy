//var stillImages = [];
//var activeImages = [];
var $gallery = $('#gallery');
var $data;
var topics = ["BMW M5", "Enzo Ferrari", "Pagani Zonda", "Bugatti Veryon", "Toyota Supra", "Nissan Skyline GTR", "Mazda RX-7"];
//query for AJAX call
var MyQuery = {url: "",method: "GET"};

function getUrl(topic) {
    //public apikey "dc6zaTOxFJmzC”
    let apiKey = 'dc6zaTOxFJmzC';
    let limit = 10; //sets limit of images returned
    return `https://api.giphy.com/v1/gifs/search?q=${topic}&limit=${limit}&api_key=${apiKey}`;
}

function setTopicBtns() {
    //empty div when making new buttons
    $('#topics').empty();
    
    for (let i = 0; i < topics.length; i++) {
        let btn = $('<button>');
        btn.addClass('topicBtn btn');
        btn.attr('id', 'topic-' + i);
        btn.attr('value', topics[i]);
        btn.text(topics[i]);
        $('#topics').append(btn);
    }
}

function searchTopic() {
    $('.topicBtn').on('click', function(){
        //gets text from topic buttons to be passed to query
        let currentBtn = "#"+ $(this).attr('id');
        let keyWord = $(currentBtn).val();
        
        //change spaces to '+' for api queries
        keyWord = keyWord.replace(" ","+");
        
        //inserts topic into query string to be searched
        MyQuery.url = getUrl(keyWord);
        getData(MyQuery);
    });
}

function showGifs(response) {
    $gallery.empty();
    
    //loop through data to display all images from Query
    for (let i = 0; i < response.length; i++) {
        
        let activeUrl = response[i].images.fixed_height.url;
        let stillUrl = response[i].images.fixed_height_still.url;
        let img = $(`<img class="gifImage" src="${stillUrl}">`);
    
        //old way of storing my still and active Gifs
        //-------------------------------------------------------
        //save urls for switching animated and still images
        //activeImages[i] = activeUrl;
        //stillImages[i] = stillUrl;
        
        //append divs and images to #gallery div with attributes
        //for future reference
        let imgDiv = $('<div>');
        let rating = $(`<p>Rating: ${response[i].rating}</p>`);
        imgDiv.addClass('gifDiv');
        //use slug instead of id to get the unique id+Query
        //string together
        img.attr('id', response[i].slug);
        img.attr('value', 'still');
        img.data('play', activeUrl);
        img.data('stop', stillUrl);
        $gallery.append(imgDiv);
        $(imgDiv).append(rating);
        $(imgDiv).append(img);
    }
}

function animateGifs(){
 $('.gifImage').on('click', function() {
    let currentGif = '#' + $(this).attr('id');
    let play = $(currentGif).data('play');
    let stop = $(currentGif).data('stop');
     
     if (stop == $('#bigGif').attr('src')) {
         $('#bigGif').attr('src', play);
     } else {
         $('#bigGif').attr('src', stop);
     }
     
//old solution for gif switching
//---------------------------------------------------------------     
    //find matching data to current image id
//    for (let i = 0; i < $data.length; i++) {
//        if (response[i].slug == currentGif) {
//            //animate if its a still image
//            if ($('#'+ currentGif).attr('value') == 'still') {
//                $('#'+ currentGif).attr('src', activeImages[i]);
//                $('#'+ currentGif).attr('value', 'active');
//                $('#bigGif').attr('src', activeImages[i]);
//                break;
//            } else {
//                //turn back to still image if active
//                $('#'+ currentGif).attr('src', stillImages[i]);
//                $('#'+ currentGif).attr('value', 'still');
//                $('#bigGif').attr('src', stillImages[i]);
//                break;
//            }
//        }
//    }
 });
}

function getData(query){
    $.ajax(query).done(function(data){
        $data = data.data;
        showGifs($data);
        animateGifs();
    });
}

//add new topic to top of page
$('#addBtn').on('click', function() {
    let input = $('#topicInput').val().trim();
    console.log(input);
    //checks if topic already exists
    if (topics.indexOf(input) == -1 && input !== "" && input !== " ") {
        topics.push(input);
    } else {
        alert("already a topic");
    }
    
    setTopicBtns();
    searchTopic();
    return false;
});

$(document).ready(function(){
    setTopicBtns();
    searchTopic();
});