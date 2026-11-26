// The Lecture Ledger - attendance planner (basic JavaScript only)

// ---------- Helper functions ----------

// Checks the numbers and returns an error message ("" means everything is fine)
function checkNumbers(held, attended, required) {
  if (isNaN(held) || isNaN(attended) || isNaN(required)) {
    return "Please fill all the boxes with numbers.";
  }
  if (held <= 0) {
    return "Classes held must be more than 0.";
  }
  if (attended < 0 || attended > held) {
    return "Classes attended must be between 0 and classes held.";
  }
  if (required <= 0 || required >= 100) {
    return "Required percentage must be between 1 and 99.";
  }
  return "";
}

// Gives advice text based on the attendance
function getAdvice(held, attended, required) {
  var percent = (attended / held) * 100;
  if (percent >= required) {
    // largest x such that attended / (held + x) is still >= required%
    var canSkip = Math.floor((attended * 100) / required - held);
    return "Safe! You can skip " + canSkip + " more class(es) and stay above " + required + "%.";
  } else {
    // smallest y such that (attended + y) / (held + y) >= required%
    var need = Math.ceil((required * held - 100 * attended) / (100 - required));
    return "Low! Attend the next " + need + " classes in a row to reach " + required + "%.";
  }
}

// Reads a box and converts it to a number (empty box gives NaN)
function readNumber(id) {
  var text = document.getElementById(id).value;
  if (text === "") {
    return NaN;
  }
  return Number(text);
}

// ---------- Home page: quick check ----------
function quickCheck() {
  var held = readNumber("held");
  var attended = readNumber("attended");
  var required = readNumber("required");
  var box = document.getElementById("quickResult");

  var error = checkNumbers(held, attended, required);
  if (error !== "") {
    box.className = "error";
    box.innerHTML = error;
    return;
  }

  var percent = (attended / held) * 100;
  box.innerHTML = "Your attendance is " + percent.toFixed(1) + "%. " + getAdvice(held, attended, required);
  if (percent >= required) {
    box.className = "result good";
  } else {
    box.className = "result bad";
  }
}

// ---------- Tracker page: many subjects ----------
var subjects = [];   // each item stores name, held and attended

function addSubject() {
  var name = document.getElementById("subject").value;
  var held = readNumber("tHeld");
  var attended = readNumber("tAttended");
  var required = readNumber("tRequired");
  var error = checkNumbers(held, attended, required);

  if (name.trim() === "") {
    error = "Please enter the subject name.";
  }
  if (error !== "") {
    document.getElementById("trackError").innerHTML = error;
    return;
  }

  document.getElementById("trackError").innerHTML = "";
  subjects.push({ name: name.trim(), held: held, attended: attended });
  document.getElementById("subject").value = "";
  document.getElementById("tHeld").value = "";
  document.getElementById("tAttended").value = "";
  showTable();
}

function removeSubject(index) {
  subjects.splice(index, 1);   // removes 1 item at this position
  showTable();
}

function clearAll() {
  subjects = [];
  showTable();
}

// Rebuilds the table every time something changes
function showTable() {
  var required = readNumber("tRequired");
  var rows = "";
  var totalHeld = 0;
  var totalAttended = 0;

  if (isNaN(required) || required <= 0 || required >= 100) {
    document.getElementById("trackError").innerHTML = "Enter a required percentage between 1 and 99 first.";
    return;
  }

  for (var i = 0; i < subjects.length; i++) {
    var s = subjects[i];
    var percent = (s.attended / s.held) * 100;
    var cls = "bad";
    if (percent >= required) {
      cls = "good";
    }
    rows += "<tr class='" + cls + "'>" +
      "<td>" + s.name + "</td>" +
      "<td>" + s.attended + " / " + s.held + "</td>" +
      "<td>" + percent.toFixed(1) + "%</td>" +
      "<td>" + getAdvice(s.held, s.attended, required) + "</td>" +
      "<td><button onclick='removeSubject(" + i + ")'>Delete</button></td></tr>";
    totalHeld = totalHeld + s.held;
    totalAttended = totalAttended + s.attended;
  }

  if (subjects.length === 0) {
    document.getElementById("tableBody").innerHTML = "<tr><td colspan='5'>No subjects added yet.</td></tr>";
    document.getElementById("overall").innerHTML = "";
    return;
  }
  document.getElementById("tableBody").innerHTML = rows;
  var overall = (totalAttended / totalHeld) * 100;
  document.getElementById("overall").innerHTML = "Overall attendance: " + overall.toFixed(1) + "% (" + totalAttended + " of " + totalHeld + " classes)";
}

// ---------- Feedback page: form validation ----------
function submitFeedback() {
  var name = document.getElementById("fname").value.trim();
  var email = document.getElementById("femail").value.trim();
  var rating = document.getElementById("frating").value;
  var message = document.getElementById("fmessage").value.trim();
  var out = document.getElementById("feedbackResult");

  if (name.length < 2) {
    out.className = "error";
    out.innerHTML = "Name must have at least 2 characters.";
  } else if (email.indexOf("@") === -1 || email.indexOf(".") === -1) {
    out.className = "error";
    out.innerHTML = "Please enter a valid email (it must contain @ and .).";
  } else if (rating === "") {
    out.className = "error";
    out.innerHTML = "Please choose a rating.";
  } else if (message.length < 10) {
    out.className = "error";
    out.innerHTML = "Message must have at least 10 characters.";
  } else {
    out.className = "result good";
    out.innerHTML = "Thank you, " + name + "! Your feedback (" + rating + " stars) was received.";
    document.getElementById("feedbackForm").reset();
  }
}
