/**
 * 计算抓拍区域
 */

export function getCaptureRect(rect, type, isRealy) {
  let rectArea = rect.split(',');
  if (rectArea.length !== 4) {
    throw Error('区域有误 实例：string = "x,y,w,h"! ');
  }
  if (isRealy) {
    return rectArea;
  }
  let x, y, w, h;
  switch (type) {
    case 'body':
      x = rectArea[0] - rectArea[2] * 0.2;
      y = rectArea[1] - rectArea[3] * 0.2;
      w = rectArea[2] * 1.4;
      h = rectArea[3] * 1.4;

      break;
    case 'nonVehicle':
    case 'vehicle':
    case 'plate':
    case 'vehiclesPassengers':
      x = rectArea[0];
      y = rectArea[1];
      w = rectArea[2];
      h = rectArea[3];
      break;
    case 'nonvehiclesPassengers':
      x = rectArea[0] - rectArea[2] * 0.0000001 * 0.8;
      y = rectArea[1] - rectArea[3] * 0.01;
      w = rectArea[2] * 0.8;
      h = rectArea[3] * 0.4;
      break;
    default:
      // face
      x = rectArea[0] - rectArea[2] * 0.8;
      y = rectArea[1] - rectArea[3] * 1.5;
      w = rectArea[2] * 2.6;
      h = rectArea[3] * 3.2;
      break;
  }
  return [x, y, w, h];
}

export async function loadCaptureRectImage(image, rect, imageType) {
  if (!image) {
    throw Error('image is HTMLImgElement');
  }
  let [x, y, w, h] = getCaptureRect(rect, imageType);
  let canvas = document.createElement('canvas');
  let ctx = canvas.getContext('2d');
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
  let url = canvas.toDataURL();
  setTimeout(() => {
    canvas.remove();
    canvas = null;
    ctx = null;
  }, 500);
  return url;
}

export function getRectImagePath(
  sourceImage,
  cuurentImage,
  rect,
  options = { scale: 1, rotate: 0, x: 0, y: 0 }
) {
  const { scale, rotate } = options;
  const [x, y, w, h] = rect;
  const { width, height } = sourceImage;
  const sourceSize = {
    width,
    height,
    cwidth: cuurentImage.width,
    cheight: cuurentImage.height,
    wScale: width / cuurentImage.width,
    hScale: height / cuurentImage.height,
  };
  const area = [
    x * sourceSize.wScale,
    y * sourceSize.hScale,
    w * sourceSize.wScale,
    h * sourceSize.hScale,
  ];
  let fullCanvas = document.createElement('canvas');
  let fullCtx = fullCanvas.getContext('2d');
  fullCanvas.width = width;
  fullCanvas.height = height;
  fullCtx.save();
  // fullCtx.transform;
  // document.body.appendChild(fullCanvas);
  fullCtx.setTransform(
    scale,
    0,
    0,
    scale,
    options.x * sourceSize.wScale - ((scale - 1) * width) / 2,
    options.y * sourceSize.hScale - ((scale - 1) * height) / 2
  );
  fullCtx.translate(width / 2, height / 2);
  fullCtx.rotate((rotate * Math.PI) / 180);
  fullCtx.drawImage(sourceImage, -width / 2, -height / 2, width, height);
  fullCtx.restore();
  let imageData = fullCtx.getImageData(...area);
  let tempCanvas = document.createElement('canvas');
  let tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = area[2];
  tempCanvas.height = area[3];
  // document.body.appendChild(tempCanvas);
  tempCtx.putImageData(imageData, 0, 0);
  const dataUrl = tempCanvas.toDataURL();
  setTimeout(() => {
    fullCanvas.remove();
    tempCanvas.remove();
    fullCanvas = null;
    tempCanvas = null;
    tempCtx = null;
    fullCtx = null;
    imageData = null;
  }, 100);
  return dataUrl;
}

export function cloneImageNode(image) {
  if (!image) {
    return Promise.resolve();
  }
  let newImage = image.cloneNode();
  return new Promise((resolve, reject) => {
    newImage.addEventListener(
      'load',
      function () {
        resolve(this);
      },
      false
    );
    newImage.addEventListener(
      'error',
      function (e) {
        reject(e);
      },
      false
    );
  });
}
