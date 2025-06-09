# LibrePhotos Browser Extension
This is a browser extension for Chromium- and Gecko-based browsers
(i.e., including Chrome and Firefox) that adds a few features to
LibrePhotos websites as you browse them.

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
