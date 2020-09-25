import React from 'react';
import RectInfo from './RectInfo';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

// 默认框选
class DefaultRects extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      currentItem: {},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps.rects.length > 0 &&
      !isEmpty(nextProps.rects[0]) &&
      isEmpty(prevState.currentItem)
    ) {
      return {
        currentItem: nextProps.rects[0],
      };
    }

    return null;
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (!isEmpty(this.state.currentItem)) {
      this.props.onClickDefaultRect(this.state.currentItem);
    }
  }

  rectClick = (e, item) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const { onClickDefaultRect, getRectImage } = this.props;
    const rectUrl = getRectImage(item.rect);
    this.setState({ currentItem: item });
    if (onClickDefaultRect) onClickDefaultRect(item, rectUrl);
  };

  // 计算结构化框层级
  computedZIndex = rects => {
    const areas = rects.map(v => {
      const width = v.rect[2];
      const height = v.rect[3];
      v.area = width * height;
      return v;
    });
    return areas.sort((a, b) => b.area - a.area);
  };

  render() {
    const {
      rects = [],
      containerDom,
      showRectInfo = false,
      showDefaultRect = true,
      DOMSize,
    } = this.props;
    const { currentItem } = this.state;
    let temp = rects;
    // console.log(rects)
    // if (showDefaultRect) {
    //   temp = rects.filter(v => v.default);
    // }
    temp = this.computedZIndex(temp);
    return temp.map((v, k) => {
      return (
        <div className={`rect-item-wrapper rect-item-${v.type}-wrapper `} key={k}>
          <div
            className={`rect-item ${currentItem.value === v.value ? 'rect-item-active' : ''}`}
            onClick={e => this.rectClick(e, v)}
            style={{
              left: v.rect[0],
              top: v.rect[1],
              width: v.rect[2],
              height: v.rect[3],
              zIndex: k,
            }}
          >
            <div className="border-top-decorator" />
            <div className="border-bottom-decorator" />
          </div>
          {showRectInfo && v.tags && !!v.tags.length && (
            <RectInfo DOMSize={DOMSize} item={v} containerDom={containerDom} />
          )}
        </div>
      );
    });
  }
}

export default DefaultRects;
