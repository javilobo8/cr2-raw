'use stict';
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

/**
 * read-buffer
 *
 * @param {string|Buffer} file
 * @returns {Promise<object>} object with read and copy
 */
async function init(file) {
  let data;

  if (Buffer.isBuffer(file)) {
    data = file;
  } else if (typeof file === 'string') {
    data = await readFileAsync(file);
  } else {
    throw new Error('Unsupported file input');
  }

  function read(offset, type, count) {

    const arrayBuffer = fillBuffer(offset, type.bytes * count);

    return type.getValue(arrayBuffer);
  }

  function copy(offset, count) {
    const newData = [];

    for (let i = 0, p = offset; i < count; i++, p++) {
      newData[i] = data[p];
    }

    return newData;
  }

  function fillBuffer(offset, size) {
    const arrayBuffer = new ArrayBuffer(size);

    const ta = new Uint8Array(arrayBuffer);

    for (let i = 0; i < ta.length; i++) {
      ta[i] = data[offset + i];
    }

    return arrayBuffer;
  }

  return {
    read,
    copy,
  }
}

module.exports = init;
