'use stict';
const fs = require('fs');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);

/**
 * read-buffer
 *
 * @param {string} filePath
 * @returns {Promise<object>} object with read and copy
 */
async function init(filePath) {
  const data = await readFileAsync(filePath);

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
