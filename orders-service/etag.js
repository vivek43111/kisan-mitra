/**
 * ETag & Conditional Request Handler (A05 Tasks B4, C1, C2)
 */

const crypto = require('crypto');
const { problem } = require('./errors');

function generateETag(data) {
  const serialized = typeof data === 'string' ? data : JSON.stringify(data);
  const hash = crypto.createHash('sha1').update(serialized).digest('hex').substr(0, 16);
  return `"${hash}"`;
}

function handleConditionalRead(req, res, representation) {
  const etag = generateETag(representation);
  res.setHeader('ETag', etag);
  res.setHeader('Cache-Control', 'public, max-age=60, must-revalidate');

  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch) {
    const cleanClient = ifNoneMatch.replace(/^W\//, '').trim();
    if (cleanClient === etag || cleanClient === '*') {
      res.status(304).end();
      return true; // handled
    }
  }
  return false; // proceed to 200
}

function checkConditionalWrite(req, res, currentRepresentation) {
  const ifMatch = req.headers['if-match'];
  if (!ifMatch) {
    problem(res, {
      status: 428,
      title: 'Precondition Required',
      detail: 'This state-modifying write requires an If-Match header to prevent mid-air collision overwrites.'
    });
    return false;
  }

  const currentETag = generateETag(currentRepresentation);
  const cleanClient = ifMatch.replace(/^W\//, '').trim();

  if (cleanClient !== currentETag && cleanClient !== '*') {
    problem(res, {
      status: 412,
      title: 'Precondition Failed',
      detail: `The resource has been modified by another request. Current ETag is ${currentETag}, your provided If-Match was ${ifMatch}.`
    });
    return false;
  }

  return true;
}

module.exports = { generateETag, handleConditionalRead, checkConditionalWrite };
