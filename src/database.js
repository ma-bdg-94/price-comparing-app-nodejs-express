const { connect, set } = require('mongoose')


const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI)
    console.info('Connected to Database!')
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = connectDB