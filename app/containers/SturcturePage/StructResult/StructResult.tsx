import React, { useState } from 'react';
import { Skeleton, Empty } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';

import PictureView from './Picture/PictureView';
import InfoList from './InfoList';
import { StructureKeyMapper, TIME_FORMAT_STRING } from './Picture/utils/const';
import './StructResult.less';
import { useSize } from '@umijs/hooks';

export interface StructResultProps {
  data: any;
  layout: any;
}

const colorMapper = {
  face: '#FF5F57',
  facebg: 'rgba(255,95,87,0.10)',
  body: '#FFBB22',
  bodybg: 'rgba(255,187,34,0.10)',
  vehicle: '#44AAFF',
  vehiclebg: 'rgba(68,170,255,0.10)',
  nonVehicle: '#50E9B2',
  nonVehiclebg: 'rgba(80,233,178,0.10)',
  chengguans: '#FF5F57',
  chengguansbg: 'rgba(255,95,87,0.10)',
  vehiclesPassengers: '#FFBB22',
  vehiclesPassengersbg: 'rgba(255,187,34, 0.10)',
  nonvehiclesPassengers: '#FFBB22',
  nonvehiclesPassengersbg: 'rgba(255,187,34,0.10)',
};

const StructResult: React.FC<StructResultProps> = ({ layout, data }) => {
  let basicList: any[] = [];
  const [currentCanvasItem, setCurrentCanvasItem] = useState<any>({});

  const [sizeState, ref] = useSize<HTMLDivElement>();

  if (!isEmpty(currentCanvasItem)) {
    basicList.push({
      label: '结构体类型',
      value: (
        <div>
          <span
            style={{
              padding: '4px 8px',
              color: colorMapper[currentCanvasItem.type],
              backgroundColor: colorMapper[`${currentCanvasItem.type}bg`],
              border: `1px solid ${colorMapper[currentCanvasItem.type]}`,
              marginRight: 8,
            }}
          >
            {StructureKeyMapper[currentCanvasItem.type]}{' '}
          </span>
          {`置信度 < ${currentCanvasItem.confidence}`}
        </div>
      ),
    });

    if (currentCanvasItem.info) {
      basicList = [...basicList, ...currentCanvasItem.info];
    }
  }

  const structedResult = data.structed_result
    ? data.structed_result.structed_result
    : {};

  let infoList: any[] = [];

  if (!isEmpty(data.structed_result)) {
    infoList = [
      {
        label: '抓拍时间：',
        value: data.structed_result.event_time
          ? moment(data.structed_result.event_time * 1000).format(
              TIME_FORMAT_STRING
            )
          : '-',
      },
    ];
  }

  return (
    <div className="structResult" style={{ height: '100%' }}>
      {isEmpty(structedResult) || !structedResult.task ? (
        <Empty style={{ paddingTop: 100 }} description="暂无数据" />
      ) : (
        <>
          <div style={{ height: 'auto', width: '100%' }} ref={ref}>
            {structedResult && !isEmpty(structedResult) && structedResult.task && (
              <PictureView
                imagePath={data.structed_result.url}
                data={structedResult.task[0]}
                rects={[]}
                onClick={(val) => {
                  setCurrentCanvasItem(val);
                }}
              />
            )}
          </div>

          <div
            id="taskinfoDetail"
            style={{
              padding: 16,
              height: layout.height - sizeState.height,
              overflowY: 'auto',
            }}
          >
            <div className="structResult-detail__title">结构化信息</div>
            <InfoList data={basicList} type="vertical" />
            <div className="structResult-detail__title">图片信息</div>
            <div style={{ minHeight: 300 }}>
              <InfoList data={infoList} type="vertical" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StructResult;
