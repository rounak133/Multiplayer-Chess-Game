//*============================Welcome to the multiplater-chess-game script file===================

//you can navigate through various sections to understand what they do
//note- setup build functions are called at the end of code 

//used to color the board (not invoked directly)
ColorCodes={
    light: "#ffce9e",
    dark: "#d18b47",
};

//global calls used in multiple functions to define behaviour (not invoked dircetly)
let turn="w";
let cells=document.getElementsByClassName("cell");
let flagg=true;
let fr=null, fc=null, fnums=[];
let pawncall=false;
let pawncontrol=false;
let user1=null, user2=null;
let i1=document.getElementById("whoseturn_1");
let i2=document.getElementById("whoseturn_2");
key1=true;
key2=false;

//timer function
function TimerU1(){
        if(key1===true){
            let currtime=document.getElementById("time_1").innerHTML;
            let[minutes,seconds]=currtime.split(":");
            minutes = parseInt(minutes, 10);
            seconds = parseInt(seconds, 10);
            if(seconds>0){
                seconds--;
            } 
            else{
                if(minutes>0){
                    minutes--;
                    seconds = 59;
                }
                else{
                  clearInterval(timer1);
                  alert(`Time up for ${user1}, ${user2} wins!`);
                  location.reload();
                  return;
                }
            }
            minutes = minutes.toString().padStart(2, "0");
            seconds = seconds.toString().padStart(2, "0");
            let time1 = `${minutes}:${seconds}`;
            document.getElementById("time_1").innerHTML=`${time1}`;
        }
        if(key2===true){
            let currtime=document.getElementById("time_2").innerHTML;
            let[minutes,seconds]=currtime.split(":");
            minutes = parseInt(minutes, 10);
            seconds = parseInt(seconds, 10);
            if(seconds>0){
                seconds--;
            } 
            else{
                if(minutes>0){
                    minutes--;
                    seconds = 59;
                }
                else{
                    clearInterval(timer2);
                    alert(`Time up for ${user2}, ${user1} wins!`);
                    location.reload();
                    return;
                }
            }
            minutes = minutes.toString().padStart(2, "0");
            seconds = seconds.toString().padStart(2, "0");
            let time2 = `${minutes}:${seconds}`;
            document.getElementById("time_2").innerHTML=`${time2}`;
        }
}

//to add names to the document and initial white turn
function NameFunc(){
    user1=prompt("Enter your name if you wish to play as White");
    user2=prompt("Enter your name if you wish to play as Black");
    if(user1.trim()!=="" && user2.trim()!=="" && user1!==null && user2!==null){
        let upd=document.getElementsByClassName("name");
        upd[0].innerHTML=`${user1}`;
        upd[1].innerHTML=`${user2}`;
        let splitt=user1.split(" ");
        i1.innerHTML=`${splitt[0]}'s turn`;
        // key1=true;
    }
    else{
        alert("smarty uhm? please tell a name?")
        NameFunc();
    }
}
//for setting the alternate chessboard color schema (invoked directly as soon as the website loads)
function ColorSetup(){
    let c=0;
    let flag=true;
    for(let i=0; i<cells.length; i++){
        if(flag===true){
            cells[i].style.backgroundColor=`${ColorCodes.light}`;
            flag=false;
            c++;
        }
        else{
            cells[i].style.backgroundColor=`${ColorCodes.dark}`;
            flag=true;
            c++;
        }
        if(c%8===0){
            flag=(!flag);
            c=0;
        }
    }  
}
//obj to access the images anytime (not invoked directly, just to save me form typing it again :) )
const images={
    rook: {f:"rook_b",s:"rook_w"},
    knight: {f:"knight_b",s:"knight_w"},
    bishop: {f:"bishop_b",s:"bishop_w"},
    queen: {f:"queen_b",s:"queen_w"},
    king: {f:"king_b",s:"king_w"},
    pawn: {f:"pawn_b",s:"pawn_w"},
}

//to set-up all the keys to initial values when the game loads (invoked directly after ColorSetup)
function InitialBuild(){
    cells[0].innerHTML=`<img class="img rook_b"src="img-src/rook_b.png" alt=""></img>`;
    cells[1].innerHTML=`<img class="img knight_b"src="img-src/knight_b.png" alt=""></img>`;
    cells[2].innerHTML=`<img class="img bishop_b"src="img-src/bishop_b.png" alt=""></img>`;
    cells[3].innerHTML=`<img class="img queen_b"src="img-src/queen_b.png" alt=""></img>`;
    cells[4].innerHTML=`<img class="img king_b"src="img-src/king_b.png" alt=""></img>`;
    cells[5].innerHTML=`<img class="img bishop_b"src="img-src/bishop_b.png" alt=""></img>`;
    cells[6].innerHTML=`<img class="img knight_b"src="img-src/knight_b.png" alt=""></img>`;
    cells[7].innerHTML=`<img class="img rook_b"src="img-src/rook_b.png" alt=""></img>`;

    let p=0;
    //random id given to add pawn control functionality and handle various pawn cases
    for(let i=8; i<16; i++){
        cells[i].innerHTML=`<img class="img pawn_b first" id="8${p}" src="img-src/pawn_b.png" alt=""></img>`;
        p++
    }
    p=0;
    for(let i=48; i<56; i++){
        cells[i].innerHTML=`<img class="img pawn_w first" id="9${p}" src="img-src/pawn_w.png" alt=""></img>`;
        p++;
    }

    cells[56].innerHTML=`<img class="img rook_w"src="img-src/rook_w.png" alt=""></img>`;
    cells[57].innerHTML=`<img class="img knight_w"src="img-src/knight_w.png" alt=""></img>`;
    cells[58].innerHTML=`<img class="img bishop_w"src="img-src/bishop_w.png" alt=""></img>`;
    cells[59].innerHTML=`<img class="img queen_w"src="img-src/queen_w.png" alt=""></img>`;
    cells[60].innerHTML=`<img class="img king_w"src="img-src/king_w.png" alt=""></img>`;
    cells[61].innerHTML=`<img class="img bishop_w"src="img-src/bishop_w.png" alt=""></img>`;
    cells[62].innerHTML=`<img class="img knight_w"src="img-src/knight_w.png" alt=""></img>`;
    cells[63].innerHTML=`<img class="img rook_w"src="img-src/rook_w.png" alt=""></img>`;
}
//datalistner function which gets a possible moves array form key calls and decides according to color weather to initialize it as a kill div or migrate div (invoked indirectly)
function datalistner(div, coloro){
    if(div.innerHTML.length!==0){                               //%change this to 0 later
        let temp=div.children[0].classList[1].length
        let color=div.children[0].classList[1][temp-1];
        if(coloro==="w"){
            if(pawncall===false){
                if(color==="w"){
                    return [false, div];
                }
                else{
                    div.classList.add("kill");
                    return [false, div];
                }
            }
            else{
                return [false, div];
            }
        }
        else if(coloro==="b"){
            if(pawncall===false){
                if(color==="b"){
                    return [false, div];
                }
                else{
                    div.classList.add("kill");
                    return [false, div];
                }
            }
            else{
                return [false, div];
            }
        }
    }
    else{
        div.classList.add("active");
        return [true, div];
    }
}

//data function which return div of id rc (global and invoked indirectly)
function data(r,c){
    let Div=document.getElementById(`${r}${c}`);
    return Div;
}
//defining functions for each key

//scope of improvement- insead of defining each axis behaviour in all functions, a global function can be made defining behaviour for axes and can be used repatidely 
function rook(string,coloro,f){
    let nums=[];
    let r= parseInt(string[0]), c=parseInt(string[1]);
    //for +y
    for(let i=r-1; i>=0; i--){
        let div=data(i,c);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
        nums.push(flag[1]);
        }
    }
    // for -y
    for(let i=r+1; i<8; i++){
        let div=data(i,c);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
            nums.push(flag[1]);
        }
    }
    // //for +x
    for(let i=c+1; i<8; i++){
        let div=data(r,i);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
            nums.push(flag[1]);
        }
    }
    // //for -x
    for(let i=c-1; i>=0; i--){
        let div=data(r,i);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
            nums.push(flag[1]);
        }
    }
    if(f===false){
    fr=String(r); fc=String(c); fnums=nums;
    }
    else{
        fr=String(r); fc=String(c);
        for(let p=0; p<nums.length; p++){
            fnums.push(nums[p]);
        }
    }
}

function knight(string,coloro){
    let nums=[];
    let r= parseInt(string[0]), c=parseInt(string[1]);
    let rc=r, cc=c;
    //for +y
    rc-=2; cc++;
    if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    cc-=2; 
    if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    rc++, cc--;
    if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    cc+=4;
    if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    rc+=2;
    if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    cc-=4;
    if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    rc++, cc++;
    if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    cc+=2;if(rc>=0 && rc<=7 && cc<=7 && cc>=0){
        let div=data(rc,cc);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    fr=String(r); fc=String(c); fnums=nums;
}

function bishop(string, coloro,f){
    let nums=[];
    let r= parseInt(string[0]), c=parseInt(string[1]);
    //for +x,+y
    for(let i=r-1, j=c+1; i>=0 && i<=7 && j<=7 && j>=0 ; i--, j++){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    //for -x, +y
    for(let i=r-1, j=c-1; i>=0 && i<=7 && j<=7 && j>=0 ; i--, j--){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    //for -x -y
    for(let i=r+1, j=c-1; i>=0 && i<=7 && j<=7 && j>=0 ; i++, j--){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    //for +x -y
    for(let i=r+1, j=c+1; i>=0 && i<=7 && j<=7 && j>=0 ; i++, j++){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
    }
    if(f===false){
        fr=String(r); fc=String(c); fnums=nums;
        }
    else{
        fr=String(r); fc=String(c);
        for(let p=0; p<nums.length; p++){
            fnums.push(nums[p]);
        }
    }
}

function queen(string, coloro){
    rook(string, coloro, true);
    bishop(string, coloro, true);
}

function pawn(string, coloro){
    pawncall=true;
    let nums=[];
    let r= parseInt(string[0]), c=parseInt(string[1]);
    if(coloro==="w"){
        //+y just above
        let haha=false;
            let div=data(r-1,c);
            let flag=datalistner(div, coloro);
            if(flag[0]===true){
                haha=true;
                nums.push(flag[1]);
            }
            if(pawncontrol===true && haha===true){
                let div2=data(r-2,c);
                let flag2=datalistner(div2, coloro);
                if(flag2[0]===true){
                nums.push(flag2[1]);
            }
        }
        //hybrid kill function
        if(r-1<=7 && r-1>=0 && c-1<=7 && c-1>=0){
            let div1=data(r-1, c-1);
            if(div1.innerHTML.length!==0){
                pawncall=false;
                let flag1=datalistner(div1, coloro);
                if(flag1[0]===false){
                    nums.push(flag1[1]);
                }
                pawncall=true;
            }
        }
        if(r-1<=7 && r-1>=0 && c+1<=7 && c+1>=0){
            let div2=data(r-1, c+1);
            if(div2.innerHTML.length!==0){
                pawncall=false;
                let flag2=datalistner(div2, coloro);
                if(flag2[0]===false){
                    nums.push(flag2[1]);
                }
                pawncall=true;
            }
        }
    }
    else{
        //-y just above
        let haha=false;
        let div=data(r+1,c);
        let flag=datalistner(div, coloro);
        if(flag[0]===true){
            nums.push(flag[1]);
            haha=true;
        }
        if(pawncontrol===true && haha===true){
            let div=data(r+2,c);
            let flag=datalistner(div, coloro);
            if(flag[0]===true){
            nums.push(flag[1]);
        }
        }
        //hybrid kill function
        if(r+1<=7 && r+1>=0 && c-1<=7 && c-1>=0){
            let div1=data(r+1, c-1);
            if(div1.innerHTML.length!==0){
                pawncall=false;
                let flag1=datalistner(div1, coloro);
                if(flag1[0]===false){
                    nums.push(flag1[1]);
                }
                pawncall=true;
            }
        }
        if(r+1<=7 && r+1>=0 && c+1<=7 && c+1>=0){
            let div2=data(r+1, c+1);
            if(div2.innerHTML.length!==0){
                pawncall=false;
                let flag2=datalistner(div2, coloro);
                if(flag2[0]===false){
                    nums.push(flag2[1]);
                }
                pawncall=true;
            }
        }
    }
    pawncall=false;
    fr=String(r); fc=String(c); fnums=nums;
}

function king(string, coloro){
    let nums=[];
    let r= parseInt(string[0]), c=parseInt(string[1]);
     //for +y
     for(let i=r-1; i>=0; i--){
        let div=data(i,c);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
        nums.push(flag[1]);
        }
        break;
    }
    // for -y
    for(let i=r+1; i<8; i++){
        let div=data(i,c);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
            nums.push(flag[1]);
        }
        break;
    }
    // //for +x
    for(let i=c+1; i<8; i++){
        let div=data(r,i);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
            nums.push(flag[1]);
        }
        break;
    }
    // //for -x
    for(let i=c-1; i>=0; i--){
        let div=data(r,i);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
            }
            break;
        }
        else{
            nums.push(flag[1]);
        }
        break;
    }
     //for +x,+y
     for(let i=r-1, j=c+1; i>=0 && i<=7 && j<=7 && j>=0 ; i--, j++){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
        break;
    }
    //for -x, +y
    for(let i=r-1, j=c-1; i>=0 && i<=7 && j<=7 && j>=0 ; i--, j--){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
        break;
    }
    //for -x -y
    for(let i=r+1, j=c-1; i>=0 && i<=7 && j<=7 && j>=0 ; i++, j--){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
        break;
    }
    //for +x -y
    for(let i=r+1, j=c+1; i>=0 && i<=7 && j<=7 && j>=0 ; i++, j++){
        let div=data(i,j);
        let flag=datalistner(div, coloro);
        if(flag[0]===false){
            if(flag[1].classList[1]==="kill"){
                nums.push(flag[1]);
                break;
            }
            else{
                break;
            }
        }
        else{
        nums.push(flag[1]);
        }
        break;
    }
    fr=String(r); fc=String(c); fnums=nums;
}

//function to handle pawn promotion when the pawn reached last respective div
function pawnPromotion(){
    let pb = document.getElementsByClassName("pawn_b");
    for (let i = 0; i < pb.length; i++) {
        if (pb[i].parentElement.id[0] === "7") {
            //pawn promotion!
            let ques = prompt("your pawn is eligible for promotion! please type one of the following to upgrade - Queen, Bishop, Knight, Rook");
            if(ques==="Queen") pb[i].parentElement.innerHTML=`<img class="img queen_b"src="img-src/queen_b.png" alt=""></img>`;
            else if(ques==="Knight") pb[i].parentElement.innerHTML=`<img class="img knight_b"src="img-src/knight_b.png" alt=""></img>`;
            else if(ques==="Bishop") pb[i].parentElement.innerHTML=`<img class="img bishop_b"src="img-src/bishop_b.png" alt=""></img>`;
            else if(ques==="Rook") pb[i].parentElement.innerHTML=`<img class="img rook_b"src="img-src/rook_b.png" alt=""></img>`;
            else{
               alert("please add valid value :)");
               pawnPromotion();     
            }
            break;
        }
    }
    let pw = document.getElementsByClassName("pawn_w");
    for (let i = 0; i < pw.length; i++) {
        if (pw[i].parentElement.id[0] === "0") {
             //pawn promotion!
            let ques = prompt("your pawn is eligible for promotion! please type one of the following to upgrade - Queen, Bishop, Knight, Rook");
            if(ques==="Queen") pw[i].parentElement.innerHTML=`<img class="img queen_w"src="img-src/queen_w.png" alt=""></img>`;
            else if(ques==="Knight") pw[i].parentElement.innerHTML=`<img class="img knight_w"src="img-src/knight_w.png" alt=""></img>`;
            else if(ques==="Bishop") pw[i].parentElement.innerHTML=`<img class="img bishop_w"src="img-src/bishop_w.png" alt=""></img>`;
            else if(ques==="Rook") pw[i].parentElement.innerHTML=`<img class="img rook_w"src="img-src/rook_w.png" alt=""></img>`;
            else{
                alert("please add valid value :)");
               pawnPromotion(); 
            }
            break;
        }
    }

}

//function to handle win situations
function checkmate(finalcolor){
    let KingImg = document.querySelector(`.img.king_${finalcolor}`);
    return KingImg===null; 
}

//A global event listner which moniters 2 types of clicks, firt one invokes various key functions and second click takes kill or migrate decision on the basis of classes activated by datalistner function
const Click=(e)=>{
    //handeling the first click event ie the user selects a key to show possible outcomes
    if(flagg===true){
        let temp=e.target.classList;
        let color=temp[1][temp[1].length-1]
        let key=temp[1].slice(0, temp[1].length-2);
        if(e.target.classList[0]!=="img"){
            return;
        }
        if((turn==="w" && color==="b") || (turn==="b" && color==="w")){
            alert("Not your turn :)");
            return;
        }
        flagg=false;
        // console.log(color);
        // console.log(key);
        if(key==="rook"){        
            rook(e.target.parentNode.id, color,false);
        }
        else if(key==="knight"){
            knight(e.target.parentNode.id, color);
        }
        else if(key==="bishop"){
            bishop(e.target.parentNode.id, color,false);
        }
        else if(key==="king"){
            king(e.target.parentNode.id, color);
        }
        else if(key==="queen"){
            queen(e.target.parentNode.id, color);
        }
        else if(key==="pawn"){
            if(e.target.classList[2]==="first"){
                pawncontrol=true;
            };
            pawn(e.target.parentNode.id, color);
        }
    }
    //handeling the other event when the user has all the possibilities highlighted and now wants to make move
    else{
        flagg=true;
        const id=fr+fc;
        const inner=document.getElementById(`${id}`).innerHTML;

        if(e.target.parentNode.id!==""){ //handeling all the cases when the user clicked on a div having image
            if(e.target.parentNode.id===id || !fnums.includes(e.target.parentNode)){ //means the image is either key itself or the user clicked on another IMAGE not being heighlighted
                for(let i=0; i<fnums.length; i++){
                    fnums[i].classList.remove("kill", "active");
                }
            }
            else if(e.target.parentNode.classList[1]==="kill"){ //means user has initiated the kill move
                
                //updating the user interface
                let para=document.getElementById(e.target.classList[1]);
                if(para!==null){
                    let i=parseInt(para.innerHTML);
                    i++;
                    document.getElementById(e.target.classList[1]).innerHTML=`${String(i)}`;
                }

                e.target.parentNode.innerHTML=`${inner}`;
                document.getElementById(`${id}`).innerHTML=``;
                for(let i=0; i<fnums.length; i++){
                    fnums[i].classList.remove("kill", "active");
                }

                if(pawncontrol===true){  //pawn control case
                    if(turn==="b"){
                        let pb=document.getElementsByClassName("pawn_b");
                        for(let i=0; i<pb.length; i++){
                            if(pb[i].id[1]===id[1]){
                            pb[i].classList.remove("first");
                            pb[i].classList.add("second");                    
                            }
                        }
                    }
                    else{
                        let pw=document.getElementsByClassName("pawn_w");
                        for(let i=0; i<pw.length; i++){
                            if(pw[i].id[1]===id[1]){
                            pw[i].classList.remove("first");
                            pw[i].classList.add("second");
                            }
                        }
                    }
                    pawncontrol=false;
                }
                pawnPromotion();
                //swap turns and names functionality
                let initurn=turn;
                if(turn==="w"){
                    i1.innerHTML=``;
                    let splitt=user2.split(" ");
                    i2.innerHTML=`${splitt[0]}'s turn`;
                    turn="b";
                    key1=false;
                    key2=true;
                }
                else{
                    i2.innerHTML=``;
                    let splitt=user1.split(" ");
                    i1.innerHTML=`${splitt[0]}'s turn`;
                    turn="w";
                    key1=true;
                    key2=false;
                } 
                let win=checkmate(turn);
                if(win===true){
                    if(initurn==="w"){
                        let val=prompt(`Game over! ${user1} wins, another game? type yes or no :)`);
                        if(val==="yes"){
                            location.reload();
                        }
                        else{
                            alert("Thanks for playing! have a good day");
                            location.reload();
                        }
                    }
                    else{
                        let val=prompt(`Game over! ${user2} wins, another game? type yes or no :)`);
                        if(val==="yes"){
                            location.reload();
                        }
                        else{
                            alert("Thanks for playing! have a good day");
                            location.reload();
                        }
                    }
                } 
            }
        }
        else{  //handeling all cases when the user has clicked on a div having no image it may be in fnums or may not be
            // console.log(e.target);
            if(fnums.includes(e.target)){ //case when user wishes to migrate    
                e.target.innerHTML=`${inner}`;
                document.getElementById(`${id}`).innerHTML=``;
                for(let i=0; i<fnums.length; i++){
                    fnums[i].classList.remove("kill", "active");
                }

                if(pawncontrol===true){  //pawn control case
                    if(turn==="b"){
                        let pb=document.getElementsByClassName("pawn_b");
                        for(let i=0; i<pb.length; i++){
                            if(pb[i].id[1]===id[1]){
                            pb[i].classList.remove("first");
                            pb[i].classList.add("second");
                            }
                        }
                    }
                    else{
                        let pw=document.getElementsByClassName("pawn_w");
                        for(let i=0; i<pw.length; i++){
                            if(pw[i].id[1]===id[1]){
                            pw[i].classList.remove("first");
                            pw[i].classList.add("second");
                            }
                        }
                    }
                    pawncontrol=false;
                }
                pawnPromotion();
                if(turn==="w"){
                    i1.innerHTML=``;
                    let splitt=user2.split(" ");
                    i2.innerHTML=`${splitt[0]}'s turn`;
                    turn="b";
                    key1=false;
                    key2=true;
                }
                else{
                    i2.innerHTML=``;
                    let splitt=user1.split(" ");
                    i1.innerHTML=`${splitt[0]}'s turn`;
                    turn="w";
                    key1=true;
                    key2=false;
                } 
            } 
            else{ //when user clicked on a div not inside nums and want to revert
                for(let i=0; i<fnums.length; i++){
                    fnums[i].classList.remove("kill", "active");
                }
            }
        }
    }
}

// calling all setup functions on reload/restart
ColorSetup(); //...(1)
InitialBuild(); //...(2)
const timer1=setInterval(TimerU1, 1000); //...(3)
NameFunc();//...(5)

//adding the first and global event listner to the whole chess board
for(let i=0; i<cells.length; i++){
    cells[i].addEventListener("click",Click)
}