import { useEffect, useState } from 'react';
import styled from 'styled-components';
import StackShow, { ActionButton } from './StackShow';
import bucket from '../hooks/bucket';
import { v4 as uuidv4 } from 'uuid';

interface StackImage {
  imageUrl: string;
  timer: number;
}

export interface Stack {
  stackId: string;
  stackImages: StackImage[];
}

export default function StackList()
{
  const Wrapper = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: column;
  `;

  const AddStackLabel = styled.label`
    padding: .5em 1em;
    background: #2E3440;
    color: #D8DEE9;
    border: 1px solid #4C566A;
    border-radius: 5px;
    cursor: pointer;
  `;

  const StackImage = styled.img`
    padding: .5em 1em;
    background: #2E3440;
    color: #D8DEE9;
    border: 1px solid #4C566A;
    border-radius: 5px;
    cursor: pointer;
    width: 100px;
    height: 100px;
    object-fit: cover;
  `;

  const [stackList, setStackList] = useState<Stack[]>([]);
  const [selectedStackId, setSelectedStackId] = useState<string>('');
  const { uploadFile, S3_URL } = bucket();

  useEffect(() => {
    let localStacklist = localStorage.getItem('stackList');

    if (localStacklist) {
      setStackList(JSON.parse(localStacklist));
    }
  }, []);

  // TODO: move this to a upload component
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files?.length ? Array.from(e.target.files) : null;
    // filter images file only
    const filteredFiles = selectedFiles?.filter((file) => file.type.includes('image'));
    
    if (!filteredFiles) {
      return;
    } else {
      uploadStack(filteredFiles);
    }
  };

  const uploadStack = async (files: File[]) => {
    const stackName = uuidv4();
    const stackImages = files.map((file, idx) => {
      const fileName = `${stackName}-${idx}.${file.type.split('/')[1]}`;
      return {
        imageUrl: `${S3_URL}${fileName}`,
        timer: 10000,
      };
    });
    const newStackList = [...stackList, { stackId: stackName, stackImages }]

    // upload files
    await Promise.all(files.map(async (file, idx): Promise<void> => {
      const fileName = `${stackName}-${idx}.${file.type.split('/')[1]}`;
      await uploadFile(file, fileName);
    }));
    
    setSelectedStackId(stackName);
    setStackList(newStackList);
    localStorage.setItem('stackList', JSON.stringify(newStackList));
  };

  return (
    <Wrapper>
      <div>
        <AddStackLabel htmlFor="add-image">
          + Stack
        </AddStackLabel>
        <input
          id="add-image"
          type="file"
          multiple onChange={handleFileChange}
          accept="image/png, image/gif, image/jpeg"
        />
      </div>
      { selectedStackId && (
         <StackShow
            stack={stackList.find((stack) => stack.stackId === selectedStackId)!}
            closeStack={() => setSelectedStackId('')}
            updateStack={(stack: Stack) => {
              const newStackList = stackList.map((s) => {
                if (s.stackId === stack.stackId) {
                  return stack;
                }
                return s;
              });
              // setStackList(newStackList);
              localStorage.setItem('stackList', JSON.stringify(newStackList));
              }
            }
          />
        )
      }
      { !selectedStackId && stackList.map((stack) => {
        return (
          <div key={stack.stackId}>
            <StackImage
              key={stack.stackImages[0].imageUrl}
              src={stack.stackImages[0].imageUrl}
              onClick={() => setSelectedStackId(stack.stackId)}
              alt="stack" />
          </div>
          );
        })
      }
    </Wrapper>
  );
}
