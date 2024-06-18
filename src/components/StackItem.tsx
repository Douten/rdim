import { useState, useRef } from 'react';
import styled from 'styled-components';
import { ActionButton, ActionIconImg } from './StackShow';
import { Stack } from './StackList';

import editIcon from '../images/pencil.png';
import deleteIcon from '../images/trash.fill.png';
import checkmarkIcon from '../images/checkmark.png';

interface StackItemProps {
  stack: Stack;
  setSelect: (stackId: string) => void;
  removeStack: (stack: Stack) => void;
  setStackName: (stackId: string, name: string) => void;
}

export default function StackItem({ stack, setSelect, removeStack, setStackName }: StackItemProps)
{
  const StackWrapper = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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

  const NameInput = styled.input`
    padding: 5px;
    background: #2E3440;
    color: #D8DEE9;
    border: 1px solid #4C566A;
    border-radius: 5px;
    cursor: pointer;
    width: 70px;
  `;

  const [editName, setEditName] = useState(false);
  // const [name, setName] = useState('');
  const nameInput = useRef<HTMLInputElement>(null);

  return (
    <StackWrapper key={stack.stackId}>
      <StackImage
        key={stack.stackImages[0].imageUrl}
        src={stack.stackImages[0].imageUrl}
        onClick={() => setSelect(stack.stackId)}
        alt="stack" />
      { editName ?
        (<NameInput autoFocus type="text" ref={nameInput} />):
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
                <ActionIconImg src={checkmarkIcon}/>
              </ActionButton>
            ) :
            (
              <ActionButton onClick={() => {
                setEditName(true);
              }}>
                <ActionIconImg src={editIcon} />
              </ActionButton>
            )
          }
        <ActionButton onClick={() => removeStack(stack)}>
          <ActionIconImg src={deleteIcon} />
        </ActionButton>
      </StackActionWrapper>
    </StackWrapper>
  );
}
