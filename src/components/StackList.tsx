import { useEffect, useState } from 'react';
import bucket from '../hooks/bucket';

// components
import StackShow from './StackShow';
import StackItem from './StackItem';
// base components
import { Wrapper, StackListkWrapper, AddStackWrapper } from './base/wrappers';
import { Img } from './base/images';
import { Button } from './base/buttons';
import icon from './base/icons';

interface StackImage {
  imageUrl: string;
  key: string;
  timer: number;
  score?: number[];
}

export interface Stack {
  stackId: string;
  name: string;
  stackImages: StackImage[];
}

export default function StackList()
{
  const [stackList, setStackList] = useState<Stack[]>([]);
  const [selectedStackId, setSelectedStackId] = useState<string>('');
  const [addingStack, setAddingStack] = useState<boolean>(false);
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
    setAddingStack(true);
    const uploadedStack = await uploadStack(files)
    const newStackList = [...stackList, uploadedStack]

    setSelectedStackId(uploadedStack.stackId);
    setStackList(newStackList);
    localStorage.setItem('stackList', JSON.stringify(newStackList));
    setAddingStack(false);
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
      {!selectedStackId && (
        <AddStackWrapper>
          { addingStack
            ?
              <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
            :
              <Button htmlFor="add-image">
                <Img src={icon.squareStacks} /> New Stack
              </Button>
          }
          <input
            id="add-image"
            type="file"
            multiple onChange={handleFileChange}
            accept="image/png, image/gif, image/jpeg"
          />
        </AddStackWrapper>
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
        {!selectedStackId && stackList.map((stack) => {
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
