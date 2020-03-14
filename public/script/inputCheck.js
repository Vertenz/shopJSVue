function errorMark(name) {
    return document.getElementById(name).classList.add('error');
};

document.getElementById('a-log').addEventListener('click', () => {
    console.log('TEST');
    let email = '';
    email = document.getElementById('email__checkout').value;
    if ((email.match(/^\w+[.-]?\w+@\w+\.\w+$/gi)) === null) {
        errorMark('email__checkout');
    }
});