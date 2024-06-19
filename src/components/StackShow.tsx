import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Stack } from './StackList';

import forwardIcon from '../images/forward.fill.png';
import pauseIcon from '../images/pause.fill.png';
import playIcon from '../images/play.fill.png';
import xmarkIcon from '../images/xmark.png';

export const ActionButton = styled.button`
  background: #2E3440;
  color: #D8DEE9;
  border: 1px solid #4C566A;
  border-radius: 50%;
  cursor: pointer;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  width: 35px;
  height: 35px;
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

export const ActionIconImg = styled.img`
  width: 15px;
  height: 15px;
  object-fit: contain;
`;

export default function StackShow({ stack, closeStack, updateStack }: { stack: Stack, closeStack: () => void, updateStack: (stack: Stack) => void})
{
  const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-direction: column;
  `;

  const ActionWrapper = styled.div`
    padding: 5px 20px;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;
    flex-wrap: wrap;
    position: absolute;
    bottom: 20px;
    max-height: 15dvh;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.30),
      inset 0 -1px 4px #FFFFFF03,
      inset 0 -1px 1px #FFFFFF15,
      inset 0 -1px 0px #FFFFFF20;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  `;

  const ImageWrapper = styled.div`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80dvh;
    padding: 5px;
    width: 100%;
    padding: 10px;

    @media (max-width: 400px) {
      height: 40dvh;
    }
  `;

  const StackImage = styled.img`
    border-radius: 10px;
    object-fit: contain;
    max-height: 100%;
  `;

  const TimerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #FFFFFF30;
    gap: 10px;
    padding-left: 10px;
    flex-grow: 1;
  `;

  const InvertSpan = styled.span`
    filter: invert(75%);
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
  }, [currentStackIndex, randomImageDuration, pause, stack]);

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
            {/* <ActionButton>{currentStackIndex}</ActionButton> */}
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
