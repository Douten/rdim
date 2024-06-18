import { useEffect, useState } from 'react';
import styled from 'styled-components';
import bucket from '../hooks/bucket';
// components
import StackShow, { ActionButton, ActionIconImg } from './StackShow';
import StackItem from './StackItem';

interface StackImage {
  imageUrl: string;
  key: string;
  timer: number;
}

export interface Stack {
  stackId: string;
  name: string;
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

  const StackListkWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    width: 80%;
    margin-top: 20px;
  `;

  const StackWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
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
    padding: 10px;
    background: #2E3440;
    color: #D8DEE9;
    border: 1px solid #4C566A;
    border-radius: 5px;
    cursor: pointer;
    width: 100px;
    height: 100px;
    object-fit: cover;
  `;

  const StackActionWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;r
  `;

  const [stackList, setStackList] = useState<Stack[]>([]);
  const [selectedStackId, setSelectedStackId] = useState<string>('');
  const { uploadStack, deleteStack } = bucket();

  useEffect(() => {
    let localStacklist = localStorage.getItem('stackList');

    if (localStacklist) {
      setStackList(JSON.parse(localStacklist));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files?.length ? Array.from(e.target.files) : null;
    // filter images file only
    const filteredFiles = selectedFiles?.filter((file) => file.type.includes('image'));
    
    if (!filteredFiles) {
      return;
    } else {
      addStack(filteredFiles);
    }
  };

  const addStack = async (files: File[]) => {
    const uploadedStack = await uploadStack(files)
    const newStackList = [...stackList, uploadedStack]

    setSelectedStackId(uploadedStack.stackId);
    setStackList(newStackList);
    localStorage.setItem('stackList', JSON.stringify(newStackList));
  };
  
  const removeStack = async (stack: Stack) => {
    await deleteStack(stack);

    console.log('deleting stack', stack.stackId)

    const newStackList = stackList.filter((stackInList) => stackInList.stackId !== stack.stackId);
    setStackList(newStackList);
    localStorage.setItem('stackList', JSON.stringify(newStackList));
  }

  const updateStackName = (stackId: string, name: string) => {
    const newStackList = stackList.map((stack) => {
      if (stack.stackId === stackId) {
        stack.name = name;
      }
      return stack;
    });

    setStackList(newStackList);
    localStorage.setItem('stackList', JSON.stringify(newStackList));
  }

  return (
    <Wrapper>
      { !selectedStackId && (
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
      )}
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
      <StackListkWrapper>
        { !selectedStackId && stackList.map((stack) => {
          return (
              <StackItem
                key={stack.stackId}
                stack={stack}
                setSelect={setSelectedStackId}
                setStackName={updateStackName}
                removeStack={removeStack}
              />
            );
          })
        }
      </StackListkWrapper>
    </Wrapper>
  );
}
