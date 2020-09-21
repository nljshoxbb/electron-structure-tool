import React from 'react'
import { Button } from 'antd'

const { Loader, BaseStore } = window
const IconFont = Loader.loadBaseComponent('IconFont')
const AuthComponent = Loader.loadBaseComponent('AuthComponent')

export default function RectSearch({ changeSelectStatus, isOpenSelect, children }) {
  const libAuth = BaseStore.menu.getInfoByNames(['faceSearch', 'bodySearch']).length > 0
  return (
    <div className="picture-search">
      {libAuth && (
        <Button onClick={() => changeSelectStatus(!isOpenSelect)}>
          <IconFont type="icon-S_View_SearchBox" />
          {isOpenSelect ? '取消框选' : '框选搜图'}
        </Button>
      )}
      {children}
    </div>
  )
}

export function RectTools({ data, type, handleLink }) {
  if (!data) {
    return null
  }
  const FaceIcon = (
    <AuthComponent actionName="faceSearch" key={'faceSearch'}>
      <Button onClick={() => handleLink('faceSearch')}>
        <IconFont type="icon-S_Bar_Face" />
        {!!data.hasFace ? '关联人脸检索' : '人脸检索'}
      </Button>
    </AuthComponent>
  )
  const FaceRecordIcon = (
    <AuthComponent actionName="faceRecord" key={'faceRecord'}>
      <Button onClick={() => handleLink('faceRecord')}>
        <IconFont type="icon-S_Bar_Face" />
        人脸记录
      </Button>
    </AuthComponent>
  )
  const BodyIcon = (
    <AuthComponent actionName="bodySearch" key={'bodySearch'}>
      <Button onClick={() => handleLink('bodySearch')}>
        <IconFont type="icon-S_Bar_Body" />
        {!!data.hasBody ? '关联人体检索' : '人体检索'}
      </Button>
    </AuthComponent>
  )
  const BodyRecordIcon = (
    <AuthComponent actionName="bodyRecord" key={'bodyRecord'}>
      <Button onClick={() => handleLink('bodyRecord')}>
        <IconFont type="icon-L_AID_Body1" />
        人体记录
      </Button>
    </AuthComponent>
  )
  const RelationMapIcon = (
    <AuthComponent actionName="relationalAtlas" key={'relationalAtlas'}>
      <Button onClick={() => handleLink('relationalAtlas')}>
        <IconFont type="icon-S_Photo_Relationship" />
        关系图谱
      </Button>
    </AuthComponent>
  )
  const verhicleIcon = (
    <AuthComponent actionName="vehicleLibrary" key={'vehicleLibrary'}>
      <Button onClick={() => handleLink('vehicleLibrary')}>
        <IconFont type="icon-S_Bar_Motor" />
        车辆检索
      </Button>
    </AuthComponent>
  )
  const nonVerhicleIcon = (
    <AuthComponent actionName="nonVehicleLibrary" key={'nonVehicleLibrary'}>
      <Button onClick={() => handleLink('nonVehicleLibrary')}>
        <IconFont type="icon-S_Bar_NonMotor" />
        车辆检索
      </Button>
    </AuthComponent>
  )
  const PersonIcon = (
    <AuthComponent actionName="personnelDetail" key={'personnelDetail'}>
      <Button onClick={() => handleLink('personnelDetail')}>
        <IconFont type="icon-S_View_FilePerson" />
        人员档案
      </Button>
    </AuthComponent>
  )

  let templete = []
  switch (type) {
    case 'face':
      if (data.hasArchives) {
        templete.push(FaceRecordIcon) // 人脸记录
        !!data.hasBody && templete.push(BodyRecordIcon) // 人体记录
        templete.push(RelationMapIcon)
      } else {
        templete.push(FaceIcon) // 人脸检索
        !!data.hasBody && templete.push(BodyIcon) // 关联人体检索
      }

      break
    case 'body':
      if (data.hasArchives) {
        templete.push(BodyRecordIcon) // 人体记录
        !!data.hasFace && templete.push(FaceRecordIcon) // 人脸记录
        templete.push(RelationMapIcon)
      } else {
        templete.push(BodyIcon) // 人体检索
        !!data.hasFace && templete.push(FaceIcon) // 关联人脸检索
      }

      break
    case 'vehicle':
      templete.push(verhicleIcon)
      break
    case 'nonVehicle':
      templete.push(nonVerhicleIcon)
      break
    default:
      // templete.push(FaceIcon);
      break
  }
  if (data.hasArchives && data.personInfoUrl) {
    templete.push(PersonIcon)
  }
  // 仅支持门禁记录 可能存在personId, 没有aid的情况
  if (type === 'accessControl' && data.personId) {
    templete.push(PersonIcon)
  }
  return templete ? templete : null
}
