import { BOARD_HEIGHT, BOARD_WIDHT, pieces, BLOCK_SIZE } from "./const";



//? --- TABLERO ---//

export function createboard (width, height){
    return Array(height).fill().map(()=> Array(width).fill(0))
  }
//? --- PIEZA ---//

// Función para crear una nueva pieza con una forma y color aleatorios
export function createPiece() {
    return {
      position: { x: Math.floor(BOARD_WIDHT / 2 - 2), y: 0 },
      shape: pieces[Math.floor(Math.random() * pieces.length)],
      color: colorHEX()
    };
  }
  function colorHEX() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

