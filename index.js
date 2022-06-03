const fs = require('fs');
const axios = require('axios');

// Gobz
// QmeKYX98bWX4F7vsqoW98gWbjXKAwd5mj9cuPWfRrVuB3k

//mfers 
// QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo

const ipfsURI = "https://ipfs.io/ipfs/"
const tokenUri = ipfsURI + "QmeKYX98bWX4F7vsqoW98gWbjXKAwd5mj9cuPWfRrVuB3k/";
const tokenCount = 99;

const download_image = async (url, image_path) => {
  const response = await axios({
    url,
    responseType: 'stream',
  })

  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream("./generated/images/" + image_path))
      .on('finish', () => resolve())
      .on('error', e => reject(e));
  });

}

async function go() {
  for (x = 0; x < tokenCount; x++) {
    console.log(tokenUri + x);
    const response = await axios.get(tokenUri + x);
    console.log(`Token: ${x} | Status: ${response.status}`);
    const data = response.data;
    const imgIpfsUrl = data.image;
    const imageAddress = imgIpfsUrl.replace('ipfs://', '');
    const imgUrl = ipfsURI + imageAddress;
    console.log(x, imgUrl);
    let jsonData = JSON.stringify(data);
    fs.writeFileSync('./generated/json/' + x + '.json', jsonData);
    await download_image(imgUrl, x + ".png");
  }
}

(async function () {
  await go();
})()



