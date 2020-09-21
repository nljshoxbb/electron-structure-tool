import React from 'react'
import RectSearch, { RectTools } from './RectSearch'
import { Switch } from 'antd'

class PictureSearch extends React.Component {
  setVisible = showDefaultRect => {
    const { changeSelectStatus, changeRectStatus } = this.props
    if (showDefaultRect) {
      // 取消识图
      changeSelectStatus(false)
    }
    changeRectStatus(showDefaultRect)
  }
  render() {
    const { isOpenSelect, changeSelectStatus, rectBtn = true, showDefaultRect, hasAllRect, data, type, handleLink } = this.props
    return (
      <RectSearch changeSelectStatus={changeSelectStatus} isOpenSelect={isOpenSelect}>
        {rectBtn && <RectTools data={data} type={type} handleLink={handleLink} />}
        {rectBtn && hasAllRect && (
          <span className="rect-switch">
            <Switch className="" checked={!showDefaultRect} disabled={isOpenSelect} size="small" onChange={() => this.setVisible(!showDefaultRect)} />
            <span>{showDefaultRect ? '智能识图' : '取消识图'}</span>
          </span>
        )}
      </RectSearch>
    )
  }
}
export default PictureSearch
