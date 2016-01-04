# chromecast-sample-receiver
This is the repository that contains an open-source Ooyala Chromecast sample receiver. This application should not be used for testing or evaluating Ooyala capabilities.

## Prerequisites
- Read the developer documentation at [http://support.ooyala.com/developers/documentation/concepts/chromecast_and_ooyala.html](http://support.ooyala.com/developers/documentation/concepts/chromecast_and_ooyala.html)
- Facilitate your own hosting infrastructure for receiver applications (you must set up CORS enablement on the CDN you use for content serving)
- Register your receiver HTML with Google at [Google Cast Registration](https://cast.google.com/u/0/publish/#/signup)
- For iOS, view the sample Chromecast Sender [iOS App](https://github.com/ooyala/ios-sample-apps/tree/master/ChromecastSampleApp)
- For Android, view the sample Chromecast Sender [Android App](https://github.com/ooyala/android-sample-apps/tree/master/ChromecastSampleApp)
- Purchase a Chromecast device

See [http://support.ooyala.com/developers/documentation/concepts/chromecast_prerequisites.html](http://support.ooyala.com/developers/documentation/concepts/chromecast_prerequisites.html) for details.

##Creating an Integrated Receiver Application
Use the following steps to create an integrated receiver application:

1. If you want to use a receiver as-is (that will have Ooyala branding), go to https://github.com/ooyala/chromecast-sample-receiver and open receiver_default.html. If you want to make UI and other customizations to your receiver, go to https://github.com/ooyala/chromecast-sample-receiver and open receiver_custom.html.
2. Host the receiver HTML page on your server.
3. Register your receiver HTML page in the Google Cast SDK developer console at Google Cast SDK Developer Console.
4. Retrieve the receiver application ID from the Google Cast SDK developer console.
5. Put the receiver application ID into the sender application code.

## Using the Sample App Repository for filing support issues
If you have a bug within your own application, the Sample repository is a great way to help isolate the issue to Ooyala code. We recommend the following debugging steps.

1. Isolate the bug to the Ooyala Sample repo.
  1. Clone the Sample repository onto your computer.
  1. Modify one of the samples as necessary to simulate your application's behavior.
  1. Host and register the receiver sample app.
1. If you were able to successfully isolate the issue to our sample app, provide us the repo with your changes.
  1. Provide the Receiver APP ID when you create a ticket to Ooyala Support.

## Reporting bugs in the Sample App Repo
If you find issues with one of the examples or find issues with video playback, please file a bug with Ooyala Support through the Ooyala Support Portal at http://support.ooyala.com/developers/contact.

## Caveats
Not all of the Ooyala functionality is represented in this repository. We are constantly adding and updating content with the intention of demonstrating as many of our features as possible. If you would like to see something added, please speak to your Ooyala point of contact or Technical Support.

We do not recommend testing on any branch that is not master. These branches are not verified to be working as expected.

Thank you for reading!