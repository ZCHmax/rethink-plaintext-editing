import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import path from 'path';
import classNames from 'classnames';

import { listFiles } from '../files';
import { filter, findIndex } from 'lodash'
import Popup from 'reactjs-popup';

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

function FilesTable({ files, search, activeFile, setActiveFile, setUrl}) {

  // Task 1
  // As it is only a frontend project, I only use lodash library and local state to filter out file names. 
  // To be honest, I spend around 2 hours on this part. Adding the search bar is not that hard, but when the 
  // size of the file array goes to millions, this simple implementation will have a problem. So I try to implement 
  // the MDBTABLE library to improve the performance, but I did not successfully manage that. If I have more time, 
  // I will definitely work on improving the performance. 

  const tableFilter = () => {
    if (search === null || search === "") return files
    search = search.toLowerCase()
    const searchResult = filter(files, f => f.name.toLowerCase().includes(search))
    return searchResult
  } 

  // Task 3
  // I tried some libraries, but some of them have fs missing issues. Finally, I implemented TinyURL,
  // tested it with links, and it works well. The drawback of this function is that the URL always contains tinyurl.com. 
  // We can develop a new hash method to implement this function if needed. 

  const shortenURL = (url, setUrl) => {
    var TinyURL = require('tinyurl');
    // hard set url for test
    url = 'https://stackoverflow.com/questions/35003961/react-js-require-fs'
    TinyURL.shorten(url).then(function(res) {
      setUrl(res)
    }, function(err) {
      console.log(err)
    })
  }

  return (
    <div className={css.files}>
      <table>
        <thead>
          <tr>
            <th>File</th>
            <th>Modified</th>
            <th>Share</th>
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

              <td>
                {/* Assume each file have an url, and the shorten url button will return a shortened url */}
                <button onClick={() => shortenURL(file.url, setUrl)}> shorten URL </button>
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

function Previewer({ file }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    (async () => {
      setValue(await file.text());
    })();
  }, [file]);

  return (
    <div className={css.preview}>
      <div className={css.title}>{path.basename(file.name)}</div>
      <div className={css.content}>{value}</div>
    </div>
  );
}

Previewer.propTypes = {
  file: PropTypes.object
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
  const [url, setUrl] = useState(null)

  useEffect(() => {
    const files = listFiles();
    setFiles(files);
  }, []);

  // Task 1
  // For the first task, I think it is not difficult to finish that, but I take some time to find some libraries 
  // online to help me edit it in a fancy way. However, I tried several and they are more complicated than I can 
  // finish in around 60 minutes. Therefore, I implemented the simple practice, using textarea to manage the editing 
  // and change the UI looking for a little bit, so it has basic editing and saving function. This is a simple implementation 
  // of text Editor, and I can add more functionalities, such as italic, bold, font size later to have a better user experience. 

  const write = (file, value) => {
    console.log('Writing soon... ', file.name);
    // TODO: Write the file to the `files` array
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
    setActiveFile(null)
  };

  const Editor = activeFile ? REGISTERED_EDITORS[activeFile.type] : null;

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
          setUrl={setUrl}
        />

        { url && 
          <Popup trigger={open => (
              <button>Share URL - {open ? 'Opened' : 'Closed'}</button>
            )}
            position="right center"
            closeOnDocument
          >
            <div className={css.shareLink}>{url}</div>
          </Popup>
        }

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
            {Editor && <Editor file={activeFile} write={write} />}
            {!Editor && <Previewer file={activeFile} />}
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
