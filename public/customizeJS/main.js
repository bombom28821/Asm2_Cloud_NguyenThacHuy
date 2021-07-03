let getEle = (id)=>{
    return document.getElementById(id);
}

document.getElementById('btn-yellow').onclick = function(){
    let imgYellow = getEle('car');
    imgYellow.src="images/lamborghini-yellow-removebg.png";
    console.log('yellow')
}
document.getElementById('btn-red').onclick = function(){
    let imgRed = getEle('car');
    imgRed.src="images/lamborghini-red-removebg.png";
    console.log('red')
}