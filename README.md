# Chromecast Receiver + Ooyala Player v4
This repository contains the implementation of Google cast sdk as a receiver for video playback through Chromecast devices. It has an adaptation of Ooyala Player v4.

## Prerequisites
- Read the developer documentation at http://support.ooyala.com/developers/documentation/concepts/chromecast_and_ooyala.html
- Facilitate your own hosting infrastructure for receiver applications (you must set up CORS enablement on the CDN you use for content serving)
- Register your receiver HTML with [Google Cast Registration](https://cast.google.com/u/0/publish/#/signup)
- For iOS, view the sample Chromecast Sender [iOS App](https://github.com/ooyala/ios-sample-apps/tree/master/ChromecastSampleApp)
- For Android, view the sample Chromecast Sender [Android App](https://github.com/ooyala/android-sample-apps/tree/master/ChromecastSampleApp)
- Purchase a Chromecast device

## Customization
The receiver on his default state has the Ooyala logo as the splash screen, in order to use your own brand image you need to do the following:

1. Add your new image at the `images` folder.
2. Update the `receiver.html` file and update the `img` tag at the `src` attribute with your image filename.
    ```html
    <div id="splash-screen" class="fbox-container fs">
        <img id="splash-image" src="images/logo.svg" />
        <div id="status-cast">
        </div>
    </div>    
    ```

## Debug
This receiver has enabled several logs in order to show error and warning messages that could be produced during the life cycle of the receiver. This log messages are printed at the developer tool console.

To debug a receiver application please refer to the official documentation at https://developers.google.com/cast/docs/debugging





