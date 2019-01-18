import { fetchMock , post } from 'app/fetch';

export function getData(options: any) {
    const opts = {

    };
    const api = '/admin/district/region';
    return post(api, opts);
}
