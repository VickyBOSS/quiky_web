const testStatus = document.getElementById('test_status');
const btnContainer = document.getElementById('btnContainer');
const subjectChoices = document.getElementById('subjectChoices');

let selectedTestId;
let selectedTestObj;

function searchTestInDraft(subjectEle) {

    selectedTestId = '';
    selectedTestObj = {};

    btnContainer.style.display = 'none';
    testStatus.innerHTML = 'Test Status : checking...';
    testStatus.style.color = 'black';

    if (subjectEle.value != '') {
        let db = firebase.firestore();

        db.collection('unpublished_tests')
            .where('title', '==', subjectEle.value)
            .orderBy('timeStamp')
            .limit(1)
            .get()
            .then((docSnapshot) => {


                if (!docSnapshot.exists) {
                    testStatus.innerHTML = `Test Status : Not Available`;

                    testStatus.style.color = 'red';
                }

                docSnapshot.forEach(function (doc) {
                    if (doc.exists) {

                        testStatus.innerHTML = `Test Status : Available
                                                        <br>${doc.data().title}`;

                        testStatus.style.color = 'green';

                        btnContainer.style.display = 'block';

                        selectedTestId = doc.id;
                        selectedTestObj = doc.data();
                    }
                });
            })

            .catch((e) => console.log('Error occured while requesting test from draft', e));
    } else {
        alert('Please select a subject !');
    }

}

function publishTest() {
    if (selectedTestId != '' && !isEmpty(selectedTestObj)) {

        let db = firebase.firestore();
        let date = new Date();
        let timeStamp = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`

        db.collection('published_tests').doc().set({
            title: selectedTestObj.title,
            time: selectedTestObj.time,
            timeStamp: timeStamp,
            questions: selectedTestObj.questions
        })
            .then(() => {
                let shouldDeleteFromDraft = confirm("Test published !\n\nDo you want to remove this test from Draft ?");

                if(shouldDeleteFromDraft){
                    deleteTestFromDraft();
                }

                selectedTestId = '';
                selectedTestObj = {};
                subjectChoices.value = '';

                testStatus.innerHTML = '';
                btnContainer.innerHTML = '';
            })
            .catch((e) => {
                alert('Error occured while pulishing test !');
            });

    }
}

function deleteTestFromDraft() {
    if (selectedTestId != '') {
        let db = firebase.firestore();
        db.collection('unpublished_tests').doc(selectedTestId).delete()
            .then(() => {
                alert('Test deleted from draft successfully !');
            })
            .catch((e) => alert('Error occured while deleting test from draft !'));
    }
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}

let log = (msg) => console.log(msg);

window.onload = function() {
    var config = document.getElementById('config');
    config.src = 'js/congig.js';
}