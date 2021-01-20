import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';

import css from './style.css';

function PlaintextEditor({ file, write }) {
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
      </textarea >
      <button onClick={() => write(file, value)}>Save Change</button>
    </div>
  );
}

PlaintextEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default PlaintextEditor;
