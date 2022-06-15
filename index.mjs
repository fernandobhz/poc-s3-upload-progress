import AWS from "aws-sdk";

const UPLOAD_SIZE =  100 * 1024 * 1024;

const { accessKeyId, secretAccessKey, bucketName } = process.env;

const log = (...args) => console.log(new Date().toISOString(), ...args);

const s3 = new AWS.S3({
  accessKeyId,
  secretAccessKey,
});

function writeToS3(data) {
  const secondsFromEpoch = Math.floor(Date.now() / 1000);

  const params = {
    Bucket: bucketName,
    Key: `dev-tests/huge-data.txt`,
    Body: data,
  };

  const request = s3.upload(params);

  log("httpUploadProgress");
  request.on("httpUploadProgress", (progress) => {
    log("httpUploadProgress", JSON.stringify(progress));
  });

  log("data");
  request.on("data", (...args) => {
    log("data", JSON.stringify(args));
  });

  log("error");
  request.on("error", (error) => {
    log(error);
  });

  log("success");
  request.on("success", (success) => {
    log(Object.keys(success));
  });

  log("returning a promise");
  return request.promise();
}

const hugeData = "".padEnd(UPLOAD_SIZE);

log("sending huge data to s3");

await writeToS3(hugeData);

log(" got back after writing to s3");
