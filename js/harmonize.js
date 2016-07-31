(function ( $ ) {
  /** plugin to play music or whatever
    * @param {Object} options - specify the title,
    * artist, and length of the song
   **/
  $.fn.harmonize = function(options) {

    this.html('\
      <i class="material-icons play_btn">play_arrow</i>\
      <div class="progress_bar"></div>\
      <div class="info_right">\
        <div class="song_name">'+ options.title +'</div>\
        <div class="artist">'+ options.artist +'</div>\
      </div>\
      <span class="time"></span>\
    ')

    // VARIABLES
    // ---------------------------------------------
    
    var play_btn = this.find('.play_btn');
    var progress_bar = this.find('.progress_bar');
    var time = this.find('.time');
    // create the audio object to be manipulated
    var audio = new Audio(options.src);
    // create an interval to be created when the content is played 
    var interval = null;
    
    // FUNCTIONS
    // ---------------------------------------------

    /** Function to either play or pause the player
      * @param {Boolean} playing - whether or not the player is playing
     **/
    var toggleState = function(playing) {
      play_btn.toggleClass('playing');
      if (playing) {
        // change the icon to pause
        play_btn.html('play_arrow');
        audio.pause();
        resetInterval();
      } else {
        // change the icon back to play
        play_btn.html('pause');
        audio.play();
        // set an interval to update the DOM elements 
        interval = setInterval(function() {
          update();
        }.bind(this), 500)
      }
    }.bind(this);

    /** Function to update the position of the 
     * progress bar and the time text
     **/
    var update = function() {
      // do the width calculation
      var width_per_sec = (this.width() - play_btn.outerWidth()) / audio.duration;
      var width = width_per_sec * audio.currentTime;
      progress_bar.width(width);
      time.html(formatTime(audio.currentTime) + '/' + formatTime(audio.duration));
    }.bind(this)

    // clear the interval so that we aren't calling JS and 
    // updating the DOM unnecessarily
    var resetInterval = function() {
      clearInterval(interval);
    }

    // http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
    var formatTime = function(time) {
      var sec_num = parseInt(time, 10); // don't forget the second param
      var hours   = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
      var seconds = sec_num - (hours * 3600) - (minutes * 60);

      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return minutes+':'+seconds;
    }

    // EVENT LISTENERS
    // ---------------------------------------------
    audio.addEventListener('loadedmetadata', function() {
      console.log(audio.duration);
      update();
    });

    
    // add event listener to the play button
    play_btn.on('click', function(e){
      toggleState(play_btn.hasClass('playing'))
      e.stopPropagation();
    })

    this.on('click', function(e) {
      var x = e.pageX - this.offset().left - play_btn.outerWidth();
      if (x > 0) {
        var new_time = (x / (this.width() - play_btn.outerWidth())) * audio.duration;
        audio.currentTime = Math.round(new_time);
        update();
      }
    }.bind(this))

    // add event listener to the audio element
    audio.addEventListener('ended', resetInterval)    

    // for function chaining
    return this;
    
  };
 
}( jQuery ));
