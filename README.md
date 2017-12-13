# Chromecast Receiver + OOyala Player v4
This repository contains the implementation of Google cast sdk as a receiver for video playback through Chromecast devices. It has an adaptation of OOyala Player v4.

## Prerequisites
- Read the developer documentation at http://support.ooyala.com/developers/documentation/concepts/chromecast_and_ooyala.html
- Facilitate your own hosting infrastructure for receiver applications (you must set up CORS enablement on the CDN you use for content serving)
- Register your receiver HTML with [Google Cast Registration](https://cast.google.com/u/0/publish/#/signup)
- For iOS, view the sample Chromecast Sender [iOS App](https://github.com/ooyala/ios-sample-apps/tree/master/ChromecastSampleApp)
- For Android, view the sample Chromecast Sender [Android App](https://github.com/ooyala/android-sample-apps/tree/master/ChromecastSampleApp)
- Purchase a Chromecast device

## Setup 
Before to proceed to build the receiver, you must have installed the following:
1. Be sure to have installed [nodejs](https://nodejs.org/en/) and [npm](https://www.npmjs.com/)
2. Optionally, you would like to install [yarn](https://yarnpkg.com/en/)
3. Once you have installed the above go to the root of the project and install all de dependencies from the command line as follows: 
    
    - npm:
    ```shell
    $ npm install
    ```
    - yarn:
    ```shell
    $ yarn install
    ```
4. Once the installation of all the dependencies finished you are able to build your project.

## Build
As part of the build process the following is needed:
- Ooyala Plyaer ID (*required*)
- Logo image (*optional, if none is provided then it will use the ooyala logo*)

About the logo image used by the receiver, by default the Ooyala image is provided but you can replace it with any other image that represent your brand by add it into the `assets` directory and change the name in the file: `config.json`

Once you get the above information then you can proceed to build the project:

1. Open the file `config.json` and replace the information with yours:
    ```json
    {
        "playerBrandingId" : "<Place your ooyala player id here>",
        "images": {
            "logo" : "<Place the name of the logo file with extension here e.g. 'logo.svg' or leave the default value>"
        }
    }
    ```
2. Go to the command line at the root of the project and run the following:
    ```shell
    $ npm run build
    ```
3. The `dist` folder will containt the modified files with your config preferences. All the files are ready now to be placed on your hosting infrastructure


## Debug
If you need to debug or get better logs from the receiver app, then you will need to set the debug level on your `config.json` and build again the project.

The are some levels that you can use to debug the receiver app:
- trace
- debug
- info
- warn (*default*)
- error

You are free to add more logs than the provided on the code by using the logger implementation as follows:
```javascript
logger.info("Hi, this is a ingo log")
logger.error("I'm an error message")
```

the logger works like de `console.log` statement, so you can use it with the same behaviour.





