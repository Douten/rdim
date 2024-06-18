import { useMemo, useRef } from 'react';
import AWS from 'aws-sdk';
import styled from 'styled-components';
import { ActionButton, StyledInput } from './StackShow';


interface StackSelectorProps{
    stackList: string[];
    addImagesToStack: (images: string[]) => void;
}

export default function StackSelector({ stackList, addImagesToStack }: StackSelectorProps) {
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
  const REGION = process.env.REACT_APP_REGION;
  const S3_URL = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/`;

  const stackNameInput = useRef<HTMLInputElement>(null);

  const getStack = async () => {
    if (!stackNameInput?.current?.value) {
      return;
    }

    const s3 = new AWS.S3({
      params: { 
        Bucket: S3_BUCKET,
        Prefix: stackNameInput?.current?.value.toLowerCase()
      },
      region: REGION,
    });

    s3.listObjectsV2(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const stackImgs = data.Contents?.map((content) => {
          return `${S3_URL}${content.Key}`;
        });

        addImagesToStack(stackImgs || []);
      }
    });
  };

  const Wrapper = styled.div`
    padding: 1em;
    background: #3B4252;
    margin: 0 5vw 0;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    border: 1px solid #4C566A;
    border-radius: 10px;
    flex-wrap: wrap;
  `;

  const GetStackButton = styled(ActionButton)`
    padding: .5em 1em;
    border-radius: 5px;
    aspect-ratio: initial;
  `;

  if (stackList.length) {
    return null;
  }

  return (
    <Wrapper>
      <div>
        <div className="text-xl font-medium">Stack Name</div>
      </div>
      <StyledInput
        type="text"
        ref={stackNameInput}
      />
      <GetStackButton
        onClick={getStack}
      >
        Get Stack
      </GetStackButton>
    </Wrapper>
  )
}
