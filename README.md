OrangeeJS is a cross platform framework to developer smart tv apps. It
is based upon html5 and other js libraries including backbone/marionette.

Its command line interface is tested with Mac only, and some of them
(when replying on external program) may not work with other OS.

Example app build with orangeejs:
https://github.com/orangeejs/orangeeplayer

Install
====
install virtual pc 4.2 (lg does not support 4.3)

install samsung smart tv sdk

install lg smart tv sdk

For ios development, you need a mac computer with latest version of XCode.

For android devlopment, make sure you have the latest Android SDK installed, 
add "android" and "adb" command (inside the tools/ and platform-tools/ folder) to your PATH.
Install Genymotion (a faster android emulator), and create a new device with it.

```bash
npm install -g orangeejs
npm install -g cordova (if you want to use it for ios/android development)
brew install graphicsmagick
brew install ant (for android)
```

Create new project
====

```bash
mkdir projectname
cd projectname
orangeejs init 
orangeejs build samsung
```

Run in emulator
====

```bash
orangeejs run samsung
orangeejs run lg
```

Debug
====

```bash
orangeejs console

Optional:
```

in samsung sdk, import project from build/samsung 

in lg sdk, import project from buidl/lg

Install on samsung as developer
```bash
sudo orangeejs server 80 build/
```

Known issues (TODO move this section to wiki)
====

When developing apps using orangeejs on smart tv, we found the following
issues:

Samsung:

* element.classList does not support multiple parameters
* Function.prototype.bind() does not work

LG: 
* window.scrollTo does not work

