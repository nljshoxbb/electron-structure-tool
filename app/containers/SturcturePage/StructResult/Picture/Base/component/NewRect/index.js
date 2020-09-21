import React from 'react';

// 画框容器
class NewRect extends React.Component {
  render() {
    const { x, y, w, h, isOpen } = this.props;
    if (!isOpen || w === 0 || h === 0) {
      return null;
    }
    return <div className="select-rect-layout" style={{ width: w, height: h, left: x, top: y }} />;
  }
}

export default NewRect;