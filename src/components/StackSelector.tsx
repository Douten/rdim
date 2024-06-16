import { useState, useMemo } from 'react';
import AWS from 'aws-sdk';


interface StackListProps{
    stackList: string[];
    addImagesToStack: (images: string[]) => void;
}

export default function StackSelector({ stackList, addImagesToStack }: StackListProps) {
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

  if (stackList.length) {
    return null;
  }

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 flex-col gap-[10px]">
    <div>
      <div className="text-xl font-medium text-black">Stack Name</div>
    </div>
    <input
      type="text"
      className="border border-gray-300 p-2"
      value={stackName}
      onChange={(e) => setStackName(e.target.value)}
    />
    <button
      className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
      onClick={getStack}
    >
      Get Stack
    </button>
  </div>
  )
}
