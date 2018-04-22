import { createSelector } from 'reselect';
import logo from '../../img/logo.png';
import QRCode from 'qrcode';

async function generateQRCode(data) {
  const qrData = await QRCode.toDataURL(`check-in/${data.id}`, {
    rendererOpts: {
      quality: 1,
    },
  });
  const canvas = document.createElement('canvas');
  canvas.width = 1230;
  canvas.height = 700;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';

  const image = new Image();
  let imageCallback;
  const imagePromise = new Promise(
    resolve => (imageCallback = () => resolve())
  );
  image.onload = imageCallback;
  image.src = qrData;
  await imagePromise;
  ctx.drawImage(image, 0, 0, 600, 600);

  ctx.font = '288px Helvetica';
  ctx.fillText(data.id, canvas.width / 2 + (canvas.width - 600) / 2, 458);

  ctx.font = '48px Helvetica';
  ctx.fillText(
    'Download the RIT BikeShare app, Scan, and Ride',
    canvas.width / 2,
    647
  );

  const logoImage = new Image();
  let logoCallback;
  const logoPromise = new Promise(resolve => (logoCallback = () => resolve()));
  logoImage.onload = logoCallback;
  logoImage.src = logo;
  await logoPromise;
  ctx.drawImage(logoImage, 600, 64, 590, 114);

  return canvas.toDataURL('image/jpeg', 1);
}

export default createSelector(data => data, generateQRCode);
