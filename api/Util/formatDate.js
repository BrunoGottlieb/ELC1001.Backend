const moment = require('moment');
module.exports = function convertDate(dataString) {
    const aux = moment(dataString, "YYYY-MM-DD")
    return aux;
}