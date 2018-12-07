/**
 * @file elasticsearchCat
 * @author Lewey
 * @description retrieve health stats
 **/

const elasticsearch = require('elasticsearch');
const esconfig = require('../config/config');
const esclient = new elasticsearch.Client({
    host: esconfig.elasticsearch.host
});

/**
 *
 **/

module.exports = async function (type) {

    let res = '';

    switch(type) {
        case 'indicies':
            res = await esclient.cat.indices({
                v: true
            });
            break;
        case 'nodes':
            res = await esclient.cat.nodes({
                v: true
            });
            break;
        case 'health':
            res = await esclient.cat.health({
                v: true
            });
            break;
    }

    return res

};

