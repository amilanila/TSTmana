import express from 'express';
import { API_END_POINT } from '../../constants';
import misc from './misc';
import delivery from './delivery';
import cart from './cart';
import voucher from './voucher';
import pages from './pages';
import payment from './payment';
import cms from './cms';
import billing from './billing';

const app = express();

app.use(misc);
app.use(delivery);
app.use(cart);
app.use(voucher);
app.use(payment);
app.use(pages);
app.use(cms);
app.use(billing);

export const mockWsApi = {
	mountPath: API_END_POINT,
	handler: app
};

export const mockCmsApi = {
	mountPath: '/',
	handler: cms
};
