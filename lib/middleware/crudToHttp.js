'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = crudToHttp;

var defaultMapping = {
    create: 'post',
    read: 'get',
    update: 'patch',
    delete: 'delete'
};

function crudToHttp(httpMethodMapping) {
    var crud2http = Object.assign({}, defaultMapping, httpMethodMapping);

    return function crudToHttpMiddleware(next) {
        return {
            create: function create(req) {
                req.httpMethod = crud2http.create;return next.create(req);
            },
            read: function read(req) {
                req.httpMethod = crud2http.read;return next.read(req);
            },
            update: function update(req) {
                req.httpMethod = crud2http.update;return next.update(req);
            },
            delete: function _delete(req) {
                req.httpMethod = crud2http.delete;return next.delete(req);
            }
        };
    };
}