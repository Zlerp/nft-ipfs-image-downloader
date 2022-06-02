const fs = require('fs');
const axios = require('axios');


// Gobz
// QmeKYX98bWX4F7vsqoW98gWbjXKAwd5mj9cuPWfRrVuB3k

//mfers 
// QmWiQE65tmpYzcokCheQmng2DCM33DEhjXcPB6PanwpAZo

const ipfsURI = "https://ipfs.io/ipfs/"
const tokenUri = ipfsURI + "QmeKYX98bWX4F7vsqoW98gWbjXKAwd5mj9cuPWfRrVuB3k/";
const tokenCount = 9999;

const download_image = async (url, image_path) => {
  const response = await axios({
    url,
    responseType: 'stream',
  })

  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream("./generated/" + image_path))
      .on('finish', () => resolve())
      .on('error', e => reject(e));
  });

}

async function go() {
  for (x = 22; x < tokenCount; x++) {
    console.log("Token " + x);
    const response = await axios.get(tokenUri + x)
    console.log(`statusCode: ${response.status}`);
    const data = response.data;
    const imgIpfsUrl = data.image;
    const imageAddress = imgIpfsUrl.replace('ipfs://', '');
    const imgUrl = ipfsURI + imageAddress;
    console.log(x, imgUrl);
    await download_image(imgUrl, x + ".png");
  }
}

(async function () {
  await go();
})()



