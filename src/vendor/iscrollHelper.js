/**
 * iScroll pull to refresh helper
 */
var IScrollHelper = {
  withPull: function(wrapper, pulldownAction, pullupAction, opts, pullText) {
    var $wrapper;
    if (typeof wrapper === 'string') {
      $wrapper = $(wrapper);
    } else if (typeof wrapper === 'object') {
      $wrapper = wrapper;
    }

    var pulldownRefresh = pullText && pullText['pulldownRefresh'] ? pullText['pulldownRefresh'] : 'Pull down refresh ...',
      pullupLoadingMore = pullText && pullText['pullupLoadingMore'] ? pullText['pullupLoadingMore'] : 'Pull up load more ...',
      releaseToRefresh = pullText && pullText['releaseToRefresh'] ? pullText['releaseToRefresh'] : 'Release to refresh ...',
      releaseToLoading = pullText && pullText['releaseToLoading'] ? pullText['releaseToLoading'] : 'Release to loading ...',
      loading = pullText && pullText['loading'] ? pullText['loading'] : 'Loading ...';

    var $pulldown = $wrapper.find('#pulldown'),
      $pullup = $wrapper.find('#pullup'),
      pullupOffset = 0,
      pulldownOffset = 0;

    if ($pulldown.length > 0) {
      pulldownOffset = $pulldown.outerHeight();
      $pulldown.find('#pulldown-label').html(pulldownRefresh);
    }

    if ($pullup.length > 0) {
      pullupOffset = $pullup.outerHeight();
      $pullup.find('#pullup-label').html(pullupLoadingMore);
    }

    var options = {
      // important! need to modify iScroll to support it.
      scrollbars: false,
      useTransition: false,
      topOffset: pulldownOffset
    };

    $.extend(true, options, opts);

    var scrollObj = new IScroll($wrapper[0], options);

    scrollObj.on('refresh', function() {
      var $pulldown = $wrapper.find('#pulldown'),
        $pullup = $wrapper.find('#pullup');

      if ($pulldown.length > 0 && $pulldown.hasClass('loading')) {
        $pulldown.removeClass();
        $pulldown.find('#pulldown-label').html(pulldownRefresh);
      } else if ($pullup.length > 0) {
        $pullup.find('#pullup-icon').show();
        if ($pullup.hasClass('loading')) {
          $pullup.find('#pullup-icon').show();
          $pullup.removeClass();
          $pullup.find('#pullup-label').html(pullupLoadingMore);
        }
      }
    });

    scrollObj.on('scrollMove', function() {

      if (this.indicator1) {
        this.indicator1.indicatorStyle['transition-duration'] = '0ms';
        this.indicator1.indicatorStyle['opacity'] = '0.8';
      }

      var $pullup = $wrapper.find('#pullup');

      if ($pullup.length > 0 && this.y < this.minScrollY && this.y < (this.maxScrollY ) && !$pullup.hasClass('flip')) {
        $pullup.removeClass().addClass('flip');
        $pullup.find('#pullup-label').html(releaseToLoading);
        this.maxScrollY = this.maxScrollY;
      } else if ($pullup.length > 0 && (this.y > (this.maxScrollY + 5)) && $pullup.hasClass('flip')) {
        $pullup.removeClass();
        $pullup.find('#pullup-label').html(pullupLoadingMore);
        this.maxScrollY = pullupOffset;
      }
    });

    scrollObj.on('scrollEnd', function() {

      if (this.indicator1) {
        this.indicator1.indicatorStyle['transition-duration'] = '350ms';
        this.indicator1.indicatorStyle['opacity'] = '0';
      }

      var $pullup = $wrapper.find('#pullup');
      if ($pullup.length > 0 && $pullup.hasClass('flip')) {
        $pullup.removeClass().addClass('loading');
        $pullup.find('#pullup-label').html(loading);
        if (typeof pullupAction === 'function' && $pullup.parent().length > 0) {
          pullupAction.call(scrollObj);
        }
      }
    });
    return scrollObj;
  }
}
