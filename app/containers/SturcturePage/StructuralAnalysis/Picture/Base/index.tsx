import React from 'react';
import MoveContent from './component/MoveContent';
import { getCaptureRect, getRectImagePath, cloneImageNode } from './loadCaptureRectImage';
import { computedBound } from './dragBound';
import { isFunction } from 'lodash';
import DefaultRects from './component/DefaultRects';
import NewRect from './component/NewRect';
import RectMenu from './component/RectMenu';

import './index.less';

// const { Utils, Service } = window;

class PictureView extends React.Component {
  constructor(props) {
    super(props);
    this.layoutRef = React.createRef();
    this.moveActionRef = React.createRef();
    this.domImgRef = React.createRef();
    this.imageSource = null;
    this.state = {
      scale: 1,
      rotate: 0,
      x: 0,
      y: 0,
      isOpenSelect: false, // 开启框选
      selectArea: [0, 0, 0, 0], // 框选[x,y,w,h]
      isOverSelect: false,
      rects: [], // [{type:'face',value:'0,0,0,0'}] => [[0,0,0,0],[1,1,1,1]]
      baseXOrY: 'x',
      size: {
        width: 960,
        height: 540,
      },
      rectChange: false,
      baseRect: this.props.rects,
    };

    this.selectOptions = {
      start: [0, 0],
      end: [0, 0],
      startSelect: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.rects !== state.baseRect) {

      return { rectChange: true, baseRect: props.rects };
    }
    return null;
  }

  componentDidMount() {
    this.layoutRef.current.addEventListener('mousewheel', this.onWheel, { passive: false });
  }

  componentDidUpdate() {
    if (this.state.rectChange && this.imageSource) {
      this.setState({ rectChange: false });
      this.loadPictureRects(this.state.baseRect);
    }
  }

  loadImageSuccess = async () => {
    const { rects } = this.props;
    this.imageSource = await cloneImageNode(this.domImgRef.current);
    this.loadPictureRects(rects);
  };

  componentWillUnmount() {
    this.layoutRef.current.removeEventListener('mousewheel', this.onWheel, { passive: false });
    this.selectEventAction('removeEventListener');
    this.layoutRef = null;
    this.moveActionRef = null;
    this.domImgRef = null;
    this.imageSource = null;
    this.selectOptions = null;
  }

  /**
   * 计算结构化信息
   * @param {*} rects
   */
  async loadPictureRects(rects) {
    const rectAreas = rects || this.props.rects;
    let newRects = [];
    if (rectAreas && !this.props.size) {
      newRects = await this.computedRectScale(rectAreas);
    }
    let { size } = this.state;
    const { width, height } = this.imageSource;
    if (this.props.size) {
      if (this.props.size.width > width) {
        size.width = width;
      } else {
        size.width = this.props.size.width;
      }
      if (this.props.size.height > height) {
        size.height = height;
      } else {
        size.height = this.props.size.height;
      }
    }

    this.setState(
      {
        rects: newRects,
        size: size ? size : this.layoutRef.current.getBoundingClientRect(),
        baseXOrY: width > height ? 'x' : 'y',
      },
      async () => {
        if (this.props.size) {
          const { width, height } = this.domImgRef.current;
          this.moveActionRef.current.updatePosition({
            x: (size.width - width) / 2,
            y: (size.height - height) / 2,
          });
          if (rectAreas) {
            let rects = await this.computedRectScale(rectAreas, width, height);
            this.setState({ rects });
          }
        }
      },
    );
  }

  /**
   * 比例计算默认结构化区域
   * @update 2019年5月8日11点20分
   * 优化rect 区域边界
   */
  computedRectScale = async (rects, w, h) => {
    if (!this.layoutRef) {
      return false;
    }

    const imgWidth = this.domImgRef.current.width;
    const imgHeight = this.domImgRef.current.height;


    let width, height;
    if (w && h) {
      width = w;
      height = h;
    } else {
      width = imgWidth;
      height = imgHeight;
    }
    let scaleOptions = {
      scaleX: width / this.imageSource.width,
      scaleY: height / this.imageSource.height,
    };
    const result = rects.map(item => {
      let rect = getCaptureRect(item.value, item.type);


      rect[0] = Math.round(rect[0] * scaleOptions.scaleX);
      rect[0] < 0 && (rect[0] = 0);

      rect[2] = Math.round(rect[2] * scaleOptions.scaleX);
      rect[2] < 0 && (rect[2] = 0);

      rect[1] = Math.round(rect[1] * scaleOptions.scaleY);
      rect[1] < 0 && (rect[1] = 0);

      rect[3] = Math.round(rect[3] * scaleOptions.scaleY);
      rect[3] < 0 && (rect[3] = 0);

      rect[2] > width - rect[0] && (rect[2] = width - rect[0]);
      rect[3] > height - rect[1] && (rect[3] = height - rect[1]);

      return {
        ...item,
        rect,
      };
    });

    return result;
  };

  onWheel = e => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      this.setScale(e.deltaY > 0 ? -0.2 : 0.2);
    }
  };

  /**
   * 设置缩放比例
   */
  setScale = (changeValue, currentScale) => {
    const { x, y } = this.state;
    const currentValue = currentScale || this.state.scale;
    if (currentValue === 3 && changeValue > 0) {
      return;
    }
    if (currentValue === 1 && changeValue < 0) {
      return;
    }
    let scale = currentValue + changeValue;
    if (scale > 3) {
      scale = 3;
    }
    if (scale < 1) {
      scale = 1;
    }
    this.setState({ scale }, () => this.onDragEnd(null, { x, y }));
  };

  /**
   * 设置旋转角度
   */
  setRotate = (changeValue, currentRotate) => {
    const { x, y } = this.state;
    const currentValue = currentRotate || this.state.rotate;
    this.setState(
      {
        rotate: currentValue + changeValue,
      },
      () => this.onDragEnd(null, { x, y }),
    );
  };

  /**
   * 重置图片位置
   */
  resetPicture = event => {
    // Utils.stopPropagation(event);
    this.setState({
      scale: 1,
      rotate: 0,
    });
    this.moveActionRef.current.updatePosition({ x: 0, y: 0 });
  };
  onDragChange = ({ x, y }) => {
    this.setState({ x, y });
  };

  /**
   * 回调方法
   * 计算当前图片的边界
   */
  onDragEnd = (event, currrentPosition) => {
    const { scale, rotate } = this.state;
    if (!this.layoutRef) {
      return;
    }
    let position = computedBound(this.layoutRef.current, currrentPosition, scale, rotate);
    if (position) {
      this.moveActionRef.current.updatePosition(position);
    }
  };

  /**
   * 控制框选状态
   */
  changeSelectStatus = isOpenSelect => {
    if (isOpenSelect) {
      this.selectEventAction();
    } else {
      this.selectEventAction('removeEventListener');
    }
    this.setState({ isOpenSelect, selectArea: [0, 0, 0, 0], isOverSelect: false });
  };

  /**
   * 绑定或者解绑事件
   * @param {string} method
   */
  selectEventAction(method = 'addEventListener') {
    const dom = this.layoutRef.current;
    dom[method]('mousedown', this.openSelect, false);
    dom[method]('mousemove', this.changeSelect, false);
    dom[method]('mouseup', this.selectEnd, false);
  }

  /**
   * 开始框选，记录状态
   */
  openSelect = event => {
    const { isOpenSelect } = this.state;
    if (isOpenSelect && event.button === 0) {
      // 鼠标左键
      this.selectOptions.startSelect = true;
      this.selectOptions.start = [event.clientX, event.clientY];
    }
  };

  /**
   * move 修改框选区域
   */
  changeSelect = event => {
    if (this.selectOptions.startSelect) {
      this.selectOptions.end = [event.clientX, event.clientY];
      this.drawSelectRact();
    }
  };

  /**
   * 结束当前框选
   */
  selectEnd = event => {
    if (this.selectOptions.startSelect) {
      this.selectOptions.startSelect = false;
      this.selectOptions.end = [event.clientX, event.clientY];
      this.drawSelectRact(true);
    }
  };

  /**
   * 绘制框选矩形区域
   */
  drawSelectRact = isEnd => {
    const { left, top, width, height } = this.layoutRef.current.getBoundingClientRect();
    let [x, y, w, h] = [0, 0, 0, 0];
    //TODO 开始X > 结束X
    if (this.selectOptions.end[0] > this.selectOptions.start[0]) {
      x = this.selectOptions.start[0] - left;
      w = this.selectOptions.end[0] - this.selectOptions.start[0];
    }

    //TODO 开始X < 结束X
    if (this.selectOptions.end[0] < this.selectOptions.start[0]) {
      x = this.selectOptions.end[0] - left;
      w = this.selectOptions.start[0] - this.selectOptions.end[0];
    }

    //TODO 开始Y > 结束Y
    if (this.selectOptions.end[1] > this.selectOptions.start[1]) {
      y = this.selectOptions.start[1] - top;
      h = this.selectOptions.end[1] - this.selectOptions.start[1];
    }

    //TODO 开始Y < 结束Y
    if (this.selectOptions.end[1] < this.selectOptions.start[1]) {
      y = this.selectOptions.end[1] - top;
      h = this.selectOptions.start[1] - this.selectOptions.end[1];
    }
    if (w + x > width) {
      w = width - x;
    }
    if (h + y > height) {
      h = height - y;
    }
    this.setState({ selectArea: [x, y, w, h], isOverSelect: !!isEnd });
  };

  /**
   * 获取框选的截图
   */
  getSelectResult = async () => {
    const { selectArea } = this.state;
    return this.uploadBase64Image(this.getRectImage(selectArea, true));
  };

  uploadBase64Image = async base64 => {
    const blob = Utils.base64ToBlob(base64);
    const formData = new FormData();
    formData.append('file', blob);
    const res = await Service.face.uploadImg(formData);
    return res.data.url;
  };

  /**
   * 获取结构化的小图(base64)
   */
  getRectImage = (rect, isSelect) => {
    let { scale, rotate, x, y, size } = this.state;
    if (this.props.size) {
      const xFlag = (size.width - this.domImgRef.current.width) / 2;
      const yFlag = (size.height - this.domImgRef.current.height) / 2;
      x = x - xFlag;
      y = y - yFlag;
      if (isSelect) {
        rect[0] = rect[0] - xFlag;
        rect[1] = rect[1] - yFlag;
      }
    }
    return getRectImagePath(this.imageSource, this.domImgRef.current, rect, {
      scale,
      rotate,
      x,
      y,
    });
  };

  render() {
    const {
      className = '',
      children,
      onClickDefaultRect,
      imagePath,
      goPage,
      rectMenuVisible = false,
      showRectInfo = false,
      showDefaultRect = true,
      disabledDrag = false,
      lazyLoad,
      showRect = true,
    } = this.props;
    const {
      scale,
      rotate,
      x,
      y,
      isOpenSelect,
      selectArea,
      rects,
      isOverSelect,
      size,
      baseXOrY,
    } = this.state;
    const renderOptions = {
      setScale: this.setScale,
      setRotate: this.setRotate,
      resetPicture: this.resetPicture,
      changeSelectStatus: this.changeSelectStatus,
      getRectImage: this.getRectImage,
      uploadBase64Image: this.uploadBase64Image,
      reload: this.loadImageSuccess,
      isOpenSelect,
      selectArea,
      getSelectResult: this.getSelectResult,
      isOverSelect: isOverSelect && selectArea[2] !== 0 && selectArea[3] !== 0,
      selectOptions: this.selectOptions,
      viewDom: this.layoutRef.current,
    };
    const width = this.props.size ? size.width : '100%';
    const height = this.props.size ? size.height : '100%';
    // console.log(rects)
    return (
      <>
        <div
          className={`picture-view-layout ${className}`}
          style={{ width, height }}
          ref={this.layoutRef}
          // onContextMenu={e => Utils.customContextMenu(e)}
        >
          <MoveContent
            className="picture-move-layout"
            disabled={isOpenSelect || disabledDrag}
            position={{ x, y }}
            ref={this.moveActionRef}
            onDragChange={this.onDragChange}
            onDragEnd={this.onDragEnd}
            size={{
              width: this.props.size ? 'max-content' : '100%',
              height: this.props.size ? 'max-content' : '100%',
            }}
            lazyLoad={lazyLoad}
          >
            <div style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}>
              <img
                alt=""
                ref={this.domImgRef}
                crossOrigin="anonymous"
                style={{
                  maxWidth: baseXOrY === 'x' ? width : 'unset',
                  maxHeight: baseXOrY === 'x' ? 'unset' : height,
                }}
                draggable={false}
                src={imagePath}
                onLoad={this.loadImageSuccess}
              />
              {/* {!isOpenSelect && (
                <DefaultRects
                  onClickDefaultRect={onClickDefaultRect}
                  uploadBase64Image={this.uploadBase64Image}
                  rects={rects}
                  DOMSize={size}
                  containerDom={this.layoutRef.current}
                  getRectImage={this.getRectImage}
                  showRectInfo={showRectInfo}
                  showDefaultRect={showDefaultRect}
                  showRect={showRect}
                />
              )} */}
              <DefaultRects
                onClickDefaultRect={onClickDefaultRect}
                uploadBase64Image={this.uploadBase64Image}
                rects={rects}
                DOMSize={size}
                containerDom={this.layoutRef.current}
                getRectImage={this.getRectImage}
                showRectInfo={showRectInfo}
                showDefaultRect={showDefaultRect}
                showRect={showRect}
              />
            </div>
          </MoveContent>
          <NewRect
            isOpen={isOpenSelect}
            x={selectArea[0]}
            y={selectArea[1]}
            w={selectArea[2]}
            h={selectArea[3]}
          />
        </div>
        {isFunction(children) && children(renderOptions)}
        {rectMenuVisible && (
          <RectMenu
            visible={isOverSelect && selectArea[2] !== 0 && selectArea[3] !== 0}
            options={this.selectOptions}
            containerDom={this.layoutRef.current}
            goPage={goPage}
            getSelectResult={this.getSelectResult}
          />
        )}
      </>
    );
  }
}

export default PictureView;
