import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface StackListProps{
  stackList: string[];
  clearStackList: () => void;
}

export const ActionButton = styled.button`
padding: .5em 1em;
background: #2E3440;
color: #D8DEE9;
border: 1px solid #4C566A;
border-radius: 5px;
cursor: pointer;
`;

export const StyledInput = styled.input`
  padding: .5em;
  background: #2E3440;
  color: #D8DEE9;
  border: 1px solid #4C566A;
  border-radius: 5px;
  cursor: pointer;
`;

export default function StackList({stackList, clearStackList}: StackListProps)
{

  const ActionWrapper = styled.div`
    padding: 1em;
    background: ##3B4252;
    width: 50vw;
    margin: 0 auto 5vh;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    border: 1px solid #4C566A;
    border-radius: 10px;
  `;

  const ImageWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
  `;

  const [currentStackIndex, setCurrentStackIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [randomImageDuration, setImageDuration] = useState<number>(15000);

  useEffect(() => {
    if (!stackList.length) {
      return
    }

    const interval = setInterval(() => { 
      if (!pause) {
        randomImage(stackList)
      }
    }, randomImageDuration);
    return () => {
      // if the data updates prematurely 
      // we cancel the timeout and start a new one
      clearTimeout(interval);
    }
  }, [currentStackIndex, stackList, randomImageDuration]);

  function randomImage(stackList: string[]) {
    console.log({ currentStackIndex, stackList })
    // setCurrentStackIndex((currentStackIndex + 1) % (stackList.length || 1));



    let newIndex = Math.floor(Math.random() * stackList.length);
    // randomly set index for currentStackIndex
    setCurrentStackIndex(newIndex);
  }

  const imageClass = (active: Boolean) => {
    return `${active ? 'opacity-100' : 'opacity-0'} absolute top-0 h-full w-[80%] object-contain`;
  }

  return (
    <div>
      { stackList.length > 0 && 
        <ImageWrapper>
          {stackList.map((imgUrl: string, index) => (
            <img
              className={imageClass(index === currentStackIndex)}
              key={index}
              src={imgUrl}
              alt="stack" />
          ))}
        </ImageWrapper>
      }
      { stackList.length > 0 &&
        <ActionWrapper>
          <ActionButton onClick={clearStackList}>X</ActionButton>
          <ActionButton onClick={() => setPause(!pause)}>{pause ? 'Play' : 'Pause'}</ActionButton>
          <ActionButton onClick={() => randomImage(stackList)}>Next</ActionButton>
          <div>
            <StyledInput
              type="number"
              value={randomImageDuration / 1000}
              onChange={(e) => setImageDuration(Number(e.target.value) * 1000)}
            /> secs
          </div>
        </ActionWrapper>
      }
    </div>
  );
}
