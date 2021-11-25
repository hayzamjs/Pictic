# Pictic
[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

I always waste a lot of time using snipping tool on windows and wanted something simple and easy. Pictic is a very simple screenshot utility that lets you upload to IPFS by using remote nodes or local node or even to your clipboard.

## Screenshots
![IndexPage](https://i.imgur.com/YylP1Pg.png =200x) ![SettingsPage](https://i.imgur.com/V5k7YgX.png =200x) ![About](https://i.imgur.com/moe80FQ.png =200x)


## Installing
Download the latest version from [releases](https://github.com/hayzamjs/pictin/releases). 

## Running from source
```
git clone https://github.com/hayzamjs/pictin
npm install
npm run start
```

## Packaging 
As of right now we're only doing Windows builds (macOS and Linux builds to come soon), the below command will make 2 versions of the windows bundle (one MSI install file and a zip portable one)

```
npm run make
```
## License

Please refer to LICENSE.md

## Credits
[puSSH](https://github.com/teak/puSSH) - For inspiration
[PhilipJovanovic](https://github.com/PhilipJovanovic) For helping me understand how Electron works

## Todo
- [ ] Linux and MacOS builds
- [ ] Better UI
- [ ] Code refactor
- [ ] CI/CD