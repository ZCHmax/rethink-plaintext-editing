import React, { useState, useEffect, useRef } from 'react';
import path from 'path';
import PropTypes from 'prop-types';

import css from '../style.css';
import { Toolbar , IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

function MarkdownEditor({ file, write, setEdit }) {
  const [value, setValue] = useState(null);

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
      <Toolbar className={css.toolbar} variant="dense">      
        <IconButton onClick={() => write(file, value)} className={css.iconButton}><SaveIcon /></IconButton>
        <IconButton onClick={() => setEdit(false)}><CloseIcon/></IconButton>
      </Toolbar>
      <textarea
        value={value} 
        onChange={e => handleChange(e.target.value)}>
      </textarea>
    </div>
  );
}

MarkdownEditor.propTypes = {
  file: PropTypes.object,
  write: PropTypes.func
};

export default MarkdownEditor;
