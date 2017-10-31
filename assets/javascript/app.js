//connects to firebase
$(document).ready(function(){
var config = {
    apiKey: "AIzaSyCyx5pCA08mqwsu2rHg8KbUjDAXDVWb3l0",
    authDomain: "trainscheduler-69e1f.firebaseapp.com",
    databaseURL: "https://trainscheduler-69e1f.firebaseio.com",
    storageBucket: "trainscheduler-69e1f.appspot.com",
  };
firebase.initializeApp(config);

// Reference to the database service	
var database = firebase.database();
//controls what happens when you press submit
$("#submit").on("click", function() {
// Reference to the database service
	var name = $('#nameInput').val().trim();
    var dest = $('#destInput').val().trim();
    var time = $('#timeInput').val().trim();
    var freq = $('#freqInput').val().trim();

    // Code for handling the push
	database.ref().push({
		name: name,
		dest: dest,
    	time: time,
    	freq: freq,
    	timeAdded: firebase.database.ServerValue.TIMESTAMP
	});
	
	$("input").val('');
    return false;
});

// Creates the table with Train data and performs calculations for Next Arrival and Minutes Away
database.ref().on("child_added", function(childSnapshot){
	
	var name = childSnapshot.val().name;
	var dest = childSnapshot.val().dest;
	var time = childSnapshot.val().time;
	var freq = childSnapshot.val().freq;

	console.log("Name: " + name);
	console.log("Destination: " + dest);
	console.log("Time: " + time);
	console.log("Frequency: " + freq);

	var freq = parseInt(freq);
	//defines parameters
	var currentTime = moment();
	console.log("CURRENT TIME: " + moment().format('HH:mm'));
	
	var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("DATE CONVERTED: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("TRAIN TIME : " + trainTime);
	
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("DIFFERENCE IN TIME: " + tDifference);
	
	var tRemainder = tDifference % freq;
	console.log("TIME REMAINING: " + tRemainder);
	
	var minsAway = freq - tRemainder;
	console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
	
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
	
$('#currentTime').text(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().dest +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
 },
//error check
function(errorObject){
    console.log("Read failed: " + errorObject.code)
});


});
