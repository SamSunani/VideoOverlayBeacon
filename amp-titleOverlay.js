

(function (mediaPlayer) {
    "use strict";

    mediaPlayer.plugin('videoOverlayTool', function (options) {
        var player = this,
            name = !!options && !!options.name ? options.name : '',
            opacity = !!options && !!options.opacity ? options.opacity : 1,
            horizontalPosition = !!options && !!options.horizontalPosition ? options.horizontalPosition : 'left',
            verticalPosition = !!options && !!options.verticalPosition ? options.verticalPosition : 'top',
            contentTitleCssClass = 'amp-video-overlay-tool';

        var Component = mediaPlayer.getComponent('Component');

        function getLogoHorizontalPosition(logoSpan, horizontalPosition) {
            var position = 0, // horizontalPosition === 'left' (or invalid value)
                videoElement = player.el();

            if (horizontalPosition === 'center') {
                position = (videoElement.clientWidth / 2) - (logoSpan.parentElement.clientWidth / 2);
            }

            if (horizontalPosition === 'right') {
                position = videoElement.clientWidth - logoSpan.parentElement.clientWidth - 1;
            }

            return position;
        }

        function getLogoVerticalPosition(logoSpan, verticalPosition) {
            var position = 0, // verticalPosition === 'top' (or invalid value)
                videoElement = player.el(),
                controlBarHeight = player.controlBar.el().clientHeight || 31,
                progressControlHeight = player.controlBar.progressControl.el().clientHeight || 12;

            if (verticalPosition === 'middle') {
                position = (videoElement.clientHeight / 2) - (logoSpan.parentElement.clientHeight / 2) - (controlBarHeight / 2) - (progressControlHeight / 2);
            }

            if (verticalPosition === 'bottom') {
                position = videoElement.clientHeight - logoSpan.parentElement.clientHeight - controlBarHeight - progressControlHeight;
            }

            return position;
        }

        function updateContentTitle() {
            // Fix to Logo position when the video returns from full screen
            player.contentTitle.container.style.right = '0px';
            player.contentTitle.container.style.bottom = '0px';
        }

        // Create Logo
        mediaPlayer.ContentTitle = amp.extend(Component, {
            init: function (player, options) {
                Component.call(this, player, options);
            }
        });

        mediaPlayer.ContentTitle.prototype.createEl = function () {
            var el = Component.prototype.createEl.call(this, 'div', { className: contentTitleCssClass });

            el.style.opacity = opacity;
            el.onload = function() { 
                updateContentTitle(); 
            };
            
            var div = videojs.createEl('div', {});
            div.style.cssText='height: 50px; width: 50px;';
            div.className = "indicator";
            div.onload = function() { 
                updateContentTitle(); 
            };

            el.appendChild(div);       
            this.container = el;

            return el;
        };

        // Main function
        player.ready(function () {
            var contentTitle = new mediaPlayer.ContentTitle(player);

            player.contentTitle = player.addChild(contentTitle);
            
            player.on(mediaPlayer.eventName.fullscreenchange, updateContentTitle);
            player.on("resize", updateContentTitle);
                        
            updateContentTitle();
            
            setTimeout(updateContentTitle, 0);
        });
    });
}(window.amp));
