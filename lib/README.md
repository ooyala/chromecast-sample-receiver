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

## Customization
The receiver has a series of information that can/should be updated in order to reflect your brand preferences.

| Name             | Type   | Default                 | Description                    |
|------------------|--------|-------------------------|--------------------------------|
| logLevel         | string | warn                    | This set the level of the messages to show at the developer console. It can be any of the following values: <ul><li>trace</li><li>debug</li><li>warn</li><li>error</li></ul> There is more information about this at the __Debug__ section below.| 
| skin             | object | `{}`                    | Here you can customize the appearance of the player UI. For more information please visit the ooyala documentation at https://help.ooyala.com/video-platform/concepts/pbv4_customize.html and check the `inline` option which used to override the default values. |




## Build
Once you get the above information then you can proceed to build the project:

1. Update the file `config.json` if you need to do some customatization.
2. Go to the command line at the root of the project and run the following:
    ```shell
    $ npm run build
    ```
3. The `dist` folder will containt the modified files with your config preferences. All the files are ready now to be deployed to your sandbox or target env.

## Deployment

You can deploy the cast library to the following env:
- Sandbox:
    ```
    make deploy/sandbox SANDBOX=your_sandbox_name
    ```
    this will produce a url similar to:
    ```
    https://player.ooyala.com/static/chromecast/sandbox/your_sandbox/cast.min.js
    ```
- Staging:
    ```
    make deploy/staging
    ```
    this will produce a url similar to:
    ```
    https://player.ooyala.com/static/chromecast/staging/cast.min.js
    ```
- Version:
    ```
    make deploy/version VERSION=your_version
    ```
    this will produce a url similar to:
    ```
    https://player.ooyala.com/static/chromecast/vX.X.X/cast.min.js
- Latest:
    ```
    make deploy/latest
    ```
    this will produce a url similar to:
    ```
    https://player.ooyala.com/static/chromecast/latest/cast.min.js
    ```


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





