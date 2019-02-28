# Chromecast Receiver + Ooyala Player v4
This repository contains the implementation of Google cast sdk as a receiver for video playback through Chromecast devices. It has an adaptation of Ooyala Player v4. 

## Prerequisites
- Read the developer documentation at http://help.ooyala.com/video-platform/concepts/chromecast/index.html
- Facilitate your own hosting infrastructure for receiver applications (you must set up CORS enablement on the CDN you use for content serving)
- Register your receiver HTML with [Google Cast Registration](https://cast.google.com/u/0/publish/#/signup)
- For iOS, view the sample Chromecast Sender [iOS App](https://github.com/ooyala/ios-sample-apps/tree/master/ChromecastSampleApp)
- For Android, view the sample Chromecast Sender [Android App](https://github.com/ooyala/android-sample-apps/tree/master/ChromecastSampleApp)
- Purchase a Chromecast device

## Getting started
To start using custom receiver you need to call [`OOCast.init()`](#oocast) method to initialize the receiver. If you don't want to apply any customization - call the method without any parameters and you should be good to go.
If you want to customize the receiver - consult with [Customization section](#customization).

> Note: please note that it is crucial to call `OOCast.init()` method in order for receiver to work properly

## Flow transition between screens

| screen              | transitions to              | description                                                                                 |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `splash screen` | `loading screen`    | A splash screen consists of a window containing a logo, and the current status of the chromecast receiver. Logo can be changed as described in [Basic customization section](#basic)       |
| `loading screen`        | `playing screen`    | A loading screen consists of a loading spinner indicating that content is being loaded into the player. Can't be modified. |
| `playing screen`        | `end screen`    | A playing screen is controlled by `Player V4`. Can be modified following [Advanced customization section](#advanced). |
| `end screen`        |   -   | An end screen indicates that content has stopped playing. |


## Customization

### Basic
Basic customization only includes altering SplashScreen UI by altering `receiver.html`. 
Out of the box it it only possible to change the logo.

If you need to customize `Player V4` appearance, consult with [Advanced section](#Advanced) 

#### Changing the logo
The receiver on his default state has the Ooyala logo as the splash screen, in order to use your own brand image you need to do the following:

1. Add your new image at the `images` folder.
2. Update the `receiver.html` file and update the `img` tag at the `src` attribute with your image filename.
    ```html
    <!-- Splash screen container -->
    <!-- Splash screen is the screen that is displayed before the actual cast starts -->
    <!-- It can display a logo and a status -->
    <div id="splash-screen" class="fbox-container fs">
        <!-- Logo image that will be displayed on the splash screen -->
        <!-- Having this element on the page is required to display the logo -->
        <img id="splash-image" src="images/logo.svg" />
        
        <!-- Chromecast status container that will display the status on splash screen -->
        <!-- Having this element on the page is required to display the status -->
        <div id="status-cast">
        </div>
    </div>   
    ```
### Advanced

Advanced receiver customization is supported by modifying `receiver.html` and specifying parameters for `OOCast.init` method. 

> Note there should be only one call to `OOCast.init` method in your code, otherwise the receiver might not work properly. 

#### Example

```javascript
var pageLevelParams = {

    pcode: "pleaseFillTheRightPcode",

    playerBrandingId: "pleaseFillTheRightPlayerId", 

    skin: {
        inline: {
            pauseScreen: {
                showDescription: false
            }
        }
    },
    
    onCreate: player =>
        player.mb.subscribe(
            '*', // Name of event to subscribe  to
            'cast-sample-app', // Namespace to subscribe to
            (event, parameters) => { // Event handler
                console.log(`Notification about ${event} with the following parameters ${parameters}`);
            }
        )
};

OOCast.init(
    'urn:x-cast:ooyala',
    pageLevelParams
);
```

#### Fill codes
Replace pleaseFillTheRightPlayerId and pleaseFillTheRightPcode with your BrandingId and PCode. Otherwise it will cause an issue such as analytics.


#### OOCast
`OOCast` namespace exposes one method - `init` which has the following signature
```javascript
function init(namespace: string, pageLevelParameters: PageLevelParameters): void;
```

| parameter              | type              | description                                                                                 |
| ---------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `namespace` | `string`    | specifies the namespace passed to `castManager.getCastMessageBus` function          |
| `pageLevelParameters`        | `PageLevelParameters`    | specifies custom embedded parameters passed to `OO.Player.create` method|


#### namespace
If you want to listen to events other than media events from sender application you can specify a custom namespace. 

```javascript
OOCast.init('urn:x-cast:mycustomnamespace')
```

> Warning: To communicate through your custom namespace both sender and receiver code should be altered with this namespace

> Note: All custom namespaces should be prefixed by `urn:x-cast:` and followed by any string. For example `urn:x-cast:mycustomnamespace` is a valid namespace.

> Note: Altering media namespace is not supported, as both sender and receiver applications use `urn:x-cast:com.google.cast.media` namespace.

#### Omitting the namespace
It is possible to not specify a namespace here, by passing `null` to `OOCast.init`.
```javascript
OOCast.init(null)
``` 
that way it will fallback to `urn:x-cast:ooyala` default namespace.
More on [namespaces](https://developers.google.com/cast/docs/custom_receiver#namespace--protocols) in google docs.

#### pageLevelParameters
Specifying parameters in `OOCast.init` method allows to pass embedded parameters to the `OO.Player.create` method which gets called internally by `OOCast`. These parameters include CSS style settings such as width and height, and other parameters such as tags from your ad server or ad network account used for advanced ad tracking and targeting. 
To read more on available parameters - visit the [Page-level Parameters for Player V4](http://help.ooyala.com/video-platform/api/pbv4_api_embedparams.html)
 in the docs.

#### Listening on Player V4 events
For example you may want to specify a custom listener for `Player V4` events - pass a function to `onCreate` page level parameter like so
```javascript
var pageLevelParameters = {
    onCreate: player => 
        player.mb.subscribe(
            '*',
            'cast-sample-app',
            (event, parameters) => {
                console.log(`Notification about ${event} with the following parameters ${parameters}`);
            }
        )
}
```

and then call `init` method on `OOCast` namespace - 
```javascript
OOCast.init(
    'urn:x-cast:ooyala',
    pageLevelParameters
);
```

#### Altering the skin
You may want to change the style of `Player V4` - then pass a custom skin object to `skin.inline` in parameters. For example if you want to specify a custom watermark to be displayed on a player 
```javascript
var pageLevelParameters = {
    skin: {
        inline: {
            general: {
                watermark: {
                    imageResource: {
                        url: "https://dl.dropbox.com/s/kdo5hlgg2i3ptv0/ooyala-logo.png"
                    },
                    clickUrl: "http://www.ooyala.com"
                }
            }
        }
    }
}
```

and then pass the parameters to `init` method on `OOCast` namespace - 
```javascript
OOCast.init(
    'urn:x-cast:ooyala',
    pageLevelParameters
);
```

More info on customizing the player appearance using `skin` parameter can be found in the docs section [Customizing the Player V4 Skin with skin.json](http://help.ooyala.com/video-platform/reference/pbv4_skin_schema_docs.html)

## Migration

With the new version you need to call `OOCast.init()` method in order for receiver to work properly.

### Basic logo and text customization via receiver.html
Please consult with [Basic customization](#basic) section of the docs.

### Skin customization via skin.json
Custom `skin.json` files were deprecated with the new version, appearance customization using custom `skin.json` now is available through page level parameters, please consult with [Altering the skin](#altering-the-skin) section.

## Debug
This receiver has enabled several logs in order to show error and warning messages that could be produced during the life cycle of the receiver. This log messages are printed at the developer tool console.

To debug a receiver application please refer to the official documentation at https://developers.google.com/cast/docs/debugging

## Serving receiver.html from local machine
For debugging you might be willing to serve receiver.html from your local machine. To do this follow these steps:
1. Define what is your IP in you local network (must be the same as Chromecast device)
2. Register in Google new application and set it looking onto your local IP: https://cast.google.com/publish/#/overview. Remeber the APP ID you'll get.
3. Create the file in `lib` folder: `.env` with the content:
```
SERVER_IP=___YOUR_IP_HERE____
SERVER_PORT=8080
```
4. Run `npm start`; ensure you can reach: http://___YOUR_IP_HERE____:8080/receiver.html
5. Run your chromecast sender and set APP ID the one you've got on second step
6. Enjoy!

