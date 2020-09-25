import React, { useEffect, useRef, useState } from 'react';
import { Empty } from 'antd';
import { isEmpty } from 'lodash';
import CodeMirror, { Editor } from 'codemirror';
import { useSize } from '@umijs/hooks';

import PictureView from './Picture/PictureView';
import InfoList from './InfoList';
import { StructureKeyMapper } from './Picture/utils/const';

import './formatting';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/dialog/dialog';

import './index.less';

export interface StructuralAnalysisProps {
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
  plate: '#44AAFF',
  platebg: 'rgba(68,170,255,0.10)',
};

const StructuralAnalysis: React.FC<StructuralAnalysisProps> = ({
  data,
  layout,
}) => {
  let basicList: any[] = [];
  const [tab, setTab] = useState('1');
  const editor = useRef<Editor>(null);
  const [sizeState, ref] = useSize<HTMLDivElement>();

  const [currentCanvasItem, setCurrentCanvasItem] = useState<any>({});
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

  function getSelectedRange() {
    if (editor.current) {
      return {
        from: editor.current.getCursor(true),
        to: editor.current.getCursor(false),
      };
    }
    return {};
  }

  function autoFormatSelection() {
    const range = getSelectedRange();

    if (editor.current) {
      editor.current.autoFormatRange(range.from, range.to);
    }
  }

  function setCodeWithAutoFormat(val) {
    if (editor.current) {
      editor.current.setValue(JSON.stringify(val));
      CodeMirror.commands.selectAll(editor.current);
      autoFormatSelection();
      editor.current.scrollIntoView({ line: 0, ch: 0 });
    }
  }

  useEffect(() => {
    const editContent = document.getElementById(
      'codemirror'
    ) as HTMLTextAreaElement;
    if (tab === '2') {
      editor.current = CodeMirror.fromTextArea(editContent, {
        theme: 'monokai',
        mode: { name: 'javascript', json: true },
        lineNumbers: true,
        extraKeys: {
          'Alt-F': 'findPersistent',
          'Ctrl-F': autoFormatSelection,
        },
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        value: '123',
      });
      editor.current.setSize('100%', '100%');

      setCodeWithAutoFormat(data);
    }

    if (tab === '1') {
      if (editor.current) {
        editor.current.getWrapperElement().remove();
      }
    }
  }, [tab]);

  useEffect(() => {
    if (isEmpty(data)) {
      setTab('1');
      setCurrentCanvasItem({});
    }

    if (editor.current) {
      setCodeWithAutoFormat(data);
    }
  }, [data]);

  return (
    <div
      className="structural-analysis"
      style={{ height: '100%', marginTop: 16 }}
    >
      {isEmpty(data) ? (
        <Empty
          style={{ paddingTop: 100, paddingBottom: 100 }}
          description="暂无数据"
        />
      ) : (
        <div>
          <div style={{ height: 'auto', width: '100%' }} ref={ref}>
            {data && !isEmpty(data) ? (
              <PictureView
                imagePath={data.srcid}
                data={data}
                rects={[]}
                onClick={(val) => {
                  console.log(val);
                  setCurrentCanvasItem(val);
                }}
              />
            ) : (
              <img src={data.srcid} alt="" style={{ maxWidth: '100%' }} />
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
            <div className="structural-analysis-detail__title">结构化信息</div>
            <InfoList data={basicList} type="vertical" />
          </div>
        </div>
      )}
    </div>
  );
};

export default StructuralAnalysis;
