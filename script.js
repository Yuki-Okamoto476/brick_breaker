const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext("2d")

let x = canvas.width / 2
let y = canvas.height - 30
let dx = 2
let dy = -2
const ballRadius = 3
const paddleHeight = 5
const paddleWidth = 75
let paddleX = (canvas.width - paddleWidth) / 2
let rightPressed = false
let leftPressed = false
const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 50
const brickHeight = 10
const brickPadding = 10
const brickOffsetTop = 20
const brickOffsetLeft = 5
let score = 0

const bricks = []
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = []
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1 }
  }
}
const keyDownHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true 
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true
  }
}
const keyUpHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false
  }
}
const mouseMoveHandler = (e) => {
  let relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
} 

document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)
document.addEventListener("mousemove", mouseMoveHandler, false);

const drawBall = () => {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = "white"
  ctx.fill()
  ctx.closePath()
}

const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();
}

const drawBricks = () => {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      if (bricks[i][j].status == 1) {
        let brickX = (i*(brickWidth + brickPadding)) + brickOffsetLeft
        let brickY = (j*(brickHeight + brickPadding)) + brickOffsetTop
        bricks[i][j].x = brickX
        bricks[i][j].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = "#0095DD"
        ctx.fill()
        ctx.closePath()
      }
  }
}
}

const collisionDetection = () => {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      let b = bricks[i][j]
      if (b.status == 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score++
          if (score == brickRowCount * brickColumnCount) {
            alert('クリア')
            location.reload()
          }
        }
      }
    }
  }
}

const drawScore = () => {
  ctx.font = "14px"
  ctx.fillStyle = "#0095DD"
  ctx.fillText("Score: " + score, 8, 10)
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBricks()
  drawBall()
  drawPaddle()
  drawScore()
  collisionDetection()
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      alert("Game Over")
      document.location.reload()
      clearInterval(interval)
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}
draw()