import Downloader from './downloader.js';

const loopydonuts = {
  slug: 'loopydonuts',
  token: 'QmZrvjYcwZ4P5DMiY4Gv9T8W1Pf7DuLpqc6JSdmKxG3n6h',
  tokenURISuffix: '.json',
};

const mfers = {
  slug: 'mfers',
  token: 'QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo',
  tokenURISuffix: '',
};

const gobz = {
  slug: 'gobz',
  token: 'QmeKYX98bWX4F7vsqoW98gWbjXKAwd5mj9cuPWfRrVuB3k',
  tokenURISuffix: '',
};

// change it to the nft object you want

const d = new Downloader(loopydonuts);

// you can setDebug(true | false)
// you can setSilent() No debug logs
// you can setVerbose() All debug logs
d.setVerbose();

// fetch one item
d.fetch(1);

// fetch a list of specific items
// d.fetchList([3, 5, 8]);

// fetch a number range
// d.fetchRange(5, 10);
