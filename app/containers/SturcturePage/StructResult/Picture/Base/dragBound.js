export function computedBound(ele, currentPosition, scale, rotate) {
  const data = currentPosition;
  const eleRect = ele.getBoundingClientRect();
  const isHorizontal = Math.abs(rotate) % 180 === 0;
  const w = eleRect.width;
  const h = eleRect.height;
  let lx = 0,
    ly = 0;
  if (scale === 1 && isHorizontal) {
    return { x: 0, y: 0 };
  }
  if (scale === 1 && !isHorizontal) {
    lx = 0;
    ly = (w - h) / 2;
  } else {
    //TODO 这是限制x区域，应该是使用原来高度的缩放大小来计算，
    if (h * scale < w && !isHorizontal) {
      //TODO 放大后竖向是 h*scale<w是 x = 0， 
      lx = 0;
    } else {
      //TODO 得到缩放后可移动区域 在减去误差 (w - h) / 2
      lx = !isHorizontal ? Math.round((h * (scale - 1)) / 2 - (w - h) / 2) : Math.round((w * (scale - 1)) / 2);
    }
    //TODO y的限制区域应该是原来宽度的限制区域计算后还要加上原始的（w-h）/2
    ly = !isHorizontal ? Math.round((w * (scale - 1)) / 2 + (w - h) / 2) : Math.round((h * (scale - 1)) / 2);
  }
  let x = 0,
    y = 0;
  if (data.x >= 0 && data.x > lx) {
    x = lx;
  }
  if (data.x >= 0 && data.x < lx) {
    x = data.x;
  }

  if (data.x < 0 && data.x < -lx) {
    x = -lx;
  }
  if (data.x < 0 && data.x > -lx) {
    x = data.x;
  }

  if (data.y >= 0 && data.y > ly) {
    y = ly;
  }
  if (data.y >= 0 && data.y < ly) {
    y = data.y;
  }

  if (data.y < 0 && data.y < -ly) {
    y = -ly;
  }
  if (data.y < 0 && data.y > -ly) {
    y = data.y;
  }
  if (x !== data.x || y !== data.y) {
    return { x, y };
  } else {
    return;
  }
}
