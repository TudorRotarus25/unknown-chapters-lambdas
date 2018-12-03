const AWS = require('aws-sdk');
const S3 = new AWS.S3({ signatureVersion: 'v4' });
const MySqlAdapter = require('./adapters/MySqlAdapter');

exports.handler = async (event, context, callback) => {
  const dbAdapter = new MySqlAdapter(
    process.env.db_host,
    process.env.db_user,
    process.env.db_password,
  );

  dbAdapter.closeConnection();

  callback(null, {});
};
