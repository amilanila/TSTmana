import express from 'express';
import bodyParser from 'body-parser';
import { API_END_POINT, CmsAPI } from '../../constants';
import fs from 'fs';
import ejs from 'ejs';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get(API_END_POINT + CmsAPI.CONTENT, function named(req, res) {
	const spcFooterTemplate = ejs.compile(fs.readFileSync(__dirname + '/cms_footer.ejs', 'utf-8'));

	setTimeout(() => {
		res.send(JSON.stringify({
			success: true,
			data: {
				slots: {
					SpcFooter: spcFooterTemplate()
				}
			}
		}));
	}, Math.random() * 1000);
});

export default app;
