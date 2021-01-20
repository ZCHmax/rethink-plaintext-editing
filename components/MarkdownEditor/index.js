import React, { useState, useEffect } from 'react';
import path from 'path';
import PropTypes from 'prop-types';

import css from './style.css';

function MarkdownEditor({ file, write }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  const handleChange = value => {
    setValue(value)
  }

  return (
    <div className={css.editor}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <textarea
        type="textarea" 
        defaultValue={value} 
        onChange={e => handleChange(e.target.value)}>
      </textarea>
      <button onClick={() => write(file, value)}>Save Change</button>
    </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
