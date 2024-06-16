import { useState, useMemo } from 'react';
import AWS from 'aws-sdk';
import styled from 'styled-components';
import { ActionButton, StyledInput } from './StackList';


interface StackSelectorProps{
    stackList: string[];
    addImagesToStack: (images: string[]) => void;
}

export default function StackSelector({ stackList, addImagesToStack }: StackSelectorProps) {
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
  const REGION = process.env.REACT_APP_REGION;
  const S3_URL = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/`;

  const AWSconn = useMemo(() => {
    return AWS.config.update({
      accessKeyId: process.env.REACT_APP_ACESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    });
  }, []);

  const [stackName, setStackName] = useState<string>('');

  const getStack = async () => {
    if (!stackName) {
      return;
    }

    const s3 = new AWS.S3({
      params: { 
        Bucket: S3_BUCKET,
        Prefix: stackName
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
    width: 50vw;
    margin: 0 auto 5vh;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    border: 1px solid #4C566A;
    border-radius: 10px;
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
        value={stackName}
        onChange={(e) => setStackName(e.target.value)}
      />
      <ActionButton
        onClick={getStack}
      >
        Get Stack
      </ActionButton>
    </Wrapper>
  )
}
