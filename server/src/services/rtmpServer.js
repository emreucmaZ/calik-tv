const NodeMediaServer = require('node-media-server');

let nms = null;

const config = {
  rtmp: {
    port: parseInt(process.env.RTMP_PORT) || 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    allow_origin: '*'
  }
};

const startRtmpServer = () => {
  nms = new NodeMediaServer(config);

  nms.on('preConnect', (id, args) => {
    console.log('[RTMP] Client connecting:', id, args);
  });

  nms.on('postConnect', (id, args) => {
    console.log('[RTMP] Client connected:', id);
  });

  nms.on('doneConnect', (id, args) => {
    console.log('[RTMP] Client disconnected:', id);
  });

  nms.on('prePublish', (id, StreamPath, args) => {
    console.log('[RTMP] Stream starting:', StreamPath);

    // Stream key doğrulama (opsiyonel)
    const streamKey = StreamPath.split('/').pop();
    const expectedKey = process.env.STREAM_SECRET;

    if (expectedKey && streamKey !== expectedKey) {
      console.log('[RTMP] Invalid stream key, rejecting...');
      let session = nms.getSession(id);
      if (session) {
        session.reject();
      }
    }
  });

  nms.on('postPublish', (id, StreamPath, args) => {
    console.log('[RTMP] Stream live:', StreamPath);
  });

  nms.on('donePublish', (id, StreamPath, args) => {
    console.log('[RTMP] Stream ended:', StreamPath);
  });

  nms.run();
  console.log(`[RTMP] Server running on port ${config.rtmp.port}`);

  return nms;
};

const stopRtmpServer = () => {
  if (nms) {
    nms.stop();
    nms = null;
  }
};

const getRtmpServer = () => nms;

module.exports = {
  startRtmpServer,
  stopRtmpServer,
  getRtmpServer
};
