
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCcx9CShSSTi2dE5lvGvOoGRq2j9ct3KCY",
    authDomain: "train-scheduler-e206e.firebaseapp.com",
    databaseURL: "https://train-scheduler-e206e.firebaseio.com",
    projectId: "train-scheduler-e206e",
    storageBucket: "",
    messagingSenderId: "759581048948"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var tMinutesTillTrain = 0;

  function displayRealTime() {
    setInterval(function(){
        $('#current-time').html(moment().format('hh:mm A'))
      }, 1000);
    }
    displayRealTime();

    var tRow = "";
    var getKey = "";

  // button to add trains
  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();

      // grabbing user input

      var trainName = $("#train-name").val().trim();
      var destName = $("#destination-name").val().trim();
      var trainTime = $("#train-time").val().trim();
      var trainFreq = $("#train-frequency").val().trim();

      // creating local temp object to hold train data

      var newTrain = {
        name: trainName,
        destination: destName,
        time: trainTime,
        frequency: trainFreq
      };

      //upload train to database
      database.ref().push(newTrain);

      //logging to console
      console.log(newTrain.name)
      console.log(newTrain.destination)
      console.log(newTrain.time)
      console.log(newTrain.frequency)

      alert("Train has been added!");

      // clearing text boxes
      $("#train-name").val("");
      $("#destination-name").val("");
      $("#train-time").val("");
      $("#train-frequency").val("");
  });

    // create firebase event for adding train to database and row in html when user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
        console.log(childSnapshot.val());

        // store in variable
        var trainName = childSnapshot.val().name;
        var destName = childSnapshot.val().destination;
        var trainTime = childSnapshot.val().time;
        var trainFreq = childSnapshot.val().frequency;

        // train info
        console.log(trainName);
        console.log(destName);
        console.log(trainTime);
        console.log(trainFreq);

        // calculate when next train will arrive in minutes

        // create new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destName),
    $("<td>").text(trainTime),
    $("<td>").text(trainFreq),
  );

	    // Current Time
	    var currentTime = moment();
	    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

	    // Difference between the times
	    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	    console.log("DIFFERENCE IN TIME: " + diffTime);

	    // Time apart (remainder)
	    var tRemainder = diffTime % trainFrequency;
	    console.log(tRemainder);

	    // Minute Until Train
	    var tMinutesTillTrain = trainFrequency - tRemainder;
	    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

	    // Next Train
	    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
	    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

		//Create local temporary object for holding train data
		var newTrain = {
			name: trainName,
			destination: destName,
			time: trainTime,
			frequency: trainFreq,
			nextTrain: nextTrain,
			tMinutesTillTrain: tMinutesTillTrain,
			currentTime: currentTime.format("hh:mm A")
    };

  // append new row to table
  $("#train-table > tbody").append(newRow);
  
});

// row needs to be appended to table
// moment.js needs to update times and calculate minutes until next train