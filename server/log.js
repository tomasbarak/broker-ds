const fs = require('fs');

module.exports.ack = (data) => {
    //Append to file
    let new_data_arr = [];
    const timestamp = new Date().getTime();
    data.timestamp = timestamp;
    if (!fs.existsSync('./ack.log')) {
        new_data_arr.push(data);
        fs.writeFileSync('./ack.log', JSON.stringify(new_data_arr, null, 2));
    } else {
        let prev_data = fs.readFileSync('./ack.log');
        new_data_arr = JSON.parse(prev_data);
        new_data_arr.push(data);
        fs.writeFileSync('./ack.log', JSON.stringify(new_data_arr, null, 2))
    }
}