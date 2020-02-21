import { connect, Mongoose } from 'mongoose';
import { DB_URI_MONGO } from './environment.config';

// Database Connection
export const connection = () => {
    connect(DB_URI_MONGO, {
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then((conn: Mongoose) => {
        console.log(`${'MongoDB connected.'}`);
    }).catch(error => {
        console.log(`${'Failed to connect to database. Error: '}${error}`);
    });
};
