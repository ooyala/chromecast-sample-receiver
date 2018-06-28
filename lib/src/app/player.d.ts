declare namespace player {
    type EncodingPriority =
        | 'hls'
        | 'dash'
        | 'mp4'
        | 'hds'
        | 'ima'
        | 'akamai_hd2_hds'
        | 'akamai_hd2_vod_hds'
        | 'dash_drm'
        | 'dash_hls'
        | 'AKAMAI_HD2_VOD_HLS';

    interface InitialBitrate {
        level?: 'auto' | number;
        duration: number = 0;
    }

    interface BitmovinPlayerLocation {
        // Location of bitmovinplayer-core.min.js. Path (fixed or relative) plus filename.
        html5?: string;
        // Location of bitmovinplayer-core.min.css. Path (fixed or relative) plus filename.
        css?: string;
        // Location of bitmovinplayer.swf. Path (fixed or relative) plus filename.
        flash?: string;
    }

    interface Bitwrapper {
        /**
         *  Use this parameter (within a "bit-wrapper" object) to specify a custom path for the resources
         * (Bitmovin HTML5, CSS, and Flash files) associated with the bit_wrapper.min.js
         * plugin if they are not stored in the same location as the bit_wrapper.min.js plugin.
         * Whereas the location parameter lets you specify an individual path for
         * each resource file, the locationBaseUrl parameter allows you to specify
         * a single path for all resource files (Bitmovin HTML5, CSS, and Flash files) at once.
         */
        locationBaseUrl?: string;
        /**
         * Use this parameter (within a "bit-wrapper" object) to specify individual,
         * custom paths for Bitmovin HTML5, CSS, and Flash files if any of those resources
         * are stored in a location other than where the bit_wrapper.min.js plugin is stored.
         */
        location?: BitmovinPlayerLocation;
    }

    interface Skin {
        /**
         * The skin parameter references the skin.json config file.
         * This loads the player skin. Use it if you want
         * to use your own skin settings.
         */
        config?: string;
        /**
         * Use this parameter to specify inline skin modifications.
         * skin.inline will overwrite any settings in the skin.json config file.
         * The JSON object within inline must have the same structure as skin.json
         * (all parent objects going all the way back to the root object, as described in
         * the [Player V4 JSON Schema](http://apidocs.ooyala.com/player_v4_skin_config/skin-schema.html)).
         * For example, if you want to overwrite the start screen
         * play button color using inline, you need to include the start
         * screen object, playIconStyle object, and color (as shown in the following example).
         */
        inline?: any;
    }

    interface PageLevelParameters {
        /**
         * The pcode is your account identifier. This is an alphanumeric string that precedes the period in your API key.
         * You can get your pcode from your [API keys](http://help.ooyala.com/video-platform/concepts/api_keys.html).
         * If you do not include your pcode, the player will not load.
         */
        pcode: string;
        /**
         * The player branding ID is a reference to your player. You can get your player branding ID
         * (referred to as the Player ID in Backlot) by going to the MANAGE tab > Embed subtab in Backlot.
         * If you do not include your player branding ID, the player will not load.
         */
        playerBrandingId: string;
        /**
         * Specify the timeout (in seconds) for the loading of the Ad Manager module.
         * The default is 3 seconds.
         * To assist with ad-fill rate issues related to timeout settings,
         * you can increase this value (for example, 4 or 5 seconds,
         * depending on your page setup and load time).
         */
        adManagerLoadTimeout?: number = 3;
        /**
         * Enables the automatic playing of an asset (video or audio) upon loading. This is useful for UIs that
         * do not have play/pause controls or conditions where you want the content to play immediately.
         */
        autoplay?: boolean = false;
        /**
         * Enables (default) or disables the automatic playing of Up Next
         * or Discovery videos after the main video has played.
         */
        autoPlayUpNextVideosOnly?: boolean = true;
        /**
         * One or more predefined filter names for generating a dynamic manifest.
         * See [Dynamic Manifests](http://help.ooyala.com/video-platform/concepts/ingestion_dynamic_manifest.html).
         */
        dynamicFilters?: string;
        /**
         * Use this parameter to define the video encoding priority in a series of encodings separated by commas.
         * The highest priority encoding that is available and can be decoded by the player will be selected.
         * Any encoding that you do not specify will be appended to the end of the array in pseudo-random order.
         */
        encodingPriority?: EncodingPriority[] = [
            'dash_drm',
            'hls_drm',
            'dash',
            'hls',
            'mp4',
            'hds'
        ];
        /**
         * Use this parameter to set the initial minimum bitrate level (immediately after video playback)
         * and to sustain that level for a specific period of time.
         * Once the duration is reached, the bitrate level changes to the video
         * plugin's automatic bitrate level.
         * [InitialBitrate](http://help.ooyala.com/video-platform/api/pbv4_api_embedparams.html#pbv4_api_embedparams__initialBitrate)
         */
        initialBitrate?: InitialBitrate;
        /**
         * Use this parameter to set an initial time in seconds to start playing content at a specific point.
         * This parameter can be used to enable seeking for iOS-based devices.
         */
        initialTime?: number;
        /**
         * Use this parameter to set an initial volume for a video.
         */
        initialVolume?: number;
        /**
         * Use this parameter to specify the initial playback mode for Safari Mobile
         * on iOS devices (iOS 10 and later). By default, playback is initially
         * in full screen mode ("iosPlayMode":"fullscreen" ). You can change this
         * to inline playback (playing videos inline on the page rather than in full screen mode)
         * by specifying "iosPlayMode":"inline" on the web page.
         */
        iosPlayMode?: 'inline' | 'fullscreen';
        bitwrapper?: Bitwrapper;
        /**
         * Use this parameter to enable continuous play. With loop set to true, once the
         * playback has started it continues until the user stops playback or closes
         * the browser. Also the behavior is the same when the ASSET_ID is set using
         * setEmbedCode. As soon as the ASSET_ID is set, if autoplay is true,
         * the playback starts immediately regardless of the previous state of the
         * player (video playing/paused/stopped). If autoplay and loop parameters are
         * not passed in through setEmbedCode,
         * the existing values are used (which may have been set via a previous call to setEmbedCode)
         */
        loop?: boolean = true;
        /**
         * Use this parameter to control audio when a video starts.
         * Behavior can be affected by the autoplay setting:
         * "muteFirstPlay":true causes the video to start muted.
         * "muteFirstPlay":false causes the video to start unmuted.
         * Note: If "autoplay":true and the browser requires muted autoplay,
         * then the video will play muted even if "muteFirstPlay":false.
         * "muteFirstPlay":true and "autoplay":true causes the video to autoplay muted
         */
        muteFirstPlay?: boolean = true;
        /**
         * Use this parameter to listen to an event message and perform an action.
         * This parameter enables you to subscribe to event messages from the
         * message bus before the player is fully created. It allows you to modify
         * the player prior to its complete creation.
         * When called, onCreate: function(player):
         * Checks for any additional modules (custom, 3rd party or other type).
         * Enables these additional modules to connect to the message bus.
         * Sends a message to the message bus signaling each module to start up.
         * You must call onCreate before anything can happen; otherwise, the existing and
         * additional or third-party modules are not connected to the message bus and are not initialized.
         * @param player
         */
        onCreate?(player: Player): void;
        /**
         * This parameter applies only to the bit_wrapper.min.js plugin for DASH and HLS
         * [(bit_wrapper.min.js)](http://help.ooyala.com/video-platform/concepts/pbv4_resources.html#pbv4_resources__bitmovin_plugin).
         *  As of Player v4.13.4, HTML5 playback is used as the default.
         * However, if you prefer to lead with Flash-based playback,
         * you need to add the following page-level parameter to playerParam: {"platform": "flash"}
         */
        platform?: 'html5' | 'flash';
        /**
         * Use this parameter to enable (true)
         * the Ooyala Player control bar during ads
         * (via the new playerControlsOverAds page-level parameter).
         */
        playerControlsOverAds?: boolean = false;
        /**
         * Use this parameter to hide the Playlist plugin
         * but still have it drive the autoplay a sequence
         * of videos. By default, the Playlist plugin is
         * displayed. To hide it, set hideUi to true.
         */
        playlistsPlugin?: {
            hideUi?: boolean = false;
        };
        /**
         * Use this parameter to specify whether to start loading the video after the player is
         * loaded and before the user starts playback (for non-autoplay settings) (true),
         * or to wait until the user starts playback (false, the default). One of the following values:
         * 'preload': false (default)
         * 'preload': true - start preloading the video as soon as the player is loaded. Typically,
         * a video will preload the stream up to filling the buffer, the size of which will vary by browser.
         * Preloading can significantly speed up the time-to-first-frame experience because the
         * video has the opportunity to buffer before the viewer plays it.
         * Considerations:
         * Preloading is disabled if the initialTime parameter is used.
         * When using Google IMA with prerolls, preloading will be triggered at the start of the fourth
         * quartile of the preroll ad or the last ad in a podded preroll. If ads are skipped before
         * the fourth quartile of the ad is played, preloading of content will not occur.
         * Preloading is supported for the main_html5 and bit_wrapper video plugins.
         * Preloading is not yet supported for the Pulse or Freewheel ad managers.
         * Enabling content preloading can increase your overall video stream consumption because,
         * for any given player embed, videos are preloaded even when playback is not initiated.
         */
        preload?: boolean = false;
        /**
         * specify skin overrides
         */
        skin?: Skin;
        /**
         * Specify whether the player uses the first
         * video from the playlist playlist
         */
        setFirstVideoFromPlaylist?: boolean = false;
    }
}
