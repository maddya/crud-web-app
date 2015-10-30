/***Created by Maddy on 10/23/2015.*/
//initialize the parse app
Parse.initialize("dsr1nofod6DuerOvKCr65HnVID11TjFM1iCwsEnn", "S3GeBgYj0lnSp1DtZJLLggQvAWo5Kg1OiMQ6u22H");

// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');
var numReviews = 0;
var averageScore = 0;
var reviews = [];

var averageRating = $('#average-rating');
var reviewList = $('#list');
var ratingElem = $('#rating');

$('form').submit(function() {
    var review = new Review();
    $(this).find('input').each(function(){
        review.set($(this).attr('id'), $(this).val());
        $(this).val('');
    });
    review.save(null, {
        success:getData
    });
    return false
});


var getData = function() {
    var query = new Parse.Query(Review);
    query.ascending('createdAt');
    query.notEqualTo('deleted', true);
    query.find({
        success:function(results) {
            buildList(results)
        }
    })
};

// A function to build your list
var buildList = function(data) {
    $('ul').empty();
    reviewList.empty();
    averageRating.empty();
    console.log(averageScore);
    console.log(numReviews);
    data.forEach(function(d){
        addItem(d);
    });
    var avgRate = $('<span>').raty({
        readOnly: true,
        score: averageScore  / numReviews
    });
    avgRate.appendTo(averageRating);
};


var addItem = function(item) {
    var rate = $('<span>').raty({
            readOnly: true,
            score: (item.get('rating')),
            hints: ['1', '2', '3', '4', '5']
    });
    var title = item.get('title');
    var review = item.get('review');
    var rating = item.get('rating');
    var upvote = $('<span>').append('<button id="upvotes"><i class="fa fa-thumbs-up"> </i></button>');
    var downvote = $('<span>').append('<button id="downvotes"><i class="fa fa-thumbs-down"> </i></button>');
    var erase = $('<span>').append('<button id="erases"><i class="fa fa-times"> </i></button>');
    var li = $('<li><div class="individualRating">' + '   <b>' + title  + '</b></br>' + review + '</br></div></li>');
    averageScore += rating;
    rate.prependTo(li);
    upvote.appendTo(li);
    li.append(upvote.click(function () {
        item.increment('upvotes');
        item.increment('totalVotes');
        item.save().then(addItem);
    }));
    downvote.appendTo(li);
    li.append(downvote.click(function () {
        //item.set('upvotes', item.get('upvotes'));
        item.increment('totalVotes');
        item.save().then(addItem);
    }));
    erase.appendTo(li);
    li.append(erase.click(function () {
        item.set('deleted', true);
        item.save().then(addItem);
    }));

    var ratingOfComment = $('<p>' + item.get('upvotes') + ' of ' + item.get('totalVotes') + ' found this review helpful.'+  '</p>');
    ratingOfComment.appendTo(li);
    numReviews++;
    li.appendTo(reviewList);


};

$('form').submit(function () {
    var title = $(this).find('[name="title"]').val();
    var reviewText = $(this).find('[name="review"]').val();
    var review = new Review();
    var score = ratingElem.raty('score');
    review.set('title', title);
    review.set('review', reviewText);
    review.set('rating', score);
    review.set('upvotes', 0);
    review.set('totalVotes', 0);
    review.set('deleted', false);

    review.save().then(getData).then(function () {
        $(this).find('[name="title"]').val('');
        $(this).find('[name="review"]').val('');
        ratingElem.raty('set', {});
    });
    return false;
});

ratingElem.raty();
getData();