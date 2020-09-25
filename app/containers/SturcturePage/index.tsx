import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { useSize, useResponsive } from '@umijs/hooks';
import CodeMirror, { Editor } from 'codemirror';
import StructResult from './StructResult/StructResult';
import StructuralAnalysis from './StructuralAnalysis';

import defaultResultJson from './defaultJson.json';

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

export default function MonacoEditorComponent() {
  const [result, setResult] = useState({});
  const editor = useRef<Editor>({});
  const [sizeState] = useSize<HTMLDivElement>(document.getElementById('root'));

  useResponsive();

  function handleShowValue() {
    if (editor.current?.getValue()) {
      try {
        setResult(JSON.parse(editor.current?.getValue()));
      } catch (error) {
        setResult({});
      }
    } else {
      setResult({});
    }
  }

  function getSelectedRange() {
    return {
      from: editor.current.getCursor(true),
      to: editor.current.getCursor(false),
    };
  }

  function autoFormatSelection() {
    const range = getSelectedRange();
    editor.current.autoFormatRange(range.from, range.to);
  }

  useEffect(() => {
    const editContent = document.getElementById(
      'codemirror'
    ) as HTMLTextAreaElement;

    editor.current = CodeMirror.fromTextArea(editContent, {
      scrollbarStyle: 'simple',
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

    editor.current.setValue(JSON.stringify(defaultResultJson));

    CodeMirror.commands.selectAll(editor.current);
    autoFormatSelection();
    editor.current.on('change', function change(val) {});
  }, []);

  const containerHeight = sizeState.height - 80;
  console.log(result);
  return (
    <div style={{ height: containerHeight, width: '100%' }}>
      <div style={{ height: '100%' }}>
        <div style={{ width: '50%', height: '100%', float: 'left' }}>
          <textarea id="codemirror" />
        </div>
        <div style={{ width: '50%', height: '100%', float: 'left' }}>
          {/* <StructResult data={result} layout={{ height: containerHeight }} /> */}
          <StructuralAnalysis
            data={result}
            layout={{ height: containerHeight }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: 16 }}>
        <Button onClick={handleShowValue} type="primary">
          数据可视化
        </Button>
      </div>
    </div>
  );
}
