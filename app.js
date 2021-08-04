const websiteName = document.querySelector('#name');
const websiteUrl = document.querySelector('#url');
const saveBtn = document.querySelector('button');
const inputBtns = document.querySelectorAll('input[type=\'text\']');

inputBtns.forEach(inputbtn => {
    inputbtn.addEventListener('keypress', e => {
        if(e.which == 13){
            recordStart();
        }
    })
});

(function(){
    showRecord();
})();

saveBtn.addEventListener('click', recordStart);

function recordStart() {
    let name = websiteName.value;
    let url = websiteUrl.value;
    if(!isEmpty(name, url)){
        let data = {
            'website-name': name,
            'website-url': url
        }
        sentToDb(data);
        showRecord();
        clearInput();
    }
}

function isEmpty(name, url){
    let flag = false;
    if(name == '' && url == ''){
        flag = true;
    }
    return flag;
}

function sentToDb(obj){
    let arr = getFromDb();
    if(arr === null){
        arr = [];
        arr.push(obj);
        saveToLocal(arr);
    }else{
        let ind = arr.findIndex(data => data['website-name'] == obj['website-name']);
        if(ind == -1){
            arr.push(obj);
            saveToLocal(arr);
        }else{
            return;
        }
    }
}

function saveToLocal(data){
    let obj = JSON.stringify(data)
    localStorage.setItem('localdb', obj);
}

function getFromDb(){
    return JSON.parse(localStorage.getItem('localdb'))
}

function showRecord(){
    const div = document.querySelector('#result');
    let obj = getFromDb();
    div.innerHTML = '';
    for(let data in obj){
        div.innerHTML += '<div class = "marked-box" id = '+ obj[data]['website-name'] + '> <div class = "name">'+ obj[data]['website-name'] + '</div><a href = "' + obj[data]['website-url'] + '" class = "visit">' + 'visit </a>' +
        '<a href = "#" class = "delete" onclick = "removeRecord(\''+ obj[data]['website-name'] +'\')"> delete </a></div>';
    }    
}

function removeRecord(removeName) {
    let obj = getFromDb();
    for(let data in obj){
        if(obj[data]['website-name'] === removeName){
            obj.splice(data,1);
        }
    }
    saveToLocal(obj);
    showRecord();
}

function clearInput() {
    websiteName.value = '';
    websiteUrl.value = '';
    document.querySelector('#name').focus();
}