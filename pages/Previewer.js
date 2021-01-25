import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';
import ReactMarkdown from 'react-markdown'

import css from './style.module.css';
import { Toolbar , IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';

function Previewer({ file, setActiveFile, setEdit, Editor }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (      
    <div className={css.preview}>
      {Editor && 
        <>
          <Toolbar className={css.toolbar} variant="dense">      
            <IconButton className={css.iconButton} onClick={() => setEdit(true)}><EditIcon /></IconButton>
            <IconButton onClick={() => setActiveFile(null)}><CloseIcon/></IconButton>
          </Toolbar>
          <div className={css.title}>{path.basename(file.name)}</div>
          {Editor.name === 'MarkdownEditor' && 
            <ReactMarkdown className={css.content}>{value}</ReactMarkdown>
          }
          {Editor.name !== 'MarkdownEditor' && 
            <div className={css.content}>{value}</div>
          }
        </>
      }
      
      {!Editor &&
        <>
          <div className={css.title}>{path.basename(file.name)}</div>
          <div className={css.content}>{value}</div>
        </>
      }
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
};

export default Previewer;
