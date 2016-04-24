/**
 * check if a character is dictionary char.
 * @param  {char}  ch char to check
 * @return {Boolean}    true if it is 'A'-'Z' or 'a'-'z'
 */
function isAlpha(ch) {
  return (ch >= 'A' && ch <= 'z');
}

/**
 * parse lrc time format to second(like 3.34)
 * @param  {String} strTime source lrc-format time
 * @return {Number}         a float number stands for second.
 */
function parseTime(strTime) {
  //souce format: MM:SS.mm
  var src = strTime.split(/\:|\./);
  return parseFloat(src[0]) * 60.0 + parseFloat(src[1]) + parseFloat(src[2]) / 100.0;
}

$(function() {
  /* step1: load lrc into a 'box', where here is a div of '#lrc-box .lyrics' */
  $('#lrc-box .lyrics').load('public/冷暴力.lrc', function() {
    /* step2: get the string and analysis it */
    var data = this.innerHTML.split('\n'); //cut source data into multiple lines

    /* step3-1: divide the header and lyric body, like ti, ar, al and others */
    var header = {
      ti: '', //title
      ar: '', //artiest
      al: '' //album
    }; //header
    var timeLine = [0.0]; //time
    var paragraph = ['^_^']; //words mapping of time above
    for (var i = 0; i < data.length; ++i) {
      if (data[i] !== '') {
        var line = data[i].split(/\[|\]/);
        if (line[1] && isAlpha(line[1].charAt(0))) {
          var pair = line[1].split(/\:/);
          header[pair[0]] = pair[1];
        } else if (line[1]) {
          timeLine.push(parseTime(line[1]));
          paragraph.push(line[2] || '');
        }
      }
    }
    // console.log(header);
    // console.log(timeLine);
    // console.log(paragraph);
    /**
     * And now, we get the information to show
     * total durations => timeLine.length
     * for time from timeLine[i] to timeLine[i + 1], we should
     *   highlight paragraph of paragraph[i].
     * By the way, we add a timing of 'forever' to set the end point.
     */
    timeLine.push(100007); //timing(the 100007th second)

    /**
     * Now, it's time to depend the way of showing the lyrics.
     * We can maintain a queue, for example, with size of 8,
     * and push a string into it each time, also, when the strings
     * in it grow to bigger than 8, we make a popping-up action.
     * It's all thing we may do at this step :)
     */
    /**
     * So, here is step3-2
     */
    /**
     * queue of size MAX, in fact, in order to reduce memory allocate,
     * we will only PUSH elements and remember the HEAD position, but not
     * POP any element ~
     * so we will use (the total array if and only if buffer.length <= MAX)
     *   or (the elements of buffer[buffer.length - 9 : buffer.length - 1]
     *     if and only if buffer.length > MAX)
     */

    var MAX = 8;
    var buffer = [];
    var len = paragraph.length;
    var ps = '';
    for (i = 0; i < len; ++i) {
      ps += '<p pid=' + i + ' style="opacity: 0.4; margin-top: 25px;">' + paragraph[i] + '</p>'
    }
    $('#lrc-box').append(ps);
    for (i = 0; i < len; ++i) {
      $('#lrc-box')
      .find('p[pid = ' + i + ']')
      .delay(timeLine[i] * 1000)
      //.css('opacity', '0')
      .animate({
        opacity: '+=0.6',
        top: '-=18'
      }, 1000, function() {
        /* stuff to do after animation is complete */
        var pid = parseInt(this.getAttribute('pid'));
        $(this)
        .delay((timeLine[pid + 1] - timeLine[pid]) * 1000)
        .animate({
          opacity: '-=0.3'
        }, 1000, function()  {
          var pid = parseInt(this.getAttribute('pid'));
          //console.log(timeLine[pid + 8]);
          $(this)
          .delay(((timeLine[pid + 8] || 100007) - timeLine[pid + 1]) * 1000)
          .slideUp(300);
        });
      });
    }
  });
});