import Editor, { monaco } from '@monaco-editor/react';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'antd';
import { useSize, useResponsive } from '@umijs/hooks';
import MonokaiJson from 'monaco-themes/themes/Monokai.json';
import { remote } from 'electron';
import path from 'path';
import StructResult from './StructResult/StructResult';
import defaultResultJson from './defaultJson.json';

// https://github.com/microsoft/monaco-editor-samples/blob/master/electron-amd-nodeIntegration/electron-index.html
function uriFromPath(_path) {
  let pathName = path.resolve(_path).replace(/\\/g, '/');

  if (pathName.length > 0 && pathName.charAt(0) !== '/') {
    pathName = `/${pathName}`;
  }
  return encodeURI(`file://${pathName}`);
}

// var remote = require('electron').remote,
//   arg = remote.getGlobal('sharedObject').prop1;
// console.log(arg);

// let buildArgs;
// if (remote.getGlobal('sharedObject')) {
//   buildArgs = remote.getGlobal('sharedObject').prop1;
// }

// if (buildArgs && buildArgs[buildArgs.length - 1].indexOf('dev') !== -1) {
//   monaco.config({
//     urls: {
//       monacoLoader: uriFromPath(
//         path.join(__dirname, '../node_modules/monaco-editor/min/vs/loader.js')
//       ),
//       monacoBase: uriFromPath(
//         path.join(__dirname, '../node_modules/monaco-editor/min/vs')
//       ),
//     },
//   });
// }

export default function MonacoEditorComponent() {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [result, setResult] = useState({});
  const getEditorValue = useRef(null);
  const editor = useRef(null);
  const [sizeState, ref] = useSize<HTMLDivElement>(
    document.getElementById('root')
  );

  useResponsive();

  function handleEditorDidMount(getEditorValueFn, editorInstance) {
    setIsEditorReady(true);
    getEditorValue.current = getEditorValueFn;
    editor.current = editorInstance;
    console.log(editorInstance);
  }

  function handleShowValue() {
    if (getEditorValue.current()) {
      editor.current
        .getAction('editor.action.formatDocument')
        .run()
        .then(() => console.log('finished'));
      try {
        setResult(JSON.parse(getEditorValue.current()));
      } catch (error) {
        setResult({});
      }
    } else {
      setResult({});
    }
  }

  useEffect(() => {
    if (isEditorReady) {
      setTimeout(function () {
        editor.current.getAction('editor.action.formatDocument').run();
      }, 300);
      // import('monaco-themes/themes/Monokai.json').then((data) => {
      //   console.log(data, editor.current.defineTheme);
      //   editor.current.defineTheme('monokai', data);
      // });
    }
  }, [isEditorReady]);

  const containerHeight = sizeState.height - 80;

  return (
    <div style={{ height: containerHeight, width: '100%' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ flex: 1 }}>
          <Editor
            height="100%"
            width="100%"
            language="JSON"
            theme="dark"
            value={JSON.stringify(defaultResultJson)}
            editorDidMount={handleEditorDidMount}
            options={{ formatOnPaste: true }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <StructResult data={result} layout={{ height: containerHeight }} />
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: 16 }}>
        <Button
          onClick={handleShowValue}
          disabled={!isEditorReady}
          type="primary"
        >
          数据可视化
        </Button>
      </div>
    </div>
  );
}
