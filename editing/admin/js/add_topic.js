const topicsView = document.getElementById('topicsView');

window.onload = function(){
    loadTopicsView();
}


function saveTopic(inputField) {

    let db = firebase.firestore();
    let topic = inputField.value;

    if(topic!=''){
        db.collection('topics').doc().set({
            topic: `${topic}`
        }).then(function(){
            console.log('Data submitted !');
            inputField.value = '';
        }).catch(function(e){
            console.log('error while saving topic ',e);
        });
    } else {
        alert("Text field cannot be empty !");
    }
    loadTopicsView();
}


function loadTopicsView() {

    topicsView.innerHTML = '';

    var db = firebase.firestore();

    db.collection("topics").orderBy('topic', 'desc').get().then((querySnapshot) => {

        //progressBar.style.display = 'none';
        var topics = [];

        querySnapshot.forEach((doc) => {

            var topic = doc.data().topic;
            console.log(`${doc.id} => ${topic}`);

            var newOption = document.createElement('option');
            newOption.value = topic;
            newOption.innerHTML = topic;

            topicsView.options.add(newOption);

            // formBlock.style.display = 'block';
        });
    }).catch(function (error) {
        //progressBar.style.display = 'none';
        console.error("Error adding document: ", error);
    });

}

function saveSubTopic(inputField) {

    let db = firebase.firestore();
    let subtopic = inputField.value;

    if(subtopic!=''){
        db.collection(`subtopics/${topicsView.value}/${topicsView.value}`).doc().set({
            topic: `${subtopic}`
        }).then(function(){
            console.log('Data submitted !');
            inputField.value = '';
        }).catch(function(e){
            console.log('error while saving topic ',e);
        });
    } else {
        alert("Text field cannot be empty !");
    }
}
