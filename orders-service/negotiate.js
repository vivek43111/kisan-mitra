/**
 * Content Negotiation Middleware & Serializer (A05 Task B1, A06 Task C3)
 */

const { problem } = require('./errors');

function toXml(data, rootName = 'order') {
  if (data === null || data === undefined) return '';
  if (Array.isArray(data)) {
    return `<orders>${data.map(item => toXml(item, 'item')).join('')}</orders>`;
  }
  if (typeof data === 'object') {
    let xml = `<${rootName}>`;
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        xml += `<${key}>${value.map(v => toXml(v, 'item')).join('')}</${key}>`;
      } else if (typeof value === 'object' && value !== null) {
        xml += toXml(value, key);
      } else {
        xml += `<${key}>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>`;
      }
    }
    xml += `</${rootName}>`;
    return xml;
  }
  return String(data);
}

function handleContentNegotiation(req, res, next) {
  const accept = req.headers['accept'] || '*/*';

  // If client specifies an exact media type we don't support
  if (
    accept !== '*/*' &&
    !accept.includes('application/json') &&
    !accept.includes('application/xml') &&
    !accept.includes('text/xml') &&
    !accept.includes('application/*') &&
    !accept.includes('*/*')
  ) {
    return problem(res, {
      status: 406,
      title: 'Not Acceptable',
      detail: `Unsupported Accept format requested: "${accept}". Supported formats are: application/json, application/xml.`,
      type: 'https://kisanmitra.in/errors/not-acceptable'
    });
  }

  next();
}

function sendNegotiated(req, res, statusCode, data) {
  const accept = req.headers['accept'] || 'application/json';

  if (accept.includes('application/xml') || accept.includes('text/xml')) {
    const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(data)}`;
    res.status(statusCode);
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.send(xmlBody);
  }

  res.status(statusCode);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  return res.json(data);
}

module.exports = { handleContentNegotiation, sendNegotiated, toXml };
