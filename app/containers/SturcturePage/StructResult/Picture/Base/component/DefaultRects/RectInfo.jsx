import React from 'react';

// const { Loader } = window;
// const IconFont = Loader.loadBaseComponent('IconFont');


const RECT_INFO_WIDTH = 150
const RECT_INFO_HEIGHT = 24
const RECT_WINDOW_MARGIN = 6

class RectInfo extends React.Component {

  computedRectSize = (item) => {
    const rectSize = {
      rectInfoWidth: RECT_INFO_WIDTH, 
      rectInfoHeight: item.tags.length * RECT_INFO_HEIGHT + 6
    }
    return rectSize
  }

  // 计算结构化窗口显示位置
  computedRectInfoPosition = () => {
    const { DOMSize, item } = this.props;
    const { width, height } = DOMSize;
    const { rectInfoWidth, rectInfoHeight } = this.computedRectSize(item);
    const [ rectLeft, rectTop, rectWidth ] = item.rect;
    let x, y;
    if(rectWidth + rectLeft + rectInfoWidth < width) {
      x = rectWidth + rectLeft + RECT_WINDOW_MARGIN;
    } else {
      x = rectLeft - RECT_WINDOW_MARGIN - rectInfoWidth;
    }
    if(rectTop + rectInfoHeight < height) {
      y = rectTop
      y = y < 0 ? RECT_WINDOW_MARGIN : y;
    } else {
      y = height - rectInfoHeight;
    }
    return { x, y, width: rectInfoWidth, height: rectInfoHeight }
  }


  render () {
    const position = this.computedRectInfoPosition();
    const { item } = this.props;
    return (
      <div 
        className='rect-info-list-wrapper'
        style={{
          left: position.x,
          top: position.y,
          width: position.width,
          height: position.height,
        }}
      > 
        {/* <div className='rect-card-corner'>
          <SvgCardCorner />
        </div> */}
        {/* <div className='rect-info-arrow'></div> */}
        <ul className='rect-info-list'> 
          {item.tags.map((v, index) => (
            <li
              className='info-item'
              key={index}
              // title={v.typeLabel+': '+v.tagLabel}
              title={v.tagLabel}
            >
              {/* <IconFont type={v.typeIcon} /> */}
              {/* <span className='item-label'>{v.typeLabel} :</span>  */}
              <span className='item-value'>{ v.tagLabel}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  } 
}

export default RectInfo;