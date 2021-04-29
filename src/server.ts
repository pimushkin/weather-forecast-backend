process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import App from '@app';
import IndexRoute from '@routes/index.route';
import WeatherRoute from '@routes/weather.route';
import FavoriteRoute from '@routes/favorite.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new WeatherRoute(), new FavoriteRoute()]);

app.listen();
