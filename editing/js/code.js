const progressBar = document.getElementById('progressbar');
const testsTable = document.getElementById('tests_table');

window.onload = function () {

    progressBar.style.display = 'none';
    console.log('Window loaded !');

    var date = new Date();

    for(var i = 1; i<=30; i++){ 
        addQuizRow(`Quiz ${new Date().getSeconds()}`, 20, '5 min', `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);

    }
}


function showProgressBar() {
    progressBar.style.display = 'block';

    // var tmout = window.setTimeout(function(){
    //     progressBar.style.display = 'none';
    // },3000);

    // var rootRef = firebase.database().ref();
    // rootRef.set({
    //     like: '5'
    // }).then(success => {
    //     progressBar.style.display = 'none';
    //     console.log('success', success);
    // },
    //     error => {
    //         progressBar.style.display = 'none';
    //         console.log('error', error);
    //     }
    // );

    var tmout = window.setInterval(function () {

        addQuizRow(`Quiz ${new Date().getSeconds()}`, 20, '5 min', new Date().getDate());

        progressBar.style.display = 'none';
    }, 1000);

}

function addQuizRow(quizName, noOfQuestions, duration, time) {

    // var td = document.createElement('td');

    // var divTitle = document.createElement(); 

    var td = `<td id="${quizName}" onclick="startQuiz(this)">
    <div class="testsList_Title">${quizName}</div>
    <div class="testsList_Time">${time}</div>
    <div class="testsList_NoOfQuestions">${noOfQuestions}</div>
    <div class="testsList_Duration">${duration}</div>
    </td>`;

    var row = document.createElement('tr');

    row.innerHTML = td;

    testsTable.appendChild(row);

}

function submit(question, option) {
    alert(question.innerHTML);
}
















