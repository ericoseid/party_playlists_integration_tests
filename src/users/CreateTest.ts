const http = require('http');
const assert = require('assert');

interface CreateUserRequest {
  user_name : string;
  user_email : string;
}

function testCreateUserRequestWithStatusCode(requestData : CreateUserRequest, expectedStatus : string) {
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
  describe('When the user name is already existing', () => {
    it('Returns a 470 status code', () => {
      testCreateUserRequestWithStatusCode({user_name : 'eric', user_email : 'test_email'}, '470');
    })
  }),

  describe('When the user email is already existing', () => {
    it('Returns a 471 status code', () => {
      testCreateUserRequestWithStatusCode({user_name : 'test_user', user_email : 'yuliya@gmail'}, '471');
    })
  })
})
