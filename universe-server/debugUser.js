const mongoose = require('mongoose');
const User = require('./models/user');

const mongoURI = 'mongodb://127.0.0.1:27017/UniVerse';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      const user = await User.findOne({ email: 'multirole@test.com' });
      if (user) {
        console.log('User found:', user.name);
        console.log('Current Roles:', user.roles);

        if (!user.roles.includes('student')) {
            console.log('Fixing missing student role...');
            user.roles.push('student');
            await user.save();
            console.log('User updated successfully!');
            console.log('New Roles:', user.roles);
        } else {
            console.log('User already has student role.');
        }

      } else {
        console.log('User not found');
      }
    } catch (err) {
      console.error(err);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => console.error(err));
