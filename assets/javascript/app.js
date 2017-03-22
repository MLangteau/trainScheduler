// Initialize Firebase // bonus
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

//	var firstTrainTime = $("#first-train-time-input").val().trim();
	var firstTrainTime = moment($("#first-train-time-input").val().trim(), "HH:mm").subtract(1, "years").format("X");
		console.log("firstTrainTime:      " + firstTrainTime);

	var firstTrainTimePlain = $("#first-train-time-input").val().trim();
		console.log("firstTrainTimePlain: " + firstTrainTimePlain);

/* NEW */
	var timeStr = firstTrainTimePlain.split(':');
		console.log("firstTrainTimePlain: " + firstTrainTimePlain);
		console.log("timeStr: " + timeStr);

	var h = parseInt(timeStr [0]);			
		m = parseInt(timeStr [1]);

	if (isNaN(h) || isNaN(m)) {
	// don't refresh (hours and minutes not populated correctly)
		console.log("hours and minutes not populated correctly");
		return false;
	}
	else
	{

	var presentTime = moment().format("HH:mm A");
		console.log("Current time: " + presentTime);
	var presentTime = moment().format("x");
		console.log("Current time x: " + presentTime);
	var presentTime = moment().format("X");
		console.log("Current time X: " + presentTime);

	var frequency = $("#frequency-input").val().trim();

	if (trainName != "" && destination != "" && 
		firstTrainTime != "" && frequency != "") {

		console.log(trainName);
		console.log(destination);
		console.log(frequency);

	  // Creates local "temporary" object for holding train data

		var newTrain = {
			trainNm: trainName,
		    dest: destination,
			firstTT: firstTrainTime,
			firstTTReadable: firstTrainTimePlain,
			freq: frequency
		};

		// Uploads train data to the database
		database.ref().push(newTrain);

		// Logs everything to the console
		console.log("newTrain: ", newTrain);

		//	alert("Train successfully added");

		//  clears text boxes for adding more values
		$("#train-name-input").val("");
		$("#destination-input").val("");
		$("#first-train-time-input").val("");
		$("#frequency-input").val("");
	}
	else {
		// don't refresh (did not add train--empty)
		return false;
	}
	// don't refresh
	return false;

	} // hours and minutes are good
 }); // end of add-train click

// refreshes the pages after no activity (no keys pressed 
// 	and mouse does not move)
var time = new Date().getTime();
$(document.body).bind("keypress mousemove", function(e) {
    time = new Date().getTime();
});

function refresh() {
    if(new Date().getTime() - time >= 60000) 
        window.location.reload(true);
    else 
        setTimeout(refresh, 10000);
}

setTimeout(refresh, 10000);

// When user adds entry to database (in other event), this creates Fbase event for 
//  adding row in html 

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

	console.log(" childsnapshot: ", childSnapshot.val());

  	//  Store database train in variables
  	var trainName = childSnapshot.val().trainNm;
	var destination = childSnapshot.val().dest;
	var firstTrainTime = childSnapshot.val().firstTT;
	var firstTrainTime2 = childSnapshot.val().firstTTReadable;
	
	var frequency = childSnapshot.val().freq;

	
	console.log("The following are the database items: ");
	console.log(trainName);
	console.log(destination);
	console.log(firstTrainTime);
	console.log("Just storing this for ease of use: " + firstTrainTime2);
	console.log(frequency);

	var presentTime = moment().format("HH:mm A");
		console.log("Current time: " + presentTime);

//  Calculate Next Arrival (current time - firstTrainTime; find remainder/freq)

//  Notes from momentjs.com docs
//  moment().diff(moment|String|Number|Date|Array);

	var diffInTime = moment().diff(moment.unix(firstTrainTime), "minutes");
		console.log("diffInTime: " + diffInTime);

	var timeRemainder = diffInTime % frequency;
		console.log("timeRemainder: " + timeRemainder);

	// checking if over an hour
	if (frequency > 60) {
		var fred = (frequency % 60);
		var wilma = (frequency/60);
		var minAway = (fred - timeRemainder) + (wilma*60); 
		console.log("Minutes until train arrival: " + minAway);
	}
	else{
		var minAway = frequency - timeRemainder;
		console.log("Minutes until train arrival: " + minAway);
	};

//  Notes from Momentjs.com docs
//  This adds time to an existing moment. To add time, pass the key of what time 
//     you want to add, and the amount you want to add. "moment().add(7, 'minutes');"
//	Calculating the arrival time adding minutes to the current time

	var timeUntilArrival = moment().add(minAway, "minutes").format("hh:mm A");
	console.log("Next train arrival time: " + timeUntilArrival);

// Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" +
  frequency + "</td><td>" + timeUntilArrival + "</td><td>" + minAway + "</td></tr>");

});  //  addition of new train
