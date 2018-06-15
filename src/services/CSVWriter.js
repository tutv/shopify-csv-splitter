const fs = require('fs');
const stringify = require('csv-stringify/lib/sync');

exports.write = ({rows, header, file}) => {
    const fileStream = fs.createWriteStream(file, {
        encoding: 'utf8'
    });

    const str = stringify([], {
        header: true,
        columns: header,
        delimiter: ',',
        eof: true
    });

    fileStream.write(str);

    rows.forEach(row => {
        const str = stringify([row], {
            delimiter: ',',
            eof: true,
        });

        fileStream.write(str);
    });
};