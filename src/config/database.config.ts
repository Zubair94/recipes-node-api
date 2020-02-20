import { connect, Mongoose } from 'mongoose';
import { DB_URI } from './environment.config';
export const connection = () => {
    connect(DB_URI, {
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
