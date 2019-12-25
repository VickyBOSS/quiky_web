const topicsView = document.getElementById('topicsView');
const subTopicsView = document.getElementById('subTopicsView');

const questionsTable = document.getElementById('questions_table');
const testQuestionsTable = document.getElementById('test_questions_table');

const saveDraftBtn = document.getElementById('saveDraftBtn');
const selTestTitleEle = document.getElementById('testTitle');
const selNoOfQuestionEle = document.getElementById('selectNoOfQuestions');
const selTestTimeEle = document.getElementById('selectTime');


let questions = [];
let questionsForTest = [];

window.onload = function () {
    loadTopicsView();
    checkDraftBtnState();
}

function loadTopicsView() {

    topicsView.innerHTML = '';

    let db = firebase.firestore();

    db.collection("topics").orderBy('topic', 'asc').get().then((querySnapshot) => {

        var topics = [];

        querySnapshot.forEach((doc) => {

            var topic = doc.data().topic;
            console.log(`${doc.id} => ${topic}`);

            var newOption = document.createElement('option');
            newOption.value = topic;
            newOption.innerHTML = topic;

            topicsView.options.add(newOption);
        });

        loadSubTopicsView();

    }).catch(function (error) {
        console.error("Error adding document: ", error);
    });
}


topicsView.addEventListener("change", function () {
    loadSubTopicsView();
});

function loadSubTopicsView() {

    subTopicsView.innerHTML = '';

    let db = firebase.firestore();

    db.collection(`subtopics/${topicsView.value}/${topicsView.value}`).orderBy('topic', 'asc').get().then((querySnapshot) => {

        var topics = [];

        querySnapshot.forEach((doc) => {

            var topic = doc.data().topic;
            console.log(`${doc.id} => ${topic}`);

            var newOption = document.createElement('option');
            newOption.value = topic;
            newOption.innerHTML = topic;

            subTopicsView.options.add(newOption);
        });

        loadQuestions();
    }).catch(function (error) {
        console.error("Error adding document: ", error);
    });
}

function loadQuestions() {
    let topic = topicsView.value;
    let subtopic = subTopicsView.value;

    let db = firebase.firestore();

    questions = [];

    db.collection(`questions/${topic}/${subtopic}`).get().then((docsSnapshot) => {

        let index = 1;

        docsSnapshot.forEach((doc) => {
            let obj = doc.data();

            questions.push(obj);
        });

        addQuestionsRow();

    }).catch((e) => console.log('Error occured while loading questions ', e));
}

function addQuestionsRow() {

    questionsTable.innerHTML = '';

    for (let i = 0; i < questions.length; i++) {

        let obj = questions[i];

        var td = `<td id="${i}" onclick="addQuestionToCurrentTest(this)">
                <div class="testsList_question" style="font-weight: bold;">Q. ${i + 1} ) ${obj.q}</div>
                <div class="testsList_answer"style="color: green; font-weight: bold;">&emsp;${obj.a}</div>
                <div class="testsList_op">&emsp;${obj.op1}</div>
                <div class="testsList_op">&emsp;${obj.op2}</div>
                <div class="testsList_op">&emsp;${obj.op3}</div>
                <div class="testsList_op">&emsp;${obj.op4}</div>
            </td>`;

        var row = document.createElement('tr');

        row.innerHTML = td;

        questionsTable.appendChild(row);
    }

}

function addQuestionToCurrentTest(selectedEle) {
    console.log(questionsForTest.length);

    if (questionsForTest.length < selNoOfQuestionEle.value) {
        let result = confirm(`Do you want to add this question ... 
            Question : ${questions[selectedEle.id].q}
            Answer   : ${questions[selectedEle.id].a}`);

        if (result) {

            let oldLength = questionsForTest.length;
            questionsForTest.push(questions[selectedEle.id]) > oldLength;

            addTestQuestionsRow();
        }
    } else {
        alert('Test is ready for publishing !');
    }
}

function addTestQuestionsRow() {

    testQuestionsTable.innerHTML = '';

    for (let i = 0; i < questionsForTest.length; i++) {

        let obj = questionsForTest[i];

        var td = `<td id="${i}" onclick="addQuestionToCurrentTest(this)">
                <div class="testsList_question" style="font-weight: bold;">Q ${i + 1} ) ${obj.q}</div>
                <div class="testsList_answer" style="color: green; font-weight: bold;">&emsp;${obj.a}</div>
                <div class="testsList_op">&emsp;${obj.op1}</div>
                <div class="testsList_op">&emsp;${obj.op2}</div>
                <div class="testsList_op">&emsp;${obj.op3}</div>
                <div class="testsList_op">&emsp;${obj.op4}</div>
            </td>`;

        var row = document.createElement('tr');

        row.innerHTML = td;

        testQuestionsTable.appendChild(row);
    }

    checkDraftBtnState();

}

function checkDraftBtnState() {
    if (questionsForTest.length == selNoOfQuestionEle.value) {
        saveDraftBtn.disabled = false;
    } else {
        saveDraftBtn.disabled = true;
    }
}

function saveDraft() {
    let db = firebase.firestore();

    let testTitle = selTestTitleEle.value;
    let time = Number(selTestTimeEle.value);

    let date = new Date();

    // 2019/function getMonth() {    [native code]}/17 7:53
    let timeStamp = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

    if (testTitle == '' || time == '') {
        alert("Please select test title and time !");
        return;
    }


    if (questionsForTest.length == selNoOfQuestionEle.value) {
        db.collection('unpublished_tests').doc().set({
            title: testTitle,
            time: time,
            timeStamp: timeStamp,
            questions: questions
        })
            .then(() => {
                alert('Draft saved !');
            })
            .catch((e) => {
                console.log('Error occured while saving draft !');
            });
    }
}