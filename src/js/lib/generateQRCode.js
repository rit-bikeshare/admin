import { createSelector } from 'reselect';
import logo from '../../img/logo.png';
import QRCode from 'qrcode';

async function generateQRCode(data) {
  const qrData = await QRCode.toString(`check-out/${data.id}`, {
    rendererOpts: {
      quality: 1,
    },
  });
  const canvas = document.createElement('canvas');
  canvas.width = 1845;
  canvas.height = 1050;

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
  image.src = `data:image/svg+xml,${qrData}`;
  await imagePromise;
  ctx.drawImage(image, 0, 0, 900, 900);

  ctx.font = '450px Helvetica';
  ctx.fillText(data.id, canvas.width / 2 + (canvas.width - 900) / 2, 675);

  ctx.font = '72px Helvetica';
  ctx.fillText(
    'Download the RIT BikeShare app, Scan, and Ride',
    canvas.width / 2,
    900
  );

  const logoImage = new Image();
  let logoCallback;
  const logoPromise = new Promise(resolve => (logoCallback = () => resolve()));
  logoImage.onload = logoCallback;
  logoImage.src = logo;
  await logoPromise;
  ctx.drawImage(logoImage, 900, 117, 828, 161);

  return canvas.toDataURL('image/jpeg', 1);
}

export default createSelector(data => data, generateQRCode);
