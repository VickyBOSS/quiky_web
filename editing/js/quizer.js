function _(id) {
    return document.getElementById(id);
}

const quizContainer = _('quiz_container');
const progressBar = _('progressbar');

var pos = 0, correct = 0, wrong = 0;

var data = [];



function loadData() {
    // for(var i = 0; i<6; i++){
    //     data.push({question: `Question ${i}`});
    // }

    var question1 = { question: 'कालीबंगा में उत्खनन (प्रथम चरण) का कब प्रारम्भ हुआ था?', options: ['1960', '1990', '1961', '1922'], answer: '1961' };
    var question2 = { question: 'गणेश्वर सभ्यता किस नदि के किनारे विकसित हुई?', options: ['बाणगंगा नदि', 'कंतली नदि', 'कोंकणी नदि', 'रुपारेल नदि'], answer: 'कंतली नदि' };
    var question3 = { question: 'Transmission of data in one direction is called', options: ['simplex', 'duplex', 'triplex', 'None of these'], answer: 'simplex' };

    data.push(question1);
    data.push(question2);
    data.push(question3);

    reloadQuestion();
    updateBtnsState();
}

function reloadQuestion() {

    var obj = data[pos];

    console.log(obj.question);

    var questionView = `
    <div id="question">Q ${pos + 1}. ${obj.question}</div>`;

    var optionsView = `
    <label><input onclick="setSelected(this)" type="radio" name="options" value="${obj.options[0]}">
    ${obj.options[0]}</label>
    <label><input onclick="setSelected(this)" type="radio" name="options" value="${obj.options[1]}">
    ${obj.options[1]}</label>
    <label><input onclick="setSelected(this)" type="radio" name="options" value="${obj.options[2]}">
    ${obj.options[2]}</label>
    <label><input onclick="setSelected(this)" type="radio" name="options" value="${obj.options[3]}">
    ${obj.options[3]}</label><br>
    `;

    var options_container = document.createElement('div');
    options_container.setAttribute('id', 'options_container');
    options_container.innerHTML = optionsView;

    quizContainer.innerHTML = questionView;
    quizContainer.appendChild(options_container);
}

function submit(question, option) {
    alert(question.innerHTML);
}

window.onload = function () {
    loadData();
    progressBar.style.display = 'none';
    createNavigator(3);
}

function onNext() {
    pos++;
    if (pos < data.length) {
        reloadQuestion();
        updateRadioCheckedState();
        updateBtnsState();
    }
}

function onPrevious() {
    pos--;
    if (pos < data.length) {
        reloadQuestion();
        updateRadioCheckedState();
        updateBtnsState();
    }
}

function onClear() {
    var optionsGroup = document.getElementsByName('options');

    optionsGroup[0].checked = false;
    optionsGroup[1].checked = false;
    optionsGroup[2].checked = false;
    optionsGroup[3].checked = false;

    delete data[pos].selectedOption;
    updateRadioCheckedState();
    updateNavigatorState();
}

function onSubmit() {

}

function setSelected(selectedElement) {
    data[pos].selectedOption = selectedElement.value;
    updateNavigatorState();
    log(selectedElement.value);
}

function onMarkReviewClicked(checkbox) {
    if (checkbox.checked) {
        data[pos].review = true;
    } else {
        if (data[pos].review != undefined) {
            delete data[pos].review;
        }
    }
    updateNavigatorState();
}

function updateBtnsState() {
    const btnNext = _('btnNext');
    const btnPrevious = _('btnPrevious');

    btnNext.disabled = false;
    btnPrevious.disabled = false;


    if (pos == 0) {
        btnPrevious.disabled = true;
    }

    if (pos == data.length - 1) {
        btnNext.disabled = true;
    }

}

function updateRadioCheckedState() {
    var selOption = data[pos].selectedOption;
    if (selOption != undefined) {
        log('checking radio btns');
        var optionsGroup = document.getElementsByName('options');

        optionsGroup.forEach(function (option) {
            if (option.value === selOption) {
                option.checked = true;
            }
        });
    }
}

function createNavigator(size) {

    var table = document.getElementById('questions_navigator');


    var navigation_data = '<tr>';

    for (var i = 1; i <= size; i++) {
        var td = `<td id="${i}" onclick="goToQuestionNo(this)" class="unattempted">${i}</td>`;
        navigation_data += td;

        if (i < size && i % 3 === 0) {
            navigation_data += '</tr><tr>';
        }

        if (i === size) {
            navigation_data += '</tr>';
        }

        table.innerHTML = navigation_data;
    }

}

function goToQuestionNo(ele) {

    console.log(pos);
    pos = ele.id - 1;
    reloadQuestion();
    updateRadioCheckedState();
    updateBtnsState();
}

function updateNavigatorState() {

    for (var id = 1; id <= 3; id++) {
        var questionObj = data[id - 1];
        var ele = document.getElementById(`${id}`);
        ele.setAttribute('class', 'unattempted');
        if (questionObj.review != undefined) {
            ele.setAttribute('class', 'review');
        } else if (questionObj.selectedOption != undefined) {
            ele.setAttribute('class', 'attempted');
        }
    }
}

function log(msg) {
    console.log(msg);
}