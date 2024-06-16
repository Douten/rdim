import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState, useMemo, useEffect } from "react";

import StackList from './components/StackList';
import StackSelector from './components/StackSelector';
import bucket from './hooks/bucket';

function App() {

  const [stackFiles, setStackFiles] = useState<File[] | null>(null);
  const [stackList, setStackList] = useState<string[]>([]);
  const [stackName, setStackName] = useState<string>('');
  const { uploadFile } = bucket();


  const [seconds, setSeconds] = useState(0);
  const [secondLimit, setSecondLimit] = useState(0);
  const [intervalId, setIntervalId] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files?.length ? Array.from(e.target.files) : null;
    setStackFiles(selectedFiles);
    console.log('stackFiles', stackFiles);
  };
    
  const uploadFilesToStack = () => {
    if (!stackFiles) {
      return;
    }

    stackFiles.forEach((file) => {
      uploadFile(file, stackName);
    });
  }


  function EmptyState() {

    if (stackList.length > 0) {
      return null;
    }

    let text = "No stack found";

    if (stackList.length === 0 && !stackName) {
      text = "Please enter a stack name";
    } else if (!stackList.length && stackName) {
      text = "No Images found in stack. Add some below.";
    }

    return <div className="text-xl font-medium">{text}</div>;
  }

  function clearStackList() {
    setStackList([]);
  }

  function addImagesToStack(images: string[]) {
    setStackList([...stackList, ...images]);
  }

  return (
    <div className="App">
      <div>
        <StackSelector stackList={stackList} addImagesToStack={addImagesToStack}  />
        <EmptyState />
        <StackList
          stackList={stackList}
          clearStackList={clearStackList}
        />
        <div>
          { (stackName && stackList.length) && (
            <div>
              <input type="file" multiple onChange={handleFileChange} />
              <button onClick={uploadFilesToStack}>Upload</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
