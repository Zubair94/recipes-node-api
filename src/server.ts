import { App } from "./app";
import { PORT } from "./config";
const port = PORT ? PORT : 3000;
const app = new App().app;
app.listen(port, () => {
    console.log('Express server listening on PORT ' + port);
});