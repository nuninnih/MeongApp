function dateFormat(value){
    let date = value.toISOString().split('T')[0]
    let hour = ('0' + value.getHours()).slice(-2)
    let minute = ('0' + value.getMinutes()).slice(-2)
    return `${date} ${hour}:${minute}`
}

module.exports = dateFormat