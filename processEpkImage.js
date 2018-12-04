const AWS = require('aws-sdk');
const Sharp = require('sharp');
const S3 = new AWS.S3({ signatureVersion: 'v4' });
const MySqlAdapter = require('./adapters/MySqlAdapter');

exports.handler = async (event, context, callback) => {
  const dbAdapter = new MySqlAdapter(
    process.env.db_host,
    process.env.db_user,
    process.env.db_password,
  );

  const srcBucket = event.Records[0].s3.bucket.name;
  const srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));

  let contentType;

  S3.getObject({
    Bucket: srcBucket,
    Key: srcKey,
  }).promise()
    .then((data) => {
      contentType = data.ContentType;
      const img = Sharp(data.Body).resize(200, 200);

      return img.withoutEnlargement().toBuffer();
    })
    .then((result) => {
      S3.putObject({
        Body: result,
        Bucket: srcBucket,
        ContentType: contentType,
        Key: srcKey.replace('original', 'thumbnails'),
      }).promise();
    })
    .then(() => {
      const newPath = srcKey.split('/')[2];
      dbAdapter.insertImage(newPath);
      dbAdapter.closeConnection();
    })
    .then(() => callback(null, {}))
    .catch(() => {
      dbAdapter.closeConnection();
    });
};
