if(localStorage.getItem('prenoms')) {
document.body.append('Bonjour' + localStorage.getItem('prenom'))
}
else {
    let = prompt('Quel est votre prénom ?');
    localStorage.setItem('prenoms', prenom);
    document.body.append('Bonjour' + prenom);
}
// localStorage.clear()