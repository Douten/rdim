import { useState, useRef } from 'react';

// interfaces
import { Stack } from './StackList';
// base components
import { StackWrapper, StackActionWrapper } from './base/wrappers';
import { ActionButton } from './base/buttons';
import { Img, StackImageThumbnail } from './base/images';
import { Input } from './base/inputs';
import icon from './base/icons';

interface StackItemProps {
  stack: Stack;
  setSelect: (stackId: string) => void;
  removeStack: (stack: Stack) => void;
  setStackName: (stackId: string, name: string) => void;
}

export default function StackItem({ stack, setSelect, removeStack, setStackName }: StackItemProps)
{
  const [editName, setEditName] = useState(false);
  // const [name, setName] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);

  return (
    <StackWrapper key={stack.stackId}>
      <StackImageThumbnail
        key={stack.stackImages[0].imageUrl}
        src={stack.stackImages[0].imageUrl}
        onClick={() => setSelect(stack.stackId)}
        alt="stack" />
      { editName ?
        (<Input autoFocus padding='5px' type="text" ref={nameInput} />):
        (<span>{stack.name}</span>)
      }
      <StackActionWrapper>
          { editName ?
            (
              <ActionButton onClick={() => {
                const name = nameInput.current?.value || 'untitled';
                setStackName(stack.stackId, name);
                setEditName(false);
              }}>
                <Img src={icon.checkmark}/>
              </ActionButton>
            ) :
            (
              <ActionButton onClick={() => {
                setEditName(true);
              }}>
                <Img src={icon.edit} />
              </ActionButton>
            )
          }
        <ActionButton onClick={() => removeStack(stack)}>
          <Img src={icon.delete} />
        </ActionButton>
      </StackActionWrapper>
    </StackWrapper>
  );
}
