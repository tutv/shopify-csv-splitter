const fs = require('fs');
const path = require('path');
const CSVParser = require('./services/CSVParser');
const CSVWriter = require('./services/CSVWriter');

const _divide = (input) => {
    const file = path.resolve(input);
    const baseName = path.basename(file);
    const ext = path.extname(file);
    const fileName = baseName.replace(ext, '');

    console.log("Start divide file", baseName);

    return CSVParser.parseToPartials(file)
        .then(({partials, header}) => {
            partials.forEach((partial, index) => {
                const fileOutput = path.resolve(__dirname + `/../output/${fileName}-part-${index}.csv`);

                CSVWriter.write({rows: partial, header, file: fileOutput});
            });

            console.log('DONE:', baseName);

            return Promise.resolve(true);
        })
        .catch(error => {
            console.log(error);

            return Promise.reject(error);
        });
};

const files = fs.readdirSync(__dirname + "/../temp");

const _run = (index) => {
    const fileName = files[index];
    const file = __dirname + `/../temp/${fileName}`;

    return _divide(file)
        .then(() => {
            if (index < files.length - 1) {
                return _run(index + 1);
            }

            return Promise.resolve(true);
        });
};

_run(0);