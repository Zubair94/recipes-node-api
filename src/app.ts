import * as helmet from 'helmet';
import * as httpLogger from 'morgan';
import * as express from 'express';
import { Request, Response, NextFunction, Application} from 'express';
import { publicRoutes } from './routes';
import { connection } from './config';
import { error } from './middlewares';
import { responseHandler } from './utils';
export class App {
    app: Application;
    constructor() {
        this.app = express();
        connection();
        this.middleware();        
        this.routerConfig();
        this.errorHandler();
        this.app.use('/api/v1/info', (req: Request, res: Response, next: NextFunction) => {
            res.status(200).json({success: true, message: "Express API Server"});
        });
        this.app.use('/api/v1/*', (req: Request, res: Response, next: NextFunction) => {
            res.status(404).json({success: false, message: "Invalid Endpoint"});
        });
        this.app.use('*', (req: Request, res: Response, next: NextFunction) => {
            res.status(404).json({success: false, message: "Invalid Endpoint"});
        });
    }
    private middleware() {
        // trust proxy
        this.app.set('trust proxy', 1);
        // helmet js
        this.app.use(helmet());
        // cors middleware
        this.cors();
        //TODO: Rate Limiter
        // http logger Morgan
        if (this.app.get('env') === 'production') {
            this.app.use(httpLogger('combined'));
        } else {
            this.app.use(httpLogger('dev'));
        }
        // support application/json type post data
        this.app.use(express.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(express.urlencoded({ extended: false }));
    }
    private cors() {
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const allowedOrigins = ['http://localhost:4200', 'http://192.168.1.101:4200'];
            const origin = this.app.get('env') === 'production' ?  req.headers.origin : '*';
            if (origin && typeof origin === 'string') {
                const remoteIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
                console.log(remoteIP);
                if (allowedOrigins.indexOf(origin) > -1) {
                    res.header('access-control-allow-origin', origin);
                }
                res.header('access-control-allow-headers', 'origin, x-requested-with, content-type, accept, authorization');
                if (req.method === 'OPTIONS') {
                    res.header('access-control-allow-methods', 'PUT, POST, DELETE, PATCH, GET');
                    return res.status(200).json({});
                }
                next();
            } else {
                responseHandler(res, 403, false, 'Bad access-control-allow-origin headers');
            }
        });  
    }
    private errorHandler() {
        this.app.use(error);
    }
    private routerConfig() {
        this.app.use('/api/v1/public', publicRoutes);
    }
}