import React from 'react';
import './index.less';

// const { Loader, Decorator, BaseStore } = window;
// const IconFont = Loader.loadBaseComponent("IconFont");

// @Decorator.shouldComponentUpdate
class RectMenu extends React.Component {
  constructor() {
    super();
    this.menus = [];
    this.menuSize = {};
    // this.computedMenuSize();
  }

  computedMenuSize() {
    this.menus = [
      { name: 'faceSearch', text: '搜人脸', icon: 'icon-S_Bar_Face' },
      { name: 'bodySearch', text: '搜人体', icon: 'icon-S_Bar_Body' },
      { name: 'vehicleLibrary', text: '搜机动车', icon: 'icon-S_Bar_Motor' },
      { name: 'nonVehicleLibrary', text: '搜非机动车', icon: 'icon-S_Bar_NonMotor' },
    ].filter(v => !!BaseStore.menu.getInfoByName(v.name));
    this.menuSize = {
      w: 105,
      h: this.menus.length * 32,
    };
  }

  computedMenuPosition() {
    const { containerDom, options } = this.props;
    const domRect = containerDom.getBoundingClientRect();
    let width = domRect.width;
    let height = domRect.height;
    let x, y;
    if (options.start[0] > options.end[0]) {
      x = options.end[0] - this.menuSize.w - domRect.x;
      y = options.end[1] - this.menuSize.h - domRect.y;
      if (x < 0) {
        x = 0;
      }
      if (y < 0) {
        y = 0;
      }
    } else {
      x = options.end[0] - domRect.x;
      y = options.end[1] - domRect.y;
      if (width - x < this.menuSize.w) {
        x = width - this.menuSize.w;
      }
      if (height - y < this.menuSize.h) {
        y = height - this.menuSize.h;
      }
    }

    return {
      x,
      y,
    };
  }

  jumpPage = async name => {
    const { goPage, getSelectResult } = this.props;
    let imageUrl = await getSelectResult();
    goPage({ name, imageUrl, isSelect: true });
  };

  render() {
    const { visible } = this.props;
    if (!visible) {
      return null;
    }
    const menuPosition = this.computedMenuPosition();
    return (
      <div className="menu-action-group" style={{ left: menuPosition.x, top: menuPosition.y }}>
        {this.menus.map(v => (
          <div className="menu-action-item" key={v.name} onClick={() => this.jumpPage(v.name)}>
            {/* <IconFont type={v.icon} /> */}
            {v.text}
          </div>
        ))}
      </div>
    );
  }
}

export default RectMenu;
