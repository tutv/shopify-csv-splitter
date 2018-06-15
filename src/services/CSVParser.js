const fs = require('fs');
const parse = require('csv-parse');
const productPerFile = 200;

exports.parseToPartials = (file) => {
    const partials = [];
    let header = [];
    const streamFile = fs.createReadStream(file);

    return new Promise((resolve, reject) => {
        const parser = parse({delimiter: ','}, (error, rows) => {
            if (error) {
                return reject(error);
            }

            header = rows[0];
            const mapProduct = new Map();
            let list = [];

            rows.forEach((row, index) => {
                if (index === 0) {
                    return;
                }

                const handle = row[0];
                if (mapProduct.size <= productPerFile) {
                    list.push(row);
                    mapProduct.set(handle, true);
                } else {
                    partials.push(list);
                    list = [];
                    mapProduct.clear();
                }

                if (index === rows.length - 1) {
                    partials.push(list);
                }
            });

            return resolve({
                partials,
                header
            });
        });

        streamFile.pipe(parser);
    });
};