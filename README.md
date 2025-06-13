# LibrePhotos Browser Extension
This is a browser extension for Chromium- and Gecko-based browsers
(i.e., including Chrome and Firefox) that adds a few features to
LibrePhotos websites as you browse them.

## Testing
We have tested the extension successfully with Gecko- and Chromium-based browsers on Linux desktop. We will test other OS soon. We have not yet enabled features for mobile browser apps.

## Features
We currently support only one feature:
- Fullscreen mode when browsing the gallery

We are planning to add the features below:
- Slideshow

These are features that are missing from the official LibrePhotos
frontend. We hope they'll one day be added to the main frontend code,
but for the time being, adding them through this browser extension
should work.

Note that for some there are feature requests to the LibrePhotos core
repo:
* [Fullscreen Button](https://github.com/LibrePhotos/librephotos/issues/1139)

## How To Use

After installing the extension, go to your LibrePhotos website or any other page with an image and do a right-click on an image. Select the "Set LibrePhotos URL" option:
![2025-06-09_21-07](https://github.com/user-attachments/assets/76ae88c0-7d94-4005-a1c9-7215bb28c18d)

Use that option to set the domain name of your LibrePhotos website. This will be used for pattern matching, to ensure the extension is activated on your website.
(The extension does not send this--or any other information--anywhere.)
![2025-06-09_21-08](https://github.com/user-attachments/assets/06a9238d-9fa8-4e1a-8942-e6f5061133af)

After setting the URL, go to your LibrePhotos instance, **click on an image** so you enter gallery view mode, and then use the right mouse again to enter full-screen mode:
![2025-06-09_21-10](https://github.com/user-attachments/assets/869c4408-3c35-4bd7-a1a8-0e63e4531f86)

Once you are in full-screen mode, you can use your left and right cursor keys as usual to move between images. You'll stay in full-screen mode.

## Building
Obtain the source code as follows:

```bash
git clone ...
cd librephotos-browser-extension
```

Make sure you have Node.js installed on your system. (On Ubuntu, `sudo apt install nodejs`. On Fedora, `sudo dnf install nodejs`.)

If you are running the builder for the first time, initialize Nodejs and obtain packages:

```bash
npm init -y
npm install archiver glob
```

Then build your browser extension as follows:

```bash
node build-script.js chromium
node build-script.js gecko
```

(If you need only one version, run only one of the two commands.)

The resulting package files will be as follows:

1. **Chromium/Chrome:** `librephotos-browser-extension.zip`
1. **Gecko/Firefox:** `librephotos-browser-extension.xpi`
