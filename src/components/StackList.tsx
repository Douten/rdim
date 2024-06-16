import { useRef, useEffect, useState } from 'react';
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
  width: 70px;
`;

export default function StackList({stackList, clearStackList}: StackListProps)
{
  const Wrapper = styled.div`
    width: 100%;
  `;

  const ActionWrapper = styled.div`
    padding: 1em;
    background: #3B4252;
    margin: 20px 10vw 0;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    border: 1px solid #4C566A;
    border-radius: 10px;
    flex-wrap: wrap;
  `;

  const ImageWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
    width: 100%;
  `;

  const StackImage = styled.img`
    width: 100%;
    object-fit: contain;
  `;

  const TimerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: #3B4252;
    gap: 10px;
    padding: .3em;
    border: 1px solid #4C566A;
    border-radius: 5px;
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
    <Wrapper>
      { stackList.length > 0 && 
        <ImageWrapper>
          <StackImage
            className={imageClass(true)}
            src={stackList[currentStackIndex]}
            alt="stack" />
        </ImageWrapper>
      }
      { stackList.length > 0 &&
        <ActionWrapper>
          <ActionButton onClick={clearStackList}>X</ActionButton>
          <ActionButton onClick={() => setPause(!pause)}>{pause ? 'Play' : 'Pause'}</ActionButton>
          <ActionButton onClick={() => randomImage(stackList)}>Next</ActionButton>
          <TimerWrapper>
            <ActionButton onClick={() => setImageDuration(randomImageDuration - 1000)}>-</ActionButton>
            {randomImageDuration / 1000} secs
            <ActionButton onClick={() => setImageDuration(randomImageDuration + 1000)}>+</ActionButton>
          </TimerWrapper>
        </ActionWrapper>
      }
    </Wrapper>
  );
}
