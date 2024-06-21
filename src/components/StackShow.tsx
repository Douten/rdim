import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Stack } from './StackList';

import forwardIcon from '../images/forward.fill.png';
import backIcon from '../images/arrowshape.turn.up.backward.fill.png';
import xmarkIcon from '../images/xmark.png';
import checkmarkIcon from '../images/checkmark.png';
import flameIcon from '../images/flame.fill.png';

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

export default function StackShow({ stack, closeStack, updateStack }: { stack: Stack, closeStack: () => void, updateStack: (stack: Stack) => void})
{
  const [currentStackIndex, setCurrentStackIndex] = useState<number>(0);

  const WRONG_SCORE = -5;
  const CORRECT_SCORE = 2;
  const HOT_SCORE = 10;

  function pushScore(score: number) {
    stack.stackImages[currentStackIndex].score!.push(score);
    updateStack(stack);
    const scoreIndex = ltrIndex();
    setCurrentStackIndex(scoreIndex);
  }

  // function to randomly select an image from the stack based on score
  // the higher the score the less frequent the image will be shown
  function ltrIndex() {
    let totalScore = 0;
    stack.stackImages.forEach((image) => {
      totalScore += image.score!.reduce((a, b) => a + b, 0);
    });

    let randomScore = Math.floor(Math.random() * totalScore);
    let scoreIndex = 0;

    for (let i = 0; i < stack.stackImages.length; i++) {
      const imgScore = stack.stackImages[i].score!.reduce((a: number, b: number) => a + b, 0);
      // inverse so that the higher the score the less likely it will be selected
      const selectionScore = Math.abs(imgScore - totalScore);

      if (selectionScore >= randomScore) {
        scoreIndex = i;

        // prevent the same image from being selected twice in a row
        while (scoreIndex === currentStackIndex) {
          scoreIndex = ltrIndex();
        }

        break;
      }
    }

    return scoreIndex;
  }

  function randomImage() {
    const scoreIndex = ltrIndex();
    setCurrentStackIndex(scoreIndex);
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
          <ActionButton onClick={closeStack}><ActionIconImg src={backIcon} /></ActionButton>
          <ActionButton onClick={() => randomImage()}><ActionIconImg src={forwardIcon} /></ActionButton>
          <TimerWrapper>
            <ActionButton onClick={() => pushScore(WRONG_SCORE)}>
              <ActionIconImg src={xmarkIcon} />
            </ActionButton>
            <ActionButton onClick={() => pushScore(CORRECT_SCORE)}>
              <ActionIconImg src={checkmarkIcon} />
            </ActionButton>
            <ActionButton onClick={() => pushScore(HOT_SCORE)}>
              <ActionIconImg src={flameIcon} />
            </ActionButton>
            </TimerWrapper>
        </ActionWrapper>
      }
    </Wrapper>
  );
}
