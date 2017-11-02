/* globals require, jest, expect, describe, it, beforeEach */
import sinon from 'sinon'
import createBackendConnector from '../src/createBackendConnector'

describe('Backend Connector', () => {
    beforeEach(() => {
        const server = sinon.fakeServer.create();
        server.respondImmediately = true;
        server.respondWith('GET', '/api/list/', 'get list');
        server.respondWith('POST', '/api/object/add/', 'post object');
        server.respondWith('PATCH', '/api/object/update/', 'patch object');
        server.respondWith('DELETE', '/api/object/delete/', 'delete object');
        server.respondWith('POST', '/api/error/validation/', [400, {}, 'validation error']);
    });

    it('create works correctly', () => {
        const connector = createBackendConnector();
        return connector.create({ url: '/api/object/add/', httpMethod: 'post' })
        .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual('post object');
        });
    });

    it('read works correctly', () => {
        const connector = createBackendConnector();
        return connector.read({ url: '/api/list/', httpMethod: 'get' })
        .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual('get list');
        });
    });

    it('update works correctly', () => {
        const connector = createBackendConnector();
        return connector.read({ url: '/api/object/update/', httpMethod: 'patch' })
        .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual('patch object');
        });
    });

    it('delete works correctly', () => {
        const connector = createBackendConnector();
        return connector.read({ url: '/api/object/delete/', httpMethod: 'delete' })
        .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.data).toEqual('delete object');
        });
    });

    it('sets data correctly', () => {
        const connector = createBackendConnector();
        return connector.read({ url: '/api/object/update/', httpMethod: 'patch', data: { firstName: 'Joe' } })
        .then((response) => {
            expect(response.request.requestBody).toBe(JSON.stringify({ firstName: 'Joe' }));
        });
    });

    it('sets headers correctly', () => {
        const connector = createBackendConnector();
        return connector.read({ url: '/api/object/update/', httpMethod: 'patch', headers: { userToken: 'x62bkdds62' } })
        .then((response) => {
            expect(response.request.requestHeaders.userToken).toBe('x62bkdds62');
        });
    });

    it('axios config set correctly', () => {
        const connector = createBackendConnector({
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
        });

        return connector.read({ url: '/api/list/', httpMethod: 'get', headers: { 'user-token': 'Ok' } })
        .then((response) => {
            expect(response.config.xsrfCookieName).toBe('csrftoken');
            expect(response.config.xsrfHeaderName).toBe('X-CSRFToken');
        });
    });

    it('axios headers overwrite', () => {
        const connector = createBackendConnector({
            headers: { Accept: 'application/json' }
        })

        return connector.read({ url: '/api/list/', httpMethod: 'get', headers: { userToken: 'x62bkdds62' } })
        .then((response) => {
            expect(response.request.requestHeaders.userToken).toBe('x62bkdds62');
            expect(response.request.requestHeaders.Accept).toBe('application/json');
        });
    })

    it('handles baseURL', () => {
        const connector = createBackendConnector({
            baseURL: '/api/',
        });

        return connector.read({ url: '/list/', httpMethod: 'get', headers: { 'user-token': 'Ok' } })
        .then((response) => {
            expect(response.status).toEqual(200);
        });
    });

    it('handles validation error correctly', () => {
        const connector = createBackendConnector();
        return connector.create({ url: '/api/error/validation', httpMethod: 'post' })
        .catch((response) => {
            expect(response.status).toEqual(400);
            expect(response.data).toEqual('validation error');
        });
    });
});
