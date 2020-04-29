const http = require('http');
const assert = require('assert');

function testCreateUserRequestWithStatusCode(requestData, expectedStatus : string, done) {
  const postData = JSON.stringify(requestData);

  const postOptions = {
    hostname: 'localhost',
    path: '/users/create',
    port: 3005,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = http.request(postOptions, (res) => {
    res.setEncoding('utf8');

    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      assert.strictEqual(expectedStatus, data);
      done();
    });
  });

  request.on('error', (e) => {
    console.log('error with http request');
    console.log(e);
  });

  request.write(postData);
  request.end();
}

describe('Create user', () => {

  describe('when the user name is not present in the request', () => {
    it('returns a 400 status code', (done) => {
      testCreateUserRequestWithStatusCode({user_email : 'test_email'}, 'Bad Request', done);
    })
  })

  describe('when the user email is not present in the request', () => {
    it('returns a 400 status code', (done) => {
      testCreateUserRequestWithStatusCode({user_name : 'eric'}, 'Bad Request', done);
    })
  })

  describe('When the user name is already existing', () => {
    it('Returns a 470 status code', (done) => {
      testCreateUserRequestWithStatusCode({user_name : 'eric', user_email : 'test_email'}, '470', done);
    })
  })

  describe('When the user email is already existing', () => {
    it('Returns a 471 status code', (done) => {
      testCreateUserRequestWithStatusCode({user_name : 'test_user', user_email : 'yuliya@gmail'}, '471', done);
    })
  })

  describe('when the request object is null', () => {
    it('returns a 400 status code', (done) => {
      const postOptions = {
        hostname: 'localhost',
        path: '/users/create',
        port: 3005,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const request = http.request(postOptions, (res) => {
        res.setEncoding('utf8');

        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          assert.strictEqual('Bad Request', data);
          done();
        });
      });

      request.on('error', (e) => {
        console.log('error with http request');
        console.log(e);
      });

      request.end();
    })
  })
})
