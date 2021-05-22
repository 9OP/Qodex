/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';

export default function Editor(props: {handler: (cnt: string) => void}): JSX.Element {
  const { handler } = props;
  const editor = useRef(null);
  const [content, setContent] = useState('');

  const config = {
    buttons: 'source, |, bold, italic, strikethrough, underline, eraser, |, ul, ol, link, |, undo, redo, hr',
    toolbarAdaptive: false,
    textIcons: false,
    readonly: false,
    toolbar: true,
    spellcheck: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
  };

  return (
    <div>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onBlur={(newContent: string): void => {
          setContent(newContent);
          handler(newContent);
        }}
        onChange={(newContent: string): void => {}}
      />
    </div>
  );
}
