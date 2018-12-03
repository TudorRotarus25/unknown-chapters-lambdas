const MySqlAdapter = require('./adapters/MySqlAdapter');

const getResponse = async (dbAdapter) => {
  const images = await dbAdapter.getAllImages(process.env.base_path);

  return {
    images,
  };
};

exports.handler = async (event, context, callback) => {
  const dbAdapter = new MySqlAdapter(
    process.env.db_host,
    process.env.db_user,
    process.env.db_password,
  );

  const response = await getResponse(dbAdapter);

  dbAdapter.closeConnection();

  callback(null, response);
};
