import { useEffect, useState } from 'react';

// components
import { Stack } from './StackList';
// base components
import { ActionButton, ConfirmButton } from './base/buttons';
import { Img, ReviewImage } from './base/images';
import { Wrapper, ReviewImageWrapper, ActionWrapper } from './base/wrappers';
import icon from './base/icons';

export default function StackShow({ stack, closeStack, updateStack }: { stack: Stack, closeStack: () => void, updateStack: (stack: Stack) => void})
{
  const [currentStackIndex, setCurrentStackIndex] = useState<number>(0);

  const WRONG_SCORE = 0;
  const CORRECT_SCORE = 4;
  const HOT_SCORE = 20;

  useEffect(() => {
    if (stack.stackImages.length > 0) {
      setCurrentStackIndex(ltrIndex());
    }
  }, []);

  function pushScore(score: number) {
    stack.stackImages[currentStackIndex].score!.push(score);
    updateStack(stack);
    const scoreIndex = ltrIndex();
    setCurrentStackIndex(scoreIndex);
  }

  // function to randomly select an image from the stack based on score
  // the higher the score the less frequent the image will be shown
  function ltrIndex() {

    const highestImageScore = stack.stackImages.reduce((a, b) => {
      const aScore = a.score!.reduce((a, b) => a + b, 0);
      const bScore = b.score!.reduce((a, b) => a + b, 0);

      return aScore > bScore ? a : b;
    })

    const highestScore = highestImageScore.score!.reduce((a, b) => a + b, 0);
    const randomScore = Math.floor(Math.random() * highestScore);
    
    const imageScoreIdx = stack.stackImages.map((image, idx) => {
      const imageScore = image.score!.reduce((a, b) => a + b, 0);

      return { score: imageScore, idx };
    })
    const randomlySortedScores = imageScoreIdx.sort(() => Math.random() - 0.5);

    console.log({ randomlySortedScores, highestScore, randomScore })

    let scoreIndex = 0;

    console.log("==== foreach ====")
    randomlySortedScores.some((image) => {
      console.log({ image, randomScore, 'randomScore >= image.score': (randomScore >= image.score)})
      if (randomScore >= image.score) {
        scoreIndex = image.idx;
        return true;
      }
    });

    return scoreIndex;
  }

  function randomImage() {
    const scoreIndex = ltrIndex();
    setCurrentStackIndex(scoreIndex);
  }

  return (
    <Wrapper>
      { stack.stackImages.length > 0 && 
        <ReviewImageWrapper>
          <ReviewImage
            src={stack.stackImages[currentStackIndex].imageUrl}
            alt="stack" />
        </ReviewImageWrapper>
      }
      { stack.stackImages.length > 0 &&
        <ActionWrapper>
          <ActionButton onClick={closeStack}><Img src={icon.back} /></ActionButton>
          <ActionButton onClick={() => pushScore(HOT_SCORE)}>
            <Img src={icon.flame} />
          </ActionButton>
          <ConfirmButton onClick={() => pushScore(CORRECT_SCORE)}>
            <Img height="20px" width="20px" src={icon.checkmark} />
          </ConfirmButton>
          <ActionButton onClick={() => pushScore(WRONG_SCORE)}>
            <Img height="10px" width="10px" src={icon.xmark} />
          </ActionButton>
          <ActionButton onClick={() => randomImage()}><Img src={icon.forward} /></ActionButton>
        </ActionWrapper>
      }
    </Wrapper>
  );
}
