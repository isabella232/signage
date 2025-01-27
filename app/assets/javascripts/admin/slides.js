/**
 * Setting up the namespace
 */

Admin.Slides = {};

/**
 * Functions specific to slides on the administration views
 */

Admin.Slides.livePreviewAjax = function() {
  if (!Admin.Slides.currently_ajaxing) {
    Admin.Slides.currently_ajaxing  = true;
    
    var $form     = $('#slide_form');
    var form_data = new FormData($('#slide_form')[0]);

    $.ajax({
        url:        $form.data('draft-url'),
        type:       'POST',
        data:        form_data,
        success:     Admin.Slides.livePreviewSuccess,
        error:       Admin.Slides.livePreviewError,
        complete:    Admin.Slides.livePreviewComplete,
        cache:       false,
        contentType: false,
        processData: false
    });
  }
};

Admin.Slides.livePreviewSuccess = function(data) {
  $iframe = $('#slide-live-preview');
  $iframe[0].contentDocument.location.reload(true);
};

Admin.Slides.livePreivewError = function(error) {
  // Should one need to do something here, here it is.
};

Admin.Slides.livePreviewComplete = function(data) {
  Admin.Slides.currently_ajaxing = false;
};

Admin.Slides.inputBlur = function() {
  var current_value = $(this).val();
  var prev_value    = $(this).data('prev-value');

  if (current_value !== prev_value) {
    $(this).data('prev-value', current_value);  
    Admin.Slides.livePreviewAjax();
  }
};

Admin.Slides.initDateTimePickers = function() {
  $('[data-datetimepicker]').datetimepicker({
    format:'MMMM DD, YYYY h:mm a',
    formatTime:'h:mm a',
    formatDate:'DD.MM.YYYY'
  });
};

Admin.Slides.setPreviewOrientation = function() {
  var slidePreview = $(".slide-live-preview");
  var selectedTemplate = $("#slide_template option:selected").val();
  slidePreview.removeClass("vertical horizontal");

  // currently only social feed template can have vertical orientation
  if(selectedTemplate != "social_feed"){
    slidePreview.addClass("horizontal");
  }else{
    var selectedOrientation = $("#slide_orientation option:selected").val();
    slidePreview.addClass(selectedOrientation);
  }
}

Admin.Slides.initShowWhen = function() {
  $('[data-show-when]').each(function(i, val) {
    var $this   = $(this);
    var info    = $(this).data('show-when').split('==');
    var $el     = $(info[0]);
    var pattern = new RegExp(info[1]);

    var listener = function() {
      var val;
      if ($el.prop('type') === 'radio') {
        val = $($el.selector + ':checked').val();
      } else {
        val = $el.val();
      }
      (pattern.test(val)) ? $this.fadeIn(250) : $this.hide();
    };

    $el.on('change', listener);
    listener();
  });
};

Admin.Slides.initLivePreview = function() {
  $(':input').each(function() {
    $(this).data('prev-value', $(this).val());
  });

  $('.live-preview-triggers').on('blur', ':input', Admin.Slides.inputBlur);
  $('.live-preview-triggers').on('change', 'select, :file, :checkbox, :radio', Admin.Slides.livePreviewAjax);
  $('.live-preview-triggers').on('change', Admin.Slides.setPreviewOrientation);
  setTimeout(function() { Admin.Slides.livePreviewAjax(); }, 10);
};

/* Index Page */
var AdminSlides = {};

AdminSlides.refreshList = function(e) {
  var search   = $('#search').val();
  var filter   = $('#filters .active').data('value');
  var sort     = $('#sort .active').data('value');
  var query    = '?search='+search+'&filter='+filter+'&sort='+sort;
  $.get('/slides.js' + encodeURI(query) );
};

AdminSlides.filterClicked = function(e) {
  e.preventDefault();
  $(this).parent().find('a').removeClass('active');
  $(this).addClass('active');
  var filter   = $('#filters .active').data('value');
  var sort     = $('#sort .active').data('value');
  var query    = '?filter='+filter+'&sort='+sort;
  var url      = window.location.pathname + query;
  window.history.replaceState({path:url},'',url);
  AdminSlides.refreshList();
};

AdminSlides.initSlideActionMenus = function() {
  $('.modal-trigger').modal();

  $('html').on('click', function(event) {
    if($(event.target).closest('.slide-list-item').length == 0) {
      $('.js-admin-slide.selected').removeClass('selected');
    }
  });

  $('.js-admin-slide').on('click', function(e) {
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected');
    } else {
      $('.js-admin-slide.selected').removeClass('selected');
      $(this).addClass('selected');
    }
  });
};


/**
 * The code that runs on document.ready
 */

Utils.fireWhenReady(['slides#edit', 'slides#update'], function(e) {
  Admin.Slides.initDateTimePickers();
  Admin.Slides.initShowWhen();
  Admin.Slides.initLivePreview();
  $('.datepicker').pickadate();
});

$(document).on('dynamic_fields_added', function(event, $fields) {
  Admin.Slides.initDateTimePickers();
  $fields.find('select').not('.disabled').material_select();
  $fields.find('.datepicker').pickadate();
});

Utils.fireWhenReady(['slides#index'], function(e) {
  AdminSlides.initSlideActionMenus();
  $('#search').on('keyup', AdminSlides.refreshList);
  $('#filters a, #sort a').on('click', AdminSlides.filterClicked);
});

Utils.fireWhenReady(['slides#show'], function(e) {
  // TODO: Remove when materialize releases autocomplete update or another fix
  $("#add_owner").on("click", AddOwnerMonkeyPatch.onClick);

  $('.modal-trigger').modal();
});