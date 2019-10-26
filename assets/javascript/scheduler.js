
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyA48323SsO-lRrLGh4jfE6ktMmi-IOcYww",
    authDomain: "aqueous-freedom-144114.firebaseapp.com",
    databaseURL: "https://aqueous-freedom-144114.firebaseio.com",
    projectId: "aqueous-freedom-144114",
    storageBucket: "aqueous-freedom-144114.appspot.com",
    messagingSenderId: "1056613012618",
    appId: "1:1056613012618:web:f8782b896cf1a88dcc8973"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  //setting variable to point to database
  var database = firebase.database();
  console.log(database);

// trainData references a specific location in our database.
// All of our train data will be stored in this directory.
var trainData = database.ref("/trainData");
console.log(trainData);

//Setting global variables for project

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var trainsCounter = 0;
var nextTrain = "";
var minutesAway = "";


//First get data from fields
$("#submitButton").on("click", function(e){
    e.preventDefault();
    trainsCounter++;
    var trainName = $("#trainNameInput").val().trim();
    console.log(trainName);
    var destination = $("#destinationInput").val().trim();
    console.log(destination);
    var firstTrainTime = $("#firstTrainTime").val().trim();
    console.log(firstTrainTime);
    var frequency = $("#frequencyInput").val().trim();
    console.log(frequency);

    //then set the new values to the database
    trainData.push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        trainsCounter: trainsCounter,
      });  
      
    //then clear the input panel
    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainTime").val("");
    $("#frequencyInput").val("");

});

//now we should calculate the next train
function calculateNextTrain (firstTrainTime, frequency){
    
    //I had to look that up and use moment.js for time stuff
    //first get time now
    var currentTime = moment().format("HH:mm a");
    console.log("Current Time:" + currentTime);
    
    var firstTrainFormatted = moment(firstTrainTime, "HH:mm a").subtract(1, "years");
    console.log(firstTrainFormatted);

    // calculate difference between 
    var getDifference = moment().diff(moment(firstTrainFormatted), "minutes");
    console.log(getDifference); //this gives difference in minutes between now and first train

    // store the time left
    var timeWaited = getDifference % frequency; // the residue of this is how much time I've waited since last train
    console.log(timeWaited);
    // the train is frequency - time I've waited so far
    var minutesAway = frequency - timeWaited;
    console.log(minutesAway)
    
    //Adding the minutes to get the next train time.
    var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm a");
    console.log(nextTrain);

    return [nextTrain, minutesAway];

}

//Printing to the screen!
trainData.on("child_added", function (snapshot) { //snapshot's scope is only local, so if data setting is successful it's called

// Print the initial data to the console.
console.log(snapshot.val());

//get the values from DB
trainName = snapshot.val().trainName;
destination = snapshot.val().destination;
firstTrainTime = snapshot.val().firstTrainTime;
frequency = snapshot.val().frequency;
trainsCounter = snapshot.val().trainsCounter;

var schedule = calculateNextTrain(firstTrainTime, frequency);
console.log(nextTrain);
nextTrain = schedule[0];
minutesAway = schedule[1];

// Change the html to reflect the initial value.
var newRow = $("tbody").append("<tr>");
newRow = newRow.append("<td id=\"train-data-"+trainsCounter+"\">"+ trainName);
newRow = newRow.append("<td id=\"train-data-"+trainsCounter+"\">"+destination);
newRow = newRow.append("<td id=\"train-data-"+trainsCounter+"\">"+frequency);
newRow = newRow.append("<td id=\"train-data-"+trainsCounter+"\">"+nextTrain);
newRow = newRow.append("<td id=\"train-data-"+trainsCounter+"\">"+minutesAway)

$("[id*='train-data-']").attr("minutes", minutesAway);

if($("[id*='train-data-']").attr("minutes") <=1){
    alert("train is approaching!");
}



},function (errorObject) { // If any errors are experienced, log them to console
  console.log("The read failed: " + errorObject.data)
});

//initScreen();



