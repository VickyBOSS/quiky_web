const questionField = document.getElementById('question_field');
const answerField = document.getElementById('answer_field');

const topicsView = document.getElementById('topicsView');
const subTopicsView = document.getElementById('subTopicsView');
let options = document.getElementsByName('answer');

window.onload = function () {
    loadTopicsView();
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
    }).catch(function (error) {
        console.error("Error adding document: ", error);
    });
}


function saveData(qstn, op1, op2, op3, op4) {

    var db = firebase.firestore();

    let topic = topicsView.value;
    let subTopic = subTopicsView.value;

    let question = qstn.value;
    let option1 = op1.value;
    let option2 = op2.value;
    let option3 = op3.value;
    let option4 = op4.value;

    let answer;

    console.log(topicsView.value);
    console.log(subTopicsView.value);

    if (topic === '' || subTopic === '') {
        alert('Please select Topic and SubTopic !');
        return;
    }

    if (question === '' || option1 === '' || option2 === '' || option3 === '' || option4 === '') {
        alert('Please enter all the data correctly !');
        return;
    }

    if (options[0].checked) {
        answer = option1;
    } else if (options[1].checked) {
        answer = option2;
    } else if (options[2].checked) {
        answer = option3;
    } else if (options[3].checked) {
        answer = option4;
    } else {
        alert('Please check the answer !');
        return;
    }

    let data = {};

    data.q = question;
    data.a = answer;
    data.op1 = option1;
    data.op2 = option2;
    data.op3 = option3;
    data.op4 = option4;
    

    db.collection(`questions/${topic}/${subTopic}`).doc().set(data)
        .then(function () {
            console.log("Document successfully written!");

        })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });



}

function clearData(qstn, op1, op2, op3, op4){
    qstn.value = '';
    op1.value = '';
    op2.value = '';
    op3.value = '';
    op4.value = '';

    options.forEach(function(opEle){
        if(opEle.checked){
            opEle.checked = false;
        }
    });

}

function log(msg) {
    console.log(msg);
}