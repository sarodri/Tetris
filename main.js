import './style.css'
import { BLOCK_SIZE, BOARD_WIDHT, BOARD_HEIGHT, pieces } from './src/const'
import { createPiece, createboard } from './src/utils'



const canvas = document.querySelector("canvas")  // nos tareamos el canvas
const context = canvas.getContext("2d") // damos contexto 2d
const $score = document.querySelector("span")

// Variable de audio
let audio = new window.Audio("./tetris.mp3")
audio.volume = 0.5
audio.loop = true


//? --- Vamos a dar tamaño a los elementos del tablero ---//

canvas.width = BLOCK_SIZE * BOARD_WIDHT
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

//! --- Determinamos la escala 2d con el tamaño del bloque ---//
context.scale(BLOCK_SIZE, BLOCK_SIZE)


// Inicializamos tablero y la primera pieza
const board = createboard(BOARD_WIDHT, BOARD_HEIGHT)
let piece = createPiece();

//? --- Desarrollo del GAME LOOP ---//
let lastTime = 0;
let dropCounter = 0; //se utilizan para llevar la cuenta del tiempo transcurrido entre los frames
const dropInterval = 500; // 0,5 segundos
let score = 0
//! --- funcion update que estaremos llamando ---//

function update (time = 0){
  const deltaTime = time - lastTime; //tiempo transcurrido desde la última actualización
  lastTime = time;

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      completeBoard();
      deleteLine();
    }
    dropCounter = 0;
  }
  draw()
  window.requestAnimationFrame(update)
}

function draw (){
  context.fillStyle = "#0005"
  context.fillRect(0,0, canvas.width, canvas.height)

 //recorro el tablero pintando los ejes
  board.forEach((row, y)=> {
    row.forEach((value, x)=>{
      if (value == 1){
        context.fillStyle = "red"
        context.fillRect(x, y, 1, 1)
      }
    })
  })

//pinto la pieza recorriendo los valor de las posiciones

  piece.shape.forEach((row, y)=>{
    row.forEach((value, x)=>{
      if (value === 1){
        context.fillStyle = piece.color
        context.fillRect(x + piece.position.x ,y + piece.position.y , 1, 1)
      }
    })
  })
  $score.innerText = score
}

//colisiones

function checkCollision() {
  return piece.shape.some((row, y) => {
    return row.some((value, x) => {
     return(
      value !== 0 &&
      board[y + piece.position.y]?.[x + piece.position.x] !== 0
     )
    });
  });
}

//movimiento de la pieza

document.addEventListener('keydown', event =>{
  if(event.key === "ArrowLeft") {
    piece.position.x--
    if(checkCollision()){
      piece.position.x++
    }
  }
  if(event.key === "ArrowRight"){
    piece.position.x++
    if(checkCollision()){
      piece.position.x--
    }
  } 
  if(event.key === "ArrowDown"){
    piece.position.y++
    if(checkCollision()){
      piece.position.y--
      completeBoard()
      deleteLine()
      }
  } 
  if (event.key === "ArrowUp") {
    const oldShape = piece.shape;
    piece.shape = rotatePiece(piece.shape);
    if (checkCollision()) {
      piece.shape = oldShape; // Revertir si hay colisión
    }
  }
})
// rotacion de la pieza 
function rotatePiece(matriz) {
  const rotatedMatriz = matriz[0].map((_, i) => matriz.map(row => row[i])).reverse();
  return rotatedMatriz;
}

// fusión de la pieza con el tablero cuando choca

function completeBoard (){
  piece.shape.forEach((row, y)=>{
    row.forEach((value, x)=>{
      // incluyo la pieza en el tablero
      if(value == 1){
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  // reseteo de posicion
  piece.position.x = Math.floor(BOARD_WIDHT /2 -2)
  piece.position.y = 0

  // genero nueva pieza con forma aleatoria
  piece = createPiece()

  //game over
  if(checkCollision()){
    window.alert("Game over!!") //lanzamos alerta
    board.forEach((row)=> row.fill(0)) // limpiamos tablero
    score = 0; // Reseteamos la puntuación
    audio.pause();
    audio.currentTime = 0;
    audio.play();
  }
}

// borrado de lineas inferiores

function deleteLine(){
  const lineToDelete = []

  // añadimos al array de lineas a eliminar que estan completas
  board.forEach((row, y)=>{
    if(row.every(value => value === 1)){
      lineToDelete.push(y)
    }
  })
  // elimino la linea y creo una una por arriba
  lineToDelete.forEach(y => {
    board.splice(y, 1)
    const newLine = Array(BOARD_WIDHT).fill(0)
    board.unshift(newLine)
    score +=10
  })
}
const $section = document.querySelector("section")

$section.addEventListener("click", () =>{
  update()

  $section.remove()
  audio.play()
})


