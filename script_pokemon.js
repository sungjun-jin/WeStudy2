/*

1. 턴제 진행
2. 2가지 스킬에 대한 이벤트 처리 -> 랜덤 데미지 이벤트 처리
3. 상대방 스킬 랜덤 시전
4. hp가 0이 되었을 시 승리 / 패배 처리
*/

let opponent; //상대방 
let player; //플레이어
let turn = true;

let playerScore = 0;
let opponentScore = 0;


//HTML 엘리먼트 JavaScript로 가져오기 

// 피카츄 HTML 이미지
const playerCharacter = document.getElementById('player-pokemon');
// 푸린 HTML 이미지
const opponentCharacter = document.getElementById('opponent-pokemon');

//다음 버튼 
const nextButton = document.getElementById('next-button');

//파란색 텍스트박스
const textBox = document.getElementById('textBox');

//전광판
const scoreBoard = document.getElementById('score');

//HTML 엘리먼트 JavaScript로 가져오기 

function randomDamageGenerator(attackId) {

    // 데미지를 랜덤으로 생성

    //1. 몸통박치기 -> 10 ~ 30까지 랜덤 데미지 생성
    //2. 백만볼트   -> 20 ~ 40까지 랜덤 데미지 생성

    let damage = 0;

    if (attackId === 'tackle') {

        damage = Math.floor((Math.random() * 20) + 10);


    } else if (attackId === 'megaVolt' || attackId === 'sleep') {

        damage = Math.floor((Math.random() * 20) + 20);

    }

    console.log("damage : " + damage);

    return damage;


}

function checkDeath(playerHp, opponentHp) {

    //승패를 확인하는 함수

    if (playerHp <= 0) {

        
        //플레이어 패       
        alert("플레이어 패!");
        opponentScore = opponentScore + 1;
        isGameStart();     
       



    } else if (opponentHp <= 0) {

        
        //플레이어 승              
        alert("플레이어 승!");
        playerScore = playerScore + 1;  
        isGameStart();   
          
    }   
   

   
}

function setHp(name, hp) {

    //공격 결과로 class의 hp 상태를 progress bar에 반영

    if (name === '피카츄') {

        document.getElementById('playerHp').value = hp;

    } else if (name === '푸린') {

        document.getElementById('opponentHp').value = hp;
    }
}

function changeTurn() {

    //턴을 바꾸는 함수

    if (turn === true) {

        turn = false;
        console.log('Turn change false');

    } else if (turn === false) {
        console.log('Turn change true');

        turn = true;
    }
}

//포켓몬 클래스
class Pokemon {

    // Player 클래스와 Opponent 클래스의 부모 클래스
    constructor(name, hp) {

        this._name = name;
        this._hp = hp;
    }

    get name() {

        return this._name;
    }

    get hp() {

        return this._hp;
    }

    set hp(hp) {

        this._hp = hp;
    }

    tackle() {


        if (this.name === '피카츄') {

            //푸린에게  몸통박치기 공격

            //데미지 랜덤 생성
            const damage = randomDamageGenerator('tackle');
            opponent.hp = opponent.hp - damage;
            console.log("푸린 hp :" + opponent.hp);
            showText('피카츄', 'tackle', damage);
            setHp('푸린', opponent.hp);


        } else if (this.name === '푸린') {

            //피카츄에게 몸통박치기 공격

            //데미지 랜덤 생성

            const damage = randomDamageGenerator('tackle');
            player.hp = player.hp - damage;
            console.log("피카츄 hp : " + player.hp);
            showText('푸린', 'tackle', damage);
            setHp('피카츄', player.hp);

        }

        console.log(this.name + " 몸통박치기");
    }



}

//상대방 클래스
class Opponent extends Pokemon {

    constructor(name, hp) {

        super(name, hp);
    }

    attack() {

        //상대방의 공격

        //0과 1사이의 random number로 공격 스킬을 정한다

        //1. 몸통박치기
        //2. 졸음공격

        let randomNum = Math.floor(Math.random() * 2);

        console.log("푸린 + " + randomNum);

        if (randomNum === 0) {

            this.tackle();



        } else if (randomNum === 1) {

            this.sleep();

        }
    }

    sleep() {

        //푸린 졸음공격
        const damage = randomDamageGenerator('sleep');
        console.log(this.name + " 졸음공격");
        player.hp = player.hp - damage;
        console.log("피카츄 hp : " + player.hp);
        showText('푸린', 'sleep', damage);
        setHp('피카츄', player.hp);


    }
}

//플레이어 클래스
class Player extends Pokemon {

    constructor(name, hp) {

        super(name, hp);
    }

    megaVolt() {

        //백만볼트

        const damage = randomDamageGenerator('megaVolt');
        console.log(this.name + " 백만볼트");
        opponent.hp = opponent.hp - damage;
        console.log("푸린 hp :" + opponent.hp);
        showText('피카츄', 'megaVolt', damage);
        setHp('푸린', opponent.hp);

    }
}

function setScore() {

    //전광판에 스코어 보드 갱신
    scoreBoard.innerHTML = '<h2> 플레이어  ' + playerScore + '  :    ' + opponentScore + ' 상대방 </h2>';     

}

//게임 초기화 함수
function intialize() {
    
    turn = true;
    setScore();
    //텍스트 박스 초기화
    textBox.innerHTML = "";
    //상대만 포켓몬 초기화
    opponent = new Opponent("푸린", 100);
    setHp('푸린', opponent.hp);

    //플레이어 포켓몬 초기화
    player = new Player("피카츄", 100);
    setHp('피카츄', player.hp);

    console.log("Initialize - Player : " + player.name + " Player hp : " + player.hp);
    console.log("Initialize - Opponent : " + opponent.name + " Player hp : " + opponent.hp);

    playerCharacter.classList.remove("apply-shake");
    opponentCharacter.classList.remove("apply-shake");


}

//공격 애니메이션
function shake(name) {

    //공격을 했을 때 떨리는 에니메이션 효과

    if (name === '피카츄') {


        playerCharacter.classList.add("apply-shake");

        //애니메이션 종료 리스너
        playerCharacter.addEventListener('animationend', function () {

            playerCharacter.classList.remove("apply-shake");
        })



    } else if (name === '푸린') {


        opponentCharacter.classList.add("apply-shake");

        //애니메이션 종료 리스너
        opponentCharacter.addEventListener('animationend', function () {

            opponentCharacter.classList.remove("apply-shake");
        })
    }



}

function showText(name, attack, damage) {

    //하단의 가운데 textBox 엘리먼트에 텍스트를 띄우는 함수

    //innerHTML은 태그를 적용시켜, 즉 문자열을 html로 인식하여 출력한다.


    if (name === '피카츄') {

        if (attack === 'tackle') {

            textBox.innerHTML = '<h2 style="text-align: center;">피카츄가 몸통박치기를 사용했다! 데미지-' +
                damage + "</h2>";


        } else if (attack === 'megaVolt') {

            textBox.innerHTML = '<h2 style="text-align: center;">피카츄가 백만볼트를 사용했다!<br> 데미지 : ' +
                damage + "</h2>";
        }
    } else if (name === '푸린') {

        if (attack === 'tackle') {

            textBox.innerHTML = '<h2 style="text-align: center;">푸린이 몸통박치기를 사용했다!<br> 데미지 : ' +
                damage + "</h2>";



        } else if (attack === 'sleep') {

            textBox.innerHTML = '<h2 style="text-align: center;">푸린이 잠재우기를 사용했다!<br> 데미지 : ' +
                damage + "</h2>";
        }

    }



}

function isGameStart() {

    const gameStartResponse = confirm("다시 게임을 시작하시겠습니까?");

    if (gameStartResponse === true) {

        intialize();

    } else {

        window.close();

    }
}

intialize();




//몸통박치기 클릭 리스너
tackle.addEventListener('click', function () {

    if (turn) {

        
        shake('피카츄');
        player.tackle();
        changeTurn();
        showText();
        checkDeath(player.hp, opponent.hp);


    } else {

        alert("플레이어 차례가 아닙니다.");
    }
})

//백만볼트 클릭 리스너
megaVolt.addEventListener('click', function () {

    if (turn) {

        shake('피카츄');
        player.megaVolt();
        changeTurn();
        showText();
        checkDeath(player.hp, opponent.hp);


    } else {

        alert("플레이어 차례가 아닙니다.");
    }
})

//도망 클릭 리스너
run.addEventListener('click', function () {

    //예, 아니오 버튼 출력
    const response = confirm('정말로 도망가시겠습니까?');

    if (response === true) {

        //플레이어 패
        alert("플레이어 패!");
        opponentScore = opponentScore + 1;
        isGameStart();       

    } else {

        //계속 게임 진행
    }
})

//다음 버튼 클릭 리스너
nextButton.addEventListener('click', function () {

    if (turn === false) {

        shake('푸린');
        opponent.attack();        
        changeTurn();
        checkDeath(player.hp, opponent.hp);

    } else {

        alert("플레이어 차례입니다.");
    }

})