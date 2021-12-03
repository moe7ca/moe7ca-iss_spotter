const request = require('request');
​
const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", (error, response, body) => {
    const res = JSON.parse(body);
    let ip = null;
    if (error || Object.keys(res).length === 0) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    ip = res.ip;
    callback(null, ip);
​
​
  });
};
​
const fetchCoordsByIP = function(ip, callback) {
  request(`https://api.freegeoip.app/json/${ip}?apikey=289956b0-53e9-11ec-b0b9-9b16bfdd41bb` ,(error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP: ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      const latitude = JSON.parse(body).latitude;
      const longitude = JSON.parse(body).longitude;
      let latLong = {
        "latitude": latitude,
        "longitude": longitude,
      };
      callback(null, latLong);
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}` ,(error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS data ${body}`;
      callback(Error(msg), null);
      return;
    } else {
      let response = JSON.parse(body).response;
      callback(null, response);
    }
  });
};

​
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        callback(error, null);
      return;
      }
      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        if (error) {
          callback(error, null);
          return;
        }
​
        callback(null, passTimes);
      });
    });
  });
}
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};