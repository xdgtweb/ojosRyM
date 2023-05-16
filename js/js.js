const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const faceWithWhiteEyes = new Image();
const iris = new Image();
const faceMask = new Image();
const mousePosition = { x: 0, y: 0 };
const radioOjoRick = 55; /**El espacio por el cual se mueve el ojo Rick */
const radioOjoMorty = 35; /**El espacio por el cual se mueve el ojo Morty */

faceWithWhiteEyes.src = 'imgs/rickymortyojosenblanco.png';
iris.src = 'imgs/ojoizquierdorick.png';
faceMask.src = 'imgs/rickymortysinojos.png';

function redimensionaCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.height = canvas.height;
  ctx.width = canvas.width;
}

function dibujarCaraConOjosBlancos() {
  const x = canvas.width / 2 - faceWithWhiteEyes.width / 2;
  const y = canvas.height / 2 - faceWithWhiteEyes.height / 2;
  ctx.drawImage(faceWithWhiteEyes, x, y);
}

function dibujarMascaraFacial() {
  const x = canvas.width / 2 - faceMask.width / 2;
  const y = canvas.height / 2 - faceMask.height / 2;
  ctx.drawImage(faceMask, x, y);
}

function distancia(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

function getUnitVector(a, b) {
  const module = distancia(a,b);
  return {
    x: (b.x - a.x) / module,
    y: (b.y - a.y) / module
  };
}

function getTransladoPosicionRick(eyePositionRick) {

  const unitVector = getUnitVector(eyePositionRick, mousePosition);

  if (distancia(eyePositionRick, mousePosition) <= radioOjoRick) {
    return mousePosition;
  }
  else {
    return {
      x: eyePositionRick.x + radioOjoRick * Math.sin(unitVector.x),
      y: eyePositionRick.y + radioOjoRick * Math.sin(unitVector.y),
    };
  }
}

function getTransladoPosicionMorty(eyePositionMorty) {

  const unitVector = getUnitVector(eyePositionMorty, mousePosition);

  if (distancia(eyePositionMorty, mousePosition) <= radioOjoMorty) {
    return mousePosition;
  }
  else {
    return {
      x: eyePositionMorty.x + radioOjoMorty * Math.sin(unitVector.x),
      y: eyePositionMorty.y + radioOjoMorty * Math.sin(unitVector.y),
    };
  }
}

function dibujaOjos() {
  const origenPosicionOjoRick = [
    //**Posición de los ojos de Rick*/
    {
      /**izquierdo */
      x: canvas.width / 2 - -175, /** izquierda derecha */
      y: canvas.height / 2 - 165, /** abajo arriba */
    },
    {
      /**derecho */
      x: canvas.width / 2 - -335, /** izquierda derecha */
      y: canvas.height / 2 - 175, /** abajo arriba */
    }
  ];
  const eyeOriginPositionsMorty = [
    //**Posición de los ojos de Morty*/
    {
      /**derecho */
      x: canvas.width / 2 - 45, /** izquierda derecha */
      y: canvas.height / 2 - -180, /** abajo arriba */
    },
    {
      /**izquierdo */
      x: canvas.width / 2 - 220, /** izquierda derecha */
      y: canvas.height / 2 - -215, /** abajo arriba */
    }
  ];
  
  const posicionOjoRick = origenPosicionOjoRick.map(getTransladoPosicionRick);
  
  posicionOjoRick.forEach((eyePositionRick) => {
    ctx.drawImage(iris, 
                  eyePositionRick.x - iris.width / 2, 
                  eyePositionRick.y - iris.height / 2);
  });

  const eyePositionsMorty = eyeOriginPositionsMorty.map(getTransladoPosicionMorty);

  eyePositionsMorty.forEach((eyePositionMorty) => {
    ctx.drawImage(iris, 
                  eyePositionMorty.x - iris.width / 2, 
                  eyePositionMorty.y - iris.height / 2);
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
}

function render() {
  clearCanvas();
  dibujarCaraConOjosBlancos();
  dibujaOjos();
  dibujarMascaraFacial();
}

function onResize() {
  redimensionaCanvas();
  render();
}

function onMouseMove(event) {
  mousePosition.x = event.offsetX;
  mousePosition.y = event.offsetY;
  render();
}

function onTouchMove(event) {
  mousePosition.x = event.touches[0].clientX;
  mousePosition.y = event.touches[0].clientY;
  render();
}

function main() {
  redimensionaCanvas();
  render();
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('touchmove', onTouchMove);
}

window.addEventListener('load', main);