const { spawn } = require('child_process');
const StreamLog = require('../models/StreamLog');

class StreamRelay {
  constructor() {
    this.ffmpegProcess = null;
    this.currentStreamLog = null;
    this.isStreaming = false;
    this.currentAccount = null;
  }

  async start(account, inputUrl) {
    if (this.isStreaming) {
      throw new Error('Zaten aktif bir yayın var');
    }

    const outputUrl = `${account.rtmpUrl}${account.streamKey}`;

    // Stream log oluştur
    this.currentStreamLog = await StreamLog.create({
      account: account._id,
      status: 'live',
      startedAt: new Date()
    });

    this.currentAccount = account;

    // SOCKS5 proxy ayarları
    const proxyHost = process.env.SOCKS5_HOST;
    const proxyPort = process.env.SOCKS5_PORT;
    const proxyUser = process.env.SOCKS5_USER;
    const proxyPass = process.env.SOCKS5_PASS;

    // FFmpeg argümanları
    const ffmpegArgs = [
      '-re',           // Gerçek zamanlı okuma
      '-i', inputUrl,
      '-c:v', 'copy',  // Video codec kopyala
      '-c:a', 'aac',   // Audio AAC olarak encode et (Instagram için)
      '-ar', '44100',  // Audio sample rate
      '-b:a', '128k',  // Audio bitrate
      '-f', 'flv'      // FLV formatı
    ];

    // Proxy varsa ekle (RTMP over SOCKS5)
    if (proxyHost && proxyPort) {
      let proxyUrl = `socks5://${proxyHost}:${proxyPort}`;
      if (proxyUser && proxyPass) {
        proxyUrl = `socks5://${proxyUser}:${proxyPass}@${proxyHost}:${proxyPort}`;
      }
      ffmpegArgs.push('-socks', proxyUrl);
      console.log(`[PROXY] SOCKS5 kullanılıyor: ${proxyHost}:${proxyPort}`);
    }

    // RTMPS için output URL
    ffmpegArgs.push(outputUrl);

    console.log(`[RELAY] Yayın başlatılıyor: ${outputUrl.substring(0, 50)}...`);

    // FFmpeg ile relay başlat
    this.ffmpegProcess = spawn('ffmpeg', ffmpegArgs);

    this.isStreaming = true;

    this.ffmpegProcess.stdout.on('data', (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    this.ffmpegProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    this.ffmpegProcess.on('close', async (code) => {
      console.log(`FFmpeg process exited with code ${code}`);
      await this.handleStreamEnd(code !== 0 ? 'error' : 'ended');
    });

    this.ffmpegProcess.on('error', async (error) => {
      console.error(`FFmpeg error: ${error.message}`);
      await this.handleStreamEnd('error', error.message);
    });

    return this.currentStreamLog;
  }

  async stop() {
    if (!this.isStreaming || !this.ffmpegProcess) {
      throw new Error('Aktif yayın yok');
    }

    this.ffmpegProcess.kill('SIGTERM');
    return await this.handleStreamEnd('ended');
  }

  async handleStreamEnd(status, errorMessage = null) {
    this.isStreaming = false;
    this.ffmpegProcess = null;

    if (this.currentStreamLog) {
      this.currentStreamLog.status = status;
      this.currentStreamLog.endedAt = new Date();
      if (errorMessage) {
        this.currentStreamLog.errorMessage = errorMessage;
      }
      await this.currentStreamLog.save();

      const log = this.currentStreamLog;
      this.currentStreamLog = null;
      this.currentAccount = null;
      return log;
    }
  }

  getStatus() {
    return {
      isStreaming: this.isStreaming,
      currentAccount: this.currentAccount,
      streamLog: this.currentStreamLog
    };
  }
}

// Singleton instance
const streamRelay = new StreamRelay();
module.exports = streamRelay;
