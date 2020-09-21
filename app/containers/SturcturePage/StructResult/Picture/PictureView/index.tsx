import React from 'react';
import PictureView from '../Base';
import { formatTagLabel } from './tag';
import './index.less';

export interface PictureCanvasProps {
  onClick: (item: any) => void;
  imagePath: string;
  data: any;
  rects: any;
}

// @Decorator.withSafeState
class PictureCanvas extends React.Component<PictureCanvasProps> {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
    this.timer = null;
    this.state = {
      rects: props.rects || [],
      showDefaultRect: true,
    };
  }

  componentDidMount() {
    const { data } = this.props;
    let rects = formatTagLabel(data);
    const { type, value } = this.props.rects[0] || {};
    const rectItem = rects.filter(v => v.type === type).find(v => v.value === value);
    if (rectItem) {
      rectItem.default = true;
    }
    this.setSafeState({ rects });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.domRef = null;
    this.timer = null;
  }

  setSafeState = state => {
    this.setState(state);
  };

  // 默认结构化框点击事件
  onClickDefaultRect = (item, rectUrl) => {
    const { onClick } = this.props;
    if (onClick) onClick(item);
  };

  render() {
    const {
      className = '',
      imagePath,
      rectMenuVisible = true,
      showRectInfo = true,
      ...searchOptions
    } = this.props;
    const { rects, showDefaultRect } = this.state;
    return (
      <div className={`picture-canvas-layout ${className}`} ref={this.domRef}>
        <PictureView
          imagePath={imagePath}
          rects={rects}
          onClickDefaultRect={this.onClickDefaultRect}
          goPage={this.goPage}
          rectMenuVisible={rectMenuVisible}
          showRectInfo={showRectInfo}
          showDefaultRect={showDefaultRect}
        ></PictureView>
      </div>
    );
  }
}

export default PictureCanvas;
