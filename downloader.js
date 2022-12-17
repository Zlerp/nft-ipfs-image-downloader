import fs from 'fs';
import axios from 'axios';

const TIMEOUT = 60_000;
const IPFS_URL = 'https://ipfs.io/ipfs/';

class Downloader {
  constructor({ token, slug = 'nft', localPath = './generated/', tokenURISuffix = '.json' }) {
    if (!token) throw new Error('Token must be provided.');

    this.debug = false;
    this.tokenURI = `${IPFS_URL}${token}`;
    this.tokenURISuffix = tokenURISuffix;

    this.slug = slug;
    this.localPath = localPath;
    this.dataPath = `${this.localPath}data/${token}/`;
    this.imagesPath = `${this.localPath}images/${token}/`;

    this.createDirectoryIfNotExists(this.dataPath);
    this.createDirectoryIfNotExists(this.imagesPath);
  }

  setDebug(val) {
    this.debug = !!val;
  }

  setVerbose() {
    this.debug = true;
  }

  setSilent() {
    this.debug = false;
  }

  print(...args) {
    if (!this.debug || !process) return;

    process.stdout.write(`${args.join(' ')}`);
  }

  createDirectoryIfNotExists(directoryPath) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
    } catch (error) {
      if (error.code === 'EEXIST') return;

      throw error;
    }
  }

  async storeData() {
    try {
      const jsonData = JSON.stringify(this.data);
      const path = `${this.dataPath}${this.slug}-${this.id}.json`;

      fs.writeFileSync(path, jsonData);
      return true;
    } catch (e) {
      this.error = e;
      return false;
    }
  }

  async storeImage() {
    const promiseCallback = async (resolve, reject) => {
      this.print(`Waiting for download to start...\r`);

      const imgIpfsUrl = this.data.image;
      const imageAddress = imgIpfsUrl.replace('ipfs://', '');
      this.imgUrl = `${IPFS_URL}${imageAddress}`;

      try {
        const response = await axios({
          url: this.imgUrl,
          responseType: 'stream',
          timeout: TIMEOUT,
        });

        this.downloaded = 0;
        this.total = response.headers['content-length'];

        const path = `${this.imagesPath}${this.slug}-${this.id}.png`;

        response.data
          .on('data', (chunk) => {
            this.downloaded += chunk.length;
            this.percentage = Number.parseInt((this.downloaded * 100) / this.total, 10);
            const eol = this.percentage === 100 ? '\n' : '\r';
            this.print(`Download: ${this.imgUrl}: ${this.percentage}%${eol}`);
          })
          .pipe(fs.createWriteStream(path))
          .on('finish', () => {
            this.print('\r');
            resolve();
          })
          .on('error', (e) => {
            return reject(e);
          });
      } catch (e) {
        return reject(e);
      }
    };
    return new Promise(promiseCallback);
  }

  async fetch(id) {
    try {
      this.id = id;

      this.url = `${this.tokenURI}/${this.id}${this.tokenURISuffix}`;

      this.print(`Fetching: ${this.url} ...\r`);

      const { status, data } = await axios.get(this.url, { timeout: TIMEOUT });
      this.data = data;
      this.status = status;
      this.print(`Fetching: ${this.url} ${status} ...\r`);

      await this.storeData();
      this.print(`Fetching: ${this.url} ${status} Data: OK\n`);

      await this.storeImage();

      // Done!
    } catch (e) {
      this.print(`\nERROR: ${e.message}\n`);
    }
  }

  async fetchRange(start, end) {
    for (let i = start; i <= end; i++) {
      this.print(`Fetching: ${i} ( up to ${end})\n`);

      await this.fetch(i);
    }
  }

  async fetchList(list) {
    for (let i = 0; i < list.length; i++) {
      this.print(`Fetching: ${list[i]} (${list.length - i} items left)\n`);

      await this.fetch(list[i]);
    }
  }
}

export default Downloader;
