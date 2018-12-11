const https = require('https')
const querystring = require('querystring')

class AccessTrade {
    constructor(config = {}) {
        this.handler = https;
        this.baseURL = 'api.accesstrade.vn'
        this.version = 'v1'
        this.timeout = 3000
        this.accessToken = config.accessToken
    }

    getTransactions(options = {}) {
        return this.get('/transactions', options)
    }

    getCampaigns() {
        return this.get('/campaigns')
    }

    getCommissionPolicies(options = {}) {
        return this.get('/commission_policies', options)
    }

    getOrders(options = {}) {
        return this.get('/orders', options)
    }

    getProductDetail(options = {}) {
        return this.get('/product_detail', options)
    }

    getDataFeeds(options = {}) {
        return this.get('/datafeeds', options)
    }

    getOrdersInfomation(options = {}) {
        return this.get('/offers_informations', options)
    }

    getTopProducts(options = {}) {
        return this.get('/top_products', options)
    }

    get(endpoint, params) {
        return this.request({
            method: 'GET',
            endpoint,
            params
        })
    }

    request({ method, endpoint, params }) {
        return new Promise((resolve, reject) => {
            method || 'GET'
            endpoint = endpoint || '/'
            if (method === 'GET' && params) {
                endpoint += `?${querystring.parse(params)}`
            }
            let options = {
                hostname: this.baseURL,
                method: method,
                path: `/${this.version}${endpoint}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${this.accessToken}`
                }
            }
            let req = this.handler.request(options, (res) => {
                let raw = ''
                res.on('data', (chunk) => {
                    raw += chunk
                })
                res.on('end', function () {
                    if (res.statusCode !== 200) {
                        reject(new Error(res.statusMessage))
                        return
                    }
                    resolve(JSON.parse(raw))
                })
                res
            })
            req.on('error', (err) => {
                reject(new Error(err.message))
            })
            req.setTimeout(this.timeout, () => {
                req.abort()
            })
            if (params) {
                req.write(JSON.stringify(params))
            }
            req.end()
        })
    }
}

exports.AccessTrade = AccessTrade