const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext("2d")

const startButton = document.querySelector('.btn-engine-start-in')
const scoreView = document.querySelector('.scoreView')

let x = canvas.width / 2 //ボールの開始位置のx座標（canvasの左端からボールまでの距離）
let y = canvas.height - 30 //ボールの開始位置のy座標（canvasの下端から30px上）
let dx = 2 //ボールがx軸方向に動く距離
let dy = -2 //ボールがy軸方向に動く距離
const ballRadius = 3 //ボールの半径
const paddleHeight = 5 //パドルの高さ
const paddleWidth = 75 //パドルの横幅
let paddleX = (canvas.width - paddleWidth) / 2 //パドルのx座標（canvasの左端からパドルの左端までの距離）
let rightPressed = false //キーボードの←ボタンが押されたかどうかのフラグ（初期値は押されていないためfalse)
let leftPressed = false //キーボードの→ボタンが押されたかどうかのフラグ（初期値は押されていないためfalse)
const brickRowCount = 3 //ブロックの列の数
const brickColumnCount = 5 //ブロックの行の数
const brickWidth = 50 //ブロックの横幅
const brickHeight = 10 //ブロックの高さ
const brickPadding = 10 //ブロックの間隔
const brickOffsetTop = 20 //canvasの上端からブロックまでの間隔
const brickOffsetLeft = 5　//canvasの左端からブロックまでの間隔
let score = 0

//座標(0,0)に5×3=15個のブロックを作成
const bricks = []
for (let i = 0; i < brickColumnCount; i++) {
  bricks[i] = []
  for (let j = 0; j < brickRowCount; j++) {
    bricks[i][j] = { x: 0, y: 0, status: 1 } //衝突検知のフラグ（ボールがぶつかっていないときはstatus=1, ボールがぶつかったらstatus=0）
  }
}
//キーボードの←または→ボタンが押されたときにフラグをtrueにする処理
const keyDownHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true 
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true
  }
}
//キーボードの←または→ボタンから離したときにフラグをfalseにする処理
const keyUpHandler = (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false
  }
}
//マウスカーソルがcanvasの横幅内に入っているときにもパドルをマウスで動かせる処理
const mouseMoveHandler = (e) => {
  let relativeX = e.clientX - canvas.offsetLeft //「ビューポート（画面）の左端からマウスカーソルまでの距離」- 「ビューポート（画面）の左端からcanvasまでの距離]
  //マウスカーソルがcanvasの左端より内側（中央）かつcanvasの右側より内側（中央）にあるときにパドルを動かす
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
} 

document.addEventListener("keydown", keyDownHandler) //キーボードを押したときの処理
document.addEventListener("keyup", keyUpHandler) //キーボードを離したときの処理
document.addEventListener("mousemove", mouseMoveHandler) //マウスを動かしたときの処理

//ボールを描画する処理
const drawBall = () => {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2) //arc(円弧の中心のx座標, 円弧の中心のy座標, 円弧の半径, 円弧の始まりの角度, 円弧の終わりの角度)
  ctx.fillStyle = "yellow" //ボールの色
  ctx.fill()
  ctx.closePath()
}

//パドルを描画する処理
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight) //rect(四角形の左上のx座標, 四角形の左上のy座標, 四角形の幅, 四角形の高さ)
  ctx.fillStyle = "yellow"; //パドルの色
  ctx.fill();
  ctx.closePath();
}

//衝突を検知する処理
const collisionDetection = () => {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      let b = bricks[i][j]
      if (b.status == 1) {
        //ボールのx座標がブロックのx座標より大きい、かつボールのx座標がブロックのx座標とその幅の和より小さい、かつボールのy座標がブロックのy座標より大きい、かつボールのy座標がブロックのy座標とその高さの和より小さいのときの処理
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy //ボールの跳ね返り
          b.status = 0 //ブロックを削除
          score++ 
          //すべてのブロックを消したらゲームクリア
          if (score == brickRowCount * brickColumnCount) {
            alert('クリア')
            location.reload()
          }
        }
      }
    }
  }
}

//ブロックを描画する処理
const drawBricks = () => {
  for (let i = 0; i < brickColumnCount; i++) {
    for (let j = 0; j < brickRowCount; j++) {
      //status=1のときにブロック描画
      if (bricks[i][j].status == 1) {
        let brickX = (i*(brickWidth + brickPadding)) + brickOffsetLeft //ブロックのx座標
        let brickY = (j*(brickHeight + brickPadding)) + brickOffsetTop //ブロックのy座標
        bricks[i][j].x = brickX
        bricks[i][j].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = "white"
        ctx.fill()
        ctx.closePath()
      }
  }
}
}

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height) //ボールの軌跡を削除
  drawBricks()
  drawBall()
  drawPaddle()
  collisionDetection()
  scoreView.innerHTML = score //スコアを表示
  //ボールが左端または右端に衝突したときに跳ね返る処理
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
  //ボールが上端に衝突した時に跳ね返る処理
  if (y + dy < ballRadius) {
    dy = -dy
    //ボールが下端に衝突した時に跳ね返る処理
  } else if (y + dy > canvas.height - ballRadius) {
    //ボールがパドルに当たったときに跳ね返る処理
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      alert("Game Over")
      document.location.reload() //ゲームオーバーになったら画面をリロードして最初の画面に戻す
      clearInterval(interval)
    }
  }
  //→ボタンが押されたときにパドルを右に7動かす処理
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
    //←ボタンが押されたときにパドルを左に7動かす処理
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

//スタートボタンを押してゲームを開始する処理
startButton.addEventListener('click', () => {
  draw()
})
