/*
width = 1000px
height = 600px
ballRadius = 20px
*/
let myModel
let action = 0
let id, ballId

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
async function test() {
  const model = await tf.loadModel('https://abhiar.github.io/model/model.json');
  setTimeout(setmodel(model),100)
  setTimeout(start, 200)
}

test()

function setmodel(model) {
  myModel = model;
}

aball = document.getElementById('ball');
aleftPaddle = document.getElementById('leftPaddle');
arightPaddle = document.getElementById('rightPaddle');
score =  document.getElementById('score');

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.xDirection = 1;
    this.yDirection = 1;
  }

  animateBall() {
    if(this.xDirection === 1) {
      this.x++;
    }
    else{
      this.x--;
    }
    if(this.yDirection === 1) {
      this.y+=1;
    }
    else {
      this.y-=1;
    }

    if(this.x <= 50 || this.x >= 910) {
      this.xDirection *= -1;
    }
    if(this.y <= 0 || this.y >= 560) {
      this.yDirection *= -1;
    }
  }
};

class Paddle {
  constructor(y) {
    this.y = y;
    this.y2 = y+130;
  }

  movePaddle(direction) {
    if(direction == 0 && this.y2<600) {
      this.y+=1;
    }
    else if(this.y>0){
      this.y-=1;
    }
    this.y2=this.y+130;
  }
  setPaddle(y) {
    this.y = y;
    this.y2 = y+130;
  }
};

ball = new Ball(50,Math.random()*560);
leftPaddle = new Paddle(20, Math.random()*470);
rightPaddle = new Paddle(950, 0);

let container = document.getElementsByClassName('app')[0];
container.onmousemove = hoverHandler;
let mouseY = 0;

function hoverHandler(e) {
  mouseY = Math.min(Math.max(e.pageY-container.offsetTop-65, 0), 470);

}


function checkPlay() {
  if(ball.x === 50) {
    if(ball.y<=leftPaddle.y || ball.y>=leftPaddle.y2) {
      score.style.fontSize = 30;
      score.innerHTML = "Congrats! You beat the AI!";
      clearInterval(id);
      ballId = setInterval(frame_ball,1)
      return 0;
    }
  }
  if(ball.x === 910) {
    if(ball.y<=rightPaddle.y || ball.y>=rightPaddle.y2) {
      score.innerHTML = 0;
      return 0;
    }
    else {
      score.innerHTML = parseInt(score.innerHTML) + 1
    }
  }
  return 1;
}
function start() {
  id = setInterval(frame, 1);
}
function frame() {
    if(action < 0.5) {
      leftPaddle.movePaddle(0);
    }
    else {
      leftPaddle.movePaddle(1);
    }

    ball.animateBall();
    aball.style.marginLeft = ball.x;
    aball.style.marginTop = ball.y;
    aleftPaddle.style.marginTop = leftPaddle.y;
    rightPaddle.setPaddle(mouseY);
    arightPaddle.style.marginTop = rightPaddle.y;
    play = checkPlay();

    tmp = myModel.predict(tf.tensor2d([scale(ball.y+20, 40,600,10,790), scale(leftPaddle.y+65,65,535,67,733)], [1,2]));
    tmp.data().then(tmp => action = tmp[0]);
}

function frame_ball() {
  ball.animateBall();
  aball.style.marginLeft = ball.x;
  aball.style.marginTop = ball.y;
}
