const SNOWFLAKE_COUNT = 125;
const MAX_SNOWFLAKE_SIZE = 10;
const GRAVITY = .1;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const HALF_CANVAS_WIDTH = CANVAS_WIDTH/2;

let saveButton;
let snowflakeAmountSlider;
let backgroundLayerPrevSnowflakeAmount;
let backgroundLayer = [];
let foregroundLayerPrevSnowflakeAmount;
let foregroundLayer = [];


function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  
  saveButton = createButton('save');
  saveButton.mousePressed(captureImage);
  snowflakeAmountSlider = createSlider(1, 250, 125, 0.1);
}

function draw() {
  const snowflakeAmount = snowflakeAmountSlider.value();

  background('red');
  generateBackgroundSnowflakesIfSliderChanged(snowflakeAmount);
  animateSnowflakes(backgroundLayer);
  buildTree();
  displayGreeting();
  generateForegroundSnowflakesIfSliderChanged(snowflakeAmount);
  animateSnowflakes(foregroundLayer);
}

function generateBackgroundSnowflakesIfSliderChanged(snowflakeAmount) {
  if (backgroundLayerPrevSnowflakeAmount !== snowflakeAmount) {
    backgroundLayer = generateSnowflakes(backgroundLayerPrevSnowflakeAmount, snowflakeAmount);  
    backgroundLayerPrevSnowflakeAmount = snowflakeAmount;
  }
}

function generateForegroundSnowflakesIfSliderChanged(snowflakeAmount) {
  if (foregroundLayerPrevSnowflakeAmount !== snowflakeAmount) {
    foregroundLayer = generateSnowflakes(foregroundLayerPrevSnowflakeAmount, snowflakeAmount);  
    foregroundLayerPrevSnowflakeAmount = snowflakeAmount;
  }
}

function displayGreeting() {
  push();
  textSize(48);
  stroke('green');
  strokeWeight(3);
  fill('white');
  textStyle(BOLD);
  text('HAPPY HOLIDAYS', HALF_CANVAS_WIDTH - 200, 40);
  pop();
}

function generateSnowflakes(overrideSnowflakeAmount) {
  const refreshedLayer = [];
  const snowflakeCount = overrideSnowflakeAmount || SNOWFLAKE_COUNT;

  for (let i = 0; i < snowflakeCount; i++) {
    refreshedLayer.push(new Snowflake());
  }

  return refreshedLayer;
}

function animateSnowflakes(layer) {
  for (let i = 0; i < layer.length; i++) {
    const snowflake = layer[i];

    snowflake.draw();
    snowflake.update();
  }
}

function buildTree() {
  const desiredSegments = 5;
  let segmentStartX = 275;
  let segmentStartWidth = 200;
  let segmentHeight = 85;
  let segmentWidthIncrement = 50;
  
  createTreeTop(80, 275);
  createTreeBase(desiredSegments);

  function createTreeTop(top, bottom) {
    const treeTopValues = _getTreeTopValues();
    
    push();
    strokeWeight(0);
    fill('green');
    triangle.apply(this, treeTopValues);
    pop();

    createStar(HALF_CANVAS_WIDTH-42, 200, 15, 35, 5);
    
    function _getTreeTopValues() {
      return [HALF_CANVAS_WIDTH, top, HALF_CANVAS_WIDTH - (HALF_CANVAS_WIDTH/3), bottom, HALF_CANVAS_WIDTH + (HALF_CANVAS_WIDTH/3), bottom];
    }
    
    return treeTopValues;
  }
  
  // This logic was mostly a snippet.
  function createStar(x, y, radius1, radius2, numberOfPoints) {
    let angle = TWO_PI / numberOfPoints;
    let halfAngle = angle / 2.0;
  
    push();
    strokeWeight(2);
    stroke('brown');
    fill('gold');
    rotate(-.3);
    beginShape();
  
    for (let a = 0; a < TWO_PI; a += angle) {
      let sx = x + cos(a) * radius2;
      let sy = y + sin(a) * radius2;
      vertex(sx, sy);
      sx = x + cos(a + halfAngle) * radius1;
      sy = y + sin(a + halfAngle) * radius1;
      vertex(sx, sy);
    }
  
    endShape(CLOSE);
    pop();
  }
  
  function createTreeBase(desiredSegments) {
    createTreeStump(90, 90, 20);

    for (let i = 0; i < desiredSegments; i++) {
      createTreeSegment(segmentStartX, segmentHeight, segmentStartWidth);
      
      segmentStartX += segmentHeight;
      segmentStartWidth += segmentWidthIncrement;
    }
  }

  function createTreeSegment(top, height, width) {
    const rectWidth = width;
    const rectHeight = height;
    const rectX = HALF_CANVAS_WIDTH - (rectWidth / 2);
    const rectY = top;
    
    const leftTriangleWidth = 80;
    const leftTriangleX1 = rectX;
    const leftTriangleY1 = rectY;
    const leftTriangleX2 = leftTriangleX1;
    const leftTriangleY2 = rectY + rectHeight;
    const leftTriangleX3 = leftTriangleX1 - leftTriangleWidth;
    const leftTriangleY3 = leftTriangleY2;
    
    const rightTriangleWidth = 80;
    const rightTriangleX1 = rectX + rectWidth;
    const rightTriangleY1 = rectY;
    const rightTriangleX2 = rightTriangleX1;
    const rightTriangleY2 = rectY + rectHeight;
    const rightTriangleX3 = rightTriangleX1 + rightTriangleWidth;
    const rightTriangleY3 = rightTriangleY2;
    
    strokeWeight(0);
    fill('green');
    rect(rectX, rectY, rectWidth, rectHeight);
    triangle(leftTriangleX1, leftTriangleY1, leftTriangleX2, leftTriangleY2, leftTriangleX3, leftTriangleY3);
    triangle(rightTriangleX1, rightTriangleY1, rightTriangleX2, rightTriangleY2, rightTriangleX3, rightTriangleY3);
  }
  
  function createTreeStump(width, height, bottomOffset) {
    const stumpWidth = width;
    const stumpHeight = height;
    const startX = HALF_CANVAS_WIDTH - (stumpWidth/2);
    const startY = CANVAS_HEIGHT - (stumpHeight + bottomOffset);
    
    push();
    strokeWeight(1);
    fill('brown');
    rect(startX, startY, stumpWidth, stumpHeight);
    pop();
  }
}

function captureImage() {
  save('snowy-holidays.png');
}

class Snowflake {
  #x;
  #y;
  #size;
  #gravity;

  constructor() {
    this.#x = random(width);
    this.#y = random(height);
    this.#size = random(MAX_SNOWFLAKE_SIZE);
    this.#gravity = GRAVITY * this.#size;
  }

  draw() {
    push();
    fill('white');
    circle(this.#x, this.#y, this.#size);
    pop();
  }

  isPastViewPort() {
    return this.#y > height + this.#size;
  }

  resetSnowflakePosition() {
    this.#y = -this.#size;
  }

  applyGravity() {
    const WIND_CHANGE = 1.25;
    const wind = noise(WIND_CHANGE, this.#y + WIND_CHANGE, frameCount + WIND_CHANGE) - 0.5;
    this.#y += this.#gravity;

    if (this.#x > width + this.#size) {
      this.#x = -this.#size;
    } else if (this.#x < -this.#size) {
      this.#x = width + this.#size;
    } else {
      this.#x += wind * WIND_CHANGE;
    }
  }

  update() {
    if (this.isPastViewPort()) {
      this.resetSnowflakePosition();
    } else {
      this.applyGravity();
    }
  }
}