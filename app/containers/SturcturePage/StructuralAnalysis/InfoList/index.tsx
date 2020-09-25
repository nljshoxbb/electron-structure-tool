import React, { ReactElement } from 'react';
import { Row, Col } from 'antd';
// import getUid from '@antelopecloud/utils/lib/string/getUid';
import { convertArrayByColumn } from '../../../../utils/utils';

import './index.less';

interface DataItem {
  label: string;
  value: string | number | ReactElement;
}

export interface InfoListProps {
  data: DataItem[];
  total?: number;
  type?: 'vertical' | 'horizontal';
  autoCenter?: boolean;
}

const InfoList: React.FC<InfoListProps> = ({
  data,
  total,
  type = 'horizontal',
  autoCenter,
}) => {
  let res: any = [];

  if (type === 'horizontal') {
    res = convertArrayByColumn(data, 2);
  } else if (type === 'vertical') {
    res = data;
  }

  let content = (
    <div>
      {type === 'vertical' &&
        res.map((item: DataItem) => (
          <Row
            className="info-list-row-item info-list-item"
            key={String(item.label)}
          >
            <Col
              // flex={1}
              span={12}
              className="info-list-item__label"
              style={{ fontWeight: 500, width: 200 }}
            >
              {item.label}
            </Col>
            <Col span={12} className="info-list-item__value">
              {React.isValidElement(item.value) ? item.value : item.value}
            </Col>
          </Row>
        ))}
    </div>
  );

  if (autoCenter) {
    content = (
      <div style={{ textAlign: 'center' }}>
        <div
          style={{ display: 'inline-block', minWidth: 500, textAlign: 'left' }}
        >
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="info-list">
      {total !== undefined && (
        <div className="info-list-total info-list-item">
          <span className="info-list-item__label">合计</span>
          <span className="info-list-item__value">{total}</span>
        </div>
      )}
      {content}
    </div>
  );
};

export default InfoList;
