import express from 'express';
import bodyParser from 'body-parser';
import { Misc } from '../../constants';
import state from './state';

state.set('csrfToken', 'b3c7d83ade57d83ade585');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get(Misc.SESSION, function named(req, res) {
	console.log('getting the session .....');
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				session: {
					guest: false,
					csrfToken: state.get('csrfToken'),
					customer: {
						firstName: 'Nick',
						lastName: 'Iannelli',
						mobileNumber: '0400 000 000',
						title: 'mr',
						formattedTitle: 'Mr'
					}
				}
			}
		}));
	}, Math.random() * 1000);
});

app.get(Misc.ENV, function named(req, res) {
	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				env: {
					gaId: '123981023_X',
					gtmId: 'GTM-SCN2V'
				}
			}
		}));
	}, Math.random() * 1000);
});

export default app;
