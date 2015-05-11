(function($) {
  var mouseX = 0,
    mouseY = 0,
  allTips = [];
  $('body').mousemove(
    function(e) {
      mouseX = e.pageX;
      mouseY = e.pageY;
    }
  );
  var defaults = {
    x: null,
    y: null,
    width: null,
    height: null,
    arrowSize: 16,
    padding: 10,
    direction: 'top', // top, right, bottom, left
    centerOn: 'element', // element or mouse
    message: null,
    close: true
  };
  $.fn.tips = function(cmd, options) {
    if (cmd == 'close-all') {
      for (var x in allTips) {
        allTips[x].detach();
      }      
    }
    return this.each(function() {
      var previousOptions,
        $el = $(this);
      if (!cmd || typeof cmd != 'string') {
        new TypeError('jQuery tips command must be a string: attach, detach, open or close.');
      }
      if (options) {
        previousOptions = $el.data('tips-options');
        $el.data('tips-options', $.extend({}, defaults, previousOptions, options));
      }
      switch (cmd) {
        case 'attach':
          attach($el);
          break;
        case 'detach':
          detach($el);
          break;
        case 'open':
          if (!isAttached($el)) {
            attach($el);
          }
          open($el);
          break;
        case 'close':
          close($el);
          break;
      }
    });
  }
  function attach($el) {
    var options = $el.data('tips-options'), 
      $tip = factoryTip(options);
      allTips.push($tip);
      $el.data('tip-tip', $tip);
      $tip.find('.close').click(handleClick);
    $el.addClass('jquery-tips-processed');
  }
  function detach($el) {
    $el.data('tip-tip', null).data('tips-options', null);
    $el.removeClass('jquery-tips-processed');
  }
  function open($el) {
    var arrowSize,
      options = $el.data('tips-options'),
      $tip = $el.data('tip-tip', $tip),
      elWidth = $el.outerWidth(),
      elHeight = $el.outerHeight(),
      offset = $el.offset();
    if (options.centerOn == 'mouse') {
      offset = {top: mouseY, left: mouseX};
      elWidth = elHeight = 0; 
    }
    setTipMessage($tip, options.message);
    $tip.appendTo('body').css({'visibility': 'hidden', 'top': -10000, 'left': -10000});
    options.width = $tip.outerWidth();
    options.height = $tip.outerHeight();     
    switch (options.direction) {
      case 'top':
        options.x = offset.left + ((elWidth / 2) - (options.width / 2));
        options.y = offset.top - options.height - options.arrowSize - options.padding;
        break;
      case 'right': 
        options.x = offset.left +elWidth + options.width + options.arrowSize + options.padding;
        options.y = offset.top + ((elHeight / 2) - (options.height / 2));
        $tip.find('.arrow').css('top', ((options.height / 2) - (arrowSize / 2)));
        break;
      case 'bottom':
        options.x = offset.left + ((elWidth / 2) - (options.width / 2));
        options.y = offset.top + elHeight + options.arrowSize + options.padding;
        break;
      case 'left':
        options.x = offset.left - options.width - options.arrowSize - options.padding;
        options.y = offset.top + ((elHeight / 2) - (options.height / 2));
        $tip.find('.arrow').css('top', ((options.height / 2) - (options.arrowSize / 2)));
        break;
    }
    $tip.css({'visibility': 'visible', 'top': options.y, 'left': options.x});
  }
  function close($el) {
    var $tip = $el.data('tip-tip');
    if ($tip) {
      $tip.detach();
    }
  }
  function isAttached($el) {
    return $el.hasClass('jquery-tips-processed');
  }
  function setTipMessage($tip, message) {
    $tip.find('.content').html(message);
  }
  function handleClick() {
    var $tip = $(this).parent();
    $tip.detach();
    return false;
  }
  function factoryTip(options) {
    var $close, 
      directionMap = {top: 'bottom', bottom: 'top', right: 'left', left: 'right'},
      $wrapper = $('<div/>').addClass('arrow-tip arrow-tip-' + directionMap[options.direction]),
      $content = $('<div/>').addClass('content'),
      $arrow = $('<div/>').addClass('arrow arrow-' + directionMap[options.direction]);
    if (options.close) {
      $close = $('<a/>').addClass('close').text('X').attr('href', '#');
      $wrapper.append($close);
    }
    return $wrapper.append($content).append($arrow);
  }
})(jQuery);
