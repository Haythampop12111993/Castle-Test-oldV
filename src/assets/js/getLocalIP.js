function findLocalIp(logInfo) {
  new Promise(function(resolve, reject) {
    window.RTCPeerConnection =
      window.RTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
    if (typeof window.RTCPeerConnection == 'undefined')
      return reject('WebRTC not supported by browser');
    var pc = new RTCPeerConnection();
    var ips = [];
    pc.createDataChannel('');
    pc.createOffer()
      .then(function(offer) {
        pc.setLocalDescription(offer);
      })
      .catch(function(err) {
        reject(err);
      });
    pc.onicecandidate = function(event) {
      if (!event || !event.candidate) {
        // All ICE candidates have been sent.
        if (ips.length == 0)
          return reject('WebRTC disabled or restricted by browser');
        return resolve(ips);
      }
    };
  });
}
