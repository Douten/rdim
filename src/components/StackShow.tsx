import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Stack } from './StackList';

import forwardIcon from '../images/forward.fill.png';
import pauseIcon from '../images/pause.fill.png';
import playIcon from '../images/play.fill.png';
import xmarkIcon from '../images/xmark.png';

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
  width: 30px;
  height: 30px;
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

export default function StackShow({ stack, closeStack, updateStack }: { stack: Stack, closeStack: () => void, updateStack: (stack: Stack) => void})
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

  const ActionIconImg = styled.img`
    width: 10px;
    height: 10px;
    object-fit: contain;
  `;

  const [currentStackIndex, setCurrentStackIndex] = useState<number>(0);
  const [pause, setPause] = useState<boolean>(false);
  const [randomImageDuration, setImageDuration] = useState<number>(15000);

  useEffect(() => {
    if (!stack.stackImages.length) {
      return
    }

    const timer = stack.stackImages[currentStackIndex].timer;
    const interval = setInterval(() => { 
      if (!pause) {
        randomImage(stack)
      }
    }, timer);
    return () => {
      // if the data updates prematurely 
      // we cancel the timeout and start a new one
      clearTimeout(interval);
    }
  }, [currentStackIndex, randomImageDuration]);

  function setStackImageTimer(timer: number) {
    setImageDuration(timer);
    stack.stackImages[currentStackIndex].timer = timer;
    updateStack(stack);
  }

  function randomImage(stack: Stack) {
    let newIndex = Math.floor(Math.random() * stack.stackImages.length);
    // randomly set index for currentStackIndex
    setCurrentStackIndex(newIndex);
  }

  return (
    <Wrapper>
      { stack.stackImages.length > 0 && 
        <ImageWrapper>
          <StackImage
            src={stack.stackImages[currentStackIndex].imageUrl}
            alt="stack" />
        </ImageWrapper>
      }
      { stack.stackImages.length > 0 &&
        <ActionWrapper>
          <ActionButton onClick={closeStack}><ActionIconImg src={xmarkIcon} /></ActionButton>
          <ActionButton onClick={() => setPause(!pause)}>
            { pause ? <ActionIconImg src={playIcon} /> : <ActionIconImg src={pauseIcon} />}
          </ActionButton>
          <ActionButton onClick={() => randomImage(stack)}><ActionIconImg src={forwardIcon} /></ActionButton>
          <TimerWrapper>
            <ActionButton>{currentStackIndex}</ActionButton>
            <ActionButton onClick={() => {
              const newDuration = stack.stackImages[currentStackIndex].timer - 1000;
              if (newDuration < 1000) { return }
              setStackImageTimer(stack.stackImages[currentStackIndex].timer - 1000) }
            }>
              <InvertSpan>
                ➖
              </InvertSpan>
            </ActionButton>
            {stack.stackImages[currentStackIndex].timer / 1000} secs
            <ActionButton onClick={() => setStackImageTimer(stack.stackImages[currentStackIndex].timer + 1000)}>
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
