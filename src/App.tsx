import React from 'react';
import logo from './logo.svg';
import AWS from 'aws-sdk';
import './App.css';
import { useState, useMemo, useEffect } from "react";
import { Timer } from 'aws-sdk/clients/ioteventsdata';

function App() {

  console.log('REACT_APP_ACESS_KEY_ID', process.env.REACT_APP_ACESS_KEY_ID);
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
  const REGION = process.env.REACT_APP_REGION;
  const S3_URL = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/`;
  const [stackFiles, setStackFiles] = useState<File[] | null>(null);
  const [stackList, setStackList] = useState<string[]>([]);
  const [stackName, setStackName] = useState<string>('');
  const [currentStackIndex, setCurrentStackIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState(0);
  const [secondLimit, setSecondLimit] = useState(0);
  const [intervalId, setIntervalId] = useState<any>(null);


  const AWSconn = useMemo(() => {
    return AWS.config.update({
      accessKeyId: process.env.REACT_APP_ACESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => nextImage(stackList), 5000);
    return () => {
      // if the data updates prematurely 
      // we cancel the timeout and start a new one
      clearTimeout(interval);
    }
  }, [currentStackIndex, stackList]);

  function nextImage(stackList: string[]) {
    console.log({ currentStackIndex, stackList })
    // setCurrentStackIndex((currentStackIndex + 1) % (stackList.length || 1));

    let newIndex = currentStackIndex;
    // avoid doing same index twice
    while (newIndex === currentStackIndex) {
      newIndex = Math.floor(Math.random() * stackList.length);
    }
    setCurrentStackIndex(newIndex);
  }

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
      uploadFile(file);
    });
  }

  const uploadFile = async (file: any) => {
    if (!file || !stackName) {
      return;
    }

    const params = {
      Bucket: `${S3_BUCKET}`,
      Key: `${stackName}-${file.name}`,
      Body: file,
    };

    const s3 = new AWS.S3({
      params: { 
        Bucket: S3_BUCKET
      },
      region: REGION,
    });

    try {
      var upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          console.log(
            `Uploading ${evt.loaded} ${evt.total} %`
          );
        })
        .promise();

      await upload.then((result) => {
        console.log(result.$response.error);
        alert("File uploaded successfully.");
      });
    }
    catch (err) {
      console.log(err);
    }
  };

  const getStack = async () => {
    if (!stackName) {
      return;
    }

    const s3 = new AWS.S3({
      params: { 
        Bucket: S3_BUCKET,
        Prefix: stackName
      },
      region: REGION,
    });

    s3.listObjectsV2(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const stackImgs = data.Contents?.map((content) => {
          return `${S3_URL}${content.Key}`;
        });

        setStackList(stackImgs || []);
      }
    });
  };

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

    return <div className="text-xl font-medium text-black">{text}</div>;
  }

  function StackList({ currentStackIndex }: { currentStackIndex: number }) {
    const imageClass = (active: Boolean) => {
      return `${active ? 'opacity-100' : 'opacity-0'} absolute top-0 h-full w-[80%] object-contain`;
    }

    {/* list w/ zindex on top of each other
    active > opacity 1 */}


    return (
      <div className="relative flex justify-center p-10 h-[70vh]">
        {stackList.map((img, index) => (
          <img
            className={imageClass(index === currentStackIndex)}
            key={index}
            src={img}
            alt="stack" />
        ))}
      </div>
    );
  }

  function StackSelector() {
    if (stackList.length) {
      return null;
    }

    return (
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 flex-col gap-[10px]">
      <div>
        <div className="text-xl font-medium text-black">Stack Name</div>
      </div>
      <input
        type="text"
        className="border border-gray-300 p-2"
        value={stackName}
        onChange={(e) => setStackName(e.target.value)}
      />
      <button
        className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
        onClick={getStack}
      >
        Get Stack
      </button>
    </div>
    )
  }

  return (
    <div className="App">
      {currentStackIndex}
      <StackSelector />
      <EmptyState />
      <StackList currentStackIndex={currentStackIndex} />
      <div>
        { stackName && (
          <div>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={uploadFilesToStack}>Upload</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
