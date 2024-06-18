import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Stack } from '../components/StackList';

export default function bucket() {
  const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
  const REGION = process.env.REACT_APP_REGION;
  const S3_URL = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/`;

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_ACESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
  });

  const getStack = async (stackName: string) => {
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

    let imgs: string[] = [];

    s3.listObjectsV2(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log({ data })
        const stackImgs = data.Contents?.map((content) => {
          return `${S3_URL}${content.Key}`;
        });

        imgs = stackImgs || [];
      }
    });

    return imgs;
  };

  const uploadFile = async (file: any, imgName: string) => {
    if (!file || !imgName) {
      return;
    }

    const params = {
      Bucket: `${S3_BUCKET}`,
      Key: `${imgName}`,
      Body: file,
    };

    const s3 = new AWS.S3({
      params: { 
        Bucket: S3_BUCKET
      },
      region: REGION,
    });

    try {
      var upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          console.log(
            `Uploading ${evt.loaded} ${evt.total} %`
          );
        })
        .promise();

      await upload.then((result) => {
        console.log(result.$response.error);
      });
    }
    catch (err) {
      console.log(err);
    }
  };
  
  const uploadStack = async (files: File[]) => {
    const stackName = uuidv4();
    const stackImages = files.map((file, idx) => {
      const fileName = `${stackName}-${idx}.${file.type.split('/')[1]}`;
      return {
        imageUrl: `${S3_URL}${fileName}`,
        key: fileName,
        timer: 10000,
      };
    });

    // upload files
    await Promise.all(files.map(async (file, idx): Promise<void> => {
      const fileName = `${stackName}-${idx}.${file.type.split('/')[1]}`;
      await uploadFile(file, fileName);
    }));
    
    return { stackId: stackName, name: 'untitled', stackImages }
  };

  const deleteFile = async (imgName: string) => {
    if (!imgName) {
      return;
    }

    const params = {
      Bucket: `${S3_BUCKET}`,
      Key: `${imgName}`,
    };

    const s3 = new AWS.S3({
      params: { 
        Bucket: S3_BUCKET
      },
      region: REGION,
    });

    try {
      var upload = s3
        .deleteObject(params)
        .promise();

      await upload.then((result) => {
        console.log(result.$response.error);
      });
    }
    catch (err) {
      console.log(err);
    }
  };

  const deleteStack = async (stack: Stack) => {
    // upload files
    await Promise.all(
      stack.stackImages.map(async (stackImage) => {
        await deleteFile(stackImage.key);
      })
    );
  };

  return { deleteStack, uploadStack, getStack, deleteFile }
}
