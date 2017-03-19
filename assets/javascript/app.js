  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAF40T2PsrBRYJanOXMMW0nTDlDE4-AP8A",
    authDomain: "trainscheduler-bdbd9.firebaseapp.com",
    databaseURL: "https://trainscheduler-bdbd9.firebaseio.com",
    storageBucket: "trainscheduler-bdbd9.appspot.com",
    messagingSenderId: "1098181995159"
  };

  firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();

// Submit button is clicked for adding Train
$("#add-train").on("click", function(event) {
	event.preventDefault();

	//  Grabs user input
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrainTime = $("#first-train-time-input").val().trim();
	var frequency = $("#frequency-input").val().trim();

/*
  if(isNaN(firstTrainTime)){
	console.log(firstTrainTime + " is not a number <br/>");
 }else{
	console.log(firstTrainTime + " is a number <br/>");
 };

//	var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").subtract(10, "y").format("X");
	console.log("firstTrainTime " + firstTrainTime);

    // First Time (pushed back 1 year to make sure it comes before current time)
//    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

	var firstTimeConverted = moment(firstTrainTime, "m").subtract(1, "years");

    console.log("firstTimeConverted " + firstTimeConverted);


if(isNaN(firstTrainTime)){
	console.log(firstTimeConverted + " is not a number <br/>");
 }else{
	console.log(firstTimeConverted + " is a number <br/>");
 };

*/



//	console.log("before: ", firstTrainTime, "****************before"); 


//	console.log("after: ", firstTrainTime, "*****************after"); 


//	var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").format()
//	console.log("third time: ", firstTrainTime, "*****************third "); 

	

// ***************************************************
/*
var time = firstTrainTime; // your input "16:30:00"

time = time.split(':'); // convert to array

// fetch
var hour = Number(time[0]);
var minutes = Number(time[1]);
var seconds = Number(time[2]);

// calculate
var timeValue;

if (hour > 0 && hour <= 12) {
  timeValue= "" + hour;
} else if (hour > 12) {
  timeValue= "" + (hour - 12);
} else if (hour == 0) {
  timeValue= "12";
};
 
timeValue += (minutes < 10) ? ":0" + minutes : ":" + minutes;  // get minutes
timeValue += (seconds < 10) ? ":0" + seconds : ":" + seconds;  // get seconds
timeValue += (hours >= 12) ? " P.M." : " A.M.";  // get AM/PM

// show
alert(timeValue);
console.log(timeValue);

// ***************************************************

//	var trainTimeFormat = moment(firstTrainTime).format('HH:mm');
	var trainTimeFormat = timeValue;
	console.log("trainTimeFormat 2: ", trainTimeFormat);        */


//	var trainTimeFormat = moment(firstTrainTime).format('HH:mm');

	console.log(trainName);
	console.log(destination);
	console.log(frequency);
	console.log("FirstTRTI: " + firstTrainTime);

  // Creates local "temporary" object for holding train data

	var newTrain = {
		trainNm: trainName,
	    dest: destination,
		firstTT: firstTrainTime,
		freq: frequency
	};

// Uploads train data to the database
	database.ref().push(newTrain);

// Logs everything to the console
	console.log(newTrain.trainNm);
	console.log(newTrain.dest);
	console.log(newTrain.firstTT);
	console.log(newTrain.freq);

//  Alert 
//	alert("Train successfully added");

//  clears text boxes
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-time-input").val("");
	$("#frequency-input").val("");

// Prevent refreshing / moving to a new page
	return false;
 }); // end of add-train click

// When user adds entry to database (in other event), this creates Fbase event for 
//  adding row in html 

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

	console.log(" childsnapshot: ", childSnapshot.val());

  	//  Store database train in variables
  	var trainName = childSnapshot.val().trainNm;
	var destination = childSnapshot.val().dest;
	var firstTrainTime = childSnapshot.val().firstTT;
	var frequency = childSnapshot.val().freq;

	console.log("The following are the four items: ");
	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log(frequency);

//	var diffTime = moment().diff(moment.unix(trainFirst), "minutes");	
//	var trainTimeFormat = moment(firstTrainTime).format('HH:mm');
//	console.log("trainTimeFormat 1: ", trainTimeFormat);


//	var firstTimeTransfered = moment(firstTrainTime, "hh:mm").subtract(1, "years");
	var firstTimeTransfered = moment(firstTrainTime, "hh:mm").subtract(1, "years");
		console.log("firstTimeTransfered: " + firstTimeTransfered);

/*	var timeCheck = firstTimeTransfered;
	var checkNum = 	parseInt(timeCheck);
	alert("checkNum: " + checkNum);

//	if (isNaN(checkNum)){
		//	okay 
*/

	var presentTime = moment().format("HH:mm A");
		console.log("Current time: " + presentTime);

//  Calculate Next Arrival (current time - firstTrainTime; find remainder/freq)
//	var diffInTime = moment().diff(moment.unix(firstTrainTime), "minutes");

//  Notes from momentjs.com docs
//  moment().diff(moment|String|Number|Date|Array);

//	var diffInTime = moment().diff(moment.unix(firstTrainTime), "minutes");

//	var diffInTime = moment().diff(moment.unix(firstTrainTime), "minutes");

	var diffInTime = moment().diff(moment(firstTimeTransfered), "minutes");
		console.log("diffInTime: " + diffInTime);

	var timeRemainder = diffInTime % frequency;
		console.log("timeRemainder: " + timeRemainder);

	var minAway = frequency - timeRemainder;
		console.log("Minutes until train arrival: " + minAway);

//	console.log("First Train time: " + firstTrainTime);

//  Notes from Momentjs.com docs
//  This adds time to an existing moment. To add time, pass the key of what time 
//     you want to add, and the amount you want to add. "moment().add(7, 'minutes');"
//  calculating the arrival time add minutes to the current time (in minutes)

	var timeUntilArrival = moment().add(minAway, "minutes");
		console.log("Next train arrival time: " + moment(timeUntilArrival).format("hh:mm A"));
//	var timeUntilArrival = moment().add(minAway, "m").format("hh:mm A");

//	console.log(moment().format("hh:mm A"));
//	console.log(moment().format("HH:mm"));
//	console.log(timeUntilArrival);
//	console.log(moment.unix(firstTrainTime).format("X"));
//	console.log(moment().format("X"));

	var nextTime = moment(timeUntilArrival).format("hh:mm");

// Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + nextTime + "</td><td>" + minAway + "</td></tr>");
/*
} //  end of if train is nan
	else {
		alert('Please re-enter info: First Train Time is invalid, (HH:mm in military time) ');
	};
*/
});
