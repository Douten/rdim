import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

interface StackListProps{
  stackList: string[];
  clearStackList: () => void;
}

export const ActionButton = styled.button`
  padding: .5em .5em;
  background: #2E3440;
  color: #D8DEE9;
  border: 1px solid #4C566A;
  border-radius: 50%;
  cursor: pointer;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: .8em;
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
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: column;
  `;

  const ActionWrapper = styled.div`
    padding: .5em 3em;
    background: #3B4252;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #4C566A;
    border-radius: 80px;
    flex-wrap: wrap;
  `;

  const ImageWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    width: 100%;
  `;

  const StackImage = styled.img`
    padding: 1em;
    max-height: 100%;
    max-width: 96%;
    border-radius: 10px;
    border: 1px solid #4C566A;
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
    flex-grow: 1;
  `;

  const InvertSpan = styled.span`
    filter: invert(75%);
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

  return (
    <Wrapper>
      { stackList.length > 0 && 
        <ImageWrapper>
          <StackImage
            src={stackList[currentStackIndex]}
            alt="stack" />
        </ImageWrapper>
      }
      { stackList.length > 0 &&
        <ActionWrapper>
          <ActionButton onClick={clearStackList}>❌</ActionButton>
          <ActionButton onClick={() => setPause(!pause)}>{pause ? '▶️' : '⏸️'}</ActionButton>
          <ActionButton onClick={() => randomImage(stackList)}>🔄</ActionButton>
          <TimerWrapper>
            <ActionButton>{currentStackIndex}</ActionButton>
            <ActionButton onClick={() => {
              const newDuration = randomImageDuration - 1000;
              if (newDuration < 1000) { return }
              setImageDuration(randomImageDuration - 1000) }
            }>
              <InvertSpan>
                ➖
              </InvertSpan>
            </ActionButton>
            {randomImageDuration / 1000} secs
            <ActionButton onClick={() => setImageDuration(randomImageDuration + 1000)}>
              <InvertSpan>
                ➕
              </InvertSpan>
            </ActionButton>
          </TimerWrapper>
        </ActionWrapper>
      }
    </Wrapper>
  );
}
