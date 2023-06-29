import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import 'node_modules/react-quill/dist/quill.snow.css';
import { ThemeContext } from 'src/context/ThemeContext';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ color: [] }, { background: [] }],
    [
      { list: 'ordered' },
      { list: 'bullet' },
      { indent: '-1' },
      { indent: '+1' },
    ],
    ['link', 'image', 'video'],
    ['clean'],
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  },
};
/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'color',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video',
];

export function Editor({ changeText }) {
  const [value, setValue] = useState('');
  const { mobile } = useContext(ThemeContext);

  useEffect(() => {
    changeText(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <QuillNoSSRWrapper
      style={{
        minHeight: '400px !important',
        maxWidth: mobile ? '92vw' : 880,
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      }}
      modules={modules}
      formats={formats}
      theme="snow"
      onChange={setValue}
      value={value}
    />
  );
}
