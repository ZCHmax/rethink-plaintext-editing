import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';

import { listFiles } from '../files';
import { filter, findIndex } from 'lodash'
import Previewer from './Previewer'

// Used below, these need to be registered
import MarkdownEditor from '../components/MarkdownEditor';
import PlaintextEditor from '../components/PlaintextEditor';

import IconPlaintextSVG from '../public/icon-plaintext.svg';
import IconMarkdownSVG from '../public/icon-markdown.svg';
import IconJavaScriptSVG from '../public/icon-javascript.svg';
import IconJSONSVG from '../public/icon-json.svg';

import css from './style.module.css';

const TYPE_TO_ICON = {
  'text/plain': IconPlaintextSVG,
  'text/markdown': IconMarkdownSVG,
  'text/javascript': IconJavaScriptSVG,
  'application/json': IconJSONSVG
};

function FilesTable({ files, search, activeFile, setActiveFile }) {
  const tableFilter = () => {
    if (search === null || search === "") return files
    search = search.toLowerCase()
    const searchResult = filter(files, f => f.name.toLowerCase().includes(search))
    return searchResult
  } 

  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
          </tr>
        </thead>
        <tbody>
          {tableFilter().map(file => (
            <tr
              key={file.name}
              className={classNames(
                css.row,
                activeFile && activeFile.name === file.name ? css.active : ''
              )}
              onClick={() => setActiveFile(file)}
            >
              <td className={css.file}>
                <div
                  className={css.icon}
                  dangerouslySetInnerHTML={{
                    __html: TYPE_TO_ICON[file.type]
                  }}
                ></div>
                {path.basename(file.name)}
              </td>

              <td>
                {new Date(file.lastModified).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

FilesTable.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  activeFile: PropTypes.object,
  setActiveFile: PropTypes.func,
  setUrl: PropTypes.func,
};

// Uncomment keys to register editors for media types
const REGISTERED_EDITORS = {
  "text/plain": PlaintextEditor,
  "text/markdown": MarkdownEditor,
};

function PlaintextFilesChallenge() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState(null);
  const [activeFile, setActiveFile] = useState(null);
  const [edit, setEdit] = useState(false);
  let Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

  useEffect(() => {
    const files = listFiles();
    setFiles(files);
    Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null
  }, []);

  const write = (file, value) => {
    const fileIndex = findIndex(files, ['name', file.name])
    files[fileIndex] = new File(
      [value],
      file.name,
      {
        type: 'text/plain',
        lastModified: new Date()
      }
    );
    setFiles(files)
    setActiveFile(files[fileIndex])
    setEdit(false)
  };

  return (
    <div className={css.page}>
      <Head>
        <title>Rethink Engineering Challenge</title>
      </Head>
      <aside>
        <header>
          <div className={css.tagline}>Rethink Engineering Challenge</div>
          <h1>Fun With Plaintext</h1>
          <div className={css.description}>
            Let{"'"}s explore files in JavaScript. What could be more fun than
            rendering and editing plaintext? Not much, as it turns out.
          </div>
        </header>
        
        <input 
          type="text"
          placeholder="Enter file name here..." 
          onChange={e => setSearch(e.target.value)} 
        />
        <FilesTable
          files={files}
          search={search}
          activeFile={activeFile}
          setActiveFile={setActiveFile}
        />
        <div style={{ flex: 1 }}></div>

        <footer>
          <div className={css.link}>
            <a href="https://v3.rethink.software/jobs">Rethink Software</a>
            &nbsp;—&nbsp;Frontend Engineering Challenge
          </div>
          <div className={css.link}>
            Questions? Feedback? Email us at jobs@rethink.software
          </div>
        </footer>
      </aside>

      <main className={css.editorWindow}>
        {activeFile && (
          <>
            {Editor && 
              <>
                {edit && <Editor file={activeFile} write={write} setEdit={setEdit} />}
                {!edit && <Previewer file={activeFile} setActiveFile={setActiveFile} setEdit={setEdit} Editor={Editor}/>}
              </>
            }
            {!Editor && <Previewer file={activeFile} setActiveFile={setActiveFile} setEdit={setEdit} />}
          </>
        )}

        {!activeFile && (
          <div className={css.empty}>Select a file to view or edit</div>
        )}
      </main>
    </div>
  );
}

export default PlaintextFilesChallenge;
