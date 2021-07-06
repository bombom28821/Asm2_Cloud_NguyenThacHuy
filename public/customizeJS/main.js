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
// About
let sliceString = (num)=>{
    let text = getEle('about__text');
    if(text.innerHTML.length > num){
        let newText = text.innerHTML.slice(0, num) + '...';
        text.innerHTML = newText;
    }
    
}
window.addEventListener('load',function(){
    sliceString(83);
})
let text = getEle('about__text');
let tempText = text.innerHTML;
document.getElementById('seeMore').onclick = ()=>{
    text.innerHTML = tempText;

    document.getElementById('shortView').style.display = 'block';
    document.getElementById('seeMore').style.display = 'none';
}
document.getElementById('shortView').onclick = ()=>{
    sliceString(83);
    document.getElementById('shortView').style.display = 'none';
    document.getElementById('seeMore').style.display = 'block';
}
