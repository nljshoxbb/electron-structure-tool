import React from "react";
import {Tooltip} from 'antd'
const { Loader } = window;
const IconFont = Loader.loadBaseComponent("IconFont");
const AuthComponent = Loader.loadBusinessComponent("AuthComponent");
const FullScreen = Loader.loadBusinessComponent("FullScreen");

class PictureTools extends React.Component {
  render() {
    const { scale, imgDownload, setScale, setRotate, containerEle, resetPicture ,fullScreenChange} = this.props;
    return (
      <>
        <div className="picture-tools">
          <Tooltip placement="left" title="复位">
            <div onClick={resetPicture}>
              <IconFont type="icon-S_View_RotateMiddle" />
            </div>
          </Tooltip>
          <Tooltip placement="left" title="放大">
            <div onClick={() => setScale(0.2)} className={scale === 3 ? "disabled" : ""}>
              <IconFont type="icon-S_View_ZoomIn" />
            </div>
          </Tooltip>
          <Tooltip placement="left" title="缩小">
            <div onClick={() => setScale(-0.2)} className={scale === 1 ? "disabled" : ""}>
              <IconFont type="icon-S_View_ZoomOut" />
            </div>
          </Tooltip>
          <Tooltip placement="left" title="向左">
            <div onClick={() => setRotate(-90)}>
              <IconFont type="icon-S_View_RotateLeft" />
            </div>
          </Tooltip>
          <Tooltip placement="left" title="向右">
            <div onClick={() => setRotate(90)}>
              <IconFont type="icon-S_View_RotateRight" />
            </div>
          </Tooltip>
        </div>
        <div className="picture-actions">
          <AuthComponent actionName="imageDownload">
            <div onClick={imgDownload}>
              <IconFont type="icon-S_Edit_LoadDown" />
            </div>
          </AuthComponent>
          <div>
            <FullScreen className="footer_window" getContainer={() => containerEle} fullScreenChange={fullScreenChange}>
              {isFullscreen => (
                <IconFont title={!isFullscreen ? "全屏" : "退出全屏"} type={!isFullscreen ? "icon-S_View_ScreenViewFull" : "icon-S_View_ScreenViewExit"} theme="outlined" />
              )}
            </FullScreen>
          </div>
        </div>
      </>
    );
  }
}
export default PictureTools